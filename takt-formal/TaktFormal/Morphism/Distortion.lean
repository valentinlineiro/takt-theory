import TaktFormal.Morphism.Basic

/-- Abstract distortion space containing elements representing distances or differences.
    Equipped with a preorder and a zero element (representing no distortion). -/
structure DistortionSpace where
  Carrier : Type
  le : Carrier → Carrier → Prop
  le_refl : ∀ d, le d d
  le_trans : ∀ {a b c}, le a b → le b c → le a c
  zero : Carrier
  zero_min : ∀ d, le zero d

/-- A distortion field on a representation space R.
    For any pair a, b where a ≤ b (a is coarser than b), it assigns a distortion value in D.Carrier. -/
structure DistortionField (R : RepresentationSpace) (D : DistortionSpace) where
  val : ∀ {a b : R.Rep}, R.le a b → D.Carrier
  global_bound : D.Carrier
  bound_valid : ∀ {a b : R.Rep} (h : R.le a b), D.le (val h) global_bound

/-- The distortion morphism Θ maps a cost functional to a distortion field. -/
def DistortionMorphism (R : RepresentationSpace) (L : CostSpace) (D : DistortionSpace) :=
  CostDerivedMorphism R L (DistortionField R D)
