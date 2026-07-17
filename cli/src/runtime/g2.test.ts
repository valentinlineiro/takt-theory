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

import { TransitionEstimator } from './TransitionEstimator.js';

describe('TransitionEstimator', () => {
  const s0 = { id: 's0' };
  const sSafe = { id: 's_safe' };
  const sFail = { id: 's_fail' };
  const a0 = { id: 'a0' };

  it('count is 0 before any observation', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    expect(e.count(s0, a0)).toBe(0);
  });

  it('estimate is 0 for any candidate before any observation', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    expect(e.estimate(s0, a0, sFail)).toBe(0);
  });

  it('estimate reflects observed frequencies over full history', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 71; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 29; i++) e.observe(s0, a0, sFail);
    expect(e.count(s0, a0)).toBe(100);
    expect(e.estimate(s0, a0, sFail)).toBeCloseTo(0.29, 10);
    expect(e.estimate(s0, a0, sSafe)).toBeCloseTo(0.71, 10);
  });

  it('windowEstimate reflects only the most recent windowSize observations', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(5);
    for (let i = 0; i < 50; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 5; i++) e.observe(s0, a0, sFail);
    expect(e.windowEstimate(s0, a0, sFail)).toBe(1);
    expect(e.estimate(s0, a0, sFail)).toBeCloseTo(5 / 55, 10);
  });

  it('forget clears full-history counts but not the window', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(5);
    for (let i = 0; i < 50; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 5; i++) e.observe(s0, a0, sFail);
    e.forget(s0, a0);
    expect(e.count(s0, a0)).toBe(0);
    expect(e.estimate(s0, a0, sFail)).toBe(0);
    expect(e.windowEstimate(s0, a0, sFail)).toBe(1);
  });

  it('tracks (s,a) pairs independently', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    const a1 = { id: 'a1' };
    for (let i = 0; i < 10; i++) e.observe(s0, a0, sFail);
    expect(e.count(s0, a1)).toBe(0);
  });
});

import { ValidityMonitor } from './ValidityMonitor.js';

describe('ValidityMonitor', () => {
  const s0 = { id: 's0' };
  const sSafe = { id: 's_safe' };
  const sFail = { id: 's_fail' };
  const a0 = { id: 'a0' };
  const candidates = [s0, sSafe, sFail];

  it('drift is 0 when window and full-history estimates agree', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 100; i++) e.observe(s0, a0, i % 5 === 0 ? sFail : sSafe);
    const v = new ValidityMonitor(e, candidates, 0.3);
    expect(v.drift(s0, a0)).toBeLessThan(0.01);
  });

  it('drift is large when a burst of anomalous observations fills the window', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 500; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 15; i++) e.observe(s0, a0, sFail);
    const v = new ValidityMonitor(e, candidates, 0.3);
    expect(v.drift(s0, a0)).toBeGreaterThan(0.3);
  });

  it('isMismatched compares drift against tau', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 500; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 15; i++) e.observe(s0, a0, sFail);
    const strict = new ValidityMonitor(e, candidates, 0.3);
    const lenient = new ValidityMonitor(e, candidates, 1.5);
    expect(strict.isMismatched(s0, a0)).toBe(true);
    expect(lenient.isMismatched(s0, a0)).toBe(false);
  });
});
