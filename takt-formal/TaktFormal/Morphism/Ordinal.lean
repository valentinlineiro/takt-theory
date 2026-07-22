import TaktFormal.Morphism.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- The relation induced on R.Rep by the cost functional evaluation:
    a ≤_c b ↔ c(a) ≤_L c(b). -/
def OrdinalRelation (cf : CostFunctional R L) (a b : R.Rep) : Prop :=
  L.le (cf.eval a) (cf.eval b)

/-- The ordinal morphism Ψ maps a cost functional to its induced preorder relation. -/
def OrdinalMorphism (R : RepresentationSpace) (L : CostSpace) :
    CostDerivedMorphism R L (R.Rep → R.Rep → Prop) where
  eval := fun cf => OrdinalRelation cf
