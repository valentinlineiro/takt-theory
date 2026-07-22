import TaktFormal.Representation.Order
import TaktFormal.Cost.Poset
import TaktFormal.Cost.Monotonicity

open Kernel

/-- Definición 3.1: Distorsión de Orden acotada por eps (en costes Nat).
    Si R1 ⊑ R2 (finer), c R1 puede ser mayor que c R2, pero no por más de eps. -/
def DistortionBound {S : Type} (c : {Z : Type} → (S → Z) → Nat) (eps : Nat) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), kernelSubset R2 R1 → c R1 ≤ c R2 + eps

namespace Distortion

variable {S : Type}

/-- Proposición: Una distorsión de orden acotada por 0 es equivalente a C0 (para costes Nat). -/
theorem distortion_zero_iff_C0 (c : {Z : Type} → (S → Z) → Nat) :
    DistortionBound c 0 ↔ C0 c := by
  constructor
  · intro h Z1 Z2 R1 R2 hr
    have h_eps := h R1 R2 hr
    exact h_eps
  · intro h Z1 Z2 R1 R2 hr
    have h_C0 := h R1 R2 hr
    exact h_C0

end Distortion
