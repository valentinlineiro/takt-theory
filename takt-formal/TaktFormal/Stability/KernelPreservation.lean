import TaktFormal.Geometry.KernelRelations
import TaktFormal.Stability.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- Structural preservation theorem:
    An ordinal-preserving perturbation (meaning cf1 and cf2 induce the same ordinal preorder)
    guarantees that the set of optimal representations is completely preserved. -/
theorem ordinal_preservation_implies_optima_preservation (cf1 cf2 : CostFunctional R L)
    (h_ord : OrdinalKernel cf1 cf2) : DecisionKernel cf1 cf2 :=
  ordinal_kernel_implies_decision_kernel cf1 cf2 h_ord
