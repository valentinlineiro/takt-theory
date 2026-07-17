# Phase G2 Uncertainty Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the G1 runtime (`cli/src/runtime/`) so TAKT governs trajectories when the transition model P is not known exactly, but bounded by a self-auditing, sa-rectangular L1 uncertainty envelope U_t, per `docs/superpowers/specs/2026-07-17-phase-g2-uncertainty-governance-design.md`.

**Architecture:** Four new runtime primitives (`UncertaintySet`, `TransitionEstimator`, `RobustMarginEstimator`, `ValidityMonitor`) sit alongside G1's frozen components — G1's `DynamicMarginEstimator` is never modified. `AuditPolicy` gains a `decideSafe` method producing a third decision state, `RECALIBRATE`, distinct from `INTERVENE`. `ContractEvaluator` gains `recalibrationCount`/`lastRecalibrationReason`. Four validation batches (`batch-g2-001..004`) mirror the `batch-f-*` pattern, each exercising the full pipeline against one adversary from the design's G2.5 list.

**Tech Stack:** TypeScript, Vitest (run via `npx vitest run <path>` — no `package.json`/`tsconfig.json` in this repo; Vitest transpiles via esbuild without type-checking).

## Global Constraints

- `ε_t(s,a)` and `τ` are both raw L1 distance (`‖P − P̂‖_1`), never total variation (`½‖P − P̂‖_1`) — see the design spec's "Design Refinement" section. Getting this wrong silently introduces a factor-of-2 bug in `pMax`.
- `RobustMarginEstimator` uses the exact closed form `P_max(s'|s,a) = min(1, P̂(s'|s,a) + ε(s,a)/2)`, **not** a greedy sort-and-shift redistribution — that algorithm solves a different (expectation-based) Bellman structure that does not apply here.
- G1 files (`DynamicMarginEstimator.ts`, `TrajectoryMonitor.ts`) are never modified. G2 extends by addition, not by rewriting frozen G1 semantics.
- All new runtime files delegate math to `takt-core` where G1 already established that pattern (`RobustMarginEstimator` imports `TransitionSystem` from `takt-core/margin.js`, `TrajectoryPrefix` from `takt-core/types.js`, `ReferencePolicy` from `takt-core/coverage.js` — matching `DynamicMarginEstimator.ts`'s import pattern exactly, not `batch-f-004/fixtures.ts`'s imprecise one).
- Batch fixtures are self-contained per directory (no cross-batch imports), matching the existing `batch-f-*` convention.
- No new npm dependencies. No `package.json`/`tsconfig.json` is to be introduced — this repo intentionally has neither.

---

## Task 1: Shared key helper and type extensions

**Files:**
- Modify: `cli/src/runtime/types.ts`
- Test: `cli/src/runtime/g2.test.ts` (new file)

**Interfaces:**
- Produces: `stateActionKey<S, A>(state: S, action: A): string`
- Produces: `GovernanceDecision` gains two variants: `{ action: "MONITOR_SAFE"; margin: number }` and `{ action: "RECALIBRATE"; reason: string }`
- Produces: `ContractReport` gains `recalibrationCount: number` and `lastRecalibrationReason: string | null`

- [ ] **Step 1: Write the failing test**

Create `cli/src/runtime/g2.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { stateActionKey } from './types.js';

describe('stateActionKey', () => {
  it('produces the same key for the same state and action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a0' });
    expect(k1).toBe(k2);
  });

  it('produces different keys for different actions on the same state', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's0' }, { id: 'a1' });
    expect(k1).not.toBe(k2);
  });

  it('produces different keys for different states with the same action', () => {
    const k1 = stateActionKey({ id: 's0' }, { id: 'a0' });
    const k2 = stateActionKey({ id: 's1' }, { id: 'a0' });
    expect(k1).not.toBe(k2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — `stateActionKey` is not exported from `./types.js`

- [ ] **Step 3: Add the helper and type extensions**

In `cli/src/runtime/types.ts`, add the helper function and extend the two existing types:

```ts
export function stateActionKey<S, A>(state: S, action: A): string {
  return JSON.stringify(state) + '::' + JSON.stringify(action);
}
```

Replace the existing `GovernanceDecision` type:

```ts
export type GovernanceDecision =
  | { action: "MONITOR"; margin: number }
  | { action: "INTERVENE"; reason: string; margin: number }
  | { action: "MONITOR_SAFE"; margin: number }
  | { action: "RECALIBRATE"; reason: string };
```

Replace the existing `ContractReport` interface:

```ts
export interface ContractReport {
  totalLoss: number;
  interventionCount: number;
  violationCount: number;
  recalibrationCount: number;
  lastRecalibrationReason: string | null;
  epsilon: number;
  epsilonSatisfied: boolean;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Run the full G1 suite to confirm nothing broke**

Run: `npx vitest run cli/src/runtime`
Expected: PASS — G1's `runtime.test.ts` still passes; the `ContractReport`/`GovernanceDecision` extensions are additive (new optional-in-practice fields, new union variants), and G1's tests only assert individual fields (`.totalLoss`, `.interventionCount`), never the whole object shape.

- [ ] **Step 6: Commit**

```bash
git add cli/src/runtime/types.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add stateActionKey helper and extend runtime types for RECALIBRATE"
```

---

## Task 2: UncertaintySet

**Files:**
- Create: `cli/src/runtime/UncertaintySet.ts`
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Consumes: `stateActionKey<S, A>(state: S, action: A): string` (Task 1)
- Produces: `class UncertaintySet<S, A>` with `constructor(epsilon0: number)`, `observe(s: S, a: A): void`, `radius(s: S, a: A): number`, `recover(s: S, a: A): void`, `pMax(s: S, a: A, pHat: number): number`

**Design note:** `UncertaintySet` owns its own per-`(s,a)` observation counter, separate from `TransitionEstimator`'s counts. This is deliberate: `recover()` must have a lasting effect. If `radius()` were driven by `TransitionEstimator`'s cumulative (never-shrinking) count, the very next observation after a recovery would immediately re-shrink `ε` back down using a count still dominated by pre-recalibration history, silently undoing the recovery. An internal, resettable counter is what makes "restore conservatism" actually restore it. `ε(s,a)` before any observation defaults to `ε_0` (widest prior, matching the "no evidence, no confidence" reading from the design's zero-observation interpretation).

- [ ] **Step 1: Write the failing test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
import { UncertaintySet } from './UncertaintySet.js';

describe('UncertaintySet', () => {
  const s0 = { id: 's0' };
  const a0 = { id: 'a0' };

  it('defaults to epsilon0 before any observation', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    expect(u.radius(s0, a0)).toBe(0.6);
  });

  it('shrinks as epsilon0 / sqrt(n) after n observations', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    expect(u.radius(s0, a0)).toBeCloseTo(0.6 / Math.sqrt(100), 10);
  });

  it('recover() resets the radius to epsilon0', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    u.recover(s0, a0);
    expect(u.radius(s0, a0)).toBe(0.6);
  });

  it('a later observation after recovery re-shrinks from zero, not from the stale count', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    u.recover(s0, a0);
    u.observe(s0, a0);
    expect(u.radius(s0, a0)).toBeCloseTo(0.6 / Math.sqrt(1), 10);
  });

  it('pMax caps at 1 and equals min(1, pHat + radius/2)', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    expect(u.pMax(s0, a0, 0.0)).toBeCloseTo(0.3, 10);
    expect(u.pMax(s0, a0, 0.9)).toBe(1);
  });

  it('tracks (s,a) pairs independently', () => {
    const u = new UncertaintySet<typeof s0, typeof a0>(0.6);
    const a1 = { id: 'a1' };
    for (let i = 0; i < 100; i++) u.observe(s0, a0);
    expect(u.radius(s0, a1)).toBe(0.6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — cannot find module `./UncertaintySet.js`

- [ ] **Step 3: Implement UncertaintySet**

Create `cli/src/runtime/UncertaintySet.ts`:

```ts
import { stateActionKey } from './types.js';

export class UncertaintySet<S, A> {
  private counts = new Map<string, number>();

  constructor(private epsilon0: number) {}

  observe(s: S, a: A): void {
    const key = stateActionKey(s, a);
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  radius(s: S, a: A): number {
    const n = this.counts.get(stateActionKey(s, a)) ?? 0;
    return n === 0 ? this.epsilon0 : this.epsilon0 / Math.sqrt(n);
  }

  recover(s: S, a: A): void {
    this.counts.set(stateActionKey(s, a), 0);
  }

  pMax(s: S, a: A, pHat: number): number {
    return Math.min(1, pHat + this.radius(s, a) / 2);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (9 tests total)

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/UncertaintySet.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add UncertaintySet with self-resetting per-(s,a) L1 radius"
```

---

## Task 3: TransitionEstimator

**Files:**
- Create: `cli/src/runtime/TransitionEstimator.ts`
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Consumes: `stateActionKey<S, A>(state: S, action: A): string` (Task 1)
- Produces: `class TransitionEstimator<S, A>` with `constructor(windowSize: number)`, `observe(s: S, a: A, sNext: S): void`, `count(s: S, a: A): number`, `estimate(s: S, a: A, sNext: S): number`, `windowEstimate(s: S, a: A, sNext: S): number`, `forget(s: S, a: A): void`

**Design note:** `estimate`/`windowEstimate` return the probability of one specific candidate `sNext`, not a full distribution map — this matches how `RobustMarginEstimator` and `ValidityMonitor` will consume it (querying per-candidate inside a loop over `tds.states`, same iteration shape as `computeDynamicMargin`). `forget(s,a)` clears only the full-history counts for that pair — the window is left intact, since a fixed-size window already "forgets" old data on its own by construction. `forget` exists for the recovery path (Task 11): widening `ε` alone doesn't help if the point estimate `P̂` itself stays biased by pre-shift history, so full recovery needs to discard the stale baseline too.

- [ ] **Step 1: Write the failing test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
import { TransitionEstimator } from './TransitionEstimator.js';

describe('TransitionEstimator', () => {
  const s0 = { id: 's0' };
  const sSafe = { id: 's_safe' };
  const sFail = { id: 's_fail' };
  const a0 = { id: 'a0' };

  it('count is 0 before any observation', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    expect(e.count(s0, a0)).toBe(0);
  });

  it('estimate is 0 for any candidate before any observation', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    expect(e.estimate(s0, a0, sFail)).toBe(0);
  });

  it('estimate reflects observed frequencies over full history', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 71; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 29; i++) e.observe(s0, a0, sFail);
    expect(e.count(s0, a0)).toBe(100);
    expect(e.estimate(s0, a0, sFail)).toBeCloseTo(0.29, 10);
    expect(e.estimate(s0, a0, sSafe)).toBeCloseTo(0.71, 10);
  });

  it('windowEstimate reflects only the most recent windowSize observations', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(5);
    for (let i = 0; i < 50; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 5; i++) e.observe(s0, a0, sFail);
    expect(e.windowEstimate(s0, a0, sFail)).toBe(1);
    expect(e.estimate(s0, a0, sFail)).toBeCloseTo(5 / 55, 10);
  });

  it('forget clears full-history counts but not the window', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(5);
    for (let i = 0; i < 50; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 5; i++) e.observe(s0, a0, sFail);
    e.forget(s0, a0);
    expect(e.count(s0, a0)).toBe(0);
    expect(e.estimate(s0, a0, sFail)).toBe(0);
    expect(e.windowEstimate(s0, a0, sFail)).toBe(1);
  });

  it('tracks (s,a) pairs independently', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    const a1 = { id: 'a1' };
    for (let i = 0; i < 10; i++) e.observe(s0, a0, sFail);
    expect(e.count(s0, a1)).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — cannot find module `./TransitionEstimator.js`

- [ ] **Step 3: Implement TransitionEstimator**

Create `cli/src/runtime/TransitionEstimator.ts`:

```ts
import { stateActionKey } from './types.js';

export class TransitionEstimator<S, A> {
  private fullCounts = new Map<string, Map<string, number>>();
  private fullTotal = new Map<string, number>();
  private window = new Map<string, string[]>();

  constructor(private windowSize: number) {}

  observe(s: S, a: A, sNext: S): void {
    const key = stateActionKey(s, a);
    const nextKey = JSON.stringify(sNext);

    const counts = this.fullCounts.get(key) ?? new Map<string, number>();
    counts.set(nextKey, (counts.get(nextKey) ?? 0) + 1);
    this.fullCounts.set(key, counts);
    this.fullTotal.set(key, (this.fullTotal.get(key) ?? 0) + 1);

    const win = this.window.get(key) ?? [];
    win.push(nextKey);
    if (win.length > this.windowSize) win.shift();
    this.window.set(key, win);
  }

  count(s: S, a: A): number {
    return this.fullTotal.get(stateActionKey(s, a)) ?? 0;
  }

  estimate(s: S, a: A, sNext: S): number {
    const key = stateActionKey(s, a);
    const total = this.fullTotal.get(key) ?? 0;
    if (total === 0) return 0;
    const counts = this.fullCounts.get(key);
    return (counts?.get(JSON.stringify(sNext)) ?? 0) / total;
  }

  windowEstimate(s: S, a: A, sNext: S): number {
    const win = this.window.get(stateActionKey(s, a)) ?? [];
    if (win.length === 0) return 0;
    const nextKey = JSON.stringify(sNext);
    const matches = win.filter(k => k === nextKey).length;
    return matches / win.length;
  }

  forget(s: S, a: A): void {
    const key = stateActionKey(s, a);
    this.fullCounts.delete(key);
    this.fullTotal.delete(key);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (15 tests total)

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/TransitionEstimator.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add TransitionEstimator with full-history and windowed estimates"
```

---

## Task 4: ValidityMonitor

**Files:**
- Create: `cli/src/runtime/ValidityMonitor.ts`
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Consumes: `TransitionEstimator<S, A>` (Task 3): `estimate(s,a,sNext)`, `windowEstimate(s,a,sNext)`
- Produces: `class ValidityMonitor<S, A>` with `constructor(estimator: TransitionEstimator<S, A>, candidateStates: S[], tau: number)`, `drift(s: S, a: A): number`, `isMismatched(s: S, a: A): boolean`

- [ ] **Step 1: Write the failing test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
import { ValidityMonitor } from './ValidityMonitor.js';

describe('ValidityMonitor', () => {
  const s0 = { id: 's0' };
  const sSafe = { id: 's_safe' };
  const sFail = { id: 's_fail' };
  const a0 = { id: 'a0' };
  const candidates = [s0, sSafe, sFail];

  it('drift is 0 when window and full-history estimates agree', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 100; i++) e.observe(s0, a0, i % 5 === 0 ? sFail : sSafe);
    const v = new ValidityMonitor(e, candidates, 0.3);
    expect(v.drift(s0, a0)).toBeLessThan(0.01);
  });

  it('drift is large when a burst of anomalous observations fills the window', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 500; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 15; i++) e.observe(s0, a0, sFail);
    const v = new ValidityMonitor(e, candidates, 0.3);
    expect(v.drift(s0, a0)).toBeGreaterThan(0.3);
  });

  it('isMismatched compares drift against tau', () => {
    const e = new TransitionEstimator<typeof s0, typeof a0>(20);
    for (let i = 0; i < 500; i++) e.observe(s0, a0, sSafe);
    for (let i = 0; i < 15; i++) e.observe(s0, a0, sFail);
    const strict = new ValidityMonitor(e, candidates, 0.3);
    const lenient = new ValidityMonitor(e, candidates, 0.9);
    expect(strict.isMismatched(s0, a0)).toBe(true);
    expect(lenient.isMismatched(s0, a0)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — cannot find module `./ValidityMonitor.js`

- [ ] **Step 3: Implement ValidityMonitor**

Create `cli/src/runtime/ValidityMonitor.ts`:

```ts
import { TransitionEstimator } from './TransitionEstimator.js';

export class ValidityMonitor<S, A> {
  constructor(
    private estimator: TransitionEstimator<S, A>,
    private candidateStates: S[],
    private tau: number,
  ) {}

  drift(s: S, a: A): number {
    return this.candidateStates.reduce((sum, sNext) => {
      const pFull = this.estimator.estimate(s, a, sNext);
      const pWindow = this.estimator.windowEstimate(s, a, sNext);
      return sum + Math.abs(pWindow - pFull);
    }, 0);
  }

  isMismatched(s: S, a: A): boolean {
    return this.drift(s, a) > this.tau;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (18 tests total)

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/ValidityMonitor.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add ValidityMonitor for same-metric L1 drift detection"
```

---

## Task 5: RobustMarginEstimator

**Files:**
- Create: `cli/src/runtime/RobustMarginEstimator.ts`
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Consumes: `TransitionSystem<S, A>` (`cli/src/takt-core/margin.ts`) — uses only `.states` and `.actions`, never `.transition` (the true transition function is what's unknown; candidates come from `tds.states`, probabilities come from `estimator`/`uncertainty`)
- Consumes: `TransitionEstimator<S, A>.estimate(s,a,sNext): number` (Task 3)
- Consumes: `UncertaintySet<S, A>.pMax(s,a,pHat): number` (Task 2)
- Consumes: `ReferencePolicy<S, A>` from `cli/src/takt-core/coverage.js`
- Produces: `class RobustMarginEstimator<S, A, O>` with `constructor(tds, estimator, uncertainty, D, π, O, maxDepth = 50)`, `estimate(prefix: TrajectoryPrefix<S, A>): number`

**Design note:** This mirrors `computeDynamicMargin`'s recursion shape exactly (decision-loss check, memoization on `state+depth`, `min` over `(action, next-state)`), substituting `uncertainty.pMax(state, action, estimator.estimate(state, action, candidate))` for `prob`, per the design spec's "Design Refinement" closed form. It does not call `computeDynamicMargin` — G1's function is frozen and has no hook for a pluggable probability source, so this is a parallel implementation, exactly as the design's architecture diagram specifies (`DynamicMarginEstimator` and `RobustMarginEstimator` as siblings, not one wrapping the other).

- [ ] **Step 1: Write the failing test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
import { RobustMarginEstimator } from './RobustMarginEstimator.js';
import { DynamicMarginEstimator } from './DynamicMarginEstimator.js';
import type { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';

describe('RobustMarginEstimator', () => {
  interface GState { id: string; }
  interface GAction { id: string; }
  interface GObs { id: string; }

  const s0: GState = { id: 's0' };
  const sSafe: GState = { id: 's_safe' };
  const sFail: GState = { id: 's_fail' };
  const a0: GAction = { id: 'a0' };

  function buildTDS(pFail: number): TransitionSystem<GState, GAction> {
    return {
      states: [s0, sSafe, sFail],
      actions: [a0],
      transition: (s) => {
        if (s.id === 's0') return [
          { state: sSafe, prob: 1 - pFail },
          { state: sFail, prob: pFail },
        ];
        if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
        if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
        return [];
      },
    };
  }

  const O = (s: GState): GObs => ({ id: s.id });
  const D = (_p: TrajectoryPrefix<GState, GAction>): GAction => a0;
  const π = (obs: GObs[]): GAction => {
    const last = obs[obs.length - 1];
    return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
  };

  it('with zero uncertainty (epsilon=0) and an exact point estimate, matches DynamicMarginEstimator', () => {
    const trueP = 0.3;
    const tds = buildTDS(trueP);

    const estimator = new TransitionEstimator<GState, GAction>(20);
    for (let i = 0; i < 700; i++) estimator.observe(s0, a0, sSafe);
    for (let i = 0; i < 300; i++) estimator.observe(s0, a0, sFail);

    const uncertainty = new UncertaintySet<GState, GAction>(0);
    for (let i = 0; i < 1000; i++) uncertainty.observe(s0, a0);

    const robust = new RobustMarginEstimator(tds, estimator, uncertainty, D, π, O);
    const dynamic = new DynamicMarginEstimator(tds, D, π, O);

    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    expect(robust.estimate(prefix)).toBeCloseTo(dynamic.estimate(prefix), 6);
  });

  it('widening epsilon never increases the margin (robust margin is conservative)', () => {
    const tds = buildTDS(0.3);
    const estimator = new TransitionEstimator<GState, GAction>(20);
    for (let i = 0; i < 700; i++) estimator.observe(s0, a0, sSafe);
    for (let i = 0; i < 300; i++) estimator.observe(s0, a0, sFail);

    const tightUncertainty = new UncertaintySet<GState, GAction>(0.01);
    for (let i = 0; i < 1000; i++) tightUncertainty.observe(s0, a0);
    const wideUncertainty = new UncertaintySet<GState, GAction>(0.6);
    for (let i = 0; i < 1000; i++) wideUncertainty.observe(s0, a0);

    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    const tight = new RobustMarginEstimator(tds, estimator, tightUncertainty, D, π, O).estimate(prefix);
    const wide = new RobustMarginEstimator(tds, estimator, wideUncertainty, D, π, O).estimate(prefix);
    expect(wide).toBeLessThanOrEqual(tight);
  });

  it('an unobserved (s,a) pair still yields a finite margin via the epsilon/2 prior', () => {
    const tds = buildTDS(0.3);
    const estimator = new TransitionEstimator<GState, GAction>(20);
    const uncertainty = new UncertaintySet<GState, GAction>(0.6);
    const robust = new RobustMarginEstimator(tds, estimator, uncertainty, D, π, O);
    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    const margin = robust.estimate(prefix);
    expect(margin).toBeGreaterThan(0);
    expect(margin).toBeLessThan(Infinity);
    expect(margin).toBeCloseTo(-Math.log(0.3), 6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — cannot find module `./RobustMarginEstimator.js`

- [ ] **Step 3: Implement RobustMarginEstimator**

Create `cli/src/runtime/RobustMarginEstimator.ts`:

```ts
import { TrajectoryPrefix } from '../takt-core/types.js';
import { TransitionSystem } from '../takt-core/margin.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';
import { UncertaintySet } from './UncertaintySet.js';
import { TransitionEstimator } from './TransitionEstimator.js';

function surprisalCost(prob: number): number {
  if (prob <= 0) return Infinity;
  return -Math.log(prob);
}

function memoKey<S>(state: S, depth: number): string {
  return JSON.stringify(state) + '@' + depth;
}

export class RobustMarginEstimator<S, A, O> {
  constructor(
    private tds: TransitionSystem<S, A>,
    private estimator: TransitionEstimator<S, A>,
    private uncertainty: UncertaintySet<S, A>,
    private D: ReferencePolicy<S, A>,
    private π: (obs: O[]) => A,
    private O: (state: S) => O,
    private maxDepth: number = 50,
  ) {}

  estimate(prefix: TrajectoryPrefix<S, A>): number {
    return this.computeRobustMargin(prefix, 0, new Map());
  }

  private computeRobustMargin(
    prefix: TrajectoryPrefix<S, A>,
    depth: number,
    memo: Map<string, number>,
  ): number {
    const currentState = prefix.states[prefix.states.length - 1];
    const key = memoKey(currentState, depth);
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const obs = prefix.states.map(this.O);
    const decisionLoss = JSON.stringify(this.D(prefix)) !== JSON.stringify(this.π(obs));
    if (decisionLoss) { memo.set(key, 0); return 0; }
    if (depth >= this.maxDepth) { memo.set(key, Infinity); return Infinity; }

    let minCost = Infinity;
    for (const action of this.tds.actions) {
      for (const candidate of this.tds.states) {
        const pHat = this.estimator.estimate(currentState, action, candidate);
        const pMax = this.uncertainty.pMax(currentState, action, pHat);
        if (pMax <= 0) continue;
        const stepCost = surprisalCost(pMax);
        const extended: TrajectoryPrefix<S, A> = {
          states: [...prefix.states, candidate],
          actions: [...prefix.actions, action],
        };
        const restCost = this.computeRobustMargin(extended, depth + 1, memo);
        if (restCost === Infinity) continue;
        const totalCost = stepCost + restCost;
        if (totalCost < minCost) minCost = totalCost;
      }
    }
    memo.set(key, minCost);
    return minCost;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (21 tests total)

- [ ] **Step 5: Commit**

```bash
git add cli/src/runtime/RobustMarginEstimator.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add RobustMarginEstimator, exact closed-form robust shortest-path"
```

---

## Task 6: AuditPolicy.decideSafe and ContractEvaluator RECALIBRATE tracking

**Files:**
- Modify: `cli/src/runtime/AuditPolicy.ts`
- Modify: `cli/src/runtime/ContractEvaluator.ts`
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Produces: `AuditPolicy.decideSafe(marginSafe: number, threshold: number, drift: number, tau: number): GovernanceDecision`
- Produces: `ContractEvaluator.report()` now includes `recalibrationCount` and `lastRecalibrationReason`

**Design note:** `decideSafe` checks drift before the margin — a mismatch means the margin computation itself may not be trustworthy, so `RECALIBRATE` takes priority over `INTERVENE`/`MONITOR_SAFE`. G1's `decide(margin, threshold)` method is untouched.

- [ ] **Step 1: Write the failing test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
import { AuditPolicy } from './AuditPolicy.js';
import { ContractEvaluator } from './ContractEvaluator.js';

describe('AuditPolicy.decideSafe', () => {
  it('returns RECALIBRATE when drift exceeds tau, regardless of margin', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(10, 0.5, 0.6, 0.3);
    expect(decision.action).toBe('RECALIBRATE');
  });

  it('returns INTERVENE when drift is within tau but margin is below threshold', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(0.1, 0.5, 0.1, 0.3);
    expect(decision.action).toBe('INTERVENE');
  });

  it('returns MONITOR_SAFE when drift is within tau and margin is at or above threshold', () => {
    const policy = new AuditPolicy();
    const decision = policy.decideSafe(1.0, 0.5, 0.1, 0.3);
    expect(decision.action).toBe('MONITOR_SAFE');
  });

  it('G1 decide() is unaffected', () => {
    const policy = new AuditPolicy();
    expect(policy.decide(0.1, 0.5).action).toBe('INTERVENE');
    expect(policy.decide(1.0, 0.5).action).toBe('MONITOR');
  });
});

describe('ContractEvaluator RECALIBRATE tracking', () => {
  it('counts recalibrations and records the last reason', () => {
    const evaluator = new ContractEvaluator(0.3);
    evaluator.evaluate({ action: 'RECALIBRATE', reason: 'Δ=0.60 > τ=0.30' }, { loss: false });
    const report = evaluator.report();
    expect(report.recalibrationCount).toBe(1);
    expect(report.lastRecalibrationReason).toBe('Δ=0.60 > τ=0.30');
  });

  it('reset() clears recalibration tracking', () => {
    const evaluator = new ContractEvaluator(0.3);
    evaluator.evaluate({ action: 'RECALIBRATE', reason: 'first' }, { loss: false });
    evaluator.reset();
    const report = evaluator.report();
    expect(report.recalibrationCount).toBe(0);
    expect(report.lastRecalibrationReason).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: FAIL — `decideSafe` does not exist on `AuditPolicy`; `report().recalibrationCount` is `undefined`

- [ ] **Step 3: Implement decideSafe and RECALIBRATE tracking**

In `cli/src/runtime/AuditPolicy.ts`, add the method (keep the existing `decide` unchanged):

```ts
import { GovernanceDecision } from './types.js';

export class AuditPolicy {
  decide(margin: number, threshold: number): GovernanceDecision {
    if (margin < threshold) {
      return { action: "INTERVENE", reason: `M_D=${margin.toFixed(3)} < θ=${threshold}`, margin };
    }
    return { action: "MONITOR", margin };
  }

  decideSafe(marginSafe: number, threshold: number, drift: number, tau: number): GovernanceDecision {
    if (drift > tau) {
      return { action: "RECALIBRATE", reason: `Δ=${drift.toFixed(3)} > τ=${tau}` };
    }
    if (marginSafe < threshold) {
      return { action: "INTERVENE", reason: `M_D_safe=${marginSafe.toFixed(3)} < θ=${threshold}`, margin: marginSafe };
    }
    return { action: "MONITOR_SAFE", margin: marginSafe };
  }
}
```

In `cli/src/runtime/ContractEvaluator.ts`, replace the full file:

```ts
import { GovernanceDecision, ContractReport, Outcome } from './types.js';

export class ContractEvaluator {
  private totalLoss = 0;
  private interventionCount = 0;
  private violationCount = 0;
  private recalibrationCount = 0;
  private lastRecalibrationReason: string | null = null;
  readonly epsilon: number;

  constructor(epsilon: number) {
    this.epsilon = epsilon;
  }

  evaluate(decision: GovernanceDecision, outcome: Outcome): void {
    if (decision.action === "INTERVENE") {
      this.interventionCount++;
    }
    if (decision.action === "RECALIBRATE") {
      this.recalibrationCount++;
      this.lastRecalibrationReason = decision.reason;
    }
    if (outcome.loss) {
      this.totalLoss++;
      if (decision.action !== "INTERVENE") {
        this.violationCount++;
      }
    }
  }

  report(): ContractReport {
    return {
      totalLoss: this.totalLoss,
      interventionCount: this.interventionCount,
      violationCount: this.violationCount,
      recalibrationCount: this.recalibrationCount,
      lastRecalibrationReason: this.lastRecalibrationReason,
      epsilon: this.epsilon,
      epsilonSatisfied: this.totalLoss <= this.epsilon,
    };
  }

  reset(): void {
    this.totalLoss = 0;
    this.interventionCount = 0;
    this.violationCount = 0;
    this.recalibrationCount = 0;
    this.lastRecalibrationReason = null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS (27 tests total)

- [ ] **Step 5: Run the full G1 suite to confirm nothing broke**

Run: `npx vitest run cli/src/runtime`
Expected: PASS — G1's `runtime.test.ts` R0-R5 tests still pass unchanged.

- [ ] **Step 6: Commit**

```bash
git add cli/src/runtime/AuditPolicy.ts cli/src/runtime/ContractEvaluator.ts cli/src/runtime/g2.test.ts
git commit -m "feat(g2): add AuditPolicy.decideSafe and ContractEvaluator RECALIBRATE tracking"
```

---

## Task 7: R6 integration test — uncertainty lifecycle integrity

**Files:**
- Test: `cli/src/runtime/g2.test.ts` (append)

**Interfaces:**
- Consumes: all of Tasks 1-6 wired together end to end

- [ ] **Step 1: Write the test**

Append to `cli/src/runtime/g2.test.ts`:

```ts
describe('R6: Uncertainty lifecycle integrity', () => {
  interface GState { id: string; }
  interface GAction { id: string; }
  interface GObs { id: string; }

  const s0: GState = { id: 's0' };
  const sSafe: GState = { id: 's_safe' };
  const sFail: GState = { id: 's_fail' };
  const a0: GAction = { id: 'a0' };

  function buildTDS(pFail: number): TransitionSystem<GState, GAction> {
    return {
      states: [s0, sSafe, sFail],
      actions: [a0],
      transition: (s) => {
        if (s.id === 's0') return [
          { state: sSafe, prob: 1 - pFail },
          { state: sFail, prob: pFail },
        ];
        if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
        if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
        return [];
      },
    };
  }

  const O = (s: GState): GObs => ({ id: s.id });
  const D = (_p: TrajectoryPrefix<GState, GAction>): GAction => a0;
  const π = (obs: GObs[]): GAction => {
    const last = obs[obs.length - 1];
    return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
  };

  it('U_t contracts under stationary evidence and restores exactly on recovery — never both, never neither', () => {
    const estimator = new TransitionEstimator<GState, GAction>(20);
    const uncertainty = new UncertaintySet<GState, GAction>(0.6);
    const validity = new ValidityMonitor(estimator, [s0, sSafe, sFail], 0.3);
    const tds = buildTDS(0.1);
    const policy = new AuditPolicy();
    const evaluator = new ContractEvaluator(0.3);

    const radii: number[] = [];
    for (let i = 0; i < 200; i++) {
      const outcome = i % 10 === 0 ? sFail : sSafe;
      estimator.observe(s0, a0, outcome);
      uncertainty.observe(s0, a0);
      radii.push(uncertainty.radius(s0, a0));
    }

    // Stationary evidence: radius is monotonically non-increasing.
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeLessThanOrEqual(radii[i - 1]);
    }

    const preRecoveryRadius = uncertainty.radius(s0, a0);
    expect(preRecoveryRadius).toBeLessThan(0.6);

    // A recovery event resets the radius exactly to epsilon0 — not partially, not to zero.
    uncertainty.recover(s0, a0);
    expect(uncertainty.radius(s0, a0)).toBe(0.6);

    // The full pipeline runs end to end without throwing, producing a well-formed decision.
    const robust = new RobustMarginEstimator(tds, estimator, uncertainty, D, π, O);
    const prefix: TrajectoryPrefix<GState, GAction> = { states: [s0], actions: [] };
    const marginSafe = robust.estimate(prefix);
    const drift = validity.drift(s0, a0);
    const decision = policy.decideSafe(marginSafe, 1.0, drift, 0.3);
    evaluator.evaluate(decision, { loss: false });

    expect(['MONITOR_SAFE', 'INTERVENE', 'RECALIBRATE']).toContain(decision.action);
    expect(Number.isFinite(marginSafe) || marginSafe === Infinity).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails, then implement**

There is no new production code for this task — it composes Tasks 1-6. Run:

Run: `npx vitest run cli/src/runtime/g2.test.ts`
Expected: PASS immediately (28 tests total) — if it fails, the bug is in one of Tasks 1-6's implementations, not something new to build here. Debug against the failing assertion before proceeding.

- [ ] **Step 3: Commit**

```bash
git add cli/src/runtime/g2.test.ts
git commit -m "test(g2): add R6 uncertainty lifecycle integrity integration test"
```

---

## Task 8: batch-g2-001 — optimistic model adversary

**Files:**
- Create: `cli/src/batch-g2-001/fixtures.ts`
- Create: `cli/src/batch-g2-001/eval.ts`
- Test: `cli/src/batch-g2-001/eval.test.ts`

**Interfaces:**
- Consumes: `TransitionEstimator`, `UncertaintySet`, `RobustMarginEstimator`, `DynamicMarginEstimator` (`../runtime/*.js`)
- Produces: `executeBatchG2001(): BatchG2001Result`

**Claim under test:** the safety invariant `P* ∈ U_t ⟹ M_D^safe(t) ≤ M_D(P*)` holds even in the adversarial limit where the true failure probability sits exactly on the boundary of `U_t`.

- [ ] **Step 1: Write the fixtures**

Create `cli/src/batch-g2-001/fixtures.ts`:

```ts
import { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';

export interface G2State { id: string; }
export interface G2Action { id: string; }
export interface G2Obs { id: string; }

export const s0: G2State = { id: 's0' };
export const sSafe: G2State = { id: 's_safe' };
export const sFail: G2State = { id: 's_fail' };
export const a0: G2Action = { id: 'a0' };

export function buildBinaryTDS(pFail: number): TransitionSystem<G2State, G2Action> {
  return {
    states: [s0, sSafe, sFail],
    actions: [a0],
    transition: (s) => {
      if (s.id === 's0') return [
        { state: sSafe, prob: 1 - pFail },
        { state: sFail, prob: pFail },
      ];
      if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
      if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
      return [];
    },
  };
}

export const O = (s: G2State): G2Obs => ({ id: s.id });
export const D: ReferencePolicy<G2State, G2Action> = (_p: TrajectoryPrefix<G2State, G2Action>) => a0;
export const π = (obs: G2Obs[]): G2Action => {
  const last = obs[obs.length - 1];
  return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
};
```

- [ ] **Step 2: Write the failing test**

Create `cli/src/batch-g2-001/eval.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { executeBatchG2001 } from './eval.js';

describe('G2-001: optimistic model adversary', () => {
  it('robust margin remains conservative when P* sits exactly at the edge of U_t', () => {
    const result = executeBatchG2001();
    expect(result.invariantHolds).toBe(true);
    expect(result.mdSafe).toBeLessThanOrEqual(result.mdTrue + 1e-9);
  });

  it('P* at the edge is strictly less safe than the point estimate P_hat', () => {
    const result = executeBatchG2001();
    expect(result.pTrueFail).toBeGreaterThan(result.pHatFail);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-g2-001`
Expected: FAIL — cannot find module `./eval.js`

- [ ] **Step 4: Implement the batch**

Create `cli/src/batch-g2-001/eval.ts`:

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-g2-001`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add cli/src/batch-g2-001
git commit -m "feat(g2): add batch-g2-001, optimistic model adversary validation"
```

---

## Task 9: batch-g2-002 — uncertainty collapse adversary

**Files:**
- Create: `cli/src/batch-g2-002/fixtures.ts`
- Create: `cli/src/batch-g2-002/eval.ts`
- Test: `cli/src/batch-g2-002/eval.test.ts`

**Interfaces:**
- Consumes: `TransitionEstimator`, `UncertaintySet`, `ValidityMonitor`, `RobustMarginEstimator`, `AuditPolicy` (`../runtime/*.js`)
- Produces: `executeBatchG2002(): BatchG2002Result`

**Claim under test:** a shrunk `ε` alone can produce false confidence after a burst of anomalous observations; the `ValidityMonitor` catches it and `AuditPolicy` overrides the falsely-safe margin with `RECALIBRATE`.

- [ ] **Step 1: Write the fixtures**

Create `cli/src/batch-g2-002/fixtures.ts` (identical shape to Task 8's, self-contained per batch-directory convention):

```ts
import { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';

export interface G2State { id: string; }
export interface G2Action { id: string; }
export interface G2Obs { id: string; }

export const s0: G2State = { id: 's0' };
export const sSafe: G2State = { id: 's_safe' };
export const sFail: G2State = { id: 's_fail' };
export const a0: G2Action = { id: 'a0' };

export function buildBinaryTDS(pFail: number): TransitionSystem<G2State, G2Action> {
  return {
    states: [s0, sSafe, sFail],
    actions: [a0],
    transition: (s) => {
      if (s.id === 's0') return [
        { state: sSafe, prob: 1 - pFail },
        { state: sFail, prob: pFail },
      ];
      if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
      if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
      return [];
    },
  };
}

export const O = (s: G2State): G2Obs => ({ id: s.id });
export const D: ReferencePolicy<G2State, G2Action> = (_p: TrajectoryPrefix<G2State, G2Action>) => a0;
export const π = (obs: G2Obs[]): G2Action => {
  const last = obs[obs.length - 1];
  return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
};
```

- [ ] **Step 2: Write the failing test**

Create `cli/src/batch-g2-002/eval.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { executeBatchG2002 } from './eval.js';

describe('G2-002: uncertainty collapse adversary', () => {
  it('drift exceeds tau after a burst of anomalous observations', () => {
    const result = executeBatchG2002();
    expect(result.driftDetected).toBe(true);
    expect(result.drift).toBeGreaterThan(result.tau);
  });

  it('the margin alone (ignoring drift) would falsely report safety', () => {
    const result = executeBatchG2002();
    expect(result.naiveWouldFalselyMonitor).toBe(true);
  });

  it('AuditPolicy overrides the falsely-safe margin with RECALIBRATE', () => {
    const result = executeBatchG2002();
    expect(result.decisionWithMonitor).toBe('RECALIBRATE');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-g2-002`
Expected: FAIL — cannot find module `./eval.js`

- [ ] **Step 4: Implement the batch**

Create `cli/src/batch-g2-002/eval.ts`:

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-g2-002`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add cli/src/batch-g2-002
git commit -m "feat(g2): add batch-g2-002, uncertainty collapse adversary validation"
```

---

## Task 10: batch-g2-003 — sparse observation boundary characterization

**Files:**
- Create: `cli/src/batch-g2-003/fixtures.ts`
- Create: `cli/src/batch-g2-003/eval.ts`
- Test: `cli/src/batch-g2-003/eval.test.ts`

**Interfaces:**
- Consumes: `TransitionEstimator`, `UncertaintySet` (`../runtime/*.js`)
- Produces: `executeBatchG2003(): BatchG2003Result`

**Claim under test:** this is a characterization batch, not pass/fail (see design spec, L-G2-001). It demonstrates the sa-rectangularity boundary directly: two `(s,a)` pairs whose true failure probability is identical, but where observing only one leaves the other at maximal, unexploited uncertainty — the seam sa-rectangularity leaves unmodeled.

- [ ] **Step 1: Write the fixtures**

Create `cli/src/batch-g2-003/fixtures.ts`. Two independent entry points, `s0_a` and `s0_b`, that in truth share the same hidden failure rate — sa-rectangularity treats their uncertainty sets as unrelated regardless (this batch needs only the state/action identities to drive `TransitionEstimator`/`UncertaintySet` directly; it doesn't need a full `TransitionSystem`, since it demonstrates the gap between two independently-tracked uncertainty sets rather than comparing against a ground-truth margin):

```ts
export interface G2State { id: string; }
export interface G2Action { id: string; }

export const s0a: G2State = { id: 's0_a' };
export const s0b: G2State = { id: 's0_b' };
export const sSafe: G2State = { id: 's_safe' };
export const sFail: G2State = { id: 's_fail' };
export const a0: G2Action = { id: 'a0' };
```

- [ ] **Step 2: Write the failing test**

Create `cli/src/batch-g2-003/eval.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-g2-003`
Expected: FAIL — cannot find module `./eval.js`

- [ ] **Step 4: Implement the batch**

Create `cli/src/batch-g2-003/eval.ts`:

```ts
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
    excessConservatismGap: unobservedPairMD - observedPairMD,
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-g2-003`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add cli/src/batch-g2-003
git commit -m "feat(g2): add batch-g2-003, sparse observation boundary characterization"
```

---

## Task 11: batch-g2-004 — distribution shift adversary

**Files:**
- Create: `cli/src/batch-g2-004/fixtures.ts`
- Create: `cli/src/batch-g2-004/eval.ts`
- Test: `cli/src/batch-g2-004/eval.test.ts`

**Interfaces:**
- Consumes: `TransitionEstimator`, `UncertaintySet`, `ValidityMonitor`, `RobustMarginEstimator`, `AuditPolicy` (`../runtime/*.js`)
- Produces: `executeBatchG2004(): BatchG2004Result`

**Claim under test:** after a genuine regime shift, the drift detector fires, `RECALIBRATE` widens `ε` and forgets the stale point estimate (both are necessary — widening `ε` alone leaves a biased `P̂` from the pre-shift regime, per the design note in Task 3), and once enough fresh evidence accumulates post-recovery, the contract correctly reflects the new dangerous regime.

- [ ] **Step 1: Write the fixtures**

Create `cli/src/batch-g2-004/fixtures.ts` (same shape as Task 8/9, self-contained):

```ts
import { TransitionSystem } from '../takt-core/margin.js';
import type { TrajectoryPrefix } from '../takt-core/types.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';

export interface G2State { id: string; }
export interface G2Action { id: string; }
export interface G2Obs { id: string; }

export const s0: G2State = { id: 's0' };
export const sSafe: G2State = { id: 's_safe' };
export const sFail: G2State = { id: 's_fail' };
export const a0: G2Action = { id: 'a0' };

export function buildBinaryTDS(pFail: number): TransitionSystem<G2State, G2Action> {
  return {
    states: [s0, sSafe, sFail],
    actions: [a0],
    transition: (s) => {
      if (s.id === 's0') return [
        { state: sSafe, prob: 1 - pFail },
        { state: sFail, prob: pFail },
      ];
      if (s.id === 's_safe') return [{ state: s0, prob: 1.0 }];
      if (s.id === 's_fail') return [{ state: sFail, prob: 1.0 }];
      return [];
    },
  };
}

export const O = (s: G2State): G2Obs => ({ id: s.id });
export const D: ReferencePolicy<G2State, G2Action> = (_p: TrajectoryPrefix<G2State, G2Action>) => a0;
export const π = (obs: G2Obs[]): G2Action => {
  const last = obs[obs.length - 1];
  return last.id === 's_fail' ? { id: 'a1' } : { id: 'a0' };
};
```

- [ ] **Step 2: Write the failing test**

Create `cli/src/batch-g2-004/eval.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { executeBatchG2004 } from './eval.js';

describe('G2-004: distribution shift adversary', () => {
  it('epsilon is tight before the shift', () => {
    const result = executeBatchG2004();
    expect(result.preShiftEpsilon).toBeLessThan(0.05);
  });

  it('drift exceeds tau once the window fills with post-shift observations', () => {
    const result = executeBatchG2004();
    expect(result.driftAfterShift).toBeGreaterThan(result.tau);
    expect(result.recalibrated).toBe(true);
  });

  it('recovery restores epsilon to epsilon0 immediately', () => {
    const result = executeBatchG2004();
    expect(result.postRecoveryEpsilonImmediate).toBe(0.6);
  });

  it('after fresh post-recovery evidence accumulates, the contract correctly flags the new dangerous regime', () => {
    const result = executeBatchG2004();
    expect(result.postRecoveryDecision).toBe('INTERVENE');
    expect(result.postRecoveryMDSafe).toBeLessThan(1.0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-g2-004`
Expected: FAIL — cannot find module `./eval.js`

- [ ] **Step 4: Implement the batch**

Create `cli/src/batch-g2-004/eval.ts`:

```ts
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-g2-004`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add cli/src/batch-g2-004
git commit -m "feat(g2): add batch-g2-004, distribution shift adversary and recovery lifecycle"
```

---

## Task 12: Full suite verification and push

**Files:** none (verification only)

- [ ] **Step 1: Run the complete suite**

Run: `npx vitest run`
Expected: PASS — all prior 142 tests (F/G1) plus the new G2 tests (28 in `g2.test.ts` + 2+3+2+4 across the four batches = 39 new tests), 181 total, 0 regressions.

- [ ] **Step 2: Run the standalone reference script to confirm nothing in takt-core shifted**

Run: `npx tsx scratch/phase-f-results.ts`
Expected: identical output to the last recorded run (F-001 through F-004 results unchanged) — confirms G2's new files did not alter any `takt-core` behavior, since G1's `DynamicMarginEstimator` and G2's `RobustMarginEstimator` are siblings, not shared mutable state.

- [ ] **Step 3: Push**

```bash
git push origin main
```
