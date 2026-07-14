import { describe, it, expect } from 'vitest';
import { runBatch010 } from './run.js';

describe('Batch-010 run pipeline', () => {
  it('executes clean and corrupt runs across the test matrix', () => {
    const results = runBatch010();
    expect(results.length).toBeGreaterThan(0);
    const wrk002 = results.find(r => r.caseId === 'WRK-002');
    expect(wrk002).toBeDefined();
    expect(wrk002?.cleanStates.length).toBeGreaterThan(0);
    expect(wrk002?.corruptStates.length).toBeGreaterThan(0);
  });
});
