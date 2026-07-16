# Batch-008 Results: α_k Estimation Under Sparse FN Adversarial Corruption

## 1. Executive Summary

Total evaluations: 360 (4 incidences × 3 cases × 6 policies × 5 reps)

## 2. Overall Scorecard

| Policy | Mismatch Rate | Avg Regret | Avg BlindnessGap | Avg α Error | Probe Rate | Avg K | Avg Cost |
|--------|---------------|------------|------------------|-------------|------------|-------|----------|
| AlwaysTrust | 66.7% | -3.333 | 3.467 | 2.667 | 0.0% | 1.00 | 0.000 |
| AlwaysVerify | 0.0% | 0.500 | 3.467 | 2.667 | 0.0% | 2.00 | 3.833 |
| ProbeAlways | 0.0% | 1.000 | 3.467 | 2.667 | 100.0% | 2.00 | 4.333 |
| ProbeReliability0.3 | 66.7% | -3.333 | 3.467 | 2.667 | 0.0% | 1.00 | 0.000 |
| ProbeReliability0.5 | 66.7% | -3.333 | 3.467 | 2.667 | 0.0% | 1.00 | 0.000 |
| ProbeReliability0.7 | 66.7% | -3.333 | 3.467 | 2.667 | 0.0% | 1.00 | 0.000 |

## 3. By Incidence Level

| Incidence | Policy | Mismatch Rate | Avg Regret | Probe Rate | Avg α Est |
|-----------|--------|---------------|------------|------------|-----------|
| 0.00 | AlwaysTrust | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.00 | AlwaysVerify | 0.0% | 0.500 | 0.0% | 0.133 |
| 0.00 | ProbeAlways | 0.0% | 1.000 | 100.0% | 0.133 |
| 0.00 | ProbeReliability0.3 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.00 | ProbeReliability0.5 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.00 | ProbeReliability0.7 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.05 | AlwaysTrust | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.05 | AlwaysVerify | 0.0% | 0.500 | 0.0% | 0.133 |
| 0.05 | ProbeAlways | 0.0% | 1.000 | 100.0% | 0.133 |
| 0.05 | ProbeReliability0.3 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.05 | ProbeReliability0.5 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.05 | ProbeReliability0.7 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.10 | AlwaysTrust | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.10 | AlwaysVerify | 0.0% | 0.500 | 0.0% | 0.133 |
| 0.10 | ProbeAlways | 0.0% | 1.000 | 100.0% | 0.133 |
| 0.10 | ProbeReliability0.3 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.10 | ProbeReliability0.5 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.10 | ProbeReliability0.7 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.15 | AlwaysTrust | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.15 | AlwaysVerify | 0.0% | 0.500 | 0.0% | 0.133 |
| 0.15 | ProbeAlways | 0.0% | 1.000 | 100.0% | 0.133 |
| 0.15 | ProbeReliability0.3 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.15 | ProbeReliability0.5 | 66.7% | -3.333 | 0.0% | 0.133 |
| 0.15 | ProbeReliability0.7 | 66.7% | -3.333 | 0.0% | 0.133 |

## 4. By Case

| Case | Policy | Mismatch Rate | Avg Regret | Avg α Est | Boundary Nodes |
|------|--------|---------------|------------|-----------|----------------|
| WRK-002 | AlwaysTrust | 100.0% | 0.000 | 0.200 | 1 |
| WRK-002 | AlwaysVerify | 0.0% | 0.500 | 0.200 | 1 |
| WRK-002 | ProbeAlways | 0.0% | 1.000 | 0.200 | 1 |
| WRK-002 | ProbeReliability0.3 | 100.0% | 0.000 | 0.200 | 1 |
| WRK-002 | ProbeReliability0.5 | 100.0% | 0.000 | 0.200 | 1 |
| WRK-002 | ProbeReliability0.7 | 100.0% | 0.000 | 0.200 | 1 |
| WRK-003 | AlwaysTrust | 100.0% | -10.000 | 0.100 | 2 |
| WRK-003 | AlwaysVerify | 0.0% | 0.500 | 0.100 | 2 |
| WRK-003 | ProbeAlways | 0.0% | 1.000 | 0.100 | 2 |
| WRK-003 | ProbeReliability0.3 | 100.0% | -10.000 | 0.100 | 2 |
| WRK-003 | ProbeReliability0.5 | 100.0% | -10.000 | 0.100 | 2 |
| WRK-003 | ProbeReliability0.7 | 100.0% | -10.000 | 0.100 | 2 |
| DEP-005 | AlwaysTrust | 0.0% | 0.000 | 0.100 | 2 |
| DEP-005 | AlwaysVerify | 0.0% | 0.500 | 0.100 | 2 |
| DEP-005 | ProbeAlways | 0.0% | 1.000 | 0.100 | 2 |
| DEP-005 | ProbeReliability0.3 | 0.0% | 0.000 | 0.100 | 2 |
| DEP-005 | ProbeReliability0.5 | 0.0% | 0.000 | 0.100 | 2 |
| DEP-005 | ProbeReliability0.7 | 0.0% | 0.000 | 0.100 | 2 |

## 5. Observations

- AlwaysTrust mismatch rate: 66.7% — baseline cost of suppressed DRU.
- AlwaysVerify mismatch rate: 0.0% — baseline cost of always expanding.
- ProbeAlways mismatch rate: 0.0% — effectiveness of single-probe recovery.
- τ=0.3 mismatch rate: 66.7%, probe rate: 0.0%, avg α error: 2.667.
- τ=0.5 mismatch rate: 66.7%, probe rate: 0.0%, avg α error: 2.667.
- τ=0.7 mismatch rate: 66.7%, probe rate: 0.0%, avg α error: 2.667.

## 6. Theoretical Implications

### Reliability mass ≠ Decision relevance

Boundary node count across cases: 1-2.
When boundary node count is low (≤2), the median ρ collapses to individual node reliability,
making α_k highly sensitive to single-node corruption. This is a topology-dependent property.

### Scenario classification

| Scenario | Condition | Evidence |
|----------|-----------|----------|
| A: α robust | BlindnessGap ≈ 0 ∀θ | 3.467 |
| B: bounded domain | ∃ boundary D_α | check per-incidence tables above |
| C: impossibility | ∃θ: BlindnessGap ≫ 0, no observable escape | 3.467 |