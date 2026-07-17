import { describe, it, expect } from 'vitest';
import { executeBatchF004 } from './eval.js';

describe('Batch F-004: Auditor-Adversary Game', () => {
  it('synthesizes an audit policy that bounds expected loss', () => {
    const result = executeBatchF004();
    expect(result.expectedLoss).toBeLessThanOrEqual(result.epsilon);
  });

  it('detects contract violation under strong adversary', () => {
    const result = executeBatchF004({ strongAdversary: true });
    expect(result.expectedLoss).toBeGreaterThan(result.epsilon);
  });

  it('intervention reduces loss to 0 when triggered', () => {
    const result = executeBatchF004({ intervene: true });
    expect(result.expectedLoss).toBe(0);
  });
});
