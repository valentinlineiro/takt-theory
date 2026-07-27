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

/-- A capability C is locally necessary for runtime M if removing C alters the decision on at least one representation r --/
def NecessaryCapability (C : RuntimeCapability) (M : Runtime α δ) : Prop :=
  ∃ r : α, M.policy r ≠ (removeCapability M C).policy r

/-- A runtime composition M is sufficient with respect to optimal policy pi_star if it preserves decisions for all r --/
def Sufficient (M : Runtime α δ) (pi_star : α → δ) : Prop :=
  ∀ r : α, M.policy r = pi_star r

/-- A runtime composition M is irreducible if every contained capability is necessary --/
def Irreducible (M : Runtime α δ) : Prop :=
  ∀ C ∈ M.capabilities, NecessaryCapability C M

/-- A runtime composition M is minimal if it is both sufficient and irreducible --/
def MinimalRuntime (M : Runtime α δ) (pi_star : α → δ) : Prop :=
  Sufficient M pi_star ∧ Irreducible M

/-- Lemma: A necessary capability implies that removing it destroys decision preservation --/
theorem necessary_implies_non_preservation (C : RuntimeCapability) (M : Runtime α δ) :
    NecessaryCapability C M → ¬ PreservesDecision M (removeCapability M C) := by
  intro h_nec h_pres
  rcases h_nec with ⟨r, h_neq⟩
  have h_eq := h_pres r
  exact h_neq h_eq

/-- Theorem: In any minimal runtime, every capability in its composition set is necessary --/
theorem minimal_implies_all_capabilities_necessary (M : Runtime α δ) (pi_star : α → δ) :
    MinimalRuntime M pi_star → ∀ C ∈ M.capabilities, NecessaryCapability C M := by
  intro h_min C h_in
  exact h_min.2 C h_in

/-- ST-016 Formal Conjecture Statement --/
def ST016_Conjecture (M_full : Runtime α δ) (pi_star : α → δ) : Prop :=
  M_full.capabilities = {RuntimeCapability.contract, RuntimeCapability.uncertainty, RuntimeCapability.temporal} ∧
  MinimalRuntime M_full pi_star

end TaktFormal.RuntimeSufficiency

