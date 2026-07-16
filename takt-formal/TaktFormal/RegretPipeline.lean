import TaktFormal.Kernel
import TaktFormal.Factorization

open Kernel

/--
  Teorema de seguridad composicional:
  Si R1 es segura para D con política inducida pi1,
  y R2 es segura para pi1,
  entonces R2 ∘ R1 es segura para D.
-/
theorem compositional_safety {S Z1 Z2 A : Type} (R1 : S → Z1) (R2 : Z1 → Z2) (D : S → A) (pi1 : Z1 → A)
    (h_fact : ∀ x, D x = pi1 (R1 x)) (h_safe2 : kernelSubset R2 pi1) :
    kernelSubset (fun x => R2 (R1 x)) D := by
  intro x y hk
  unfold kernel at hk
  unfold kernel
  rw [h_fact x, h_fact y]
  exact h_safe2 (R1 x) (R1 y) hk

/-
  Espacios y mappings para el contraejemplo de desalineación.
-/
namespace CompositionalCounterexample

inductive S' : Type where
  | s0 : S'
  | s1 : S'
  | s2 : S'
  deriving DecidableEq

inductive Z1' : Type where
  | z0 : Z1'
  | z1 : Z1'
  deriving DecidableEq

inductive Z2' : Type where
  | w0 : Z2'
  deriving DecidableEq

inductive A' : Type where
  | a : A'
  | b : A'
  deriving DecidableEq

open S' Z1' Z2' A'

def D : S' → A'
  | s0 => a
  | s1 => a
  | s2 => b

def R1 : S' → Z1'
  | s0 => z0
  | s1 => z0
  | s2 => z1

def R2 : Z1' → Z2'
  | _ => w0

/--
  Decisión intermedia no alineada.
-/
def D2 : Z1' → A'
  | _ => a

/--
  Política inducida real de la primera etapa.
-/
def pi1 : Z1' → A'
  | z0 => a
  | z1 => b

theorem R1_safe : kernelSubset R1 D := by
  intro x y hk
  cases x <;> cases y <;> first | rfl | contradiction

theorem D_eq_pi1_R1 : ∀ x, D x = pi1 (R1 x) := by
  intro x
  cases x <;> rfl

theorem R2_safe_D2 : kernelSubset R2 D2 := by
  intro x y hk
  rfl

theorem R2_unsafe_pi1 : ¬ kernelSubset R2 pi1 := by
  intro h
  have h_eq : pi1 z0 = pi1 z1 := h z0 z1 (by dsimp [kernel, R2])
  dsimp [pi1] at h_eq
  contradiction

theorem composite_unsafe : ¬ kernelSubset (fun x => R2 (R1 x)) D := by
  intro h
  have h_eq : D s0 = D s2 := h s0 s2 (by dsimp [kernel, R1, R2])
  dsimp [D] at h_eq
  contradiction

end CompositionalCounterexample
