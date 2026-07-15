import { describe, it, expect } from 'vitest';
import { evaluateGlobalRegret } from './evaluate.js';

describe('Batch-018 Global Regret Evaluation', () => {
  it('successfully calculates epsilon regret bounds across all 4 representations', () => {
    const stats = evaluateGlobalRegret();
    expect(stats.length).toBe(4);

    const r0 = stats.find(r => r.name === 'R0 (Baseline Omega)')!;
    const rDist = stats.find(r => r.name === 'R_dist (Omega + X_dist)')!;

    console.log(`[Batch-018 Global Regret Results]`);
    for (const r of stats) {
      console.log(`- ${r.name}: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, conflicts = ${r.conflictBins}, epsilon = ${r.epsilon.toFixed(2)}`);
    }

    expect(r0.epsilon).toBeGreaterThanOrEqual(rDist.epsilon);
  });
});
