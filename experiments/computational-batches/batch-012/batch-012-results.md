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

---

## 5. Resolution of Prediction Magnitude Discrepancy

We resolve the difference between the predicted delta ($\widehat{\Delta Com} = 0.22$) and the observed delta ($\Delta Com_{observed} = 0.53$):

### 5.1 Source of the Error
The ex-ante prediction assumed Case `DEP-005` included the decoy node `decoy_v4` (which is only present in `DEP-006` under `includeDecoy = true`). In reality, `DEP-005` consists of a 5-node graph: `s, t, v3, v3_next, v3_next_next`.

### 5.2 Mathematical Resolution
Under the true 5-node topology:
* **Clean Graph Clustering at $k=2$**:
  * Local CC: `s` (1.0), `t` (0.33), `v3` (0.33), `v3_next_next` (0.0), `v3_next` (0.0).
  * Average: $1.66 / 5 = 0.333$.
  * Clean transition: $\Delta \text{Communities}_{clean} = 0.333 - 1.0 = -0.667$.
* **Corrupt Graph Clustering at $k=2$** (with `v3_next_next -> v3` redirect):
  * Local CC: `s` (1.0), `t` (1.0) [closed triangle `s, t, v3`], `v3` (0.33), `v3_next` (1.0) [closed triangle `v3, v3_next, v3_next_next`], `v3_next_next` (1.0).
  * Average: $4.33 / 5 = 0.866$.
  * Corrupt transition: $\Delta \text{Communities}_{corrupt} = 0.866 - 1.0 = -0.133$.
* **Resulting Deviation**:
  \[
  \Delta Com = |-0.133 - (-0.667)| = 0.533
  \]

This explains the discrepancy down to the third decimal place. The detector behaved exactly according to its definitions; the ex-ante prediction was based on a slightly different graph specification.