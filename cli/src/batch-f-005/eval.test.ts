import { describe, it, expect } from 'vitest';
import { executeBatchF005, betaSweep } from './eval.js';

describe('Batch F-005: Estimation Error in P — H-F005', () => {
  const steps = 1000;

  it('baseline (δ=0): no perturbation, perfect decisions', () => {
    const result = executeBatchF005({ perturbationType: 'none', delta: 0, steps });
    const s = result.scenarios[0];
    expect(s.deltaM_D).toBeCloseTo(0, 4);
    expect(s.falseSafeRate).toBe(0);
    expect(s.falseAlarmRate).toBe(0);
    // with threshold=1.5 and mdTrue=1.204, should intervene every step
    expect(s.interventionCount).toBe(steps);
  });

  it('optimistic bias (δ=0.5): overconfident → false safes appear', () => {
    const result = executeBatchF005({ perturbationType: 'optimistic', delta: 0.5, steps });
    const s = result.scenarios[0];
    // mdEst > mdTrue → positive deltaM_D
    expect(s.deltaM_D).toBeGreaterThan(0);
    // mdEst > threshold → auditor monitors when it should intervene → failures
    expect(s.accumulatedLoss).toBeGreaterThan(0);
    expect(s.interventionCount).toBeLessThan(steps);
  });

  it('pessimistic bias (δ=0.5): overcautious → false alarms appear', () => {
    const result = executeBatchF005({ perturbationType: 'pessimistic', delta: 0.5, steps });
    const s = result.scenarios[0];
    expect(s.deltaM_D).toBeLessThan(0);
  });

  it('random perturbation (δ=0.5): produces valid metrics', () => {
    const result = executeBatchF005({ perturbationType: 'random', delta: 0.5, steps: 200 });
    const s = result.scenarios[0];
    expect(typeof s.deltaM_D).toBe('number');
    expect(s.totalSteps).toBe(200);
    expect(s.interventionCount).toBeGreaterThanOrEqual(0);
    expect(s.interventionCount).toBeLessThanOrEqual(200);
  });

  it('four-scenario run returns consistent structure', () => {
    const result = executeBatchF005({ delta: 0.5, steps: 100 });
    expect(result.scenarios).toHaveLength(4);
    const types = result.scenarios.map(s => s.perturbationType);
    expect(types).toEqual(['none', 'optimistic', 'pessimistic', 'random']);
    for (const s of result.scenarios) {
      expect(typeof s.deltaM_D).toBe('number');
      expect(typeof s.falseSafeRate).toBe('number');
      expect(typeof s.falseAlarmRate).toBe('number');
      expect(typeof s.accumulatedLoss).toBe('number');
      expect(s.totalSteps).toBe(100);
    }
  });

  describe('F-005.1: Beta correction sweep — H-F005.1', () => {
    const betas = [0, 0.05, 0.1, 0.2, 0.3, 0.5, 1.0];
    const steps = 5000;

    it('β=0 with optimistic bias produces false safes', () => {
      const result = betaSweep({
        perturbationType: 'optimistic', delta: 0.5,
        auditThreshold: 1.5, steps, betas: [0],
      });
      expect(result.points[0].falseSafeRate).toBeGreaterThan(0.05);
      expect(result.points[0].expectedLoss).toBeGreaterThan(0.05);
    });

    it('β=1.0 corrects optimistic bias, false safes near zero', () => {
      const result = betaSweep({
        perturbationType: 'optimistic', delta: 0.5,
        auditThreshold: 1.5, steps, betas: [1.0],
      });
      expect(result.points[0].falseSafeRate).toBeLessThan(0.05);
    });

    it('false safe rate decreases with β (monotonic trend)', () => {
      const result = betaSweep({
        perturbationType: 'optimistic', delta: 0.5,
        auditThreshold: 1.5, steps, betas,
      });
      // overall trend: first vs last
      expect(result.points[result.points.length - 1].falseSafeRate)
        .toBeLessThan(result.points[0].falseSafeRate);
    });

    it('false alarm rate increases with β (monotonic trend)', () => {
      const result = betaSweep({
        perturbationType: 'optimistic', delta: 0.5,
        auditThreshold: 1.5, steps, betas,
      });
      expect(result.points[result.points.length - 1].falseAlarmRate)
        .toBeGreaterThan(result.points[0].falseAlarmRate);
    });

    it('pessimistic bias: β correction increases false alarms', () => {
      const result = betaSweep({
        perturbationType: 'pessimistic', delta: 0.5,
        auditThreshold: 1.5, steps, betas: [0, 1.0],
      });
      // β subtracts from M_D, making pessimistic even more intervention-happy
      expect(result.points[1].falseAlarmRate)
        .toBeGreaterThanOrEqual(result.points[0].falseAlarmRate);
    });

    it('sweep returns a point per beta with all metrics', () => {
      const result = betaSweep({
        perturbationType: 'optimistic', delta: 0.5,
        auditThreshold: 1.5, steps: 100, betas: [0, 0.2, 0.5],
      });
      expect(result.points).toHaveLength(3);
      for (const p of result.points) {
        expect(Object.keys(p)).toEqual([
          'beta', 'falseSafeRate', 'falseAlarmRate',
          'expectedLoss', 'operationalUtility', 'interventionRate',
        ]);
      }
    });
  });
});
