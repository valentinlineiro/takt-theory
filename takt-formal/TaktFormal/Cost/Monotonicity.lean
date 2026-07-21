import TaktFormal.Representation.Order
import TaktFormal.Cost.Poset

open Kernel

/-- Hipótesis 2.2 (C0 - Cost Monotonicity): refinamiento incremental -> incremento de coste. -/
def C0 {S L : Type} [PartialOrder L] (c : ∀ {Z : Type}, (S → Z) → L) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), kernelSubset R2 R1 → c R1 ≤ c R2

/-- Hipótesis 2.3 (C0' - Strict Monotonicity): refinamiento estricto -> incremento estricto de coste. -/
def C0' {S L : Type} [PartialOrder L] (c : ∀ {Z : Type}, (S → Z) → L) : Prop :=
  ∀ {Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2), (kernelSubset R2 R1 ∧ ¬ kernelSubset R1 R2) → c R1 < c R2
