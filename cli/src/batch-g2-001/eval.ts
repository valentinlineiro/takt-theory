import { buildBinaryTDS, O, D, π, s0, sSafe, sFail, a0 } from './fixtures.js';
import { TransitionEstimator } from '../runtime/TransitionEstimator.js';
import { UncertaintySet } from '../runtime/UncertaintySet.js';
import { RobustMarginEstimator } from '../runtime/RobustMarginEstimator.js';
import { DynamicMarginEstimator } from '../runtime/DynamicMarginEstimator.js';

export interface BatchG2001Result {
  pHatFail: number;
  epsilon: number;
  pTrueFail: number;
  mdTrue: number;
  mdSafe: number;
  invariantHolds: boolean;
}

export function executeBatchG2001(): BatchG2001Result {
  const epsilon0 = 0.6;
  const n = 100;
  const failCount = 29;

  const estimator = new TransitionEstimator<typeof s0, typeof a0>(20);
  const uncertainty = new UncertaintySet<typeof s0, typeof a0>(epsilon0);
  for (let i = 0; i < n - failCount; i++) { estimator.observe(s0, a0, sSafe); uncertainty.observe(s0, a0); }
  for (let i = 0; i < failCount; i++) { estimator.observe(s0, a0, sFail); uncertainty.observe(s0, a0); }

  const pHatFail = estimator.estimate(s0, a0, sFail);
  const epsilon = uncertainty.radius(s0, a0);
  const pTrueFail = Math.min(1, pHatFail + epsilon / 2);

  const trueTds = buildBinaryTDS(pTrueFail);
  const mdTrue = new DynamicMarginEstimator(trueTds, D, π, O).estimate({ states: [s0], actions: [] });
  const mdSafe = new RobustMarginEstimator(trueTds, estimator, uncertainty, D, π, O).estimate({ states: [s0], actions: [] });

  return {
    pHatFail,
    epsilon,
    pTrueFail,
    mdTrue,
    mdSafe,
    invariantHolds: mdSafe <= mdTrue + 1e-9,
  };
}
