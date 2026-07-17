import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F003State { id: string; }
export interface F003Action { id: string; }
export interface F003Obs { id: string; }

export function buildSafeTDS(): TransitionSystem<F003State, F003Action> {
  return {
    states: [{ id: 's0' }, { id: 's1' }, { id: 's2' }],
    actions: [{ id: 'a0' }, { id: 'a1' }],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.5 }];
      if (s.id === 's1' && a.id === 'a0') return [{ state: { id: 's2' }, prob: 0.5 }];
      if (s.id === 's2') return [{ state: { id: 's2' }, prob: 1.0 }];
      return [{ state: { id: s.id }, prob: 1.0 }];
    },
  };
}

export function buildRiskyTDS(): TransitionSystem<F003State, F003Action> {
  return {
    states: [{ id: 's0' }, { id: 's1' }],
    actions: [{ id: 'a0' }],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.9 }];
      if (s.id === 's1') return [{ state: { id: 's1' }, prob: 1.0 }];
      return [];
    },
  };
}

export const O: ObservationFn<F003State, F003Obs> = (s) => ({ id: s.id });
export const D: ReferencePolicy<F003State, F003Action> = () => ({ id: 'a0' });
export const π: AgentPolicy<F003State, F003Action, F003Obs> = () => ({ id: 'a0' });

export const lossD: ReferencePolicy<F003State, F003Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return s.id === 's1' ? { id: 'a1' } : { id: 'a0' };
};
export const lossπ: AgentPolicy<F003State, F003Action, F003Obs> = () => ({ id: 'a0' });
