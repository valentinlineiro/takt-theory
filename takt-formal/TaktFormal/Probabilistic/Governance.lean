import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.ApproximateGovernance

/-!
Module: TaktFormal.Probabilistic.Governance
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.ApproximateGovernance
Exports: ProbabilisticGovernance, confidence_monotonicity
-/

namespace TaktFormal
namespace Probabilistic

section Governance

variable {C : Type}

/-- Probabilistic (eps, alpha)-Governance Predicate --/
def ProbabilisticGovernance (sd : SoftDetector C) (eps alpha : Nat) : Prop :=
  sd.confidenceScore ≥ alpha ∧ eps ≥ 0

/-- Theorem V-E.2.1: Confidence Monotonicity --/
theorem confidence_monotonicity (sd : SoftDetector C) (eps alpha1 alpha2 : Nat)
    (h_alpha : alpha1 ≤ alpha2) (h_gov : ProbabilisticGovernance sd eps alpha2) :
    ProbabilisticGovernance sd eps alpha1 := by
  dsimp [ProbabilisticGovernance] at *
  exact ⟨by omega, h_gov.2⟩

end Governance
end Probabilistic
end TaktFormal
