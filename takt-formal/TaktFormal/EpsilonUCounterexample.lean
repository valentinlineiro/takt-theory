/-
TAKT v1 - EpsilonUCounterexample.lean
Contraejemplo: epsilon_U(R) = 0 no implica epsilon_D(R) = 0.
-/

import TaktFormal.Kernel
import TaktFormal.DecisionSystem

open Kernel

namespace EpsilonUCounterexample

inductive S' : Type where
  | s0 : S'
  | s1 : S'
  deriving DecidableEq

open S'

inductive A' : Type where
  | a : A'
  | b : A'
  | c : A'
  deriving DecidableEq

open A'

noncomputable section

def U : S' -> A' -> Int
  | s0, a => 5
  | s0, b => 5
  | s0, c => 0
  | s1, a => 5
  | s1, b => 5
  | s1, c => 5

noncomputable def theta (p : A' -> Prop) : A' := by
  by_cases h0 : p a
  · by_cases h1 : p b
    · by_cases h2 : p c
      · exact a
      · exact b
    · exact a
  · by_cases h1 : p b
    · exact b
    · exact c

theorem theta_consistent (p : A' -> Prop) (hne : Exists p) : p (theta p) := by
  dsimp [theta]
  by_cases h0 : p a
  · by_cases h1 : p b
    · by_cases h2 : p c
      · simpa [h0, h1, h2]
      · simpa [h0, h1, h2]
    · simpa [h0, h1]
  · by_cases h1 : p b
    · simpa [h0, h1]
    · rcases hne with ⟨x, hx⟩
      cases x
      · exfalso; exact h0 hx
      · exfalso; exact h1 hx
      · simpa [h0, h1]

theorem argmax_nonempty : ∀ s : S', ∃ a : A', argmaxPred S' A' Int U s a := by
  intro s
  cases s
  · refine ⟨a, ?_⟩
    intro a'
    cases a' <;> dsimp [U] <;> decide
  · refine ⟨a, ?_⟩
    intro a'
    cases a' <;> dsimp [U] <;> decide

noncomputable def ds : DecisionSystem S' A' Int := {
  U := U
  argmax_nonempty := argmax_nonempty
  θ := theta
  θ_consistent := theta_consistent
}

def R : S' -> Unit := fun _ => ()

def regret (x y : S') : Int :=
  ds.U x (DecisionSystem.D S' A' Int ds x) - ds.U x (DecisionSystem.D S' A' Int ds y)

theorem D_s0_eq_b : DecisionSystem.D S' A' Int ds s0 = b := by
  dsimp [DecisionSystem.D, ds, theta]
  have ha : argmaxPred S' A' Int U s0 a := by
    intro a'; cases a' <;> dsimp [U] <;> decide
  have hb : argmaxPred S' A' Int U s0 b := by
    intro a'; cases a' <;> dsimp [U] <;> decide
  have hc : ¬ argmaxPred S' A' Int U s0 c := by
    intro h
    have h05 := h a
    dsimp [U] at h05
    exact (by decide : ¬ ((0 : Int) ≥ 5)) h05
  by_cases h0 : argmaxPred S' A' Int U s0 a
  · by_cases h1 : argmaxPred S' A' Int U s0 b
    · by_cases h2 : argmaxPred S' A' Int U s0 c
      · exfalso; exact hc h2
      · simpa [h0, h1, h2]
    · exfalso; exact h1 hb
  · exfalso; exact h0 ha

theorem D_s1_eq_a : DecisionSystem.D S' A' Int ds s1 = a := by
  dsimp [DecisionSystem.D, ds, theta]
  have ha : argmaxPred S' A' Int U s1 a := by
    intro a'; cases a' <;> dsimp [U] <;> decide
  have hb : argmaxPred S' A' Int U s1 b := by
    intro a'; cases a' <;> dsimp [U] <;> decide
  have hc : argmaxPred S' A' Int U s1 c := by
    intro a'; cases a' <;> dsimp [U] <;> decide
  by_cases h0 : argmaxPred S' A' Int U s1 a
  · by_cases h1 : argmaxPred S' A' Int U s1 b
    · by_cases h2 : argmaxPred S' A' Int U s1 c
      · simpa [h0, h1, h2]
      · exfalso; exact h2 hc
    · exfalso; exact h1 hb
  · exfalso; exact h0 ha

theorem regret_s0_s0 : regret s0 s0 = 0 := by
  dsimp [regret]
  rw [D_s0_eq_b]
  dsimp [ds, U]

theorem regret_s0_s1 : regret s0 s1 = 0 := by
  dsimp [regret]
  rw [D_s0_eq_b, D_s1_eq_a]
  dsimp [ds, U]

theorem regret_s1_s0 : regret s1 s0 = 0 := by
  dsimp [regret]
  rw [D_s1_eq_a, D_s0_eq_b]
  dsimp [ds, U]

theorem regret_s1_s1 : regret s1 s1 = 0 := by
  dsimp [regret]
  rw [D_s1_eq_a]
  dsimp [ds, U]

def epsilon (r : Int) : Prop :=
  ∀ x y, kernel R x y -> regret x y <= r

theorem epsilon_zero : epsilon 0 := by
  intro x y hker
  have h : regret x y = 0 := by
    cases x <;> cases y <;>
      first | exact regret_s0_s0 | exact regret_s0_s1 | exact regret_s1_s0 | exact regret_s1_s1
  rw [h]
  decide

def epsilon_D : Prop :=
  ∀ x y, kernel R x y -> DecisionSystem.D S' A' Int ds x = DecisionSystem.D S' A' Int ds y

theorem epsilon_D_false : ¬ epsilon_D := by
  intro h
  have h_eq : DecisionSystem.D S' A' Int ds s0 = DecisionSystem.D S' A' Int ds s1 :=
    h s0 s1 (by
      dsimp [kernel, R])
  rw [D_s0_eq_b, D_s1_eq_a] at h_eq
  have h_ne : b ≠ a := by decide
  exact h_ne h_eq

end
