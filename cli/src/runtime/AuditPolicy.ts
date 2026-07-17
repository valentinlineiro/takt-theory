import { GovernanceDecision } from './types.js';

export class AuditPolicy {
  decide(margin: number, threshold: number): GovernanceDecision {
    if (margin < threshold) {
      return { action: "INTERVENE", reason: `M_D=${margin.toFixed(3)} < θ=${threshold}`, margin };
    }
    return { action: "MONITOR", margin };
  }

  decideSafe(marginSafe: number, threshold: number, drift: number, tau: number): GovernanceDecision {
    if (drift > tau) {
      return { action: "RECALIBRATE", reason: `Δ=${drift.toFixed(3)} > τ=${tau}` };
    }
    if (marginSafe < threshold) {
      return { action: "INTERVENE", reason: `M_D_safe=${marginSafe.toFixed(3)} < θ=${threshold}`, margin: marginSafe };
    }
    return { action: "MONITOR_SAFE", margin: marginSafe };
  }
}
