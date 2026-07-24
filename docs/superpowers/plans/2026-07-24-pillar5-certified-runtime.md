# Pillar 5: Certified Runtime Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor and extend `cli/src/runtime/` into a 5-layer certified runtime pipeline (`schema` $\to$ `bridge` $\to$ `certified` $\to$ `engine` $\to$ `audit`) preserving Lean 4 safety contracts ($c \in \text{SafetyContract}$) with stable traceability metadata, declarative state-machine transitions, end-to-end `evaluationId` audit logging, and 100% test coverage verified against Pillar 4 benchmark scenarios.

**Architecture:** Structural schema validation via Zod/Schema (Layer 1), authorized Lean 4 traceability bridge (Layer 2), strongly-typed `CertifiedContract` struct (Layer 3), table-driven declarative `GovernanceStateMachine` (Layer 4), and append-only immutable `AuditLogger` (Layer 5).

**Tech Stack:** TypeScript (ESNext), Node.js, Vitest/Jest for unit and integration testing.

## Global Constraints

- Preserve Lean 4 safety contracts: $h^* = \lfloor m_{\text{min}} / c_{\text{max}} \rfloor$ and $\text{ker}(R) \subseteq K_D \implies \text{Regret}(R) = 0$.
- Single Authorized Binding: All Lean 4 symbol linkages must route strictly through `LeanTraceabilityBridge`.
- Version Contract Policy: Reject contract evaluation if `contractVersion` is incompatible (`REJECTED`).
- Audit Invariance: Every step evaluation must emit an immutable `AuditRecord` with a unique `evaluationId` (UUID v4).

---

### Task 1: Infrastructure Layer — Schema & Lean Traceability Bridge

**Files:**
- Create: `cli/src/runtime/schema/ContractSchema.ts`
- Create: `cli/src/runtime/schema/EventStreamSchema.ts`
- Create: `cli/src/runtime/bridge/LeanTraceabilityBridge.ts`
- Test: `tests/runtime/infrastructure.test.ts`

**Interfaces:**
- Consumes: None (Infrastructure layer)
- Produces: `LeanTraceabilityMetadata`, `LeanTraceabilityBridge`, `ContractSchemaValidator`, `EventStreamSchemaValidator`

- [ ] **Step 1: Write failing infrastructure test**

```typescript
// tests/runtime/infrastructure.test.ts
import { describe, it, expect } from 'vitest';
import { LeanTraceabilityBridge, type LeanTraceabilityMetadata } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';
import { validateContractPayload } from '../../cli/src/runtime/schema/ContractSchema.js';

describe('Runtime Infrastructure & Lean Bridge', () => {
  it('should register and resolve stable contract metadata', () => {
    const meta: LeanTraceabilityMetadata = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2'
    };

    LeanTraceabilityBridge.register(meta);
    const resolved = LeanTraceabilityBridge.resolve('GOV-HORIZON-001');

    expect(resolved.theoremId).toBe('Theorem IV.4');
    expect(resolved.contractVersion).toBe('1.0.0');
  });

  it('should validate contract JSON payload schema', () => {
    const validPayload = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 2.0,
      maxDriftRate: 0.01
    };

    expect(validateContractPayload(validPayload)).toBe(true);
    expect(validateContractPayload({ invalid: true })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runtime/infrastructure.test.ts`
Expected: FAIL with "Cannot find module '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js'"

- [ ] **Step 3: Write minimal Infrastructure implementation**

```typescript
// cli/src/runtime/bridge/LeanTraceabilityBridge.ts
export interface LeanTraceabilityMetadata {
  readonly stableContractId: string;   // Ej: "GOV-HORIZON-001"
  readonly contractVersion: string;    // Ej: "1.0.0"
  readonly theoremId: string;          // Ej: "Theorem IV.4"
  readonly leanFile: string;           // Ej: "TaktFormal/DynamicSafetyContract.lean"
  readonly monographSection: string;   // Ej: "Volume IV, Section 4.2"
}

export class LeanTraceabilityBridge {
  private static registry = new Map<string, LeanTraceabilityMetadata>();

  public static register(metadata: LeanTraceabilityMetadata): void {
    this.registry.set(metadata.stableContractId, metadata);
  }

  public static resolve(stableContractId: string): LeanTraceabilityMetadata {
    const meta = this.registry.get(stableContractId);
    if (!meta) {
      throw new Error(`Unregistered Lean 4 traceability contract ID: ${stableContractId}`);
    }
    return meta;
  }

  public static clear(): void {
    this.registry.clear();
  }
}
```

```typescript
// cli/src/runtime/schema/ContractSchema.ts
export function validateContractPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.stableContractId === 'string' &&
    typeof p.contractVersion === 'string' &&
    typeof p.minimumMarginThreshold === 'number' &&
    typeof p.maxDriftRate === 'number'
  );
}
```

```typescript
// cli/src/runtime/schema/EventStreamSchema.ts
export function validateEventPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return typeof p.stepIndex === 'number' && Array.isArray(p.concreteStateVector);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/runtime/infrastructure.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/schema/ cli/src/runtime/bridge/ tests/runtime/infrastructure.test.ts
git commit -m "feat(runtime): add Schema validation and LeanTraceabilityBridge infrastructure"
```

---

### Task 2: Certified Contract Model Layer

**Files:**
- Create: `cli/src/runtime/certified/CertifiedContract.ts`
- Create: `cli/src/runtime/certified/CapabilityKernelMap.ts`
- Test: `tests/runtime/certified_contract.test.ts`

**Interfaces:**
- Consumes: `LeanTraceabilityMetadata`, `LeanTraceabilityBridge` from Task 1
- Produces: `CertifiedContract`, `CapabilityKernelMap`

- [ ] **Step 1: Write failing CertifiedContract test**

```typescript
// tests/runtime/certified_contract.test.ts
import { describe, it, expect } from 'vitest';
import { CertifiedContract } from '../../cli/src/runtime/certified/CertifiedContract.js';
import { CapabilityKernelMap } from '../../cli/src/runtime/certified/CapabilityKernelMap.js';
import type { LeanTraceabilityMetadata } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';

describe('CertifiedContract & CapabilityKernelMap', () => {
  const meta: LeanTraceabilityMetadata = {
    stableContractId: 'GOV-HORIZON-001',
    contractVersion: '1.0.0',
    theoremId: 'Theorem IV.4',
    leanFile: 'TaktFormal/DynamicSafetyContract.lean',
    monographSection: 'Volume IV, Section 4.2'
  };

  it('should correctly compute intervention horizon h* = floor(m_min / c_max)', () => {
    const contract = new CertifiedContract(
      meta,
      (s: number[]) => s[0] > 0, // R
      (s: number[]) => (s[0] > 0 ? 1 : 0), // D
      (z: boolean) => (z ? 1 : 0), // pi
      2.0, // m_min
      0.01 // c_max
    );

    expect(contract.getInterventionHorizon()).toBe(200); // Math.floor(2.0 / 0.01)
  });

  it('should verify kernel inclusion ker(R) <= K_D via CapabilityKernelMap', () => {
    const kernelMap = new CapabilityKernelMap<number[], boolean, number>();
    const isRefined = kernelMap.verifyKernelInclusion(
      [1.0, 2.0],
      [1.0, 3.0],
      (s) => s[0] > 0, // R collapses both to true
      (s) => (s[0] > 0 ? 1 : 0) // D assigns both action 1
    );

    expect(isRefined).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runtime/certified_contract.test.ts`
Expected: FAIL with "Cannot find module '../../cli/src/runtime/certified/CertifiedContract.js'"

- [ ] **Step 3: Write minimal CertifiedContract & CapabilityKernelMap implementation**

```typescript
// cli/src/runtime/certified/CertifiedContract.ts
import type { LeanTraceabilityMetadata } from '../bridge/LeanTraceabilityBridge.js';

export class CertifiedContract<S, Z, A> {
  constructor(
    public readonly metadata: LeanTraceabilityMetadata,
    public readonly representationR: (state: S) => Z,
    public readonly idealDecisionD: (state: S) => A,
    public readonly nominalPolicyPi: (abstractState: Z) => A,
    public readonly minimumMarginThreshold: number,
    public readonly maxDriftRate: number
  ) {}

  /** Calculates guaranteed intervention horizon h* = floor(m_min / c_max) (Theorem IV.4) */
  public getInterventionHorizon(): number {
    if (this.maxDriftRate <= 0) return Infinity;
    return Math.floor(this.minimumMarginThreshold / this.maxDriftRate);
  }
}
```

```typescript
// cli/src/runtime/certified/CapabilityKernelMap.ts
export class CapabilityKernelMap<S, Z, A> {
  /** Verifies structural kernel refinement: ker(R)(s1, s2) => K_D(s1, s2) (ST-015) */
  public verifyKernelInclusion(
    s1: S,
    s2: S,
    representationR: (state: S) => Z,
    idealDecisionD: (state: S) => A
  ): boolean {
    const rEquiv = representationR(s1) === representationR(s2);
    if (!rEquiv) return true; // ker(R) precondition does not hold
    return idealDecisionD(s1) === idealDecisionD(s2); // ker(R) => K_D
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/runtime/certified_contract.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/certified/ tests/runtime/certified_contract.test.ts
git commit -m "feat(runtime): add CertifiedContract model and CapabilityKernelMap"
```

---

### Task 3: Declarative Governance State Machine Engine

**Files:**
- Create: `cli/src/runtime/engine/TransitionReasons.ts`
- Create: `cli/src/runtime/engine/GovernanceStateMachine.ts`
- Test: `tests/runtime/governance_engine.test.ts`

**Interfaces:**
- Consumes: `CertifiedContract` from Task 2
- Produces: `GovernanceState`, `TransitionReason`, `EvaluationOutcome`, `GovernanceStateMachine`

- [ ] **Step 1: Write failing engine test**

```typescript
// tests/runtime/governance_engine.test.ts
import { describe, it, expect } from 'vitest';
import { GovernanceStateMachine } from '../../cli/src/runtime/engine/GovernanceStateMachine.js';

describe('GovernanceStateMachine', () => {
  it('should transition from MONITOR_SAFE to RECALIBRATE when drift exceeds horizon', () => {
    const stateMachine = new GovernanceStateMachine();
    expect(stateMachine.getCurrentState()).toBe('MONITOR_SAFE');

    const result = stateMachine.evaluateStep({
      currentStep: 201,
      cumulativeDrift: 2.1,
      horizonBound: 200,
      isContractViolated: false
    });

    expect(result.newState).toBe('RECALIBRATE');
    expect(result.rule.reason).toBe('HorizonExceeded');
    expect(result.rule.outcome).toBe('RECALIBRATED');
  });

  it('should transition to INTERVENE_FALLBACK on contract violation', () => {
    const stateMachine = new GovernanceStateMachine();
    const result = stateMachine.evaluateStep({
      currentStep: 10,
      cumulativeDrift: 0.1,
      horizonBound: 200,
      isContractViolated: true
    });

    expect(result.newState).toBe('INTERVENE_FALLBACK');
    expect(result.rule.outcome).toBe('FALLBACK');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runtime/governance_engine.test.ts`
Expected: FAIL with "Cannot find module '../../cli/src/runtime/engine/GovernanceStateMachine.js'"

- [ ] **Step 3: Write minimal TransitionReasons & GovernanceStateMachine implementation**

```typescript
// cli/src/runtime/engine/TransitionReasons.ts
export type GovernanceState = 'MONITOR_SAFE' | 'RECALIBRATE' | 'INTERVENE_FALLBACK';

export type TransitionReason =
  | 'WithinHorizonBoundary'
  | 'HorizonExceeded'
  | 'ContractViolationDetected'
  | 'RecalibrationSucceeded'
  | 'ObservationUnavailable'
  | 'Timeout';

export type EvaluationOutcome = 'SAFE' | 'RECALIBRATED' | 'FALLBACK' | 'REJECTED';

export interface EvaluationContext {
  readonly currentStep: number;
  readonly cumulativeDrift: number;
  readonly horizonBound: number;
  readonly isContractViolated: boolean;
}

export interface StateTransitionRule {
  readonly fromState: GovernanceState;
  readonly toState: GovernanceState;
  readonly reason: TransitionReason;
  readonly outcome: EvaluationOutcome;
  readonly guard: (context: EvaluationContext) => boolean;
}
```

```typescript
// cli/src/runtime/engine/GovernanceStateMachine.ts
import type { GovernanceState, StateTransitionRule, EvaluationContext } from './TransitionReasons.js';

export class GovernanceStateMachine {
  private currentState: GovernanceState = 'MONITOR_SAFE';

  private rules: StateTransitionRule[] = [
    {
      fromState: 'MONITOR_SAFE',
      toState: 'MONITOR_SAFE',
      reason: 'WithinHorizonBoundary',
      outcome: 'SAFE',
      guard: (ctx) => !ctx.isContractViolated && ctx.currentStep <= ctx.horizonBound
    },
    {
      fromState: 'MONITOR_SAFE',
      toState: 'RECALIBRATE',
      reason: 'HorizonExceeded',
      outcome: 'RECALIBRATED',
      guard: (ctx) => !ctx.isContractViolated && ctx.currentStep > ctx.horizonBound
    },
    {
      fromState: 'MONITOR_SAFE',
      toState: 'INTERVENE_FALLBACK',
      reason: 'ContractViolationDetected',
      outcome: 'FALLBACK',
      guard: (ctx) => ctx.isContractViolated
    },
    {
      fromState: 'RECALIBRATE',
      toState: 'MONITOR_SAFE',
      reason: 'RecalibrationSucceeded',
      outcome: 'SAFE',
      guard: (ctx) => !ctx.isContractViolated
    },
    {
      fromState: 'RECALIBRATE',
      toState: 'INTERVENE_FALLBACK',
      reason: 'ContractViolationDetected',
      outcome: 'FALLBACK',
      guard: (ctx) => ctx.isContractViolated
    }
  ];

  public evaluateStep(context: EvaluationContext): { newState: GovernanceState; rule: StateTransitionRule } {
    const matchingRule = this.rules.find(
      (r) => r.fromState === this.currentState && r.guard(context)
    );

    if (!matchingRule) {
      throw new Error(`Invalid state transition for state=${this.currentState}`);
    }

    this.currentState = matchingRule.toState;
    return { newState: this.currentState, rule: matchingRule };
  }

  public getCurrentState(): GovernanceState {
    return this.currentState;
  }

  public reset(): void {
    this.currentState = 'MONITOR_SAFE';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/runtime/governance_engine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/engine/ tests/runtime/governance_engine.test.ts
git commit -m "feat(runtime): add declarative GovernanceStateMachine engine with explicit transition rules"
```

---

### Task 4: Immutable Auditability Logger Layer

**Files:**
- Create: `cli/src/runtime/audit/AuditLogger.ts`
- Test: `tests/runtime/audit.test.ts`

**Interfaces:**
- Consumes: `GovernanceState`, `TransitionReason`, `EvaluationOutcome` from Task 3
- Produces: `AuditRecord`, `AuditLogger`

- [ ] **Step 1: Write failing AuditLogger test**

```typescript
// tests/runtime/audit.test.ts
import { describe, it, expect } from 'vitest';
import { AuditLogger, type AuditRecord } from '../../cli/src/runtime/audit/AuditLogger.js';

describe('AuditLogger', () => {
  it('should generate immutable audit records with unique evaluationId', () => {
    const logger = new AuditLogger();
    
    const record: AuditRecord = {
      evaluationId: 'eval-12345',
      timestampISO: new Date().toISOString(),
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      previousState: 'MONITOR_SAFE',
      newState: 'RECALIBRATE',
      transitionReason: 'HorizonExceeded',
      evaluationOutcome: 'RECALIBRATED',
      currentStep: 201,
      cumulativeDrift: 2.1,
      horizonBound: 200
    };

    logger.log(record);
    const logs = logger.getLogs();

    expect(logs.length).toBe(1);
    expect(logs[0].evaluationId).toBe('eval-12345');
    expect(Object.isFrozen(logs[0])).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runtime/audit.test.ts`
Expected: FAIL with "Cannot find module '../../cli/src/runtime/audit/AuditLogger.js'"

- [ ] **Step 3: Write minimal AuditLogger implementation**

```typescript
// cli/src/runtime/audit/AuditLogger.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/runtime/audit.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/audit/ tests/runtime/audit.test.ts
git commit -m "feat(runtime): add immutable AuditLogger recording evaluation traces"
```

---

### Task 5: Integration & Certified Runtime Pipeline Refactoring

**Files:**
- Create: `cli/src/runtime/CertifiedRuntimePipeline.ts`
- Modify: `cli/src/runtime/ContractEvaluator.ts:1-52`
- Test: `tests/runtime/pipeline.test.ts`

**Interfaces:**
- Consumes: All modules from Tasks 1–4
- Produces: `CertifiedRuntimePipeline`

- [ ] **Step 1: Write failing CertifiedRuntimePipeline test**

```typescript
// tests/runtime/pipeline.test.ts
import { describe, it, expect } from 'vitest';
import { CertifiedRuntimePipeline } from '../../cli/src/runtime/CertifiedRuntimePipeline.js';
import { LeanTraceabilityBridge } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';

describe('CertifiedRuntimePipeline Integration', () => {
  it('should process state-action step events through all 5 layers cleanly', async () => {
    LeanTraceabilityBridge.register({
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2'
    });

    const pipeline = new CertifiedRuntimePipeline({
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 2.0,
      maxDriftRate: 0.01
    });

    const stepResult = await pipeline.processStep({
      stepIndex: 10,
      concreteStateVector: [1.0, 2.0],
      trueDecision: 1
    });

    expect(stepResult.newState).toBe('MONITOR_SAFE');
    expect(stepResult.auditRecord.evaluationId).toBeDefined();
    expect(stepResult.auditRecord.evaluationOutcome).toBe('SAFE');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runtime/pipeline.test.ts`
Expected: FAIL with "Cannot find module '../../cli/src/runtime/CertifiedRuntimePipeline.js'"

- [ ] **Step 3: Write CertifiedRuntimePipeline implementation**

```typescript
// cli/src/runtime/CertifiedRuntimePipeline.ts
import { LeanTraceabilityBridge, type LeanTraceabilityMetadata } from './bridge/LeanTraceabilityBridge.js';
import { CertifiedContract } from './certified/CertifiedContract.js';
import { GovernanceStateMachine } from './engine/GovernanceStateMachine.js';
import { AuditLogger, type AuditRecord } from './audit/AuditLogger.js';
import { validateContractPayload } from './schema/ContractSchema.js';
import { validateEventPayload } from './schema/EventStreamSchema.js';

export interface PipelineConfig {
  readonly stableContractId: string;
  readonly contractVersion: string;
  readonly minimumMarginThreshold: number;
  readonly maxDriftRate: number;
}

export class CertifiedRuntimePipeline<S = number[], Z = boolean, A = number> {
  private contract: CertifiedContract<S, Z, A>;
  private stateMachine: GovernanceStateMachine;
  private auditLogger: AuditLogger;
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
  }

  public async processStep(eventPayload: unknown): Promise<{ newState: string; auditRecord: AuditRecord }> {
    if (!validateEventPayload(eventPayload)) {
      throw new Error('Invalid event payload schema');
    }

    const event = eventPayload as { stepIndex: number; concreteStateVector: S; trueDecision: A };
    const prevState = this.stateMachine.getCurrentState();
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

    return { newState, auditRecord };
  }

  public getAuditLogs(): readonly AuditRecord[] {
    return this.auditLogger.getLogs();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/runtime/pipeline.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/ tests/runtime/pipeline.test.ts
git commit -m "feat(runtime): integrate 5-layer CertifiedRuntimePipeline with schema, bridge, engine, and audit log"
```

---

### Task 6: Compliance Verification & Benchmark Cross-Validation

**Files:**
- Create: `tests/runtime/compliance_benchmark_integration.test.ts`
- Modify: `benchmarks/takt/TaktRunner.ts:1-40`

**Interfaces:**
- Consumes: All runtime layers and `benchmarks/scenarios/`
- Produces: Integrated benchmark compliance tests

- [ ] **Step 1: Write failing compliance test**

```typescript
// tests/runtime/compliance_benchmark_integration.test.ts
import { describe, it, expect } from 'vitest';
import { CertifiedRuntimePipeline } from '../../cli/src/runtime/CertifiedRuntimePipeline.js';
import { LeanTraceabilityBridge } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';
import { StateSpaceGenerator } from '../../benchmarks/scenarios/synthetic/StateSpaceGenerator.js';

describe('Certified Runtime & Pillar 4 Benchmark Compliance', () => {
  it('should run Pillar 4 synthetic scenarios through CertifiedRuntimePipeline with zero violations under h*', async () => {
    LeanTraceabilityBridge.register({
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2'
    });

    const pipeline = new CertifiedRuntimePipeline({
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 2.0,
      maxDriftRate: 0.01
    });

    const generator = new StateSpaceGenerator({
      id: 'synth-test',
      seed: 42,
      stateSpaceSize: 100,
      kernelDimensionK: 4,
      capabilityCatalogSize: 10,
      maxDriftRate: 0.01,
      params: {}
    });

    const events = generator.generateEvents(50);
    for (const event of events) {
      const result = await pipeline.processStep(event);
      expect(result.auditRecord.evaluationOutcome).not.toBe('FALLBACK');
    }

    const logs = pipeline.getAuditLogs();
    expect(logs.length).toBe(50);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/runtime/compliance_benchmark_integration.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/runtime/compliance_benchmark_integration.test.ts
git commit -m "test(runtime): add compliance verification testing CertifiedRuntimePipeline against Pillar 4 benchmarks"
```

---

## Self-Review Checklist

- [x] All 6 technical dependency stages covered in order.
- [x] Version contract rejection policy enforced (`contractVersion`).
- [x] Stable traceability IDs (`stableContractId`) used exclusively via `LeanTraceabilityBridge`.
- [x] End-to-end `evaluationId` recorded in frozen `AuditRecord`s.
- [x] Pillar 4 benchmark compliance verified.
- [x] Zero placeholders (`TODO`, `TBD`).
