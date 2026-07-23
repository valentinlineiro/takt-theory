import TaktFormal.DetectorEvolution

/-!
Module: TaktFormal.Probabilistic.SoftDetector
Depends on: TaktFormal.DetectorEvolution
Exports: SoftDetector, stochastic_margin
-/

namespace TaktFormal
namespace Probabilistic

section SoftDetector

variable {C : Type}

/-- Soft Detector with confidence score in [0, 1] --/
structure SoftDetector (C : Type) where
  id : String
  confidenceScore : Nat -- Scaled 0 to 100 for Nat arithmetic
  capabilities : C → Prop

/-- Stochastic Margin --/
def stochastic_margin (sd : SoftDetector C) : Nat :=
  sd.confidenceScore

end SoftDetector
end Probabilistic
end TaktFormal
