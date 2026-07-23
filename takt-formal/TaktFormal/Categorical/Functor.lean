import TaktFormal.Categorical.Basic
import TaktFormal.StructuralSufficiency

/-!
Module: TaktFormal.Categorical.Functor
Depends on: TaktFormal.Categorical.Basic, TaktFormal.StructuralSufficiency
Exports: F_Rep, F_Dec, functor_id, functor_comp
-/

namespace TaktFormal
namespace Categorical

section Functor

variable {C : Type}

/-- Representation Functor mapping detector to progress --/
def F_Rep (d : Detector C) : Nat := d.progressMeasure

/-- Decision Functor mapping detector soundness --/
def F_Dec (d : Detector C) : Bool := d.isSound

/-- Theorem V-C.3.1a: Functorial Identity Preservation --/
theorem functor_id (d : Detector C) (dummyCap : C) :
    F_Dec (phi d (idEnrichment dummyCap)) = F_Dec d := by
  dsimp [F_Dec, phi, idEnrichment]
  exact Bool.and_true d.isSound

/-- Theorem V-C.3.1b: Functorial Composition Preservation --/
theorem functor_comp (d : Detector C) (e1 e2 : Enrichment C) (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    F_Dec (phi (phi d e1) e2) = F_Dec d := by
  dsimp [F_Dec, phi, ValidEnrichment] at *
  rw [he1, he2]
  simp

end Functor
end Categorical
end TaktFormal
