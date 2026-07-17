import { describe, it, expect } from 'vitest';
import { executeBatchG2002 } from './eval.js';

describe('G2-002: uncertainty collapse adversary', () => {
  it('drift exceeds tau after a burst of anomalous observations', () => {
    const result = executeBatchG2002();
    expect(result.driftDetected).toBe(true);
    expect(result.drift).toBeGreaterThan(result.tau);
  });

  it('the margin alone (ignoring drift) would falsely report safety', () => {
    const result = executeBatchG2002();
    expect(result.naiveWouldFalselyMonitor).toBe(true);
  });

  it('AuditPolicy overrides the falsely-safe margin with RECALIBRATE', () => {
    const result = executeBatchG2002();
    expect(result.decisionWithMonitor).toBe('RECALIBRATE');
  });
});
