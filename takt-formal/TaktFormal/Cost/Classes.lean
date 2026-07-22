import TaktFormal.Representation.Order
import TaktFormal.Representation.KernelEquivalence
import TaktFormal.Cost.Poset
import TaktFormal.Cost.Monotonicity


open Kernel

/-- Coste Antimonótono: refinamiento incremental -> disminución del coste. -/
def AntiMonotone {S L : Type} [CostPartialOrder L] (c : {Z : Type} → (S → Z) → L) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), kernelSubset R2 R1 → c R2 ≤ c R1

/-- Relación: Monotonía Estricta C0' implica Monotonía C0 (asumiendo CostInvariant). -/
theorem C0'_implies_C0 {S L : Type} [CostPartialOrder L] (c : {Z : Type} → (S → Z) → L)
    (h_inv : CostInvariant c) (hc0' : C0' c) : C0 c := by
  intro Z1 Z2 R1 R2 hr
  by_cases h_eq : kernelSubset R1 R2
  · have h_equiv : kernelEquiv R1 R2 := ⟨h_eq, hr⟩
    have h_c_eq := h_inv R1 R2 h_equiv
    rw [h_c_eq]
    exact CostPartialOrder.le_refl (c R2)
  · have h_strict : kernelSubset R2 R1 ∧ ¬ kernelSubset R1 R2 := ⟨hr, h_eq⟩
    have h_lt := hc0' R1 R2 h_strict
    have h_le := (CostPartialOrder.lt_iff_le_not_le (c R1) (c R2)).mp h_lt
    exact h_le.1
