import TaktFormal.Cost.Functional

/-- An Abstract Landscape is a preorder representation space equipped with a cost functional. -/
structure AbstractLandscape where
  R : RepresentationSpace
  L : CostSpace
  cf : CostFunctional R L
