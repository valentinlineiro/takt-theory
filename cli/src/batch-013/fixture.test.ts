import { describe, it, expect } from 'vitest';
import { loadBatch005Cases } from '../batch-005/cases.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';
import { createHash } from 'node:crypto';

describe('Batch-013 Fixture Assertions', () => {
  it('strictly validates the frozen baseline topology and hash', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;

    // 1. Structure check
    expect(orig.focalElement).toBe('s');
    expect(orig.kMax).toBe(2);
    expect(orig.graph.nodes).toEqual(['s', 'v3', 'v3_next', 'v3_next_next', 't']);

    // 2. Canonical serialization & hash check
    // Sort edges deterministically for comparison
    const sortedEdges = orig.graph.edges.map(e => ({ from: e.from, to: e.to }))
      .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
    const sortedNodes = [...orig.graph.nodes].sort((a, b) => a.localeCompare(b));

    const serialObj = {
      id: orig.id,
      focalElement: orig.focalElement,
      kMax: orig.kMax,
      nodes: sortedNodes,
      edges: sortedEdges,
    };

    const canonicalJson = JSON.stringify(serialObj);
    const hash = createHash('sha256').update(canonicalJson).digest('hex');

    // Expected hash frozen in batch-013-fixture-freeze.md
    expect(hash).toBe('33f4419864ac7b16d11c7473a8192a314a8c38b6f3b0e0a4f9570e83353960b5');

    // 3. Baseline transitions check
    const D_k = { Df: false, Dr: true, Ds: false, Dc: false, Dm: false };
    const snap1 = captureOmegaState(orig, orig.graph.capabilities, 1, D_k);
    const snap2 = captureOmegaState(orig, orig.graph.capabilities, 2, D_k);

    expect(snap1.observation.nodes.length).toBe(3); // s, t, v3
    expect(snap1.observation.edges.length).toBe(3); // s->t, s->v3, v3->t
    expect(snap2.observation.nodes.length).toBe(5); // all nodes
    expect(snap2.observation.edges.length).toBe(6); // all edges

    const delta = computeDeltaOmega(snap1, snap2);

    expect(delta.d_T.dV).toBe(2);
    expect(delta.d_T.dE).toBe(3);
    expect(delta.d_T.dRedundancy).toBeCloseTo(2.00);
    expect(delta.d_T.dCommunities).toBeCloseTo(0.67, 1);
  });
});
