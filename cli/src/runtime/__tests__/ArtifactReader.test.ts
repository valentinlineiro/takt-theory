import { describe, it, expect } from 'vitest';
import { GovernanceEventBus, GovernanceCycleCompletedEvent } from '../audit/GovernanceEvents.js';
import { ExperimentRecorder } from '../audit/ExperimentRecorder.js';
import { ArtifactReader } from '../audit/ArtifactReader.js';

describe('ArtifactReader & Schema Versioning', () => {
  it('parses valid schemaVersion 1 artifact and supports comparative analysis', () => {
    const bus1 = new GovernanceEventBus();
    const recorder1 = new ExperimentRecorder({ experimentId: 'exp-1', title: 'Baseline' }, bus1);

    const bus2 = new GovernanceEventBus();
    const recorder2 = new ExperimentRecorder({ experimentId: 'exp-2', title: 'Treatment' }, bus2);

    const ev1: GovernanceCycleCompletedEvent = {
      type: 'GovernanceCycleCompleted',
      cycleId: 'c1',
      representationId: 'r1',
      uncertainty: 0.05,
      decision: 'ALLOW',
      decisionMargin: 0.10,
      observationCost: 1,
      elapsedTimeMs: 2,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    };

    const ev2: GovernanceCycleCompletedEvent = {
      type: 'GovernanceCycleCompleted',
      cycleId: 'c1',
      representationId: 'r1',
      uncertainty: 0.02,
      decision: 'ALLOW',
      decisionMargin: 0.25,
      observationCost: 1,
      elapsedTimeMs: 2,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    };

    bus1.emit(ev1);
    bus2.emit(ev2);

    const art1 = recorder1.stopAndExport();
    const art2 = recorder2.stopAndExport();

    expect(art1.schemaVersion).toBe(1);
    expect(art2.schemaVersion).toBe(1);

    const reader1 = ArtifactReader.fromJson(JSON.stringify(art1));
    const reader2 = ArtifactReader.fromJson(JSON.stringify(art2));

    const comparison = reader1.compareTo(reader2);
    expect(comparison.marginDelta).toBeCloseTo(0.15);
    expect(comparison.outcomeMatch).toBe(true);
  });

  it('rejects unsupported schema versions', () => {
    const invalidJson = JSON.stringify({ schemaVersion: 99, metadata: {} });
    expect(() => ArtifactReader.fromJson(invalidJson)).toThrow(/Unsupported artifact schema version/);
  });
});
