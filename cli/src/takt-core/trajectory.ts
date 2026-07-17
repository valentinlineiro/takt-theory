import { Trajectory, TrajectoryPrefix, ObservationFn } from './types.js';

export function extractPrefix<S, A>(
  trajectory: Trajectory<S, A>,
  k: number
): TrajectoryPrefix<S, A> {
  return {
    states: trajectory.states.slice(0, k + 1),
    actions: trajectory.actions.slice(0, k),
  };
}

export function observationSequence<S, A, O>(
  prefix: TrajectoryPrefix<S, A>,
  obsFn: ObservationFn<S, O>
): O[] {
  return prefix.states.map(obsFn);
}

export function observationallyEquivalent<S, A, O>(
  a: TrajectoryPrefix<S, A>,
  b: TrajectoryPrefix<S, A>,
  obsFn: ObservationFn<S, O>
): boolean {
  const seqA = observationSequence(a, obsFn);
  const seqB = observationSequence(b, obsFn);
  if (seqA.length !== seqB.length) return false;
  return seqA.every((o, i) => JSON.stringify(o) === JSON.stringify(seqB[i]));
}
