import TaktFormal.RuntimeConvergence

namespace TaktFormal

section ImpossibilityLimits

variable {C : Type}

def EmptyProviderSpace (providers : (Enrichment C) → Prop) : Prop :=
  ∀ e, ¬ providers e

-- Theorem 3.1: Unreachability Limit Theorem
theorem empty_providers_unreachable (d_alg d_top : Detector C) (providers : (Enrichment C) → Prop)
    (hempty : EmptyProviderSpace providers) (hdiff : d_alg.capabilities ≠ d_top.capabilities) :
    UnreachableAbstract d_alg d_top providers := by
  intro h
  rcases h with ⟨e_seq, h_all, h_eq⟩
  cases e_seq with
  | nil =>
    dsimp [List.foldl] at h_eq
    exact hdiff h_eq
  | cons e rest =>
    have h_in := (h_all e (List.Mem.head rest)).left
    exact hempty e h_in

-- Theorem 3.2: Non-Approximability Theorem
def NonApproximable (d : Detector C) (requiredEps : Nat) : Prop :=
  delta_perfection d > requiredEps

theorem non_approximable_bounds (d : Detector C) (requiredEps : Nat)
    (hbound : delta_perfection d > requiredEps) :
    ¬ GovEpsilon d requiredEps := by
  intro hgov
  dsimp [GovEpsilon] at hgov
  omega

-- Theorem 3.3: Soundness Barrier Theorem
theorem soundness_barrier_blocks (e : Enrichment C)
    (hunsound : e.preservesSoundness = false) :
    ¬ ValidEnrichment e := by
  intro hv
  dsimp [ValidEnrichment] at hv
  rw [hunsound] at hv
  contradiction

end ImpossibilityLimits

end TaktFormal
