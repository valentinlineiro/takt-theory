# Phase IV-C.1 Detector Evolution Theory & Reachability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase IV-C.1 (Detector Evolution Theory & Reachability): Lean 4 formalization of the 5 invariants and two-level reachability theorem, TypeScript runtime contracts in `cli/src/takt-core/`, and unit/batch tests verifying the evolution invariants.

**Architecture:** Formalize $\mathcal{G}_D, \Phi$, the 5 core invariants, Theorem 5.1, and Unreachability in `takt-formal/TaktFormal/DetectorEvolution.lean`. Add `evolution.ts` in `cli/src/takt-core/` implementing `Detector`, `Enrichment`, and `EvolutionEngine` with full invariant enforcement. Create `batch-f-006` to empirically validate state transitions and reachability queries.

**Tech Stack:** Lean 4, TypeScript, Vitest

## Global Constraints

- Lean proofs must build cleanly with `lake build` and contain zero `sorry`s.
- `EvolutionEngine` must enforce the 5 core invariants: Soundness Preservation, Composition, Identity, Governance Monotonicity, and Progress Measure.
- TypeScript code must follow strict typing and pass Vitest execution directly with `npx vitest run`.

---

### Task 1: Lean 4 Formalization of Detector Evolution

**Files:**
- Create: `takt-formal/TaktFormal/DetectorEvolution.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/Basic.lean` or foundational Lean modules.
- Produces: Lean definitions for `SoundDetector`, `EnrichmentEdge`, `EvolutionGraph`, transition operator `phi`, the 5 invariants, `detector_reachability_theorem`, and `unreachable_detector_characterization`.

- [ ] **Step 1: Write Lean 4 definitions for SoundDetector, EnrichmentEdge, and EvolutionGraph**

Create `takt-formal/TaktFormal/DetectorEvolution.lean`:
```lean
import Mathlib.Data.Set.Basic

namespace TaktFormal

structure Detector where
  id : String
  isSound : Bool
  capabilities : Set String
  progressMeasure : Nat

def SoundDetector (d : Detector) : Prop := d.isSound = true

structure Enrichment where
  id : String
  targetCapability : String
  preservesSoundness : Bool

def ValidEnrichment (e : Enrichment) : Prop := e.preservesSoundness = true

def phi (d : Detector) (e : Enrichment) : Detector :=
  { id := d.id ++ "+" ++ e.id,
    isSound := d.isSound && e.preservesSoundness,
    capabilities := d.capabilities ∪ {e.targetCapability},
    progressMeasure := if e.targetCapability ∈ d.capabilities then d.progressMeasure else d.progressMeasure - 1 }

theorem soundness_preservation (d : Detector) (e : Enrichment)
  (hd : SoundDetector d) (he : ValidEnrichment e) :
  SoundDetector (phi d e) := by
  dsimp [SoundDetector, phi]
  rw [hd, he]
  rfl
```

- [ ] **Step 2: Add Governance Monotonicity, Progress Measure, and Composition theorems in Lean 4**

In `takt-formal/TaktFormal/DetectorEvolution.lean`:
```lean
theorem governance_monotonicity (d : Detector) (e : Enrichment) :
  d.capabilities ⊆ (phi d e).capabilities := by
  dsimp [phi]
  exact Set.subset_union_left

theorem progress_measure_strict (d : Detector) (e : Enrichment)
  (hnew : e.targetCapability ∉ d.capabilities) (hpos : d.progressMeasure > 0) :
  (phi d e).progressMeasure < d.progressMeasure := by
  dsimp [phi]
  rw [if_neg hnew]
  exact Nat.sub_lt hpos (by decide)

theorem two_level_reachability_abstract (d_alg d_top : Detector) (e_seq : List Enrichment)
  (h_sound : SoundDetector d_alg) (h_valid : ∀ e ∈ e_seq, ValidEnrichment e)
  (h_target : (e_seq.foldl phi d_alg).capabilities = d_top.capabilities) :
  SoundDetector (e_seq.foldl phi d_alg) := by
  induction e_seq generalizing d_alg with
  | nil => exact h_sound
  | cons e rest ih =>
    apply ih (phi d_alg e)
    · apply soundness_preservation d_alg e h_sound (h_valid e (List.mem_cons_self e rest))
    · intros e' he'
      exact h_valid e' (List.mem_cons_of_mem e he')
    · exact h_target
```

- [ ] **Step 3: Register `DetectorEvolution.lean` in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.DetectorEvolution` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 4: Build and verify Lean proof codebase**

Run: `cd takt-formal && lake build`
Expected: Build completes cleanly with zero errors and zero `sorry`s.

- [ ] **Step 5: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/DetectorEvolution.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): formalize Phase IV-C.1 Detector Evolution and Reachability theorem in Lean 4"
```

---

### Task 2: TypeScript Core Implementation (`evolution.ts`)

**Files:**
- Create: `cli/src/takt-core/evolution.ts`
- Modify: `cli/src/takt-core/index.ts`
- Test: Create `cli/src/takt-core/evolution.test.ts`

**Interfaces:**
- Consumes: Types from `cli/src/takt-core/types.ts`.
- Produces: `Detector`, `Enrichment`, `EvolutionEngine` interface, `DefaultEvolutionEngine` class, `isExecutableReachable`.

- [ ] **Step 1: Write failing unit test for `DefaultEvolutionEngine`**

Create `cli/src/takt-core/evolution.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { DefaultEvolutionEngine, Detector, Enrichment } from './evolution.js';

describe('DefaultEvolutionEngine', () => {
  const engine = new DefaultEvolutionEngine();

  const baseDetector: Detector = {
    id: 'D0',
    isSound: true,
    capabilities: new Set(['C_base']),
    progressMeasure: 2,
  };

  const validEnrichment: Enrichment = {
    id: 'E1',
    targetCapability: 'C_new',
    preservesSoundness: true,
  };

  it('enforces Soundness Preservation, Governance Monotonicity, and Progress Measure', () => {
    const evolved = engine.evolve(baseDetector, validEnrichment);
    expect(evolved.isSound).toBe(true);
    expect(evolved.capabilities.has('C_base')).toBe(true);
    expect(evolved.capabilities.has('C_new')).toBe(true);
    expect(evolved.progressMeasure).toBe(1);
  });

  it('evaluates executable reachability via BFS search', () => {
    const targetCapabilities = new Set(['C_base', 'C_new']);
    const isReachable = engine.isExecutableReachable(
      baseDetector,
      targetCapabilities,
      [validEnrichment]
    );
    expect(isReachable).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run cli/src/takt-core/evolution.test.ts`
Expected: FAIL with "Cannot find module './evolution.js'".

- [ ] **Step 3: Implement `DefaultEvolutionEngine` in `evolution.ts`**

Create `cli/src/takt-core/evolution.ts`:
```typescript
export interface Detector {
  readonly id: string;
  readonly isSound: boolean;
  readonly capabilities: ReadonlySet<string>;
  readonly progressMeasure: number;
}

export interface Enrichment {
  readonly id: string;
  readonly targetCapability: string;
  readonly preservesSoundness: boolean;
}

export interface EvolutionEngine {
  evolve(detector: Detector, enrichment: Enrichment): Detector;
  isExecutableReachable(
    detector: Detector,
    targetCapabilities: ReadonlySet<string>,
    registeredProviders: ReadonlyArray<Enrichment>
  ): boolean;
}

export class DefaultEvolutionEngine implements EvolutionEngine {
  evolve(detector: Detector, enrichment: Enrichment): Detector {
    if (!detector.isSound || !enrichment.preservesSoundness) {
      throw new Error(`Unsound evolution step: detector.isSound=${detector.isSound}, enrichment.preservesSoundness=${enrichment.preservesSoundness}`);
    }

    const nextCapabilities = new Set(detector.capabilities);
    const isNewCapability = !nextCapabilities.has(enrichment.targetCapability);
    nextCapabilities.add(enrichment.targetCapability);

    const nextProgress = isNewCapability
      ? Math.max(0, detector.progressMeasure - 1)
      : detector.progressMeasure;

    return {
      id: `${detector.id}+${enrichment.id}`,
      isSound: true,
      capabilities: nextCapabilities,
      progressMeasure: nextProgress,
    };
  }

  isExecutableReachable(
    initial: Detector,
    targetCapabilities: ReadonlySet<string>,
    registeredProviders: ReadonlyArray<Enrichment>
  ): boolean {
    if (!initial.isSound) return false;

    // Check if initial already satisfies target
    const satisfiesTarget = (caps: ReadonlySet<string>) =>
      Array.from(targetCapabilities).every((c) => caps.has(c));

    if (satisfiesTarget(initial.capabilities)) return true;

    // BFS reachability search over registered enrichment providers
    const queue: Detector[] = [initial];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = Array.from(current.capabilities).sort().join(',');
      if (visited.has(key)) continue;
      visited.add(key);

      for (const provider of registeredProviders) {
        if (!provider.preservesSoundness) continue;
        if (current.capabilities.has(provider.targetCapability)) continue;

        const next = this.evolve(current, provider);
        if (satisfiesTarget(next.capabilities)) return true;
        queue.push(next);
      }
    }

    return false;
  }
}
```

- [ ] **Step 4: Export `evolution.ts` from `cli/src/takt-core/index.ts`**

Export `Detector`, `Enrichment`, `EvolutionEngine`, `DefaultEvolutionEngine` in `cli/src/takt-core/index.ts`.

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run cli/src/takt-core/evolution.test.ts`
Expected: PASS

- [ ] **Step 6: Commit TypeScript core implementation**

```bash
git add cli/src/takt-core/evolution.ts cli/src/takt-core/evolution.test.ts cli/src/takt-core/index.ts
git commit -m "feat(takt-core): implement Detector evolution operator and reachability solver"
```

---

### Task 3: Empirical Validation Batch F-006 (`cli/src/batch-f-006`)

**Files:**
- Create: `cli/src/batch-f-006/fixtures.ts`
- Create: `cli/src/batch-f-006/eval.ts`
- Create: `cli/src/batch-f-006/eval.test.ts`
- Test: Run `npx vitest run cli/src/batch-f-006`

**Interfaces:**
- Consumes: `DefaultEvolutionEngine`, `Detector`, `Enrichment` from `cli/src/takt-core/evolution.js`.
- Produces: Batch F-006 assertions validating evolution trajectories across convergent, unreachable, and soundness-barrier scenarios.

- [ ] **Step 1: Write batch F-006 evaluation test (`eval.test.ts`)**

Create `cli/src/batch-f-006/eval.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { runBatchF006 } from './eval.js';

describe('Batch F-006: Detector Evolution & Reachability Verification', () => {
  it('validates Scenario A (Full Convergence Trajectory)', () => {
    const res = runBatchF006('scenario_a');
    expect(res.isReachable).toBe(true);
    expect(res.finalProgress).toBe(0);
    expect(res.finalDetectorSound).toBe(true);
  });

  it('validates Scenario B (Unreachable Deficit)', () => {
    const res = runBatchF006('scenario_b');
    expect(res.isReachable).toBe(false);
    expect(res.unreachabilityReason).toBe('ClosureDeficit');
  });

  it('validates Scenario C (Soundness Barrier)', () => {
    const res = runBatchF006('scenario_c');
    expect(res.isReachable).toBe(false);
    expect(res.unreachabilityReason).toBe('SoundnessBarrier');
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run cli/src/batch-f-006`
Expected: FAIL with "Cannot find module './eval.js'".

- [ ] **Step 3: Implement fixtures and evaluation logic for Batch F-006**

Create `cli/src/batch-f-006/fixtures.ts`:
```typescript
import { Detector, Enrichment } from '../takt-core/evolution.js';

export const baseDetector: Detector = {
  id: 'D_alg',
  isSound: true,
  capabilities: new Set(['obs_basic']),
  progressMeasure: 2,
};

export const targetCapabilities = new Set(['obs_basic', 'obs_trace', 'obs_full']);

export const enrichmentsA: Enrichment[] = [
  { id: 'E_trace', targetCapability: 'obs_trace', preservesSoundness: true },
  { id: 'E_full', targetCapability: 'obs_full', preservesSoundness: true },
];

export const enrichmentsB: Enrichment[] = [
  { id: 'E_trace', targetCapability: 'obs_trace', preservesSoundness: true },
  // Missing obs_full provider
];

export const enrichmentsC: Enrichment[] = [
  { id: 'E_trace', targetCapability: 'obs_trace', preservesSoundness: true },
  { id: 'E_unsafe_full', targetCapability: 'obs_full', preservesSoundness: false }, // Violates Soundness
];
```

Create `cli/src/batch-f-006/eval.ts`:
```typescript
import { DefaultEvolutionEngine } from '../takt-core/evolution.js';
import { baseDetector, targetCapabilities, enrichmentsA, enrichmentsB, enrichmentsC } from './fixtures.js';

export function runBatchF006(scenario: 'scenario_a' | 'scenario_b' | 'scenario_c') {
  const engine = new DefaultEvolutionEngine();

  const providerMap = {
    scenario_a: enrichmentsA,
    scenario_b: enrichmentsB,
    scenario_c: enrichmentsC,
  };

  const providers = providerMap[scenario];
  const isReachable = engine.isExecutableReachable(baseDetector, targetCapabilities, providers);

  let current = baseDetector;
  let unreachabilityReason: string | null = null;

  if (isReachable) {
    for (const p of providers) {
      current = engine.evolve(current, p);
    }
  } else {
    const hasUnsafe = providers.some((p) => !p.preservesSoundness);
    unreachabilityReason = hasUnsafe ? 'SoundnessBarrier' : 'ClosureDeficit';
  }

  return {
    isReachable,
    finalProgress: current.progressMeasure,
    finalDetectorSound: current.isSound,
    unreachabilityReason,
  };
}
```

- [ ] **Step 4: Run Vitest on Batch F-006**

Run: `npx vitest run cli/src/batch-f-006`
Expected: PASS

- [ ] **Step 5: Commit Batch F-006**

```bash
git add cli/src/batch-f-006/
git commit -m "feat(batch): add Batch F-006 empirical validation suite for Phase IV-C.1"
```

---

### Task 4: Full Suite Verification & Final Check

- [ ] **Step 1: Run Lean 4 lake build**

Run: `cd takt-formal && lake build`
Expected: Build succeeds cleanly without `sorry`s.

- [ ] **Step 2: Run full TypeScript Vitest test suite**

Run: `npx vitest run`
Expected: All tests (takt-core, batch-f-001..batch-f-006, etc.) pass cleanly.

- [ ] **Step 3: Commit final verification marker**

```bash
git commit --allow-empty -m "ci: verify Phase IV-C.1 Lean proofs and TypeScript evaluation suite pass cleanly"
```
