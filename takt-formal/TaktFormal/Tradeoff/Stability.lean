import TaktFormal.Kernel
import TaktFormal.StructuralSufficiency
import TaktFormal.Representation.Order
import TaktFormal.Cost.Poset
import TaktFormal.Cost.Monotonicity
import TaktFormal.Cost.Distortion
import TaktFormal.Optimality.Existence

open Kernel

/-- Teorema 3.1 (Teorema de Estabilidad): Si la distorsión del coste está acotada por eps,
    el coste de cualquier representación óptima R* está acotado inferiormente por c R_min - eps. -/
theorem stability_theorem {S A C : Type} (K : C → S → S → Prop) (C_D : C → Prop) (D : S → A)
    (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
    (c : {Z : Type} → (S → Z) → Nat) (eps : Nat) (h_dist : DistortionBound c eps)
    {Z : Type} (R_star : S → Z) (h_opt : is_optimal c D R_star) :
    c (R_min K C_D hK_equiv) ≤ c R_star + eps := by
  have h_suff : kernelSubset R_star D := h_opt.1
  have h_min : kernelSubset R_star (R_min K C_D hK_equiv) :=
    R_min_is_minimum K C_D D hK_equiv hA0 R_star h_suff
  -- Aplicamos DistortionBound R_min R_star ya que R_min ⊑ R_star (finer)
  exact h_dist (R_min K C_D hK_equiv) R_star h_min
