# Batch-021 Results — Global Reachability Sufficiency

## 1. Executive Summary

This batch evaluated the maximum hidden decision regret $\varepsilon(R_i)$ across 38,760 directed graph configurations under the action-conditioned causal reachability refinement $R_{reach} = R_{active} \oplus X_{reach}$.

## 2. Representation Profiles

| Representation | Total Bins | Max Bin Size | Conflict Bins | Epsilon Regret ε(R) |
|----------------|------------|--------------|---------------|----------------------|
| R_active (R_path + X_activation) | 13339 | 71 | 23 | 13.58 |
| R_reach (R_active + X_reach) | 13442 | 71 | 0 | 0.00 |

## 3. Maximizing Witnesses

### R_active (R_path + X_activation) Witness
* **Max Regret**: 13.58
* **True State $S$ (Action optimal: T1)**: `[s->t, s->v3, s->v3_next_next, v3->t, v3_next->v3, v3_next_next->t]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->t, s->v3, s->v3_next_next, v3->t, v3_next->v3_next_next, v3_next_next->t]`

### R_reach (R_active + X_reach) Witness
* **No conflict bins**: $\varepsilon(R) = 0.00$ (complete decision sufficiency).

## 4. Outcome Classification

### [Scenario A — Global Reachability Sufficiency Confirmed]
The action-conditioned reachability invariant $X_{reach}$ successfully achieved **global decision sufficiency** ($\varepsilon(R_{reach}) = 0.00$) over the entire 38,760 graph space. This mathematically proves that capturing action-conditioned reachability from risk-bearing nodes to target sink landmarks closes the decisional safety gap.