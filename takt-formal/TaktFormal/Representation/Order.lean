import TaktFormal.Kernel

open Kernel

/-- Definición 1.1 (Refinamiento): R1 ⊑ R2 si R2 es al menos tan fina como R1 (el kernel de R2 subyace al de R1). -/
def refinement {S Z1 Z2 : Type} (R1 : S → Z1) (R2 : S → Z2) : Prop :=
  kernelSubset R2 R1

namespace RepresentationOrder

variable {S Z1 Z2 Z3 : Type}

theorem refinement_refl (R : S → Z1) : refinement R R :=
  subset_refl

theorem refinement_trans {R1 : S → Z1} {R2 : S → Z2} {R3 : S → Z3}
    (h1 : refinement R1 R2) (h2 : refinement R2 R3) : refinement R1 R3 :=
  fun x y hk => h1 x y (h2 x y hk)

end RepresentationOrder
