import { describe, it, expect } from 'vitest';
import { executeBatchF003 } from './eval.js';

describe('Batch F-003: Guaranteed Intervention Horizon', () => {
  it('confirms that M_D > C_h^max implies no failure within h steps', () => {
    const result = executeBatchF003();
    expect(result.safePrefix.m_D).toBeGreaterThan(result.safePrefix.cMax);
    expect(result.safePrefix.failureWithinH).toBe(false);
  });

  it('detects failure within horizon when M_D ≤ C_h^max', () => {
    const result = executeBatchF003({ failureNearby: true });
    expect(result.riskyPrefix.m_D).toBeLessThanOrEqual(result.riskyPrefix.cMax);
    expect(result.riskyPrefix.failureWithinH).toBe(true);
  });
});
