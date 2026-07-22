import TaktFormal.Landscape.Graph

namespace DecisionalRegion

variable {D : Type} (L : AbstractLandscape) (Phi : L.R.Rep → D) (eqv : D → D → Prop)

/-- Decisional Path: a path in the LandscapeGraph where every step is between decisionally equivalent nodes.
    This defines the connected components of the decisional equivalence classes. -/
inductive DecisionalPath : L.R.Rep → L.R.Rep → Prop where
  | refl : ∀ r, DecisionalPath r r
  | step : ∀ r1 r2 r3, (IsCover L r1 r2 ∨ IsCover L r2 r1) → eqv (Phi r1) (Phi r2) → DecisionalPath r2 r3 → DecisionalPath r1 r3

theorem path_refl (r : L.R.Rep) : DecisionalPath L Phi eqv r r :=
  DecisionalPath.refl r

theorem path_trans {r1 r2 r3 : L.R.Rep} (h1 : DecisionalPath L Phi eqv r1 r2) (h2 : DecisionalPath L Phi eqv r2 r3) :
    DecisionalPath L Phi eqv r1 r3 := by
  induction h1 with
  | refl => exact h2
  | step a b c h_cov h_eqv _ ih =>
    exact DecisionalPath.step a b r3 h_cov h_eqv (ih h2)

theorem path_symm (heqv : Equivalence eqv) {r1 r2 : L.R.Rep} (h : DecisionalPath L Phi eqv r1 r2) : DecisionalPath L Phi eqv r2 r1 := by
  induction h with
  | refl => exact DecisionalPath.refl _
  | step a b c h_cov h_eqv _ ih =>
    have h_cov_symm : IsCover L b a ∨ IsCover L a b := by
      rcases h_cov with h | h
      · exact Or.inr h
      · exact Or.inl h
    have h_eqv_symm := heqv.symm h_eqv
    have h_step : DecisionalPath L Phi eqv b a :=
      DecisionalPath.step b a a h_cov_symm h_eqv_symm (DecisionalPath.refl a)
    exact path_trans L Phi eqv ih h_step

/-- The path relation is an equivalence relation.
    Its quotient classes are exactly the Decisional Regions. -/
theorem path_equivalence (heqv : Equivalence eqv) : Equivalence (DecisionalPath L Phi eqv) where
  refl := path_refl L Phi eqv
  symm := path_symm L Phi eqv heqv
  trans := path_trans L Phi eqv

end DecisionalRegion
