# Batch-014 Results — Observability Kernel Augmentations

## 1. Executive Summary

Total experimental runs evaluated: 60 (3 cases × 4 incidences × 5 reps)

### Hypothesis Evaluation

- Total corrupt target runs (DEP-005): 15
- Runs where X1 detected ($d_{X1} > 0.005$): 15 (100.0%)
- Runs where X2 detected ($d_{X2} > 0.05$): 15 (100.0%)

## 2. Transition Analysis Matrix (DEP-005)

| Incidence | Rep | k | d_X1 | d_X2 | D_X1 | D_X2 | Joint Verdict |
|-----------|-----|---|------|------|------|------|---------------|
| 0.00 | 1 | 1 | 0.000 | 0.000 | silent | silent | partial |
| 0.00 | 2 | 1 | 0.000 | 0.000 | silent | silent | partial |
| 0.00 | 3 | 1 | 0.000 | 0.000 | silent | silent | partial |
| 0.00 | 4 | 1 | 0.000 | 0.000 | silent | silent | partial |
| 0.00 | 5 | 1 | 0.000 | 0.000 | silent | silent | partial |
| 0.05 | 1 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.05 | 2 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.05 | 3 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.05 | 4 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.05 | 5 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.10 | 1 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.10 | 2 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.10 | 3 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.10 | 4 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.10 | 5 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.15 | 1 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.15 | 2 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.15 | 3 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.15 | 4 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |
| 0.15 | 5 | 1 | 0.010 | 0.790 | detected | detected | **BOTH DETECT** |

## 3. Control Cases (WRK-002 & WRK-003)

Evaluating controls (no topological corruption applied):

| Case | Incidence | k | d_X1 | d_X2 |
|------|-----------|---|------|------|
| WRK-002 | 0.00 | 1 | 0.000 | 0.000 |
| WRK-002 | 0.05 | 1 | 0.000 | 0.000 |
| WRK-002 | 0.10 | 1 | 0.000 | 0.000 |
| WRK-002 | 0.15 | 1 | 0.000 | 0.000 |
| WRK-003 | 0.00 | 1 | 0.000 | 0.000 |
| WRK-003 | 0.05 | 1 | 0.000 | 0.000 |
| WRK-003 | 0.10 | 1 | 0.000 | 0.000 |
| WRK-003 | 0.15 | 1 | 0.000 | 0.000 |

## 4. Outcome Classification & Minimality Proof

### [Scenario C — Both Detect Confirmed]
Both candidates $X_1$ and $X_2$ successfully separated the Batch-013 equivalence class under corruption, converting the previous blind spot into a detected state ($D_{joint}^{+X_i} = \text{detected}$).

### Minimality Proof Conclusion:
1. **$dim(X) = 0$** was proven **insufficient** in Batch-013 ($D_{joint}^{\Omega} = \text{undetected}$).
2. **$dim(X) = 1$** is proven **sufficient** in Batch-014 ($D_{joint}^{+X_1} = D_{joint}^{+X_2} = \text{detected}$).
3. Therefore, the minimal dimensional augmentation required to separate the Batch-013 equivalence class under the frozen cost metric is exactly:
   $$\boxed{\dim(X)_{min} = 1}$$

## 5. Magnitude Discrepancy Resolution

During execution, a quantitative discrepancy in the $X_2$ deviation magnitude was observed:
* **Ex-Ante Prediction**: $d_{X2} = 1.59$
* **Observed Value**: $d_{X2} = 0.790$

### Root Cause Analysis:
The discrepancy arose from a modeling assumption difference in node failure rates for Case `DEP-005` in `cli/src/batch-005/cases.ts`:
1. The ex-ante calculation assumed the node `'v3_next_next'` carried a failure rate of $pFail = 0.80$ (modeled symmetrically with `'v3_next'`).
2. However, the actual fixture's `failures` map is defined as:
   `failures: { v3: 0.01, v3_next: 0.8, decoy_v4: 0.8 }`
   Node `'v3_next_next'` is unmapped in the `failures` object, reverting to a default failure rate of $pFail = 0.00$.

### Recalculation under True Fixture Parameters:
* **Clean transition delta**:
  * $X_2(1)_{clean} = p_f(v3) = 0.01$
  * $X_2(2)_{clean} = p_f(v3) + p_f(v3\_next) + p_f(v3\_next\_next) = 0.01 + 0.80 + 0.00 = 0.81$
  * $\Delta X_{2, clean} = |0.81 - 0.01| = 0.80$
* **Corrupt transition delta**:
  * $X_2(1)_{corrupt} = p_f(v3\_next) + p_f(v3\_next\_next) = 0.80 + 0.00 = 0.80$
  * $X_2(2)_{corrupt} = 0.81$
  * $\Delta X_{2, corrupt} = |0.81 - 0.80| = 0.01$
* **Total deviation**:
  * $d_{X2} = |\Delta X_{2, corrupt} - \Delta X_{2, clean}| = |0.80 - 0.01| = \mathbf{0.790}$

This matches the observed value of exactly $0.790$, fully resolving the discrepancy.