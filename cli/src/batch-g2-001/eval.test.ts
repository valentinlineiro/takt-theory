import { describe, it, expect } from 'vitest';
import { executeBatchG2001 } from './eval.js';

describe('G2-001: optimistic model adversary', () => {
  it('robust margin remains conservative when P* sits exactly at the edge of U_t', () => {
    const result = executeBatchG2001();
    expect(result.invariantHolds).toBe(true);
    expect(result.mdSafe).toBeLessThanOrEqual(result.mdTrue + 1e-9);
  });

  it('P* at the edge is strictly less safe than the point estimate P_hat', () => {
    const result = executeBatchG2001();
    expect(result.pTrueFail).toBeGreaterThan(result.pHatFail);
  });
});
