import TaktFormal.Convergence.InfiniteTrajectory

namespace Convergence

variable {X : Type}

/-- Convergent Behavior: Stream eventually enters and remains in region `R`. -/
def IsConvergent (x : StateStream X) (R : X → Prop) : Prop :=
  ∃ N : Nat, ∀ k : Nat, k ≥ N → R (x k)

/-- Oscillatory Behavior: Stream is eventually periodic with period `p ≥ 1`. -/
def IsOscillatory (x : StateStream X) (p : Nat) : Prop :=
  p ≥ 1 ∧ ∃ N : Nat, ∀ k : Nat, k ≥ N → x (k + p) = x k

/-- Stationary Stream: Special case of Oscillation with period 1. -/
def IsStationary (x : StateStream X) : Prop :=
  IsOscillatory x 1

/-- Chaotic Exploration: Stream is bounded within `R` but never periodic. -/
def IsChaotic (x : StateStream X) (R : X → Prop) : Prop :=
  IsConvergent x R ∧ ∀ p : Nat, ¬ IsOscillatory x p

end Convergence
