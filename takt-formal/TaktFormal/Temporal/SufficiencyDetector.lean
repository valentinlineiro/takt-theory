import TaktFormal.Temporal.PrefixObserver

namespace Temporal

variable {X Y Z : Type}

/-- Executable Sufficiency Detector Principle:
    A boolean detector D : List X → Bool over finite trace prefixes is a Sound Sufficiency Detector
    for dynamic outcome P ∘ generated_trajectory sys if D(trace_prefix sys x0 K) = true
    guarantees finite prefix sufficiency IsPrefixSufficient sys P K. -/
def IsSoundSufficiencyDetector (sys : DeterministicSystem X) (P : StateStream X → Y) (D : List X → Bool) : Prop :=
  ∀ (K : Nat) (x0 : X), D (trace_prefix sys x0 K) = true → IsPrefixSufficient sys P K

/-- Theorem: Sound Detector Governance Guarantee.
    If D is a sound sufficiency detector, then any execution where D(trace_prefix) = true
    is guaranteed to have reached full temporal sufficiency, allowing safe zero-redundancy stopping. -/
theorem sound_detector_governance_guarantee (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D : List X → Bool) (h_sound : IsSoundSufficiencyDetector sys P D) (K : Nat) (x0 : X)
    (h_detected : D (trace_prefix sys x0 K) = true) :
    IsPrefixSufficient sys P K :=
  h_sound K x0 h_detected

/-- Theorem: Sound Detector Termination Monotonicity Guarantee.
    Once a sound detector triggers D(trace_prefix K) = true at step K,
    all subsequent steps K' ≥ K remain fully sufficient. -/
theorem sound_detector_termination_monotonicity_guarantee (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D : List X → Bool) (h_sound : IsSoundSufficiencyDetector sys P D) (K : Nat) (x0 : X)
    (h_detected : D (trace_prefix sys x0 K) = true) (K_prime : Nat) (h_ge : K_prime ≥ K) :
    IsPrefixSufficient sys P K_prime := by
  have h_suff := h_sound K x0 h_detected
  induction h_ge with
  | refl => exact h_suff
  | step _ ih => exact prefix_sufficiency_monotonicity sys P _ ih

end Temporal
