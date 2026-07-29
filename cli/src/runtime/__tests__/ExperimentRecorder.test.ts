import { describe, it, expect } from 'vitest';
import { GovernanceEventBus, GovernanceCycleCompletedEvent } from '../audit/GovernanceEvents.js';
import { ExperimentRecorder } from '../audit/ExperimentRecorder.js';

describe('ExperimentRecorder Pipeline', () => {
  it('records immutable events and generates a canonical experiment artifact', () => {
    const bus = new GovernanceEventBus();

    // Verify immutability by attempting to mutate in an observer
    bus.subscribe({
      onEvent(event) {
        expect(Object.isFrozen(event)).toBe(true);
      }
    });

    const recorder = new ExperimentRecorder(
      {
        experimentId: 'exp-test-001',
        title: 'Validation Run for Observability Layer'
      },
      bus
    );

    const event1: GovernanceCycleCompletedEvent = {
      type: 'GovernanceCycleCompleted',
      cycleId: 'c1',
      representationId: 'r1',
      uncertainty: 0.02,
      decision: 'ALLOW',
      decisionMargin: 0.20,
      observationCost: 1.0,
      elapsedTimeMs: 2,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    };

    const event2: GovernanceCycleCompletedEvent = {
      type: 'GovernanceCycleCompleted',
      cycleId: 'c2',
      representationId: 'r1',
      uncertainty: 0.15,
      decision: 'DENY',
      decisionMargin: 0.05,
      observationCost: 1.0,
      elapsedTimeMs: 3,
      outcome: 'DEGRADED',
      timestampISO: new Date().toISOString()
    };

    bus.emit(event1);
    bus.emit(event2);

    const artifact = recorder.stopAndExport();

    expect(artifact.metadata.experimentId).toBe('exp-test-001');
    expect(artifact.summary.totalCycles).toBe(2);
    expect(artifact.summary.passCount).toBe(1);
    expect(artifact.summary.degradedCount).toBe(1);
    expect(artifact.summary.averageDecisionMargin).toBeCloseTo(0.125);
    expect(artifact.events).toHaveLength(2);
  });
});
