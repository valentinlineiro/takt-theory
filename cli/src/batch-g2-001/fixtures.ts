import { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';

export interface G2State { id: string; }
export interface G2Action { id: string; }
export interface G2Obs { id: string; }

export const s0: G2State = { id: 's0' };
export const sSafe: G2State = { id: 's_safe' };
export const sFail: G2State = { id: 's_fail' };
export const a0: G2Action = { id: 'a0' };

export function buildBinaryTDS(pFail: number): TransitionSystem<G2State, G2Action> {
  return {
    states: [s0, sSafe, sFail],
    actions: [a0],
    transition: (s, a) => {
      if (s.id === 's0') return [
        { state: sSafe, prob: 1 - pFail },
        { state: sFail, prob: pFail },
      ];
      if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
      if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
      return [];
    },
  };
}

export const O = (s: G2State): G2Obs => ({ id: s.id });
export const D: ReferencePolicy<G2State, G2Action> = (_p: TrajectoryPrefix<G2State, G2Action>) => a0;
export const π = (obs: G2Obs[]): G2Action => {
  const last = obs[obs.length - 1];
  return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
};
