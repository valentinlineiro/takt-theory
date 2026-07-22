import TaktFormal.Landscape.Cover

/-- An Operational Landscape Graph G = (V, E) where:
    - Vertices V are representations (L.R.Rep).
    - Edges E are defined by the Cover Relation. -/
structure LandscapeGraph (L : AbstractLandscape) where
  V : Type := L.R.Rep
  E : L.R.Rep → L.R.Rep → Prop := IsCover L
