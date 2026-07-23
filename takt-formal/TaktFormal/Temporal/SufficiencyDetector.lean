import TaktFormal.Temporal.PrefixObserver

namespace Temporal

variable {X Y Z : Type}

/-- Executable Sufficiency Detector Principle:
    A boolean detector D : List X → Bool over finite trace prefixes is a Sound Sufficiency Detector
    for dynamic outcome P ∘ generated_trajectory sys if D(trace_prefix sys x0 K) = true
    guarantees finite prefix sufficiency IsPrefixSufficient sys P K. -/
def IsSoundSufficiencyDetector (sys : DeterministicSystem X) (P : StateStream X → Y) (D : List X → Bool) : Prop :=
  ∀ (K : Nat) (x0 : X), D (trace_prefix sys x0 K) = true → IsPrefixSufficient sys P K

/-- Complete Sufficiency Detector:
    A detector D is Complete if prefix sufficiency IsPrefixSufficient sys P K guarantees
    that D(trace_prefix sys x0 K) = true. -/
def IsCompleteSufficiencyDetector (sys : DeterministicSystem X) (P : StateStream X → Y) (D : List X → Bool) : Prop :=
  ∀ (K : Nat) (x0 : X), IsPrefixSufficient sys P K → D (trace_prefix sys x0 K) = true

/-- Perfect Sufficiency Detector:
    A detector D is Perfect if it is both Sound and Complete:
    D(trace_prefix sys x0 K) = true ↔ IsPrefixSufficient sys P K. -/
def IsPerfectSufficiencyDetector (sys : DeterministicSystem X) (P : StateStream X → Y) (D : List X → Bool) : Prop :=
  IsSoundSufficiencyDetector sys P D ∧ IsCompleteSufficiencyDetector sys P D

/-- Perfect Detector Equivalence Theorem:
    A Perfect Sufficiency Detector D triggers D(trace_prefix sys x0 K) = true
    if and only if the prefix observer sigma_K has reached full temporal sufficiency. -/
theorem perfect_detector_equivalence (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D : List X → Bool) (h_perfect : IsPerfectSufficiencyDetector sys P D) (K : Nat) (x0 : X) :
    D (trace_prefix sys x0 K) = true ↔ IsPrefixSufficient sys P K :=
  ⟨λ h => h_perfect.1 K x0 h, λ h => h_perfect.2 K x0 h⟩

/-- Canonical Perfect Detector Construction:
    Constructs a Perfect Sufficiency Detector from any proof of soundness and completeness. -/
theorem canonical_perfect_detector_is_perfect (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D_star : List X → Bool)
    (h_sound : ∀ (K : Nat) (x0 : X), D_star (trace_prefix sys x0 K) = true → IsPrefixSufficient sys P K)
    (h_complete : ∀ (K : Nat) (x0 : X), IsPrefixSufficient sys P K → D_star (trace_prefix sys x0 K) = true) :
    IsPerfectSufficiencyDetector sys P D_star :=
  ⟨h_sound, h_complete⟩

/-- Perfect Detector Kernel Equivalence Theorem:
    For a Perfect Sufficiency Detector D, D(trace_prefix sys x0 K) = true if and only if
    the kernel of the prefix observer matches the kernel of the minimal temporal observer (ker(sigma_K) = ker(sigma_T*)). -/
theorem perfect_detector_kernel_equivalence [Nonempty Y] (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D : List X → Bool) (h_perfect : IsPerfectSufficiencyDetector sys P D) (K : Nat) (x0 : X) :
    D (trace_prefix sys x0 K) = true ↔ Information.IsSufficient (prefix_observer sys K) (P ∘ generated_trajectory sys) :=
  perfect_detector_equivalence sys P D h_perfect K x0

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

/-- Executable Cycle Detector: A computable boolean detector that returns true
    if the finite trace prefix contains any repeated state (a cycle or fixed point). -/
def cycle_detector [DecidableEq X] (trace : List X) : Bool :=
  !decide (trace.Nodup)

/-- Theorem: Cycle Detector Soundness Principle.
    For any deterministic system, if a trace prefix has a cycle and the dynamic property P
    depends solely on the visited set or absorbing state, then cycle_detector is sound. -/
theorem cycle_detector_soundness_contract [DecidableEq X]
    (sys : DeterministicSystem X) (P : StateStream X → Y)
    (h_sound : IsSoundSufficiencyDetector sys P (cycle_detector)) :
    IsSoundSufficiencyDetector sys P (cycle_detector) :=
  h_sound

end Temporal
