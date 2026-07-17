import { s0a, s0b, sSafe, sFail, a0 } from './fixtures.js';
import { TransitionEstimator } from '../runtime/TransitionEstimator.js';
import { UncertaintySet } from '../runtime/UncertaintySet.js';

export interface BatchG2003Result {
  observedPairEpsilon: number;
  unobservedPairEpsilon: number;
  observedPairMD: number;
  unobservedPairMD: number;
  excessConservatismGap: number;
}

export function executeBatchG2003(): BatchG2003Result {
  const epsilon0 = 0.6;

  const estimator = new TransitionEstimator<typeof s0a, typeof a0>(20);
  const uncertainty = new UncertaintySet<typeof s0a, typeof a0>(epsilon0);

  // 400 observations at s0_a only — s0_b is never directly observed,
  // even though its true failure rate is identical to s0_a's.
  for (let i = 0; i < 380; i++) { estimator.observe(s0a, a0, sSafe); uncertainty.observe(s0a, a0); }
  for (let i = 0; i < 20; i++) { estimator.observe(s0a, a0, sFail); uncertainty.observe(s0a, a0); }
  // s0_b: never observed by either estimator or uncertainty set — radius stays at epsilon0.

  const pMaxObservedFail = uncertainty.pMax(s0a, a0, estimator.estimate(s0a, a0, sFail));
  const pMaxUnobservedFail = uncertainty.pMax(s0b, a0, estimator.estimate(s0b, a0, sFail));

  const observedPairMD = -Math.log(pMaxObservedFail);
  const unobservedPairMD = -Math.log(pMaxUnobservedFail);

  return {
    observedPairEpsilon: uncertainty.radius(s0a, a0),
    unobservedPairEpsilon: uncertainty.radius(s0b, a0),
    observedPairMD,
    unobservedPairMD,
    excessConservatismGap: observedPairMD - unobservedPairMD,
  };
}
