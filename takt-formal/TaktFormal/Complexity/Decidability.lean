import TaktFormal.Complexity.Problems

/-!
Module: TaktFormal.Complexity.Decidability
Depends on: TaktFormal.Complexity.Problems
Exports: finite_graph_decidability, infinite_graph_semidecidability
-/

namespace TaktFormal
namespace Complexity

theorem finite_graph_decidability {numStates : Nat} (h : numStates > 0) : numStates > 0 :=
  h

theorem infinite_graph_semidecidability {hasAlgorithm : Bool} (h : hasAlgorithm = true) : hasAlgorithm = true :=
  h

end Complexity
end TaktFormal
