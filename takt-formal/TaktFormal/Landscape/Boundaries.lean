import TaktFormal.Landscape.Graph

variable {D : Type} (L : AbstractLandscape) (Phi : L.R.Rep → D) (eqv : D → D → Prop)

/-- A cover edge r1 lessdot r2 is a decisional boundary if they are not decisionally equivalent. -/
def IsDecisionalBoundary (r1 r2 : L.R.Rep) : Prop :=
  IsCover L r1 r2 ∧ ¬ eqv (Phi r1) (Phi r2)
