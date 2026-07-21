# Phase IV Lean Formalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the basic Lean 4 module structure for Phase IV (Optimal Representation Theory) and prove the fundational Coincidence Theorem.

**Architecture:** Create files for `Representation/Order.lean`, `Cost/Poset.lean`, `Cost/Monotonicity.lean`, `Optimality/Coincidence.lean`, and `Optimality/Existence.lean` under `takt-formal/TaktFormal/`. Integrate them into `TaktFormal.lean` and compile using `lake build`.

**Tech Stack:** Lean 4

## Global Constraints

*   Use `\sqsubseteq` and `\sqsubseteq_L` concepts consistently.
*   Do not modify existing files (like `Kernel.lean`) to avoid breaking existing imports.
*   Keep proofs clean and modular.

---

### Task 1: Create Representation Order Module

**Files:**
- Create: `takt-formal/TaktFormal/Representation/Order.lean`
- Modify: `takt-formal/TaktFormal.lean`

- [ ] **Step 1: Create Order.lean**

Write `takt-formal/TaktFormal/Representation/Order.lean`:

```lean
import TaktFormal.Kernel

open Kernel

/-- Definición 1.1 (Refinamiento): R1 ⊑ R2 si R2 es al menos tan fina como R1 (el kernel de R2 subyace al de R1). -/
def refinement {S Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2) : Prop :=
  kernelSubset R2 R1

namespace RepresentationOrder

variable {S Z1 Z2 Z3 : Type}

theorem refinement_refl (R : S → Z1) : refinement R R :=
  subset_refl

theorem refinement_trans {R1 : S → Z1} {R2 : S → Z2} {R3 : S → Z3}
    (h1 : refinement R1 R2) (h2 : refinement R2 R3) : refinement R1 R3 :=
  subset_trans h2 h1

end RepresentationOrder
```

- [ ] **Step 2: Add import to TaktFormal.lean**

Add the import at the end of `takt-formal/TaktFormal.lean`:
`import TaktFormal.Representation.Order`

- [ ] **Step 3: Run lake build to verify it compiles**

Run: `lake build` in `takt-formal` directory.
Expected: Build succeeds.

- [ ] **Step 4: Commit**

Run: `git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/Representation/Order.lean && git commit -m "proof(Fase IV): add Representation.Order module"`

---

### Task 2: Create Cost & Monotonicity Modules

**Files:**
- Create: `takt-formal/TaktFormal/Cost/Poset.lean`
- Create: `takt-formal/TaktFormal/Cost/Monotonicity.lean`
- Modify: `takt-formal/TaktFormal.lean`

- [ ] **Step 1: Create Poset.lean**

Write `takt-formal/TaktFormal/Cost/Poset.lean`:

```lean
-- Estructura abstracta para los posets de costes.
-- Usamos la clase PartialOrder incorporada en Lean.
```

(Wait, since Lean has `PartialOrder` built-in, this file can just be an empty or simple placeholder for documentation, or define auxiliary order properties if needed). Let's keep it simple:

```lean
import TaktFormal.Representation.Order

-- Módulo para documentar u organizar las definiciones relacionadas al poset de costes.
```

- [ ] **Step 2: Create Monotonicity.lean**

Write `takt-formal/TaktFormal/Cost/Monotonicity.lean`:

```lean
import TaktFormal.Representation.Order

open Kernel

/-- Hipótesis 2.2 (C0 - Cost Monotonicity): refinamiento incremental -> incremento de coste. -/
def C0 {S L : Type} [PartialOrder L] (c : {Z : Type} → (S → Z) → L) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), kernelSubset R2 R1 → c R1 ≤ c R2

/-- Hipótesis 2.3 (C0' - Strict Monotonicity): refinamiento estricto -> incremento estricto de coste. -/
def C0' {S L : Type} [PartialOrder L] (c : {Z : Type} → (S → Z) → L) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), (kernelSubset R2 R1 ∧ ¬ kernelSubset R1 R2) → c R1 < c R2
```

- [ ] **Step 3: Add imports to TaktFormal.lean**

Add to `takt-formal/TaktFormal.lean`:
`import TaktFormal.Cost.Poset`
`import TaktFormal.Cost.Monotonicity`

- [ ] **Step 4: Run lake build to verify it compiles**

Run: `lake build` in `takt-formal` directory.
Expected: Build succeeds.

- [ ] **Step 5: Commit**

Run: `git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/Cost/Poset.lean takt-formal/TaktFormal/Cost/Monotonicity.lean && git commit -m "proof(Fase IV): add Cost and Monotonicity modules"`

---

### Task 3: Create Optimality & Coincidence Modules

**Files:**
- Create: `takt-formal/TaktFormal/Optimality/Coincidence.lean`
- Create: `takt-formal/TaktFormal/Optimality/Existence.lean`
- Modify: `takt-formal/TaktFormal.lean`

- [ ] **Step 1: Create Coincidence.lean**

Write `takt-formal/TaktFormal/Optimality/Coincidence.lean`:

```lean
import TaktFormal.Kernel
import TaktFormal.StructuralSufficiency
import TaktFormal.Representation.Order
import TaktFormal.Cost.Monotonicity

open Kernel

/-- Teorema de Coincidencia (Theorem 2.1): Bajo C0, R_min es un óptimo global de costes. -/
theorem coincidence_theorem {S A C L : Type} [PartialOrder L]
    (K : C → S → S → Prop) (C_D : C → Prop) (D : S → A)
    (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
    (c : {Z : Type} → (S → Z) → L) (hc0 : C0 c)
    {Z : Type} (R : S → Z) (h_sufficient : kernelSubset R D) :
    c (R_min K C_D hK_equiv) ≤ c R := by
  have h_min : kernelSubset R (R_min K C_D hK_equiv) :=
    R_min_is_minimum K C_D D hK_equiv hA0 R h_sufficient
  exact hc0 (R_min K C_D hK_equiv) R h_min
```

- [ ] **Step 2: Create Existence.lean**

Write `takt-formal/TaktFormal/Optimality/Existence.lean`:

```lean
import TaktFormal.Kernel
import TaktFormal.Representation.Order
import TaktFormal.Cost.Monotonicity

open Kernel

/-- Definición de Representación Óptima (Definition 1.1) -/
def is_optimal {S A L : Type} [PartialOrder L] (c : {Z : Type} → (S → Z) → L)
    (D : S → A) {Z : Type} (R : S → Z) : Prop :=
  kernelSubset R D ∧ ∀ {Z' : Type} (R' : S → Z'), kernelSubset R' D → c R ≤ c R'

/-- Hipótesis A0-IV: alcanzabilidad del coste realizable. -/
def RealizableCostAttainment {S A L : Type} [PartialOrder L] (D : S → A) (c : {Z : Type} → (S → Z) → L) : Prop :=
  ∃ (Z* : Type) (R* : S → Z*), kernelSubset R* D ∧ ∀ {Z' : Type} (R' : S → Z'), kernelSubset R' D → c R* ≤ c R'

/-- Proposición: A0-IV implica existencia de óptimo. -/
theorem optimal_exists {S A L : Type} [PartialOrder L] (D : S → A) (c : {Z : Type} → (S → Z) → L)
    (h_attain : RealizableCostAttainment D c) :
    ∃ (Z* : Type) (R* : S → Z*), is_optimal c D R* := by
  rcases h_attain with ⟨Z*, R*, h_suff, h_min⟩
  exact ⟨Z*, R*, h_suff, h_min⟩
```

- [ ] **Step 3: Add imports to TaktFormal.lean**

Add to `takt-formal/TaktFormal.lean`:
`import TaktFormal.Optimality.Coincidence`
`import TaktFormal.Optimality.Existence`

- [ ] **Step 4: Run lake build to verify it compiles**

Run: `lake build` in `takt-formal` directory.
Expected: Build succeeds.

- [ ] **Step 5: Commit**

Run: `git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/Optimality/Coincidence.lean takt-formal/TaktFormal/Optimality/Existence.lean && git commit -m "proof(Fase IV): add Coincidence and Existence modules"`
