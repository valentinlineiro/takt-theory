import TaktFormal.DetectorEvolution
import TaktFormal.Composition.Basic

/-!
Module: TaktFormal.Categorical.Basic
Depends on: TaktFormal.DetectorEvolution, TaktFormal.Composition.Basic
Exports: GovDetObj, GovDetHom, govdet_comp, govdet_id, govdet_assoc, govdet_id_left, govdet_id_right
-/

namespace TaktFormal
namespace Categorical

section Basic

variable {C : Type}

/-- Objects of category GovDet are sound detectors --/
def GovDetObj (C : Type) := Detector C

/-- Morphisms in GovDet are valid enrichments between detectors --/
def GovDetHom (C : Type) := Enrichment C

/-- Composition of morphisms in GovDet --/
def govdet_comp (e1 e2 : Enrichment C) : Enrichment C :=
  { id := e1.id ++ "∘" ++ e2.id,
    targetCapability := e1.targetCapability,
    preservesSoundness := e1.preservesSoundness && e2.preservesSoundness }

/-- Identity morphism in GovDet --/
def govdet_id (dummyCap : C) : Enrichment C := idEnrichment dummyCap

/-- Theorem V-C.1.1a: Associativity of composition in GovDet --/
theorem govdet_assoc (e1 e2 e3 : Enrichment C) :
    (govdet_comp (govdet_comp e1 e2) e3).preservesSoundness =
    (govdet_comp e1 (govdet_comp e2 e3)).preservesSoundness := by
  dsimp [govdet_comp]
  rw [Bool.and_assoc]

/-- Theorem V-C.1.1b: Left Identity law --/
theorem govdet_id_left (e : Enrichment C) (dummyCap : C) (he : ValidEnrichment e) :
    (govdet_comp (govdet_id dummyCap) e).preservesSoundness = e.preservesSoundness := by
  dsimp [govdet_comp, govdet_id, idEnrichment, ValidEnrichment] at *
  rw [he]
  rfl

/-- Theorem V-C.1.1c: Right Identity law --/
theorem govdet_id_right (e : Enrichment C) (dummyCap : C) (he : ValidEnrichment e) :
    (govdet_comp e (govdet_id dummyCap)).preservesSoundness = e.preservesSoundness := by
  dsimp [govdet_comp, govdet_id, idEnrichment, ValidEnrichment] at *
  rw [he]
  rfl

end Basic
end Categorical
end TaktFormal
