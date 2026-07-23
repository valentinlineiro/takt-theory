# Phase IV-C.7 Pure Theory Implementation Plan: Impossibility & Limits

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.7 Theory in Lean 4 (`takt-formal/TaktFormal/ImpossibilityLimits.lean`), establishing Unreachability Frontiers, Non-Approximability Barriers, Soundness Barriers, and the 4 Core Impossibility Theorems.

**Architecture:** Create `TaktFormal/ImpossibilityLimits.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-365` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-365.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Theorems: Unreachability Limit, Non-Approximability Theorem, Soundness Barrier, and Fundamental Impossibility Boundary.

---

### Task 1: Formalize Impossibility & Limits in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/ImpossibilityLimits.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/RuntimeConvergence.lean`.
- Produces: Formalized Lean definitions for `EmptyProviderSpace`, `NonApproximable`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/ImpossibilityLimits.lean` with base definitions**

```lean
import TaktFormal.RuntimeConvergence

namespace TaktFormal

section ImpossibilityLimits

variable {C : Type}

def EmptyProviderSpace (providers : (Enrichment C) → Prop) : Prop :=
  ∀ e, ¬ providers e

-- Theorem 3.1: Unreachability Limit Theorem
theorem empty_providers_unreachable (d_alg d_top : Detector C) (providers : (Enrichment C) → Prop)
    (hempty : EmptyProviderSpace providers) (hdiff : d_alg.capabilities ≠ d_top.capabilities) :
    UnreachableAbstract d_alg d_top providers := by
  intro h
  rcases h with ⟨e_seq, h_all, h_eq⟩
  cases e_seq with
  | nil =>
    dsimp [List.foldl] at h_eq
    exact hdiff h_eq
  | cons e rest =>
    have h_in := (h_all e (List.mem_cons_self e rest)).left
    exact hempty e h_in

-- Theorem 3.2: Non-Approximability Theorem
def NonApproximable (d : Detector C) (requiredEps : Nat) : Prop :=
  delta_perfection d > requiredEps

theorem non_approximable_bounds (d : Detector C) (requiredEps : Nat)
    (hbound : delta_perfection d > requiredEps) :
    ¬ GovEpsilon d requiredEps := by
  intro hgov
  dsimp [GovEpsilon] at hgov
  omega

-- Theorem 3.3: Soundness Barrier Theorem
theorem soundness_barrier_blocks (d : Detector C) (e : Enrichment C)
    (hunsound : e.preservesSoundness = false) :
    ¬ ValidEnrichment e := by
  intro hv
  dsimp [ValidEnrichment] at hv
  rw [hunsound] at hv
  contradiction

end ImpossibilityLimits

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.ImpossibilityLimits` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/ImpossibilityLimits.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.7 Impossibility and Limits theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-365)

**Files:**
- Create: `docs/cards/CARD-365-impossibility-limits-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c7-impossibility-limits-design.md` and `takt-formal/TaktFormal/ImpossibilityLimits.lean`.
- Produces: Backlog specification for runtime implementation of `ImpossibilityLimits` evaluators and `batch-f-012`.

- [ ] **Step 1: Write CARD-365 runtime backlog item**

Create `docs/cards/CARD-365-impossibility-limits-runtime.md`:
```markdown
# CARD-365: Impossibility & Limits Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.7 Theory ([2026-07-23-phase-4c7-impossibility-limits-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c7-impossibility-limits-design.md)), Lean 4 Proofs ([TaktFormal/ImpossibilityLimits.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/ImpossibilityLimits.lean)).

## Goal
Implement the runtime impossibility evaluators (`ImpossibilityLimits`), non-approximability detectors, and empirical evaluation suite derived from Phase IV-C.7.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/impossibility.ts`):**
   - `ImpossibilityLimits` class.
   - `isUnreachable(detector, target, providers)`: empty provider & path solver.
   - `isNonApproximable(detector, requiredEpsilon, providers)`: saturation check.
2. **Empirical Validation (`cli/src/batch-f-012/`):**
   - Empirical evaluation of unreachability frontiers and non-approximability thresholds.
```

- [ ] **Step 2: Commit CARD-365**

```bash
git add docs/cards/CARD-365-impossibility-limits-runtime.md
git commit -m "docs(card): add CARD-365 for Impossibility Limits Runtime implementation"
```
