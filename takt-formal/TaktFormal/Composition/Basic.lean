import TaktFormal.DetectorEvolution
import TaktFormal.GovernanceGeometry

/-!
Module: TaktFormal.Composition.Basic
Depends on: TaktFormal.DetectorEvolution, TaktFormal.GovernanceGeometry
Exports: ParallelDetector, CascadeDetector, parallel_phi, cascade_phi
-/

namespace TaktFormal
namespace Composition

section Basic

variable {C1 C2 : Type}

/-- Parallel composition of detectors (D1 ⊗ D2) --/
def ParallelDetector (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  { id := d1.id ++ "⊗" ++ d2.id,
    isSound := d1.isSound && d2.isSound,
    capabilities := fun c => d1.capabilities c.1 ∧ d2.capabilities c.2,
    progressMeasure := d1.progressMeasure + d2.progressMeasure }

/-- Cascade composition of detectors (D2 ∘ D1) --/
def CascadeDetector (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  { id := d2.id ++ "∘" ++ d1.id,
    isSound := d1.isSound && d2.isSound,
    capabilities := fun c => d1.capabilities c.1 ∨ d2.capabilities c.2,
    progressMeasure := d1.progressMeasure * d2.progressMeasure }

/-- Parallel evolution transition --/
def parallel_phi (d1 : Detector C1) (d2 : Detector C2) (e1 : Enrichment C1) (e2 : Enrichment C2) : Detector (C1 × C2) :=
  ParallelDetector (phi d1 e1) (phi d2 e2)

/-- Cascade evolution transition --/
def cascade_phi (d1 : Detector C1) (d2 : Detector C2) (e1 : Enrichment C1) (e2 : Enrichment C2) : Detector (C1 × C2) :=
  CascadeDetector (phi d1 e1) (phi d2 e2)

end Basic

end Composition
end TaktFormal
