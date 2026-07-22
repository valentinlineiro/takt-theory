import TaktFormal.Morphism.Basic

variable {R : RepresentationSpace} {L : CostSpace}

/-- A representation `opt` is optimal under a cost functional if its cost is less than or
    equal to any other representation in the space. -/
def IsOptimal (cf : CostFunctional R L) (opt : R.Rep) : Prop :=
  ∀ r : R.Rep, L.le (cf.eval opt) (cf.eval r)

/-- The decision morphism Φ maps a cost functional to its set of optimal representations. -/
def DecisionMorphism (R : RepresentationSpace) (L : CostSpace) :
    CostDerivedMorphism R L (R.Rep → Prop) where
  eval := fun cf opt => IsOptimal cf opt

/-- Property: A cost functional has a unique optimal representation modulo kernel equivalence. -/
def HasUniqueOptimalModuloEquiv (cf : CostFunctional R L) : Prop :=
  ∃ opt : R.Rep, IsOptimal cf opt ∧
    ∀ other : R.Rep, IsOptimal cf other → KernelEquiv R opt other
