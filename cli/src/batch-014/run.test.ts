import { describe, it, expect } from 'vitest';
import { runBatch014 } from './run.js';

describe('Batch-014 Augmented Metric Assertions', () => {
  it('correctly calculates d_X1 and d_X2 and matches ex-ante predictions', () => {
    const results = runBatch014();
    const target = results.find(r => r.caseId === 'DEP-005' && r.incidence > 0.00)!;

    // Delta deviation at transition step 1 -> 2 (index 0)
    const d_X1 = Math.abs(target.corruptD1[0] - target.cleanD1[0]);
    const d_X2 = Math.abs(target.corruptD2[0] - target.cleanD2[0]);

    // Match ex-ante predictions
    expect(d_X1).toBeCloseTo(0.01);
    expect(d_X2).toBeCloseTo(0.79);
  });
});
