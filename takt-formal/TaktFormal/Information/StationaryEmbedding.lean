import TaktFormal.Information.Category
import TaktFormal.Convergence.InfiniteTrajectory

namespace Information

variable {X Y Z Z1 Z2 : Type}

/-- The Stationary Embedding: Maps a static state x into a constant infinite state stream (x, x, x, ...). -/
def stationary_embedding (x : X) : StateStream X :=
  λ _ => x

/-- Stationary Lift of a Static Property P : X → Y to a Trajectory Property P_tilde : StateStream X → Y. -/
def stationary_property_lift (P : X → Y) : StateStream X → Y :=
  λ stream => P (stream 0)

/-- Stationary Lift of a Static Transformation f : X → Z to a Trajectory Observer f_tilde : StateStream X → Z. -/
def stationary_transformation_lift (f : X → Z) : StateStream X → Z :=
  λ stream => f (stream 0)

/-- Theorem: Static Representation Sufficiency is logically equivalent to
    Stationary Trajectory Observation Sufficiency. -/
theorem static_trajectory_sufficiency_equivalence (P : X → Y) (f : X → Z) :
    IsSufficient f P ↔ IsSufficient (stationary_transformation_lift f) (stationary_property_lift P) := by
  constructor
  · rintro ⟨h, h_eq⟩
    exact ⟨h, λ stream => h_eq (stream 0)⟩
  · rintro ⟨h, h_eq⟩
    exact ⟨h, λ x => h_eq (stationary_embedding x)⟩

end Information
