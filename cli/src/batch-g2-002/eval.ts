import { buildBinaryTDS, O, D, π, s0, sSafe, sFail, a0 } from './fixtures.js';
import { TransitionEstimator } from '../runtime/TransitionEstimator.js';
import { UncertaintySet } from '../runtime/UncertaintySet.js';
import { ValidityMonitor } from '../runtime/ValidityMonitor.js';
import { RobustMarginEstimator } from '../runtime/RobustMarginEstimator.js';
import { AuditPolicy } from '../runtime/AuditPolicy.js';

export interface BatchG2002Result {
  driftDetected: boolean;
  drift: number;
  tau: number;
  decisionWithMonitor: string;
  naiveMarginSafe: number;
  naiveWouldFalselyMonitor: boolean;
}

export function executeBatchG2002(): BatchG2002Result {
  const epsilon0 = 0.6;
  const windowSize = 20;
  const tau = 0.3;
  const threshold = 1.0;

  const estimator = new TransitionEstimator<typeof s0, typeof a0>(windowSize);
  const uncertainty = new UncertaintySet<typeof s0, typeof a0>(epsilon0);

  // 500 confident "safe" observations — the system never sees failure.
  for (let i = 0; i < 500; i++) { estimator.observe(s0, a0, sSafe); uncertainty.observe(s0, a0); }
  // Then a burst of 15 failures fills the observation window.
  for (let i = 0; i < 15; i++) { estimator.observe(s0, a0, sFail); uncertainty.observe(s0, a0); }
  // Also shrink (sSafe,a0)'s uncertainty to its true deterministic behavior
  // (sSafe -> s0 always) — without this, RobustMarginEstimator's search finds
  // a cheaper artificial path through (sSafe,a0)'s wide-open default
  // uncertainty instead of the intended direct s0->sFail edge.
  for (let i = 0; i < 515; i++) { estimator.observe(sSafe, a0, s0); uncertainty.observe(sSafe, a0); }

  const validity = new ValidityMonitor(estimator, [s0, sSafe, sFail], tau);
  const drift = validity.drift(s0, a0);
  const driftDetected = validity.isMismatched(s0, a0);

  const trueTds = buildBinaryTDS(estimator.windowEstimate(s0, a0, sFail));
  const mdSafe = new RobustMarginEstimator(trueTds, estimator, uncertainty, D, π, O).estimate({ states: [s0], actions: [] });

  const policy = new AuditPolicy();
  const decision = policy.decideSafe(mdSafe, threshold, drift, tau);

  return {
    driftDetected,
    drift,
    tau,
    decisionWithMonitor: decision.action,
    naiveMarginSafe: mdSafe,
    naiveWouldFalselyMonitor: mdSafe >= threshold,
  };
}
