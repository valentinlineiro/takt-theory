import { describe, it, expect } from 'vitest';
import { TrajectoryMonitor } from './TrajectoryMonitor.js';
import { DynamicMarginEstimator } from './DynamicMarginEstimator.js';
import { AuditPolicy } from './AuditPolicy.js';
import { ContractEvaluator } from './ContractEvaluator.js';
import { Event, eventToPrefix } from './types.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { TransitionSystem, computeDynamicMargin } from '../takt-core/margin.js';

/** HAA-001: two worlds with same P, O, different Π_adv. */

interface HAState { id: 'idle' | 'fail' }
interface HAAction { id: 'wait' | 'attack' }
interface HAObs { phase: string }

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

const O_ha: (s: HAState) => HAObs = (s) => ({ phase: s.id });

const D_wait: (p: TrajectoryPrefix<HAState, HAAction>) => HAAction = () => ({ id: 'wait' });

const π_alwaysWait: (obs: HAObs[]) => HAAction = () => ({ id: 'wait' });

function π_memoryless(pAttack: number): (obs: HAObs[]) => HAAction {
  let call = 0;
  return () => {
    call++;
    if (call === 1) return { id: 'attack' };
    return Math.random() < pAttack ? { id: 'attack' } : { id: 'wait' };
  };
}

function π_waitsThenAttacks(waitSteps: number, pAttack: number = 1.0): (obs: HAObs[]) => HAAction {
  let steps = 0;
  return () => {
    steps++;
    if (steps > waitSteps) return Math.random() < pAttack ? { id: 'attack' } : { id: 'wait' };
    return { id: 'wait' };
  };
}

function makeHAEvent(state: HAState, action: HAAction, ts: number = 0): Event<HAState, HAAction> {
  return { state, action, timestamp: ts };
}

function generateTrajectory(
  steps: number,
  agent: (obs: HAObs[]) => HAAction,
  audit: (prefix: TrajectoryPrefix<HAState, HAAction>) => 'monitor' | 'intervene',
): { events: Event<HAState, HAAction>[]; losses: boolean[] } {
  const events: Event<HAState, HAAction>[] = [];
  const losses: boolean[] = [];
  let state: HAState = idle;
  const obsAccum: HAObs[] = [];

  for (let t = 0; t < steps; t++) {
    obsAccum.push(O_ha(state));
    const action = agent(obsAccum);
    const auditDecision = audit(eventToPrefix(events));

    if (auditDecision === 'intervene') {
      events.push(makeHAEvent(state, action, t));
      losses.push(false);
      state = idle;
      continue;
    }

    events.push(makeHAEvent(state, action, t));
    const next = haTDS.transition(state, action)[0].state;
    losses.push(next.id === 'fail');
    state = next;
  }

  return { events, losses };
}

interface StepRecord {
  t: number;
  md: number;
  decision: string;
  loss: boolean;
  state: string;
}

function runExperiment(
  agent: (obs: HAObs[]) => HAAction,
  π_md: (obs: HAObs[]) => HAAction,
  steps: number,
  threshold: number = 0.5,
): StepRecord[] {
  const monitor = new TrajectoryMonitor<HAState, HAAction>();
  const estimator = new DynamicMarginEstimator(haTDS, D_wait, π_md, O_ha);
  const policy = new AuditPolicy();
  const records: StepRecord[] = [];

  let state: HAState = idle;
  const obsAccum: HAObs[] = [];

  for (let t = 0; t < steps; t++) {
    obsAccum.push(O_ha(state));
    const action = agent(obsAccum);

    monitor.ingest(makeHAEvent(state, action, t));
    const md = estimator.estimate(monitor.getPrefix());
    const decision = policy.decide(md, threshold);
    const loss = action.id === 'attack' && state.id === 'idle';

    records.push({ t, md, decision: decision.action, loss, state: state.id });

    const next = haTDS.transition(state, action)[0].state;
    state = next;
  }

  return records;
}

function maxContinuousSafeMDRun(records: StepRecord[]): number {
  let maxRun = 0;
  let currentRun = 0;
  for (const r of records) {
    if (r.md === Infinity && !r.loss) {
      currentRun++;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 0;
    }
  }
  return maxRun;
}

describe('HAA-001: Blind spot analysis', () => {
  it('World w₁ (Π₀): agent attacks at step 1, runtime detects (π_md matches agent)', () => {
    const agent = π_memoryless(0.3);   // fresh closure
    const π_md = π_memoryless(0.3);    // fresh closure — shares pAttack but not counter
    const records = runExperiment(agent, π_md, 10, 0.5);
    // π_md has its own counter; at step 0, π_md's call=1 → returns 'attack'
    // D=wait ≠ π_md=attack → decision loss → M_D=0
    expect(records[0].md).toBe(0);
    expect(records[0].decision).toBe('INTERVENE');
  });

  it('World w₂ (Πₖ=5): agent waits 5 steps then attacks — M_D = ∞ throughout with π_alwaysWait', () => {
    const agent = π_waitsThenAttacks(5);
    const records = runExperiment(agent, π_alwaysWait, 10, 0.5);
    // First 5 steps: agent waits, π_md=alwaysWait returns wait, D=wait
    // D = π → no decision loss → M_D = ∞
    for (let t = 0; t < 5; t++) {
      expect(records[t].md).toBe(Infinity);
      expect(records[t].decision).toBe('MONITOR');
      expect(records[t].loss).toBe(false);
    }
    // Step 5: agent attacks → state becomes fail
    // But M_D is still ∞: D=wait, π_md=wait → no decision loss
    expect(records[5].md).toBe(Infinity);
    expect(records[5].loss).toBe(true);
  });

  it('Under π_alwaysWait, both worlds produce M_D = ∞ — runtime cannot distinguish w₁ from w₂', () => {
    // w₁: π_memoryless(0.0) attacks at step 1
    const agent1 = π_memoryless(0.0);
    // w₂: π_waitsThenAttacks(3) waits 3 steps then attacks
    const agent2 = π_waitsThenAttacks(3);
    // Runtime uses π_alwaysWait for M_D in both worlds
    const rec1 = runExperiment(agent1, π_alwaysWait, 6, 0.5);
    const rec2 = runExperiment(agent2, π_alwaysWait, 6, 0.5);
    // Both look identical: M_D = ∞ at every step
    for (let t = 0; t < 6; t++) {
      expect(rec1[t].md).toBe(Infinity);
      expect(rec2[t].md).toBe(Infinity);
    }
    // But differences exist: w₂ has a loss at step 3, w₁ has a loss at step 1
    expect(rec1.filter(r => r.loss).length).toBe(1);
    expect(rec2.filter(r => r.loss).length).toBe(1);
  });

  it('π in M_D must be stateless — M_D recursive lookahead calls π at each depth', () => {
    // This test is deliberately trivially true to document the constraint.
    // π in M_D (computeDynamicMargin) is called at each recursion depth during
    // a single estimate. A stateful π would have its state corrupted by the
    // lookahead. Therefore π MUST be a pure function of the observation sequence.
    // In practice, π is estimated from the prefix — after k safe observations,
    // π_estimate = always-wait.
    expect(π_alwaysWait([{ phase: 'idle' }])).toEqual({ id: 'wait' });
    expect(π_alwaysWait([{ phase: 'idle' }, { phase: 'idle' }])).toEqual({ id: 'wait' });
  });

  it('With estimated π (alwaysWait), attack succeeds — loss and signal coincide', () => {
    const k = 3;
    const agent = π_waitsThenAttacks(k);
    const records = runExperiment(agent, π_alwaysWait, k + 2, 0.5);
    // Runtime never intervenes: M_D = ∞ throughout
    expect(records.every(r => r.decision === 'MONITOR')).toBe(true);
    // Loss occurs at step k
    expect(records[k].loss).toBe(true);
    // M_D after loss is still ∞
    expect(records[k].md).toBe(Infinity);
  });

  it('Conclusion: blind spot is late detectability due to π estimation error', () => {
    // The runtime CAN detect the attack (with correct π) — so it's not epistemic
    // The problem is: the π used in M_D is estimated from observations
    // Under Π_k, the first k observations are all safe (wait)
    // → π is estimated as always-wait
    // → M_D = ∞, no intervention
    // → Attack at step k+1 succeeds
    // The distinguishing signal (D ≠ π) would have appeared at step k if π were correct
    // But since π is wrong, the signal arrives with the loss at step k+1
    //
    // This is late detectability, NOT indistinguishability
    // G2 CAN distinguish w₁ from w₂ (different trajectories → different M_D with correct π)
    // But G2's CURRENT π estimate is wrong because the adversary is patient
  });
});

describe('HAA-001: Runtime observations across worlds', () => {
  it('World w₁ (Π₀): agent attacks at step 1, π_md catches it', () => {
    const agent = π_memoryless(0.0);
    const π_md = π_memoryless(0.0);
    const records = runExperiment(agent, π_md, 5, 0.5);
    // π_md returns 'attack' on first call → D≠π → M_D=0
    expect(records[0].md).toBe(0);
    expect(records[0].decision).toBe('INTERVENE');
  });

  it('World w₂ (Πₖ): only wait actions for k steps', () => {
    const k = 3;
    const agent = π_waitsThenAttacks(k);
    const records = runExperiment(agent, π_alwaysWait, k + 2, 0.5);
    for (let t = 0; t < k; t++) {
      expect(records[t].md).toBe(Infinity);
      expect(records[t].decision).toBe('MONITOR');
      expect(records[t].loss).toBe(false);
    }
    // Step k: attack succeeds, M_D still ∞
    expect(records[k].loss).toBe(true);
    expect(records[k].md).toBe(Infinity);
  });
});
