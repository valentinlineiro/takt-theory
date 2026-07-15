import { describe, it, expect } from 'vitest';
import { evaluatePowersetAblation, extractParetoFrontier } from './evaluate.js';

describe('Batch-022 Powerset Ablation Evaluation', () => {
  it('successfully calculates regret bounds across all 32 combinations and maps the Pareto frontier', () => {
    const stats = evaluatePowersetAblation();
    expect(stats.length).toBe(32);

    const frontier = extractParetoFrontier(stats);
    console.log(`[Batch-022 Pareto Frontier]`);
    for (const r of frontier) {
      console.log(`- Indices [${r.indices.join(',')}]: bins = ${r.totalBins}, maxBin = ${r.maxBinSize}, avgKeyLen = ${r.avgKeyLen.toFixed(1)}`);
    }

    expect(frontier.length).toBeGreaterThan(0);
  });
});
