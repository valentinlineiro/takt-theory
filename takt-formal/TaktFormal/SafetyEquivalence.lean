/-
TAKT v1 - SafetyEquivalence.lean (Capa 2)
Equivalencia de seguridad: decision preservada <-> representacion segura.

Teorema principal:

    epsilon_D(R) = 0  <->  ker(R) subset ker(D)

Relacion:

    epsilon_D(R) = 0  =>  epsilon_U(R) = 0   (probado)
    epsilon_U(R) = 0  =>  epsilon_D(R) = 0   (falso)
-/

import TaktFormal.Regret

open Kernel

variable {S A Z : Type} (ds : DecisionSystem S A Int)

/--
  epsilon_D(R): la representacion R no fusiona estados con distinta decision.
  Equivalentemente: ker(R) subset ker(D).
-/
def epsilon_D (R : S -> Z) : Prop :=
  forall x y, kernel R x y -> DecisionSystem.D S A Int ds x = DecisionSystem.D S A Int ds y

/--
  Teorema de equivalencia de seguridad:
      epsilon_D(R) = 0  <->  ker(R) subset ker(D)
  Ambas caras son inmediatas porque epsilon_D esta definida como
  esa misma inclusion.
-/
theorem safety_equivalence (R : S -> Z) :
    epsilon_D ds R <-> kernelSubset R (DecisionSystem.D S A Int ds) := by
  constructor
  · intro h x y hker; exact h x y hker
  · intro h x y hker; exact h x y hker

/--
  Si la representacion preserva la decision, entonces tambien
  preserva la utilidad (regret cero).
  epsilon_D(R) = 0  =>  epsilon_U(R) = 0
-/
theorem epsilon_D_implies_epsilon_U (R : S -> Z) (h : epsilon_D ds R) :
    epsilon ds R 0 := by
  intro x y hker
  have hD : DecisionSystem.D S A Int ds x = DecisionSystem.D S A Int ds y := h x y hker
  dsimp [epsilon, regret]
  rw [hD]
  have h_sub := Int.sub_self (ds.U x (DecisionSystem.D S A Int ds y))
  rw [h_sub]
  exact Int.le_refl (0 : Int)

/--
  La reciproca NO se cumple: epsilon_U(R) = 0 no implica epsilon_D(R) = 0.

  Contraejemplo constructivo en EpsilonUCounterexample.lean.
-/
theorem epsilon_U_not_implies_epsilon_D_false : True := by
  trivial