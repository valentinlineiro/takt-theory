import { computeMDExact, computeEffectivePFail, sampleTransition, PerturbationType } from './fixtures.js';

export interface F005Metrics {
  delta: number;
  perturbationType: PerturbationType;
  deltaM_D: number;
  falseSafeRate: number;
  falseAlarmRate: number;
  accumulatedLoss: number;
  interventionCount: number;
  totalSteps: number;
}

export interface F005Result {
  scenarios: F005Metrics[];
  sensitivity?: Record<string, number>;
}

export interface BetaSweepPoint {
  beta: number;
  falseSafeRate: number;
  falseAlarmRate: number;
  expectedLoss: number;
  operationalUtility: number;
  interventionRate: number;
}

export interface BetaSweepResult {
  perturbationType: PerturbationType;
  delta: number;
  threshold: number;
  pMin: number;
  pMax: number;
  trials: number;
  points: BetaSweepPoint[];
}

const pFailTrue = 0.3;
const mdTrue = computeMDExact(pFailTrue);

function simulate(
  pFailEst: number,
  threshold: number,
  steps: number
): { loss: number; falseSafes: number; falseAlarms: number; interventions: number } {
  const mdEst = computeMDExact(pFailEst);
  let loss = 0;
  let falseSafes = 0;
  let falseAlarms = 0;
  let interventions = 0;

  for (let t = 0; t < steps; t++) {
    const shouldIntervene = mdTrue < threshold;
    const doesIntervene = mdEst < threshold;

    if (doesIntervene) {
      if (!shouldIntervene) falseAlarms++;
      interventions++;
    } else {
      if (shouldIntervene) falseSafes++;
      const outcome = sampleTransition(pFailTrue);
      if (outcome.id === 's_fail') loss++;
    }
  }

  return { loss, falseSafes, falseAlarms, interventions };
}

export function computePerturbedPFail(
  type: PerturbationType,
  delta: number
): number {
  if (type === 'none' || delta === 0) return pFailTrue;
  return computeEffectivePFail(pFailTrue, type, delta);
}

function buildScenario(
  pType: PerturbationType,
  delta: number,
  threshold: number,
  steps: number
): F005Metrics {
  const pFailEst = computePerturbedPFail(pType, delta);
  const mdEst = computeMDExact(pFailEst);
  const sim = simulate(pFailEst, threshold, steps);

  return {
    delta,
    perturbationType: pType,
    deltaM_D: mdEst - mdTrue,
    falseSafeRate: sim.falseSafes / steps,
    falseAlarmRate: sim.falseAlarms / steps,
    accumulatedLoss: sim.loss / steps,
    interventionCount: sim.interventions,
    totalSteps: steps,
  };
}

export function executeBatchF005(options?: {
  delta?: number;
  perturbationType?: PerturbationType;
  auditThreshold?: number;
  steps?: number;
}): F005Result {
  const delta = options?.delta ?? 0.5;
  const auditThreshold = options?.auditThreshold ?? 1.5;
  const steps = options?.steps ?? 500;

  const types: PerturbationType[] = options?.perturbationType
    ? [options.perturbationType]
    : ['none', 'optimistic', 'pessimistic', 'random'];

  const results = types.map(t => buildScenario(t, t === 'none' ? 0 : delta, auditThreshold, steps));

  let sensitivity: Record<string, number> | undefined;
  if (!options?.perturbationType) {
    sensitivity = {};
    const eps = 0.05;
    for (const p of [0.2, 0.25, 0.35, 0.4]) {
      const md = computeMDExact(p);
      const mdBase = computeMDExact(0.3);
      sensitivity[`pFail=${p.toFixed(2)}`] = (md - mdBase) / (p - 0.3);
    }
  }

  return { scenarios: results, sensitivity };
}

// ── F-005.1: Beta correction sweep ────────────────────────────────────

export function betaSweep(options: {
  perturbationType: PerturbationType;
  delta: number;
  auditThreshold: number;
  steps: number;
  betas: number[];
  pMin?: number;
  pMax?: number;
}): BetaSweepResult {
  const { perturbationType, delta, auditThreshold, steps, betas,
    pMin = 0.01, pMax = 0.99 } = options;

  // ponytail: uniform pFail draw — non-uniform sampling if we need resolution
  // in specific bands
  const trialPFails: number[] = [];
  for (let i = 0; i < steps; i++) {
    trialPFails.push(pMin + Math.random() * (pMax - pMin));
  }

  const points: BetaSweepPoint[] = betas.map(beta => {
    let falseSafes = 0;
    let falseAlarms = 0;
    let loss = 0;
    let interventions = 0;

    for (const pFail of trialPFails) {
      const mdTrue = computeMDExact(pFail);
      const pFailEst = perturbationType === 'none'
        ? pFail
        : computeEffectivePFail(pFail, perturbationType, delta);
      const mdEst = computeMDExact(pFailEst);
      const mdCorrected = mdEst - beta;

      const shouldIntervene = mdTrue < auditThreshold;
      const doesIntervene = mdCorrected < auditThreshold;

      if (doesIntervene) {
        if (!shouldIntervene) falseAlarms++;
        interventions++;
      } else {
        if (shouldIntervene) falseSafes++;
        loss += pFail;
      }
    }

    return {
      beta,
      falseSafeRate: falseSafes / steps,
      falseAlarmRate: falseAlarms / steps,
      expectedLoss: loss / steps,
      operationalUtility: 1 - loss / steps,
      interventionRate: interventions / steps,
    };
  });

  return {
    perturbationType,
    delta,
    threshold: auditThreshold,
    pMin,
    pMax,
    trials: steps,
    points,
  };
}
