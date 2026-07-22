import TaktFormal.Landscape.Graph

namespace OrdinalRegion

variable {O : Type} (L : AbstractLandscape) (Psi : L.R.Rep → O) (eqv : O → O → Prop)

/-- Ordinal Path: a path in the LandscapeGraph where every step is between ordinally equivalent nodes. -/
inductive OrdinalPath : L.R.Rep → L.R.Rep → Prop where
  | refl : ∀ r, OrdinalPath r r
  | step : ∀ r1 r2 r3, (IsCover L r1 r2 ∨ IsCover L r2 r1) → eqv (Psi r1) (Psi r2) → OrdinalPath r2 r3 → OrdinalPath r1 r3

theorem path_refl (r : L.R.Rep) : OrdinalPath L Psi eqv r r :=
  OrdinalPath.refl r

theorem path_trans {r1 r2 r3 : L.R.Rep} (h1 : OrdinalPath L Psi eqv r1 r2) (h2 : OrdinalPath L Psi eqv r2 r3) :
    OrdinalPath L Psi eqv r1 r3 := by
  induction h1 with
  | refl => exact h2
  | step a b c h_cov h_eqv _ ih =>
    exact OrdinalPath.step a b r3 h_cov h_eqv (ih h2)

theorem path_symm (heqv : Equivalence eqv) {r1 r2 : L.R.Rep} (h : OrdinalPath L Psi eqv r1 r2) :
    OrdinalPath L Psi eqv r2 r1 := by
  induction h with
  | refl => exact OrdinalPath.refl _
  | step a b c h_cov h_eqv _ ih =>
    have h_cov_symm : IsCover L b a ∨ IsCover L a b := by
      rcases h_cov with h | h
      · exact Or.inr h
      · exact Or.inl h
    have h_eqv_symm := heqv.symm h_eqv
    have h_step : OrdinalPath L Psi eqv b a :=
      OrdinalPath.step b a a h_cov_symm h_eqv_symm (OrdinalPath.refl a)
    exact path_trans L Psi eqv ih h_step

/-- The ordinal path relation is an equivalence relation. -/
theorem path_equivalence (heqv : Equivalence eqv) : Equivalence (OrdinalPath L Psi eqv) where
  refl := path_refl L Psi eqv
  symm := path_symm L Psi eqv heqv
  trans := path_trans L Psi eqv

end OrdinalRegion

/-- Abstract Cost Stability Margin at a representation node. -/
def CostStabilityMargin (L : AbstractLandscape) (r : L.R.Rep) (_margin : L.L.Carrier) : Prop :=
  ∀ alt : L.R.Rep, L.R.le r alt → L.L.le (L.cf.eval r) (L.cf.eval alt)
