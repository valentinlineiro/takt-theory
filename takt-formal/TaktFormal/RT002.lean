import TaktFormal.DynamicSafetyContract

open DynamicSafetyContract
open DecisionMargin
open Coverage

namespace RT002

-- State Space: S = {0, 1, 2}
inductive S : Type where
  | s0 : S
  | s1 : S
  | s2 : S
  deriving DecidableEq

-- Decisions
def D : S → Nat
  | S.s0 => 0
  | S.s1 => 0
  | S.s2 => 1

-- Representation
def R : S → Int
  | S.s0 => -1
  | S.s1 => -1
  | S.s2 => 0

-- Metric d: s0 and s2 are far, but Transition graph allows s0 -> s2 directly
def d : S → S → Nat
  | S.s0, S.s0 => 0
  | S.s0, S.s1 => 1
  | S.s0, S.s2 => 5  -- High static distance
  | S.s1, S.s0 => 1
  | S.s1, S.s1 => 0
  | S.s1, S.s2 => 4
  | S.s2, S.s0 => 5
  | S.s2, S.s1 => 4
  | S.s2, S.s2 => 0

-- Dynamic Transition (step allowed)
def step_allowed : S → S → Prop
  | S.s0, S.s2 => True  -- Transition directly crosses decision boundary in 1 step!
  | _, _ => False

def all_S : List S := [S.s0, S.s1, S.s2]

def m_min : Nat := 4

theorem rt002_margin_satisfied :
  (match decisionMargin d D R all_S with
   | none => false
   | some m => m ≥ m_min) = true := by
  rfl

theorem rt002_transition_crosses_classes :
  ∃ (s1 s2 : S), step_allowed s1 s2 ∧ D s1 ≠ D s2 :=
  ⟨S.s0, S.s2, True.intro, by decide⟩

end RT002
