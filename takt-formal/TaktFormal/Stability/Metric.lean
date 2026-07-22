import TaktFormal.Cost.Functional
import TaktFormal.Stability.Basic

/-- Cost space equipped with a preorder and a compatible addition operation. -/
structure MetricCostSpace extends CostSpace where
  add : Carrier → Carrier → Carrier
  zero : Carrier
  le_add_self : ∀ x y, le x (add x y)
  add_le_add_right : ∀ x y z, le x y → le (add x z) (add y z)
  add_assoc : ∀ x y z, add (add x y) z = add x (add y z)
  add_comm : ∀ x y, add x y = add y x
  add_zero : ∀ x, add x zero = x
  add_le_cancel_right : ∀ x y z, le (add x z) (add y z) → le x y

/-- Two cost functionals are within metric epsilon-proximity if their evaluated costs
    for any representation do not deviate by more than epsilon. -/
def MetricProximity {R : RepresentationSpace} {L : MetricCostSpace}
    (cf1 cf2 : CostFunctional R L.toCostSpace) (eps : L.Carrier) : Prop :=
  (∀ r : R.Rep, L.le (cf1.eval r) (L.add (cf2.eval r) eps)) ∧
  (∀ r : R.Rep, L.le (cf2.eval r) (L.add (cf1.eval r) eps))
