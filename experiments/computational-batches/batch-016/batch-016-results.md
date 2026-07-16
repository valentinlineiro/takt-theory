# Batch-016 Results — Bounded Local Decision Sufficiency

## 1. Executive Summary

This batch evaluated the worst-case silent regret $B(k)$ over the complete directed graph space on 5 nodes and 6 edges (38,760 configurations) at each local observation depth $k \in \{0, 1, 2\}$.

### Regret Bound Curve Results

* **B(0) (Focal Node Only)**: 15.58 (Silent Count: 30752)
* **B(1) (Depth 1 Snapshot)**: 15.58 (Silent Count: 2160)
* **B(2) (Transition 1 -> 2 / Full state)**: 15.58 (Silent Count: 192)

## 2. Regret Distributions & Statistics

| Depth k | Admissible Space | Max Regret B(k) | Mean Regret | Min Regret |
|---------|------------------|-----------------|-------------|------------|
| 0 | 30752 | 15.58 | 0.71 | 0.00 |
| 1 | 2160 | 15.58 | 1.03 | 0.00 |
| 2 | 192 | 15.58 | 0.64 | 0.00 |

## 3. Maximizing Witnesses

### Depth k = 0 Witnesses
Count of configurations yielding max regret: 896

Sample witness edges:
* Edges: `[s->t, s->v3_next, s->v3_next_next, t->s, v3->t, v3_next->v3]`
* Edges: `[s->t, s->v3_next, s->v3_next_next, t->v3, v3->t, v3_next->v3]`
* Edges: `[s->t, s->v3_next, s->v3_next_next, t->v3_next, v3->t, v3_next->v3]`

### Depth k = 1 Witnesses
Count of configurations yielding max regret: 72

Sample witness edges:
* Edges: `[s->t, s->v3_next_next, t->v3_next, t->v3_next_next, v3->t, v3_next->v3]`
* Edges: `[s->t, s->v3_next_next, t->v3_next, v3->t, v3_next->v3, v3_next_next->t]`
* Edges: `[s->t, s->v3_next_next, t->v3_next_next, v3->t, v3_next->t, v3_next->v3]`

### Depth k = 2 Witnesses
Count of configurations yielding max regret: 3

Sample witness edges:
* Edges: `[s->t, t->v3_next_next, v3->s, v3->t, v3_next->v3, v3_next->v3_next_next]`
* Edges: `[s->t, t->v3_next_next, v3->s, v3->t, v3_next->v3, v3_next_next->v3_next]`
* Edges: `[s->t, v3->s, v3->t, v3_next->v3, v3_next_next->t, v3_next_next->v3_next]`

## 4. Outcome Classification

### [Scenario C — Epistemic Decoupling / Insufficient Completeness]
The completeness invariant was **falsified**: $B(2) = 15.58 \neq 0.00$.

**Theoretical Significance**: Even with full local observation ($k = kMax$), the worst-case regret remains flat at its absolute maximum of $15.58$. This constructive proof demonstrates that **local representations are epistemically decoupled from decision safety under label-permutation attacks** unless node identities (labels) are explicitly incorporated into the state representation $\Omega$.