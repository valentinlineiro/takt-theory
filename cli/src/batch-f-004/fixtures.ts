import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F004State { id: string; phase: 'nominal' | 'degraded' | 'failure'; }
export interface F004Action { id: string; }
export interface F004Obs { phase: string; }

export function buildGameTDS(): TransitionSystem<F004State, F004Action> {
  const nominal: F004State = { id: 'nominal', phase: 'nominal' };
  const degraded: F004State = { id: 'degraded', phase: 'degraded' };
  const failure: F004State = { id: 'failure', phase: 'failure' };

  return {
    states: [nominal, degraded, failure],
    actions: [{ id: 'nominal' }, { id: 'push' }, { id: 'intervene' }],
    transition: (s, a) => {
      if (a.id === 'nominal') return [{ state: nominal, prob: 1.0 }];
      if (a.id === 'push' && s.id === 'nominal')
        return [{ state: degraded, prob: 0.7 }, { state: failure, prob: 0.3 }];
      if (a.id === 'push' && s.id === 'degraded')
        return [{ state: failure, prob: 1.0 }];
      if (a.id === 'push' && s.id === 'failure')
        return [{ state: failure, prob: 1.0 }];
      if (a.id === 'intervene') return [{ state: nominal, prob: 1.0 }];
      return [{ state: s, prob: 1.0 }];
    },
  };
}

export const O: ObservationFn<F004State, F004Obs> = (s) => ({ phase: s.phase });

export const π_agent: AgentPolicy<F004State, F004Action, F004Obs> = () => ({ id: 'nominal' });

export const π_adv = (): F004Action => ({ id: 'push' });

export type AuditAction = 'monitor' | 'intervene';
export const π_audit_passive = (): AuditAction => 'monitor';
export const π_audit_active = (state: F004State): AuditAction =>
  state.phase === 'degraded' ? 'intervene' : 'monitor';
