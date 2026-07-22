import TaktFormal.Representation.Refinement
import TaktFormal.StructuralSufficiency

open Kernel

/-- Prove that the kernel of a function is a valid equivalence relation. -/
theorem kernel_equiv {S Z : Type} (R : S → Z) : Equivalence (kernel R) where
  refl := refl
  symm := symm
  trans := trans

/-- Bridge between Volume I function-based kernels and Volume II relation-based preorders.
    Given S, Z, and a representation function R : S → Z, it constructs the canonical EquivRel. -/
def functionKernelToEquivRel {S Z : Type} (R : S → Z) : EquivRel S where
  val := kernel R
  property := kernel_equiv R

/-- Decisional sufficiency translated to the preorder space.
    An abstract representation `e` (as an equivalence relation) is sufficient for a decision `e_D`
    if `e` is finer than `e_D` (meaning it makes at least as many distinctions).
    In our preorder convention, this is written as `equiv_refinement e_D e`. -/
def IsSufficientPreorder {S : Type} (e_D e : EquivRel S) : Prop :=
  equiv_refinement e_D e

/-- Prove that the preorder definition of sufficiency matches Volume I's kernelSubset. -/
theorem sufficiency_bridge_matches_vol1 {S Z A : Type} (R : S → Z) (D : S → A) :
    kernelSubset R D ↔ IsSufficientPreorder (functionKernelToEquivRel D) (functionKernelToEquivRel R) := by
  constructor
  · intro h s1 s2 hker
    exact h s1 s2 hker
  · intro h s1 s2 hker
    exact h hker
