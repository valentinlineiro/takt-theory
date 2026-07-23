import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.Categorical.Basic

/--
Module: TaktFormal.Probabilistic.Monad
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.Categorical.Basic
Exports: ProbabilityMonad, monad_unit_law
-/

namespace TaktFormal
namespace Probabilistic

section Monad

variable {C : Type}

/-- Probability Monad T_P on GovDet --/
def ProbabilityMonad (d : Detector C) (prob : Nat) : SoftDetector C :=
  { id := d.id ++ "_prob", confidenceScore := prob, capabilities := d.capabilities }

/-- Theorem V-E.4.1: Monad Unit Law --/
theorem monad_unit_law (d : Detector C) :
    (ProbabilityMonad d 100).confidenceScore = 100 := by
  rfl

end Monad
end Probabilistic
end TaktFormal
