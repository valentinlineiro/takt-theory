import { loadBatch005Cases, evaluateCaseUtility } from '../batch-005/cases.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';
import { computeX1, computeX2 } from '../batch-014/run.js';

export interface SearchResult {
  k: number;
  totalScanned: number;
  silentCount: number;
  maxRegret: number;
  regrets: number[];
  witnesses: string[][]; // Edges of maximizing configurations
}

export function getCombinations<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  function helper(start: number, combo: T[]) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combo.push(array[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }
  helper(0, []);
  return result;
}

export function performAdversarySearch(): SearchResult[] {
  const cases = loadBatch005Cases();
  const orig = cases.find(c => c.id === 'DEP-005')!;

  const D_k = { Df: false, Dr: true, Ds: false, Dc: false, Dm: false };

  // 1. Clean Snapshots
  const cleanSnap1 = captureOmegaState(orig, orig.graph.capabilities, 1, D_k);
  const cleanSnap2 = captureOmegaState(orig, orig.graph.capabilities, 2, D_k);
  const cleanDelta = computeDeltaOmega(cleanSnap1, cleanSnap2);

  const subClean1 = extractObservableSubgraph(orig.graph, orig.focalElement, 1);
  const subClean2 = extractObservableSubgraph(orig.graph, orig.focalElement, 2);
  const cleanX1_1 = computeX1(subClean1, orig.failures);
  const cleanX1_2 = computeX1(subClean2, orig.failures);
  const cleanX2_1 = computeX2(subClean1, orig.failures);
  const cleanX2_2 = computeX2(subClean2, orig.failures);

  // 2. Generate all directed edges
  const nodes = ['s', 't', 'v3', 'v3_next', 'v3_next_next'];
  const possibleEdges: { from: string; to: string }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        possibleEdges.push({ from: nodes[i], to: nodes[j] });
      }
    }
  }

  // Generate 6-edge combinations (38,760 total)
  const edgeCombinations = getCombinations(possibleEdges, 6);

  // Regret trackers
  const results: SearchResult[] = [
    { k: 0, totalScanned: edgeCombinations.length, silentCount: 0, maxRegret: 0, regrets: [], witnesses: [] },
    { k: 1, totalScanned: edgeCombinations.length, silentCount: 0, maxRegret: 0, regrets: [], witnesses: [] },
    { k: 2, totalScanned: edgeCombinations.length, silentCount: 0, maxRegret: 0, regrets: [], witnesses: [] },
  ];

  for (const combo of edgeCombinations) {
    const corruptGraph = {
      nodes: [...nodes],
      edges: combo,
      capabilities: { ...orig.graph.capabilities },
    };

    // Ensure focal node has at least one outgoing edge to keep graph connected for BFS
    const hasOutgoing = combo.some(e => e.from === 's');
    if (!hasOutgoing) continue;

    // Verify snapshots capture does not crash (valid BFS extraction)
    let corruptSnap1, corruptSnap2;
    let subCorrupt1, subCorrupt2;
    try {
      corruptSnap1 = captureOmegaState({ ...orig, graph: corruptGraph }, corruptGraph.capabilities, 1, D_k);
      corruptSnap2 = captureOmegaState({ ...orig, graph: corruptGraph }, corruptGraph.capabilities, 2, D_k);

      subCorrupt1 = extractObservableSubgraph(corruptGraph, orig.focalElement, 1);
      subCorrupt2 = extractObservableSubgraph(corruptGraph, orig.focalElement, 2);
    } catch {
      continue;
    }

    // Evaluate utility regret
    let loss = 0;
    try {
      const u_corrupt_T0 = evaluateCaseUtility({ ...orig, graph: corruptGraph }, subCorrupt2, 'T0').utility;
      const u_corrupt_T1 = evaluateCaseUtility({ ...orig, graph: corruptGraph }, subCorrupt2, 'T1').utility;
      
      const optUtility = Math.max(u_corrupt_T0, u_corrupt_T1);
      loss = optUtility - u_corrupt_T0; // Regret of clean baseline T0
    } catch {
      continue;
    }

    const corruptX1_1 = computeX1(subCorrupt1, orig.failures);
    const corruptX1_2 = computeX1(subCorrupt2, orig.failures);
    const corruptX2_1 = computeX2(subCorrupt1, orig.failures);
    const corruptX2_2 = computeX2(subCorrupt2, orig.failures);

    const dX1 = Math.abs(Math.abs(corruptX1_2 - corruptX1_1) - Math.abs(cleanX1_2 - cleanX1_1));
    const dX2 = Math.abs(Math.abs(corruptX2_2 - corruptX2_1) - Math.abs(cleanX2_2 - cleanX2_1));

    // Evaluate k=0
    results[0].silentCount++;
    results[0].regrets.push(loss);
    if (loss > results[0].maxRegret) {
      results[0].maxRegret = loss;
      results[0].witnesses = [combo.map(e => `${e.from}->${e.to}`)];
    } else if (Math.abs(loss - results[0].maxRegret) < 0.001) {
      results[0].witnesses.push(combo.map(e => `${e.from}->${e.to}`));
    }

    // Evaluate k=1 (Isomorphic match at k=1 snapshot)
    const matchV_1 = corruptSnap1.observation.nodes.length === cleanSnap1.observation.nodes.length;
    const matchE_1 = corruptSnap1.observation.edges.length === cleanSnap1.observation.edges.length;
    const matchR_1 = Math.abs(corruptSnap1.topology.redundancy - cleanSnap1.topology.redundancy) <= 0.10;
    const matchCom_1 = Math.abs(corruptSnap1.topology.communities - cleanSnap1.topology.communities) <= 0.05;
    const matchX2_1 = Math.abs(corruptX2_1 - cleanX2_1) <= 0.05;

    if (matchV_1 && matchE_1 && matchR_1 && matchCom_1 && matchX2_1) {
      results[1].silentCount++;
      results[1].regrets.push(loss);
      if (loss > results[1].maxRegret) {
        results[1].maxRegret = loss;
        results[1].witnesses = [combo.map(e => `${e.from}->${e.to}`)];
      } else if (Math.abs(loss - results[1].maxRegret) < 0.001) {
        results[1].witnesses.push(combo.map(e => `${e.from}->${e.to}`));
      }
    }

    // Evaluate k=2 (Silent on transition k=1 -> k=2)
    const corruptDelta = computeDeltaOmega(corruptSnap1, corruptSnap2);

    const d_V = Math.abs(corruptDelta.d_T.dV - cleanDelta.d_T.dV);
    const d_E = Math.abs(corruptDelta.d_T.dE - cleanDelta.d_T.dE);
    const d_R = Math.abs(corruptDelta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
    const d_Com = Math.abs(corruptDelta.d_T.dCommunities - cleanDelta.d_T.dCommunities);
    const d_rho = corruptDelta.d_rho;
    const d_caps = corruptDelta.d_caps;

    const silentK2 = (
      d_V === 0 &&
      d_E === 0 &&
      d_R <= 0.10 &&
      d_Com <= 0.05 &&
      d_rho <= 0.05 &&
      d_caps <= 0.05 &&
      dX1 <= 0.005 &&
      dX2 <= 0.05
    );

    if (matchV_1 && matchE_1 && matchR_1 && matchCom_1 && matchX2_1 && silentK2) {
      results[2].silentCount++;
      results[2].regrets.push(loss);
      if (loss > results[2].maxRegret) {
        results[2].maxRegret = loss;
        results[2].witnesses = [combo.map(e => `${e.from}->${e.to}`)];
      } else if (Math.abs(loss - results[2].maxRegret) < 0.001) {
        results[2].witnesses.push(combo.map(e => `${e.from}->${e.to}`));
      }
    }
  }

  return results;
}
