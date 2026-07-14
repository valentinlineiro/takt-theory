import { describe, it, expect } from 'vitest';
import { runBatch012 } from './run.js';

describe('Batch-012 run pipeline', () => {
  it('executes clean and corrupt runs across the test matrix', () => {
    const results = runBatch012();
    expect(results.length).toBeGreaterThan(0);
    const dep005 = results.find(r => r.caseId === 'DEP-005');
    expect(dep005).toBeDefined();
    expect(dep005?.cleanStates.length).toBeGreaterThan(0);
    expect(dep005?.corruptStates.length).toBeGreaterThan(0);
  });
});
