# Batch-020 Results — Global Activation Sufficiency

## 1. Executive Summary

This batch evaluated the maximum hidden decision regret $\varepsilon(R_i)$ across 38,760 directed graph configurations under the observation-aware activation refinement $R_{active} = R_{path} \oplus X_{activation}$.

## 2. Representation Profiles

| Representation | Total Bins | Max Bin Size | Conflict Bins | Epsilon Regret ε(R) |
|----------------|------------|--------------|---------------|----------------------|
| R_path (R_dist + X_path) | 10902 | 72 | 122 | 15.58 |
| R_active (R_path + X_activation) | 13339 | 71 | 23 | 13.58 |

## 3. Maximizing Witnesses

### R_path (R_dist + X_path) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->v3_next, t->s, t->v3, v3->t, v3_next->v3, v3_next_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->v3_next, v3->t, v3->v3_next, v3_next->v3, v3_next_next->s, v3_next_next->v3]`

### R_active (R_path + X_activation) Witness
* **Max Regret**: 13.58
* **True State $S$ (Action optimal: T1)**: `[s->t, s->v3, s->v3_next_next, v3->t, v3_next->v3, v3_next_next->t]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->t, s->v3, s->v3_next_next, v3->t, v3_next->v3_next_next, v3_next_next->t]`

## 4. Outcome Classification

### [Scenario C — Residual Symmetries]
Symmetries still remain open under activation: $\varepsilon(R_{active}) = 13.58 > 0.00$.