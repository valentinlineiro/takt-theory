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


