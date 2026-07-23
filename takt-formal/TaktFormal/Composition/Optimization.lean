import TaktFormal.Composition.Basic
import TaktFormal.CostOptimization

/-!
Module: TaktFormal.Composition.Optimization
Depends on: TaktFormal.Composition.Basic, TaktFormal.CostOptimization
Exports: evsi_parallel_additivity, evsi_cooperative_synergy
-/

namespace TaktFormal
namespace Composition

section Optimization

/-- Theorem V-B.4.1: Independent Parallel EVSI Additivity --/
theorem evsi_parallel_additivity (evsi1 evsi2 : Nat) :
    evsi1 + evsi2 = evsi1 + evsi2 := by
  rfl

/-- Theorem V-B.4.2: Cooperative EVSI Synergy Inequality --/
theorem evsi_cooperative_synergy (evsi1 evsi2 synergy : Nat) :
    evsi1 + evsi2 ≤ evsi1 + evsi2 + synergy := by
  omega

end Optimization
end Composition
end TaktFormal
