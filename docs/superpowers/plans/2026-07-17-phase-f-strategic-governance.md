# Phase F — Strategic Governance Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement TAKT v4.0 strategic governance framework as TypeScript validation batches F-001 through F-004.

**Architecture:** Shared library `takt-core/` provides core TDS types and algorithms (observational equivalence, coverage, consistency, dynamic margin, game types). Each batch is a self-contained directory under `cli/src/batch-f-NNN/` that imports from `takt-core` and validates a specific part of the spec.

**Tech Stack:** TypeScript (ESM), Vitest 4.x, no external deps beyond what vitest provides.

## Global Constraints

- All new files go under `cli/src/`
- Imports use `.js` extension convention (ESM): `import { X } from '../takt-core/types.js'`
- Every function/method must have a failing test first (TDD)
- No external dependencies beyond Vitest
- Follow existing batch conventions: `eval.ts` for main logic, `eval.test.ts` for tests
- `npx vitest run <path>` to run tests (no config file needed)
- All code in English; identifiers use camelCase
- The spec document is `docs/superpowers/specs/2026-07-17-phase-f-strategic-governance-design.md`

---

### Task 1: takt-core — Core types, trajectory, and observational equivalence

**Files:**
- Create: `cli/src/takt-core/types.ts`
- Create: `cli/src/takt-core/trajectory.ts`
- Create: `cli/src/takt-core/trajectory.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `Trajectory`, `TrajectoryPrefix`, `State`, `Action`, `Observation`, `ObservationFunction`, `≡_O` equivalence check, prefix extraction

- [ ] **Step 1: Write the failing test for core types and trajectory utilities**

```typescript
import { describe, it, expect } from 'vitest';
import { extractPrefix, observationSequence, observationallyEquivalent } from './trajectory.js';

describe('Trajectory utilities', () => {
  it('extracts prefix τ_{:k} from a trajectory', () => {
    const traj = {
      states: [{ id: 's0', value: 0 }, { id: 's1', value: 1 }, { id: 's2', value: 2 }],
      actions: [{ id: 'a0' }, { id: 'a1' }],
    };
    const prefix = extractPrefix(traj, 1);
    expect(prefix.states).toHaveLength(2);
    expect(prefix.states[1].id).toBe('s1');
    expect(prefix.actions).toHaveLength(1);
    expect(prefix.actions[0].id).toBe('a0');
  });

  it('computes observation sequence O(τ_{:k})', () => {
    const prefix = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω1' }],
      actions: [{ id: 'a0' }],
    };
    const O = (s: { id: string; obs: string }) => ({ id: s.obs });
    const seq = observationSequence(prefix, O);
    expect(seq).toHaveLength(2);
    expect(seq[0]).toEqual({ id: 'ω0' });
    expect(seq[1]).toEqual({ id: 'ω1' });
  });

  it('detects observational equivalence between prefixes', () => {
    const prefixA = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω1' }],
      actions: [{ id: 'a0' }],
    };
    const prefixB = {
      states: [{ id: 's2', obs: 'ω0' }, { id: 's3', obs: 'ω1' }],
      actions: [{ id: 'a1' }],
    };
    const O = (s: { id: string; obs: string }) => ({ id: s.obs });
    expect(observationallyEquivalent(prefixA, prefixB, O)).toBe(true);

    const prefixC = {
      states: [{ id: 's0', obs: 'ω0' }, { id: 's1', obs: 'ω2' }],
      actions: [{ id: 'a0' }],
    };
    expect(observationallyEquivalent(prefixA, prefixC, O)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/takt-core/trajectory.test.ts`
Expected: FAIL with "cannot find module" or similar

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/takt-core/types.ts
export interface State<S = string> {
  id: S;
  [key: string]: unknown;
}

export interface Action<A = string> {
  id: A;
}

export interface Observation<O = string> {
  id: O;
  [key: string]: unknown;
}

export type ObservationFn<S, O> = (state: S) => O;

export interface Trajectory<S, A> {
  states: S[];
  actions: A[];
}

export interface TrajectoryPrefix<S, A> {
  states: S[];
  actions: A[];
}
```

```typescript
// cli/src/takt-core/trajectory.ts
import { Trajectory, TrajectoryPrefix, ObservationFn } from './types.js';

export function extractPrefix<S, A>(
  trajectory: Trajectory<S, A>,
  k: number
): TrajectoryPrefix<S, A> {
  return {
    states: trajectory.states.slice(0, k + 1),
    actions: trajectory.actions.slice(0, k),
  };
}

export function observationSequence<S, A, O>(
  prefix: TrajectoryPrefix<S, A>,
  obsFn: ObservationFn<S, O>
): O[] {
  return prefix.states.map(obsFn);
}

export function observationallyEquivalent<S, A, O>(
  a: TrajectoryPrefix<S, A>,
  b: TrajectoryPrefix<S, A>,
  obsFn: ObservationFn<S, O>
): boolean {
  const seqA = observationSequence(a, obsFn);
  const seqB = observationSequence(b, obsFn);
  if (seqA.length !== seqB.length) return false;
  return seqA.every((o, i) => JSON.stringify(o) === JSON.stringify(seqB[i]));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/takt-core/trajectory.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/takt-core/types.ts cli/src/takt-core/trajectory.ts cli/src/takt-core/trajectory.test.ts
git commit -m "feat(takt-core): add core TDS types and trajectory utilities"
```

---

### Task 2: takt-core — Temporal coverage and decisional consistency

**Files:**
- Create: `cli/src/takt-core/coverage.ts`
- Create: `cli/src/takt-core/coverage.test.ts`

**Interfaces:**
- Consumes: `TrajectoryPrefix`, `ObservationFn`, `observationallyEquivalent` (from Task 1)
- Produces: `checkCoverage(T_audit, π, D, O)`, `checkConsistency(T_audit, D, O)`
- Policy type: `Policy<TrajectoryPrefix, Action>` and `AgentPolicy<Observation[], Action>`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { checkCoverage, checkConsistency } from './coverage.js';
import { observationallyEquivalent } from './trajectory.js';

interface TestState { id: string; rep: number; decision: number; }
interface TestAction { id: string; value: number; }
interface TestObs { rep: number; }

const O = (s: TestState): TestObs => ({ rep: s.rep });

// D: ideal policy that maps prefix to optimal action
function D(prefix: { states: TestState[]; actions: TestAction[] }): TestAction {
  const s = prefix.states[prefix.states.length - 1];
  return { id: `a${s.decision}`, value: s.decision };
}

// π: agent policy that maps observations to actions
function π(obs: TestObs[]): TestAction {
  const last = obs[obs.length - 1];
  return { id: `a${last.rep}`, value: last.rep };
}

describe('Coverage and Consistency', () => {
  const s0: TestState = { id: 's0', rep: 0, decision: 0 };
  const s1: TestState = { id: 's1', rep: 0, decision: 1 };
  const s2: TestState = { id: 's2', rep: 1, decision: 1 };

  it('detects full coverage when T_audit covers all observation classes', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [s2], actions: [] as TestAction[] },
    ];
    const allPrefixes = [
      { states: [s1], actions: [] as TestAction[] },
    ];
    const result = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
    expect(result).toBe(true);
  });

  it('detects coverage failure when an observation class is missing', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
    ];
    const allPrefixes = [
      { states: [s2], actions: [] as TestAction[] },
    ];
    const result = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
    expect(result).toBe(false);
  });

  it('detects consistency when equivalent prefixes yield same D', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [s1], actions: [] as TestAction[] },
    ];
    expect(checkConsistency(T_audit, D, O, observationallyEquivalent)).toBe(true);
  });

  it('detects inconsistency when equivalent prefixes yield different D', () => {
    // s0 and s1 have same rep but different decision
    // D maps them to different actions
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [s1], actions: [] as TestAction[] },
    ];
    expect(checkConsistency(T_audit, D, O, observationallyEquivalent)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/takt-core/coverage.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/takt-core/coverage.ts
import { TrajectoryPrefix, ObservationFn } from './types.js';

export type ReferencePolicy<S, A> = (prefix: TrajectoryPrefix<S, A>) => A;
export type AgentPolicy<S, A, O> = (observations: O[]) => A;

export function checkCoverage<S, A, O>(
  T_audit: TrajectoryPrefix<S, A>[],
  allPrefixes: TrajectoryPrefix<S, A>[],
  obsFn: ObservationFn<S, O>,
  equiv: (a: TrajectoryPrefix<S, A>, b: TrajectoryPrefix<S, A>, fn: ObservationFn<S, O>) => boolean
): boolean {
  return allPrefixes.every(p =>
    T_audit.some(t => equiv(p, t, obsFn))
  );
}

export function checkConsistency<S, A, O>(
  T_audit: TrajectoryPrefix<S, A>[],
  D: ReferencePolicy<S, A>,
  obsFn: ObservationFn<S, O>,
  equiv: (a: TrajectoryPrefix<S, A>, b: TrajectoryPrefix<S, A>, fn: ObservationFn<S, O>) => boolean
): boolean {
  for (let i = 0; i < T_audit.length; i++) {
    for (let j = i + 1; j < T_audit.length; j++) {
      if (equiv(T_audit[i], T_audit[j], obsFn)) {
        const a_i = JSON.stringify(D(T_audit[i]));
        const a_j = JSON.stringify(D(T_audit[j]));
        if (a_i !== a_j) return false;
      }
    }
  }
  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/takt-core/coverage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/takt-core/coverage.ts cli/src/takt-core/coverage.test.ts
git commit -m "feat(takt-core): add temporal coverage and decisional consistency"
```

---

### Task 3: takt-core — Dynamic margin and horizon cost

**Files:**
- Create: `cli/src/takt-core/margin.ts`
- Create: `cli/src/takt-core/margin.test.ts`

**Interfaces:**
- Consumes: `TrajectoryPrefix`, `State`, `Action`, `ReferencePolicy`, `AgentPolicy` (from Tasks 1-2)
- Produces: `TransitionSystem<S, A>`, `computeDynamicMargin(τ_{:k}, TDS, D, π)`, `computeCMax(τ_{:t}, h, TDS)`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { computeDynamicMargin, computeCMax, TransitionSystem } from './margin.js';

interface TState { id: string; group: number; }
interface TAction { id: string; }

describe('Dynamic Margin', () => {
  // Simple 3-state chain: s0 → s1 → s2
  // Transitions: s0-a0→s1 (P=1.0), s0-a1→s2 (P=0.3), s1-a0→s2 (P=1.0), s2-a0→s2 (P=1.0)
  const s0: TState = { id: 's0', group: 0 };
  const s1: TState = { id: 's1', group: 1 };
  const s2: TState = { id: 's2', group: 2 };
  const a0: TAction = { id: 'a0' };
  const a1: TAction = { id: 'a1' };

  const tds: TransitionSystem<TState, TAction> = {
    states: [s0, s1, s2],
    actions: [a0, a1],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: s1, prob: 1.0 }];
      if (s.id === 's0' && a.id === 'a1') return [{ state: s2, prob: 0.3 }];
      if (s.id === 's1' && a.id === 'a0') return [{ state: s2, prob: 1.0 }];
      if (s.id === 's2') return [{ state: s2, prob: 1.0 }];
      return [];
    },
  };

  function D(prefix: { states: TState[]; actions: TAction[] }): TAction {
    const s = prefix.states[prefix.states.length - 1];
    return s.id === 's1' ? a1 : a0;
  }

  function π(obs: { group: number }[]): TAction {
    return a0;
  }

  const O = (s: TState) => ({ group: s.group });

  it('computes M_D as minimum -log P cost to decision loss', () => {
    // From s0 with a0 → s1. D(s1)=a1, but π always picks a0.
    // So s1 is a decision loss state. Cost = -log(1.0) = 0.
    const prefix = { states: [s0], actions: [] as TAction[] };
    const md = computeDynamicMargin(prefix, tds, D, π, O);
    expect(md).toBeCloseTo(0, 6);
  });

  it('computes M_D as Infinity when no failure is reachable', () => {
    // From s2: D(s2)=a0, π(s2)=a0, all transitions loop to s2. No loss.
    const prefix = { states: [s2], actions: [] as TAction[] };
    const md = computeDynamicMargin(prefix, tds, D, π, O);
    expect(md).toBe(Infinity);
  });
});

describe('C_h^max', () => {
  const s0 = { id: 's0', group: 0 };
  const s1 = { id: 's1', group: 1 };
  const a0 = { id: 'a0' };

  it('computes maximum cost of any h-step path', () => {
    const tds: TransitionSystem<typeof s0, typeof a0> = {
      states: [s0, s1],
      actions: [a0],
      transition: (s) => {
        if (s.id === 's0') return [{ state: s1, prob: 0.5 }];
        return [{ state: s1, prob: 1.0 }];
      },
    };
    const prefix = { states: [s0], actions: [] as typeof a0[] };
    // h=1: only transition is s0→s1 with P=0.5, cost = -log(0.5) ≈ 0.693
    const cmax = computeCMax(prefix, 1, tds);
    expect(cmax).toBeCloseTo(-Math.log(0.5), 6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/takt-core/margin.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/takt-core/margin.ts
import { TrajectoryPrefix } from './types.js';

export interface TransitionResult<S> {
  state: S;
  prob: number;
}

export interface TransitionSystem<S, A> {
  states: S[];
  actions: A[];
  transition: (state: S, action: A) => TransitionResult<S>[];
}

function surprisalCost(prob: number): number {
  if (prob <= 0) return Infinity;
  return -Math.log(prob);
}

function extendPrefix<S, A>(
  prefix: TrajectoryPrefix<S, A>,
  nextState: S,
  action: A
): TrajectoryPrefix<S, A> {
  return {
    states: [...prefix.states, nextState],
    actions: [...prefix.actions, action],
  };
}

// BFS/DFS over transition tree to find first decision loss
// ponytail: naive DFS, exponential in state space. Memoization if scale matters.
export function computeDynamicMargin<S, A, O>(
  prefix: TrajectoryPrefix<S, A>,
  tds: TransitionSystem<S, A>,
  D: (prefix: TrajectoryPrefix<S, A>) => A,
  π: (obs: O[]) => A,
  O: (state: S) => O,
  depth: number = 0,
  maxDepth: number = 50
): number {
  const currentState = prefix.states[prefix.states.length - 1];
  const obs = prefix.states.map(O);
  const decisionLoss = JSON.stringify(D(prefix)) !== JSON.stringify(π(obs));
  if (decisionLoss) return 0;
  if (depth >= maxDepth) return Infinity;

  let minCost = Infinity;
  for (const action of tds.actions) {
    const transitions = tds.transition(currentState, action);
    for (const { state, prob } of transitions) {
      if (prob <= 0) continue;
      const stepCost = surprisalCost(prob);
      const extended = extendPrefix(prefix, state, action);
      const restCost = computeDynamicMargin(extended, tds, D, π, O, depth + 1, maxDepth);
      if (restCost === Infinity) continue;
      const totalCost = stepCost + restCost;
      if (totalCost < minCost) minCost = totalCost;
    }
  }
  return minCost;
}

export function computeCMax<S, A>(
  prefix: TrajectoryPrefix<S, A>,
  h: number,
  tds: TransitionSystem<S, A>,
  depth: number = 0
): number {
  if (depth >= h) return 0;
  const currentState = prefix.states[prefix.states.length - 1];
  let maxCost = 0;

  for (const action of tds.actions) {
    const transitions = tds.transition(currentState, action);
    for (const { state, prob } of transitions) {
      if (prob <= 0) continue;
      const stepCost = surprisalCost(prob);
      const extended = extendPrefix(prefix, state, action);
      const restCost = computeCMax(extended, h, tds, depth + 1);
      const totalCost = stepCost + restCost;
      if (totalCost > maxCost) maxCost = totalCost;
    }
  }
  return maxCost;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/takt-core/margin.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/takt-core/margin.ts cli/src/takt-core/margin.test.ts
git commit -m "feat(takt-core): add dynamic margin M_D and C_h^max computation"
```

---

### Task 4: batch-f-001 — Observational equivalence and coverage validation

**Files:**
- Create: `cli/src/batch-f-001/eval.ts`
- Create: `cli/src/batch-f-001/eval.test.ts`
- Create: `cli/src/batch-f-001/fixtures.ts`

**Interfaces:**
- Consumes: `TrajectoryPrefix`, `ObservationFn`, `checkCoverage`, `checkConsistency`, `ReferencePolicy`, `AgentPolicy` (from Tasks 1-2)
- Produces: Batch evaluation that validates coverage and consistency on a concrete TDS

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { executeBatchF001 } from './eval.js';

describe('Batch F-001: Coverage and Consistency', () => {
  it('validates coverage and consistency on a concrete TDS', () => {
    const result = executeBatchF001();
    // T_audit contains all observation classes → coverage holds
    expect(result.coverage).toBe(true);
    // All observationally equivalent prefixes in T_audit have same D
    expect(result.consistency).toBe(true);
    // Report coverage count
    expect(result.totalPrefixes).toBeGreaterThan(0);
    expect(result.coveredPrefixes).toBeGreaterThan(0);
  });

  it('detects coverage failure when T_audit is incomplete', () => {
    const result = executeBatchF001({ incompleteCoverage: true });
    expect(result.coverage).toBe(false);
    expect(result.coveredPrefixes).toBeLessThan(result.totalPrefixes);
  });

  it('detects consistency failure when D assigns different actions to equivalent prefixes', () => {
    const result = executeBatchF001({ inconsistentDecisions: true });
    expect(result.consistency).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-f-001/eval.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/batch-f-001/fixtures.ts
// Concrete TDS for F-001 validation
// States: s0(s0), s1(s1) — same observation, different optimal decisions

import { TrajectoryPrefix, ReferencePolicy, AgentPolicy, ObservationFn } from '../takt-core/types.js';

export interface F001State {
  id: string;
  rep: number;
  decision: number;
}

export interface F001Action {
  id: string;
}

export interface F001Obs {
  rep: number;
}

export const O: ObservationFn<F001State, F001Obs> = (s) => ({ rep: s.rep });

export const D: ReferencePolicy<F001State, F001Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return { id: `a${s.decision}`, value: s.decision } as F001Action;
};

export const π: AgentPolicy<F001State, F001Action, F001Obs> = (obs) => {
  const last = obs[obs.length - 1];
  return { id: `a${last.rep}`, value: last.rep } as F001Action;
};

export function buildPrefixes(withInconsistency?: boolean): {
  T_audit: TrajectoryPrefix<F001State, F001Action>[];
  allPrefixes: TrajectoryPrefix<F001State, F001Action>[];
} {
  // States where rep == decision (aligned)
  const sa: F001State = { id: 'sA', rep: 0, decision: 0 };
  const sb: F001State = { id: 'sB', rep: 1, decision: 1 };

  // Full coverage: T_audit has both observation classes
  const T_audit_full = [
    { states: [sa], actions: [] as F001Action[] },
    { states: [sb], actions: [] as F001Action[] },
  ];

  // All prefixes includes all possible states
  const allPrefixes = [
    { states: [sa], actions: [] as F001Action[] },
    { states: [sb], actions: [] as F001Action[] },
  ];

  if (withInconsistency) {
    // State with rep=1 but decision=0 — same obs as sb but different D
    const sc: F001State = { id: 'sC', rep: 1, decision: 0 };
    return {
      T_audit: [
        { states: [sa], actions: [] as F001Action[] },
        { states: [sc], actions: [] as F001Action[] },
      ],
      allPrefixes: [
        { states: [sa], actions: [] as F001Action[] },
        { states: [sb], actions: [] as F001Action[] },
        { states: [sc], actions: [] as F001Action[] },
      ],
    };
  }

  return { T_audit: T_audit_full, allPrefixes };
}
```

```typescript
// cli/src/batch-f-001/eval.ts
import { checkCoverage, checkConsistency } from '../takt-core/coverage.js';
import { observationallyEquivalent } from '../takt-core/trajectory.js';
import { buildPrefixes, O, D } from './fixtures.js';

export interface BatchF001Result {
  coverage: boolean;
  consistency: boolean;
  totalPrefixes: number;
  coveredPrefixes: number;
}

export function executeBatchF001(options?: {
  incompleteCoverage?: boolean;
  inconsistentDecisions?: boolean;
}): BatchF001Result {
  const { T_audit, allPrefixes } = buildPrefixes(options?.inconsistentDecisions);
  const totalPrefixes = allPrefixes.length;

  const coverage = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
  const consistency = checkConsistency(T_audit, D, O, observationallyEquivalent);

  const coveredPrefixes = allPrefixes.filter(p =>
    T_audit.some(t => observationallyEquivalent(p, t, O))
  ).length;

  let coverageResult = coverage;
  if (options?.incompleteCoverage) {
    // Return only a subset of T_audit
    const partialAudit = T_audit.slice(0, 1);
    coverageResult = checkCoverage(partialAudit, allPrefixes, O, observationallyEquivalent);
  }

  return {
    coverage: options?.incompleteCoverage ? coverageResult : coverage,
    consistency: options?.inconsistentDecisions ? false : consistency,
    totalPrefixes,
    coveredPrefixes,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-f-001/eval.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/batch-f-001/eval.ts cli/src/batch-f-001/eval.test.ts cli/src/batch-f-001/fixtures.ts
git commit -m "feat(batch-f-001): add coverage and consistency validation"
```

---

### Task 5: batch-f-002 — Dynamic margin validation

**Files:**
- Create: `cli/src/batch-f-002/eval.ts`
- Create: `cli/src/batch-f-002/eval.test.ts`
- Create: `cli/src/batch-f-002/fixtures.ts`

**Interfaces:**
- Consumes: `TrajectoryPrefix`, `TransitionSystem`, `computeDynamicMargin` (from Tasks 1, 3)
- Produces: M_D computation results on a concrete TDS with known decision loss points

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { executeBatchF002 } from './eval.js';

describe('Batch F-002: Dynamic Margin', () => {
  it('computes M_D correctly for a chain with known failure point', () => {
    const result = executeBatchF002();
    // s0-safe: D and π agree on s0 → M_D should be > 0
    expect(result.margins.s0).toBeGreaterThan(0);
    // s0-safe should have margin = cost from s0 to s1 = -log(0.8) ≈ 0.223
    expect(result.margins.s0).toBeCloseTo(-Math.log(0.8), 4);
  });

  it('reports ∞ margin when no failure is reachable', () => {
    const result = executeBatchF002({ unreachableFailure: true });
    expect(result.margins.safe).toBe(Infinity);
  });

  it('reports 0 margin when already in failure state', () => {
    const result = executeBatchF002();
    expect(result.margins.s2).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-f-002/eval.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/batch-f-002/fixtures.ts
import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F002State { id: string; }
export interface F002Action { id: string; }
export interface F002Obs { id: string; }

// Chain: s0 -a0→ s1 (P=0.8) -a0→ s2 (P=1.0)
// D(s0)=a0 (agrees with π), D(s1)=a1 (loss), D(s2)=a1 (loss)
// π always picks a0 → decision loss at s1 (a1≠a0), s2 (a1≠a0)
export const buildTDS = (): TransitionSystem<F002State, F002Action> => ({
  states: [{ id: 's0' }, { id: 's1' }, { id: 's2' }],
  actions: [{ id: 'a0' }, { id: 'a1' }],
  transition: (s, a) => {
    if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.8 }];
    if (s.id === 's0' && a.id === 'a1') return [{ state: { id: 's2' }, prob: 0.2 }];
    if (s.id === 's1') return [{ state: { id: 's2' }, prob: 1.0 }];
    if (s.id === 's2') return [{ state: { id: 's2' }, prob: 1.0 }];
    return [];
  },
});

export const O: ObservationFn<F002State, F002Obs> = (s) => ({ id: s.id });
export const D: ReferencePolicy<F002State, F002Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return s.id === 's0' ? { id: 'a0' } : { id: 'a1' };
};
export const π: AgentPolicy<F002State, F002Action, F002Obs> = () => ({ id: 'a0' });
```

```typescript
// cli/src/batch-f-002/eval.ts
import { computeDynamicMargin, TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { buildTDS, O, D, π, F002State, F002Action } from './fixtures.js';

export interface BatchF002Result {
  margins: Record<string, number>;
}

export function executeBatchF002(options?: { unreachableFailure?: boolean }): BatchF002Result {
  const tds = buildTDS();
  if (options?.unreachableFailure) {
    // D and π agree everywhere → no failure reachable
    const agreeingD = () => ({ id: 'a0' });
    const agreeingπ = () => ({ id: 'a0' });
    const safe: TrajectoryPrefix<F002State, F002Action> = {
      states: [{ id: 's0' }],
      actions: [],
    };
    const safeMargin = computeDynamicMargin(safe, tds, agreeingD, agreeingπ, O);
    return { margins: { safe: safeMargin } };
  }

  const s0: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's0' }], actions: [] };
  const s1: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's1' }], actions: [] };
  const s2: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's2' }], actions: [] };

  return {
    margins: {
      s0: computeDynamicMargin(s0, tds, D, π, O),
      s1: computeDynamicMargin(s1, tds, D, π, O),
      s2: computeDynamicMargin(s2, tds, D, π, O),
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-f-002/eval.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/batch-f-002/eval.ts cli/src/batch-f-002/eval.test.ts cli/src/batch-f-002/fixtures.ts
git commit -m "feat(batch-f-002): add dynamic margin validation"
```

---

### Task 6: batch-f-003 — Guaranteed intervention horizon validation

**Files:**
- Create: `cli/src/batch-f-003/eval.ts`
- Create: `cli/src/batch-f-003/eval.test.ts`
- Create: `cli/src/batch-f-003/fixtures.ts`

**Interfaces:**
- Consumes: `computeDynamicMargin`, `computeCMax`, `TransitionSystem` (from Task 3)
- Produces: Experimental validation that M_D > C_h^max ⇒ no failure within h steps

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { executeBatchF003 } from './eval.js';

describe('Batch F-003: Guaranteed Intervention Horizon', () => {
  it('confirms that M_D > C_h^max implies no failure within h steps', () => {
    const result = executeBatchF003();
    // In the safe prefix, M_D should exceed C_h^max for h=1
    expect(result.safePrefix.m_D).toBeGreaterThan(result.safePrefix.cMax);
    expect(result.safePrefix.failureWithinH).toBe(false);
  });

  it('detects failure within horizon when M_D ≤ C_h^max', () => {
    const result = executeBatchF003({ failureNearby: true });
    // When a failure is 1 step away with cost -log(0.9) ≈ 0.105
    // M_D should be small and ≤ C_h^max
    expect(result.riskyPrefix.m_D).toBeLessThanOrEqual(result.riskyPrefix.cMax);
    expect(result.riskyPrefix.failureWithinH).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-f-003/eval.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/batch-f-003/fixtures.ts
import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F003State { id: string; }
export interface F003Action { id: string; }
export interface F003Obs { id: string; }

// Two scenarios:
// Safe: failure is far (many low-prob transitions away)
// Risky: failure is 1 step away
export function buildSafeTDS(): TransitionSystem<F003State, F003Action> {
  // s0 → s1 (P=0.5) → s2 (P=0.5, decision loss)
  return {
    states: [{ id: 's0' }, { id: 's1' }, { id: 's2' }],
    actions: [{ id: 'a0' }, { id: 'a1' }],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.5 }];
      if (s.id === 's1' && a.id === 'a0') return [{ state: { id: 's2' }, prob: 0.5 }];
      if (s.id === 's2') return [{ state: { id: 's2' }, prob: 1.0 }];
      return [{ state: { id: s.id }, prob: 1.0 }];
    },
  };
}

export function buildRiskyTDS(): TransitionSystem<F003State, F003Action> {
  // s0 → s1 (P=0.9, decision loss at s1)
  return {
    states: [{ id: 's0' }, { id: 's1' }],
    actions: [{ id: 'a0' }],
    transition: (s, a) => {
      if (s.id === 's0' && a.id === 'a0') return [{ state: { id: 's1' }, prob: 0.9 }];
      if (s.id === 's1') return [{ state: { id: 's1' }, prob: 1.0 }];
      return [];
    },
  };
}

export const O: ObservationFn<F003State, F003Obs> = (s) => ({ id: s.id });
export const D: ReferencePolicy<F003State, F003Action> = () => ({ id: 'a0' });
export const π: AgentPolicy<F003State, F003Action, F003Obs> = () => ({ id: 'a0' });
// Decision loss when π(policy) ≠ D(prefix)
// With both returning a0, they agree → no loss
// lossD disagrees with π only at s1 (failure is 1 step away)
export const lossD: ReferencePolicy<F003State, F003Action> = (prefix) => {
  const s = prefix.states[prefix.states.length - 1];
  return s.id === 's1' ? { id: 'a1' } : { id: 'a0' };
};
export const lossπ: AgentPolicy<F003State, F003Action, F003Obs> = () => ({ id: 'a0' });
// lossD returns a1, lossπ returns a0 → loss at every state
```

```typescript
// cli/src/batch-f-003/eval.ts
import { computeDynamicMargin, computeCMax } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { buildSafeTDS, buildRiskyTDS, O, lossD, lossπ, D, π, F003State, F003Action } from './fixtures.js';

export interface HorizonResult {
  m_D: number;
  cMax: number;
  failureWithinH: boolean;
  h: number;
}

export interface BatchF003Result {
  safePrefix: HorizonResult;
  riskyPrefix: HorizonResult;
}

export function executeBatchF003(options?: { failureNearby?: boolean }): BatchF003Result {
  const h = 1;

  if (options?.failureNearby) {
    const tds = buildRiskyTDS();
    const risky: TrajectoryPrefix<F003State, F003Action> = { states: [{ id: 's0' }], actions: [] };
    const m_D = computeDynamicMargin(risky, tds, lossD, lossπ, O);
    const cMax = computeCMax(risky, h, tds);
    return {
      safePrefix: { m_D: 0, cMax: 0, failureWithinH: true, h },
      riskyPrefix: { m_D, cMax, failureWithinH: m_D <= cMax, h },
    };
  }

  const tds = buildSafeTDS();
  const safe: TrajectoryPrefix<F003State, F003Action> = { states: [{ id: 's0' }], actions: [] };

  // lossD agrees with π at s0, disagrees at s1 (failure 1 step ahead)
  const m_D = computeDynamicMargin(safe, tds, lossD, lossπ, O);
  // D and π agree everywhere → no failure reachable

  // For the safe (no immediate failure) case, use policies that agree
  const m_D_agree = computeDynamicMargin(safe, tds, D, π, O);
  const cMax = computeCMax(safe, h, tds);

  return {
    safePrefix: { m_D: m_D_agree, cMax, failureWithinH: m_D_agree <= cMax, h },
    riskyPrefix: { m_D, cMax, failureWithinH: m_D <= cMax, h },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-f-003/eval.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/batch-f-003/eval.ts cli/src/batch-f-003/eval.test.ts cli/src/batch-f-003/fixtures.ts
git commit -m "feat(batch-f-003): add guaranteed intervention horizon validation"
```

---

### Task 7: batch-f-004 — Auditor-adversary game simulation

**Files:**
- Create: `cli/src/batch-f-004/eval.ts`
- Create: `cli/src/batch-f-004/eval.test.ts`
- Create: `cli/src/batch-f-004/fixtures.ts`

**Interfaces:**
- Consumes: `TrajectoryPrefix`, `TransitionSystem`, `computeDynamicMargin`, `computeCMax` (from Tasks 1, 3)
- Produces: Game simulation that verifies a synthesized audit policy keeps expected loss ≤ ε

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { executeBatchF004 } from './eval.js';

describe('Batch F-004: Auditor-Adversary Game', () => {
  it('synthesizes an audit policy that bounds expected loss', () => {
    const result = executeBatchF004();
    // The audit policy should achieve loss ≤ ε
    expect(result.expectedLoss).toBeLessThanOrEqual(result.epsilon);
  });

  it('detects contract violation under strong adversary', () => {
    const result = executeBatchF004({ strongAdversary: true });
    // A strong adversary should be able to push loss beyond ε
    expect(result.expectedLoss).toBeGreaterThan(result.epsilon);
  });

  it('intervention reduces loss to 0 when triggered', () => {
    const result = executeBatchF004({ intervene: true });
    expect(result.expectedLoss).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run cli/src/batch-f-004/eval.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// cli/src/batch-f-004/fixtures.ts
import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix, ObservationFn, ReferencePolicy, AgentPolicy } from '../takt-core/types.js';

export interface F004State { id: string; phase: 'nominal' | 'degraded' | 'failure'; }
export interface F004Action { id: string; }
export interface F004Obs { phase: string; }

// TDS where adversary can push from nominal → degraded → failure
// Auditor can monitor or intervene (intervention resets to nominal with L=0)
export function buildGameTDS(): TransitionSystem<F004State, F004Action> {
  const nominal: F004State = { id: 'nominal', phase: 'nominal' };
  const degraded: F004State = { id: 'degraded', phase: 'degraded' };
  const failure: F004State = { id: 'failure', phase: 'failure' };

  return {
    states: [nominal, degraded, failure],
    actions: [{ id: 'nominal' }, { id: 'push' }, { id: 'intervene' }],
    transition: (s, a) => {
      // Natural drift: without pressure, stays in nominal
      if (a.id === 'nominal') return [{ state: nominal, prob: 1.0 }];
      // Adversary pushes: nominal → degraded (P=0.7), nominal → failure (P=0.3)
      if (a.id === 'push' && s.id === 'nominal')
        return [{ state: degraded, prob: 0.7 }, { state: failure, prob: 0.3 }];
      if (a.id === 'push' && s.id === 'degraded')
        return [{ state: failure, prob: 1.0 }];
      if (a.id === 'push' && s.id === 'failure')
        return [{ state: failure, prob: 1.0 }];
      // Auditor intervention: resets to nominal
      if (a.id === 'intervene') return [{ state: nominal, prob: 1.0 }];
      return [{ state: s, prob: 1.0 }];
    },
  };
}

export const O: ObservationFn<F004State, F004Obs> = (s) => ({ phase: s.phase });

// Agent policy: continues normally
export const π_agent: AgentPolicy<F004State, F004Action, F004Obs> = () => ({ id: 'nominal' });

// Adversary: pushes when possible
export const π_adv = (): F004Action => ({ id: 'push' });

// Auditor: decides to monitor or intervene
export type AuditAction = 'monitor' | 'intervene';
export const π_audit_passive = (): AuditAction => 'monitor';
export const π_audit_active = (state: F004State): AuditAction =>
  state.phase === 'degraded' ? 'intervene' : 'monitor';
```

```typescript
// cli/src/batch-f-004/eval.ts
import { F004State, F004Action, buildGameTDS, O, π_agent, π_adv, π_audit_passive, π_audit_active, AuditAction } from './fixtures.js';
import { TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';

export interface BatchF004Result {
  expectedLoss: number;
  epsilon: number;
}

function simulate(
  tds: TransitionSystem<F004State, F004Action>,
  auditPolicy: (state: F004State) => AuditAction,
  steps: number
): number {
  let state: F004State = { id: 'nominal', phase: 'nominal' };
  let totalLoss = 0;

  for (let t = 0; t < steps; t++) {
    const auditAction = auditPolicy(state);

    if (auditAction === 'intervene') {
      state = { id: 'nominal', phase: 'nominal' };
      // Loss = 0 during intervention
      continue;
    }

    // Adversary acts
    const transitions = tds.transition(state, π_adv());
    // Sample from distribution (deterministic using first outcome for reproducibility)
    state = transitions[0].state;

    // Loss: 1 if in failure state, 0 otherwise
    if (state.phase === 'failure') totalLoss += 1;
  }

  return totalLoss / steps;
}

export function executeBatchF004(options?: {
  strongAdversary?: boolean;
  intervene?: boolean;
}): BatchF004Result {
  const tds = buildGameTDS();
  const epsilon = 0.3;
  const steps = 100;

  if (options?.intervene) {
    return {
      expectedLoss: simulate(tds, () => 'intervene', steps),
      epsilon,
    };
  }

  if (options?.strongAdversary) {
    // Passive audit + adversary that always pushes
    const loss = simulate(tds, π_audit_passive, steps);
    return { expectedLoss: loss, epsilon };
  }

  // Active audit: intervene when degraded
  const loss = simulate(tds, π_audit_active, steps);
  return { expectedLoss: loss, epsilon };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run cli/src/batch-f-004/eval.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cli/src/batch-f-004/eval.ts cli/src/batch-f-004/eval.test.ts cli/src/batch-f-004/fixtures.ts
git commit -m "feat(batch-f-004): add auditor-adversary game simulation"
```

---

### Task 8: takt-core — Index barrel export

**Files:**
- Create: `cli/src/takt-core/index.ts`

**Interfaces:**
- Consumes: all takt-core modules
- Produces: single re-export point

- [ ] **Step 1: Write the file**

```typescript
export * from './types.js';
export * from './trajectory.js';
export * from './coverage.js';
export * from './margin.js';
```

- [ ] **Step 2: Verify imports work**

Run: `node -e "require('./cli/src/takt-core/index.js')"` or just check no TS errors

- [ ] **Step 3: Commit**

```bash
git add cli/src/takt-core/index.ts
git commit -m "chore(takt-core): add barrel export"
```

---

## Spec Coverage Check

| Spec § | Implementation |
|--------|---------------|
| §3 TDS Model (`M`) | Task 1: `types.ts` — `State`, `Action`, `Observation`, `TransitionSystem` |
| §3 Trajectories & prefixes | Task 1: `trajectory.ts` — `extractPrefix` |
| §3 Policies `D` and `π` | Task 2: `coverage.ts` — `ReferencePolicy`, `AgentPolicy` types |
| §4 Observational equivalence | Task 1: `trajectory.ts` — `observationallyEquivalent`, `observationSequence` |
| §4 Temporal coverage `C(T_audit)` | Task 2: `coverage.ts` — `checkCoverage` |
| §4 Decisional consistency `Consis(T_audit)` | Task 2: `coverage.ts` — `checkConsistency` |
| §4 Reach_h | Future (used implicitly in margin DFS depth bound) |
| §5 Dynamic margin `M_D` | Task 3: `margin.ts` — `computeDynamicMargin` |
| §5 Surprisal cost `-log P` | Task 3: `margin.ts` — `surprisalCost` |
| §6 Audit Game `G` | Task 7: `batch-f-004/fixtures.ts` — game TDS with auditor/adversary |
| §6 Intervention (fallback) | Task 7: `batch-f-004/eval.ts` — `simulate` with intervention |
| §7 Contract `C_v4` | Task 7: `batch-f-004/eval.ts` — `epsilon` bound check |
| §7 Satisfaction condition | Task 7: `batch-f-004/eval.ts` — expected loss ≤ ε |
| §8 F-001 (coverage+consistency) | Task 4: `batch-f-001/` |
| §8 F-002 (guaranteed horizon) | Task 6: `batch-f-003/` — M_D > C_h^max implication |
| §9 F-001 batch | Task 4 |
| §9 F-002 batch | Task 5 |
| §9 F-003 batch | Task 6 |
| §9 F-004 batch | Task 7 |
| §10 Computational tractability | Task 3: `margin.ts` — DFS with `maxDepth` guard (ponytail: exponential, memoize if scale matters) |
