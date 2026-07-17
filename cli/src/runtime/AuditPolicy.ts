import { GovernanceDecision } from './types.js';

export class AuditPolicy {
  decide(margin: number, threshold: number): GovernanceDecision {
    if (margin < threshold) {
      return { action: "INTERVENE", reason: `M_D=${margin.toFixed(3)} < θ=${threshold}`, margin };
    }
    return { action: "MONITOR", margin };
  }
}
