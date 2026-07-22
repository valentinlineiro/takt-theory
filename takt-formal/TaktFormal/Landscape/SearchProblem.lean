import TaktFormal.Landscape.Transition
import TaktFormal.Landscape.PathCost

/-- A preference relation is a preorder over trajectories. -/
structure PreferenceRelation (X : Type) (T : TransitionSystem X) where
  le : {l1 l2 : List X} → Trajectory T l1 → Trajectory T l2 → Prop
  refl : ∀ {l} (h : Trajectory T l), le h h
  trans : ∀ {l1 l2 l3} (h1 : Trajectory T l1) (h2 : Trajectory T l2) (h3 : Trajectory T l3), le h1 h2 → le h2 h3 → le h1 h3

/-- A Search Problem over a transition system. -/
structure SearchProblem (X : Type) where
  T : TransitionSystem X
  I : X → Prop
  A : X → Prop
  Pref : PreferenceRelation X T

namespace SearchProblem

variable {X : Type} (P : SearchProblem X)

/-- Auxiliary helper to compute the last state of a non-empty list. -/
def getLastState {Y : Type} (default : Y) : List Y → Y
  | [] => default
  | y :: rest => getLastState y rest

/-- A trajectory is a solution if it starts in I and ends in A. -/
def IsSolution (l : List X) (_h : Trajectory P.T l) : Prop :=
  match l with
  | [] => False
  | x :: rest =>
      P.I x ∧
      P.A (getLastState x rest)

/-- A search problem is feasible if a solution exists. -/
def IsFeasible : Prop :=
  ∃ (l : List X) (h : Trajectory P.T l), IsSolution P l h

/-- A solution is optimal if it is preferred over all other solutions. -/
def IsOptimalSolution (l : List X) (h : Trajectory P.T l) (_h_sol : IsSolution P l h) : Prop :=
  ∀ l' (h' : Trajectory P.T l') (_h'_sol : IsSolution P l' h'),
    P.Pref.le h h'

/-- Abstract reachability relation: reflexive-transitive closure of transition. -/
inductive Reachable (T : TransitionSystem X) : X → X → Prop where
  | refl : ∀ x, Reachable T x x
  | step : ∀ x y z, T.to x y → Reachable T y z → Reachable T x z

/-- A state x is a Dead End if no state in A is reachable from it. -/
def IsDeadEnd (x : X) : Prop :=
  ¬ P.A x ∧ ∀ y, Reachable P.T x y → ¬ P.A y

/-- Local search preference relation over steps. -/
def LocalStepPreference (_T : TransitionSystem X) := X → X → Prop

/-- A state x is a Local Trap under a local preference relation if it is not accepted,
    but all outgoing transitions are not locally preferred. -/
def IsLocalTrap (PrefLocal : LocalStepPreference P.T) (x : X) : Prop :=
  ¬ P.A x ∧ ∀ y, P.T.to x y → ¬ PrefLocal x y

end SearchProblem
