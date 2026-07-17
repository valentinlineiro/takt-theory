import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F002State { id: string; }
export interface F002Action { id: string; }
export interface F002Obs { id: string; }

// Chain: s0 -a0→ s1 (P=0.8) -a0→ s2 (P=1.0)
// D(s0)=a0 (agrees with π), D(s1)=a1 (loss), D(s2)=a1 (loss)
// π always picks a0 → decision loss at s1 (a1≠a0), s2 (a1≠a0)
export const buildTDS = (): TransitionSystem<F002State, F002Action> => ({
  states: [{ id: 's0' }, { id: 's1' }, { id: 's2' }],
  actions: [{ id: 'a0' }, { id: 'a1' }],
  transition: (s, a) => {
    if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.8 }];
    if (s.id === 's0' && a.id === 'a1') return [{ state: { id: 's2' }, prob: 0.2 }];
    if (s.id === 's1') return [{ state: { id: 's2' }, prob: 1.0 }];
    if (s.id === 's2') return [{ state: { id: 's2' }, prob: 1.0 }];
    return [];
  },
});

export const O: ObservationFn<F002State, F002Obs> = (s) => ({ id: s.id });
export const D: ReferencePolicy<F002State, F002Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return s.id === 's0' ? { id: 'a0' } : { id: 'a1' };
};
export const π: AgentPolicy<F002State, F002Action, F002Obs> = () => ({ id: 'a0' });
