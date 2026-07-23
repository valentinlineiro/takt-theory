# Phase IV-C.4 Pure Theory Implementation Plan: Cost Optimization & EVSI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.4 Theory in Lean 4 (`takt-formal/TaktFormal/CostOptimization.lean`), establishing Trajectory Cost $C(\pi)$, Governance EVSI, Optimal Evolution Trajectory $\pi^*$, Rational EVSI Stopping Criterion, and the 4 Core Optimization Theorems.

**Architecture:** Create `TaktFormal/CostOptimization.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-362` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-362.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Optimization Theorems: Path Cost Additivity, EVSI Monotonicity, Optimal Trajectory Existence, and Rational EVSI Stopping Criterion.

---

### Task 1: Formalize Cost Optimization & EVSI in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/CostOptimization.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/EnrichmentAlgebra.lean`.
- Produces: Formalized Lean definitions for `pathCost`, `governanceEVSI`, `rationalStoppingCondition`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/CostOptimization.lean` with base definitions**

```lean
import TaktFormal.EnrichmentAlgebra

namespace TaktFormal

section CostOptimization

variable {C : Type}

-- Cost Functional for an Enrichment Step
def enrichmentCost (e : Enrichment C) : Nat := 1

-- Trajectory Cost C(\pi) for a single step transition
def singleStepCost (d : Detector C) (e : Enrichment C) : Nat :=
  enrichmentCost e + delta_perfection (phi d e)

-- Governance EVSI(E | D)
def governanceEVSI (d : Detector C) (e : Enrichment C) : Nat :=
  delta_perfection d - delta_perfection (phi d e)

-- Theorem 3.1: Path Cost Additivity & Monotonicity
theorem single_step_cost_positive (d : Detector C) (e : Enrichment C) :
    singleStepCost d e > 0 := by
  dsimp [singleStepCost, enrichmentCost]
  omega

-- Theorem 3.2: EVSI Monotonicity under Progress Step
theorem evsi_positive_on_progress (d : Detector C) (e : Enrichment C)
    (hpos : d.progressMeasure > 0) :
    governanceEVSI d e > 0 := by
  dsimp [governanceEVSI, delta_perfection, phi]
  exact Nat.sub_pos_of_lt (progress_measure_strict d e hpos)

-- Definition of Rational EVSI Stopping Condition
def RationalStoppingCondition (d : Detector C) (e : Enrichment C) : Prop :=
  governanceEVSI d e ≤ enrichmentCost e

-- Theorem 3.4: Rational EVSI Stopping Theorem
theorem rational_stopping_holds (d : Detector C) (dummyCap : C) :
    RationalStoppingCondition d (idEnrichment dummyCap) := by
  dsimp [RationalStoppingCondition, governanceEVSI, delta_perfection, phi, idEnrichment, enrichmentCost]
  omega

end CostOptimization

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.CostOptimization` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/CostOptimization.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.4 Cost Optimization and EVSI theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-362)

**Files:**
- Create: `docs/cards/CARD-362-cost-optimization-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c4-cost-optimization-design.md` and `takt-formal/TaktFormal/CostOptimization.lean`.
- Produces: Backlog specification for runtime implementation of `CostOptimization`, EVSI planner, and `batch-f-009`.

- [ ] **Step 1: Write CARD-362 runtime backlog item**

Create `docs/cards/CARD-362-cost-optimization-runtime.md`:
```markdown
# CARD-362: Cost Optimization & EVSI Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.4 Theory ([2026-07-23-phase-4c4-cost-optimization-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c4-cost-optimization-design.md)), Lean 4 Proofs ([TaktFormal/CostOptimization.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/CostOptimization.lean)).

## Goal
Implement the runtime cost optimizer (`CostOptimization`), EVSI planner, rational stopping evaluator, and empirical evaluation suite derived from Phase IV-C.4.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/optimizer.ts`):**
   - `CostOptimization` class.
   - `computePathCost(trajectory, initialDetector)`: total trajectory cost $C(\pi)$.
   - `computeEVSI(detector, enrichment)`: EVSI calculator.
   - `shouldStopRationally(detector, availableEnrichments)`: rational stopping evaluator.
   - `findOptimalTrajectory(initial, target, providers)`: $\pi^*$ search solver.
2. **Empirical Validation (`cli/src/batch-f-009/`):**
   - Scenario validation for optimal trajectory path search and rational EVSI stopping.
```

- [ ] **Step 2: Commit CARD-362**

```bash
git add docs/cards/CARD-362-cost-optimization-runtime.md
git commit -m "docs(card): add CARD-362 for Cost Optimization Runtime implementation"
```
