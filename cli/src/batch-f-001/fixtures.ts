import { TrajectoryPrefix, ReferencePolicy, AgentPolicy, ObservationFn } from '../takt-core/types.js';

export interface F001State {
  id: string;
  rep: number;
  decision: number;
}

export interface F001Action {
  id: string;
}

export interface F001Obs {
  rep: number;
}

export const O: ObservationFn<F001State, F001Obs> = (s) => ({ rep: s.rep });

export const D: ReferencePolicy<F001State, F001Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return { id: `a${s.decision}`, value: s.decision } as F001Action;
};

export const π: AgentPolicy<F001State, F001Action, F001Obs> = (obs) => {
  const last = obs[obs.length - 1];
  return { id: `a${last.rep}`, value: last.rep } as F001Action;
};

export function buildPrefixes(withInconsistency?: boolean): {
  T_audit: TrajectoryPrefix<F001State, F001Action>[];
  allPrefixes: TrajectoryPrefix<F001State, F001Action>[];
} {
  const sa: F001State = { id: 'sA', rep: 0, decision: 0 };
  const sb: F001State = { id: 'sB', rep: 1, decision: 1 };

  const T_audit_full = [
    { states: [sa], actions: [] as F001Action[] },
    { states: [sb], actions: [] as F001Action[] },
  ];

  const allPrefixes = [
    { states: [sa], actions: [] as F001Action[] },
    { states: [sb], actions: [] as F001Action[] },
  ];

  if (withInconsistency) {
    const sc: F001State = { id: 'sC', rep: 1, decision: 0 };
    return {
      T_audit: [
        { states: [sa], actions: [] as F001Action[] },
        { states: [sc], actions: [] as F001Action[] },
      ],
      allPrefixes: [
        { states: [sa], actions: [] as F001Action[] },
        { states: [sb], actions: [] as F001Action[] },
        { states: [sc], actions: [] as F001Action[] },
      ],
    };
  }

  return { T_audit: T_audit_full, allPrefixes };
}
