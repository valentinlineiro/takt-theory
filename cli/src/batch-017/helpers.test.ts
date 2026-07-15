import { describe, it, expect } from 'vitest';
import { getPermutations, computeShortestPath, isReachable } from './helpers.js';
import { loadBatch005Cases } from '../batch-005/cases.js';

describe('Batch-017 Helpers', () => {
  it('generates exactly 120 permutations for 5 elements', () => {
    const list = ['s', 't', 'v3', 'v3_next', 'v3_next_next'];
    const perms = getPermutations(list);
    expect(perms.length).toBe(120);
    expect(new Set(perms.map(p => p.join(','))).size).toBe(120);
  });

  it('computes directed shortest paths on canonical graph', () => {
    const cases = loadBatch005Cases();
    const orig = cases.find(c => c.id === 'DEP-005')!;

    expect(computeShortestPath(orig.graph, 's', 't')).toBe(1);
    expect(computeShortestPath(orig.graph, 's', 'v3_next_next')).toBe(3); // s -> v3 -> v3_next -> v3_next_next
    expect(computeShortestPath(orig.graph, 'v3_next_next', 's')).toBe(99); // no reverse path

    expect(isReachable(orig.graph, 's', 't')).toBe(true);
    expect(isReachable(orig.graph, 'v3_next_next', 's')).toBe(false);
  });
});
