# Batch-019 Results — Global Path Sufficiency

## 1. Executive Summary

This batch evaluated the maximum hidden decision regret $\varepsilon(R_i)$ across 38,760 directed graph configurations under the compositional path refinement $R_{path} = R_{dist} \oplus X_{path}$.

## 2. Representation Profiles

| Representation | Total Bins | Max Bin Size | Conflict Bins | Epsilon Regret ε(R) |
|----------------|------------|--------------|---------------|----------------------|
| R_dist (Omega + X_dist) | 10743 | 72 | 132 | 15.58 |
| R_path (R_dist + X_path) | 10902 | 72 | 122 | 15.58 |

## 3. Maximizing Witnesses

### R_dist (Omega + X_dist) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->v3_next, t->s, t->v3, v3->t, v3_next->v3, v3_next_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->v3_next, v3->t, v3->v3_next, v3_next->v3, v3_next_next->s, v3_next_next->v3]`

### R_path (R_dist + X_path) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->v3_next, t->s, t->v3, v3->t, v3_next->v3, v3_next_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->v3_next, v3->t, v3->v3_next, v3_next->v3, v3_next_next->s, v3_next_next->v3]`

## 4. Outcome Classification

### [Scenario C — Residual Symmetries]
Symmetries still remain open under path sequences: $\varepsilon(R_{path}) = 15.58 > 0.00$.