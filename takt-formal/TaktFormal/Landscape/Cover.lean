import TaktFormal.Landscape.Basic

/-- The Cover Relation (lessdot) on representations:
    r1 is covered by r2 if r1 is strictly coarser than r2 (r1 ≺ r2) and there is no intermediate r' strictly between them. -/
def IsCover (L : AbstractLandscape) (r1 r2 : L.R.Rep) : Prop :=
  L.R.le r1 r2 ∧ r1 ≠ r2 ∧ ∀ r' : L.R.Rep, L.R.le r1 r' ∧ r' ≠ r1 ∧ L.R.le r' r2 ∧ r' ≠ r2 → False
