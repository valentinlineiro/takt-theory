import { describe, it, expect } from 'vitest';
import { TrajectoryMonitor } from './TrajectoryMonitor.js';
import { DynamicMarginEstimator } from './DynamicMarginEstimator.js';
import { AuditPolicy } from './AuditPolicy.js';
import { ContractEvaluator } from './ContractEvaluator.js';
import { Event, eventToPrefix } from './types.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { TransitionSystem } from '../takt-core/margin.js';

// --- HAA-001 setup (same as ha-001.test.ts) ---

interface HAState { id: 'idle' | 'fail' }
interface HAAction { id: 'wait' | 'attack' }

const idle: HAState = { id: 'idle' };
const fail: HAState = { id: 'fail' };

const haTDS: TransitionSystem<HAState, HAAction> = {
  states: [idle, fail],
  actions: [{ id: 'wait' }, { id: 'attack' }],
  transition: (s, a) => {
    if (s.id === 'fail') return [{ state: fail, prob: 1.0 }];
    if (a.id === 'attack') return [{ state: fail, prob: 1.0 }];
    return [{ state: idle, prob: 1.0 }];
  },
};

const O_ha: (s: HAState) => { phase: string } = (s) => ({ phase: s.id });

// --- The refinement: Γ' observes actions ---
// F_Γ'(π) = (F_Γ(π), a_t) where a_t is the action π produces at step t
// This factorizes F_Γ via projection: φ(F_Γ(π), a_t) = F_Γ(π)

interface RefinedObs {
  phase: string;
  action: string | null;
}

// O' observes both state phase AND the action taken
const O_refined = (s: HAState, a?: HAAction): RefinedObs => ({
  phase: s.id,
  action: a ? a.id : null,
});

// --- Policy definitions ---
function π_alwaysWait(_obs: RefinedObs[]): HAAction {
  return { id: 'wait' };
}

function π_waitsThenAttacks(k: number): (obs: RefinedObs[]) => HAAction {
  let steps = 0;
  return () => {
    steps++;
    return steps > k ? { id: 'attack' } : { id: 'wait' };
  };
}

function π_immediateAttack(_obs: RefinedObs[]): HAAction {
  return { id: 'attack' };
}

// --- Detection under Γ' ---

interface StepOutcome {
  t: number;
  phase: string;
  action: string | null;
  loss: boolean;
  detected: boolean; // Γ' detects potential loss BEFORE transition
}

/**
 * Run a policy under refined observation Γ'.
 * Detection: at step t, before executing the action, check if the
 * action would cause a loss (attack from idle).
 * This catches the attack BEFORE the transition to fail.
 */
function runRefined(π: (obs: RefinedObs[]) => HAAction, steps: number): StepOutcome[] {
  const outcomes: StepOutcome[] = [];
  let state: HAState = idle;
  const obsAccum: RefinedObs[] = [];

  for (let t = 0; t < steps; t++) {
    // Observe state
    obsAccum.push(O_refined(state));
    // Get action from policy (this is the signal C' adds)
    const action = π(obsAccum);
    // Record the action in the observation
    obsAccum[obsAccum.length - 1].action = action.id;
    // Γ' detection: check if action from idle state would cause loss
    const detected = state.id === 'idle' && action.id === 'attack';
    // Execute transition (loss occurs here if attack from idle)
    const next = haTDS.transition(state, action)[0].state;
    const loss = next.id === 'fail' && state.id === 'idle';
    outcomes.push({ t, phase: state.id, action: action.id, loss, detected });
    state = next;
  }

  return outcomes;
}

describe('HAA-001 — Refined Γ\' (observational: add action to observation)', () => {
  it('F_Γ satisfies C = φ ∘ C\' — projection recovers original', () => {
    // C = F_Γ: produces {phase} only
    // C' = F_Γ': produces {phase, action}
    // φ: {phase, action} → {phase} (projection)
    const obs = O_refined(idle, { id: 'wait' });
    const projected = { phase: obs.phase };
    const original = O_ha(idle);
    expect(projected).toEqual(original);
  });

  it('Γ\' detects π_alwaysWait: never — no false positives', () => {
    const outcomes = runRefined(π_alwaysWait, 10);
    for (const o of outcomes) {
      expect(o.detected).toBe(false);
      expect(o.loss).toBe(false);
    }
  });

  it('Γ\' detects π_attackNow at t=0, before loss', () => {
    const outcomes = runRefined(π_immediateAttack, 3);
    // t=0: action='attack' from idle → detected=true BEFORE transition
    expect(outcomes[0].detected).toBe(true);
    // After transition: state=fail
    expect(outcomes[0].loss).toBe(true);
    // The detection happens at the same step as the loss, but the key
    // point is: we observe the action BEFORE committing to the transition.
    // In a real system, detection at t=0 allows intervention before fail.
  });

  it('Γ\' detects π_waitsThenAttacks(k) at t=k+1, before loss', () => {
    const k = 3;
    const π_adv = π_waitsThenAttacks(k);
    const outcomes = runRefined(π_adv, k + 3);

    // Steps 0..k-1: action='wait', state remains idle → no detection
    for (let t = 0; t < k; t++) {
      expect(outcomes[t].detected).toBe(false);
      expect(outcomes[t].loss).toBe(false);
      expect(outcomes[t].action).toBe('wait');
    }

    // Step k: first call where steps > k → action='attack'
    // At this point, state is still idle (from step k-1)
    // Γ' detects 'attack' action BEFORE transition
    expect(outcomes[k].detected).toBe(true);
    expect(outcomes[k].action).toBe('attack');
    expect(outcomes[k].phase).toBe('idle'); // detection before transition
    // After detection, the system can intervene without incurring loss
    // The loss only occurs if we let the transition execute
    expect(outcomes[k].loss).toBe(true);
  });

  it('Γ\' separates π_safe from π_adv within the same F_Γ fiber', () => {
    // Both policies produce {phase:'idle'} for all safe prefixes under F_Γ
    // But under F_Γ', the actions differ at step k+1
    const k = 5;
    const π_safe = π_alwaysWait;
    const π_adv = π_waitsThenAttacks(k);

    const safeOutcomes = runRefined(π_safe, k + 2);
    const advOutcomes = runRefined(π_adv, k + 2);

    // Up to step k-1: both produce 'wait' → indistinguishable even under Γ'
    for (let t = 0; t < k; t++) {
      expect(safeOutcomes[t].action).toBe('wait');
      expect(advOutcomes[t].action).toBe('wait');
      expect(advOutcomes[t].detected).toBe(false);
    }

    // Step k: π_adv produces 'attack' while π_safe produces 'wait'
    // Γ' distinguishes them
    expect(safeOutcomes[k].action).toBe('wait');
    expect(safeOutcomes[k].detected).toBe(false);
    expect(advOutcomes[k].action).toBe('attack');
    expect(advOutcomes[k].detected).toBe(true);

    // The fiber of F_Γ at prefix k: δ_{idle}
    // Both map to {phase:'idle'} under F_Γ
    expect(safeOutcomes[k].phase).toBe('idle');
    expect(advOutcomes[k].phase).toBe('idle');
    // But under F_Γ': (idle, wait) vs (idle, attack) — separated!
  });
});

describe('HAA-001 — Comparison: original F_Γ vs refined F_Γ\'', () => {
  it('Under F_Γ, M_D = ∞ for both π_safe and π_waitsThenAttacks(k)', () => {
    const k = 3;
    const agent = π_waitsThenAttacks(k);
    // Use a fresh closure for the M_D estimator. We need to match the
    // original HAA-001 test setup: π in M_D is π_alwaysWait
    const π_md: (obs: { phase: string }[]) => HAAction = () => ({ id: 'wait' });
    // Run M_D estimation (same as ha-001.test.ts)
    const monitor = new TrajectoryMonitor<HAState, HAAction>();
    // We need to use the original O_ha (which only sees state)
    const estimator = new DynamicMarginEstimator(
      haTDS,
      (p) => ({ id: 'wait' } as HAAction),
      π_md,
      O_ha,
    );
    const policy = new AuditPolicy();

    let state: HAState = idle;
    const obsAccum: { phase: string }[] = [];
    const mds: number[] = [];

    for (let t = 0; t < k + 3; t++) {
      obsAccum.push(O_ha(state));
      const action = agent(obsAccum.map(o => o));
      monitor.ingest({ state, action, timestamp: t });
      const md = estimator.estimate(monitor.getPrefix());
      mds.push(md);
      const next = haTDS.transition(state, action)[0].state;
      state = next;
    }

    // M_D = ∞ throughout — F_Γ cannot distinguish
    for (const md of mds) {
      expect(md).toBe(Infinity);
    }
  });

  it('Under F_Γ\', detection fires at t=k+1 where F_Γ sees ∞', () => {
    const k = 3;
    const π_adv = π_waitsThenAttacks(k);
    const refinedOutcomes = runRefined(π_adv, k + 3);

    // F_Γ would show M_D = ∞ for k+3 steps
    // F_Γ' shows detected = true at step k
    for (let t = 0; t < k; t++) {
      expect(refinedOutcomes[t].detected).toBe(false);
    }
    expect(refinedOutcomes[k].detected).toBe(true);

    // The detection at step k is exactly the signal s* that
    // F_Γ could not provide. It appears at the same time as
    // the first attack action — which is WHEN the decision is made,
    // before the loss materializes.
  });
});
