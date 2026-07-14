# Batch-012 Results — Structural Observability under Cardinality Invariance

## 1. Executive Summary

Total experimental runs evaluated: 60 (3 cases × 4 incidences × 5 reps)

### Hypothesis Evaluation

Primary hypothesis: `\text{Loss} > 0 \land \Delta |V| = 0 \land \Delta |E| = 0 \implies \Delta R > 0.10 \lor \Delta Com > 0.05`
- Total corrupt target runs (DEP-005): 15
- Runs confirming Scenario A (Structural Observability): 15 (100.0%)

## 2. Transition Analysis Matrix (DEP-005)

| Incidence | Rep | k | d\|V\| | d\|E\| | ΔR | ΔCom | Result |
|-----------|-----|---|-------|-------|----|------|--------|
| 0.00 | 1 | 1 | 0 | 0 | 0.00 | 0.00 | silent |
| 0.00 | 2 | 1 | 0 | 0 | 0.00 | 0.00 | silent |
| 0.00 | 3 | 1 | 0 | 0 | 0.00 | 0.00 | silent |
| 0.00 | 4 | 1 | 0 | 0 | 0.00 | 0.00 | silent |
| 0.00 | 5 | 1 | 0 | 0 | 0.00 | 0.00 | silent |
| 0.05 | 1 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.05 | 2 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.05 | 3 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.05 | 4 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.05 | 5 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.10 | 1 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.10 | 2 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.10 | 3 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.10 | 4 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.10 | 5 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.15 | 1 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.15 | 2 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.15 | 3 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.15 | 4 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |
| 0.15 | 5 | 1 | 0 | 0 | 0.00 | 0.53 | **DETECTED** |

## 3. Control Cases (WRK-002 & WRK-003)

Evaluating controls (no topological corruption applied):

| Case | Incidence | k | d\|V\| | d\|E\| | ΔR | ΔCom |
|------|-----------|---|-------|-------|----|------|
| WRK-002 | 0.00 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-002 | 0.05 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-002 | 0.10 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-002 | 0.15 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-003 | 0.00 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-003 | 0.05 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-003 | 0.10 | 1 | 0 | 0 | 0.00 | 0.00 |
| WRK-003 | 0.15 | 1 | 0 | 0 | 0.00 | 0.00 |

## 4. Outcome Classification

### [Scenario A — Structural Observability Confirmed]
All topological corruption runs under cardinality invariance were successfully flagged by $\Delta\Omega_i$ (specifically through the Community clustering coefficient delta $\Delta Com$). The higher-order community dimension successfully detects connection rearrangements when count channels are blind.