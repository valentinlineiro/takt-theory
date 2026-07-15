import { describe, it, expect } from 'vitest';
import { loadBatch005Cases, evaluateCaseUtility } from '../batch-005/cases.js';
import { applyAdversaryBatch015 } from './adversary.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';
import { computeX1, computeX2 } from '../batch-014/run.js';

describe('Batch-015 Adversary Transposition', () => {
  it('silences all sensors (including X1/X2) and produces regret', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;
    const corrupt = applyAdversaryBatch015(orig, 0.10);

    const D_k = { Df: false, Dr: true, Ds: false, Dc: false, Dm: false };

    // 1. Snapshot capture
    const cleanSnap1 = captureOmegaState(orig, orig.graph.capabilities, 1, D_k);
    const cleanSnap2 = captureOmegaState(orig, orig.graph.capabilities, 2, D_k);
    const cleanDelta = computeDeltaOmega(cleanSnap1, cleanSnap2);

    const corruptSnap1 = captureOmegaState(corrupt, corrupt.graph.capabilities, 1, D_k);
    const corruptSnap2 = captureOmegaState(corrupt, corrupt.graph.capabilities, 2, D_k);
    const corruptDelta = computeDeltaOmega(corruptSnap1, corruptSnap2);

    // 2. Cardinality checks
    expect(corruptSnap1.observation.nodes.length).toBe(cleanSnap1.observation.nodes.length);
    expect(corruptSnap1.observation.edges.length).toBe(cleanSnap1.observation.edges.length);
    expect(corruptSnap2.observation.nodes.length).toBe(cleanSnap2.observation.nodes.length);
    expect(corruptSnap2.observation.edges.length).toBe(cleanSnap2.observation.edges.length);

    // 3. Sensor deviations
    const d_V = Math.abs(corruptDelta.d_T.dV - cleanDelta.d_T.dV);
    const d_E = Math.abs(corruptDelta.d_T.dE - cleanDelta.d_T.dE);
    const d_R = Math.abs(corruptDelta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
    const d_Com = Math.abs(corruptDelta.d_T.dCommunities - cleanDelta.d_T.dCommunities);
    const d_rho = corruptDelta.d_rho;
    const d_caps = corruptDelta.d_caps;

    expect(d_V).toBe(0);
    expect(d_E).toBe(0);
    expect(d_R).toBeCloseTo(0.00);
    expect(d_Com).toBeCloseTo(0.00);
    expect(d_rho).toBeCloseTo(0.00);
    expect(d_caps).toBeCloseTo(0.00);

    // 4. Augmented metrics check
    const subClean1 = extractObservableSubgraph(orig.graph, orig.focalElement, 1);
    const subClean2 = extractObservableSubgraph(orig.graph, orig.focalElement, 2);
    const subCorrupt1 = extractObservableSubgraph(corrupt.graph, corrupt.focalElement, 1);
    const subCorrupt2 = extractObservableSubgraph(corrupt.graph, corrupt.focalElement, 2);

    const cX1_1 = computeX1(subClean1, orig.failures);
    const cX1_2 = computeX1(subClean2, orig.failures);
    const coX1_1 = computeX1(subCorrupt1, corrupt.failures);
    const coX1_2 = computeX1(subCorrupt2, corrupt.failures);

    const cX2_1 = computeX2(subClean1, orig.failures);
    const cX2_2 = computeX2(subClean2, orig.failures);
    const coX2_1 = computeX2(subCorrupt1, corrupt.failures);
    const coX2_2 = computeX2(subCorrupt2, corrupt.failures);

    const d_X1 = Math.abs(Math.abs(coX1_2 - coX1_1) - Math.abs(cX1_2 - cX1_1));
    const d_X2 = Math.abs(Math.abs(coX2_2 - coX2_1) - Math.abs(cX2_2 - cX2_1));

    expect(d_X1).toBeCloseTo(0.00);
    expect(d_X2).toBeCloseTo(0.00);

    // 5. Regret (Loss) verification
    const u_corrupt_T0 = evaluateCaseUtility(corrupt, subCorrupt2, 'T0').utility;
    const u_corrupt_T1 = evaluateCaseUtility(corrupt, subCorrupt2, 'T1').utility;
    expect(u_corrupt_T1).toBeGreaterThan(u_corrupt_T0); // T1 optimal under corruption

    const loss = u_corrupt_T1 - u_corrupt_T0;
    expect(loss).toBeCloseTo(1.00);
  });
});
