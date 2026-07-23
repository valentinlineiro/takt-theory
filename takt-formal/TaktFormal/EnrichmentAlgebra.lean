import TaktFormal.GovernanceGeometry

namespace TaktFormal

section EnrichmentAlgebra

variable {C : Type}

-- Enrichment Composition
def composeEnrichments (e1 e2 : Enrichment C) : Enrichment C :=
  { id := e1.id ++ "∘" ++ e2.id,
    targetCapability := e2.targetCapability,
    preservesSoundness := e1.preservesSoundness && e2.preservesSoundness }

-- Enrichment Join (Combines targets)
def joinEnrichments (e1 e2 : Enrichment C) : Enrichment C :=
  { id := e1.id ++ "∨" ++ e2.id,
    targetCapability := e1.targetCapability, -- Representation of joint capability
    preservesSoundness := e1.preservesSoundness && e2.preservesSoundness }

-- Theorem 3.1: Monoid Soundness Theorem
theorem composition_soundness_valid (e1 e2 : Enrichment C)
    (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    ValidEnrichment (composeEnrichments e1 e2) := by
  dsimp [ValidEnrichment, composeEnrichments] at *
  rw [he1, he2]
  rfl

-- Theorem 3.2: Action Homomorphism Theorem
theorem action_homomorphism (d : Detector C) (e1 e2 : Enrichment C)
    (hd : SoundDetector d) (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    SoundDetector (phi (phi d e1) e2) := by
  apply composition_soundness d e1 e2 hd he1 he2

-- Theorem 3.3: Capability Join Equivalence Theorem
theorem join_soundness_valid (e1 e2 : Enrichment C)
    (he1 : ValidEnrichment e1) (he2 : ValidEnrichment e2) :
    ValidEnrichment (joinEnrichments e1 e2) := by
  dsimp [ValidEnrichment, joinEnrichments] at *
  rw [he1, he2]
  rfl

-- Theorem 3.4: Distance Reduction under Join
theorem distance_reduction_join (d : Detector C) (e1 e2 : Enrichment C)
    (hpos : d.progressMeasure > 0) :
    delta_perfection (phi d (joinEnrichments e1 e2)) < delta_perfection d := by
  apply monotonic_distance_reduction d (joinEnrichments e1 e2) hpos

end EnrichmentAlgebra

end TaktFormal
