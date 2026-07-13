import { describe, it, expect } from 'vitest';
import { solveDependencyGraph, DepCase } from './dependency.js';

describe('Dependency Graph Solver', () => {
  it('computes goal, cost, and risk correctly', () => {
    const dep001: DepCase = {
      id: 'DEP-001',
      nodes: ['s', 'v1', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.1, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' }
      ]
    };
    const result = solveDependencyGraph(dep001, ['e1', 'e2']);
    expect(result.g).toBe(12); // 10 + 2 * 1 path
    expect(result.e).toBe(2);
    expect(result.risk).toBeCloseTo(0.1 * 20 * 0.9); // p_v1 * P * 0.90
  });

  it('handles unreachable target', () => {
    const caseData: DepCase = {
      id: 'DEP-UNREACH',
      nodes: ['s', 'v1', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.1, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' }
      ]
    };
    // No active edges
    const result = solveDependencyGraph(caseData, []);
    expect(result.g).toBe(0);
    expect(result.e).toBe(0);
    expect(result.risk).toBe(0);
  });

  it('handles intercepted failure (isolation node blocks all paths)', () => {
    const caseData: DepCase = {
      id: 'DEP-ISO-BLOCK',
      nodes: ['s', 'v1', 'v2', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.2, v2: 0, t: 0 },
      isolationNodes: ['v2'],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 'v2' },
        { id: 'e3', from: 'v2', to: 't' }
      ]
    };
    const result = solveDependencyGraph(caseData, ['e1', 'e2', 'e3']);
    // Expected risk: p_v1 * P * 0.05 = 0.2 * 20 * 0.05 = 0.2
    expect(result.risk).toBeCloseTo(0.2);
  });

  it('handles not intercepted failure (bypass exists)', () => {
    const caseData: DepCase = {
      id: 'DEP-ISO-BYPASS',
      nodes: ['s', 'v1', 'v2', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.2, v2: 0, t: 0 },
      isolationNodes: ['v2'],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 'v2' },
        { id: 'e3', from: 'v2', to: 't' },
        { id: 'e4', from: 'v1', to: 't' }
      ]
    };
    const result = solveDependencyGraph(caseData, ['e1', 'e2', 'e3', 'e4']);
    // Expected risk: p_v1 * P * 0.90 = 0.2 * 20 * 0.90 = 3.6
    expect(result.risk).toBeCloseTo(3.6);
  });

  it('handles multiple disjoint paths', () => {
    const caseData: DepCase = {
      id: 'DEP-DISJOINT',
      nodes: ['s', 'v1', 'v2', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0, v2: 0, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' },
        { id: 'e3', from: 's', to: 'v2' },
        { id: 'e4', from: 'v2', to: 't' }
      ]
    };
    const result = solveDependencyGraph(caseData, ['e1', 'e2', 'e3', 'e4']);
    expect(result.g).toBe(14); // 10 + 2 * 2 paths = 14
    expect(result.e).toBe(4);
    expect(result.risk).toBe(0);
  });
});
