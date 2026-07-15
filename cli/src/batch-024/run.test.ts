import { describe, it, expect } from 'vitest';
import { evaluateCoarsenedRegret } from './evaluate.js';

describe('Batch-024 Coarsened Reachability Evaluation', () => {
  it('successfully calculates coarsened regret bounds and verifies partition compression', () => {
    const stats = evaluateCoarsenedRegret();
    expect(stats.length).toBe(2);

    const rMinimal = stats.find(r => r.name === 'R_minimal (Paths + Reach)')!;
    const rCoarse = stats.find(r => r.name === 'R_coarse (Paths + Coarsened Reach)')!;

    console.log(`[Batch-024 Global Regret Results]`);
    for (const r of stats) {
      console.log(`- ${r.name}: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, conflicts = ${r.conflictBins}, epsilon = ${r.epsilon.toFixed(2)}`);
    }

    expect(rMinimal.totalBins).toBe(412);
    expect(rCoarse.totalBins).toBe(313); // Finer to coarser compression confirmed
    expect(rCoarse.epsilon).toBeCloseTo(1.18, 2); // Scenario C confirmed
    expect(rCoarse.conflictBins).toBe(30);
  });
});
