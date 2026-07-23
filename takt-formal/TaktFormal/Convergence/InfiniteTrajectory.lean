import TaktFormal.Landscape.Transition

/-- An Infinite Trajectory in a transition system `T` is a sequence `stream : Nat → X`
    such that every step `(stream k, stream (k+1))` is a valid transition in `T`. -/
structure InfiniteTrajectory {X : Type} (T : TransitionSystem X) where
  stream : Nat → X
  valid : ∀ k : Nat, T.to (stream k) (stream (k + 1))

/-- An Infinite State Stream (unconstrained by `T`, e.g., output of runSequence). -/
def StateStream (X : Type) := Nat → X
