export interface CaseEvalInput {
  caseId: string;
  selectedIntervention: string;
  optimalGlobal: string;
  optimalLocalH1: string;
  kActual: number;
  finishedUcert: 0 | 1;
  subgraphNodeCount: number;
  subgraphEdgeCount: number;
  globalNodeCount: number;
  globalEdgeCount: number;
  isDestructive: boolean;
}

export interface ModelScorecard {
  oia: number;
  dor: number;
  meanSearchEffort: number;
  eer: number;
  er: number;
  ep: number;
  uer: number;
}

export function calculateScorecard(results: CaseEvalInput[]): ModelScorecard {
  const N = results.length;
  if (N === 0) {
    return { oia: 0, dor: 0, meanSearchEffort: 0, eer: 0, er: 0, ep: 0, uer: 0 };
  }

  let correctCount = 0;
  let destructiveCount = 0;
  let totalSearchEffort = 0;
  let externalEscalationCount = 0;

  let tpEscalation = 0;
  let fpEscalation = 0;
  let fnEscalation = 0;
  let tnEscalation = 0;

  for (const r of results) {
    // OIA: matches optimal global intervention
    if (r.selectedIntervention === r.optimalGlobal) {
      correctCount++;
    }

    // DOR: destructive intervention
    if (r.isDestructive) {
      destructiveCount++;
    }

    // Search Effort: (|V_subgraph| + |E_subgraph|) / (|V_global| + |E_global|)
    const subgraphSize = r.subgraphNodeCount + r.subgraphEdgeCount;
    const globalSize = r.globalNodeCount + r.globalEdgeCount;
    const effort = globalSize > 0 ? subgraphSize / globalSize : 0;
    totalSearchEffort += effort;

    // EER: external escalation (finishedUcert === 1)
    if (r.finishedUcert === 1) {
      externalEscalationCount++;
    }

    // NeedExpand: T*_H1(c) !== T*_Global(c)
    const needExpand = r.optimalLocalH1 !== r.optimalGlobal ? 1 : 0;

    // Escalated (expanded beyond k=1): K_actual > 1
    const escalated = r.kActual > 1 ? 1 : 0;

    if (needExpand === 1 && escalated === 1) {
      tpEscalation++;
    } else if (needExpand === 0 && escalated === 1) {
      fpEscalation++;
    } else if (needExpand === 1 && escalated === 0) {
      fnEscalation++;
    } else if (needExpand === 0 && escalated === 0) {
      tnEscalation++;
    }
  }

  const oia = (correctCount / N) * 100;
  const dor = (destructiveCount / N) * 100;
  const meanSearchEffort = totalSearchEffort / N;
  const eer = externalEscalationCount / N;

  const erDenominator = tpEscalation + fnEscalation;
  const er = erDenominator > 0 ? tpEscalation / erDenominator : 1.0;

  const epDenominator = tpEscalation + fpEscalation;
  const ep = epDenominator > 0 ? tpEscalation / epDenominator : 1.0;

  const uerDenominator = fpEscalation + tnEscalation;
  const uer = uerDenominator > 0 ? fpEscalation / uerDenominator : 0.0;

  return {
    oia,
    dor,
    meanSearchEffort,
    eer,
    er,
    ep,
    uer,
  };
}
