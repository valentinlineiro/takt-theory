import { describe, it, expect } from 'vitest';
import { performAdversarySearch } from './search.js';

describe('Batch-016 Combinatorial Search', () => {
  it('successfully executes the search over 38,760 configurations and calculates bounds', () => {
    const results = performAdversarySearch();
    expect(results.length).toBe(3);

    const b0 = results[0].maxRegret;
    const b1 = results[1].maxRegret;
    const b2 = results[2].maxRegret;

    console.log(`[Batch-016 Search results]`);
    console.log(`k=0: Max Regret B(0) = ${b0.toFixed(2)}, Silent Count = ${results[0].silentCount}`);
    console.log(`k=1: Max Regret B(1) = ${b1.toFixed(2)}, Silent Count = ${results[1].silentCount}`);
    console.log(`k=2: Max Regret B(2) = ${b2.toFixed(2)}, Silent Count = ${results[2].silentCount}`);

    // Verify Monotonicity
    expect(b0).toBeGreaterThanOrEqual(b1);
    expect(b1).toBeGreaterThanOrEqual(b2);
  });
});
