import { describe, it, expect } from 'vitest';
import { executeBatchF001 } from './eval.js';

describe('Batch F-001: Coverage and Consistency', () => {
  it('validates coverage and consistency on a concrete TDS', () => {
    const result = executeBatchF001();
    expect(result.coverage).toBe(true);
    expect(result.consistency).toBe(true);
    expect(result.totalPrefixes).toBeGreaterThan(0);
    expect(result.coveredPrefixes).toBeGreaterThan(0);
  });

  it('detects coverage failure when T_audit is incomplete', () => {
    const result = executeBatchF001({ incompleteCoverage: true });
    expect(result.coverage).toBe(false);
    expect(result.coveredPrefixes).toBeLessThan(result.totalPrefixes);
  });

  it('detects consistency failure when D assigns different actions to equivalent prefixes', () => {
    const result = executeBatchF001({ inconsistentDecisions: true });
    expect(result.consistency).toBe(false);
  });
});
