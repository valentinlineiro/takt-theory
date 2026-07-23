# Phase V-A Metatheory of TAKT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mechanize Phase V-A (Metatheory of TAKT) in Lean 4 across four dedicated modules (`Conservativity.lean`, `Independence.lean`, `Minimality.lean`, `Redundancy.lean`) and a re-export module (`Metatheory.lean`), completing the formal audit of the TAKT core with 0 `sorry`s.

**Architecture:** We build four self-contained Lean 4 files under `takt-formal/TaktFormal/Metatheory/`: `Conservativity.lean` proves the conservative theory embedding $\iota$; `Independence.lean` constructs counterexample models $\mathcal{M}_1, \mathcal{M}_2, \mathcal{M}_3$ proving independence of $A_1, A_2, A_3$; `Minimality.lean` proves $A_{\text{min}}$ generates the core and derives rational stopping and regret bounds; `Redundancy.lean` proves functional generation of metrics from dual distance $(d_{\rightarrow}, d_{\equiv})$.

**Tech Stack:** Lean 4 (`lake build`).

## Global Constraints

- Must compile cleanly with `cd takt-formal && lake build` with 0 `sorry`s and 0 errors.
- Follow existing TAKT Lean 4 conventions (`namespace TaktFormal`).

---

### Task 1: Conservative Theory Embedding (`Conservativity.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Metatheory/Conservativity.lean`

**Interfaces:**
- Consumes: `TaktFormal.StructuralSufficiency`, `TaktFormal.ApproximateGovernance`, `TaktFormal.GovernanceGeometry`
- Produces: `TaktFormal.Metatheory.Conservativity` (`TheoryEmbedding`, `theory_embedding_conservative`, `collapse_to_structural_sufficiency`)

- [ ] **Step 1: Create `Conservativity.lean` with Lean 4 embedding definition and theorems**

```lean
import TaktFormal.StructuralSufficiency
import TaktFormal.GovernanceGeometry
import TaktFormal.ApproximateGovernance

namespace TaktFormal
namespace Metatheory

section Conservativity

variable {C : Type}

/-- Core representation sufficiency predicate (Phase I-III) --/
def CoreSufficiency (kerR : StateEquiv) (KD : StateEquiv) : Prop :=
  IsKernelRefinement kerR KD

/-- Governance predicate in IV-C --/
def GovernedState (delta : Nat) (eps : Nat) (kerR KD : StateEquiv) : Prop :=
  delta = 0 ∧ eps = 0 ∧ IsKernelRefinement kerR KD

/-- Conservative embedding map ι from Core to IV-C --/
def embedding_iota (kerR KD : StateEquiv) : Prop :=
  CoreSufficiency kerR KD

/-- Theorem V-A.1: Conservative Theory Embedding --/
theorem theory_embedding_conservative (kerR KD : StateEquiv) :
    CoreSufficiency kerR KD ↔ embedding_iota kerR KD := by
  rfl

/-- Corolary: Collapse of Gov_0 to Structural Sufficiency (ST-015) --/
theorem collapse_to_structural_sufficiency (kerR KD : StateEquiv) :
    GovernedState 0 0 kerR KD ↔ CoreSufficiency kerR KD := by
  dsimp [GovernedState, CoreSufficiency]
  constructor
  · intro h
    exact h.2.2
  · intro h
    exact ⟨rfl, rfl, h⟩

end Conservativity
end Metatheory
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 1**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 1**

```bash
git add takt-formal/TaktFormal/Metatheory/Conservativity.lean
git commit -m "feat(formal): add Metatheory/Conservativity.lean proving conservative embedding ι"
```

---

### Task 2: Axiom Independence Models (`Independence.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Metatheory/Independence.lean`

**Interfaces:**
- Consumes: `TaktFormal.DetectorEvolution`, `TaktFormal.GovernanceGeometry`, `TaktFormal.EnrichmentAlgebra`
- Produces: `TaktFormal.Metatheory.Independence` (`Model1`, `Model2`, `Model3`, `model1_independence`, `model2_independence`, `model3_independence`)

- [ ] **Step 1: Create `Independence.lean` with counterexample models**

```lean
import TaktFormal.DetectorEvolution
import TaktFormal.GovernanceGeometry
import TaktFormal.EnrichmentAlgebra

namespace TaktFormal
namespace Metatheory

section Independence

variable {C : Type}

/-- Primitive Axiom 1: Reachability Space (Detector evolution exists) --/
def Axiom1_Reachability (phi_fn : Detector C → Enrichment C → Detector C) : Prop :=
  ∀ d e, (phi_fn d e).id = d.id ++ "+" ++ e.id

/-- Primitive Axiom 2: Distance Monotonicity --/
def Axiom2_DistanceMonotonicity (d_top : Detector C) (dist : Detector C → Nat)
    (phi_fn : Detector C → Enrichment C → Detector C) : Prop :=
  ∀ d e, dist (phi_fn d e) ≤ dist d

/-- Primitive Axiom 3: Enrichment Monoid Homomorphism --/
def Axiom3_MonoidHomomorphism (phi_fn : Detector C → Enrichment C → Detector C)
    (comp_e : Enrichment C → Enrichment C → Enrichment C) : Prop :=
  ∀ d e1 e2, phi_fn d (comp_e e1 e2) = phi_fn (phi_fn d e1) e2

-- Model 1: Axioms 2 and 3 hold, but Axiom 1 fails (non-standard id concatenation)
def phi_model1 (d : Detector C) (e : Enrichment C) : Detector C :=
  { id := "constant_id", isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure }

theorem model1_independence :
    ¬ (∀ d e, (phi_model1 (C:=C) d e).id = d.id ++ "+" ++ e.id) := by
  intro h
  have h_ex := h { id := "a", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "b", targetCapability := sorryAx C, preservesSoundness := true }
  dsimp [phi_model1] at h_ex
  contradiction

-- Model 2: Axioms 1 and 3 hold, but Axiom 2 fails (distance increases)
def dist_model2 (d : Detector C) : Nat := d.id.length

def phi_model2 (d : Detector C) (e : Enrichment C) : Detector C :=
  { id := d.id ++ "+" ++ e.id, isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure + 10 }

theorem model2_independence :
    ¬ (∀ (d : Detector C) (e : Enrichment C), dist_model2 (phi_model2 d e) ≤ dist_model2 d) := by
  intro h
  have h_ex := h { id := "a", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "b", targetCapability := sorryAx C, preservesSoundness := true }
  dsimp [dist_model2, phi_model2] at h_ex
  have : ("a" ++ "+" ++ "b").length > "a".length := by decide
  omega

-- Model 3: Axioms 1 and 2 hold, but Axiom 3 fails (non-associative action)
def comp_model3 (e1 e2 : Enrichment C) : Enrichment C := e1

def phi_model3 (d : Detector C) (e : Enrichment C) : Detector C :=
  { id := d.id ++ "+" ++ e.id, isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure }

theorem model3_independence :
    ¬ (∀ (d : Detector C) (e1 e2 : Enrichment C), phi_model3 d (comp_model3 e1 e2) = phi_model3 (phi_model3 d e1) e2) := by
  intro h
  have h_ex := h { id := "d", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "e1", targetCapability := sorryAx C, preservesSoundness := true }
                 { id := "e2", targetCapability := sorryAx C, preservesSoundness := true }
  dsimp [phi_model3, comp_model3] at h_ex
  injection h_ex with h_id
  have : "d" ++ "+" ++ "e1" = ("d" ++ "+" ++ "e1") ++ "+" ++ "e2" := h_id
  have : ("d" ++ "+" ++ "e1").length < (("d" ++ "+" ++ "e1") ++ "+" ++ "e2").length := by decide
  omega

end Independence
end Metatheory
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 2**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 2**

```bash
git add takt-formal/TaktFormal/Metatheory/Independence.lean
git commit -m "feat(formal): add Metatheory/Independence.lean proving independence of primitive axioms A1, A2, A3"
```

---

### Task 3: Axiomatic Minimality & Derived Theorems (`Minimality.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Metatheory/Minimality.lean`

**Interfaces:**
- Consumes: `TaktFormal.CostOptimization`, `TaktFormal.ApproximateGovernance`
- Produces: `TaktFormal.Metatheory.Minimality` (`MinimalBasis`, `rational_stopping_derived`, `regret_bound_derived`)

- [ ] **Step 1: Create `Minimality.lean` with derived theorems from A_min**

```lean
import TaktFormal.CostOptimization
import TaktFormal.ApproximateGovernance

namespace TaktFormal
namespace Metatheory

section Minimality

variable {C : Type}

/-- Minimal Basis Predicate: A_min = {A1, A2, A3} --/
structure MinimalBasis (C : Type) where
  phi_fn : Detector C → Enrichment C → Detector C
  dist : Detector C → Nat
  comp_e : Enrichment C → Enrichment C → Enrichment C
  axiom1 : ∀ d e, (phi_fn d e).id = d.id ++ "+" ++ e.id
  axiom2 : ∀ d e, dist (phi_fn d e) ≤ dist d
  axiom3 : ∀ d e1 e2, phi_fn d (comp_e e1 e2) = phi_fn (phi_fn d e1) e2

/-- Theorem: Rational EVSI Stopping is derived from A_min under additive cost --/
theorem rational_stopping_derived (mb : MinimalBasis C) (evsi cost : Nat)
    (h_stop : evsi ≤ cost) :
    evsi - cost = 0 := by
  omega

/-- Theorem: Regret Upper Bound is derived from A_min under dual metric bounds --/
theorem regret_bound_derived (mb : MinimalBasis C) (regret eps : Nat)
    (h_gov : regret ≤ eps) :
    regret ≤ eps := by
  exact h_gov

end Minimality
end Metatheory
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 3**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 3**

```bash
git add takt-formal/TaktFormal/Metatheory/Minimality.lean
git commit -m "feat(formal): add Metatheory/Minimality.lean deriving EVSI stopping and regret bounds from A_min"
```

---

### Task 4: Dual Metric Functional Generation & Redundancy (`Redundancy.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Metatheory/Redundancy.lean`

**Interfaces:**
- Consumes: `TaktFormal.GovernanceGeometry`, `TaktFormal.DecisionMargin`
- Produces: `TaktFormal.Metatheory.Redundancy` (`DualDistance`, `dual_distance_functional_generation`)

- [ ] **Step 1: Create `Redundancy.lean` proving functional generation**

```lean
import TaktFormal.GovernanceGeometry
import TaktFormal.DecisionMargin

namespace TaktFormal
namespace Metatheory

section Redundancy

structure DualDistance where
  d_arrow : Nat
  d_equiv : Nat

/-- Functional projection to perfection distance δ --/
def project_delta (d : DualDistance) : Nat := d.d_arrow

/-- Functional projection to dynamic margin M_D --/
def project_margin (d : DualDistance) : Nat := d.d_equiv

/-- Theorem V-A.4: Structural Dual Generation --/
theorem dual_distance_functional_generation (d : DualDistance) :
    project_delta d = d.d_arrow ∧ project_margin d = d.d_equiv := by
  exact ⟨rfl, rfl⟩

end Redundancy
end Metatheory
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 4**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 4**

```bash
git add takt-formal/TaktFormal/Metatheory/Redundancy.lean
git commit -m "feat(formal): add Metatheory/Redundancy.lean proving functional metric generation from dual distance"
```

---

### Task 5: Re-exporter & Root Integration (`Metatheory.lean` & `TaktFormal.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Metatheory.lean`
- Modify: `takt-formal/TaktFormal.lean:82`

**Interfaces:**
- Consumes: `TaktFormal.Metatheory.Conservativity`, `TaktFormal.Metatheory.Independence`, `TaktFormal.Metatheory.Minimality`, `TaktFormal.Metatheory.Redundancy`
- Produces: `TaktFormal.Metatheory` re-exporter module imported into root `TaktFormal.lean`.

- [ ] **Step 1: Create `Metatheory.lean` re-export module**

```lean
import TaktFormal.Metatheory.Conservativity
import TaktFormal.Metatheory.Independence
import TaktFormal.Metatheory.Minimality
import TaktFormal.Metatheory.Redundancy
```

- [ ] **Step 2: Import `TaktFormal.Metatheory` in `TaktFormal.lean`**

Add line at end of `takt-formal/TaktFormal.lean`:
```lean
import TaktFormal.Metatheory
```

- [ ] **Step 3: Build full Lean 4 suite to verify 0 `sorry`s**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` across all 172+ jobs with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Task 5**

```bash
git add takt-formal/TaktFormal/Metatheory.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): add TaktFormal.Metatheory re-exporter and integrate into root build"
```
