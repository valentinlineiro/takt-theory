import { describe, it, expect } from 'vitest';
import { loadBatch005Cases } from '../batch-005/cases.js';
import { createHash } from 'node:crypto';

describe('Batch-014 Fixture Assertions', () => {
  it('strictly validates the frozen baseline topology and hash identity', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;

    // 1. Structure check
    expect(orig.focalElement).toBe('s');
    expect(orig.kMax).toBe(2);
    expect(orig.graph.nodes).toEqual(['s', 'v3', 'v3_next', 'v3_next_next', 't']);

    // 2. Canonical serialization & hash check
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

    // Expected hash frozen in batch-014-fixture-freeze.md
    expect(hash).toBe('33f4419864ac7b16d11c7473a8192a314a8c38b6f3b0e0a4f9570e83353960b5');
  });
});
