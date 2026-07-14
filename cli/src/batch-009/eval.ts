import { CaseData, solveCaseOracle, evaluateCaseUtility } from '../batch-005/cases.js';
import { extractObservableSubgraph, computeDecisionRelevantUncertainty } from '../batch-005/estimator.js';
import type { DecisionSensitivity } from '../batch-005/estimator.js';
import type { ObservableSubgraph } from '../batch-005/estimator.js';
import type { CorruptionState } from '../batch-008/sparseFn.js';
import { weightedAlpha } from './oracleImpact.js';

export type PolicyId = 'AlwaysTrust' | 'AlwaysVerify' | 'ProbeAlways' | 'ProbeReliability0.3' | 'ProbeReliability0.5' | 'ProbeReliability0.7' | 'ProbeWeighted0.3' | 'ProbeWeighted0.5' | 'ProbeWeighted0.7';

export interface ScoreRow {
  policyId: PolicyId;
  caseId: string;
  incidence: number;
  rep: number;
  kActual: number;
  chosenAction: string;
  optimalAction: string;
  mismatch: boolean;
  evsiActionCost: number;
  optimalActionCost: number;
  regret: number;
  alphaEstimated: number;
  alphaTrue: number;
  alphaError: number;
  evsiHat: number;
  evsiTrue: number;
  blindnessGap: number;
  didProbe: boolean;
  boundaryNodeCount: number;
}

const C_EXPAND = 1.0;
const C_ESCALATE = 10.0;
const C_VERIFY = 0.5;

function buildObs(cd: CaseData, ok: { nodes: string[]; edges: { from: string; to: string }[] }): ObservableSubgraph {
  const degs: Record<string, number> = {};
  for (const n of ok.nodes) degs[n] = 0;
  for (const e of cd.graph.edges) {
    if (degs[e.from] !== undefined) degs[e.from]++;
    if (degs[e.to] !== undefined) degs[e.to]++;
  }
  return {
    nodes: ok.nodes,
    edges: ok.edges,
    globalDegrees: degs,
    capabilities: cd.graph.capabilities,
  };
}

function pickBest(cd: CaseData, obs: ObservableSubgraph): string {
  let best = '';
  let bestU = -Infinity;
  for (const id of Object.keys(cd.candidates)) {
    const { utility } = evaluateCaseUtility(cd, obs, id);
    if (utility > bestU) { bestU = utility; best = id; }
  }
  return best;
}

function globalBest(cd: CaseData): string {
  return pickBest(cd, buildObs(cd, { nodes: cd.graph.nodes, edges: cd.graph.edges }));
}

function druAtK(cd: CaseData, k: number, D_k: DecisionSensitivity): 0 | 1 {
  const O = extractObservableSubgraph(cd.graph, cd.focalElement, k);
  return computeDecisionRelevantUncertainty(O, cd.focalElement, D_k);
}

function computeD_k(cd: CaseData): DecisionSensitivity {
  const d: DecisionSensitivity = { Df: false, Dr: false, Ds: false, Dc: false, Dm: false };
  for (const c of Object.values(cd.candidates)) {
    const s = c.sensitivity;
    if (s.Df) d.Df = true;
    if (s.Dr) d.Dr = true;
    if (s.Ds) d.Ds = true;
    if (s.Dc) d.Dc = true;
    if (s.Dm) d.Dm = true;
  }
  return d;
}

function trueDRUPath(cd: CaseData): { steps: { k: number; dru: 0 | 1 }[]; finalK: number } {
  const D_k = computeD_k(cd);
  const steps: { k: number; dru: 0 | 1 }[] = [];
  for (let k = 1; k <= cd.kMax; k++) {
    const dru = druAtK(cd, k, D_k);
    steps.push({ k, dru });
    if (dru === 0) break;
  }
  return { steps, finalK: steps[steps.length - 1].k };
}

function median(vals: number[]): number {
  if (!vals.length) return 1;
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function evaluateOne(
  orig: CaseData,
  cs: CorruptionState,
  incidence: number,
  rep: number,
  oracleImpacts: Record<string, number>,
): ScoreRow[] {
  const optimalAction = globalBest(orig);
  const D_k = computeD_k(orig);
  const truePath = trueDRUPath(orig);
  const trueStopK = truePath.finalK;
  const trueDRU = truePath.steps[truePath.steps.length - 1].dru;

  const optimalActionCost = (() => {
    if (trueDRU === 0) return 0;
    if (trueStopK >= orig.kMax) return C_ESCALATE;
    return C_EXPAND;
  })();

  const boundaryNodeCount = Object.keys(cs.boundaryRhos).length;
  const metas: Record<string, ScoreRow> = {};
  const pols: { id: PolicyId; threshold?: number; weighted?: boolean }[] = [
    { id: 'AlwaysTrust' },
    { id: 'AlwaysVerify' },
    { id: 'ProbeAlways' },
    { id: 'ProbeReliability0.3', threshold: 0.3 },
    { id: 'ProbeReliability0.5', threshold: 0.5 },
    { id: 'ProbeReliability0.7', threshold: 0.7 },
    { id: 'ProbeWeighted0.3', threshold: 0.3, weighted: true },
    { id: 'ProbeWeighted0.5', threshold: 0.5, weighted: true },
    { id: 'ProbeWeighted0.7', threshold: 0.7, weighted: true },
  ];

  const corruptGraph = { ...orig.graph, capabilities: cs.obsCaps };
  const corruptCd: CaseData = { ...orig, graph: corruptGraph };

  const corruptPath = trueDRUPath(corruptCd);
  const corruptStopK = corruptPath.finalK;
  const corruptStopDRU = corruptPath.steps[corruptPath.steps.length - 1].dru;

  const alphaEstimated = (() => {
    const rhos = Object.values(cs.boundaryRhos);
    return 1 - median(rhos);
  })();

  const weightedAlphaEst = weightedAlpha(cs.boundaryRhos, oracleImpacts);

  const evsiTrue = (() => {
    const ok = corruptStopK;
    if (ok < orig.kMax) {
      const O_c = extractObservableSubgraph(orig.graph, orig.focalElement, ok);
      const O_n = extractObservableSubgraph(orig.graph, orig.focalElement, ok + 1);
      const a_c = pickBest(orig, buildObs(orig, O_c));
      const a_n = pickBest(orig, buildObs(orig, O_n));
      const u_c_global = solveCaseOracle(orig, a_c).utility;
      const u_n_global = solveCaseOracle(orig, a_n).utility;
      return Math.max(0, u_n_global - u_c_global);
    }
    return 0;
  })();

  const evsiHat = (() => {
    const ok = corruptStopK;
    if (ok < corruptCd.kMax) {
      const O_c = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, ok);
      const O_n = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, ok + 1);
      const a_c = pickBest(corruptCd, buildObs(corruptCd, O_c));
      const a_n = pickBest(corruptCd, buildObs(corruptCd, O_n));
      const u_c_local = evaluateCaseUtility(corruptCd, buildObs(corruptCd, O_c), a_c).utility;
      const u_n_local = evaluateCaseUtility(corruptCd, buildObs(corruptCd, O_n), a_n).utility;
      return Math.max(0, u_n_local - u_c_local);
    }
    return 0;
  })();

  const alphaTrue = (() => {
    if (evsiTrue <= 0) return 0;
    return (evsiTrue / C_EXPAND) - 1;
  })();

  for (const p of pols) {
    let kActual: number;
    let chosenAction: string;
    let actionCost = 0;
    let didProbe = false;
    const useWeighted = p.weighted ?? false;
    const effectiveAlpha = useWeighted ? weightedAlphaEst : alphaEstimated;

    if (p.id === 'AlwaysTrust') {
      kActual = corruptStopK;
      const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
      chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
    } else if (p.id === 'AlwaysVerify') {
      kActual = corruptCd.kMax;
      const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
      const dru = computeDecisionRelevantUncertainty(O, corruptCd.focalElement, D_k);
      actionCost = C_VERIFY * (kActual - 1);
      if (dru === 1) {
        chosenAction = globalBest(corruptCd);
        actionCost += C_ESCALATE;
      } else {
        chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
      }
    } else if (p.id === 'ProbeAlways') {
      if (corruptStopK < corruptCd.kMax) {
        didProbe = true;
        actionCost = C_EXPAND;
        kActual = corruptStopK + 1;
        const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
        const dru = computeDecisionRelevantUncertainty(O, corruptCd.focalElement, D_k);
        if (dru === 1 && kActual >= corruptCd.kMax) {
          chosenAction = globalBest(corruptCd);
          actionCost += C_ESCALATE;
        } else {
          chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
        }
      } else {
        kActual = corruptStopK;
        const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
        chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
      }
    } else {
      const threshold = p.threshold ?? 1;
      if (corruptStopK < corruptCd.kMax && effectiveAlpha > threshold) {
        didProbe = true;
        actionCost = C_EXPAND;
        kActual = corruptStopK + 1;
        const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
        const dru = computeDecisionRelevantUncertainty(O, corruptCd.focalElement, D_k);
        if (dru === 1 && kActual >= corruptCd.kMax) {
          chosenAction = globalBest(corruptCd);
          actionCost += C_ESCALATE;
        } else {
          chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
        }
      } else {
        kActual = corruptStopK;
        const O = extractObservableSubgraph(corruptGraph, corruptCd.focalElement, kActual);
        chosenAction = pickBest(corruptCd, buildObs(corruptCd, O));
      }
    }

    const mismatch = chosenAction !== optimalAction;
    const regret = actionCost - optimalActionCost;
    const alphaError = alphaTrue - effectiveAlpha;
    const blindnessGap = evsiTrue - evsiHat;

    metas[p.id] = {
      policyId: p.id,
      caseId: orig.id,
      incidence,
      rep,
      kActual,
      chosenAction,
      optimalAction,
      mismatch,
      evsiActionCost: actionCost,
      optimalActionCost,
      regret,
      alphaEstimated: effectiveAlpha,
      alphaTrue,
      alphaError,
      evsiHat,
      evsiTrue,
      blindnessGap,
      didProbe,
      boundaryNodeCount,
    };
  }

  return Object.values(metas);
}
