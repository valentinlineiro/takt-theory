import { CaseData } from '../batch-005/cases.js';
import { extractObservableSubgraph, computeDecisionRelevantUncertainty } from '../batch-005/estimator.js';
import type { CapabilitySignature, DecisionSensitivity, ObservableSubgraph } from '../batch-005/estimator.js';

export interface TopologyMetrics {
  boundaryCount: number;
  degreeStats: {
    mean: number;
    variance: number;
    min: number;
    max: number;
  };
  redundancy: number; // Average disjoint paths from focal node to boundary nodes
  communities: number; // Average clustering coefficient
}

export interface OmegaSnapshot {
  k: number;
  observation: {
    nodes: string[];
    edges: { from: string; to: string }[];
    capabilities: Record<string, CapabilitySignature>;
  };
  dru: 0 | 1;
  rho: Record<string, number>;
  topology: TopologyMetrics;
  context: {
    kMax: number;
    focalElement: string;
  };
}

export function countEdgeDisjointPaths(
  nodes: string[],
  edges: { from: string; to: string }[],
  source: string,
  sink: string
): number {
  if (source === sink) return 0;
  
  // Simple Ford-Fulkerson implementation for unit capacity edges
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from); // Undirected disjoint paths
  }

  let flow = 0;
  const edgeFlow = new Map<string, number>();

  while (true) {
    const parent = new Map<string, { prev: string; forward: boolean }>();
    const queue: string[] = [source];
    let found = false;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === sink) {
        found = true;
        break;
      }

      const neighbors = adj.get(curr) ?? [];
      for (const next of neighbors) {
        if (parent.has(next)) continue;

        // Try forward edge capacity = 1
        const keyF = `${curr}->${next}`;
        const keyB = `${next}->${curr}`;
        const fFlow = edgeFlow.get(keyF) ?? 0;
        const bFlow = edgeFlow.get(keyB) ?? 0;

        if (fFlow < 1) {
          parent.set(next, { prev: curr, forward: true });
          queue.push(next);
        } else if (bFlow > 0) { // residual backward flow
          parent.set(next, { prev: curr, forward: false });
          queue.push(next);
        }
      }
    }

    if (!found) break;

    // Augment path
    let curr = sink;
    while (curr !== source) {
      const p = parent.get(curr)!;
      const keyF = `${p.prev}->${curr}`;
      const keyB = `${curr}->${p.prev}`;
      if (p.forward) {
        edgeFlow.set(keyF, (edgeFlow.get(keyF) ?? 0) + 1);
        edgeFlow.set(keyB, (edgeFlow.get(keyB) ?? 0) - 1);
      } else {
        edgeFlow.set(keyB, (edgeFlow.get(keyB) ?? 0) - 1);
        edgeFlow.set(keyF, (edgeFlow.get(keyF) ?? 0) + 1);
      }
      curr = p.prev;
    }
    flow++;
  }

  return flow;
}

export function computeClusteringCoefficient(
  nodes: string[],
  edges: { from: string; to: string }[]
): number {
  if (nodes.length === 0) return 0;
  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n, new Set());
  for (const e of edges) {
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }

  let totalCC = 0;
  let count = 0;

  for (const n of nodes) {
    const neighbors = adj.get(n)!;
    if (neighbors.size < 2) continue;

    let linkCount = 0;
    const neighborArr = Array.from(neighbors);
    for (let i = 0; i < neighborArr.length; i++) {
      for (let j = i + 1; j < neighborArr.length; j++) {
        if (adj.get(neighborArr[i])!.has(neighborArr[j])) {
          linkCount++;
        }
      }
    }

    const possibleLinks = (neighbors.size * (neighbors.size - 1)) / 2;
    totalCC += linkCount / possibleLinks;
    count++;
  }

  return count > 0 ? totalCC / count : 0;
}

export function captureOmegaState(
  cd: CaseData,
  caps: Record<string, CapabilitySignature>,
  k: number,
  D_k: DecisionSensitivity
): OmegaSnapshot {
  const S_corrupt = { ...cd.graph, capabilities: caps };
  const O_k = extractObservableSubgraph(S_corrupt, cd.focalElement, k);
  const dru = computeDecisionRelevantUncertainty(O_k, cd.focalElement, D_k);

  // Compute local degrees in O_k
  const localDegrees: Record<string, number> = {};
  for (const node of O_k.nodes) localDegrees[node] = 0;
  for (const edge of O_k.edges) {
    if (localDegrees[edge.from] !== undefined) localDegrees[edge.from]++;
    if (localDegrees[edge.to] !== undefined) localDegrees[edge.to]++;
  }

  // Identify boundary nodes and compute reliability rhos
  const rho: Record<string, number> = {};
  let boundaryCount = 0;
  const boundaryNodes: string[] = [];

  for (const v of O_k.nodes) {
    const globalDeg = O_k.globalDegrees[v] ?? 0;
    const localDeg = localDegrees[v] ?? 0;
    if (globalDeg > localDeg) {
      boundaryCount++;
      boundaryNodes.push(v);

      const origSig = cd.graph.capabilities[v];
      const obsSig = caps[v];
      if (origSig && obsSig) {
        let match = 0;
        const dims: (keyof CapabilitySignature)[] = ['Pf', 'Pr', 'Ps', 'Pc', 'Pm'];
        for (const d of dims) {
          if (origSig[d] === obsSig[d]) match++;
        }
        rho[v] = match / dims.length;
      } else {
        rho[v] = 1.0;
      }
    }
  }

  // Local degree statistics
  const degValues = Object.values(localDegrees);
  const sum = degValues.reduce((a, b) => a + b, 0);
  const mean = degValues.length > 0 ? sum / degValues.length : 0;
  const variance = degValues.length > 0 
    ? degValues.reduce((a, b) => a + (b - mean) ** 2, 0) / degValues.length 
    : 0;
  const min = degValues.length > 0 ? Math.min(...degValues) : 0;
  const max = degValues.length > 0 ? Math.max(...degValues) : 0;

  // Redundancy: Average edge-disjoint paths from focal node to boundary nodes
  let totalPaths = 0;
  for (const bNode of boundaryNodes) {
    totalPaths += countEdgeDisjointPaths(O_k.nodes, O_k.edges, cd.focalElement, bNode);
  }
  const redundancy = boundaryNodes.length > 0 ? totalPaths / boundaryNodes.length : 0;

  // Communities: Clustering coefficient
  const communities = computeClusteringCoefficient(O_k.nodes, O_k.edges);

  return {
    k,
    observation: {
      nodes: O_k.nodes,
      edges: O_k.edges,
      capabilities: O_k.capabilities,
    },
    dru,
    rho,
    topology: {
      boundaryCount,
      degreeStats: { mean, variance, min, max },
      redundancy,
      communities,
    },
    context: {
      kMax: cd.kMax,
      focalElement: cd.focalElement,
    },
  };
}

export interface DeltaOmegaSnapshot {
  d_O: number;     // Symmetric difference of nodes: |O_{k+1} \triangle O_k|
  d_rho: number;   // L2 norm of boundary rhos
  d_T: {
    dV: number;    // Change in node count: |V_{k+1}| - |V_k|
    dE: number;    // Change in edge count: |E_{k+1}| - |E_k|
    dRedundancy: number; // |Redundancy_{k+1} - Redundancy_k|
    dCommunities: number; // |Communities_{k+1} - Communities_k|
  };
  d_DRU: number;   // |DRU_{k+1} - DRU_k|
}

export function computeDeltaOmega(
  prev: OmegaSnapshot,
  curr: OmegaSnapshot
): DeltaOmegaSnapshot {
  const setPrev = new Set(prev.observation.nodes);
  const setCurr = new Set(curr.observation.nodes);
  
  let symDiff = 0;
  for (const n of prev.observation.nodes) {
    if (!setCurr.has(n)) symDiff++;
  }
  for (const n of curr.observation.nodes) {
    if (!setPrev.has(n)) symDiff++;
  }

  // L2 norm of reliability vector difference
  const rhoKeys = new Set([...Object.keys(prev.rho), ...Object.keys(curr.rho)]);
  let rhoSumSq = 0;
  for (const k of rhoKeys) {
    const valPrev = prev.rho[k] ?? 1.0; // Assume 1.0 (clean) if not present on boundary
    const valCurr = curr.rho[k] ?? 1.0;
    rhoSumSq += (valPrev - valCurr) ** 2;
  }
  const d_rho = Math.sqrt(rhoSumSq);

  const dV = Math.abs(curr.observation.nodes.length - prev.observation.nodes.length);
  const dE = Math.abs(curr.observation.edges.length - prev.observation.edges.length);
  const dRedundancy = Math.abs(curr.topology.redundancy - prev.topology.redundancy);
  const dCommunities = Math.abs(curr.topology.communities - prev.topology.communities);

  const d_DRU = Math.abs(curr.dru - prev.dru);

  return {
    d_O: symDiff,
    d_rho,
    d_T: { dV, dE, dRedundancy, dCommunities },
    d_DRU,
  };
}
