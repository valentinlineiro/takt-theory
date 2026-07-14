import { describe, it, expect } from 'vitest';
import {
  extractObservableSubgraph,
  computeDecisionSensitivity,
  computeDecisionRelevantUncertainty,
  GlobalGraph,
  CapabilitySignature
} from './estimator.js';

describe('Batch-005 Uncertainty Estimator', () => {
  const blankCapabilities = (): CapabilitySignature => ({
    Pf: false,
    Pr: false,
    Ps: false,
    Pc: false,
    Pm: false
  });

  it('correctly calculates decision sensitivity and uncertainty on simulated graphs', () => {
    // Topología: s -> v1 -> v2 (decoy) -> t
    // Focal element f = 'v1'
    const capabilities: Record<string, CapabilitySignature> = {
      s: blankCapabilities(),
      v1: blankCapabilities(),
      v2: { Pf: true, Pr: false, Ps: false, Pc: false, Pm: false }, // Pf = true
      t: blankCapabilities()
    };

    const S: GlobalGraph = {
      nodes: ['s', 'v1', 'v2', 't'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 'v2' },
        { from: 'v2', to: 't' }
      ],
      capabilities
    };

    // k=1 subgraph around 'v1': contains 's', 'v1', 'v2'.
    // v2 is boundary because its global degree is 2 (v1->v2, v2->t) but local degree is 1 (v1->v2).
    const O_1 = extractObservableSubgraph(S, 'v1', 1);

    // D_k is sensitive to failure propagation
    const D_k_failure = { Df: true, Dr: false, Ds: false, Dc: false, Dm: false };
    const ucert1 = computeDecisionRelevantUncertainty(O_1, 'v1', D_k_failure);
    expect(ucert1).toBe(1); // 1 because v2 is boundary, relevant, and has Pf=true

    // D_k is sensitive only to contention
    const D_k_contention = { Df: false, Dr: false, Ds: false, Dc: true, Dm: false };
    const ucert2 = computeDecisionRelevantUncertainty(O_1, 'v1', D_k_contention);
    expect(ucert2).toBe(0); // 0 because v2 has Pc=false (no overlap)
  });
});
