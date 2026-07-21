import TaktFormal.Kernel
import TaktFormal.StructuralSufficiency
import TaktFormal.Representation.Order
import TaktFormal.Cost.Monotonicity

open Kernel

/-- Teorema de Coincidencia (Theorem 2.1): Bajo C0, R_min es un óptimo global de costes. -/
theorem coincidence_theorem {S A C L : Type} [CostPartialOrder L]
    (K : C → S → S → Prop) (C_D : C → Prop) (D : S → A)
    (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
    (c : {Z : Type} → (S → Z) → L) (hc0 : C0 c)
    {Z : Type} (R : S → Z) (h_sufficient : kernelSubset R D) :
    c (R_min K C_D hK_equiv) ≤ c R := by
  have h_min : kernelSubset R (R_min K C_D hK_equiv) :=
    R_min_is_minimum K C_D D hK_equiv hA0 R h_sufficient
  exact hc0 (R_min K C_D hK_equiv) R h_min
