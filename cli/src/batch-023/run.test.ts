import { describe, it, expect } from 'vitest';
import { evaluateQuotientPartition } from './evaluate.js';

describe('Batch-023 Quotient Partition Evaluation', () => {
  it('successfully calculates partition sizes and verifies quotient refinement', () => {
    const result = evaluateQuotientPartition();
    console.log(`[Batch-023 Quotient Results]`);
    console.log(`- Minimal Bins (N_minimal): ${result.totalMinimalBins}`);
    console.log(`- Utility Bins (N_util): ${result.totalUtilBins}`);
    console.log(`- Utility Conflict Bins: ${result.utilityConflictBins}`);
    console.log(`- Decision Conflict Bins: ${result.decisionConflictBins}`);
    console.log(`- Refines Utility check passed: ${result.hasSingleUtilityMapping}`);
    console.log(`- Refines Decision check passed: ${result.hasSingleDecisionMapping}`);

    expect(result.totalMinimalBins).toBe(412);
    expect(result.totalUtilBins).toBe(38);
    expect(result.decisionConflictBins).toBe(0);
    expect(result.hasSingleDecisionMapping).toBe(true);
    expect(result.utilityConflictBins).toBe(132);
    expect(result.hasSingleUtilityMapping).toBe(false);
  });
});
