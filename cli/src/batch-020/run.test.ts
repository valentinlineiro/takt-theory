import { describe, it, expect } from 'vitest';
import { evaluateActivationRegret } from './evaluate.js';

describe('Batch-020 Activation Regret Evaluation', () => {
  it('successfully calculates epsilon regret bounds across representations including activation invariants', () => {
    const stats = evaluateActivationRegret();
    expect(stats.length).toBe(2);

    const rPath = stats.find(r => r.name === 'R_path (R_dist + X_path)')!;
    const rActive = stats.find(r => r.name === 'R_active (R_path + X_activation)')!;

    console.log(`[Batch-020 Global Regret Results]`);
    for (const r of stats) {
      console.log(`- ${r.name}: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, conflicts = ${r.conflictBins}, epsilon = ${r.epsilon.toFixed(2)}`);
    }

    expect(rPath.epsilon).toBeGreaterThanOrEqual(rActive.epsilon);
    expect(rActive.epsilon).toBeCloseTo(13.58); // Falsified ex-ante prediction check
  });
});
