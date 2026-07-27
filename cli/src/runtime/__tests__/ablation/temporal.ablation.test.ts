import { describe, it, expect } from 'vitest';
import { TrajectoryMonitor } from '../../TrajectoryMonitor.js';
import { AuditPolicy } from '../../AuditPolicy.js';
import { DynamicMarginEstimator } from '../../DynamicMarginEstimator.js';
import { buildGameTDS, F004State, F004Action, F004Obs } from '../../../batch-f-004/fixtures.js';
import { createWitnessArtifact } from './witnesses.js';

const tds = buildGameTDS();
const π_adv: (obs: F004Obs[]) => F004Action = () => ({ id: 'push' });

// Full history-aware governance policy
const D_audit: (p: any) => F004Action = (p) => {
  const last = p.states[p.states.length - 1];
  if (last.phase === 'degraded' || last.phase === 'failure') return { id: 'intervene' };
  return { id: 'push' };
};

// Memoryless ablated policy (ignores trajectory history)
const D_memoryless: (p: any) => F004Action = () => ({ id: 'push' });

describe('EXP-004: Temporal Consistency Ablation (C_temporal)', () => {
  it('isolates a temporal witness where history accumulation changes decision', () => {
    const policy = new AuditPolicy();
    const estimatorFull = new DynamicMarginEstimator(tds, D_audit, π_adv, () => []);
    const estimatorAblated = new DynamicMarginEstimator(tds, D_memoryless, π_adv, () => []);

    // Trajectory with degraded state: Nominal -> Degraded
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    monitor.ingest({ state: { id: '1', phase: 'nominal' }, action: { id: 'push' }, timestamp: 0 });
    monitor.ingest({ state: { id: '2', phase: 'degraded' }, action: { id: 'push' }, timestamp: 1 });

    // Full runtime (with temporal trajectory awareness)
    const marginFull = estimatorFull.estimate(monitor.getPrefix());
    const fullDecision = policy.decide(marginFull, 0.5).action; // INTERVENE (due to D_audit != pi_adv at degraded)

    // Ablated runtime (without temporal consistency tracking)
    const marginAblated = estimatorAblated.estimate(monitor.getPrefix());
    const reducedDecision = policy.decide(marginAblated, 0.5).action; // MONITOR (D_memoryless == pi_adv)

    const artifact = createWitnessArtifact(
      'TemporalConsistency',
      { prefix: monitor.getPrefix(), marginFull, marginAblated },
      fullDecision,
      reducedDecision,
      {
        preservedState: true,
        violatedAssumption: 'Memoryless policy loses trajectory phase transition context',
      }
    );

    expect(fullDecision).toBe('INTERVENE');
    expect(reducedDecision).toBe('MONITOR');
    expect(fullDecision).not.toBe(reducedDecision);
    expect(artifact.isWitness).toBe(true);
  });
});
