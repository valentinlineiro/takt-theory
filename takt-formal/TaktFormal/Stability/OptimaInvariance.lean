import TaktFormal.Kernel.Decision

variable {R : RepresentationSpace} {L : CostSpace}

/-- Optima invariance: if a representation `opt` is optimal under `cf1`,
    and `cf1` and `cf2` are decisionally equivalent (≡_Φ),
    then `opt` is also optimal under `cf2`. -/
theorem optima_invariance (cf1 cf2 : CostFunctional R L) (opt : R.Rep)
    (h_opt : IsOptimal cf1 opt) (h_equiv : DecisionKernel cf1 cf2) :
    IsOptimal cf2 opt := by
  dsimp [DecisionKernel, MorphismKernel] at h_equiv
  exact (h_equiv opt).mp h_opt
