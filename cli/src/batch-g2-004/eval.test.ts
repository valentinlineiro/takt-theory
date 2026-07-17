import { describe, it, expect } from 'vitest';
import { executeBatchG2004 } from './eval.js';

describe('G2-004: distribution shift adversary', () => {
  it('epsilon is tight before the shift', () => {
    const result = executeBatchG2004();
    expect(result.preShiftEpsilon).toBeLessThan(0.05);
  });

  it('drift exceeds tau once the window fills with post-shift observations', () => {
    const result = executeBatchG2004();
    expect(result.driftAfterShift).toBeGreaterThan(result.tau);
    expect(result.recalibrated).toBe(true);
  });

  it('recovery restores epsilon to epsilon0 immediately', () => {
    const result = executeBatchG2004();
    expect(result.postRecoveryEpsilonImmediate).toBe(0.6);
  });

  it('after fresh post-recovery evidence accumulates, the contract correctly flags the new dangerous regime', () => {
    const result = executeBatchG2004();
    expect(result.postRecoveryDecision).toBe('INTERVENE');
    expect(result.postRecoveryMDSafe).toBeLessThan(1.0);
  });
});
