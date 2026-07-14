import { describe, it, expect } from 'vitest';
import {
  runBaselineLocal,
  runBaselineGlobal,
  runBaselineAdaptive,
  CaseData,
} from './baselines.js';
import { GlobalGraph } from './estimator.js';

describe('Baselines execution models', () => {
  // Mock evaluateUtility function:
  // On O_1, T_local has utility 10, T_global has utility 5.
  // On S, T_local has utility 8, T_global has utility 12.
  const mockEvaluateUtility = (subgraph: any, intervention: string): number => {
    // If the subgraph has fewer nodes than the global graph, it's local (e.g. O_1).
    const isLocal = subgraph.nodes.length < 3;
    if (isLocal) {
      return intervention === 'T_local' ? 10 : 5;
    } else {
      return intervention === 'T_local' ? 8 : 12;
    }
  };

  // Mock Case 1: resolves at k=1 (very small graph, no uncertainty)
  // f -> v. k=1 includes both nodes, so no truncated boundaries. I_1 = 0.
  const caseResolvedK1: CaseData = {
    id: 'MOCK-001',
    systemType: 'dependency',
    focalNode: 'f',
    globalGraph: {
      nodes: ['f', 'v'],
      edges: [{ from: 'f', to: 'v' }],
    },
    candidateInterventions: ['T_local', 'T_global'],
    evaluateUtility: mockEvaluateUtility,
  };

  // Mock Case 2: resolves at k=2 (w -> v -> f).
  // At k=1, O_1 has boundary node v with globalDeg=2 > localDeg=1. I_1 = 1.
  // At k=2, O_2 has all nodes. I_2 = 0.
  const caseResolvedK2: CaseData = {
    id: 'MOCK-002',
    systemType: 'dependency',
    focalNode: 'f',
    globalGraph: {
      nodes: ['f', 'v', 'w'],
      edges: [
        { from: 'v', to: 'f' },
        { from: 'w', to: 'v' },
      ],
    },
    candidateInterventions: ['T_local', 'T_global'],
    evaluateUtility: mockEvaluateUtility,
  };

  it('runs runBaselineLocal and returns the optimal intervention at k=1', () => {
    // For caseResolvedK1, k=1 has all nodes (2 nodes). Local decision is T_local? Wait, the evaluator returns 10 for T_local and 5 for T_global because local (nodes < 3) is true.
    const res1 = runBaselineLocal(caseResolvedK1);
    expect(res1).toBe('T_local');

    // For caseResolvedK2, k=1 only has 'f' and 'v' (2 nodes). Evaluator sees < 3 nodes, so returns T_local.
    const res2 = runBaselineLocal(caseResolvedK2);
    expect(res2).toBe('T_local');
  });

  it('runs runBaselineGlobal and returns the optimal intervention on the global graph', () => {
    // For caseResolvedK1, global graph has 2 nodes (< 3), so global optimal is T_local.
    const res1 = runBaselineGlobal(caseResolvedK1);
    expect(res1).toBe('T_local');

    // For caseResolvedK2, global graph has 3 nodes (not < 3), so global optimal is T_global.
    const res2 = runBaselineGlobal(caseResolvedK2);
    expect(res2).toBe('T_global');
  });

  it('runs runBaselineAdaptive and resolves early at k=1 when uncertainty is 0', () => {
    // For caseResolvedK1, I_1 is 0. So it resolves at k=1.
    // Result should choose local optimal on O_1 which is T_local.
    const res = runBaselineAdaptive(caseResolvedK1, 2);
    expect(res.intervention).toBe('T_local');
    expect(res.kActual).toBe(1);
    expect(res.finishedUcert).toBe(0);
  });

  it('runs runBaselineAdaptive and resolves at k=2 when I_1 = 1 and I_2 = 0', () => {
    // For caseResolvedK2:
    // k=1: O_1 has I_1 = 1.
    // k=2: O_2 has I_2 = 0.
    // So it stops at k=2 and returns local decision on O_2 (which has 3 nodes, so optimal is T_global).
    const res = runBaselineAdaptive(caseResolvedK2, 2);
    expect(res.intervention).toBe('T_global');
    expect(res.kActual).toBe(2);
    expect(res.finishedUcert).toBe(0);
  });

  it('runs runBaselineAdaptive and escalates to global decision when kMax is reached but uncertainty is still 1', () => {
    // For caseResolvedK2 with kMax = 1:
    // k=1: O_1 has I_1 = 1. Since k = kMax = 1, it must escalate.
    // Escalation returns global optimal which is T_global.
    const res = runBaselineAdaptive(caseResolvedK2, 1);
    expect(res.intervention).toBe('T_global');
    expect(res.kActual).toBe(1);
    expect(res.finishedUcert).toBe(1);
  });
});
