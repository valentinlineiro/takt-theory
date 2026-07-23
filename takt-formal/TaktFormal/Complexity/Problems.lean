/--
Module: TaktFormal.Complexity.Problems
Depends on: TaktFormal.DetectorEvolution, TaktFormal.CostOptimization
Exports: DetReachProblem, OptEvsiPathProblem, MinEnrichProblem
-/

import TaktFormal.DetectorEvolution
import TaktFormal.CostOptimization

namespace TaktFormal
namespace Complexity

section Problems

variable {C : Type}

/-- Problem 1: DET-REACH --/
def DetReachProblem (d1 d2 : Detector C) (e : Enrichment C) : Prop :=
  phi d1 e = d2

/-- Problem 2: OPT-EVSI-PATH --/
def OptEvsiPathProblem (d0 d_target : Detector C) (maxCost : Nat) : Prop :=
  d0.progressMeasure ≤ maxCost

/-- Problem 4: MIN-ENRICH --/
def MinEnrichProblem (numCaps numEnrichments : Nat) (costBound : Nat) : Prop :=
  numCaps ≤ numEnrichments ∧ costBound > 0

end Problems
end Complexity
end TaktFormal
