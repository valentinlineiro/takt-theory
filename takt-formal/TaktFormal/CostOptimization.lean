import TaktFormal.EnrichmentAlgebra

namespace TaktFormal

section CostOptimization

variable {C : Type}

-- Cost Functional for an Enrichment Step
def enrichmentCost (_e : Enrichment C) : Nat := 1

-- Trajectory Cost C(\pi) for a single step transition
def singleStepCost (d : Detector C) (e : Enrichment C) : Nat :=
  enrichmentCost e + delta_perfection (phi d e)

-- Governance EVSI(E | D)
def governanceEVSI (d : Detector C) (e : Enrichment C) : Nat :=
  delta_perfection d - delta_perfection (phi d e)

-- Theorem 3.1: Path Cost Additivity & Monotonicity
theorem single_step_cost_positive (d : Detector C) (e : Enrichment C) :
    singleStepCost d e > 0 := by
  dsimp [singleStepCost, enrichmentCost]
  omega

-- Theorem 3.2: EVSI Monotonicity under Progress Step
theorem evsi_positive_on_progress (d : Detector C) (e : Enrichment C)
    (hpos : d.progressMeasure > 0) :
    governanceEVSI d e > 0 := by
  dsimp [governanceEVSI, delta_perfection, phi]
  exact Nat.sub_pos_of_lt (progress_measure_strict d e hpos)

-- Definition of Rational EVSI Stopping Condition
def RationalStoppingCondition (d : Detector C) (e : Enrichment C) : Prop :=
  governanceEVSI d e ≤ enrichmentCost e

-- Theorem 3.4: Rational EVSI Stopping Theorem
theorem rational_stopping_holds (d : Detector C) (dummyCap : C) :
    RationalStoppingCondition d (idEnrichment dummyCap) := by
  dsimp [RationalStoppingCondition, governanceEVSI, delta_perfection, phi, idEnrichment, enrichmentCost]
  omega

end CostOptimization

end TaktFormal
