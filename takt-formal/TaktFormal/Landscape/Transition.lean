import TaktFormal.Landscape.Basic
import TaktFormal.Landscape.Cover

/-- A Transition System over an arbitrary type `X` is a relation `to`. -/
structure TransitionSystem (X : Type) where
  to : X → X → Prop

/-- A Trajectory in a transition system: a sequence of transitions. -/
inductive Trajectory {X : Type} (T : TransitionSystem X) : List X → Type where
  | nil : Trajectory T []
  | single : ∀ x, Trajectory T [x]
  | step : ∀ x y rest, T.to x y → Trajectory T (y :: rest) → Trajectory T (x :: y :: rest)

/-- Forward Neighborhood. -/
def ForwardNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  T.to x y

/-- Backward Neighborhood. -/
def BackwardNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  T.to y x

/-- Symmetric Neighborhood. -/
def SymmetricNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  ForwardNeighborhood T x y ∨ BackwardNeighborhood T x y

/-- Canonical cover transition system over a landscape `L`. -/
def CanonicalCoverTransitionSystem (L : AbstractLandscape) : TransitionSystem L.R.Rep where
  to := IsCover L

/-- Theorem: Symmetric neighborhood in the canonical cover transition system
    corresponds to split or merge cover relation. -/
theorem symmetric_neighborhood_cover (L : AbstractLandscape) (R1 R2 : L.R.Rep) :
    SymmetricNeighborhood (CanonicalCoverTransitionSystem L) R1 R2 ↔ IsCover L R1 R2 ∨ IsCover L R2 R1 := by
  constructor
  · intro h
    cases h with
    | inl h_fwd => exact Or.inl h_fwd
    | inr h_bwd => exact Or.inr h_bwd
  · intro h
    cases h with
    | inl h_fwd => exact Or.inl h_fwd
    | inr h_bwd => exact Or.inr h_bwd
