import TaktFormal.Kernel.Decision
import TaktFormal.Kernel.Ordinal

variable {R : RepresentationSpace} {L : CostSpace}

/-- If two cost functionals induce extensionally equivalent ordinal preorders,
    then they yield extensionally equivalent sets of optimal representations. -/
theorem ordinal_equiv_implies_optimal_equiv (cf1 cf2 : CostFunctional R L)
    (h_ord : RelEquiv (OrdinalRelation cf1) (OrdinalRelation cf2)) :
    SetEquiv (IsOptimal cf1) (IsOptimal cf2) := by
  intro r
  constructor
  · intro h_opt1 other
    have h_rel1 := h_opt1 other
    exact (h_ord r other).mp h_rel1
  · intro h_opt2 other
    have h_rel2 := h_opt2 other
    exact (h_ord r other).mpr h_rel2

/-- If two cost functionals are ordinally equivalent (≡_Ψ),
    then they are decisionally equivalent (≡_Φ). -/
theorem ordinal_kernel_implies_decision_kernel (cf1 cf2 : CostFunctional R L)
    (h : OrdinalKernel cf1 cf2) : DecisionKernel cf1 cf2 := by
  dsimp [DecisionKernel, MorphismKernel]
  dsimp [OrdinalKernel, MorphismKernel] at h
  exact ordinal_equiv_implies_optimal_equiv cf1 cf2 h
