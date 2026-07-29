import { LeanTraceabilityBridge, type LeanTraceabilityMetadata } from './bridge/LeanTraceabilityBridge.js';
import { CertifiedContract } from './certified/CertifiedContract.js';
import { GovernanceStateMachine } from './engine/GovernanceStateMachine.js';
import { AuditLogger, type AuditRecord } from './audit/AuditLogger.js';
import { validateContractPayload } from './schema/ContractSchema.js';
import { validateEventPayload } from './schema/EventStreamSchema.js';

import { GovernanceEventBus } from './audit/GovernanceEvents.js';

export interface PipelineConfig {
  readonly stableContractId: string;
  readonly contractVersion: string;
  readonly minimumMarginThreshold: number;
  readonly maxDriftRate: number;
  readonly eventBus?: GovernanceEventBus;
}

export class CertifiedRuntimePipeline<S = number[], Z = boolean, A = number> {
  private contract: CertifiedContract<S, Z, A>;
  private stateMachine: GovernanceStateMachine;
  private auditLogger: AuditLogger;
  private eventBus?: GovernanceEventBus;
  private evaluationCounter = 0;

  constructor(config: PipelineConfig) {
    if (!validateContractPayload(config)) {
      throw new Error('Invalid contract configuration payload');
    }

    const metadata = LeanTraceabilityBridge.resolve(config.stableContractId);
    if (metadata.contractVersion !== config.contractVersion) {
      throw new Error(`Incompatible contract version: expected ${metadata.contractVersion}, got ${config.contractVersion}`);
    }

    this.contract = new CertifiedContract(
      metadata,
      (s: S) => true as unknown as Z,
      (s: S) => 1 as unknown as A,
      (z: Z) => 1 as unknown as A,
      config.minimumMarginThreshold,
      config.maxDriftRate
    );

    this.stateMachine = new GovernanceStateMachine();
    this.auditLogger = new AuditLogger();
    this.eventBus = config.eventBus;
  }

  public async processStep(eventPayload: unknown): Promise<{ newState: string; auditRecord: AuditRecord }> {
    if (!validateEventPayload(eventPayload)) {
      throw new Error('Invalid event payload schema');
    }

    const event = eventPayload as { stepIndex: number; concreteStateVector: S; trueDecision: A };
    const horizon = this.contract.getInterventionHorizon();
    
    // Evaluate transition
    const evalContext = {
      currentStep: event.stepIndex,
      cumulativeDrift: event.stepIndex * this.contract.maxDriftRate,
      horizonBound: horizon,
      isContractViolated: false
    };

    const previousState = this.stateMachine.getCurrentState();
    const { newState, rule } = this.stateMachine.evaluateStep(evalContext);

    this.evaluationCounter++;
    const auditRecord: AuditRecord = {
      evaluationId: `eval-${this.contract.metadata.stableContractId}-${this.evaluationCounter}`,
      timestampISO: new Date().toISOString(),
      stableContractId: this.contract.metadata.stableContractId,
      contractVersion: this.contract.metadata.contractVersion,
      previousState,
      newState,
      transitionReason: rule.reason,
      evaluationOutcome: rule.outcome,
      currentStep: event.stepIndex,
      cumulativeDrift: evalContext.cumulativeDrift,
      horizonBound: horizon
    };

    this.auditLogger.log(auditRecord);

    if (this.eventBus) {
      const margin = this.contract.minimumMarginThreshold - evalContext.cumulativeDrift;
      const outcome = rule.outcome === 'SAFE' ? 'PASS' : rule.outcome === 'FALLBACK' ? 'VIOLATION' : 'DEGRADED';
      this.eventBus.emit({
        type: 'GovernanceCycleCompleted',
        cycleId: auditRecord.evaluationId,
        representationId: this.contract.metadata.stableContractId,
        uncertainty: evalContext.cumulativeDrift,
        decision: String(event.trueDecision),
        decisionMargin: Math.max(0, margin),
        observationCost: 1.0,
        elapsedTimeMs: 1,
        outcome,
        timestampISO: auditRecord.timestampISO
      });
    }

    return { newState, auditRecord };
  }

  public getAuditLogs(): readonly AuditRecord[] {
    return this.auditLogger.getLogs();
  }
}
