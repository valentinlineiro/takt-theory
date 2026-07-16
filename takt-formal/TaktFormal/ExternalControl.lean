import TaktFormal.Kernel

open Kernel

namespace ExternalControl

inductive S : Type where
  | m15 : S
  | m10 : S
  | m5 : S
  | z0 : S
  | p5 : S
  | p10 : S
  | p15 : S
  deriving DecidableEq

open S

def val : S → Int
  | m15 => -15
  | m10 => -10
  | m5  => -5
  | z0  => 0
  | p5  => 5
  | p10 => 10
  | p15 => 15

inductive ControlAction : Type where
  | NEG : ControlAction
  | POS : ControlAction
  deriving DecidableEq

open ControlAction

def D (s : S) : ControlAction :=
  if val s ≥ 0 then POS else NEG

def floor_div_10 (x : Int) : Int :=
  if x ≥ 0 then x / 10 else (x - 9) / 10

def round_div_10 (x : Int) : Int :=
  floor_div_10 (x + 5)

def R_floor (s : S) : Int :=
  floor_div_10 (val s)

def R_round (s : S) : Int :=
  round_div_10 (val s)

theorem R_floor_safe : kernelSubset R_floor D := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  cases x <;> cases y <;> first | rfl | contradiction

theorem R_round_unsafe : ¬ kernelSubset R_round D := by
  intro h
  have h_eq : D m5 = D z0 := h m5 z0 (by dsimp [kernel, R_round, round_div_10, floor_div_10, val])
  dsimp [D, val] at h_eq
  contradiction

end ExternalControl
