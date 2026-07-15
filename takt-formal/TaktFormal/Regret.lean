/-
TAKT v1 - Regret.lean (Capa 2)
Regret de decision inducida por utilidad sobre una representacion.

Define:

    regret_ds(x, y) = U(x, D(x)) - U(x, D(y))
    ε(R) = sup_{ker(R)} regret_ds

donde R : S → Z es una funcion de representacion.

Con Int como codominio de utilidad: disponible en el nucleo de
Lean con resta y orden, necesario para regret.
-/

import TaktFormal.DecisionSystem

open Kernel

variable {S A Z : Type} (ds : DecisionSystem S A Int)

/-- Regret de usar D(y) en lugar de D(x) en el estado x:
    la utilidad perdida por aplicar la decision de y en x. -/
def regret (x y : S) : Int :=
  ds.U x (DecisionSystem.D S A Int ds x) - ds.U x (DecisionSystem.D S A Int ds y)

/-- El regret es no negativo: D(x) es optima para x. -/
theorem regret_nonneg (x y : S) : 0 ≤ regret ds x y := by
  dsimp [regret]
  have hDx_opt : argmaxPred S A Int (ds.U) x (DecisionSystem.D S A Int ds x) :=
    ds.θ_consistent (argmaxPred S A Int (ds.U) x) (ds.argmax_nonempty x)
  have hU_le : ds.U x (DecisionSystem.D S A Int ds y) ≤ ds.U x (DecisionSystem.D S A Int ds x) :=
    hDx_opt (DecisionSystem.D S A Int ds y)
  exact (Int.sub_nonneg.mpr hU_le)

/-- El regret de un estado consigo mismo es cero. -/
theorem regret_self_zero (x : S) : regret ds x x = 0 := by
  dsimp [regret]
  apply Int.sub_self

/--
  ε(R, r): r es cota superior del regret sobre el kernel de R.

  `epsilon ds R r` significa que para todo par (x, y) con
  R x = R y, se cumple regret(x,y) ≤ r.
-/
def epsilon (R : S → Z) (r : Int) : Prop :=
  ∀ x y, kernel R x y → regret ds x y ≤ r

/-- Si la representacion es segura (ker(R) ⊆ ker(D)), entonces
    ε(R, 0) se cumple: regret es cero sobre pares identificados. -/
theorem safe_implies_epsilon_zero (R : S → Z) (h : kernelSubset R (DecisionSystem.D S A Int ds)) :
    epsilon ds R 0 := by
  intro x y hker
  have hD : DecisionSystem.D S A Int ds x = DecisionSystem.D S A Int ds y :=
    h x y hker
  dsimp [epsilon, regret]
  rw [hD]
  have h := Int.sub_self (ds.U x (DecisionSystem.D S A Int ds y))
  rw [h]
  exact Int.le_refl (0 : Int)

/--
  Recíproca: si ε(R, 0), entonces ker(R) ⊆ ker(D)?

  Intento de prueba — no completa: del regret cero solo podemos
  concluir que D(x) y D(y) son igualmente buenos en x (y en y).
  No necesariamente que D(x) = D(y).
-/
theorem epsilon_zero_implies_safe_attempt (R : S → Z) (h : epsilon ds R 0) :
    kernelSubset R (DecisionSystem.D S A Int ds) := by
  intro x y hker
  have h_regret_xy : regret ds x y ≤ 0 := h x y hker
  have h_regret_yx : regret ds y x ≤ 0 := h y x (by
    dsimp [kernel] at hker
    dsimp [kernel]
    exact hker.symm)
  have h_nonneg_xy : 0 ≤ regret ds x y := regret_nonneg ds x y
  have h_nonneg_yx : 0 ≤ regret ds y x := regret_nonneg ds y x
  have h_eq_xy : regret ds x y = 0 := (Int.le_antisymm h_nonneg_xy h_regret_xy).symm
  have h_eq_yx : regret ds y x = 0 := (Int.le_antisymm h_nonneg_yx h_regret_yx).symm
  -- h_eq_xy : U(x, D(x)) - U(x, D(y)) = 0  →  U(x, D(x)) = U(x, D(y))
  -- h_eq_yx : U(y, D(y)) - U(y, D(x)) = 0  →  U(y, D(y)) = U(y, D(x))
  -- De esto NO se sigue D(x) = D(y). Contraejemplo teorico:
  --   D(x) = a, D(y) = b, con a ≠ b, U(x,a)=U(x,b), U(y,a)=U(y,b).
  -- Necesitariamos una hipotesis adicional (ej. unicidad de maximo).
  sorry
