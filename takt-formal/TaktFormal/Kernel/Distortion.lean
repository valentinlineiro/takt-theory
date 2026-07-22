import TaktFormal.Morphism.Distortion
import TaktFormal.Kernel.Basic

variable {R : RepresentationSpace} {L : CostSpace} {D : DistortionSpace}

/-- Equivalence of elements in the distortion space under its preorder. -/
def DistortionSpaceEquiv (D : DistortionSpace) (d1 d2 : D.Carrier) : Prop :=
  D.le d1 d2 ∧ D.le d2 d1

namespace DistortionSpaceEquiv

theorem refl (D : DistortionSpace) (d : D.Carrier) : DistortionSpaceEquiv D d d :=
  ⟨D.le_refl d, D.le_refl d⟩

theorem symm {D : DistortionSpace} {d1 d2 : D.Carrier} (h : DistortionSpaceEquiv D d1 d2) :
    DistortionSpaceEquiv D d2 d1 :=
  ⟨h.2, h.1⟩

theorem trans {D : DistortionSpace} {d1 d2 d3 : D.Carrier}
    (h1 : DistortionSpaceEquiv D d1 d2) (h2 : DistortionSpaceEquiv D d2 d3) :
    DistortionSpaceEquiv D d1 d3 :=
  ⟨D.le_trans h1.1 h2.1, D.le_trans h2.2 h1.2⟩

theorem equivalence (D : DistortionSpace) : Equivalence (DistortionSpaceEquiv D) where
  refl := refl D
  symm := symm
  trans := trans

end DistortionSpaceEquiv

/-- Equivalence of distortion fields. -/
def DistortionFieldEquiv (df1 df2 : DistortionField R D) : Prop :=
  DistortionSpaceEquiv D df1.global_bound df2.global_bound ∧
  ∀ {a b : R.Rep} (hab : R.le a b), DistortionSpaceEquiv D (df1.val hab) (df2.val hab)

namespace DistortionFieldEquiv

theorem refl (df : DistortionField R D) : DistortionFieldEquiv df df :=
  ⟨DistortionSpaceEquiv.refl D df.global_bound, fun _ => DistortionSpaceEquiv.refl D _⟩

theorem symm {df1 df2 : DistortionField R D} (h : DistortionFieldEquiv df1 df2) :
    DistortionFieldEquiv df2 df1 :=
  ⟨DistortionSpaceEquiv.symm h.1, fun hab => DistortionSpaceEquiv.symm (h.2 hab)⟩

theorem trans {df1 df2 df3 : DistortionField R D}
    (h1 : DistortionFieldEquiv df1 df2) (h2 : DistortionFieldEquiv df2 df3) :
    DistortionFieldEquiv df1 df3 :=
  ⟨DistortionSpaceEquiv.trans h1.1 h2.1, fun hab => DistortionSpaceEquiv.trans (h1.2 hab) (h2.2 hab)⟩

theorem equivalence : Equivalence (@DistortionFieldEquiv R D) where
  refl := refl
  symm := symm
  trans := trans

end DistortionFieldEquiv

/-- The distortion/stability kernel relation on cost functionals. -/
def DistortionKernel (theta : DistortionMorphism R L D) (cf1 cf2 : CostFunctional R L) : Prop :=
  MorphismKernel (fun cf => theta.eval cf) DistortionFieldEquiv cf1 cf2

namespace DistortionKernel

/-- Prove that DistortionKernel is a valid equivalence relation. -/
theorem equivalence (theta : DistortionMorphism R L D) : Equivalence (DistortionKernel theta) :=
  MorphismKernel.equivalence (f := fun cf => theta.eval cf) DistortionFieldEquiv.equivalence

end DistortionKernel
