import TaktFormal.Kernel
import TaktFormal.Representation.Order

open Kernel

/-- Definición 2.1 (Equivalencia de Núcleos): R1 y R2 inducen las mismas fibras. -/
def kernelEquiv {S Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2) : Prop :=
  kernelSubset R1 R2 ∧ kernelSubset R2 R1

namespace KernelEquivalence

variable {S Z1 Z2 Z3 : Type}

theorem equiv_refl (R : S → Z1) : kernelEquiv R R :=
  ⟨subset_refl, subset_refl⟩

theorem equiv_symm {R1 : S → Z1} {R2 : S → Z2} (h : kernelEquiv R1 R2) : kernelEquiv R2 R1 :=
  ⟨h.2, h.1⟩

theorem equiv_trans {R1 : S → Z1} {R2 : S → Z2} {R3 : S → Z3}
    (h1 : kernelEquiv R1 R2) (h2 : kernelEquiv R2 R3) : kernelEquiv R1 R3 :=
  ⟨fun x y hk => h2.1 x y (h1.1 x y hk), fun x y hk => h1.2 x y (h2.2 x y hk)⟩

/-- Lema 2.1 (Orden de refinamiento bien definido modulo equivalencia): -/
theorem refinement_well_defined {R1 R1' : S → Z1} {R2 R2' : S → Z2}
    (he1 : kernelEquiv R1 R1') (he2 : kernelEquiv R2 R2') :
    refinement R1 R2 ↔ refinement R1' R2' := by
  dsimp [refinement]
  constructor
  · intro h x y hk
    exact he1.1 x y (h x y (he2.2 x y hk))
  · intro h x y hk
    exact he1.2 x y (h x y (he2.1 x y hk))

end KernelEquivalence
