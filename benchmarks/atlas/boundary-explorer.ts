/**
 * TAKT Boundary Explorer & EVSI Sampling Strategy
 * Active exploration of the (k, deltaD, n) phase space to locate
 * the boundary surface f1(k, deltaD, n) = 0 with minimal experimental cost.
 */

import { BoundaryEstimator, type AtlasDataPoint, type RegimeClassification } from './boundary-estimator.js';

export interface ExplorationCandidate {
  k: number;
  deltaD: number;
  n: number;
  evsiPriority: number; // Predicted EVSI Priority
}

export interface ErrorTaxonomy {
  epsilonModel: number;       // EVSI model misspecification error
  epsilonExec: number;        // Infrastructure/execution noise or instability
  epsilonInterpret: number;   // Empirical classification interpretation error
  totalError: number;        // Total error sum
}

export class BoundaryExplorer {
  /**
   * Evaluates candidates and prioritizes those near anticipated regime boundaries.
   */
  public static prioritizeCandidates(
    candidates: Array<{ k: number; deltaD: number; n: number }>,
    evaluatedPoints: AtlasDataPoint[]
  ): ExplorationCandidate[] {
    return candidates
      .map((c) => {
        const priority = this.computeEVSIPriority(c, evaluatedPoints);
        return { ...c, evsiPriority: priority };
      })
      .sort((a, b) => b.evsiPriority - a.evsiPriority);
  }

  /**
   * Computes spatial target uncertainty threshold epsilon(x).
   * Transition boundaries require higher resolution (lower epsilon).
   */
  public static getTargetUncertaintyThreshold(candidate: { k: number; deltaD: number; n: number }): number {
    const distToBreakEven = Math.abs(candidate.n - 100) / 100;
    const distToCritDrift = Math.abs(candidate.deltaD - 0.02) / 0.02;
    const minDist = Math.min(distToBreakEven, distToCritDrift);

    // Near transition boundary (minDist close to 0) -> tighter threshold (0.01)
    // Deep in stable regime -> broader tolerance (0.05)
    return minDist < 0.2 ? 0.01 : 0.05;
  }

  /**
   * Computes EVSI priority based on distance to regime transition boundaries
   * and density of existing evaluated points in the neighborhood.
   */
  private static computeEVSIPriority(
    candidate: { k: number; deltaD: number; n: number },
    evaluatedPoints: AtlasDataPoint[]
  ): number {
    // 1. Estimate proximity to break-even horizon n = 100 or critical drift deltaD = 0.02
    const distToBreakEven = Math.abs(candidate.n - 100) / 100;
    const distToCritDrift = Math.abs(candidate.deltaD - 0.02) / 0.02;

    const boundaryProximityScore = 1.0 / (1.0 + Math.min(distToBreakEven, distToCritDrift));

    // 2. Compute spatial density penalty (prefer unexplored regions)
    let neighborCount = 0;
    for (const p of evaluatedPoints) {
      if (Math.abs(p.k - candidate.k) <= 8 && Math.abs(p.deltaD - candidate.deltaD) <= 0.01) {
        neighborCount++;
      }
    }
    const explorationUncertaintyBonus = 1.0 / (1.0 + neighborCount);

    return boundaryProximityScore * 0.6 + explorationUncertaintyBonus * 0.4;
  }

  /**
   * Audits decomposed error taxonomy: model misspecification, execution noise, and interpretation error.
   */
  public static auditDecomposedError(
    predictedEVSI: number,
    actualKnowledgeGain: number,
    executionNoiseMs: number,
    interpretationVariance: number
  ): ErrorTaxonomy {
    const epsilonModel = Math.abs(predictedEVSI - actualKnowledgeGain);
    const epsilonExec = executionNoiseMs / 10.0;
    const epsilonInterpret = interpretationVariance;

    return {
      epsilonModel,
      epsilonExec,
      epsilonInterpret,
      totalError: epsilonModel + epsilonExec + epsilonInterpret
    };
  }
}
