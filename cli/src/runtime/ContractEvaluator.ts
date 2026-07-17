import { GovernanceDecision, ContractReport, Outcome } from './types.js';

export class ContractEvaluator {
  private totalLoss = 0;
  private interventionCount = 0;
  private violationCount = 0;
  readonly epsilon: number;

  constructor(epsilon: number) {
    this.epsilon = epsilon;
  }

  evaluate(decision: GovernanceDecision, outcome: Outcome): void {
    if (decision.action === "INTERVENE") {
      this.interventionCount++;
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
      epsilon: this.epsilon,
      epsilonSatisfied: avgLoss <= this.epsilon,
    };
  }

  reset(): void {
    this.totalLoss = 0;
    this.interventionCount = 0;
    this.violationCount = 0;
  }
}
