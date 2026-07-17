import { GovernanceDecision, ContractReport, Outcome } from './types.js';

export class ContractEvaluator {
  private totalLoss = 0;
  private interventionCount = 0;
  private violationCount = 0;
  private recalibrationCount = 0;
  private lastRecalibrationReason: string | null = null;
  readonly epsilon: number;

  constructor(epsilon: number) {
    this.epsilon = epsilon;
  }

  evaluate(decision: GovernanceDecision, outcome: Outcome): void {
    if (decision.action === "INTERVENE") {
      this.interventionCount++;
    }
    if (decision.action === "RECALIBRATE") {
      this.recalibrationCount++;
      this.lastRecalibrationReason = decision.reason;
    }
    if (outcome.loss) {
      this.totalLoss++;
      if (decision.action !== "INTERVENE") {
        this.violationCount++;
      }
    }
  }

  report(): ContractReport {
    const avgLoss = this.totalLoss;
    return {
      totalLoss: avgLoss,
      interventionCount: this.interventionCount,
      violationCount: this.violationCount,
      recalibrationCount: this.recalibrationCount,
      lastRecalibrationReason: this.lastRecalibrationReason,
      epsilon: this.epsilon,
      epsilonSatisfied: avgLoss <= this.epsilon,
    };
  }

  reset(): void {
    this.totalLoss = 0;
    this.interventionCount = 0;
    this.violationCount = 0;
    this.recalibrationCount = 0;
    this.lastRecalibrationReason = null;
  }
}
