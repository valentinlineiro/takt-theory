import { describe, it, expect } from 'vitest';
import { executeBatchF002 } from './eval.js';

describe('Batch F-002: Dynamic Margin', () => {
  it('computes M_D correctly for a chain with known failure point', () => {
    const result = executeBatchF002();
    // s0-safe: D and π agree on s0 → M_D should be > 0
    expect(result.margins.s0).toBeGreaterThan(0);
    // s0-safe should have margin = cost from s0 to s1 = -log(0.8) ≈ 0.223
    expect(result.margins.s0).toBeCloseTo(-Math.log(0.8), 4);
  });

  it('reports ∞ margin when no failure is reachable', () => {
    const result = executeBatchF002({ unreachableFailure: true });
    expect(result.margins.safe).toBe(Infinity);
  });

  it('reports 0 margin when already in failure state', () => {
    const result = executeBatchF002();
    expect(result.margins.s2).toBe(0);
  });
});
