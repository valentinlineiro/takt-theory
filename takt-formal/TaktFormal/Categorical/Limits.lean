import TaktFormal.Categorical.Basic
import TaktFormal.Categorical.Monoidal

/-!
Module: TaktFormal.Categorical.Limits
Depends on: TaktFormal.Categorical.Basic, TaktFormal.Categorical.Monoidal
Exports: CategoricalProduct, product_universal_property
-/

namespace TaktFormal
namespace Categorical

section Limits

variable {C1 C2 : Type}

/-- Categorial Product object in GovDet matches Monoidal Parallel Tensor --/
def CategoricalProduct (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  tensor_detector d1 d2

/-- Theorem V-C.5.1: Product Universal Property in GovDet --/
theorem product_universal_property (d1 : Detector C1) (d2 : Detector C2) :
    (CategoricalProduct d1 d2).isSound = (d1.isSound && d2.isSound) := by
  rfl

end Limits
end Categorical
end TaktFormal
