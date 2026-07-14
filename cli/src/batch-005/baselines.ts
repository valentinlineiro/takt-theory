import { CaseData, evaluateCaseUtility, solveCaseOracle } from './cases.js';
import {
  extractObservableSubgraph,
  computeDecisionSensitivity,
  computeDecisionRelevantUncertainty,
} from './estimator.js';

export function runBaselineLocal(caseData: CaseData): string {
  // Local at k=1
  const O_1 = extractObservableSubgraph(caseData.graph, caseData.focalElement, 1);
  let bestIntervention = 'T0';
  let bestUtility = -Infinity;

  for (const interventionId of Object.keys(caseData.candidates)) {
    const { utility } = evaluateCaseUtility(caseData, O_1, interventionId);
    if (utility > bestUtility) {
      bestUtility = utility;
      bestIntervention = interventionId;
    }
  }

  return bestIntervention;
}

export function runBaselineGlobal(caseData: CaseData): string {
  let bestIntervention = 'T0';
  let bestUtility = -Infinity;

  for (const interventionId of Object.keys(caseData.candidates)) {
    const { utility } = solveCaseOracle(caseData, interventionId);
    if (utility > bestUtility) {
      bestUtility = utility;
      bestIntervention = interventionId;
    }
  }

  return bestIntervention;
}

export function runBaselineAdaptive(
  caseData: CaseData,
  kMax: number
): { intervention: string; kActual: number; finishedUcert: 0 | 1 } {
  let k = 1;
  const sensitivities = Object.values(caseData.candidates).map((c) => c.sensitivity);
  const D_k = computeDecisionSensitivity(sensitivities);

  while (k <= kMax) {
    const O_k = extractObservableSubgraph(caseData.graph, caseData.focalElement, k);
    const dru = computeDecisionRelevantUncertainty(O_k, caseData.focalElement, D_k);

    if (dru === 0) {
      // Uncertainty resolved locally
      let bestIntervention = 'T0';
      let bestUtility = -Infinity;

      for (const interventionId of Object.keys(caseData.candidates)) {
        const { utility } = evaluateCaseUtility(caseData, O_k, interventionId);
        if (utility > bestUtility) {
          bestUtility = utility;
          bestIntervention = interventionId;
        }
      }

      return {
        intervention: bestIntervention,
        kActual: k,
        finishedUcert: 0,
      };
    }

    if (k === kMax) {
      // Horizon limit reached with remaining uncertainty: escalate to global solver
      const globalBest = runBaselineGlobal(caseData);
      return {
        intervention: globalBest,
        kActual: k,
        finishedUcert: 1, // Escalated
      };
    }

    k++;
  }

  // Fallback (should not be reached under proper conditions)
  return {
    intervention: runBaselineGlobal(caseData),
    kActual: kMax,
    finishedUcert: 1,
  };
}
