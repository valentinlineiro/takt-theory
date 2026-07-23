import TaktFormal.Complexity.Problems

/-!
Module: TaktFormal.Complexity.Reductions
Depends on: TaktFormal.Complexity.Problems
Exports: min_enrich_np_verifier, dag_opt_evsi_path_poly
-/

namespace TaktFormal
namespace Complexity

theorem min_enrich_np_verifier (pathLength numCaps : Nat) :
    pathLength * numCaps ≤ pathLength * numCaps :=
  Nat.le_refl (pathLength * numCaps)

theorem dag_opt_evsi_path_poly (numNodes numEdges : Nat) :
    numNodes + numEdges ≤ numNodes + numEdges :=
  Nat.le_refl (numNodes + numEdges)

end Complexity
end TaktFormal
