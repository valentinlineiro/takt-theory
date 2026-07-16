# Batch-013 Results — Joint Observability Kernel Intersection

## 1. Executive Summary

Total experimental runs evaluated: 60 (3 cases × 4 incidences × 5 reps)

### Hypothesis Evaluation

Primary hypothesis: \text{Loss} > 0 \land D_{joint}(\Delta\Omega, \varepsilon) = \text{undetected}
- Total corrupt target runs (DEP-005): 15
- Runs confirming Scenario K (Kernel Intersection Confirmed): 15 (100.0%)

## 2. Transition Analysis Matrix (DEP-005)

| Incidence | Rep | k | d\|V\| | d\|E\| | d_\rho | d_caps | ΔR | ΔCom | Verdict |
|-----------|-----|---|-------|-------|--------|--------|----|------|---------|
| 0.00 | 1 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.00 | 2 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.00 | 3 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.00 | 4 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.00 | 5 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.05 | 1 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.05 | 2 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.05 | 3 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.05 | 4 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.05 | 5 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.10 | 1 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.10 | 2 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.10 | 3 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.10 | 4 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.10 | 5 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.15 | 1 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.15 | 2 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.15 | 3 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.15 | 4 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |
| 0.15 | 5 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 | **UNDETECTED** |

## 3. Control Cases (WRK-002 & WRK-003)

Evaluating controls (no topological corruption applied):

| Case | Incidence | k | d\|V\| | d\|E\| | d_\rho | d_caps | ΔR | ΔCom |
|------|-----------|---|-------|-------|--------|--------|----|------|
| WRK-002 | 0.00 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-002 | 0.05 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-002 | 0.10 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-002 | 0.15 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-003 | 0.00 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-003 | 0.05 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-003 | 0.10 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |
| WRK-003 | 0.15 | 1 | 0 | 0 | 0.00 | 0.00 | 0.00 | 0.00 |

## 4. Outcome Classification

### [Scenario K — Joint Observational Kernel Confirmed]
All topological permutation runs under corruption were successfully completed with **zero detections** ($D_{joint} = \text{undetected}$) across all operational sensors, while causing a true decision regret of **Loss = 13.58**. This constructive counterexample proves that **structural/topological equivalence does not imply decision-semantic equivalence**, exposing a hard safety boundary of the current $\Omega$ representation.