import { TrajectoryPrefix } from '../takt-core/types.js';

export interface Event<S, A> {
  state: S;
  action: A;
  timestamp: number;
}

export type GovernanceDecision =
  | { action: "MONITOR"; margin: number }
  | { action: "INTERVENE"; reason: string; margin: number }
  | { action: "MONITOR_SAFE"; margin: number }
  | { action: "RECALIBRATE"; reason: string };

export interface ContractReport {
  totalLoss: number;
  interventionCount: number;
  violationCount: number;
  recalibrationCount: number;
  lastRecalibrationReason: string | null;
  epsilon: number;
  epsilonSatisfied: boolean;
}

export interface Outcome {
  loss: boolean;
}

export function stateActionKey<S, A>(state: S, action: A): string {
  return JSON.stringify(state) + '::' + JSON.stringify(action);
}

export function eventToPrefix<S, A>(events: Event<S, A>[]): TrajectoryPrefix<S, A> {
  return {
    states: events.map(e => e.state),
    actions: events.map(e => e.action),
  };
}
