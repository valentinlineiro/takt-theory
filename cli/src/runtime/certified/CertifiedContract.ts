import type { LeanTraceabilityMetadata } from '../bridge/LeanTraceabilityBridge.js';

export class CertifiedContract<S, Z, A> {
  constructor(
    public readonly metadata: LeanTraceabilityMetadata,
    public readonly representationR: (state: S) => Z,
    public readonly idealDecisionD: (state: S) => A,
    public readonly nominalPolicyPi: (abstractState: Z) => A,
    public readonly minimumMarginThreshold: number,
    public readonly maxDriftRate: number
  ) {}

  /** Calculates guaranteed intervention horizon h* = floor(m_min / c_max) (Theorem IV.4) */
  public getInterventionHorizon(): number {
    if (this.maxDriftRate <= 0) return Infinity;
    return Math.floor(this.minimumMarginThreshold / this.maxDriftRate);
  }
}
