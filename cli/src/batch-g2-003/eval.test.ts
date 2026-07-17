import { describe, it, expect } from 'vitest';
import { executeBatchG2003 } from './eval.js';

describe('G2-003: sparse observation boundary characterization', () => {
  it('the unobserved but truly-identical pair keeps the wide prior radius', () => {
    const result = executeBatchG2003();
    expect(result.unobservedPairEpsilon).toBeGreaterThan(result.observedPairEpsilon);
  });

  it('sa-rectangularity leaves a measurable excess-conservatism gap (L-G2-001)', () => {
    // Not a pass/fail threshold — this batch characterizes the boundary
    // documented in docs/superpowers/specs/2026-07-17-phase-g2-uncertainty-governance-design.md
    // (L-G2-001), it does not attempt to defeat the contract.
    const result = executeBatchG2003();
    expect(result.excessConservatismGap).toBeGreaterThan(0);
  });
});
