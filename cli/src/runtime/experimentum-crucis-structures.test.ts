import { describe, it, expect } from 'vitest';

/**
 * Experimentum crucis: structures on D(Y).
 *
 * Reformulated: test whether any distance on D(Y) can detect a
 * deviation between the EXPECTED observation distribution (under π_est)
 * and the ACTUAL observation sequence (from unknown π_adv).
 *
 * If all distances are zero for a given adversary, the blind spot is
 * in F_Γ (the observation operator), not in the choice of metric.
 */

interface HAState { id: 'idle' | 'fail' }
interface HAAction { id: 'wait' | 'attack' }
interface HAObs { phase: string }

const idle: HAState = { id: 'idle' };
const fail: HAState = { id: 'fail' };

type TransitionResult<S> = { state: S; prob: number };

const haTDS = {
  states: [idle, fail],
  actions: [{ id: 'wait' }, { id: 'attack' }],
  transition: (s: HAState, a: HAAction): TransitionResult<HAState>[] => {
    if (s.id === 'fail') return [{ state: fail, prob: 1.0 }];
    if (a.id === 'attack') return [{ state: fail, prob: 1.0 }];
    return [{ state: idle, prob: 1.0 }];
  },
};

const O_ha: (s: HAState) => HAObs = (s) => ({ phase: s.id });

// --- Policy definitions ---

function π_alwaysWait(_obs: HAObs[]): HAAction {
  return { id: 'wait' };
}

function π_attackNow(_obs: HAObs[]): HAAction {
  return { id: 'attack' };
}

function π_attackAt(k: number): (obs: HAObs[]) => HAAction {
  let steps = 0;
  return () => {
    steps++;
    return steps > k ? { id: 'attack' } : { id: 'wait' };
  };
}

/**
 * Expected observation distribution at prefix t under policy π.
 * F_Γ(π)(t) = distribution of O(state) after t steps following π.
 */
function expectedDist(π: (obs: HAObs[]) => HAAction, prefixLen: number): Map<string, number> {
  const obsSeq: HAObs[] = [];
  let state: HAState = idle;
  for (let t = 0; t < prefixLen; t++) {
    obsSeq.push(O_ha(state));
    const action = π(obsSeq);
    const next = haTDS.transition(state, action)[0].state;
    state = next;
  }
  const key = JSON.stringify(O_ha(state));
  const dist = new Map<string, number>();
  dist.set(key, 1.0);
  return dist;
}

/**
 * Actual observation after following π_adv for `prefixLen` steps.
 */
function actualObs(π_adv: (obs: HAObs[]) => HAAction, steps: number): HAObs {
  const obsSeq: HAObs[] = [];
  let state: HAState = idle;
  for (let t = 0; t < steps; t++) {
    obsSeq.push(O_ha(state));
    const action = π_adv(obsSeq);
    const next = haTDS.transition(state, action)[0].state;
    state = next;
  }
  return O_ha(state);
}

function empiricalDist(π_adv: (obs: HAObs[]) => HAAction, prefixLen: number): Map<string, number> {
  const key = JSON.stringify(actualObs(π_adv, prefixLen));
  const dist = new Map<string, number>();
  dist.set(key, 1.0);
  return dist;
}

// --- Distances ---

function tvDistance(a: Map<string, number>, b: Map<string, number>): number {
  const allKeys = new Set([...a.keys(), ...b.keys()]);
  let total = 0;
  for (const k of allKeys) {
    total += Math.abs((a.get(k) ?? 0) - (b.get(k) ?? 0));
  }
  return total / 2;
}

function klDivergence(a: Map<string, number>, b: Map<string, number>): number {
  let kl = 0;
  for (const [k, p] of a) {
    const q = b.get(k) ?? 0;
    if (p > 0 && q === 0) return Infinity;
    if (p > 0) kl += p * Math.log(p / q);
  }
  return kl;
}

function jsDivergence(a: Map<string, number>, b: Map<string, number>): number {
  const allKeys = new Set([...a.keys(), ...b.keys()]);
  const m = new Map<string, number>();
  for (const k of allKeys) {
    m.set(k, ((a.get(k) ?? 0) + (b.get(k) ?? 0)) / 2);
  }
  return (klDivergence(a, m) + klDivergence(b, m)) / 2;
}

describe('Experimentum crucis — π_alwaysWait vs π_attackNow', () => {
  const π_est = π_alwaysWait;
  const π_adv = π_attackNow;  // attacks on first step

  for (let t = 0; t < 4; t++) {
    it(`At prefix ${t}: TV > 0 — structure detects immediate attacker`, () => {
      const exp = expectedDist(π_est, t);
      const act = empiricalDist(π_adv, t);
      // At t=0: both see idle → TV=0
      // At t>=1: π_adv transitions to fail → obs differs from π_est
      if (t === 0) {
        expect(tvDistance(exp, act)).toBe(0);
      } else {
        expect(tvDistance(exp, act)).toBe(1);
      }
    });
  }
});

describe('Experimentum crucis — π_alwaysWait vs π_attackAt(3) (patient)', () => {
  // Each test creates fresh π_adv to avoid stateful closure leakage
  // π_attackAt(k) returns a stateful closure; sharing it across tests couples them

  for (let t = 0; t < 7; t++) {
    it(`At prefix ${t}: TV = 0 until attack produces new observation`, () => {
      const π_est = π_alwaysWait;
      const π_adv = π_attackAt(3);  // fresh closure per test
      const exp = expectedDist(π_est, t);
      const act = empiricalDist(π_adv, t);
      // π_attackAt(3): calls 1-3 → wait; call 4 → attack → fail
      // empiricalDist(π_adv, t) calls π_adv t times
      // t=0..3: all wait → state stays idle → TV=0 (blind spot)
      // t≥4: attack on call 4 → fail → TV=1
      if (t <= 3) {
        expect(tvDistance(exp, act)).toBe(0);
      } else {
        expect(tvDistance(exp, act)).toBe(1);
      }
    });
  }

  it('Detection window: t=0..3 safe, t=4 detection but loss already occurred', () => {
    // π_attackAt(3): calls 1-3 wait, call 4 attacks → state=fail
    // empiricalDist(π_adv, t) → calls π_adv t times
    // After t calls: state=idle for t≤3, state=fail for t≥4
    // Loss happens at the transition idle→fail (call 4, t=3→t=4)
    expect(tvDistance(
      expectedDist(π_alwaysWait, 0), empiricalDist(π_attackAt(3), 0),
    )).toBe(0);
    expect(tvDistance(
      expectedDist(π_alwaysWait, 1), empiricalDist(π_attackAt(3), 1),
    )).toBe(0);
    expect(tvDistance(
      expectedDist(π_alwaysWait, 2), empiricalDist(π_attackAt(3), 2),
    )).toBe(0);
    expect(tvDistance(
      expectedDist(π_alwaysWait, 3), empiricalDist(π_attackAt(3), 3),
    )).toBe(0);
    // At t=4: detection but loss happened at t=3→t=4 boundary
    expect(tvDistance(
      expectedDist(π_alwaysWait, 4), empiricalDist(π_attackAt(3), 4),
    )).toBe(1);
  });
});

describe('Experimentum crucis — all candidate distances behave identically on F_Γ', () => {
  // For deterministic O_ha, all distances are either 0 (identical) or
  // TV=1/KL=∞/JS=ln(2) (different). No distance is more sensitive because
  // the support is disjoint when they differ.

  const π_est = π_alwaysWait;
  const π_adv = π_attackNow;

  function checkAllDistances(t: number, expectedSame: boolean) {
    const exp = expectedDist(π_est, t);
    const act = empiricalDist(π_adv, t);
    const tv = tvDistance(exp, act);
    const kl = klDivergence(exp, act);
    const js = jsDivergence(exp, act);

    if (expectedSame) {
      expect(tv).toBe(0);
      expect(kl).toBe(0);
      expect(js).toBe(0);
    } else {
      expect(tv).toBeGreaterThan(0);
      expect(kl).toBeGreaterThan(0);
      expect(js).toBeGreaterThan(0);
    }
  }

  it('At t=0: all distances agree (identical)', () => checkAllDistances(0, true));
  it('At t=1: all distances agree (different)', () => checkAllDistances(1, false));
  it('At t=2: all distances agree (different)', () => checkAllDistances(2, false));
});

describe('TAKT insight: structures on D(Y) detect action-level deviations but not intent', () => {
  it('π_alwaysWait vs π_attackAt(3): TV=0 until t=4 (attack detected at t=4, after loss)', () => {
    // π_attackAt(3): first 3 calls produce 'wait'. Call 4 produces 'attack'.
    // empiricalDist(π_adv, t) calls π_adv t times (t iterations of loop).
    // At t=3: 3 calls, all 'wait' → state=idle → O={phase:'idle'} → TV=0
    // At t=4: 4 calls, call 4 returns 'attack' → state=fail → O={phase:'fail'} → TV=1
    function detectAt(t: number): number {
      const act = empiricalDist(π_attackAt(3), t);
      const exp = expectedDist(π_alwaysWait, t);
      return tvDistance(exp, act) > 0 ? 1 : 0;
    }
    expect(detectAt(0)).toBe(0);
    expect(detectAt(1)).toBe(0);
    expect(detectAt(2)).toBe(0);
    expect(detectAt(3)).toBe(0);
    expect(detectAt(4)).toBe(1);
  });

  it('With a richer observation function O* (action+state), detection is possible earlier', () => {
    // O*: observes both state AND action
    const O_star = (s: HAState, a?: HAAction): { phase: string; action: string | null } => ({
      phase: s.id,
      action: a ? a.id : null,
    });

    function simulateWithObservedActions(
      π_adv: (obs: HAObs[]) => HAAction,
      steps: number,
    ): { phase: string; action: string | null }[] {
      const obsSeq: HAObs[] = [];
      let state: HAState = idle;
      const observed: { phase: string; action: string | null }[] = [];
      for (let t = 0; t < steps; t++) {
        obsSeq.push(O_ha(state));
        const action = π_adv(obsSeq);
        observed.push(O_star(state, action));
        const next = haTDS.transition(state, action)[0].state;
        state = next;
      }
      return observed;
    }

    // With O*, attack timing IS observable
    const traj_early = simulateWithObservedActions(π_attackAt(0), 4);
    const traj_late = simulateWithObservedActions(π_attackAt(3), 6);

    // At step 1: π_attackAt(0) shows {phase:'idle', action:'attack'}
    // π_attackAt(3) shows {phase:'idle', action:'wait'}
    expect(traj_early[0].action).toBe('attack');
    expect(traj_late[0].action).toBe('wait');
    // Distinguishable at step 1 with O*
  });
});
