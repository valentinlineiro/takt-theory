import { describe, it, expect } from 'vitest';
import { stateActionKey } from './types.js';
import { UncertaintySet } from './UncertaintySet.js';

describe('stateActionKey', () => {
  it('produces the same key for the same state and action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a0' });
    expect(k1).toBe(k2);
  });

  it('produces different keys for different actions on the same state', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a1' });
    expect(k1).not.toBe(k2);
  });

  it('produces different keys for different states with the same action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's1' }, { id: 'a0' });
    expect(k1).not.toBe(k2);
  });
});

describe('UncertaintySet', () => {
  const s0 = { id: 's0' };
  const a0 = { id: 'a0' };

  it('defaults to epsilon0 before any observation', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    expect(u.radius(s0, a0)).toBe(0.6);
  });

  it('shrinks as epsilon0 / sqrt(n) after n observations', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    expect(u.radius(s0, a0)).toBeCloseTo(0.6 / Math.sqrt(100), 10);
  });

  it('recover() resets the radius to epsilon0', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    u.recover(s0, a0);
    expect(u.radius(s0, a0)).toBe(0.6);
  });

  it('a later observation after recovery re-shrinks from zero, not from the stale count', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    u.recover(s0, a0);
    u.observe(s0, a0);
    expect(u.radius(s0, a0)).toBeCloseTo(0.6 / Math.sqrt(1), 10);
  });

  it('pMax caps at 1 and equals min(1, pHat + radius/2)', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    expect(u.pMax(s0, a0, 0.0)).toBeCloseTo(0.3, 10);
    expect(u.pMax(s0, a0, 0.9)).toBe(1);
  });

  it('tracks (s,a) pairs independently', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    const a1 = { id: 'a1' };
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    expect(u.radius(s0, a1)).toBe(0.6);
  });
});
