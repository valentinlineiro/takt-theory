# CARD-464: Runtime Kernel Necessity Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formalize component necessity, decision preservation, runtime sufficiency, irreducibility, and the ST-016 hypothesis in Lean 4.

**Architecture:** Create `TaktFormal/RuntimeSufficiency.lean` in Lean 4 defining abstract representations, policies, capabilities (`contract`, `uncertainty`, `temporal`), runtime compositions, decision preservation, local capability necessity, sufficiency, irreducibility, minimal runtimes, and baseline necessity theorems.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints
- Lean 4 codebase in `takt-formal/`
- Zero build errors and zero `sorry`s in Lean 4
- Pure abstract Lean 4 formalization independent of TypeScript implementation files
- Expose module via `import TaktFormal.RuntimeSufficiency` in `takt-formal/TaktFormal.lean`

---

### Task 1: Base Formalization — Capabilities, Representation, Policy, and Runtime Structure

**Files:**
- Create: `takt-formal/TaktFormal/RuntimeSufficiency.lean`

**Interfaces:**
- Consumes: Lean 4 prelude
- Produces: `RuntimeCapability`, `Runtime`, `removeCapability`, `PreservesDecision`

- [ ] **Step 1: Write base definitions in `takt-formal/TaktFormal/RuntimeSufficiency.lean`**

```lean
import Mathlib.Data.Set.Basic

namespace TaktFormal.RuntimeSufficiency

universe u v

variable {α : Type u} {δ : Type v}

/-- Abstract theoretical runtime capabilities --/
inductive RuntimeCapability
  | contract
  | uncertainty
  | temporal
  deriving DecidableEq

/-- Abstract runtime composition with capability set and decision policy --/
structure Runtime (α : Type u) (δ : Type v) where
  capabilities : Set RuntimeCapability
  policy : α → δ

/-- Remove a capability from a runtime composition --/
def removeCapability (M : Runtime α δ) (C : RuntimeCapability) : Runtime α δ :=
  { capabilities := M.capabilities \ {C},
    policy := M.policy }

/-- Decision preservation between two runtime compositions --/
def PreservesDecision (M1 M2 : Runtime α δ) : Prop :=
  ∀ r : α, M1.policy r = M2.policy r

end TaktFormal.RuntimeSufficiency
```

- [ ] **Step 2: Run `lake build` to verify Lean compilation**

Run command in `takt-formal`:
```bash
lake build
```
Expected output: Build completed successfully.

- [ ] **Step 3: Commit initial file**

```bash
git add takt-formal/TaktFormal/RuntimeSufficiency.lean
git commit -m "feat(formal): add base RuntimeCapability, Runtime, and PreservesDecision definitions"
```

---

### Task 2: Core Definitions and Necessity Theorems

**Files:**
- Modify: `takt-formal/TaktFormal/RuntimeSufficiency.lean`

**Interfaces:**
- Consumes: `RuntimeCapability`, `Runtime`, `removeCapability`, `PreservesDecision`
- Produces: `NecessaryCapability`, `Sufficient`, `Irreducible`, `MinimalRuntime`, `ST016_Statement`, and initial baseline theorems

- [ ] **Step 1: Append core definitions and theorems to `takt-formal/TaktFormal/RuntimeSufficiency.lean`**

```lean
/-- A capability C is locally necessary for runtime M if removing C alters the decision on at least one representation r --/
def NecessaryCapability (C : RuntimeCapability) (M : Runtime α δ) : Prop :=
  ∃ r : α, M.policy r ≠ (removeCapability M C).policy r

/-- A runtime composition M is sufficient with respect to optimal policy pi_star if it preserves decisions for all r --/
def Sufficient (M : Runtime α δ) (pi_star : α → δ) : Prop :=
  ∀ r : α, M.policy r = pi_star r

/-- A runtime composition M is irreducible if every contained capability is necessary --/
def Irreducible (M : Runtime α δ) : Prop :=
  ∀ C ∈ M.capabilities, NecessaryCapability C M

/-- A runtime composition M is minimal if it is both sufficient and irreducible --/
def MinimalRuntime (M : Runtime α δ) (pi_star : α → δ) : Prop :=
  Sufficient M pi_star ∧ Irreducible M

/-- Lemma: A necessary capability implies that removing it destroys decision preservation --/
theorem necessary_implies_non_preservation (C : RuntimeCapability) (M : Runtime α δ) :
    NecessaryCapability C M → ¬ PreservesDecision M (removeCapability M C) := by
  intro h_nec h_pres
  rcases h_nec with ⟨r, h_neq⟩
  have h_eq := h_pres r
  exact h_neq h_eq

/-- Theorem: In any minimal runtime, every capability in its composition set is necessary --/
theorem minimal_implies_all_capabilities_necessary (M : Runtime α δ) (pi_star : α → δ) :
    MinimalRuntime M pi_star → ∀ C ∈ M.capabilities, NecessaryCapability C M := by
  intro h_min C h_in
  exact h_min.2 C h_in

/-- ST-016 Formal Conjecture Statement --/
def ST016_Conjecture (M_full : Runtime α δ) (pi_star : α → δ) : Prop :=
  M_full.capabilities = {RuntimeCapability.contract, RuntimeCapability.uncertainty, RuntimeCapability.temporal} ∧
  MinimalRuntime M_full pi_star
```

- [ ] **Step 2: Run `lake build` to verify proofs compile with 0 errors and 0 sorrys**

Run command in `takt-formal`:
```bash
lake build
```
Expected output: Build completed successfully.

- [ ] **Step 3: Commit core definitions and theorems**

```bash
git add takt-formal/TaktFormal/RuntimeSufficiency.lean
git commit -m "feat(formal): formalize NecessaryCapability, MinimalRuntime, and ST-016 conjecture in Lean 4"
```

---

### Task 3: Expose Module in `TaktFormal.lean` and Complete Build Verification

**Files:**
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TaktFormal/RuntimeSufficiency.lean`
- Produces: Registered `import TaktFormal.RuntimeSufficiency` in main package root

- [ ] **Step 1: Add import to `takt-formal/TaktFormal.lean`**

Add line to `takt-formal/TaktFormal.lean`:
```lean
import TaktFormal.RuntimeSufficiency
```

- [ ] **Step 2: Run full build check**

Run command in `takt-formal`:
```bash
lake build
```
Expected output: Build completed successfully (0 errors, 0 sorrys across all 227 jobs).

- [ ] **Step 3: Commit final registration**

```bash
git add takt-formal/TaktFormal.lean
git commit -m "feat(formal): export TaktFormal.RuntimeSufficiency in main TaktFormal module"
```
