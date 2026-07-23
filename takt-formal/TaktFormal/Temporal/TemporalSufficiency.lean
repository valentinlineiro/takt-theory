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

end Temporal
