import TaktFormal.Kernel

open Kernel

namespace HiddenKernel

inductive S' : Type where
  | s0 : S'
  | s1 : S'
  | s2 : S'
  | s3 : S'
  deriving DecidableEq

inductive Z' : Type where
  | z0 : Z'
  | z1 : Z'
  deriving DecidableEq

inductive A' : Type where
  | a : A'
  | b : A'
  deriving DecidableEq

open S' Z' A'

def D : S' → A'
  | s0 => a
  | s1 => a
  | s2 => b
  | s3 => b

def R1 : S' → Z'
  | s0 => z0
  | s1 => z0
  | s2 => z1
  | s3 => z1

def R2 : S' → Z'
  | s0 => z0
  | s1 => z1
  | s2 => z1
  | s3 => z0

/--
  El conjunto de test T contiene solo s0 y s2.
-/
def T : S' → Prop
  | s0 => True
  | s1 => False
  | s2 => True
  | s3 => False

/--
  La seguridad empírica sobre T:
  Cualquier par en el kernel de R que pertenezca a T debe tener la misma decisión.
-/
def safe_on_T (R : S' → Z') : Prop :=
  ∀ x y, T x → T y → kernel R x y → D x = D y

theorem R1_safe_global : kernelSubset R1 D := by
  intro x y hk
  cases x <;> cases y <;> first | rfl | contradiction

theorem R2_unsafe_global : ¬ kernelSubset R2 D := by
  intro h
  have h_eq : D s0 = D s3 := h s0 s3 (by dsimp [kernel, R2])
  dsimp [D] at h_eq
  contradiction

theorem R1_safe_T : safe_on_T R1 := by
  intro x y hx hy hk
  cases x <;> cases y <;> first | rfl | contradiction

theorem R2_safe_T : safe_on_T R2 := by
  intro x y hx hy hk
  cases x <;> cases y <;> first | rfl | contradiction

end HiddenKernel
