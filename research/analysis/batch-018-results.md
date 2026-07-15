# Batch-018 Results — Global $\varepsilon$-Decision Sufficiency

## 1. Executive Summary

This batch evaluated the maximum hidden decision regret $\varepsilon(R_i)$ across the complete space of directed graphs (38,760 configurations) grouped into representational equivalence classes.

## 2. Representation Profiles

| Representation | Total Bins | Max Bin Size | Conflict Bins | Epsilon Regret ε(R) |
|----------------|------------|--------------|---------------|----------------------|
| R0 (Baseline Omega) | 50 | 4808 | 26 | 15.58 |
| R1 (Omega + X1) | 50 | 4808 | 26 | 15.58 |
| R2 (Omega + X2) | 78 | 4808 | 38 | 15.58 |
| R_dist (Omega + X_dist) | 10743 | 72 | 132 | 15.58 |

## 3. Maximizing Witnesses

### R0 (Baseline Omega) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->t, t->s, t->v3_next, t->v3_next_next, v3->t, v3_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->t, s->v3, s->v3_next, s->v3_next_next, t->s, t->v3]`

### R1 (Omega + X1) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->t, t->s, t->v3_next, t->v3_next_next, v3->t, v3_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->t, s->v3, s->v3_next, s->v3_next_next, t->s, t->v3]`

### R2 (Omega + X2) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->t, t->s, t->v3_next, t->v3_next_next, v3->t, v3_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->t, s->v3, s->v3_next, s->v3_next_next, t->s, t->v3]`

### R_dist (Omega + X_dist) Witness
* **Max Regret**: 15.58
* **True State $S$ (Action optimal: T1)**: `[s->v3_next, t->s, t->v3, v3->t, v3_next->v3, v3_next_next->v3]`
* **Confused State $S'$ (Action optimal: T0)**: `[s->v3_next, v3->t, v3->v3_next, v3_next->v3, v3_next_next->s, v3_next_next->v3]`

## 4. Outcome Classification

### [Scenario C — Residual Symmetries]
Residual symmetries remain open: $\varepsilon(R_{dist}) = 15.58 > 0.00$.