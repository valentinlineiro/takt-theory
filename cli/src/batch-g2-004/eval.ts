import { buildBinaryTDS, O, D, π, s0, sSafe, sFail, a0 } from './fixtures.js';
import { TransitionEstimator } from '../runtime/TransitionEstimator.js';
import { UncertaintySet } from '../runtime/UncertaintySet.js';
import { ValidityMonitor } from '../runtime/ValidityMonitor.js';
import { RobustMarginEstimator } from '../runtime/RobustMarginEstimator.js';
import { AuditPolicy } from '../runtime/AuditPolicy.js';

export interface BatchG2004Result {
  preShiftEpsilon: number;
  driftAfterShift: number;
  tau: number;
  recalibrated: boolean;
  postRecoveryEpsilonImmediate: number;
  postRecoveryDecision: string;
  postRecoveryMDSafe: number;
}

export function executeBatchG2004(): BatchG2004Result {
  const epsilon0 = 0.6;
  const windowSize = 20;
  const tau = 0.3;
  const threshold = 1.0;

  const estimator = new TransitionEstimator<typeof s0, typeof a0>(windowSize);
  const uncertainty = new UncertaintySet<typeof s0, typeof a0>(epsilon0);
  const validity = new ValidityMonitor(estimator, [s0, sSafe, sFail], tau);
  const policy = new AuditPolicy();

  // Phase 1: 1000 observations from a safe regime (2% failure rate, evenly spread).
  for (let i = 0; i < 1000; i++) {
    const outcome = i % 50 === 0 ? sFail : sSafe;
    estimator.observe(s0, a0, outcome);
    uncertainty.observe(s0, a0);
  }
  const preShiftEpsilon = uncertainty.radius(s0, a0);

  // Phase 2: the true regime shifts — 20 new observations (60% failure) fill the window.
  for (let i = 0; i < 20; i++) {
    const outcome = i < 12 ? sFail : sSafe;
    estimator.observe(s0, a0, outcome);
    uncertainty.observe(s0, a0);
  }

  const driftAfterShift = validity.drift(s0, a0);
  const recalibrated = validity.isMismatched(s0, a0);

  // Recovery: widen epsilon AND forget the stale point estimate — widening alone
  // leaves P_hat biased by 1000 pre-shift observations (see Task 3 design note).
  if (recalibrated) {
    uncertainty.recover(s0, a0);
    estimator.forget(s0, a0);
  }
  const postRecoveryEpsilonImmediate = uncertainty.radius(s0, a0);

  // Phase 3: 200 fresh post-recovery observations from the new regime (40% failure,
  // interleaved so every window-sized slice matches the same rate as the full set).
  for (let i = 0; i < 200; i++) {
    const outcome = i % 5 < 3 ? sSafe : sFail;
    estimator.observe(s0, a0, outcome);
    uncertainty.observe(s0, a0);
  }

  const driftAfterRecovery = validity.drift(s0, a0);
  const trueTds = buildBinaryTDS(0.4);
  const postRecoveryMDSafe = new RobustMarginEstimator(trueTds, estimator, uncertainty, D, π, O)
    .estimate({ states: [s0], actions: [] });
  const decision = policy.decideSafe(postRecoveryMDSafe, threshold, driftAfterRecovery, tau);

  return {
    preShiftEpsilon,
    driftAfterShift,
    tau,
    recalibrated,
    postRecoveryEpsilonImmediate,
    postRecoveryDecision: decision.action,
    postRecoveryMDSafe,
  };
}
