import TaktFormal.DynamicSafetyContract

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

theorem rt002_success : 
  d S.s0 S.s2 = 5 ∧ 
  D S.s0 ≠ D S.s2 ∧ 
  step_allowed S.s0 S.s2 := by
  refine ⟨rfl, ⟨by decide, True.intro⟩⟩

end RT002
