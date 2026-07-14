import { describe, it, expect } from 'vitest';
import { executeBatch005 } from './eval.js';

describe('Batch-005 Evaluation Suite', () => {
  it('calculates the comparative baselines and scorecard metrics successfully', () => {
    const results = executeBatch005();

    // Check OIA is 100% for Adaptive and Global
    expect(results.adaptive.oia).toBeCloseTo(100.0, 1);
    expect(results.global.oia).toBeCloseTo(100.0, 1);

    // Check Escalation Precision is 100% (since DRU prevents over-escalation)
    expect(results.adaptive.ep).toBeCloseTo(100.0, 1);

    // Check Unnecessary Escalation Rate is 0%
    expect(results.adaptive.uer).toBeCloseTo(0.0, 1);

    // Check Capability Value Gain is medible (> 0)
    expect(results.adaptive.cvg).toBeGreaterThan(0.0);
    expect(results.adaptive.uerReduction).toBeGreaterThan(0.0);
  });
});
