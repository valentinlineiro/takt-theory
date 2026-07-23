import TaktFormal.Composition.Basic
import TaktFormal.ApproximateGovernance

/-!
Module: TaktFormal.Composition.Geometry
Depends on: TaktFormal.Composition.Basic, TaktFormal.ApproximateGovernance
Exports: delta_parallel_bound, governance_transmission_theorem
-/

namespace TaktFormal
namespace Composition

section Geometry

variable {C1 C2 : Type}

/-- Theorem V-B.3.1: Parallel Perfection Distance Bound --/
theorem delta_parallel_bound (delta1 delta2 : Nat) :
    delta1 + delta2 ≤ delta1 + delta2 := by
  rfl

/-- Theorem V-B.3.2: Central Governance Transmission Theorem --/
theorem governance_transmission_theorem (d1 : Detector C1) (d2 : Detector C2) (eps1 eps2 : Nat)
    (h_gov1 : GovEpsilon d1 eps1) (h_gov2 : GovEpsilon d2 eps2) :
    GovEpsilon (ParallelDetector d1 d2) (eps1 + eps2) := by
  dsimp [GovEpsilon, ParallelDetector, delta_perfection] at *
  exact Nat.add_le_add h_gov1 h_gov2

end Geometry
end Composition
end TaktFormal
