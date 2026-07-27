# ST-015 Lean Certification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Certify the core theorems of ST-015 (Capability Theory and Structural Sufficiency) in Lean 4 by creating a modular and self-contained proof file.

**Architecture:** We will create [takt-formal/TaktFormal/StructuralSufficiency.lean](takt-formal/TaktFormal/StructuralSufficiency.lean) which depends only on the core [Kernel.lean](takt-formal/TaktFormal/Kernel.lean) definitions. The theorems will be proven using basic Lean 4 quotient types and logic without external libraries.

**Tech Stack:** Lean 4 (Lake build system)

## Global Constraints
* Every proof must be fully verified and contain no `sorry` placeholders.
* Do not introduce external mathlib dependencies; rely only on the standard Lean 4 core library.
* Follow the exact incremental step-by-step process: define, compile, prove, compile, move to next.

---

### Task 1: Fundamental Capability Theory Definitions

**Files:**
* Create: [takt-formal/TaktFormal/StructuralSufficiency.lean](takt-formal/TaktFormal/StructuralSufficiency.lean)

**Interfaces:**
* Consumes: `kernel` and `kernelSubset` from [takt-formal/TaktFormal/Kernel.lean](takt-formal/TaktFormal/Kernel.lean)
* Produces: `provides`, `C_R`, and `G` definitions for representation capability assessment.

- [ ] **Step 1: Write definitions in StructuralSufficiency.lean**
  Create the file with the following content:
  ```lean
  import TaktFormal.Kernel

  open Kernel

  section CapabilityTheory

  variable {S Z C : Type}
  variable (K : C → S → S → Prop)

  -- Una representación R provee una capacidad c si su kernel refina K c.
  def provides (R : S → Z) (c : C) : Prop :=
    kernelSubset R (fun x y => K c x y)

  -- C_R: conjunto de capacidades provistas por R.
  def C_R (R : S → Z) (c : C) : Prop :=
    provides K R c

  -- C_D: conjunto de capacidades requeridas por la decisión D.
  variable (C_D : C → Prop)

  -- G(D, R): gap de capacidades.
  def G (R : S → Z) (c : C) : Prop :=
    C_D c ∧ ¬ provides K R c

  end CapabilityTheory
  ```
- [ ] **Step 2: Run lake build to verify it compiles**
  Run: `cd takt-formal && lake build`
  Expected: Success.

---

### Task 2: Certifying Teoremas T3 and T4 (Capability Theory)

**Files:**
* Modify: [takt-formal/TaktFormal/StructuralSufficiency.lean](takt-formal/TaktFormal/StructuralSufficiency.lean)

**Interfaces:**
* Consumes: `G`, `provides`, and `C_R` definitions.
* Produces: `T3_correspondence` and `T4_monotonicity` proofs.

- [ ] **Step 1: Add T3 and T4 proofs to the CapabilityTheory section**
  Add these theorems before `end CapabilityTheory` in `StructuralSufficiency.lean`:
  ```lean
  -- T3: Correspondencia del gap (definicional en Lean).
  theorem T3_correspondence (R : S → Z) (c : C) :
      G K C_D R c ↔ (C_D c ∧ ¬ ∀ x y, kernel R x y → K c x y) := by
    dsimp [G, provides, kernelSubset]
    rfl

  -- T4: Monotonicidad del gap.
  -- Si R1 es más fina que R2 (ker(R1) ⊆ ker(R2)), entonces G(D, R1) ⊆ G(D, R2).
  theorem T4_monotonicity {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2) (h_refine : kernelSubset R1 R2) :
      ∀ c, G K C_D R1 c → G K C_D R2 c := by
    intro c hG
    rcases hG with ⟨hCD, h_noprov⟩
    refine ⟨hCD, ?_⟩
    intro h_prov2
    apply h_noprov
    exact subset_trans h_refine h_prov2
  ```
- [ ] **Step 2: Run lake build to verify it compiles**
  Run: `cd takt-formal && lake build`
  Expected: Success.
- [ ] **Step 3: Commit**
  Run: `git add takt-formal/TaktFormal/StructuralSufficiency.lean && git commit -m "proof(ST-015): formalize Capability Theory definitions, T3, and T4"`

---

### Task 3: Axioma A0 and Sufficiency Theorems T1 and T2

**Files:**
* Modify: [takt-formal/TaktFormal/StructuralSufficiency.lean](takt-formal/TaktFormal/StructuralSufficiency.lean)

**Interfaces:**
* Consumes: `provides`, `kernelSubset`
* Produces: `K_D`, `Axiom0`, `T1_characterization`, `T2_upset`, and `R_min` quotient map minimality proofs.

- [ ] **Step 1: Append Sufficiency definitions and T1/T2 proofs**
  Append the following section to `StructuralSufficiency.lean`:
  ```lean
  section StructuralSufficiency

  variable {S Z A C : Type}
  variable (K : C → S → S → Prop)
  variable (C_D : C → Prop)
  variable (D : S → A)

  -- Núcleo de capacidad K_D.
  def K_D (x y : S) : Prop :=
    ∀ c, C_D c → K c x y

  -- Axioma 0: Contract Coherence.
  def Axiom0 : Prop :=
    ∀ x y, kernel D x y ↔ K_D K C_D x y

  -- T1: Caracterización de la suficiencia.
  theorem T1_characterization (R : S → Z) (hA0 : Axiom0 K C_D D) :
      kernelSubset R D ↔ (∀ x y, kernel R x y → K_D K C_D x y) := by
    constructor
    · intro h x y hker
      have hD := h x y hker
      exact (hA0 x y).mp hD
    · intro h x y hker
      have hKD := h x y hker
      exact (hA0 x y).mpr hKD

  -- T2 (Upset): Si R1 es suficiente y R1 sqsubseteq R2 (es decir, ker(R2) ⊆ ker(R1)), R2 es suficiente.
  theorem T2_upset {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2) (h_sufficient : kernelSubset R1 D) (h_refine : kernelSubset R2 R1) :
      kernelSubset R2 D :=
    subset_trans h_refine h_sufficient

  -- Demostración de que K_D es relación de equivalencia.
  theorem K_D_refl (hK_equiv : ∀ c, Equivalence (K c)) (x : S) : K_D K C_D x x := by
    intro c hCD
    exact (hK_equiv c).refl x

  theorem K_D_symm (hK_equiv : ∀ c, Equivalence (K c)) {x y : S} (h : K_D K C_D x y) : K_D K C_D y x := by
    intro c hCD
    exact (hK_equiv c).symm (h c hCD)

  theorem K_D_trans (hK_equiv : ∀ c, Equivalence (K c)) {x y z : S} (h1 : K_D K C_D x y) (h2 : K_D K C_D y z) : K_D K C_D x z := by
    intro c hCD
    exact (hK_equiv c).trans (h1 c hCD) (h2 c hCD)

  def K_D_equivalence (hK_equiv : ∀ c, Equivalence (K c)) : Equivalence (K_D K C_D) :=
    ⟨K_D_refl K C_D hK_equiv, K_D_symm K C_D hK_equiv, K_D_trans K C_D hK_equiv⟩

  -- R_min cociente
  def R_min (hK_equiv : ∀ c, Equivalence (K c)) (s : S) : Quot (K_D K C_D) :=
    Quot.mk (K_D K C_D) s

  theorem kernel_R_min_eq_K_D (hK_equiv : ∀ c, Equivalence (K c)) (x y : S) :
      kernel (R_min K C_D hK_equiv) x y ↔ K_D K C_D x y := by
    dsimp [R_min, kernel]
    exact Quot.eq

  -- R_min es suficiente.
  theorem R_min_sufficient (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D) :
      kernelSubset (R_min K C_D hK_equiv) D := by
    intro x y hker
    have hKD : K_D K C_D x y := (kernel_R_min_eq_K_D K C_D hK_equiv x y).mp hker
    exact (hA0 x y).mpr hKD

  -- R_min es el mínimo de las representaciones suficientes.
  theorem R_min_is_minimum (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
      (R : S → Z) (h_sufficient : kernelSubset R D) :
      kernelSubset R (R_min K C_D hK_equiv) := by
    intro x y hker
    have hKD : K_D K C_D x y := (T1_characterization K C_D D R hA0).mp h_sufficient x y hker
    exact (kernel_R_min_eq_K_D K C_D hK_equiv x y).mpr hKD
  ```
- [ ] **Step 2: Run lake build to verify it compiles**
  Run: `cd takt-formal && lake build`
  Expected: Success.
- [ ] **Step 3: Commit**
  Run: `git add takt-formal/TaktFormal/StructuralSufficiency.lean && git commit -m "proof(ST-015): formalize A0, T1, and T2 (upset and R_min minimum)"`

---

### Task 4: Certifying Teorema T5 (Punto Fijo de la Suficiencia)

**Files:**
* Modify: [takt-formal/TaktFormal/StructuralSufficiency.lean](takt-formal/TaktFormal/StructuralSufficiency.lean)

**Interfaces:**
* Consumes: `kernelSubset`, `Axiom0`, `K_D`, `T1_characterization`
* Produces: `T5_fixed_point` proof.

- [ ] **Step 1: Append T5 theorem to the StructuralSufficiency section**
  Append the following code before the final `end StructuralSufficiency`:
  ```lean
  -- T5: Punto fijo de la suficiencia.
  -- Si kernel R = K_D, entonces R es suficiente, y cualquier R' estrictamente más gruesa
  -- (kernelSubset R R' y ¬ kernelSubset R' R) no es suficiente.
  theorem T5_fixed_point (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
      (R : S → Z) (hR_eq : ∀ x y, kernel R x y ↔ K_D K C_D x y) :
      kernelSubset R D ∧ ∀ (Z' : Type) (R' : S → Z'), (kernelSubset R R' ∧ ¬ kernelSubset R' R) → ¬ kernelSubset R' D := by
    constructor
    · intro x y hker
      have hKD := (hR_eq x y).mp hker
      exact (hA0 x y).mpr hKD
    · intro Z' R' ⟨h_coarser, h_not_finer⟩ h_sufficient'
      apply h_not_finer
      intro x y hker'
      have hD := h_sufficient' x y hker'
      have hKD := (hA0 x y).mp hD
      exact (hR_eq x y).mpr hKD
  ```
- [ ] **Step 2: Run lake build to verify it compiles**
  Run: `cd takt-formal && lake build`
  Expected: Success.
- [ ] **Step 3: Commit**
  Run: `git add takt-formal/TaktFormal/StructuralSufficiency.lean && git commit -m "proof(ST-015): formalize T5 (fixed point of sufficiency)"`

---

### Task 5: Main Module Integration and Final Verification

**Files:**
* Modify: [takt-formal/TaktFormal.lean](takt-formal/TaktFormal.lean)

**Interfaces:**
* Consumes: `TaktFormal.StructuralSufficiency`
* Produces: Clean lake build containing all proofs.

- [ ] **Step 1: Add import to TaktFormal.lean**
  Modify [takt-formal/TaktFormal.lean](takt-formal/TaktFormal.lean) to import `TaktFormal.StructuralSufficiency`.
  ```diff
  --- a/takt-formal/TaktFormal.lean
  +++ b/takt-formal/TaktFormal.lean
  @@ -15,4 +15,5 @@
   import TaktFormal.ExternalContract
   import TaktFormal.RT001
   import TaktFormal.RT002
   import TaktFormal.RT003
   import TaktFormal.RT004
  +import TaktFormal.StructuralSufficiency
  ```
- [ ] **Step 2: Run full build and ensure zero errors or warnings**
  Run: `cd takt-formal && lake build`
  Expected: Successful compilation with no errors.
- [ ] **Step 3: Commit and verify**
  Run: `git add takt-formal/TaktFormal.lean && git commit -m "feat: integrate StructuralSufficiency in TaktFormal main module"`
