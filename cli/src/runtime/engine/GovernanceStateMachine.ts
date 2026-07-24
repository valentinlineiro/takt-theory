import type { GovernanceState, StateTransitionRule, EvaluationContext } from './TransitionReasons.js';

export class GovernanceStateMachine {
  private currentState: GovernanceState = 'MONITOR_SAFE';

  private rules: StateTransitionRule[] = [
    {
      fromState: 'MONITOR_SAFE',
      toState: 'MONITOR_SAFE',
      reason: 'WithinHorizonBoundary',
      outcome: 'SAFE',
      guard: (ctx) => !ctx.isContractViolated && ctx.currentStep <= ctx.horizonBound
    },
    {
      fromState: 'MONITOR_SAFE',
      toState: 'RECALIBRATE',
      reason: 'HorizonExceeded',
      outcome: 'RECALIBRATED',
      guard: (ctx) => !ctx.isContractViolated && ctx.currentStep > ctx.horizonBound
    },
    {
      fromState: 'MONITOR_SAFE',
      toState: 'INTERVENE_FALLBACK',
      reason: 'ContractViolationDetected',
      outcome: 'FALLBACK',
      guard: (ctx) => ctx.isContractViolated
    },
    {
      fromState: 'RECALIBRATE',
      toState: 'MONITOR_SAFE',
      reason: 'RecalibrationSucceeded',
      outcome: 'SAFE',
      guard: (ctx) => !ctx.isContractViolated
    },
    {
      fromState: 'RECALIBRATE',
      toState: 'INTERVENE_FALLBACK',
      reason: 'ContractViolationDetected',
      outcome: 'FALLBACK',
      guard: (ctx) => ctx.isContractViolated
    }
  ];

  public evaluateStep(context: EvaluationContext): { newState: GovernanceState; rule: StateTransitionRule } {
    const matchingRule = this.rules.find(
      (r) => r.fromState === this.currentState && r.guard(context)
    );

    if (!matchingRule) {
      throw new Error(`Invalid state transition for state=${this.currentState}`);
    }

    this.currentState = matchingRule.toState;
    return { newState: this.currentState, rule: matchingRule };
  }

  public getCurrentState(): GovernanceState {
    return this.currentState;
  }

  public reset(): void {
    this.currentState = 'MONITOR_SAFE';
  }
}
