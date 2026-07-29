import { describe, it, expect } from 'vitest';
import { GovernanceEventBus, GovernanceCycleCompletedEvent } from '../audit/GovernanceEvents.js';
import { ConsoleGovernanceObserver, JsonExperimentObserver } from '../audit/GovernanceObservers.js';

describe('Governance Observability Pipeline', () => {
  it('emits atomic events and decouples observation from interpretation', () => {
    const bus = new GovernanceEventBus();
    const jsonObserver = new JsonExperimentObserver();
    const consoleObserver = new ConsoleGovernanceObserver();

    bus.subscribe(jsonObserver);
    bus.subscribe(consoleObserver);

    const cycleEvent: GovernanceCycleCompletedEvent = {
      type: 'GovernanceCycleCompleted',
      cycleId: 'cycle-001',
      representationId: 'rep-state-v1',
      uncertainty: 0.05,
      decision: 'ALLOW',
      decisionMargin: 0.18,
      observationCost: 1.2,
      elapsedTimeMs: 4,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    };

    bus.emit(cycleEvent);

    const recorded = jsonObserver.getEvents();
    expect(recorded).toHaveLength(1);
    expect(recorded[0]).toEqual(cycleEvent);
    expect(recorded[0].decisionMargin).toBe(0.18);
  });
});
