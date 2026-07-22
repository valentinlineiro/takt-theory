/-- Abstract representation space equipped with a preorder. -/
structure RepresentationSpace where
  Rep : Type
  le : Rep → Rep → Prop
  le_refl : ∀ r, le r r
  le_trans : ∀ {a b c}, le a b → le b c → le a c

/-- Kernel equivalence relation induced by the preorder. -/
def KernelEquiv (R : RepresentationSpace) (a b : R.Rep) : Prop :=
  R.le a b ∧ R.le b a

namespace KernelEquiv

variable {R : RepresentationSpace}

theorem refl (a : R.Rep) : KernelEquiv R a a :=
  ⟨R.le_refl a, R.le_refl a⟩

theorem symm {a b : R.Rep} (h : KernelEquiv R a b) : KernelEquiv R b a :=
  ⟨h.2, h.1⟩

theorem trans {a b c : R.Rep} (hab : KernelEquiv R a b) (hbc : KernelEquiv R b c) : KernelEquiv R a c :=
  ⟨R.le_trans hab.1 hbc.1, R.le_trans hbc.2 hab.2⟩

/-- Prove that KernelEquiv is an Equivalence relation. -/
theorem equivalence : Equivalence (KernelEquiv R) where
  refl := refl
  symm := symm
  trans := trans

end KernelEquiv

/-- Define the Setoid instance on R.Rep using the equivalence relation. -/
instance (R : RepresentationSpace) : Setoid R.Rep where
  r := KernelEquiv R
  iseqv := KernelEquiv.equivalence

/-- The abstract quotient space of representations modulo kernel equivalence. -/
def QuotientRepresentationSpace (R : RepresentationSpace) : Type :=
  Quotient (instSetoidRep R)
