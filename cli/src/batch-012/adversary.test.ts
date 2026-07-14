import { describe, it, expect } from 'vitest';
import { loadBatch005Cases, evaluateCaseUtility } from '../batch-005/cases.js';
import { applyAdversaryBatch012 } from './adversary.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';

describe('Batch-012 Adversary Construction', () => {
  it('preserves node and edge cardinalities and produces regret', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;
    const corrupt = applyAdversaryBatch012(orig, 0.10);

    // 1. Cardinality check at k=1
    const O_clean_1 = extractObservableSubgraph(orig.graph, orig.focalElement, 1);
    const O_corrupt_1 = extractObservableSubgraph(corrupt.graph, corrupt.focalElement, 1);
    expect(O_corrupt_1.nodes.length).toBe(O_clean_1.nodes.length);
    expect(O_corrupt_1.edges.length).toBe(O_clean_1.edges.length);

    // 2. Cardinality check at k=2
    const O_clean_2 = extractObservableSubgraph(orig.graph, orig.focalElement, 2);
    const O_corrupt_2 = extractObservableSubgraph(corrupt.graph, corrupt.focalElement, 2);
    expect(O_corrupt_2.nodes.length).toBe(O_clean_2.nodes.length);
    expect(O_corrupt_2.edges.length).toBe(O_clean_2.edges.length);

    // 3. Regret evaluation
    const u_clean_T0 = evaluateCaseUtility(orig, O_clean_2, 'T0').utility;
    const u_clean_T1 = evaluateCaseUtility(orig, O_clean_2, 'T1').utility;
    expect(u_clean_T0).toBeGreaterThan(u_clean_T1); // T0 optimal under clean

    const u_corrupt_T0 = evaluateCaseUtility(corrupt, O_corrupt_2, 'T0').utility;
    const u_corrupt_T1 = evaluateCaseUtility(corrupt, O_corrupt_2, 'T1').utility;
    expect(u_corrupt_T1).toBeGreaterThan(u_corrupt_T0); // T1 optimal under corruption

    const loss = u_corrupt_T1 - u_corrupt_T0;
    expect(loss).toBeCloseTo(13.58);
  });
});
