import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.CostOptimization

/-!
Module: TaktFormal.Probabilistic.StochasticEVSI
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.CostOptimization
Exports: stochastic_evsi, stochastic_stopping_theorem
-/

namespace TaktFormal
namespace Probabilistic

section StochasticEVSI

/-- Stochastic EVSI expected value --/
def stochastic_evsi (expectedDelta cost : Nat) : Int :=
  (expectedDelta : Int) - (cost : Int)

/-- Theorem V-E.3.1: Stochastic EVSI Rational Stopping --/
theorem stochastic_stopping_theorem (expectedDelta cost : Nat)
    (h_stop : expectedDelta ≤ cost) :
    stochastic_evsi expectedDelta cost ≤ 0 := by
  dsimp [stochastic_evsi]
  omega

end StochasticEVSI
end Probabilistic
end TaktFormal
