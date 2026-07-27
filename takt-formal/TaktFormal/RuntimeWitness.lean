import TaktFormal.RuntimeSufficiency

namespace TaktFormal.RuntimeWitness

open TaktFormal.RuntimeSufficiency

universe u v

/-- Layer 1: Pure data structure for imported witness artifacts --/
structure WitnessArtifact (α : Type u) (δ : Type v) where
  capability : RuntimeCapability
  representation : α
  fullDecision : δ
  reducedDecision : δ
  preservedState : Prop

/-- Layer 2: Certification predicate checking consistency between witness data and runtime policy --/
def WitnessConsistentWithRuntime (M : Runtime α δ) (w : WitnessArtifact α δ) : Prop :=
  M.policy w.representation = w.fullDecision ∧
  (removeCapability M w.capability).policy w.representation = w.reducedDecision ∧
  w.fullDecision ≠ w.reducedDecision ∧
  w.preservedState

/-- Layer 3: Elevation Theorem — A certified witness implies capability necessity --/
theorem validWitness_implies_necessity {α : Type u} {δ : Type v} {M : Runtime α δ} {w : WitnessArtifact α δ}
    (h_valid : WitnessConsistentWithRuntime M w) :
    NecessaryCapability w.capability M := by
  exists w.representation
  have h_full := h_valid.1
  have h_red := h_valid.2.1
  have h_neq := h_valid.2.2.1
  rw [h_full, h_red]
  exact h_neq

/-- Construct formal witness representation for a specific capability --/
def createWitnessInstance {α : Type u} {δ : Type v} (cap : RuntimeCapability) (r : α) (d_full d_red : δ)
    (h_pres : Prop) : WitnessArtifact α δ :=
  { capability := cap,
    representation := r,
    fullDecision := d_full,
    reducedDecision := d_red,
    preservedState := h_pres }

end TaktFormal.RuntimeWitness
