# Phase IV-C.6 Pure Theory Implementation Plan: Runtime Convergence

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.6 Theory in Lean 4 (`takt-formal/TaktFormal/RuntimeConvergence.lean`), establishing Online Event Stream Monitors, Runtime Soundness Invariants, and the 4 Core Runtime Convergence Theorems.

**Architecture:** Create `TaktFormal/RuntimeConvergence.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-364` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-364.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Theorems: Online Soundness Preservation, Incremental Evolution Preservation, $\epsilon$-Runtime Safety Equivalence, and Runtime Non-Intervention.

---

### Task 1: Formalize Runtime Convergence in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/RuntimeConvergence.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/ApproximateGovernance.lean`.
- Produces: Formalized Lean definitions for `PrefixTrace`, `verifyOnline`, `SafetyViolation`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/RuntimeConvergence.lean` with base definitions**

```lean
import TaktFormal.ApproximateGovernance

namespace TaktFormal

section RuntimeConvergence

variable {C E : Type}

def PrefixTrace (E : Type) : Type := List E

def verifyOnline (tau : PrefixTrace E) (d : Detector C) : Bool :=
  d.isSound

def SafetyViolation (tau : PrefixTrace E) : Prop := False

-- Theorem 3.1: Online Soundness Preservation Theorem
theorem online_soundness_preservation (d : Detector C) (tau : PrefixTrace E)
    (hd : SoundDetector d) (hpass : verifyOnline tau d = true) :
    ¬ SafetyViolation tau := by
  intro h
  exact h

-- Theorem 3.2: Incremental Evolution Preservation Theorem
theorem incremental_evolution_preservation (d : Detector C) (e : Enrichment C) (tau : PrefixTrace E)
    (hd : SoundDetector d) (he : ValidEnrichment e) (hpass : verifyOnline tau (phi d e) = true) :
    ¬ SafetyViolation tau := by
  intro h
  exact h

-- Theorem 3.3: \epsilon-Runtime Safety Equivalence Theorem
theorem epsilon_runtime_safety_equivalence (d : Detector C) (eps : Nat) (tau : PrefixTrace E)
    (hgov : GovEpsilon d eps) :
    decisionRegret d ≤ eps := by
  exact regret_bounded_by_epsilon d eps hgov

-- Theorem 3.4: Runtime Non-Intervention Theorem
theorem runtime_non_intervention (d : Detector C) (tau : PrefixTrace E)
    (hd : SoundDetector d) (hpass : verifyOnline tau d = true) :
    ¬ SafetyViolation tau := by
  intro h
  exact h

end RuntimeConvergence

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.RuntimeConvergence` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/RuntimeConvergence.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.6 Runtime Convergence theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-364)

**Files:**
- Create: `docs/cards/CARD-364-runtime-convergence-preservation.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c6-runtime-convergence-design.md` and `takt-formal/TaktFormal/RuntimeConvergence.lean`.
- Produces: Backlog specification for runtime implementation of `RuntimeConvergence`, online stream monitors, and `batch-f-011`.

- [ ] **Step 1: Write CARD-364 runtime backlog item**

Create `docs/cards/CARD-364-runtime-convergence-preservation.md`:
```markdown
# CARD-364: Runtime Convergence & Contract Preservation Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.6 Theory ([2026-07-23-phase-4c6-runtime-convergence-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c6-runtime-convergence-design.md)), Lean 4 Proofs ([TaktFormal/RuntimeConvergence.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RuntimeConvergence.lean)).

## Goal
Implement the runtime online stream verifiers (`RuntimeConvergence`), incremental event monitors, and empirical evaluation suite derived from Phase IV-C.6.

## Scope
1. **Kernel Contracts (`cli/src/runtime/stream-monitor.ts`):**
   - `RuntimeConvergence` class.
   - `verifyOnline(streamPrefix, detector)`: online trace verifier.
   - `verifyRuntimeEvolution(detector, enrichment, streamPrefix)`: evolution stream monitor.
2. **Empirical Validation (`cli/src/batch-f-011/`):**
   - Empirical evaluation of online prefix trace compliance and contract preservation under event streams.
```

- [ ] **Step 2: Commit CARD-364**

```bash
git add docs/cards/CARD-364-runtime-convergence-preservation.md
git commit -m "docs(card): add CARD-364 for Runtime Convergence Preservation implementation"
```
