import Mathlib.Data.Set.Basic

namespace TaktFormal.RuntimeSufficiency

universe u v

variable {α : Type u} {δ : Type v}

/-- Abstract theoretical runtime capabilities --/
inductive RuntimeCapability
  | contract
  | uncertainty
  | temporal
  deriving DecidableEq

/-- Abstract runtime composition with capability set and decision policy --/
structure Runtime (α : Type u) (δ : Type v) where
  capabilities : Set RuntimeCapability
  policy : α → δ

/-- Remove a capability from a runtime composition --/
def removeCapability (M : Runtime α δ) (C : RuntimeCapability) : Runtime α δ :=
  { capabilities := M.capabilities \ {C},
    policy := M.policy }

/-- Decision preservation between two runtime compositions --/
def PreservesDecision (M1 M2 : Runtime α δ) : Prop :=
  ∀ r : α, M1.policy r = M2.policy r

end TaktFormal.RuntimeSufficiency
