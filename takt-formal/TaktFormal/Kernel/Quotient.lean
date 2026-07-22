import TaktFormal.Kernel.Decision
import TaktFormal.Kernel.Ordinal
import TaktFormal.Kernel.Distortion

variable {R : RepresentationSpace} {L : CostSpace} {D : DistortionSpace}

/-- Define the Setoid instance on CostFunctional R L using the decisional kernel. -/
def DecisionKernelSetoid (R : RepresentationSpace) (L : CostSpace) :
    Setoid (CostFunctional R L) where
  r := DecisionKernel
  iseqv := DecisionKernel.equivalence

/-- Decisional quotient space of cost functionals C / ≡_Phi. -/
def DecisionalCostQuotient (R : RepresentationSpace) (L : CostSpace) : Type :=
  Quotient (DecisionKernelSetoid R L)

/-- Define the Setoid instance on CostFunctional R L using the ordinal kernel. -/
def OrdinalKernelSetoid (R : RepresentationSpace) (L : CostSpace) :
    Setoid (CostFunctional R L) where
  r := OrdinalKernel
  iseqv := OrdinalKernel.equivalence

/-- Ordinal/structural quotient space of cost functionals C / ≡_Psi. -/
def OrdinalCostQuotient (R : RepresentationSpace) (L : CostSpace) : Type :=
  Quotient (OrdinalKernelSetoid R L)

/-- Define the Setoid instance on CostFunctional R L using the distortion kernel. -/
def DistortionKernelSetoid (theta : DistortionMorphism R L D) :
    Setoid (CostFunctional R L) where
  r := DistortionKernel theta
  iseqv := DistortionKernel.equivalence theta

/-- Distortion/stability quotient space of cost functionals C / ≡_Theta. -/
def DistortionCostQuotient (theta : DistortionMorphism R L D) : Type :=
  Quotient (DistortionKernelSetoid theta)
