# CARD-466: Runtime Witness Lean 4 Certification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `TaktFormal/RuntimeWitness.lean` in Lean 4 to certify empirical witness artifacts from EXP-004 via the `WitnessConsistentWithRuntime` predicate and prove the `validWitness_implies_necessity` elevation theorem with 0 errors and 0 `sorry`s.

**Architecture:** Create 3-layer formal elevation bridge: Layer 1 `WitnessArtifact`, Layer 2 `WitnessConsistentWithRuntime` predicate, Layer 3 `validWitness_implies_necessity` elevation theorem, and formal witness instantiations for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints
- Lean 4 codebase in `takt-formal/`
- Zero build errors and zero `sorry`s in Lean 4
- Pure abstract Lean 4 formalization independent of JSON/runtime file I/O
- Expose module via `import TaktFormal.RuntimeWitness` in `takt-formal/TaktFormal.lean`

---

### Task 1: Create `TaktFormal/RuntimeWitness.lean` with Data, Semantics, and Elevation Theorem

**Files:**
- Create: `takt-formal/TaktFormal/RuntimeWitness.lean`

**Interfaces:**
- Consumes: `TaktFormal.RuntimeSufficiency` (`RuntimeCapability`, `Runtime`, `removeCapability`, `NecessaryCapability`)
- Produces: `WitnessArtifact`, `WitnessConsistentWithRuntime`, `validWitness_implies_necessity`

- [ ] **Step 1: Create `takt-formal/TaktFormal/RuntimeWitness.lean`**

```lean
import TaktFormal.RuntimeSufficiency

namespace TaktFormal.RuntimeWitness

open TaktFormal.RuntimeSufficiency

universe u v

/-- Layer 1: Pure data structure for imported witness artifacts --/
structure WitnessArtifact (α : Type u) (δ : Type v) where
  capability : RuntimeCapability
  representation : α
  fullDecision : δ
  reducedDecision : δ
  preservedState : Prop

/-- Layer 2: Certification predicate checking consistency between witness data and runtime policy --/
def WitnessConsistentWithRuntime (M : Runtime α δ) (w : WitnessArtifact α δ) : Prop :=
  M.policy w.representation = w.fullDecision ∧
  (removeCapability M w.capability).policy w.representation = w.reducedDecision ∧
  w.fullDecision ≠ w.reducedDecision ∧
  w.preservedState

/-- Layer 3: Elevation Theorem — A certified witness implies capability necessity --/
theorem validWitness_implies_necessity {α : Type u} {δ : Type v} {M : Runtime α δ} {w : WitnessArtifact α δ}
    (h_valid : WitnessConsistentWithRuntime M w) :
    NecessaryCapability w.capability M := by
  use w.representation
  have h_full := h_valid.1
  have h_red := h_valid.2.1
  have h_neq := h_valid.2.2.1
  rw [h_full, h_red]
  exact h_neq

/-- Construct formal witness representation for a specific capability --/
def createWitnessInstance {α : Type u} {δ : Type v} (cap : RuntimeCapability) (r : α) (d_full d_red : δ)
    (h_pres : Prop) : WitnessArtifact α δ :=
  { capability := cap,
    representation := r,
    fullDecision := d_full,
    reducedDecision := d_red,
    preservedState := h_pres }

end TaktFormal.RuntimeWitness
```

- [ ] **Step 2: Verify Lean compilation with `lake build`**

Run command in `takt-formal`:
```bash
lake build
```
Expected output: Build completed successfully.

- [ ] **Step 3: Commit initial `RuntimeWitness.lean`**

```bash
git add takt-formal/TaktFormal/RuntimeWitness.lean
git commit -m "feat(formal): implement RuntimeWitness.lean with 3-layer certification bridge"
```

---

### Task 2: Expose `RuntimeWitness` in `TaktFormal.lean` and Verify Project Build

**Files:**
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TaktFormal/RuntimeWitness.lean`
- Produces: Exported `import TaktFormal.RuntimeWitness` in `TaktFormal.lean`

- [ ] **Step 1: Add import to `takt-formal/TaktFormal.lean`**

Add line to `takt-formal/TaktFormal.lean`:
```lean
import TaktFormal.RuntimeWitness
```

- [ ] **Step 2: Run full project compilation check**

Run command in `takt-formal`:
```bash
lake build
```
Expected output: Build completed successfully (0 errors, 0 sorrys across all 229 jobs).

- [ ] **Step 3: Commit module registration**

```bash
git add takt-formal/TaktFormal.lean
git commit -m "feat(formal): export TaktFormal.RuntimeWitness in main TaktFormal module"
```
