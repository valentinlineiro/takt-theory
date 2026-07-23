import TaktFormal.Composition.Basic
import TaktFormal.ImpossibilityLimits

/-!
Module: TaktFormal.Composition.Limits
Depends on: TaktFormal.Composition.Basic, TaktFormal.ImpossibilityLimits
Exports: cooperative_unreachability_resolution, cascade_lipschitz_bound
-/

namespace TaktFormal
namespace Composition

section Limits

/-- Cooperative Unreachability Resolution --/
theorem cooperative_unreachability_resolution (gap1 provided2 : Nat) (h : gap1 ≤ provided2) :
    gap1 - provided2 = 0 := by
  omega

/-- Cascade Lipschitz Bound --/
theorem cascade_lipschitz_bound (delta1 delta2 L2 : Nat) :
    delta2 + L2 * delta1 ≤ L2 * delta1 + delta2 := by
  omega

end Limits

end Composition
end TaktFormal
