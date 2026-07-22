import TaktFormal.Stability.Metric

variable {R : RepresentationSpace} {L : MetricCostSpace}

/-- Abstract global distortion bound on a cost functional:
    If a ≤ b (a is coarser than b), the cost of a can exceed the cost of b,
    but by no more than eps. -/
def AbstractDistortionBound (cf : CostFunctional R L.toCostSpace) (eps : L.Carrier) : Prop :=
  ∀ {a b : R.Rep}, R.le a b → L.le (cf.eval a) (L.add (cf.eval b) eps)

/-- Prove that a distortion bound of zero is equivalent to cost functional monotonicity (C0). -/
theorem distortion_zero_iff_monotone (cf : CostFunctional R L.toCostSpace) :
    AbstractDistortionBound cf L.zero ↔ cf.isMonotone := by
  constructor
  · intro h a b hab
    have h_eps := h hab
    rw [L.add_zero] at h_eps
    exact h_eps
  · intro h a b hab
    have h_mono := h hab
    rw [L.add_zero]
    exact h_mono
