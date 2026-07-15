/-
TAKT v1 - Kernel.lean (Capa 0)
Contraccion abstracta de funciones.

Define el kernel de una funcion y la inclusion de kernels,
independientemente de cualquier nocion de decision, utilidad,
accion o regret.

Factorization.lean importara este archivo para construir el
teorema de factorizacion sobre la relacion aqui definida.
-/

/-- El kernel de `f` es la relacion de equivalencia inducida
    por sus fibras: `x` e `y` son equivalentes si `f` produce
    el mismo valor para ambos. -/
def kernel {α β : Type} (f : α → β) : α → α → Prop :=
  fun x y => f x = f y

/-- Proposicion: el kernel de `f` esta contenido en el kernel
    de `g` - toda distincion que hace `f` tambien la hace `g`. -/
def kernelSubset {α β γ : Type} (f : α → β) (g : α → γ) : Prop :=
  ∀ x y, kernel f x y → kernel g x y

namespace Kernel

variable {α β γ : Type} {f g h : α → β}

/-! Propiedades basicas del kernel -/

theorem refl (x : α) : kernel f x x :=
  rfl

theorem symm {x y : α} (h : kernel f x y) : kernel f y x :=
  h.symm

theorem trans {x y z : α} (h₁ : kernel f x y) (h₂ : kernel f y z) : kernel f x z :=
  h₁.trans h₂

theorem of_eq {x y : α} (h : x = y) : kernel f x y :=
  congrArg f h

/-- Si dos funciones son iguales punto a punto, sus kernels coinciden. -/
theorem congr_fun (hf : ∀ x, f x = g x) (h : kernel f x y) : kernel g x y :=
  by
    dsimp [kernel] at *
    calc
      g x = f x := (hf x).symm
      _   = f y := h
      _   = g y := hf y

/-! Propiedades de `kernelSubset` -/

theorem subset_refl : kernelSubset f f :=
  fun _ _ h => h

theorem subset_trans (h₁ : kernelSubset f g) (h₂ : kernelSubset g h) : kernelSubset f h :=
  fun x y hk => h₂ x y (h₁ x y hk)

theorem subset_iff : kernelSubset f g ↔ ∀ x y, f x = f y → g x = g y := by
  constructor
  · intro h x y hfx
    exact h x y hfx
  · intro h x y hk
    exact h x y hk

/-- `kernelSubset` es equivalente a la afirmacion de que dos
    elementos con la misma imagen bajo `f` tienen la misma imagen
    bajo `g`. -/
theorem subset_iff' : kernelSubset f g ↔ ∀ x y, f x = f y → g x = g y :=
  subset_iff

/-- `kernelSubset` es reflexiva y transitiva: preorden sobre funciones. -/
theorem subset_preorder_refl : kernelSubset f f := subset_refl

theorem subset_preorder_trans (h₁ : kernelSubset f g) (h₂ : kernelSubset g h) : kernelSubset f h :=
  subset_trans h₁ h₂

/-- La funcion identidad induce el kernel mas fino posible:
    solo identifica puntos iguales. Toda funcion tiene un kernel
    mas grueso. -/
theorem subset_id : kernelSubset id f :=
  fun _ _ h => by
    dsimp [kernel, id] at h
    exact congrArg f h

/-! Composicion y kernels -/

theorem comp_subset (g : β → γ) : kernelSubset f (g ∘ f) :=
  fun x y h => by
    dsimp [kernel, Function.comp]
    rw [h]

/-- Si `g` es inyectiva, componer con `g` preserva el kernel. -/
theorem comp_inj (g : β → γ) (hg : Function.Injective g) : kernelSubset (g ∘ f) f :=
  fun x y h => by
    dsimp [kernel, Function.comp] at h
    apply hg h

theorem comp_eq (g : β → γ) (hg : Function.Injective g) : kernel (g ∘ f) = kernel f := by
  ext x y
  constructor
  · apply comp_inj g hg x y
  · apply comp_subset g x y

/-! Lema de factorizacion

    Si `kernelSubset R D`, entonces para cualesquiera `x`, `y`
    con `R x = R y`, se tiene `D x = D y`.

    Este lema es la precondicion para construir `π : Z → A`
    tal que `D = π ∘ R` en Factorization.lean.
-/
theorem factorization_precondition {Z A : Type} (R : α → Z) (D : α → A)
    (h : kernelSubset R D) (x y : α) (hR : R x = R y) : D x = D y :=
  h x y hR

end Kernel
