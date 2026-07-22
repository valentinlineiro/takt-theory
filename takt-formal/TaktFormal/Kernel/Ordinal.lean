import TaktFormal.Morphism.Ordinal
import TaktFormal.Kernel.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- Equivalence of relations (extensional equivalence). -/
def RelEquiv (rel1 rel2 : R.Rep → R.Rep → Prop) : Prop :=
  ∀ r1 r2 : R.Rep, rel1 r1 r2 ↔ rel2 r1 r2

namespace RelEquiv

theorem refl (rel : R.Rep → R.Rep → Prop) : RelEquiv rel rel :=
  fun _ _ => Iff.rfl

theorem symm {rel1 rel2 : R.Rep → R.Rep → Prop} (h : RelEquiv rel1 rel2) : RelEquiv rel2 rel1 :=
  fun r1 r2 => (h r1 r2).symm

theorem trans {rel1 rel2 rel3 : R.Rep → R.Rep → Prop} (h1 : RelEquiv rel1 rel2) (h2 : RelEquiv rel2 rel3) :
    RelEquiv rel1 rel3 :=
  fun r1 r2 => (h1 r1 r2).trans (h2 r1 r2)

theorem equivalence : Equivalence (@RelEquiv R) where
  refl := refl
  symm := symm
  trans := trans

end RelEquiv

/-- The ordinal/structural kernel relation on cost functionals.
    Two cost functionals are equivalent if their OrdinalMorphism relations are extensionally equivalent. -/
def OrdinalKernel (cf1 cf2 : CostFunctional R L) : Prop :=
  MorphismKernel (fun cf => (OrdinalMorphism R L).eval cf) RelEquiv cf1 cf2

namespace OrdinalKernel

/-- Prove that OrdinalKernel is a valid equivalence relation. -/
theorem equivalence : Equivalence (@OrdinalKernel R L) :=
  MorphismKernel.equivalence (f := fun cf => (OrdinalMorphism R L).eval cf) RelEquiv.equivalence

end OrdinalKernel
