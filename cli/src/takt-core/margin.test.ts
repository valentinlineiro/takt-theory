import { describe, it, expect } from 'vitest';
import { computeDynamicMargin, computeCMax, TransitionSystem } from './margin.js';

interface TState { id: string; group: number; }
interface TAction { id: string; }

describe('Dynamic Margin', () => {
  const s0: TState = { id: 's0', group: 0 };
  const s1: TState = { id: 's1', group: 1 };
  const s2: TState = { id: 's2', group: 2 };
  const a0: TAction = { id: 'a0' };
  const a1: TAction = { id: 'a1' };

  const tds: TransitionSystem<TState, TAction> = {
    states: [s0, s1, s2],
    actions: [a0, a1],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: s1, prob: 1.0 }];
      if (s.id === 's0' && a.id === 'a1') return [{ state: s2, prob: 0.3 }];
      if (s.id === 's1' && a.id === 'a0') return [{ state: s2, prob: 1.0 }];
      if (s.id === 's2') return [{ state: s2, prob: 1.0 }];
      return [];
    },
  };

  function D(prefix: { states: TState[]; actions: TAction[] }): TAction {
    const s = prefix.states[prefix.states.length - 1];
    return s.id === 's1' ? a1 : a0;
  }

  function π(obs: { group: number }[]): TAction {
    return a0;
  }

  const O = (s: TState) => ({ group: s.group });

  it('computes M_D as minimum -log P cost to decision loss', () => {
    const prefix = { states: [s0], actions: [] as TAction[] };
    const md = computeDynamicMargin(prefix, tds, D, π, O);
    expect(md).toBeCloseTo(0, 6);
  });

  it('computes M_D as Infinity when no failure is reachable', () => {
    const prefix = { states: [s2], actions: [] as TAction[] };
    const md = computeDynamicMargin(prefix, tds, D, π, O);
    expect(md).toBe(Infinity);
  });
});

describe('C_h^max', () => {
  const s0 = { id: 's0', group: 0 };
  const s1 = { id: 's1', group: 1 };
  const a0 = { id: 'a0' };

  it('computes maximum cost of any h-step path', () => {
    const tds: TransitionSystem<typeof s0, typeof a0> = {
      states: [s0, s1],
      actions: [a0],
      transition: (s) => {
        if (s.id === 's0') return [{ state: s1, prob: 0.5 }];
        return [{ state: s1, prob: 1.0 }];
      },
    };
    const prefix = { states: [s0], actions: [] as typeof a0[] };
    const cmax = computeCMax(prefix, 1, tds);
    expect(cmax).toBeCloseTo(-Math.log(0.5), 6);
  });
});
