import {
  GlobalGraph,
  ObservableSubgraph,
  extractObservableSubgraph,
  computeProxyUncertainty,
} from './estimator.js';

export type SelectedIntervention = string;

export interface CaseData {
  id: string;
  systemType: 'dependency' | 'workflow' | 'resource';
  focalNode: string;
  globalGraph: GlobalGraph;
  candidateInterventions: SelectedIntervention[];
  evaluateUtility: (
    subgraph: ObservableSubgraph,
    intervention: SelectedIntervention
  ) => number;
}

/**
 * Converts a GlobalGraph to an ObservableSubgraph representation of the entire graph.
 */
export function globalToObservableSubgraph(S: GlobalGraph): ObservableSubgraph {
  const globalDegrees: Record<string, number> = {};
  for (const node of S.nodes) {
    globalDegrees[node] = 0;
  }
  for (const edge of S.edges) {
    if (globalDegrees[edge.from] !== undefined) {
      globalDegrees[edge.from]++;
    }
    if (globalDegrees[edge.to] !== undefined) {
      globalDegrees[edge.to]++;
    }
  }
  return {
    nodes: S.nodes,
    edges: S.edges,
    globalDegrees,
  };
}

/**
 * Finds the intervention in candidateInterventions that maximizes evaluateUtility on the given subgraph.
 */
function findOptimalIntervention(
  subgraph: ObservableSubgraph,
  candidates: SelectedIntervention[],
  evaluateUtility: (subgraph: ObservableSubgraph, intervention: SelectedIntervention) => number
): SelectedIntervention {
  if (candidates.length === 0) {
    throw new Error('No candidate interventions provided.');
  }

  let bestIntervention = candidates[0];
  let maxUtility = evaluateUtility(subgraph, candidates[0]);

  for (let i = 1; i < candidates.length; i++) {
    const candidate = candidates[i];
    const utility = evaluateUtility(subgraph, candidate);
    if (utility > maxUtility) {
      maxUtility = utility;
      bestIntervention = candidate;
    }
  }

  return bestIntervention;
}

/**
 * Baseline A (Pure Local Heuristic): Decides at k=1.
 */
export function runBaselineLocal(caseData: CaseData): SelectedIntervention {
  const O_1 = extractObservableSubgraph(caseData.globalGraph, caseData.focalNode, 1);
  return findOptimalIntervention(O_1, caseData.candidateInterventions, caseData.evaluateUtility);
}

/**
 * Baseline B (Always Global Solver): Accesses global graph directly, returns optimal T*.
 */
export function runBaselineGlobal(caseData: CaseData): SelectedIntervention {
  const globalSubgraph = globalToObservableSubgraph(caseData.globalGraph);
  return findOptimalIntervention(globalSubgraph, caseData.candidateInterventions, caseData.evaluateUtility);
}

/**
 * Baseline C (Adaptive Escalation Loop):
 * - Expand k from 1 to kMax.
 * - Compute I_k.
 * - If I_k = 0, stop and return local decision.
 * - If I_k = 1 and k = kMax, escalate (return optimal global candidate T*).
 */
export function runBaselineAdaptive(
  caseData: CaseData,
  kMax: number
): {
  intervention: SelectedIntervention;
  kActual: number;
  finishedUcert: 0 | 1;
} {
  for (let k = 1; k <= kMax; k++) {
    const O_k = extractObservableSubgraph(caseData.globalGraph, caseData.focalNode, k);
    const I_k = computeProxyUncertainty(O_k, caseData.focalNode);

    if (I_k === 0) {
      const localDecision = findOptimalIntervention(O_k, caseData.candidateInterventions, caseData.evaluateUtility);
      return {
        intervention: localDecision,
        kActual: k,
        finishedUcert: 0,
      };
    }

    if (I_k === 1 && k === kMax) {
      const globalDecision = runBaselineGlobal(caseData);
      return {
        intervention: globalDecision,
        kActual: k,
        finishedUcert: 1,
      };
    }
  }

  // Fallback in case kMax < 1: run local decision at k=1
  const O_1 = extractObservableSubgraph(caseData.globalGraph, caseData.focalNode, 1);
  const localDecision = findOptimalIntervention(O_1, caseData.candidateInterventions, caseData.evaluateUtility);
  return {
    intervention: localDecision,
    kActual: Math.max(1, kMax),
    finishedUcert: 0,
  };
}
