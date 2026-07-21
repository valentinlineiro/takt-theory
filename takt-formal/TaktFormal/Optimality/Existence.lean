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
  ∃ (Z_star : Type) (R_star : S → Z_star), kernelSubset R_star D ∧ ∀ {Z' : Type} (R' : S → Z'), kernelSubset R' D → c R_star ≤ c R'

/-- Proposición: A0-IV implica existencia de óptimo. -/
theorem optimal_exists {S A L : Type} [PartialOrder L] (D : S → A) (c : {Z : Type} → (S → Z) → L)
    (h_attain : RealizableCostAttainment D c) :
    ∃ (Z_star : Type) (R_star : S → Z_star), is_optimal c D R_star := by
  rcases h_attain with ⟨Z_star, R_star, h_suff, h_min⟩
  exact ⟨Z_star, R_star, h_suff, h_min⟩
