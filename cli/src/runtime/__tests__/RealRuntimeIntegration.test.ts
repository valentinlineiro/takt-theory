import { describe, it, expect } from 'vitest';
import { CertifiedRuntimePipeline } from '../CertifiedRuntimePipeline.js';
import { GovernanceEventBus } from '../audit/GovernanceEvents.js';
import { ExperimentRecorder } from '../audit/ExperimentRecorder.js';
import { ArtifactReader } from '../audit/ArtifactReader.js';
import { LeanTraceabilityBridge } from '../bridge/LeanTraceabilityBridge.js';

describe('CertifiedRuntimePipeline Event Bus Integration', () => {
  it('automatically captures real runtime steps into ExperimentArtifact via GovernanceEventBus', async () => {
    const bus = new GovernanceEventBus();
    const recorder = new ExperimentRecorder(
      { experimentId: 'real-runtime-exp-001', title: 'Live Certified Runtime Pipeline Run' },
      bus
    );

    LeanTraceabilityBridge.register({
      stableContractId: 'STABLE_CONTRACT_001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2'
    });

    const pipeline = new CertifiedRuntimePipeline({
      stableContractId: 'STABLE_CONTRACT_001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 0.50,
      maxDriftRate: 0.05,
      eventBus: bus
    });

    // Process real steps through runtime
    await pipeline.processStep({ stepIndex: 1, concreteStateVector: [0.1, 0.2], trueDecision: 1 });
    await pipeline.processStep({ stepIndex: 2, concreteStateVector: [0.1, 0.3], trueDecision: 1 });
    await pipeline.processStep({ stepIndex: 3, concreteStateVector: [0.1, 0.4], trueDecision: 1 });

    const rawArtifact = recorder.stopAndExport();
    const reader = ArtifactReader.fromJson(JSON.stringify(rawArtifact));

    expect(reader.getSummary().totalCycles).toBe(3);
    expect(reader.getSummary().passCount).toBe(3);
    expect(reader.getEvents()[0].representationId).toBe('STABLE_CONTRACT_001');
    expect(reader.getEvents()[2].uncertainty).toBeCloseTo(0.15);
  });
});
