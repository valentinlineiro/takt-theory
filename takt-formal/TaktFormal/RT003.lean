namespace RT003

-- State variables representing contract health at time t
structure ContractState where
  coverage_satisfied : Bool
  margin_satisfied : Bool
  alignment_optimal : Bool

-- Initial state: everything is normal
def t0 : ContractState := {
  coverage_satisfied := true,
  margin_satisfied := true,
  alignment_optimal := true
}

-- Inversion state: alignment collapses due to exogenous shift, but coverage/margin remain intact
def t_collapse : ContractState := {
  coverage_satisfied := true,
  margin_satisfied := true,
  alignment_optimal := false
}

theorem rt003_cascade_inversion :
  t0.alignment_optimal = true ∧
  t_collapse.alignment_optimal = false ∧
  t_collapse.coverage_satisfied = true ∧
  t_collapse.margin_satisfied = true := by
  refine ⟨rfl, ⟨rfl, ⟨rfl, rfl⟩⟩⟩

end RT003
