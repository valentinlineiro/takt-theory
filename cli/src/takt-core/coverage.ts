import { TrajectoryPrefix, ObservationFn } from './types.js';

export type ReferencePolicy<S, A> = (prefix: TrajectoryPrefix<S, A>) => A;
export type AgentPolicy<S, A, O> = (observations: O[]) => A;

export function checkCoverage<S, A, O>(
  T_audit: TrajectoryPrefix<S, A>[],
  allPrefixes: TrajectoryPrefix<S, A>[],
  obsFn: ObservationFn<S, O>,
  equiv: (a: TrajectoryPrefix<S, A>, b: TrajectoryPrefix<S, A>, fn: ObservationFn<S, O>) => boolean
): boolean {
  return allPrefixes.every(p =>
    T_audit.some(t => equiv(p, t, obsFn))
  );
}

export function checkConsistency<S, A, O>(
  T_audit: TrajectoryPrefix<S, A>[],
  D: ReferencePolicy<S, A>,
  obsFn: ObservationFn<S, O>,
  equiv: (a: TrajectoryPrefix<S, A>, b: TrajectoryPrefix<S, A>, fn: ObservationFn<S, O>) => boolean
): boolean {
  for (let i = 0; i < T_audit.length; i++) {
    for (let j = i + 1; j < T_audit.length; j++) {
      if (equiv(T_audit[i], T_audit[j], obsFn)) {
        const a_i = JSON.stringify(D(T_audit[i]));
        const a_j = JSON.stringify(D(T_audit[j]));
        if (a_i !== a_j) return false;
      }
    }
  }
  return true;
}
