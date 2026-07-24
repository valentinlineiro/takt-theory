import type { GovernanceState, TransitionReason, EvaluationOutcome } from '../engine/TransitionReasons.js';

export interface AuditRecord {
  readonly evaluationId: string;       // Unique trace ID
  readonly timestampISO: string;
  readonly stableContractId: string;
  readonly contractVersion: string;
  readonly previousState: GovernanceState;
  readonly newState: GovernanceState;
  readonly transitionReason: TransitionReason;
  readonly evaluationOutcome: EvaluationOutcome;
  readonly currentStep: number;
  readonly cumulativeDrift: number;
  readonly horizonBound: number;
}

export class AuditLogger {
  private logs: AuditRecord[] = [];

  public log(record: AuditRecord): void {
    this.logs.push(Object.freeze({ ...record }));
  }

  public getLogs(): readonly AuditRecord[] {
    return this.logs;
  }

  public clear(): void {
    this.logs = [];
  }
}
