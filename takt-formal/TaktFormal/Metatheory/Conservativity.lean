import TaktFormal.StructuralSufficiency
import TaktFormal.GovernanceGeometry
import TaktFormal.ApproximateGovernance

/-!
Module: TaktFormal.Metatheory.Conservativity
Depends on: TaktFormal.StructuralSufficiency, TaktFormal.GovernanceGeometry, TaktFormal.ApproximateGovernance
Exports: CoreSufficiency, GovernedState, embedding_iota, theory_embedding_conservative, collapse_to_structural_sufficiency
-/

namespace TaktFormal
namespace Metatheory

section Conservativity

/-- State equivalence relation type --/
def StateEquiv (S : Type) : Type := S → S → Prop

/-- Kernel refinement relation on binary state relations --/
def IsKernelRefinement {S : Type} (R1 R2 : StateEquiv S) : Prop :=
  ∀ x y, R1 x y → R2 x y

/-- Core representation sufficiency predicate (Phase I-III) --/
def CoreSufficiency {S : Type} (kerR KD : StateEquiv S) : Prop :=
  IsKernelRefinement kerR KD

/-- Governance predicate in IV-C --/
def GovernedState {S : Type} (delta : Nat) (eps : Nat) (kerR KD : StateEquiv S) : Prop :=
  delta = 0 ∧ eps = 0 ∧ IsKernelRefinement kerR KD

/-- Conservative embedding map ι from Core to IV-C --/
def embedding_iota {S : Type} (kerR KD : StateEquiv S) : Prop :=
  CoreSufficiency kerR KD

/-- Theorem V-A.1: Conservative Theory Embedding --/
theorem theory_embedding_conservative {S : Type} (kerR KD : StateEquiv S) :
    CoreSufficiency kerR KD ↔ embedding_iota kerR KD := by
  rfl

/-- Corollary: Collapse of Gov_0 to Structural Sufficiency (ST-015) --/
theorem collapse_to_structural_sufficiency {S : Type} (kerR KD : StateEquiv S) :
    GovernedState 0 0 kerR KD ↔ CoreSufficiency kerR KD := by
  dsimp [GovernedState, CoreSufficiency]
  constructor
  · intro h
    exact h.2.2
  · intro h
    exact ⟨rfl, rfl, h⟩

end Conservativity
end Metatheory
end TaktFormal
