import { describe, it, expect } from 'vitest';
import { countEdgeDisjointPaths, computeClusteringCoefficient, captureOmegaState, computeDeltaOmega } from './omega.js';
import { loadBatch005Cases } from '../batch-005/cases.js';

describe('Batch-010 Omega Metrics', () => {
  it('computes edge-disjoint paths correctly', () => {
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'A', to: 'D' },
    ];
    // Path 1: A -> D
    // Path 2: A -> B -> D
    // Path 3: A -> C -> D
    const paths = countEdgeDisjointPaths(['A', 'B', 'C', 'D'], edges, 'A', 'D');
    expect(paths).toBe(3);
  });

  it('computes clustering coefficient correctly', () => {
    const nodes = ['A', 'B', 'C'];
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ];
    const cc = computeClusteringCoefficient(nodes, edges);
    expect(cc).toBe(1.0); // complete triangle
  });

  it('captures full omega state snapshot', () => {
    const cases = loadBatch005Cases();
    const c = cases.find(caseData => caseData.id === 'WRK-002')!;
    const D_k = { Df: true, Dr: true, Ds: true, Dc: true, Dm: true };
    const snapshot = captureOmegaState(c, c.graph.capabilities, 1, D_k);
    expect(snapshot.k).toBe(1);
    expect(snapshot.dru).toBeDefined();
    expect(snapshot.topology.boundaryCount).toBeGreaterThanOrEqual(0);
    expect(snapshot.topology.degreeStats.mean).toBeGreaterThan(0);
  });
});

describe('Delta Omega Calculations', () => {
  it('computes symmetric differences and L2 norm correctly', () => {
    const snap1 = {
      k: 1,
      observation: { nodes: ['A', 'B'], edges: [], capabilities: {} },
      dru: 1 as const,
      rho: { 'A': 0.8, 'B': 1.0 },
      topology: { boundaryCount: 2, degreeStats: { mean: 0, variance: 0, min: 0, max: 0 }, redundancy: 0, communities: 0 },
      context: { kMax: 2, focalElement: 'A' }
    };
    const snap2 = {
      k: 2,
      observation: { nodes: ['A', 'B', 'C'], edges: [], capabilities: {} },
      dru: 0 as const,
      rho: { 'A': 0.8, 'B': 0.6, 'C': 1.0 },
      topology: { boundaryCount: 3, degreeStats: { mean: 0, variance: 0, min: 0, max: 0 }, redundancy: 0, communities: 0 },
      context: { kMax: 2, focalElement: 'A' }
    };

    const delta = computeDeltaOmega(snap1, snap2);
    expect(delta.d_O).toBe(1); // 'C' is new
    // rho diff key 'B': 1.0 - 0.6 = 0.4. key 'C': 1.0 (assumed in snap1) - 1.0 = 0.0. sqrt(0.4^2) = 0.4
    expect(delta.d_rho).toBeCloseTo(0.4);
    expect(delta.d_DRU).toBe(1);
    expect(delta.d_T.dV).toBe(1);
  });
});
