import TaktFormal.Stability.Distance
import TaktFormal.Kernel.Decision

variable {R : RepresentationSpace} {L : MetricCostSpace}

/-- A representation `opt` has a stability margin under `cf` if it is optimal
    and any non-equivalent representation has a cost that is greater by at least `margin`. -/
def HasStabilityMargin (cf : CostFunctional R L.toCostSpace) (opt : R.Rep) (margin : L.Carrier) : Prop :=
  IsOptimal cf opt ∧
  (∀ alt : R.Rep, ¬ KernelEquiv R opt alt → L.le (L.add (cf.eval opt) margin) (cf.eval alt))

/-- The Quantitative Stability Theorem:
    If cf1 and cf2 are within eps proximity, cf2 is invariant under kernel equivalence,
    and cf1 has an optimal representation `opt` with a stability margin larger than or equal to
    eps + eps, then `opt` is also optimal under cf2. -/
theorem quantitative_stability_theorem {cf1 : CostFunctional R L.toCostSpace} {cf2 : CostFunctional R L.toCostSpace}
    {opt : R.Rep} {eps margin : L.Carrier}
    (h_prox : MetricProximity cf1 cf2 eps)
    (h_marg : HasStabilityMargin cf1 opt margin)
    (h_bound : L.le (L.add eps eps) margin)
    (h_inv : cf2.isInvariant) :
    IsOptimal cf2 opt := by
  intro r
  by_cases h_equiv : KernelEquiv R opt r
  · have h_equiv2 := h_inv h_equiv
    exact h_equiv2.1
  · have h_alt := h_marg.2 r h_equiv
    have h1_eval := h_prox.2 opt
    have h2_eval := h_prox.1 r
    have h_step1 := L.add_le_add_right (cf2.eval opt) (L.add (cf1.eval opt) eps) eps h1_eval
    rw [L.add_assoc (cf1.eval opt) eps eps] at h_step1
    have h_add_comm1 := L.add_comm (cf1.eval opt) (L.add eps eps)
    have h_add_comm2 := L.add_comm (cf1.eval opt) margin
    have h_step2 : L.le (L.add (cf1.eval opt) (L.add eps eps)) (L.add (cf1.eval opt) margin) := by
      rw [h_add_comm1, h_add_comm2]
      exact L.add_le_add_right (L.add eps eps) margin (cf1.eval opt) h_bound
    have h_step3 := L.le_trans h_step1 h_step2
    have h_step4 := L.le_trans h_step3 h_alt
    have h_step5 := L.le_trans h_step4 h2_eval
    exact L.add_le_cancel_right (cf2.eval opt) (cf2.eval r) eps h_step5
