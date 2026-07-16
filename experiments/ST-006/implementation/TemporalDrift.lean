import TaktFormal.Kernel

open Kernel

namespace TemporalDrift

inductive S : Type where
  | sm10 : S
  | sm01 : S
  | sp01 : S
  | sp10 : S
  deriving DecidableEq

open S

def D : S → Nat
  | sm10 => 0
  | sm01 => 0
  | sp01 => 1
  | sp10 => 1

def R0 : S → Int
  | sm10 => -1
  | sm01 => -1
  | sp01 => 0
  | sp10 => 1

def R1 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => 0
  | sp10 => 0

def R2 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => 0
  | sp10 => 0

def R3 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => -1
  | sp10 => 0

/--
  Parámetros de deriva temporal (escalados por 100 para evitar flotantes).
-/
def c0 : Int := 0
def c1 : Int := 5
def c2 : Int := 10
def c3 : Int := 15

def threshold : Int := 8

def dist (a b : Int) : Int :=
  if a > b then a - b else b - a

theorem drift_0_1 : dist c0 c1 < threshold := by decide
theorem drift_1_2 : dist c1 c2 < threshold := by decide
theorem drift_2_3 : dist c2 c3 < threshold := by decide

theorem R0_safe : kernelSubset R0 D := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  cases x <;> cases y <;> first | rfl | contradiction

theorem R1_safe : kernelSubset R1 D := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  cases x <;> cases y <;> first | rfl | contradiction

theorem R2_safe : kernelSubset R2 D := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  cases x <;> cases y <;> first | rfl | contradiction

theorem R3_unsafe : ¬ kernelSubset R3 D := by
  intro h
  have h_eq : D sm01 = D sp01 := h sm01 sp01 (by dsimp [kernel, R3])
  dsimp [D] at h_eq
  contradiction

end TemporalDrift
