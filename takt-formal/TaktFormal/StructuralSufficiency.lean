import TaktFormal.Kernel

open Kernel

section CapabilityTheory

variable {S Z C : Type}
variable (K : C → S → S → Prop)

-- Una representación R provee una capacidad c si su kernel refina K c.
def provides (R : S → Z) (c : C) : Prop :=
  kernelSubset R (fun x y => K c x y)

-- C_R: conjunto de capacidades provistas por R.
def C_R (R : S → Z) (c : C) : Prop :=
  provides K R c

-- C_D: conjunto de capacidades requeridas por la decisión D.
variable (C_D : C → Prop)

-- G(D, R): gap de capacidades.
def G (R : S → Z) (c : C) : Prop :=
  C_D c ∧ ¬ provides K R c

end CapabilityTheory
