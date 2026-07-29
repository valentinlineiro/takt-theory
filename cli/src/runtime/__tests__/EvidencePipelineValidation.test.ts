import { describe, it, expect } from 'vitest';
import { CertifiedRuntimePipeline } from '../CertifiedRuntimePipeline.js';
import { GovernanceEventBus, GovernanceCycleCompletedEvent } from '../audit/GovernanceEvents.js';
import { ExperimentRecorder, ExperimentArtifact } from '../audit/ExperimentRecorder.js';
import { ArtifactReader } from '../audit/ArtifactReader.js';

describe('End-to-End Scientific Evidence Pipeline Validation', () => {
  it('answers governance and performance questions purely via ExperimentArtifact and ArtifactReader', async () => {
    // 1. Setup two execution runs (Baseline vs Degraded Drift Scenario)
    const busBaseline = new GovernanceEventBus();
    const recorderBaseline = new ExperimentRecorder(
      { experimentId: 'exp-baseline', title: 'Baseline Execution' },
      busBaseline
    );

    const busTreatment = new GovernanceEventBus();
    const recorderTreatment = new ExperimentRecorder(
      { experimentId: 'exp-treatment', title: 'High Uncertainty / Drift Execution' },
      busTreatment
    );

    // 2. Simulate baseline events
    busBaseline.emit({
      type: 'GovernanceCycleCompleted',
      cycleId: 'c1',
      representationId: 'rep-v1',
      uncertainty: 0.01,
      decision: 'ALLOW',
      decisionMargin: 0.35,
      observationCost: 1.0,
      elapsedTimeMs: 2,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    });

    busBaseline.emit({
      type: 'GovernanceCycleCompleted',
      cycleId: 'c2',
      representationId: 'rep-v1',
      uncertainty: 0.02,
      decision: 'ALLOW',
      decisionMargin: 0.32,
      observationCost: 1.0,
      elapsedTimeMs: 2,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    });

    // 3. Simulate treatment events (drifting)
    busTreatment.emit({
      type: 'GovernanceCycleCompleted',
      cycleId: 'c1',
      representationId: 'rep-v1',
      uncertainty: 0.05,
      decision: 'ALLOW',
      decisionMargin: 0.20,
      observationCost: 1.5,
      elapsedTimeMs: 4,
      outcome: 'PASS',
      timestampISO: new Date().toISOString()
    });

    busTreatment.emit({
      type: 'GovernanceCycleCompleted',
      cycleId: 'c2',
      representationId: 'rep-v1',
      uncertainty: 0.25,
      decision: 'DENY',
      decisionMargin: 0.02,
      observationCost: 2.0,
      elapsedTimeMs: 5,
      outcome: 'DEGRADED',
      timestampISO: new Date().toISOString()
    });

    // Export artifacts (no more access to bus or runtime execution after this point)
    const rawArtifactBaseline: ExperimentArtifact = recorderBaseline.stopAndExport();
    const rawArtifactTreatment: ExperimentArtifact = recorderTreatment.stopAndExport();

    const jsonStringBaseline = JSON.stringify(rawArtifactBaseline);
    const jsonStringTreatment = JSON.stringify(rawArtifactTreatment);

    // 4. Black-box Analysis via ArtifactReader ONLY
    const readerBaseline = ArtifactReader.fromJson(jsonStringBaseline);
    const readerTreatment = ArtifactReader.fromJson(jsonStringTreatment);

    // Question 1: What was the safety verdict and degradation rate of each experiment?
    expect(readerBaseline.getSummary().passCount).toBe(2);
    expect(readerBaseline.getSummary().degradedCount).toBe(0);

    expect(readerTreatment.getSummary().passCount).toBe(1);
    expect(readerTreatment.getSummary().degradedCount).toBe(1);

    // Question 2: How much did the average decision margin degrade under treatment?
    const comparison = readerBaseline.compareTo(readerTreatment);
    expect(comparison.marginDelta).toBeLessThan(0); // Margin degraded
    expect(comparison.outcomeMatch).toBe(false); // Outcome distributions differ

    // Question 3: Can we audit the complete trajectory sequence purely from the reader?
    const treatmentEvents = readerTreatment.getEvents();
    expect(treatmentEvents).toHaveLength(2);
    expect(treatmentEvents[1].type).toBe('GovernanceCycleCompleted');
    if (treatmentEvents[1].type === 'GovernanceCycleCompleted') {
      expect(treatmentEvents[1].decision).toBe('DENY');
      expect(treatmentEvents[1].outcome).toBe('DEGRADED');
    }
  });
});
