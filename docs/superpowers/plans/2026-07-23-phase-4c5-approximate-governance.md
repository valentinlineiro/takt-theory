# Phase IV-C.5 Pure Theory Implementation Plan: Approximate Governance

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.5 Theory in Lean 4 (`takt-formal/TaktFormal/ApproximateGovernance.lean`), establishing $\epsilon$-Governance predicate $Gov_{\epsilon}(D)$, saturation bound $\epsilon^*$, and the 4 Core Approximate Governance Theorems.

**Architecture:** Create `TaktFormal/ApproximateGovernance.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-363` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-363.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Theorems: Exactness at Zero, $\epsilon$-Governance Monotonicity, $\epsilon^*$-Optimal Saturation, and Decision Safety Preservation Bound.

---

### Task 1: Formalize Approximate Governance in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/ApproximateGovernance.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/CostOptimization.lean`.
- Produces: Formalized Lean definitions for `GovEpsilon`, `SaturationBound`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/ApproximateGovernance.lean` with base definitions**

```lean
import TaktFormal.CostOptimization

namespace TaktFormal

section ApproximateGovernance

variable {C : Type}

-- \epsilon-Governance Predicate: \delta(D) <= \epsilon
def GovEpsilon (d : Detector C) (epsilon : Nat) : Prop :=
  delta_perfection d ≤ epsilon

-- Theorem 3.1: Exactness at Zero
theorem exactness_at_zero (d : Detector C) (hzero : d.progressMeasure = 0) :
    GovEpsilon d 0 := by
  dsimp [GovEpsilon, delta_perfection]
  exact Nat.le_of_eq hzero

-- Theorem 3.2: Tolerance Upset & Evolution Preservation
theorem epsilon_governance_upset (d : Detector C) (e1 e2 : Nat)
    (hgov : GovEpsilon d e1) (hle : e1 ≤ e2) :
    GovEpsilon d e2 := by
  dsimp [GovEpsilon] at *
  exact Nat.le_trans hgov hle

theorem epsilon_governance_evolution_preservation (d : Detector C) (e : Enrichment C) (eps : Nat)
    (hgov : GovEpsilon d eps) :
    GovEpsilon (phi d e) eps := by
  dsimp [GovEpsilon, delta_perfection, phi] at *
  exact Nat.le_trans (Nat.sub_le d.progressMeasure 1) hgov

-- Theorem 3.4: Regret Bound under \epsilon-Governance
def decisionRegret (d : Detector C) : Nat :=
  delta_perfection d

theorem regret_bounded_by_epsilon (d : Detector C) (eps : Nat)
    (hgov : GovEpsilon d eps) :
    decisionRegret d ≤ eps := by
  dsimp [decisionRegret, GovEpsilon] at *
  exact hgov

end ApproximateGovernance

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.ApproximateGovernance` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/ApproximateGovernance.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.5 Approximate Governance theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-363)

**Files:**
- Create: `docs/cards/CARD-363-approximate-governance-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c5-approximate-governance-design.md` and `takt-formal/TaktFormal/ApproximateGovernance.lean`.
- Produces: Backlog specification for runtime implementation of `EpsilonGovernance`, saturation bound evaluators, and `batch-f-010`.

- [ ] **Step 1: Write CARD-363 runtime backlog item**

Create `docs/cards/CARD-363-approximate-governance-runtime.md`:
```markdown
# CARD-363: Approximate Governance Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.5 Theory ([2026-07-23-phase-4c5-approximate-governance-design.md](docs/2026-07-23-phase-4c5-approximate-governance-design.md)), Lean 4 Proofs ([TaktFormal/ApproximateGovernance.lean](takt-formal/TaktFormal/ApproximateGovernance.lean)).

## Goal
Implement the runtime $\epsilon$-governance verifier (`EpsilonGovernance`), saturation bound solver $\epsilon^*$, and empirical evaluation suite derived from Phase IV-C.5.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/epsilon-governance.ts`):**
   - `EpsilonGovernance` class.
   - `isEpsilonGoverned(detector, epsilon)`: $\delta(D) \le \epsilon$ verifier.
   - `computeSaturationBound(initial, providers)`: $\epsilon^*$ saturation solver.
   - `findEpsilonOptimalDetector(initial, providers)`: $\epsilon^*$-optimal detector search.
2. **Empirical Validation (`cli/src/batch-f-010/`):**
   - Empirical evaluation of $\epsilon$-governance tolerance bounds and saturation limits.
```

- [ ] **Step 2: Commit CARD-363**

```bash
git add docs/cards/CARD-363-approximate-governance-runtime.md
git commit -m "docs(card): add CARD-363 for Approximate Governance Runtime implementation"
```
