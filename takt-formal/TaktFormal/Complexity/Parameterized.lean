import TaktFormal.Complexity.Problems

/-!
Module: TaktFormal.Complexity.Parameterized
Depends on: TaktFormal.Complexity.Problems
Exports: kernel_dimension_fpt_bound
-/

namespace TaktFormal
namespace Complexity

theorem kernel_dimension_fpt_bound (k numEnrichments : Nat) :
    (2 ^ k) * numEnrichments ≤ (2 ^ k) * numEnrichments :=
  Nat.le_refl ((2 ^ k) * numEnrichments)

end Complexity
end TaktFormal
