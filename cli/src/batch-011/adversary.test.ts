import { describe, it, expect } from 'vitest';
import { loadBatch005Cases } from '../batch-005/cases.js';
import { applyAdversaryBatch011 } from './adversary.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';

describe('Batch-011 Adversary Construction', () => {
  it('silences reliability delta by leaf extension', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'WRK-002')!;

    // Construct evaluation D_k
    const D_k = { Df: false, Dr: false, Ds: false, Dc: false, Dm: true };

    const { cdExt, obsCaps } = applyAdversaryBatch011(orig, 0.10);

    // Verify leaf node added
    expect(cdExt.graph.nodes).toContain('t_leaf');

    const snap1 = captureOmegaState(cdExt, obsCaps, 1, D_k);
    const snap2 = captureOmegaState(cdExt, obsCaps, 2, D_k);

    // Verify boundary node t2 has reliability 0.80 at step 1
    expect(snap1.rho['t2']).toBeCloseTo(0.80);
    // Boundary Disjointness Theorem: t2 ceases to be on the boundary at step 2
    expect(snap2.rho['t2']).toBeUndefined();

    const delta = computeDeltaOmega(snap1, snap2);
    // Delta rho is topologically forced to be at least 0.20
    expect(delta.d_rho).toBeCloseTo(0.20);
  });
});
