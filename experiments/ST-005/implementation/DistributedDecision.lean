import TaktFormal.Kernel

open Kernel

namespace DistributedDecision

inductive S : Type where
  | s0 : S
  | s1 : S
  | s2 : S
  deriving DecidableEq

open S

def piA_nom : S → Nat
  | s0 => 0
  | s1 => 0
  | s2 => 1

def piA_shift : S → Nat
  | s0 => 0
  | s1 => 0
  | s2 => 0

def R_B : S → Nat
  | s0 => 1
  | s1 => 0
  | s2 => 0

def D_B (s : S) (aA : Nat) : Nat :=
  if s = s0 && aA = 0 then 1
  else if s = s1 && aA = 0 then 0
  else if s = s2 && aA = 0 then 1
  else if s = s2 && aA = 1 then 0
  else 0

def D_B_nom (s : S) : Nat :=
  D_B s (piA_nom s)

def D_B_shift (s : S) : Nat :=
  D_B s (piA_shift s)

theorem R_B_safe_nom : kernelSubset R_B D_B_nom := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  cases x <;> cases y <;> first | rfl | contradiction

theorem R_B_unsafe_shift : ¬ kernelSubset R_B D_B_shift := by
  intro h
  have h_eq : D_B_shift s1 = D_B_shift s2 := h s1 s2 (by dsimp [kernel, R_B])
  dsimp [D_B_shift, D_B, piA_shift] at h_eq
  contradiction

end DistributedDecision
