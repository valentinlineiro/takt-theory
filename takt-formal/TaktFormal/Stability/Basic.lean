import TaktFormal.Cost.Functional

/-- Abstract proximity relation on a cost space.
    Can represent distance, tolerance, or neighborhood structure. -/
def CostProximity (L : CostSpace) (prox : L.Carrier → L.Carrier → Prop) : Prop :=
  (∀ x, prox x x) ∧ (∀ {x y}, prox x y → prox y x)

/-- Proximity between cost functionals induced by proximity on the cost space. -/
def FunctionalProximity {R : RepresentationSpace} {L : CostSpace}
    (prox : L.Carrier → L.Carrier → Prop) (cf1 cf2 : CostFunctional R L) : Prop :=
  ∀ r : R.Rep, prox (cf1.eval r) (cf2.eval r)
