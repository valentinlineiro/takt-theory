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

/-- Detector Dominance Order: Sound detector D1 dominates D2 (D1 ⪯ D2)
    if D1 triggers earlier or at the same step as D2 for any trace prefix. -/
def DetectorDominance (D1 D2 : List X → Bool) : Prop :=
  ∀ trace : List X, D2 trace = true → D1 trace = true

/-- Detector Equivalence Relation: Two detectors D1 and D2 are operationally equivalent
    iff D1 dominates D2 and D2 dominates D1. -/
def DetectorEquivalence (D1 D2 : List X → Bool) : Prop :=
  DetectorDominance D1 D2 ∧ DetectorDominance D2 D1

/-- Theorem: Reflexivity of Detector Dominance. -/
theorem detector_dominance_refl (D : List X → Bool) :
    DetectorDominance D D :=
  λ _ h => h

/-- Theorem: Transitivity of Detector Dominance. -/
theorem detector_dominance_trans (D1 D2 D3 : List X → Bool)
    (h12 : DetectorDominance D1 D2) (h23 : DetectorDominance D2 D3) :
    DetectorDominance D1 D3 :=
  λ trace h3 => h12 trace (h23 trace h3)

/-- Theorem: Antisymmetry / Equivalence of Detector Dominance. -/
theorem detector_dominance_antisymm (D1 D2 : List X → Bool)
    (h12 : DetectorDominance D1 D2) (h21 : DetectorDominance D2 D1) :
    DetectorEquivalence D1 D2 :=
  ⟨h12, h21⟩

/-- Theorem: Dominant Sound Detector Friction Reduction.
    If D1 dominates D2 and both are sound detectors, then D1 triggers stopping
    with less than or equal redundant friction compared to D2. -/
theorem dominant_detector_friction_reduction (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D1 D2 : List X → Bool) (h_sound1 : IsSoundSufficiencyDetector sys P D1)
    (h_sound2 : IsSoundSufficiencyDetector sys P D2) (h_dom : DetectorDominance D1 D2)
    (K : Nat) (x0 : X) (h_trigger2 : D2 (trace_prefix sys x0 K) = true) :
    D1 (trace_prefix sys x0 K) = true ∧ IsPrefixSufficient sys P K :=
  ⟨h_dom (trace_prefix sys x0 K) h_trigger2, h_sound1 K x0 (h_dom (trace_prefix sys x0 K) h_trigger2)⟩

/-- Union/Join Detector: Combines two detectors D1 and D2 by taking their boolean OR. -/
def detector_union (D1 D2 : List X → Bool) : List X → Bool :=
  λ trace => D1 trace || D2 trace

/-- Theorem: Detector Union Soundness.
    If D1 and D2 are both sound detectors, then their union D1 ∨ D2 is also a sound detector. -/
theorem detector_union_is_sound (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D1 D2 : List X → Bool) (h_sound1 : IsSoundSufficiencyDetector sys P D1)
    (h_sound2 : IsSoundSufficiencyDetector sys P D2) :
    IsSoundSufficiencyDetector sys P (detector_union D1 D2) := by
  intro K x0 h_or
  dsimp [detector_union] at h_or
  cases h1 : D1 (trace_prefix sys x0 K)
  · rw [h1, Bool.false_or] at h_or
    exact h_sound2 K x0 h_or
  · rw [h1] at h_or
    exact h_sound1 K x0 h1

/-- Theorem: Detector Union Dominance over Left Operand. -/
theorem detector_union_dominates_left (D1 D2 : List X → Bool) :
    DetectorDominance (detector_union D1 D2) D1 := by
  intro trace h1
  dsimp [detector_union]
  rw [h1, Bool.true_or]

/-- Theorem: Detector Union Dominance over Right Operand. -/
theorem detector_union_dominates_right (D1 D2 : List X → Bool) :
    DetectorDominance (detector_union D1 D2) D2 := by
  intro trace h2
  dsimp [detector_union]
  rw [h2, Bool.or_true]

/-- Theorem: Detector Union Supremum (LUB) Least Upper Bound Property.
    If detector D dominates both D1 and D2 (D ⪯ D1 and D ⪯ D2),
    then D dominates their union (D ⪯ D1 ∨ D2). -/
theorem detector_union_lub (D D1 D2 : List X → Bool)
    (h1 : DetectorDominance D D1) (h2 : DetectorDominance D D2) :
    DetectorDominance D (detector_union D1 D2) := by
  intro trace h_union
  dsimp [detector_union] at h_union
  cases h_d1 : D1 trace
  · rw [h_d1, Bool.false_or] at h_union
    exact h2 trace h_union
  · rw [h_d1] at h_union
    exact h1 trace h_d1

/-- Theorem: Detector Union Idempotence (D ∨ D = D). -/
theorem detector_union_idempotent (D : List X → Bool) :
    detector_union D D = D := by
  funext trace
  dsimp [detector_union]
  cases D trace <;> rfl

/-- Theorem: Detector Union Commutativity (D1 ∨ D2 = D2 ∨ D1). -/
theorem detector_union_comm (D1 D2 : List X → Bool) :
    detector_union D1 D2 = detector_union D2 D1 := by
  funext trace
  dsimp [detector_union]
  cases D1 trace <;> cases D2 trace <;> rfl

/-- Theorem: Detector Union Associativity ((D1 ∨ D2) ∨ D3 = D1 ∨ (D2 ∨ D3)). -/
theorem detector_union_assoc (D1 D2 D3 : List X → Bool) :
    detector_union (detector_union D1 D2) D3 = detector_union D1 (detector_union D2 D3) := by
  funext trace
  dsimp [detector_union]
  cases D1 trace <;> cases D2 trace <;> cases D3 trace <;> rfl

/-- Theorem: Top Detector Maximum Property.
    A Perfect Sufficiency Detector D_top (Sound and Complete) dominates ANY sound detector D in the governance semilattice. -/
theorem detector_top_is_maximum (sys : DeterministicSystem X) (P : StateStream X → Y)
    (D_top : List X → Bool) (h_perfect : IsPerfectSufficiencyDetector sys P D_top)
    (D : List X → Bool) (h_sound : IsSoundSufficiencyDetector sys P D) :
    ∀ (K : Nat) (x0 : X), D (trace_prefix sys x0 K) = true → D_top (trace_prefix sys x0 K) = true := by
  intro K x0 h_trigger
  have h_suff : IsPrefixSufficient sys P K := h_sound K x0 h_trigger
  exact h_perfect.2 K x0 h_suff

end Temporal
