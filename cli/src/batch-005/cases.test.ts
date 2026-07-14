import { describe, it, expect } from 'vitest';
import { loadBatch005Cases, solveCaseOracle } from './cases.js';
import { extractObservableSubgraph, computeDecisionRelevantUncertainty } from './estimator.js';

describe('Batch-005 Cases Matrix', () => {
  it('correctly loads 15 cases and verifies their triplet structure', () => {
    const cases = loadBatch005Cases();
    expect(cases.length).toBe(15);

    // Group by domain
    const depCases = cases.filter(c => c.domain === 'DEP');
    const wrkCases = cases.filter(c => c.domain === 'WRK');
    const resCases = cases.filter(c => c.domain === 'RES');

    expect(depCases.length).toBe(6); // 2 triplets
    expect(wrkCases.length).toBe(6); // 2 triplets
    expect(resCases.length).toBe(3); // 1 triplet

    // Check triplet structure sharing local structure O1
    // Triplet 1: DEP-001, DEP-002, DEP-003
    const dep1 = cases.find(c => c.id === 'DEP-001')!;
    const dep2 = cases.find(c => c.id === 'DEP-002')!;
    const dep3 = cases.find(c => c.id === 'DEP-003')!;

    const o1_dep1 = extractObservableSubgraph(dep1.graph, dep1.focalElement, 1);
    const o1_dep2 = extractObservableSubgraph(dep2.graph, dep2.focalElement, 1);
    const o1_dep3 = extractObservableSubgraph(dep3.graph, dep3.focalElement, 1);

    expect(o1_dep1.nodes.sort()).toEqual(o1_dep2.nodes.sort());
    expect(o1_dep1.nodes.sort()).toEqual(o1_dep3.nodes.sort());

    // Check Case A stops at k=1 (Uncertainty is 0)
    const ucertA = computeDecisionRelevantUncertainty(o1_dep1, dep1.focalElement, dep1.candidates['T1'].sensitivity);
    expect(ucertA).toBe(0);

    // Check Case B and C expand at k=1 (Uncertainty is 1)
    const ucertB = computeDecisionRelevantUncertainty(o1_dep2, dep2.focalElement, dep2.candidates['T1'].sensitivity);
    const ucertC = computeDecisionRelevantUncertainty(o1_dep3, dep3.focalElement, dep3.candidates['T1'].sensitivity);
    expect(ucertB).toBe(1);
    expect(ucertC).toBe(1);
  });
});
