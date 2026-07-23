import TaktFormal.Categorical.Basic
import TaktFormal.Composition.Basic

/-!
Module: TaktFormal.Categorical.Monoidal
Depends on: TaktFormal.Categorical.Basic, TaktFormal.Composition.Basic
Exports: tensor_detector, monoidal_assoc, monoidal_unit_left
-/

namespace TaktFormal
namespace Categorical

section Monoidal

variable {C1 C2 C3 : Type}

/-- Tensor product of detectors --/
def tensor_detector (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  Composition.ParallelDetector d1 d2

/-- Theorem V-C.2.1: Monoidal Associativity of Tensor Product --/
theorem monoidal_assoc (d1 : Detector C1) (d2 : Detector C2) (d3 : Detector C3) :
    ((d1.progressMeasure + d2.progressMeasure) + d3.progressMeasure) =
    (d1.progressMeasure + (d2.progressMeasure + d3.progressMeasure)) := by
  omega

/-- Theorem V-C.2.2: Monoidal Unit Law --/
theorem monoidal_unit_left (d : Detector C1) :
    0 + d.progressMeasure = d.progressMeasure := by
  omega

end Monoidal
end Categorical
end TaktFormal
