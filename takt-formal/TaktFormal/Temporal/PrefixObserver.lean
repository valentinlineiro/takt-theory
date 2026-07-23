import TaktFormal.Temporal.TemporalSufficiency

namespace Temporal

variable {X Y Z Z1 Z2 : Type}

/-- Finite Trace Prefix of length K generated from initial state x0. -/
def trace_prefix (sys : DeterministicSystem X) (x0 : X) (K : Nat) : List X :=
  (List.range (K + 1)).map (λ n => (generated_trajectory sys x0) n)

/-- Finite Prefix Observer: Maps initial state x0 to its finite trace prefix of length K. -/
def prefix_observer (sys : DeterministicSystem X) (K : Nat) : X → List X :=
  λ x0 => trace_prefix sys x0 K

/-- Theorem: Temporal Prefix Information Monotonicity.
    A longer observation prefix K + 1 refines a shorter observation prefix K (prefix_observer K ≤_info prefix_observer (K + 1)). -/
theorem prefix_observer_monotonicity (sys : DeterministicSystem X) (K : Nat) :
    Information.RefinesInfo (prefix_observer sys K) (prefix_observer sys (K + 1)) := by
  refine ⟨List.take (K + 1), λ x0 => ?_⟩
  dsimp [prefix_observer, trace_prefix]
  rw [← List.map_take, List.take_range]
  rw [Nat.min_eq_left (Nat.le_succ (K + 1))]

/-- Definition: Finite Prefix Sufficiency Horizon.
    A prefix length K is temporally sufficient for outcome P ∘ generated_trajectory sys
    iff the finite prefix observer prefix_observer K is sufficient. -/
def IsPrefixSufficient (sys : DeterministicSystem X) (P : StateStream X → Y) (K : Nat) : Prop :=
  Information.IsSufficient (prefix_observer sys K) (P ∘ generated_trajectory sys)

/-- Theorem: Monotonicity of Prefix Sufficiency.
    If prefix length K is sufficient, then any longer prefix K + 1 is also sufficient. -/
theorem prefix_sufficiency_monotonicity (sys : DeterministicSystem X) (P : StateStream X → Y) (K : Nat)
    (h_suff : IsPrefixSufficient sys P K) : IsPrefixSufficient sys P (K + 1) :=
  Information.sufficiency_monotonicity (prefix_observer sys K) (prefix_observer sys (K + 1))
    (P ∘ generated_trajectory sys) (prefix_observer_monotonicity sys K) h_suff

end Temporal
