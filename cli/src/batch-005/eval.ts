import { loadBatch005Cases, solveCaseOracle, evaluateCaseUtility, CaseData } from './cases.js';
import { runBaselineLocal, runBaselineGlobal, runBaselineAdaptive } from './baselines.js';
import { extractObservableSubgraph } from './estimator.js';

export interface ScorecardModel {
  oia: number;
  dor: number;
  se: number;
  eer: number;
  er: number;
  ep: number;
  uer: number;
  cvg?: number;
  uerReduction?: number;
}

export interface CaseDetailedResult {
  id: string;
  domain: string;
  localChosen: string;
  globalChosen: string;
  adaptiveChosen: string;
  kActual: number;
  escalated: boolean;
  se: number;
  destructive: boolean;
  match: boolean;
}

export interface EvalBatch005Results {
  local: ScorecardModel;
  global: ScorecardModel;
  adaptive: ScorecardModel;
  cases: CaseDetailedResult[];
}

export function executeBatch005(): EvalBatch005Results {
  const casesData = loadBatch005Cases();
  const detailedResults: CaseDetailedResult[] = [];

  let localMatches = 0;
  let globalMatches = 0;
  let adaptiveMatches = 0;

  let localDestructive = 0;
  let globalDestructive = 0;
  let adaptiveDestructive = 0;

  let localSeSum = 0;
  let globalSeSum = 0;
  let adaptiveSeSum = 0;

  let adaptiveEscalations = 0;

  // Expansion metrics
  let totalNeedExpand = 0;
  let totalNoNeedExpand = 0;
  let correctExpansions = 0; // NeedExpand = true and kActual > 1
  let unnecessaryExpansions = 0; // NeedExpand = false and kActual > 1
  let totalExpansions = 0; // kActual > 1

  for (const c of casesData) {
    const localChosen = runBaselineLocal(c);
    const globalChosen = runBaselineGlobal(c);
    const { intervention: adaptiveChosen, kActual, finishedUcert } = runBaselineAdaptive(c, 2);

    const localMatch = localChosen === globalChosen;
    const globalMatch = true;
    const adaptiveMatch = adaptiveChosen === globalChosen;

    if (localMatch) localMatches++;
    if (globalMatch) globalMatches++;
    if (adaptiveMatch) adaptiveMatches++;

    // Check if destructive (utility globally is worse than control T0)
    const t0Global = solveCaseOracle(c, 'T0');
    const localGlobalEval = solveCaseOracle(c, localChosen);
    const globalGlobalEval = solveCaseOracle(c, globalChosen);
    const adaptiveGlobalEval = solveCaseOracle(c, adaptiveChosen);

    const localIsDestructive = localGlobalEval.utility < t0Global.utility - 1e-9;
    const globalIsDestructive = globalGlobalEval.utility < t0Global.utility - 1e-9;
    const adaptiveIsDestructive = adaptiveGlobalEval.utility < t0Global.utility - 1e-9;

    if (localIsDestructive) localDestructive++;
    if (globalIsDestructive) globalDestructive++;
    if (adaptiveIsDestructive) adaptiveDestructive++;

    // Compute Search Effort (SE)
    const globalSize = c.graph.nodes.length + c.graph.edges.length;

    const o1 = extractObservableSubgraph(c.graph, c.focalElement, 1);
    const localSize = o1.nodes.length + o1.edges.length;
    const localSe = localSize / globalSize;
    localSeSum += localSe;

    globalSeSum += 1.0;

    const oK = extractObservableSubgraph(c.graph, c.focalElement, kActual);
    const adaptiveSize = oK.nodes.length + oK.edges.length;
    const adaptiveSe = adaptiveSize / globalSize;
    adaptiveSeSum += adaptiveSe;

    const escalated = finishedUcert === 1;
    if (escalated) {
      adaptiveEscalations++;
    }

    // NeedExpand ground truth: Case B (002, 005) and Case C (003, 006) require expansion/escalation
    const isCaseA = c.id.endsWith('001') || c.id.endsWith('004');
    const needExpand = !isCaseA;
    if (needExpand) {
      totalNeedExpand++;
    } else {
      totalNoNeedExpand++;
    }

    if (kActual > 1) {
      totalExpansions++;
      if (needExpand) {
        correctExpansions++;
      } else {
        unnecessaryExpansions++;
      }
    }

    detailedResults.push({
      id: c.id,
      domain: c.domain,
      localChosen,
      globalChosen,
      adaptiveChosen,
      kActual,
      escalated,
      se: Math.round(adaptiveSe * 1000) / 10,
      destructive: adaptiveIsDestructive,
      match: adaptiveMatch,
    });
  }

  const caseCount = casesData.length;

  const localOia = (localMatches / caseCount) * 100;
  const globalOia = (globalMatches / caseCount) * 100;
  const adaptiveOia = (adaptiveMatches / caseCount) * 100;

  const localDor = (localDestructive / caseCount) * 100;
  const globalDor = (globalDestructive / caseCount) * 100;
  const adaptiveDor = (adaptiveDestructive / caseCount) * 100;

  const localSe = (localSeSum / caseCount) * 100;
  const globalSe = (globalSeSum / caseCount) * 100;
  const adaptiveSe = (adaptiveSeSum / caseCount) * 100;

  const adaptiveEer = (adaptiveEscalations / caseCount) * 100;

  // Escalation Recall and Precision
  const adaptiveEr = totalNeedExpand > 0 ? (correctExpansions / totalNeedExpand) * 100 : 100;
  const adaptiveEp = totalExpansions > 0 ? (correctExpansions / totalExpansions) * 100 : 100;
  const adaptiveUer = totalNoNeedExpand > 0 ? (unnecessaryExpansions / totalNoNeedExpand) * 100 : 0;

  // Comparative metrics from Batch-004:
  // EP_Batch-004 = 14.29%
  // UER_Batch-004 = 42.86%
  const epBatch004 = 14.29;
  const uerBatch004 = 42.86;

  const cvg = adaptiveEp - epBatch004;
  const uerReduction = uerBatch004 - adaptiveUer;

  return {
    local: {
      oia: Math.round(localOia * 100) / 100,
      dor: Math.round(localDor * 100) / 100,
      se: Math.round(localSe * 100) / 100,
      eer: 0,
      er: 0,
      ep: 100,
      uer: 0,
    },
    global: {
      oia: Math.round(globalOia * 100) / 100,
      dor: Math.round(globalDor * 100) / 100,
      se: Math.round(globalSe * 100) / 100,
      eer: 100,
      er: 100,
      ep: (totalNeedExpand / caseCount) * 100,
      uer: ((caseCount - totalNeedExpand) / caseCount) * 100,
    },
    adaptive: {
      oia: Math.round(adaptiveOia * 100) / 100,
      dor: Math.round(adaptiveDor * 100) / 100,
      se: Math.round(adaptiveSe * 100) / 100,
      eer: Math.round(adaptiveEer * 100) / 100,
      er: Math.round(adaptiveEr * 100) / 100,
      ep: Math.round(adaptiveEp * 100) / 100,
      uer: Math.round(adaptiveUer * 100) / 100,
      cvg: Math.round(cvg * 100) / 100,
      uerReduction: Math.round(uerReduction * 100) / 100,
    },
    cases: detailedResults,
  };
}
