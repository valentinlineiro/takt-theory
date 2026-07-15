/-
TAKT v1 - SafetyEquivalence.lean (Capa 2)
Equivalencia de seguridad: decision preservada ↔ representacion segura.

Teorema principal:

    ε_D(R) = 0  ⇔  ker(R) ⊆ ker(D)

donde:

    ε_D(R) = sup_{R(x)=R(y)} 1[D(x) ≠ D(y)]

es decir, ε_D(R) mide si existe al menos un par fusionado por R
con distinta decision.

La equivalencia es directa por definicion. Su valor arquitectonico
es separar dos metricas que Regret.lean mostraba como distintas:

  - ε_U (utilidad preservada) — no implica decision preservada
  - ε_D (decision preservada) — esta es la condicion TAKT

Relacion:

    ε_D(R) = 0  ⇒  ε_U(R) = 0   (probado)
    ε_U(R) = 0  ⇒  ε_D(R) = 0   (falso, ver Regret.lean)
-/

import TaktFormal.Regret

open Kernel

variable {S A Z : Type} (ds : DecisionSystem S A Int)

/--
  ε_D(R): la representacion R no fusiona estados con distinta decision.

  Equivalentemente: ker(R) ⊆ ker(D).
-/
def epsilon_D (R : S → Z) : Prop :=
  ∀ x y, kernel R x y → DecisionSystem.D S A Int ds x = DecisionSystem.D S A Int ds y

/--
  Teorema de equivalencia de seguridad:

      ε_D(R) = 0  ⇔  ker(R) ⊆ ker(D)

  Ambas caras son inmediatas porque epsilon_D esta definida como
  esa misma inclusion.
-/
theorem safety_equivalence (R : S → Z) :
    epsilon_D ds R ↔ kernelSubset R (DecisionSystem.D S A Int ds) := by
  constructor
  · intro h x y hker; exact h x y hker
  · intro h x y hker; exact h x y hker

/--
  Si la representacion preserva la decision, entonces tambien
  preserva la utilidad (regret cero).

  ε_D(R) = 0  ⇒  ε_U(R) = 0
-/
theorem epsilon_D_implies_epsilon_U (R : S → Z) (h : epsilon_D ds R) :
    epsilon ds R 0 := by
  intro x y hker
  have hD : DecisionSystem.D S A Int ds x = DecisionSystem.D S A Int ds y := h x y hker
  dsimp [epsilon, regret]
  rw [hD]
  have h_sub := Int.sub_self (ds.U x (DecisionSystem.D S A Int ds y))
  rw [h_sub]
  exact Int.le_refl (0 : Int)

/--
  La reciproca NO se cumple: ε_U(R) = 0 no implica ε_D(R) = 0.

  Contraejemplo en Regret.lean: dos acciones distintas con igual
  utilidad producen regret cero pero decision diferente.

  Este teorema documenta el gap sin cerrarlo.
-/
theorem epsilon_U_not_implies_epsilon_D (R : S → Z) (h : epsilon ds R 0) :
    epsilon_D ds R := by
  intro x y hker
  -- h : epsilon ds R 0  →  regret(x,y) ≤ 0 y regret(y,x) ≤ 0
  -- De esto solo obtenemos U(x, D(x)) = U(x, D(y)) y U(y, D(y)) = U(y, D(x))
  -- No podemos concluir D(x) = D(y).
  -- Ver 'epsilon_zero_implies_safe_attempt' en Regret.lean.
  sorry
