import TaktFormal.Kernel

open Kernel

section CapabilityTheory

variable {S Z C : Type}
variable (K : C → S → S → Prop)

-- Una representación R provee una capacidad c si su kernel refina K c.
def provides (R : S → Z) (c : C) : Prop :=
  ∀ x y, kernel R x y → K c x y

-- C_R: conjunto de capacidades provistas por R.
def C_R (R : S → Z) (c : C) : Prop :=
  provides K R c

-- C_D: conjunto de capacidades requeridas por la decisión D.
variable (C_D : C → Prop)

-- G(D, R): gap de capacidades.
def G (R : S → Z) (c : C) : Prop :=
  C_D c ∧ ¬ provides K R c

-- T3: Correspondencia del gap (definicional en Lean).
theorem T3_correspondence (R : S → Z) (c : C) :
    G K C_D R c ↔ (C_D c ∧ ¬ ∀ x y, kernel R x y → K c x y) := by
  dsimp [G, provides]
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
  intro x y hker1
  exact h_prov2 x y (h_refine x y hker1)

end CapabilityTheory

section StructuralSufficiency

variable {S Z A C : Type}
variable (K : C → S → S → Prop)
variable (C_D : C → Prop)
variable (D : S → A)

namespace TaktQuot

inductive EqvGen {α : Type} (r : α → α → Prop) : α → α → Prop where
  | rel   : ∀ (x y : α), r x y → EqvGen r x y
  | refl  : ∀ (x : α), EqvGen r x x
  | symm  : ∀ (x y : α), EqvGen r x y → EqvGen r y x
  | trans : ∀ (x y z : α), EqvGen r x y → EqvGen r y z → EqvGen r x z

def eqv_lift {α : Type} (r : α → α → Prop) (x : α) : Quot r → Prop :=
  Quot.lift (fun y => EqvGen r x y) (by
    intro y1 y2 hr
    apply propext
    constructor
    · intro h
      exact EqvGen.trans x y1 y2 h (EqvGen.rel y1 y2 hr)
    · intro h
      exact EqvGen.trans x y2 y1 h (EqvGen.symm y1 y2 (EqvGen.rel y1 y2 hr))
  )

theorem quot_exact {α : Type} {r : α → α → Prop} {x y : α} (h : Quot.mk r x = Quot.mk r y) : EqvGen r x y := by
  have h_lift : eqv_lift r x (Quot.mk r x) = eqv_lift r x (Quot.mk r y) := by rw [h]
  have h_refl : eqv_lift r x (Quot.mk r x) := EqvGen.refl x
  rw [h_lift] at h_refl
  exact h_refl

-- Helper lemma to project EqvGen to an equivalence relation.
theorem eqvGen_of_equiv {α : Type} {r : α → α → Prop} (heqv : Equivalence r) {x y : α} (h : EqvGen r x y) : r x y := by
  induction h with
  | rel a b hr => exact hr
  | refl a => exact heqv.refl a
  | symm a b _ ih => exact heqv.symm ih
  | trans a b c _ _ ih1 ih2 => exact heqv.trans ih1 ih2

end TaktQuot

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
    kernelSubset R2 D := by
  intro x y hker
  exact h_sufficient x y (h_refine x y hker)

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

theorem K_D_equivalence (hK_equiv : ∀ c, Equivalence (K c)) : Equivalence (K_D K C_D) :=
  ⟨K_D_refl K C_D hK_equiv, K_D_symm K C_D hK_equiv, K_D_trans K C_D hK_equiv⟩

-- R_min cociente
def R_min (_hK_equiv : ∀ c, Equivalence (K c)) (s : S) : Quot (K_D K C_D) :=
  Quot.mk (K_D K C_D) s

theorem kernel_R_min_eq_K_D (hK_equiv : ∀ c, Equivalence (K c)) (x y : S) :
    kernel (R_min K C_D hK_equiv) x y ↔ K_D K C_D x y := by
  constructor
  · intro h
    dsimp [R_min, kernel] at h
    have hg := TaktQuot.quot_exact h
    have heqv : Equivalence (K_D K C_D) := K_D_equivalence K C_D hK_equiv
    exact TaktQuot.eqvGen_of_equiv heqv hg
  · intro h
    dsimp [R_min, kernel]
    exact Quot.sound h

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

-- T5: Punto fijo de la suficiencia.
-- Si kernel R = K_D, entonces R es suficiente, y cualquier R' estrictamente más gruesa
-- (kernelSubset R R' y ¬ kernelSubset R' R) no es suficiente.
theorem T5_fixed_point (_hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
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

end StructuralSufficiency

