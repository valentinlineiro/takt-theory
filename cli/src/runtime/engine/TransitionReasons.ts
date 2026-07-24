export type GovernanceState = 'MONITOR_SAFE' | 'RECALIBRATE' | 'INTERVENE_FALLBACK';

export type TransitionReason =
  | 'WithinHorizonBoundary'
  | 'HorizonExceeded'
  | 'ContractViolationDetected'
  | 'RecalibrationSucceeded'
  | 'ObservationUnavailable'
  | 'Timeout';

export type EvaluationOutcome = 'SAFE' | 'RECALIBRATED' | 'FALLBACK' | 'REJECTED';

export interface EvaluationContext {
  readonly currentStep: number;
  readonly cumulativeDrift: number;
  readonly horizonBound: number;
  readonly isContractViolated: boolean;
}

export interface StateTransitionRule {
  readonly fromState: GovernanceState;
  readonly toState: GovernanceState;
  readonly reason: TransitionReason;
  readonly outcome: EvaluationOutcome;
  readonly guard: (context: EvaluationContext) => boolean;
}
