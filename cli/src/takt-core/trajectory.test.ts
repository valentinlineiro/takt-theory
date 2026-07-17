import { describe, it, expect } from 'vitest';
import { extractPrefix, observationSequence, observationallyEquivalent } from './trajectory.js';

describe('Trajectory utilities', () => {
  it('extracts prefix τ_{:k} from a trajectory', () => {
    const traj = {
      states: [{ id: 's0', value: 0 }, { id: 's1', value: 1 }, { id: 's2', value: 2 }],
      actions: [{ id: 'a0' }, { id: 'a1' }],
    };
    const prefix = extractPrefix(traj, 1);
    expect(prefix.states).toHaveLength(2);
    expect(prefix.states[1].id).toBe('s1');
    expect(prefix.actions).toHaveLength(1);
    expect(prefix.actions[0].id).toBe('a0');
  });

  it('computes observation sequence O(τ_{:k})', () => {
    const prefix = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω1' }],
      actions: [{ id: 'a0' }],
    };
    const O = (s: { id: string; obs: string }) => ({ id: s.obs });
    const seq = observationSequence(prefix, O);
    expect(seq).toHaveLength(2);
    expect(seq[0]).toEqual({ id: 'ω0' });
    expect(seq[1]).toEqual({ id: 'ω1' });
  });

  it('detects observational equivalence between prefixes', () => {
    const prefixA = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω1' }],
      actions: [{ id: 'a0' }],
    };
    const prefixB = {
      states: [{ id: 's2', obs: 'ω0' }, { id: 's3', obs: 'ω1' }],
      actions: [{ id: 'a1' }],
    };
    const O = (s: { id: string; obs: string }) => ({ id: s.obs });
    expect(observationallyEquivalent(prefixA, prefixB, O)).toBe(true);

    const prefixC = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω2' }],
      actions: [{ id: 'a0' }],
    };
    expect(observationallyEquivalent(prefixA, prefixC, O)).toBe(false);
  });
});
