import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F005State { id: string; }
export interface F005Action { id: string; }
export interface F005Obs { id: string; }

const a0: F005Action = { id: 'a0' };

export type PerturbationType = 'none' | 'random' | 'optimistic' | 'pessimistic';

export const O: ObservationFn<F005State, F005Obs> = (s) => ({ id: s.id });

export const D: ReferencePolicy<F005State, F005Action> = () => ({ id: 'a0' });

export const π: AgentPolicy<F005State, F005Action, F005Obs> = (obs) => {
  const last = obs[obs.length - 1];
  return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
};

const allStates = [{ id: 's0' }, { id: 's_safe' }, { id: 's_fail' }];

export function buildGroundTruthTDS(pFail: number): TransitionSystem<F005State, F005Action> {
  return {
    states: allStates,
    actions: [a0],
    transition: (s) => {
      if (s.id === 's0') return [
        { state: { id: 's_safe' }, prob: 1 - pFail },
        { state: { id: 's_fail' }, prob: pFail },
      ];
      if (s.id === 's_safe') return [{ state: { id: 's0' }, prob: 1.0 }];
      if (s.id === 's_fail') return [{ state: { id: 's_fail' }, prob: 1.0 }];
      return [];
    },
  };
}

function renormalize(probs: number[]): number[] {
  const sum = probs.reduce((a, b) => a + b, 0);
  return sum > 0 ? probs.map(p => p / sum) : probs;
}

export function computeEffectivePFail(
  baseP: number,
  type: PerturbationType,
  delta: number
): number {
  if (type === 'none' || delta === 0) return baseP;
  const rawSafe = 1 - baseP;
  const rawFail = baseP;
  let perturbed: number[];
  if (type === 'random') {
    perturbed = [rawSafe, rawFail].map(p => Math.max(0, p + (Math.random() - 0.5) * 2 * delta));
  } else if (type === 'optimistic') {
    perturbed = [rawSafe, Math.max(0, rawFail * (1 - delta))];
  } else {
    perturbed = [Math.max(0, rawSafe * (1 - delta)), rawFail * (1 + delta)];
  }
  const normed = renormalize(perturbed);
  return normed[1];
}

export function computeMD(pFail: number): number {
  const costFail = -Math.log(pFail);
  const costSafe = -Math.log(1 - pFail);
  const mdFromSafe = costSafe + 0;
  const mdFromFail = costFail + 0;
  return Math.min(mdFromSafe === costSafe ? Infinity : mdFromSafe, mdFromFail);
}

export function computeMDExact(pFail: number): number {
  if (pFail <= 0 || pFail >= 1) return pFail <= 0 ? Infinity : 0;
  return -Math.log(pFail);
}

export function makeAuditPolicy(pFailEst: number, threshold: number) {
  return (_prefix: TrajectoryPrefix<F005State, F005Action>) => {
    const md = computeMDExact(pFailEst);
    return md < threshold;
  };
}

export function sampleTransition(pFail: number): F005State {
  return Math.random() < pFail
    ? { id: 's_fail' }
    : { id: 's_safe' };
}
