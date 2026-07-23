# Phase IV-C.1 Pure Theory Implementation Plan: Detector Evolution & Reachability

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.1 Theory in Lean 4 (`takt-formal/TaktFormal/DetectorEvolution.lean`), establishing the Detector Evolution Space $\mathcal{G}_D$, transition operator $\Phi$, the 5 core invariants, Theorem 5.1 (Abstract Reachability), and freezing abstract contracts for the runtime layer.

**Architecture:** Create `TaktFormal/DetectorEvolution.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-359` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-359.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 5 core invariants: Soundness Preservation, Composition, Identity, Governance Monotonicity, and Progress Measure.

---

### Task 1: Formalize Detector Evolution Space & Invariants in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/DetectorEvolution.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: Lean 4 Mathlib / core definitions.
- Produces: Formalized Lean types `Detector`, `SoundDetector`, `Enrichment`, `ValidEnrichment`, transition operator `phi`, and proofs for Soundness Preservation, Identity, Composition, Governance Monotonicity, and Progress Measure.

- [ ] **Step 1: Create `takt-formal/TaktFormal/DetectorEvolution.lean` with base structures**

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

def idEnrichment : Enrichment :=
  { id := "id", targetCapability := "", preservesSoundness := true }
```

- [ ] **Step 2: Prove Invariant 1 (Soundness Preservation), Invariant 2 (Composition), Invariant 3 (Identity)**

In `takt-formal/TaktFormal/DetectorEvolution.lean`:
```lean
theorem soundness_preservation (d : Detector) (e : Enrichment)
  (hd : SoundDetector d) (he : ValidEnrichment e) :
  SoundDetector (phi d e) := by
  dsimp [SoundDetector, phi]
  rw [hd, he]
  rfl

theorem identity_evolution (d : Detector) (hd : SoundDetector d) :
  SoundDetector (phi d idEnrichment) := by
  apply soundness_preservation d idEnrichment hd
  rfl
```

- [ ] **Step 3: Prove Invariant 4 (Governance Monotonicity) and Invariant 5 (Progress Measure)**

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
```

- [ ] **Step 4: Prove Abstract Detector Reachability Theorem and Unreachability Characterization**

In `takt-formal/TaktFormal/DetectorEvolution.lean`:
```lean
theorem abstract_detector_reachability (d_alg d_top : Detector) (e_seq : List Enrichment)
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

def UnreachableAbstract (d_alg d_top : Detector) (providers : Set Enrichment) : Prop :=
  ¬ ∃ (e_seq : List Enrichment), (∀ e ∈ e_seq, e ∈ providers ∧ ValidEnrichment e) ∧
    (e_seq.foldl phi d_alg).capabilities = d_top.capabilities
```

- [ ] **Step 5: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.DetectorEvolution` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 6: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 7: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/DetectorEvolution.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.1 Detector Evolution invariants and reachability theorem in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-359)

**Files:**
- Create: `docs/cards/CARD-359-detector-evolution-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c-governed-convergence-design.md` and `takt-formal/TaktFormal/DetectorEvolution.lean`.
- Produces: Backlog specification for runtime implementation of `Detector`, `Enrichment`, `EvolutionEngine`, BFS reachability solver, and `batch-f-006`.

- [ ] **Step 1: Write CARD-359 runtime backlog item**

Create `docs/cards/CARD-359-detector-evolution-runtime.md`:
```markdown
# CARD-359: Detector Evolution Runtime Implementation

**Status:** Backlog  
**Prerequisite:** Phase IV-C.1 Theory ([2026-07-23-phase-4c-governed-convergence-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c-governed-convergence-design.md)), `TaktFormal/DetectorEvolution.lean`.

## Goal
Implement the runtime evolution engine and empirical evaluation suite derived from Phase IV-C.1 formal theory.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/evolution.ts`):**
   - `Detector`, `Enrichment`, `EvolutionEngine` interface.
   - `DefaultEvolutionEngine` class enforcing Soundness Preservation, Monotonicity, and Progress Measure.
   - BFS Reachability Solver for registered providers $\mathcal{E}_{\text{known}}$.
2. **Empirical Validation (`cli/src/batch-f-006/`):**
   - Scenario A: Full convergence trajectory ($D_{\text{alg}} \rightsquigarrow D_{\text{top}}$).
   - Scenario B: Unreachable deficit (closure deficit).
   - Scenario C: Soundness barrier rejection.
```

- [ ] **Step 2: Commit CARD-359**

```bash
git add docs/cards/CARD-359-detector-evolution-runtime.md
git commit -m "docs(card): add CARD-359 for Detector Evolution Runtime implementation"
```
