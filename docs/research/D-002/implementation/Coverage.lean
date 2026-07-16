import TaktFormal.Kernel

open Kernel

namespace Coverage

/--
  Condición de Cobertura de Fibras C(T, S):
  Para todo estado en S, existe un estado representante en T
  con la misma representación y la misma decisión ideal.
-/
def fiber_coverage {S A Z : Type} (R : S → Z) (D : S → A) (T : S → Prop) : Prop :=
  ∀ x, ∃ x', T x' ∧ R x = R x' ∧ D x = D x'

/--
  Seguridad empírica sobre el conjunto de test T.
-/
def safe_on_T {S A Z : Type} (R : S → Z) (D : S → A) (T : S → Prop) : Prop :=
  ∀ x y, T x → T y → kernel R x y → D x = D y

/--
  Teorema Fundamental de Generalización de Cobertura:
  Si una representación es segura en T y cumple la condición de cobertura de fibras,
  entonces es garantizadamente segura en S globalmente.
-/
theorem coverage_implies_global_safety {S A Z : Type} (R : S → Z) (D : S → A) (T : S → Prop)
    (h_cov : fiber_coverage R D T) (h_safe_T : safe_on_T R D T) :
    kernelSubset R D := by
  intro x y hk
  unfold kernel at hk
  have ⟨x', hTx', hRx', hDx'⟩ := h_cov x
  have ⟨y', hTy', hRy', hDy'⟩ := h_cov y
  have hk' : kernel R x' y' := by
    unfold kernel
    rw [← hRx', hk, hRy']
  have hD' : D x' = D y' := h_safe_T x' y' hTx' hTy' hk'
  unfold kernel
  rw [hDx', hD', ← hDy']

/-
  Verificación con el contraejemplo ST-004.
-/
namespace ST004Verification

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

def T : S' → Prop
  | s0 => True
  | s1 => False
  | s2 => True
  | s3 => False

theorem R1_has_coverage : fiber_coverage R1 D T := by
  intro x
  cases x
  · exact ⟨s0, True.intro, rfl, rfl⟩
  · exact ⟨s0, True.intro, rfl, rfl⟩
  · exact ⟨s2, True.intro, rfl, rfl⟩
  · exact ⟨s2, True.intro, rfl, rfl⟩

theorem R2_no_coverage : ¬ fiber_coverage R2 D T := by
  intro h
  have ⟨x', hTx', hRx', hDx'⟩ := h s3
  cases x' <;> contradiction

end ST004Verification

end Coverage
