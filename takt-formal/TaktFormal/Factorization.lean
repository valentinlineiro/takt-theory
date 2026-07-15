/-
TAKT v1 - Factorization.lean (Capa 0)
Teorema de factorizacion: inclusion de kernels ↔ factorizacion.

Prueba el teorema central de Capa 0:

    ker(R) ⊆ ker(D)  ⇔  ∃π, D = π∘R

La parte directa (←) es comp_subset de Kernel.lean.
La parte inversa (→) construye π por eleccion clasica: para cada
z : Z, si existe x con R x = z, define π(z) con D(x); si no,
asigna un valor arbitrario de A (que existe por [Nonempty A]).

[Nonempty A] es la unica restriccion: la imagen de π fuera del
rango de R necesita un valor testigo. En TAKT, A es el contra-
dominio de la funcion de decision, siempre no-vacio.
-/

import TaktFormal.Kernel

open Kernel

set_option pp.universes true

/--
  Parte inversa: ker(R) ⊆ ker(D)  ⇒  ∃π, ∀x, D x = π(R x).

  Construccion:
    Para cada z : Z, si ∃x, R x = z, elegimos uno tal y aplicamos D.
    Si no, usamos un valor testigo de A (gracias a [Nonempty A]).
    La buena definicion para z en la imagen de R se sigue de h.
-/
private theorem factorization_forward {α Z A : Type} [Nonempty A] (R : α → Z) (D : α → A)
    (h : kernelSubset R D) : ∃ (π : Z → A), ∀ x, D x = π (R x) := by
  classical
    let π : Z → A := λ z =>
      if hz : ∃ (x : α), R x = z then
        D (Classical.choose hz)
      else
        Classical.choice (by infer_instance)
    refine ⟨π, λ x => ?_⟩
    dsimp [π]
    have hx : ∃ (x' : α), R x' = R x := ⟨x, rfl⟩
    rw [dif_pos hx]
    have h_eq : R (Classical.choose hx) = R x := Classical.choose_spec hx
    have h_ker : D (Classical.choose hx) = D x :=
      h (Classical.choose hx) x (by
        dsimp [kernel]
        exact h_eq)
    exact h_ker.symm

/--
  Parte directa: ∃π, ∀x, D x = π(R x)  ⇒  ker(R) ⊆ ker(D).

  Se sigue directamente de comp_subset: si D = π∘R, entonces
  R x = R y implica D x = D y.
-/
private theorem factorization_backward {α Z A : Type} (R : α → Z) (D : α → A) :
    (∃ (π : Z → A), ∀ x, D x = π (R x)) → kernelSubset R D := by
  rintro ⟨π, h⟩ x y hk
  dsimp [kernel, kernelSubset]
  calc
    D x = π (R x) := h x
    _   = π (R y) := by rw [hk]
    _   = D y   := (h y).symm

/--
  Teorema de factorizacion:

      ker(R) ⊆ ker(D)  ⇔  ∃π, D = π∘R

  La restriccion [Nonempty A] cubre valores de Z fuera de la
  imagen de R y no afecta el significado del teorema: si A fuera
  vacio, D no podria depender de α no vacio, y el caso degenerado
  α vacio hace la tesis trivial.
-/
theorem factorization {α Z A : Type} [Nonempty A] (R : α → Z) (D : α → A) :
    kernelSubset R D ↔ ∃ (π : Z → A), ∀ x, D x = π (R x) := by
  constructor
  · exact factorization_forward R D
  · exact factorization_backward R D
