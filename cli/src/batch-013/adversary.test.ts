import { describe, it, expect } from 'vitest';
import { loadBatch005Cases, evaluateCaseUtility } from '../batch-005/cases.js';
import { applyAdversaryBatch013 } from './adversary.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';

describe('Batch-013 Adversary Construction', () => {
  it('silences all sensors and produces regret', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;
    const corrupt = applyAdversaryBatch013(orig, 0.10);

    const D_k = { Df: false, Dr: true, Ds: false, Dc: false, Dm: false };

    // 1. Snapshot capture
    const cleanSnap1 = captureOmegaState(orig, orig.graph.capabilities, 1, D_k);
    const cleanSnap2 = captureOmegaState(orig, orig.graph.capabilities, 2, D_k);
    const cleanDelta = computeDeltaOmega(cleanSnap1, cleanSnap2);

    const corruptSnap1 = captureOmegaState(corrupt, corrupt.graph.capabilities, 1, D_k);
    const corruptSnap2 = captureOmegaState(corrupt, corrupt.graph.capabilities, 2, D_k);
    const corruptDelta = computeDeltaOmega(corruptSnap1, corruptSnap2);

    // 2. Cardinality sensor check
    expect(corruptSnap1.observation.nodes.length).toBe(cleanSnap1.observation.nodes.length);
    expect(corruptSnap1.observation.edges.length).toBe(cleanSnap1.observation.edges.length);
    expect(corruptSnap2.observation.nodes.length).toBe(cleanSnap2.observation.nodes.length);
    expect(corruptSnap2.observation.edges.length).toBe(cleanSnap2.observation.edges.length);

    // 3. Invariance check for all delta metrics
    const d_V = Math.abs(corruptDelta.d_T.dV - cleanDelta.d_T.dV);
    const d_E = Math.abs(corruptDelta.d_T.dE - cleanDelta.d_T.dE);
    const d_R = Math.abs(corruptDelta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
    const d_Com = Math.abs(corruptDelta.d_T.dCommunities - cleanDelta.d_T.dCommunities);
    const d_rho = corruptDelta.d_rho; // compared to clean which has 0.00
    const d_caps = corruptDelta.d_caps;

    expect(d_V).toBe(0);
    expect(d_E).toBe(0);
    expect(d_R).toBeCloseTo(0.00);
    expect(d_Com).toBeCloseTo(0.00);
    expect(d_rho).toBeCloseTo(0.00);
    expect(d_caps).toBeCloseTo(0.00);

    // 4. Utility regret check
    const u_corrupt_T0 = evaluateCaseUtility(corrupt, corruptSnap2.observation, 'T0').utility;
    const u_corrupt_T1 = evaluateCaseUtility(corrupt, corruptSnap2.observation, 'T1').utility;
    expect(u_corrupt_T1).toBeGreaterThan(u_corrupt_T0); // T1 optimal under corruption

    const loss = u_corrupt_T1 - u_corrupt_T0;
    expect(loss).toBeCloseTo(13.58);
  });
});
