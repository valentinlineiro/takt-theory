/-- Generic morphism kernel relation.
    Given a function `f : A → B` and an equivalence relation `eqv` on `B`,
    `MorphismKernel` defines `a1` and `a2` as equivalent if their images under `f` are equivalent. -/
def MorphismKernel {A B : Type} (f : A → B) (eqv : B → B → Prop) (a1 a2 : A) : Prop :=
  eqv (f a1) (f a2)

namespace MorphismKernel

variable {A B : Type} {f : A → B} {eqv : B → B → Prop}

theorem refl (heqv : Equivalence eqv) (a : A) : MorphismKernel f eqv a a :=
  heqv.refl (f a)

theorem symm (heqv : Equivalence eqv) {a1 a2 : A} (h : MorphismKernel f eqv a1 a2) : MorphismKernel f eqv a2 a1 :=
  heqv.symm h

theorem trans (heqv : Equivalence eqv) {a1 a2 a3 : A} (h1 : MorphismKernel f eqv a1 a2) (h2 : MorphismKernel f eqv a2 a3) :
    MorphismKernel f eqv a1 a3 :=
  heqv.trans h1 h2

/-- If the relation on B is an equivalence relation, the induced kernel relation on A is also an equivalence relation. -/
theorem equivalence (heqv : Equivalence eqv) : Equivalence (MorphismKernel f eqv) where
  refl := refl heqv
  symm := symm heqv
  trans := trans heqv

end MorphismKernel
