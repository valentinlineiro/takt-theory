import TaktFormal.Kernel
import TaktFormal.DecisionMargin
import TaktFormal.Coverage

open Kernel
open DecisionMargin
open Coverage

namespace DynamicSafetyContract

/--
  Contrato Dinámico de Seguridad Decisional:
  Unifica la representación, la decisión ideal, la política ejecutada,
  el conjunto de prueba, el espacio métrico y el umbral de margen mínimo.
-/
structure SafetyContract (S Z A : Type) [DecidableEq S] [DecidableEq Z] [DecidableEq A] where
  R : S → Z
  D : S → A
  π : Z → A
  T : S → Prop
  all_S : List S
  dist : S → S → Nat
  m_min : Nat

/--
  Condiciones del Contrato:
  1. Seguridad empírica sobre T.
  2. Cobertura de fibras C(T, S).
  3. Margen decisional superior o igual a m_min (con m_min > 0).
  4. Alineación de la política con la decisión observada en T.
-/
def contract_satisfied {S Z A : Type} [DecidableEq S] [DecidableEq Z] [DecidableEq A]
    (c : SafetyContract S Z A) : Prop :=
  safe_on_T c.R c.D c.T ∧
  fiber_coverage c.R c.D c.T ∧
  ((match decisionMargin c.dist c.D c.R c.all_S with
    | none => false
    | some m => m ≥ c.m_min) = true) ∧
  c.m_min > 0 ∧
  (∀ x, c.T x → c.π (c.R x) = c.D x)

/--
  Teorema de Garantía del Contrato Dinámico:
  Si el contrato está satisfecho, entonces el sistema es globalmente seguro
  y la política de decisión coincide perfectamente con el operador de decisión ideal.
-/
theorem contract_guarantees_safety {S Z A : Type} [DecidableEq S] [DecidableEq Z] [DecidableEq A]
    (c : SafetyContract S Z A) (h_sat : contract_satisfied c) :
    kernelSubset c.R c.D ∧ (∀ x, c.D x = c.π (c.R x)) := by
  have h_safe_T := h_sat.1
  have h_cov := h_sat.2.1
  have h_align := h_sat.2.2.2.2
  -- 1. Demostrar la seguridad global usando el Teorema de Cobertura
  have h_safe_global : kernelSubset c.R c.D :=
    coverage_implies_global_safety c.R c.D c.T h_cov h_safe_T
  refine ⟨h_safe_global, ?_⟩
  -- 2. Demostrar la consistencia global de la política
  intro x
  have ⟨x', hTx', hRx', hDx'⟩ := h_cov x
  have h_align_x' := h_align x' hTx'
  rw [hDx', ← h_align_x', hRx']

/-
  Instanciación y Validación con el Modelo de Deriva Temporal.
-/
namespace TemporalDriftContract

inductive S' : Type where
  | sm10 : S'
  | sm01 : S'
  | sp01 : S'
  | sp10 : S'
  deriving DecidableEq

open S'

def all_S : List S' := [sm10, sm01, sp01, sp10]

def dist : S' → S' → Nat
  | sm10, sm10 => 0
  | sm10, sm01 => 9
  | sm10, sp01 => 11
  | sm10, sp10 => 20
  | sm01, sm10 => 9
  | sm01, sm01 => 0
  | sm01, sp01 => 2
  | sm01, sp10 => 11
  | sp01, sm10 => 11
  | sp01, sm01 => 2
  | sp01, sp01 => 0
  | sp01, sp10 => 9
  | sp10, sm10 => 20
  | sp10, sm01 => 11
  | sp10, sp01 => 9
  | sp10, sp10 => 0

def D : S' → Nat
  | sm10 => 0
  | sm01 => 0
  | sp01 => 1
  | sp10 => 1

def R0 : S' → Int
  | sm10 => -1
  | sm01 => -1
  | sp01 => 0
  | sp10 => 1

def R3 : S' → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => -1
  | sp10 => 0

-- El conjunto de test T cubre sm01, sp01, sp10 para satisfacer cobertura en R0
def T : S' → Prop
  | sm10 => False
  | sm01 => True
  | sp01 => True
  | sp10 => True

-- Política nominal de decisión del agente
def π : Int → Nat
  | -1 => 0
  | 0 => 1
  | 1 => 1
  | _ => 0

def c0 : SafetyContract S' Int Nat := {
  R := R0
  D := D
  π := π
  T := T
  all_S := all_S
  dist := dist
  m_min := 2
}

def c3 : SafetyContract S' Int Nat := {
  R := R3
  D := D
  π := π
  T := T
  all_S := all_S
  dist := dist
  m_min := 2
}

theorem c0_contract_satisfied : contract_satisfied c0 := by
  dsimp [contract_satisfied, c0, T, safe_on_T, fiber_coverage, decisionMargin, has_unsafe_pair, list_min]
  refine ⟨?_, ⟨?_, ⟨?_, ⟨?_, ?_⟩⟩⟩⟩
  · intro x y hx hy hk
    cases x <;> cases y <;> first | rfl | contradiction
  · intro x
    cases x
    · exact ⟨sm01, True.intro, rfl, rfl⟩
    · exact ⟨sm01, True.intro, rfl, rfl⟩
    · exact ⟨sp01, True.intro, rfl, rfl⟩
    · exact ⟨sp10, True.intro, rfl, rfl⟩
  · decide
  · decide
  · intro x hx
    cases x <;> first | rfl | contradiction

theorem c3_contract_violated : ¬ contract_satisfied c3 := by
  intro h
  have h_margin := h.2.2.1
  dsimp [contract_satisfied, c3, decisionMargin, has_unsafe_pair] at h_margin
  contradiction

end TemporalDriftContract

end DynamicSafetyContract
