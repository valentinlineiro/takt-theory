/-
TAKT v1 - DecisionSystem.lean (Capa 1)
Decision inducida por utilidad.

Inyecta la semantica de utilidad en la funcion de decision D:

    D(s) = θ(argmax_a U(s, a))

Sin dependencias externas: ni Set, ni Finset, ni Fintype, ni ℝ.
Solo LE del nucleo de Lean para el orden sobre utilidades.

Hipotesis:
  - U : S → A → R : utilidad (R con orden LE)
  - argmax_nonempty : en cada estado, ∃ accion maximizadora
  - θ : (A → Prop) → A : desempate (definido para todo predicado)
  - θ_consistent : p no vacio → θ p satisface p
    (θ depende solo del predicado p)
-/

import TaktFormal.Factorization

open Kernel

/-- Predicado de accion maximizadora: a es maxima si ninguna
    accion tiene utilidad estrictamente mayor. -/
def argmaxPred (S A R : Type) [LE R] (U : S → A → R) (s : S) (a : A) : Prop :=
  ∀ a', U s a' ≤ U s a

/-- Sistema de decision con utilidad y desempate. -/
structure DecisionSystem (S A R : Type) [LE R] where
  U : S → A → R
  argmax_nonempty : ∀ s : S, ∃ a : A, argmaxPred S A R U s a
  θ : (A → Prop) → A
  θ_consistent : ∀ (p : A → Prop), (∃ a : A, p a) → p (θ p)

/-- Funcion de decision: D(s) = θ(argmax_a U(s, a)). -/
def DecisionSystem.D (S A R : Type) [LE R] (ds : DecisionSystem S A R) (s : S) : A :=
  ds.θ (argmaxPred S A R ds.U s)

namespace DecisionSystem

variable {S A R : Type} [LE R] (ds : DecisionSystem S A R)

/-- Si dos estados tienen la misma funcion de utilidad, la decision
    es la misma: ker(U) ⊆ ker(D). -/
theorem kerU_subset_kerD : kernelSubset (λ s : S => ds.U s) (D S A R ds) := by
  intro s₁ s₂ h
  have hU : ds.U s₁ = ds.U s₂ := h
  have h_argmax : argmaxPred S A R (ds.U) s₁ = argmaxPred S A R (ds.U) s₂ := by
    apply funext; intro a
    dsimp [argmaxPred]
    simp [hU]
  calc
    D S A R ds s₁ = ds.θ (argmaxPred S A R (ds.U) s₁) := rfl
    _             = ds.θ (argmaxPred S A R (ds.U) s₂) := by rw [h_argmax]
    _             = D S A R ds s₂ := rfl

end DecisionSystem
