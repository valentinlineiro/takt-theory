import TaktFormal.Landscape.Transition
import TaktFormal.Cost.Poset

/-- Cost Composition System over cost type `L`. -/
class CostComposition (L : Type) extends CostPartialOrder L where
  otimes : L → L → L
  e : L
  le_mono_left : ∀ a b c : L, a ≤ b → otimes c a ≤ otimes c b
  le_mono_right : ∀ a b c : L, a ≤ b → otimes a c ≤ otimes b c

/-- Recursive definition of trajectory cost using a proof of Trajectory. -/
def TrajectoryCost {X L : Type} [CostComposition L] {T : TransitionSystem X}
    (w : ∀ x y, T.to x y → L) {l : List X} (h : Trajectory T l) : L :=
  match h with
  | Trajectory.nil => CostComposition.e
  | Trajectory.single _ => CostComposition.e
  | Trajectory.step x y rest h_to h_rest =>
      CostComposition.otimes (w x y h_to) (TrajectoryCost w h_rest)
