import TaktFormal.Morphism.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- The relation induced on R.Rep by the cost functional evaluation:
    a ≤_c b ↔ c(a) ≤_L c(b). -/
def OrdinalRelation (cf : CostFunctional R L) (a b : R.Rep) : Prop :=
  L.le (cf.eval a) (cf.eval b)

theorem ordinal_refl (cf : CostFunctional R L) (a : R.Rep) : OrdinalRelation cf a a :=
  L.le_refl (cf.eval a)

theorem ordinal_trans (cf : CostFunctional R L) {a b c : R.Rep}
    (h1 : OrdinalRelation cf a b) (h2 : OrdinalRelation cf b c) :
    OrdinalRelation cf a c :=
  L.le_trans h1 h2

/-- The induced preorder on R.Rep from the cost space and functional evaluation. -/
def InducedPreorder (cf : CostFunctional R L) : RepresentationSpace where
  Rep := R.Rep
  le := OrdinalRelation cf
  le_refl := ordinal_refl cf
  le_trans := @ordinal_trans R L cf

/-- The ordinal morphism Ψ maps a cost functional to its induced preorder structure. -/
def OrdinalMorphism (R : RepresentationSpace) (L : CostSpace) :
    CostDerivedMorphism R L RepresentationSpace where
  eval := fun cf => InducedPreorder cf
