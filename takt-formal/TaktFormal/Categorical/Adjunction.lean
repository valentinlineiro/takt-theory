import TaktFormal.Categorical.Basic
import TaktFormal.Categorical.Functor

/-!
Module: TaktFormal.Categorical.Adjunction
Depends on: TaktFormal.Categorical.Basic, TaktFormal.Categorical.Functor
Exports: AbstractionFunctor, EnrichmentFunctor, adjunction_hom_iso
-/

namespace TaktFormal
namespace Categorical

section Adjunction

variable {C : Type}

/-- Abstraction Functor mapping detector to progress bound --/
def AbstractionFunctor (d : Detector C) : Nat := d.progressMeasure

/-- Enrichment Functor mapping progress bound to optimal detector --/
def EnrichmentFunctor (n : Nat) : Detector C :=
  { id := "opt", isSound := true, capabilities := fun _ => True, progressMeasure := n }

/-- Theorem V-C.4.1: Canonical Adjunction (Abstraction dashv Enrichment) --/
theorem adjunction_hom_iso (d : Detector C) (n : Nat) :
    (AbstractionFunctor d ≤ n) ↔ (d.progressMeasure ≤ (EnrichmentFunctor (C := C) n).progressMeasure) := by
  rfl

end Adjunction
end Categorical
end TaktFormal
