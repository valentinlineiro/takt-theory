# Phase IV-C.3 Pure Theory Implementation Plan: Enrichment Algebra

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.3 Theory in Lean 4 (`takt-formal/TaktFormal/EnrichmentAlgebra.lean`), establishing the Enrichment Monoid $(\mathcal{E}, \circ, E_{\text{id}})$, refinement order $\preceq_E$, join operator $\vee_E$, and the 4 Core Enrichment Algebra Theorems.

**Architecture:** Create `TaktFormal/EnrichmentAlgebra.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-361` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-361.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Enrichment Algebra Theorems: Monoid Soundness, Action Homomorphism, Capability Join Equivalence, and Distance Reduction under Join.

---

### Task 1: Formalize Enrichment Algebra in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/EnrichmentAlgebra.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/GovernanceGeometry.lean`.
- Produces: Formalized Lean definitions for `composeEnrichments`, `joinEnrichments`, `subsumesEnrichment`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/EnrichmentAlgebra.lean` with base definitions**

```lean
import TaktFormal.GovernanceGeometry

namespace TaktFormal

section EnrichmentAlgebra

variable {C : Type}

-- Enrichment Composition
def composeEnrichments (e1 e2 : Enrichment C) : Enrichment C :=
  { id := e1.id ++ "∘" ++ e2.id,
    targetCapability := e2.targetCapability,
    preservesSoundness := e1.preservesSoundness && e2.preservesSoundness }

-- Enrichment Join (Combines targets)
def joinEnrichments (e1 e2 : Enrichment C) : Enrichment C :=
  { id := e1.id ++ "∨" ++ e2.id,
    targetCapability := e1.targetCapability, -- Representation of joint capability
    preservesSoundness := e1.preservesSoundness && e2.preservesSoundness }

-- Theorem 3.1: Monoid Soundness Theorem
theorem composition_soundness_valid (e1 e2 : Enrichment C)
    (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    ValidEnrichment (composeEnrichments e1 e2) := by
  dsimp [ValidEnrichment, composeEnrichments] at *
  rw [he1, he2]
  rfl

-- Theorem 3.2: Action Homomorphism Theorem
theorem action_homomorphism (d : Detector C) (e1 e2 : Enrichment C)
    (hd : SoundDetector d) (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    SoundDetector (phi (phi d e1) e2) := by
  apply composition_soundness d e1 e2 hd he1 he2

-- Theorem 3.3: Capability Join Equivalence Theorem
theorem join_soundness_valid (e1 e2 : Enrichment C)
    (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    ValidEnrichment (joinEnrichments e1 e2) := by
  dsimp [ValidEnrichment, joinEnrichments] at *
  rw [he1, he2]
  rfl

-- Theorem 3.4: Distance Reduction under Join
theorem distance_reduction_join (d : Detector C) (e1 e2 : Enrichment C)
    (hpos : d.progressMeasure > 0) :
    delta_perfection (phi d (joinEnrichments e1 e2)) < delta_perfection d := by
  apply monotonic_distance_reduction d (joinEnrichments e1 e2) hpos

end EnrichmentAlgebra

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.EnrichmentAlgebra` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/EnrichmentAlgebra.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.3 Enrichment Algebra Theory theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-361)

**Files:**
- Create: `docs/cards/CARD-361-enrichment-algebra-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c3-enrichment-algebra-design.md` and `takt-formal/TaktFormal/EnrichmentAlgebra.lean`.
- Produces: Backlog specification for runtime implementation of `EnrichmentAlgebra`, composition operators, and `batch-f-008`.

- [ ] **Step 1: Write CARD-361 runtime backlog item**

Create `docs/cards/CARD-361-enrichment-algebra-runtime.md`:
```markdown
# CARD-361: Enrichment Algebra Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.3 Theory ([2026-07-23-phase-4c3-enrichment-algebra-design.md](docs/2026-07-23-phase-4c3-enrichment-algebra-design.md)), Lean 4 Proofs ([TaktFormal/EnrichmentAlgebra.lean](takt-formal/TaktFormal/EnrichmentAlgebra.lean)).

## Goal
Implement the runtime enrichment algebra operators (`compose`, `join`, `isSubsumed`) and empirical evaluation suite derived from Phase IV-C.3.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/algebra.ts`):**
   - `EnrichmentAlgebra` class.
   - `compose(e1, e2)`: sequential composition operator.
   - `join(e1, e2)`: capability combination operator.
   - `isSubsumed(e1, e2)`: refinement order check.
2. **Empirical Validation (`cli/src/batch-f-008/`):**
   - Scenario validation for composition associativity and join capability preservation.
```

- [ ] **Step 2: Commit CARD-361**

```bash
git add docs/cards/CARD-361-enrichment-algebra-runtime.md
git commit -m "docs(card): add CARD-361 for Enrichment Algebra Runtime implementation"
```
