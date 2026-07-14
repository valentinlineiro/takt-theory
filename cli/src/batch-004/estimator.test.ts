import { describe, it, expect } from 'vitest';
import {
  extractObservableSubgraph,
  computeProxyUncertainty,
  GlobalGraph,
} from './estimator.js';

describe('Observable Subgraph and Uncertainty Estimator', () => {
  it('asserts that for a graph with truncated boundaries at k=1, I_1 = 1, and once fully enclosed at k=2, I_2 = 0', () => {
    // S has nodes: f, v, w
    // Edges: w -> v -> f
    const S: GlobalGraph = {
      nodes: ['f', 'v', 'w'],
      edges: [
        { from: 'v', to: 'f' },
        { from: 'w', to: 'v' },
      ],
    };

    // Extract at k = 1
    const O_1 = extractObservableSubgraph(S, 'f', 1);
    // Nodes in O_1 should be ['f', 'v'] (since v is 1 hop from f, w is 2 hops)
    // Edges in O_1 should be [{ from: 'v', to: 'f' }]
    expect(O_1.nodes).toContain('f');
    expect(O_1.nodes).toContain('v');
    expect(O_1.nodes).not.toContain('w');
    expect(O_1.edges).toHaveLength(1);

    // Compute uncertainty at k = 1
    // v has degree 2 in S, but degree 1 in O_1.
    // So Gamma_1(v) = 1.
    // v is connected to f via directed path v -> f. So Relevant_1(v, f) = true.
    // Therefore, I_1 = 1.
    const I_1 = computeProxyUncertainty(O_1, 'f');
    expect(I_1).toBe(1);

    // Extract at k = 2
    const O_2 = extractObservableSubgraph(S, 'f', 2);
    // Nodes in O_2 should be ['f', 'v', 'w']
    // Edges in O_2 should be both edges
    expect(O_2.nodes).toContain('f');
    expect(O_2.nodes).toContain('v');
    expect(O_2.nodes).toContain('w');
    expect(O_2.edges).toHaveLength(2);

    // Compute uncertainty at k = 2
    // All nodes in O_2 have the same degree in S as in O_2.
    // So all Gamma_2 = 0.
    // Therefore, I_2 = 0.
    const I_2 = computeProxyUncertainty(O_2, 'f');
    expect(I_2).toBe(0);
  });

  it('respects the directed relevance check (boundary node not relevant does not cause uncertainty)', () => {
    // S has nodes: f, u, v, w
    // Edges: f -> u, v -> u, w -> v
    // We start at f.
    // Undirected paths from f:
    // f - u (1 hop)
    // u - v (2 hops)
    // v - w (3 hops)
    const S: GlobalGraph = {
      nodes: ['f', 'u', 'v', 'w'],
      edges: [
        { from: 'f', to: 'u' },
        { from: 'v', to: 'u' },
        { from: 'w', to: 'v' },
      ],
    };

    // Extract at k = 2
    // O_2 should contain f, u, v (w is 3 hops away, so excluded)
    // Edges in O_2 should be: f -> u, v -> u (w -> v excluded because w is not in O_2)
    const O_2 = extractObservableSubgraph(S, 'f', 2);
    expect(O_2.nodes).toContain('f');
    expect(O_2.nodes).toContain('u');
    expect(O_2.nodes).toContain('v');
    expect(O_2.nodes).not.toContain('w');
    expect(O_2.edges).toHaveLength(2);

    // Degrees in S:
    // f: 1 (f->u)
    // u: 2 (f->u, v->u)
    // v: 2 (v->u, w->v)
    // Degrees in O_2:
    // f: 1
    // u: 2
    // v: 1 (w->v is missing)
    // So v has Gamma_2(v) = 1.
    // But is v relevant to f in O_2?
    // Edges in O_2: f -> u, v -> u
    // Directed path from v to f? No.
    // Directed path from f to v? No.
    // So Relevant_2(v, f) = false.
    // Therefore, computeProxyUncertainty should be 0 (since no relevant boundary node).
    const I_2 = computeProxyUncertainty(O_2, 'f');
    expect(I_2).toBe(0);
  });

  it('correctly handles k=0 to contain only the node f', () => {
    const S: GlobalGraph = {
      nodes: ['f', 'v'],
      edges: [{ from: 'f', to: 'v' }],
    };
    const O_0 = extractObservableSubgraph(S, 'f', 0);
    expect(O_0.nodes).toEqual(['f']);
    expect(O_0.edges).toEqual([]);
    expect(O_0.globalDegrees).toEqual({ f: 1 });
  });
});
