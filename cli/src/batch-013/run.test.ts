import { describe, it, expect } from 'vitest';
import { runBatch013 } from './run.js';

describe('Batch-013 run pipeline', () => {
  it('executes clean and corrupt runs across the test matrix', () => {
    const results = runBatch013();
    expect(results.length).toBeGreaterThan(0);
    const dep005 = results.find(r => r.caseId === 'DEP-005');
    expect(dep005).toBeDefined();
  });
});
