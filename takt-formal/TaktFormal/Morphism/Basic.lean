import TaktFormal.Representation.Preorder
import TaktFormal.Cost.Functional

universe u

/-- A cost-derived morphism wraps a projection from the space of cost functionals.
    It takes a cost functional and returns some structure `X` over the representation space. -/
structure CostDerivedMorphism (R : RepresentationSpace) (L : CostSpace) (X : Type u) where
  eval : CostFunctional R L → X
