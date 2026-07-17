import { TrajectoryPrefix } from '../takt-core/types.js';

export interface Event<S, A> {
  state: S;
  action: A;
  timestamp: number;
}

export type GovernanceDecision =
  | { action: "MONITOR"; margin: number }
  | { action: "INTERVENE"; reason: string; margin: number };

export interface ContractReport {
  totalLoss: number;
  interventionCount: number;
  violationCount: number;
  epsilon: number;
  epsilonSatisfied: boolean;
}

export interface Outcome {
  loss: boolean;
}

export function eventToPrefix<S, A>(events: Event<S, A>[]): TrajectoryPrefix<S, A> {
  return {
    states: events.map(e => e.state),
    actions: events.map(e => e.action),
  };
}
