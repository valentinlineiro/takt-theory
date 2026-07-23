import TaktFormal.Complexity.Problems
import TaktFormal.RuntimeConvergence

/-!
Module: TaktFormal.Complexity.Runtime
Depends on: TaktFormal.Complexity.Problems, TaktFormal.RuntimeConvergence
Exports: online_verification_amortized_constant
-/

namespace TaktFormal
namespace Complexity

theorem online_verification_amortized_constant (numEvents : Nat) (costPerEvent : Nat)
    (hCost : costPerEvent = 1) : numEvents * costPerEvent = numEvents := by
  rw [hCost, Nat.mul_one]

end Complexity
end TaktFormal
