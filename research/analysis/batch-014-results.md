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