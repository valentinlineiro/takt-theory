import TaktFormal.Geometry.KernelRelations
import TaktFormal.Geometry.Factorization
import TaktFormal.Kernel.Quotient

variable {R : RepresentationSpace} {L : CostSpace}

/-- The canonical quotient map from the ordinal quotient space to the decisional quotient space.
    This shows that the decisional quotient factors through the ordinal quotient,
    meaning we can project from C/≡_Psi to C/≡_Phi. -/
def ordinalToDecisionalQuotientMap (R : RepresentationSpace) (L : CostSpace) :
    OrdinalCostQuotient R L → DecisionalCostQuotient R L :=
  quotientMap (OrdinalKernelSetoid R L) (DecisionKernelSetoid R L) (ordinal_kernel_implies_decision_kernel)
