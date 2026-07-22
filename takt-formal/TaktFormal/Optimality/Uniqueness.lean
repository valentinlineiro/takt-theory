import TaktFormal.Kernel
import TaktFormal.StructuralSufficiency
import TaktFormal.Representation.Order
import TaktFormal.Representation.KernelEquivalence
import TaktFormal.Cost.Poset
import TaktFormal.Cost.Monotonicity
import TaktFormal.Optimality.Existence

open Kernel



/-- Teorema 3.1 (Unicidad Modulo Equivalencia): Bajo C0', el óptimo R* es equivalente en su núcleo a R_min. -/
theorem optimal_uniqueness_mod_equiv {S A C L : Type} [CostPartialOrder L]
    (K : C → S → S → Prop) (C_D : C → Prop) (D : S → A)
    (hK_equiv : ∀ c, Equivalence (K c)) (hA0 : Axiom0 K C_D D)
    (c : {Z : Type} → (S → Z) → L) (hc0' : C0' c) (_h_inv : CostInvariant c)
    {Z : Type} (R_star : S → Z) (h_opt : is_optimal c D R_star) :
    kernelEquiv R_star (R_min K C_D hK_equiv) := by
  have h_suff : kernelSubset R_star D := h_opt.1
  have h_min : kernelSubset R_star (R_min K C_D hK_equiv) :=
    R_min_is_minimum K C_D D hK_equiv hA0 R_star h_suff
  -- Supongamos por reducción al absurdo que no son equivalentes.
  have h_equiv_or_strict : kernelEquiv R_star (R_min K C_D hK_equiv) ∨
      (kernelSubset R_star (R_min K C_D hK_equiv) ∧ ¬ kernelSubset (R_min K C_D hK_equiv) R_star) := by
    dsimp [kernelEquiv]
    by_cases h_finer : kernelSubset (R_min K C_D hK_equiv) R_star
    · left
      exact ⟨h_min, h_finer⟩
    · right
      exact ⟨h_min, h_finer⟩
  rcases h_equiv_or_strict with heq | h_strict
  · exact heq
  · -- Caso estricto: c R_min < c R_star
    have h_lt : c (R_min K C_D hK_equiv) < c R_star := hc0' (R_min K C_D hK_equiv) R_star h_strict
    -- Pero R_star es óptima, por lo tanto c R_star ≤ c R_min
    have h_le : c R_star ≤ c (R_min K C_D hK_equiv) := h_opt.2 (R_min K C_D hK_equiv) (R_min_sufficient K C_D D hK_equiv hA0)
    -- Contradicción: c R_min < c R_star y c R_star ≤ c R_min
    have h_not_le : ¬ c R_star ≤ c (R_min K C_D hK_equiv) := by
      intro h_le_contra
      have h_lt_contra := (CostPartialOrder.lt_iff_le_not_le _ _).mp h_lt
      exact h_lt_contra.2 h_le_contra
    contradiction
