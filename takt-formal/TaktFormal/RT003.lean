import TaktFormal.DynamicSafetyContract

open DynamicSafetyContract
open DecisionMargin
open Coverage

namespace RT003

inductive S : Type where
  | s0 : S
  | s1 : S
  deriving DecidableEq

def D : S → Nat
  | S.s0 => 0
  | S.s1 => 1

def R : S → Int
  | S.s0 => 0
  | S.s1 => 1

def T : S → Prop
  | _ => True

def dist : S → S → Nat
  | S.s0, S.s0 => 0
  | S.s0, S.s1 => 5
  | S.s1, S.s0 => 5
  | S.s1, S.s1 => 0

def all_S : List S := [S.s0, S.s1]

-- Non-aligned policy
def π_bad : Int → Nat
  | _ => 1  -- Constantly 1, so it fails on s0 where D s0 = 0

def c_bad : SafetyContract S Int Nat := {
  R := R
  D := D
  π := π_bad
  T := T
  all_S := all_S
  dist := dist
  m_min := 2
}

theorem rt003_coverage_satisfied : fiber_coverage c_bad.R c_bad.D c_bad.T := by
  intro x
  cases x
  · exact ⟨S.s0, True.intro, rfl, rfl⟩
  · exact ⟨S.s1, True.intro, rfl, rfl⟩

theorem rt003_margin_satisfied :
  (match decisionMargin c_bad.dist c_bad.D c_bad.R c_bad.all_S with
   | none => false
   | some m => m ≥ c_bad.m_min) = true := by
  rfl

theorem rt003_alignment_failed : ¬ (∀ x, c_bad.T x → c_bad.π (c_bad.R x) = c_bad.D x) := by
  intro h
  have h0 := h S.s0 True.intro
  -- c_bad.π (c_bad.R S.s0) = π_bad 0 = 1
  -- c_bad.D S.s0 = 0
  -- so 1 = 0, which is a contradiction
  contradiction

end RT003
