import { describe, it, expect, beforeEach } from 'vitest';
import { CertifiedRuntimePipeline, type PipelineConfig } from '../../cli/src/runtime/CertifiedRuntimePipeline.js';
import { LeanTraceabilityBridge, type LeanTraceabilityMetadata } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';

describe('CertifiedRuntimePipeline', () => {
  const validMetadata: LeanTraceabilityMetadata = {
    stableContractId: 'GOV-HORIZON-001',
    contractVersion: '1.0.0',
    theoremId: 'Theorem IV.4',
    leanFile: 'TaktFormal/DynamicSafetyContract.lean',
    monographSection: 'Volume IV, Section 4.2',
  };

  const validConfig: PipelineConfig = {
    stableContractId: 'GOV-HORIZON-001',
    contractVersion: '1.0.0',
    minimumMarginThreshold: 2.0,
    maxDriftRate: 0.01,
  };

  beforeEach(() => {
    LeanTraceabilityBridge.clear();
    LeanTraceabilityBridge.register(validMetadata);
  });

  it('should process step cleanly across all 5 layers end-to-end', async () => {
    const pipeline = new CertifiedRuntimePipeline(validConfig);

    const eventPayload = {
      stepIndex: 10,
      concreteStateVector: [1.0, 2.0, 3.0],
      trueDecision: 1,
    };

    const { newState, auditRecord } = await pipeline.processStep(eventPayload);

    expect(newState).toBe('MONITOR_SAFE');
    expect(auditRecord).toBeDefined();
    expect(auditRecord.evaluationId).toBe('eval-GOV-HORIZON-001-1');
    expect(auditRecord.stableContractId).toBe('GOV-HORIZON-001');
    expect(auditRecord.contractVersion).toBe('1.0.0');
    expect(auditRecord.previousState).toBe('MONITOR_SAFE');
    expect(auditRecord.newState).toBe('MONITOR_SAFE');
    expect(auditRecord.transitionReason).toBe('WithinHorizonBoundary');
    expect(auditRecord.evaluationOutcome).toBe('SAFE');
    expect(auditRecord.currentStep).toBe(10);
    expect(auditRecord.cumulativeDrift).toBeCloseTo(0.1);
    expect(auditRecord.horizonBound).toBe(200);

    const logs = pipeline.getAuditLogs();
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(auditRecord);
  });

  it('should transition state machine when horizon is exceeded', async () => {
    const pipeline = new CertifiedRuntimePipeline(validConfig);

    // Horizon is Math.floor(2.0 / 0.01) = 200
    const eventWithin = { stepIndex: 200, concreteStateVector: [1.0] };
    const resWithin = await pipeline.processStep(eventWithin);
    expect(resWithin.newState).toBe('MONITOR_SAFE');

    const eventExceeded = { stepIndex: 201, concreteStateVector: [1.0] };
    const resExceeded = await pipeline.processStep(eventExceeded);

    expect(resExceeded.newState).toBe('RECALIBRATE');
    expect(resExceeded.auditRecord.transitionReason).toBe('HorizonExceeded');
    expect(resExceeded.auditRecord.evaluationOutcome).toBe('RECALIBRATED');
    expect(resExceeded.auditRecord.previousState).toBe('MONITOR_SAFE');

    const logs = pipeline.getAuditLogs();
    expect(logs.length).toBe(2);
  });

  it('should reject initialization when contract version is incompatible', () => {
    const incompatibleConfig: PipelineConfig = {
      ...validConfig,
      contractVersion: '2.0.0',
    };

    expect(() => new CertifiedRuntimePipeline(incompatibleConfig)).toThrow(
      'Incompatible contract version: expected 1.0.0, got 2.0.0'
    );
  });

  it('should reject initialization when contract configuration payload is invalid', () => {
    const invalidConfig = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 'not-a-number',
      maxDriftRate: 0.01,
    } as unknown as PipelineConfig;

    expect(() => new CertifiedRuntimePipeline(invalidConfig)).toThrow(
      'Invalid contract configuration payload'
    );
  });

  it('should reject initialization for unregistered stableContractId', () => {
    const unregisteredConfig: PipelineConfig = {
      ...validConfig,
      stableContractId: 'UNREGISTERED-ID',
    };

    expect(() => new CertifiedRuntimePipeline(unregisteredConfig)).toThrow(
      'Unregistered Lean 4 traceability contract ID: UNREGISTERED-ID'
    );
  });

  it('should reject processStep when event payload schema is invalid', async () => {
    const pipeline = new CertifiedRuntimePipeline(validConfig);

    await expect(pipeline.processStep(null)).rejects.toThrow('Invalid event payload schema');
    await expect(pipeline.processStep({})).rejects.toThrow('Invalid event payload schema');
    await expect(
      pipeline.processStep({ stepIndex: '1', concreteStateVector: [1.0] })
    ).rejects.toThrow('Invalid event payload schema');
    await expect(
      pipeline.processStep({ stepIndex: 1, concreteStateVector: 'not-an-array' })
    ).rejects.toThrow('Invalid event payload schema');
  });
});
