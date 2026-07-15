import { describe, it, expect } from 'vitest';
import { evaluateReachabilityRegret } from './evaluate.js';

describe('Batch-021 Reachability Regret Evaluation', () => {
  it('successfully calculates epsilon regret bounds across representations including reachability invariants', () => {
    const stats = evaluateReachabilityRegret();
    expect(stats.length).toBe(2);

    const rActive = stats.find(r => r.name === 'R_active (R_path + X_activation)')!;
    const rReach = stats.find(r => r.name === 'R_reach (R_active + X_reach)')!;

    console.log(`[Batch-021 Global Regret Results]`);
    for (const r of stats) {
      console.log(`- ${r.name}: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, conflicts = ${r.conflictBins}, epsilon = ${r.epsilon.toFixed(2)}`);
    }

    expect(rActive.epsilon).toBeGreaterThanOrEqual(rReach.epsilon);
    expect(rReach.epsilon).toBe(0.00); // Ex-ante prediction check
  });
});
