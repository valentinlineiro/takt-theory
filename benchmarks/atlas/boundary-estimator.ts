/**
 * TAKT Computable Atlas & Boundary Estimator
 * Maps empirical execution points to formal regime classifications.
 */

export type RegimeClassification =
  | 'structural_advantage'
  | 'setup_dominance'
  | 'recalibration_bound'
  | 'rupture_regime';

export type ReplicationLevel = 'R0' | 'R1' | 'R2' | 'R3';

export interface AtlasDataPoint {
  k: number;
  deltaD: number;
  n: number;
  regime: RegimeClassification;
  totalRegret: number;
  costRatio: number;
  setupLatencyMs: number;
  amortizedStepLatencyMs: number;
  replicationLevel: ReplicationLevel;
}

export class BoundaryEstimator {
  /**
   * Computes break-even horizon n_break_even where setup cost is amortized.
   */
  public static calculateBreakEvenHorizon(
    setupCostMs: number,
    taktStepLatencyMs: number,
    baselineStepLatencyMs: number
  ): number {
    const diffMs = baselineStepLatencyMs - taktStepLatencyMs;
    if (diffMs <= 0) return Infinity; // TAKT step latency is higher than baseline
    return Math.ceil(setupCostMs / diffMs);
  }

  /**
   * Classifies an empirical point (k, deltaD, n) into its operational regime.
   */
  public static classifyPoint(point: {
    k: number;
    deltaD: number;
    n: number;
    setupCostMs: number;
    taktStepLatencyMs: number;
    baselineStepLatencyMs: number;
    totalRegret: number;
    criticalDriftThreshold?: number;
  }): RegimeClassification {
    const critDrift = point.criticalDriftThreshold ?? 0.02;
    const breakEvenN = this.calculateBreakEvenHorizon(
      point.setupCostMs,
      point.taktStepLatencyMs,
      point.baselineStepLatencyMs
    );

    if (point.totalRegret > 0 || (point.k >= 64 && point.deltaD > critDrift)) {
      return 'rupture_regime';
    }

    if (point.deltaD > critDrift) {
      return 'recalibration_bound';
    }

    if (point.n < breakEvenN) {
      return 'setup_dominance';
    }

    return 'structural_advantage';
  }
}
