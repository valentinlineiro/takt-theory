import TaktFormal.Kernel
import TaktFormal.DecisionMargin
import TaktFormal.Coverage
import TaktFormal.DynamicSafetyContract

open Kernel
open DecisionMargin
open Coverage
open DynamicSafetyContract

namespace ExternalContract

inductive S : Type where
  | m20 : S
  | m15 : S
  | m10 : S
  | m5  : S
  | z0  : S
  | p5  : S
  | p10 : S
  | p15 : S
  deriving DecidableEq

open S

def all_S : List S := [m20, m15, m10, m5, z0, p5, p10, p15]

def dist : S → S → Nat
  | m20, m20 => 0  | m20, m15 => 5  | m20, m10 => 10 | m20, m5 => 15  | m20, z0 => 20  | m20, p5 => 25  | m20, p10 => 30 | m20, p15 => 35
  | m15, m20 => 5  | m15, m15 => 0  | m15, m10 => 5  | m15, m5 => 10  | m15, z0 => 15  | m15, p5 => 20  | m15, p10 => 25  | m15, p15 => 30
  | m10, m20 => 10 | m10, m15 => 5  | m10, m10 => 0  | m10, m5 => 5   | m10, z0 => 10  | m10, p5 => 15  | m10, p10 => 20  | m10, p15 => 25
  | m5,  m20 => 15 | m5,  m15 => 10 | m5,  m10 => 5  | m5,  m5 => 0   | m5,  z0 => 5   | m5,  p5 => 10  | m5,  p10 => 15  | m5,  p15 => 20
  | z0,  m20 => 20 | z0,  m15 => 15 | z0,  m10 => 10 | z0,  m5 => 5   | z0,  z0 => 0   | z0,  p5 => 5   | z0,  p10 => 10  | z0,  p15 => 15
  | p5,  m20 => 25 | p5,  m15 => 20 | p5,  m10 => 15 | p5,  m5 => 10  | p5,  z0 => 5   | p5,  p5 => 0   | p5,  p10 => 5   | p5,  p15 => 10
  | p10, m20 => 30 | p10, m15 => 25 | p10, m10 => 20 | p10, m5 => 15  | p10, z0 => 10  | p10, p5 => 5   | p10, p10 => 0   | p10, p15 => 5
  | p15, m20 => 35 | p15, m15 => 30 | p15, m10 => 25 | p15, m5 => 20  | p15, z0 => 15  | p15, p5 => 10  | p15, p10 => 5   | p15, p15 => 0

def D : S → Nat
  | m20 => 0
  | m15 => 0
  | m10 => 0
  | m5  => 0
  | z0  => 1
  | p5  => 1
  | p10 => 1
  | p15 => 1

def R0 : S → Int
  | m20 => -2
  | m15 => -2
  | m10 => -1
  | m5  => -1
  | z0  => 0
  | p5  => 0
  | p10 => 1
  | p15 => 1

def R1 : S → Int
  | m20 => -3
  | m15 => -2
  | m10 => -2
  | m5  => -1
  | z0  => -1
  | p5  => 0
  | p10 => 0
  | p15 => 1

def T : S → Prop
  | m20 => False
  | m15 => True
  | m10 => False
  | m5  => True
  | z0  => False
  | p5  => True
  | p10 => False
  | p15 => True

def π : Int → Nat
  | -2 => 0
  | -1 => 0
  | 0 => 1
  | 1 => 1
  | _ => 0

def c0 : SafetyContract S Int Nat := {
  R := R0
  D := D
  π := π
  T := T
  all_S := all_S
  dist := dist
  m_min := 5
}

def c1 : SafetyContract S Int Nat := {
  R := R1
  D := D
  π := π
  T := T
  all_S := all_S
  dist := dist
  m_min := 5
}

theorem c0_contract_satisfied : contract_satisfied c0 := by
  dsimp [contract_satisfied, c0, T, safe_on_T, fiber_coverage, decisionMargin, has_unsafe_pair, list_min]
  refine ⟨?_, ⟨?_, ⟨?_, ⟨?_, ?_⟩⟩⟩⟩
  · intro x y hx hy hk
    cases x <;> cases y <;> first | rfl | contradiction
  · intro x
    cases x
    · exact ⟨m15, True.intro, rfl, rfl⟩
    · exact ⟨m15, True.intro, rfl, rfl⟩
    · exact ⟨m5, True.intro, rfl, rfl⟩
    · exact ⟨m5, True.intro, rfl, rfl⟩
    · exact ⟨p5, True.intro, rfl, rfl⟩
    · exact ⟨p5, True.intro, rfl, rfl⟩
    · exact ⟨p15, True.intro, rfl, rfl⟩
    · exact ⟨p15, True.intro, rfl, rfl⟩
  · decide
  · decide
  · intro x hx
    cases x <;> first | rfl | contradiction

theorem c1_test_safe : safe_on_T R1 D T := by
  intro x y hx hy hk
  cases x <;> cases y <;> first | rfl | contradiction

theorem c1_contract_violated : ¬ contract_satisfied c1 := by
  intro h
  have h_margin := h.2.2.1
  dsimp [contract_satisfied, c1, decisionMargin, has_unsafe_pair] at h_margin
  contradiction

end ExternalContract
