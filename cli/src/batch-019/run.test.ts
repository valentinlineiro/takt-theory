import { describe, it, expect } from 'vitest';
import { evaluateCompositionalRegret } from './evaluate.js';

describe('Batch-019 Compositional Regret Evaluation', () => {
  it('successfully calculates epsilon regret bounds across representations including path invariants', () => {
    const stats = evaluateCompositionalRegret();
    expect(stats.length).toBe(2);

    const rDist = stats.find(r => r.name === 'R_dist (Omega + X_dist)')!;
    const rPath = stats.find(r => r.name === 'R_path (R_dist + X_path)')!;

    console.log(`[Batch-019 Global Regret Results]`);
    for (const r of stats) {
      console.log(`- ${r.name}: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, conflicts = ${r.conflictBins}, epsilon = ${r.epsilon.toFixed(2)}`);
    }

    expect(rDist.epsilon).toBeGreaterThanOrEqual(rPath.epsilon);
    expect(rPath.epsilon).toBeCloseTo(15.58); // Falsified ex-ante prediction check
  });
});
