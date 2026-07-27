import { describe, it, expect } from 'vitest';
import { AuditPolicy } from '../../AuditPolicy.js';
import { DynamicMarginEstimator } from '../../DynamicMarginEstimator.js';
import { TrajectoryMonitor } from '../../TrajectoryMonitor.js';
import { buildGameTDS, F004State, F004Action, F004Obs } from '../../../batch-f-004/fixtures.js';
import { createWitnessArtifact } from './witnesses.js';

const tds = buildGameTDS();
const π_adv: (obs: F004Obs[]) => F004Action = () => ({ id: 'push' });
const D_audit: (p: any) => F004Action = (p) => {
  const last = p.states[p.states.length - 1];
  return last.phase === 'degraded' ? { id: 'intervene' } : { id: 'push' };
};

describe('EXP-004: Uncertainty Bound Ablation (C_uncertainty)', () => {
  it('isolates an uncertainty witness where dynamic margin estimation prevents unsafe execution', () => {
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_audit, π_adv, () => []);
    const monitor = new TrajectoryMonitor<F004State, F004Action>();

    monitor.ingest({ state: { id: '1', phase: 'degraded' }, action: { id: 'push' }, timestamp: 0 });

    // Full runtime with DynamicMarginEstimator
    const computedMargin = estimator.estimate(monitor.getPrefix()); // returns margin = 0 (critical)
    const fullDecision = policy.decide(computedMargin, 0.5).action; // INTERVENE

    // Ablated runtime without Uncertainty Bound estimator (assumes static nominal margin = 1.0)
    const ablatedMargin = 1.0;
    const reducedDecision = policy.decide(ablatedMargin, 0.5).action; // MONITOR

    const artifact = createWitnessArtifact(
      'UncertaintyBound',
      { prefix: monitor.getPrefix(), computedMargin, ablatedMargin },
      fullDecision,
      reducedDecision,
      {
        preservedState: true,
        violatedAssumption: 'MD(R) ~ 0 under dynamic margin estimator',
      }
    );

    expect(fullDecision).toBe('INTERVENE');
    expect(reducedDecision).toBe('MONITOR');
    expect(fullDecision).not.toBe(reducedDecision);
    expect(artifact.isWitness).toBe(true);
  });
});
