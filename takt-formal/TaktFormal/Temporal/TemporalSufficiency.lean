import TaktFormal.Temporal.FiniteDynamics

namespace Temporal

variable {X Y Z Z1 Z2 : Type}

/-- Temporal Sufficiency: A trajectory observer `sigma : StateStream X → Z` is temporally sufficient
    for a dynamic trajectory property `P : StateStream X → Y` iff P factorizes through sigma. -/
def IsTemporalSufficient (sigma : StateStream X → Z) (P : StateStream X → Y) : Prop :=
  Information.IsSufficient sigma P

/-- Temporal Information Refinement: Observer sigma1 is coarser than observer sigma2
    (sigma1 ≤_time sigma2) iff sigma1 factorizes through sigma2. -/
def RefinesTemporalInfo (sigma1 : StateStream X → Z1) (sigma2 : StateStream X → Z2) : Prop :=
  Information.RefinesInfo sigma1 sigma2

/-- Theorem: Monotonicity of Temporal Information Sufficiency.
    If observer sigma1 refines sigma2 and sigma1 is temporally sufficient for P,
    then sigma2 is also temporally sufficient for P. -/
theorem temporal_sufficiency_monotonicity (sigma1 : StateStream X → Z1) (sigma2 : StateStream X → Z2)
    (P : StateStream X → Y) (h_ref : RefinesTemporalInfo sigma1 sigma2)
    (h_suff : IsTemporalSufficient sigma1 P) : IsTemporalSufficient sigma2 P :=
  Information.sufficiency_monotonicity sigma1 sigma2 P h_ref h_suff

/-- Complete Characterization Theorem of Temporal-to-Static Reducibility:
    A static initial state observer f is sufficient for the dynamic temporal trajectory outcome
    P ∘ generated_trajectory sys if and only if any two initial states sharing the same initial observation
    produce identical temporal trajectory outcomes. -/
theorem static_observation_temporal_sufficiency_characterization [Nonempty Y]
    (sys : DeterministicSystem X) (P : StateStream X → Y) (f : X → Z) :
    Information.IsSufficient f (P ∘ generated_trajectory sys) ↔
    (∀ x1 x2 : X, f x1 = f x2 → P (generated_trajectory sys x1) = P (generated_trajectory sys x2)) :=
  Information.sufficiency_kernel_equivalence f (P ∘ generated_trajectory sys)

/-- Non-Reducibility Separation Principle:
    If two initial states x1 and x2 share identical initial observations (f x1 = f x2),
    but generate trajectories under dynamics T with differing temporal outcomes (P(tau_x1) ≠ P(tau_x2)),
    then the static initial state observer f CANNOT be sufficient for the temporal trajectory outcome. -/
theorem static_observation_temporal_insufficiency_separation
    (sys : DeterministicSystem X) (P : StateStream X → Y) (f : X → Z)
    (x1 x2 : X) (h_same_obs : f x1 = f x2)
    (h_diff_outcome : P (generated_trajectory sys x1) ≠ P (generated_trajectory sys x2)) :
    ¬ Information.IsSufficient f (P ∘ generated_trajectory sys) := by
  rintro ⟨h, h_eq⟩
  have h1 : P (generated_trajectory sys x1) = h (f x1) := h_eq x1
  have h2 : P (generated_trajectory sys x2) = h (f x2) := h_eq x2
  rw [h_same_obs] at h1
  have h3 : P (generated_trajectory sys x2) = P (generated_trajectory sys x1) := by
    rw [h2, h1]
  exact h_diff_outcome h3.symm

/-- Temporal Kernel Equivalence Relation:
    Two initial states x1 and x2 are temporally equivalent under dynamics sys and outcome P
    iff they yield identical dynamic trajectory outcomes. -/
def TemporalEquivalence (sys : DeterministicSystem X) (P : StateStream X → Y) (x1 x2 : X) : Prop :=
  P (generated_trajectory sys x1) = P (generated_trajectory sys x2)

/-- Reflexivity of Temporal Equivalence. -/
theorem temporal_equivalence_refl (sys : DeterministicSystem X) (P : StateStream X → Y) (x : X) :
    TemporalEquivalence sys P x x := rfl

/-- Symmetry of Temporal Equivalence. -/
theorem temporal_equivalence_symm (sys : DeterministicSystem X) (P : StateStream X → Y) (x1 x2 : X)
    (h : TemporalEquivalence sys P x1 x2) : TemporalEquivalence sys P x2 x1 := h.symm

/-- Transitivity of Temporal Equivalence. -/
theorem temporal_equivalence_trans (sys : DeterministicSystem X) (P : StateStream X → Y) (x1 x2 x3 : X)
    (h12 : TemporalEquivalence sys P x1 x2) (h23 : TemporalEquivalence sys P x2 x3) :
    TemporalEquivalence sys P x1 x3 := h12.trans h23

/-- Minimal Temporal Observer: Maps an initial state x to its trajectory outcome P(tau_x). -/
def canonical_temporal_observer (sys : DeterministicSystem X) (P : StateStream X → Y) : X → Y :=
  P ∘ generated_trajectory sys

/-- Theorem: The Canonical Temporal Observer is Minimal Sufficient for the Dynamic Trajectory Outcome. -/
theorem canonical_temporal_observer_is_minimal_sufficient (sys : DeterministicSystem X) (P : StateStream X → Y) :
    Information.IsMinimalSufficient (canonical_temporal_observer sys P) (P ∘ generated_trajectory sys) := by
  constructor
  · exact ⟨id, λ _ => rfl⟩
  · intro Z_other f_other h_suff
    rcases h_suff with ⟨h_map, h_eq⟩
    exact ⟨h_map, λ x => h_eq x⟩

end Temporal
