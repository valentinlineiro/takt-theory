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

import { RobustMarginEstimator } from './RobustMarginEstimator.js';
import { DynamicMarginEstimator } from './DynamicMarginEstimator.js';
import type { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';

describe('RobustMarginEstimator', () => {
  interface GState { id: string; }
  interface GAction { id: string; }
  interface GObs { id: string; }

  const s0: GState = { id: 's0' };
  const sSafe: GState = { id: 's_safe' };
  const sFail: GState = { id: 's_fail' };
  const a0: GAction = { id: 'a0' };

  function buildTDS(pFail: number): TransitionSystem<GState, GAction> {
    return {
      states: [s0, sSafe, sFail],
      actions: [a0],
      transition: (s) => {
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

  const O = (s: GState): GObs => ({ id: s.id });
  const D = (_p: TrajectoryPrefix<GState, GAction>): GAction => a0;
  const π = (obs: GObs[]): GAction => {
    const last = obs[obs.length - 1];
    return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
  };

  it('with zero uncertainty (epsilon=0) and an exact point estimate, matches DynamicMarginEstimator', () => {
    const trueP = 0.3;
    const tds = buildTDS(trueP);

    const estimator = new TransitionEstimator<GState, GAction>(20);
    for (let i = 0; i < 700; i++) estimator.observe(s0, a0, sSafe);
    for (let i = 0; i < 300; i++) estimator.observe(s0, a0, sFail);

    const uncertainty = new UncertaintySet<GState, GAction>(0);
    for (let i = 0; i < 1000; i++) uncertainty.observe(s0, a0);

    const robust = new RobustMarginEstimator(tds, estimator, uncertainty, D, π, O);
    const dynamic = new DynamicMarginEstimator(tds, D, π, O);

    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    expect(robust.estimate(prefix)).toBeCloseTo(dynamic.estimate(prefix), 6);
  });

  it('widening epsilon never increases the margin (robust margin is conservative)', () => {
    const tds = buildTDS(0.3);
    const estimator = new TransitionEstimator<GState, GAction>(20);
    for (let i = 0; i < 700; i++) estimator.observe(s0, a0, sSafe);
    for (let i = 0; i < 300; i++) estimator.observe(s0, a0, sFail);

    const tightUncertainty = new UncertaintySet<GState, GAction>(0.01);
    for (let i = 0; i < 1000; i++) tightUncertainty.observe(s0, a0);
    const wideUncertainty = new UncertaintySet<GState, GAction>(0.6);
    for (let i = 0; i < 1000; i++) wideUncertainty.observe(s0, a0);

    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    const tight = new RobustMarginEstimator(tds, estimator, tightUncertainty, D, π, O).estimate(prefix);
    const wide = new RobustMarginEstimator(tds, estimator, wideUncertainty, D, π, O).estimate(prefix);
    expect(wide).toBeLessThanOrEqual(tight);
  });

  it('an unobserved (s,a) pair still yields a finite margin via the epsilon/2 prior', () => {
    const tds = buildTDS(0.3);
    const estimator = new TransitionEstimator<GState, GAction>(20);
    const uncertainty = new UncertaintySet<GState, GAction>(0.6);
    const robust = new RobustMarginEstimator(tds, estimator, uncertainty, D, π, O);
    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    const margin = robust.estimate(prefix);
    expect(margin).toBeGreaterThan(0);
    expect(margin).toBeLessThan(Infinity);
    expect(margin).toBeCloseTo(-Math.log(0.3), 6);
  });
});

import { AuditPolicy } from './AuditPolicy.js';
import { ContractEvaluator } from './ContractEvaluator.js';

describe('AuditPolicy.decideSafe', () => {
  it('returns RECALIBRATE when drift exceeds tau, regardless of margin', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(10, 0.5, 0.6, 0.3);
    expect(decision.action).toBe('RECALIBRATE');
  });

  it('returns RECALIBRATE when drift exceeds tau even if margin is below threshold', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(0.1, 0.5, 0.6, 0.3);
    expect(decision.action).toBe('RECALIBRATE');
  });

  it('returns INTERVENE when drift is within tau but margin is below threshold', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(0.1, 0.5, 0.1, 0.3);
    expect(decision.action).toBe('INTERVENE');
  });

  it('returns MONITOR_SAFE when drift is within tau and margin is at or above threshold', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(1.0, 0.5, 0.1, 0.3);
    expect(decision.action).toBe('MONITOR_SAFE');
  });

  it('G1 decide() is unaffected', () => {
    const policy = new AuditPolicy();
    expect(policy.decide(0.1, 0.5).action).toBe('INTERVENE');
    expect(policy.decide(1.0, 0.5).action).toBe('MONITOR');
  });
});

describe('ContractEvaluator RECALIBRATE tracking', () => {
  it('counts recalibrations and records the last reason', () => {
    const evaluator = new ContractEvaluator(0.3);
    evaluator.evaluate({ action: 'RECALIBRATE', reason: 'Δ=0.60 > τ=0.30' }, { loss: false });
    const report = evaluator.report();
    expect(report.recalibrationCount).toBe(1);
    expect(report.lastRecalibrationReason).toBe('Δ=0.60 > τ=0.30');
  });

  it('reset() clears recalibration tracking', () => {
    const evaluator = new ContractEvaluator(0.3);
    evaluator.evaluate({ action: 'RECALIBRATE', reason: 'first' }, { loss: false });
    evaluator.reset();
    const report = evaluator.report();
    expect(report.recalibrationCount).toBe(0);
    expect(report.lastRecalibrationReason).toBeNull();
  });
});
