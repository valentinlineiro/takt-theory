import TaktFormal.Stability.Metric

variable {R : RepresentationSpace} {L : MetricCostSpace}

/-- Prove the triangle inequality for MetricProximity:
    If cf1 and cf2 are within d1 proximity, and cf2 and cf3 are within d2 proximity,
    then cf1 and cf3 are within d1 + d2 proximity. -/
theorem metric_proximity_triangle {cf1 cf2 cf3 : CostFunctional R L.toCostSpace}
    {d1 d2 : L.Carrier} (h1 : MetricProximity cf1 cf2 d1) (h2 : MetricProximity cf2 cf3 d2) :
    MetricProximity cf1 cf3 (L.add d1 d2) := by
  constructor
  · intro r
    have h1_eval := h1.1 r
    have h2_eval := h2.1 r
    have h_step := L.add_le_add_right (cf2.eval r) (L.add (cf3.eval r) d2) d1 h2_eval
    have h_trans := L.le_trans h1_eval h_step
    rw [L.add_assoc (cf3.eval r) d2 d1] at h_trans
    rw [L.add_comm d2 d1] at h_trans
    exact h_trans
  · intro r
    have h1_eval := h1.2 r
    have h2_eval := h2.2 r
    have h_step := L.add_le_add_right (cf2.eval r) (L.add (cf1.eval r) d1) d2 h1_eval
    have h_trans := L.le_trans h2_eval h_step
    rw [L.add_assoc (cf1.eval r) d1 d2] at h_trans
    exact h_trans
