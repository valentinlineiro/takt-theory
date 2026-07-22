import TaktFormal.Morphism.Decision
import TaktFormal.Kernel.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- Extensional equivalence of sets of optimal representations. -/
def SetEquiv (p1 p2 : R.Rep → Prop) : Prop :=
  ∀ r, p1 r ↔ p2 r

namespace SetEquiv

theorem refl (p : R.Rep → Prop) : SetEquiv p p :=
  fun _ => Iff.rfl

theorem symm {p1 p2 : R.Rep → Prop} (h : SetEquiv p1 p2) : SetEquiv p2 p1 :=
  fun r => (h r).symm

theorem trans {p1 p2 p3 : R.Rep → Prop} (h1 : SetEquiv p1 p2) (h2 : SetEquiv p2 p3) : SetEquiv p1 p3 :=
  fun r => (h1 r).trans (h2 r)

theorem equivalence : Equivalence (@SetEquiv R) where
  refl := refl
  symm := symm
  trans := trans

end SetEquiv

/-- The decisional kernel relation on cost functionals.
    Two cost functionals are equivalent if their DecisionMorphism outputs are extensionally equivalent. -/
def DecisionKernel (cf1 cf2 : CostFunctional R L) : Prop :=
  MorphismKernel (fun cf => (DecisionMorphism R L).eval cf) SetEquiv cf1 cf2

namespace DecisionKernel

/-- Prove that DecisionKernel is a valid equivalence relation. -/
theorem equivalence : Equivalence (@DecisionKernel R L) :=
  MorphismKernel.equivalence (f := fun cf => (DecisionMorphism R L).eval cf) SetEquiv.equivalence

end DecisionKernel
