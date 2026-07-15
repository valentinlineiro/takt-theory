# Batch-018 Fixture Freeze — Global Regret Space and Representations

## 1. Goal

This document locks in the experimental domain ($\mathcal{S}_{018}$), utility evaluation constraints, and the representations under comparison to calculate the global regret bounds $\varepsilon(R_i)$ across all 38,760 directed graphs.

---

## 2. Experimental Domain and Actions

* **Domain Space ($\mathcal{S}_{018}$)**: All $\binom{20}{6} = 38,760$ directed graphs on 5 nodes with 6 edges using the node set `['s', 't', 'v3', 'v3_next', 'v3_next_next']`.
* **Action Space ($\mathcal{A}$)**: $\mathcal{A} = \{T_0, T_1\}$.
* **Utility Parameters ($U$)**: Utility evaluation matches Case `DEP-005` under path limit 3:
  * $T_0$ evaluates the path: `s -> v3 -> v3_next -> v3_next_next`.
  * $T_1$ evaluates the path: `s -> t`.
  * Default fallback utility for broken paths is $-14.58$.

---

## 3. Representations Compared

We evaluate the regret bounds for four representations $R_i(S)$ at depth $k = 2$:

1. **$R_0 = \Omega$** (Baseline: node count, edge count, redundancy, communities, capability signatures, boundary rhos).
2. **$R_1 = \Omega \oplus X_1$** (Augmented with weighted capability metric).
3. **$R_2 = \Omega \oplus X_2$** (Augmented with structural failure sum).
4. **$R_{dist} = \Omega \oplus X_{dist}$** (Augmented with relative shortest-path distance signatures to landmarks `s` and `t`).

---

## 4. Quantitative Regret Metric and Witness

For each representation $R$, the global regret bound $\varepsilon(R)$ is computed over all ordered pairs $(S, S') \in \mathcal{S}_{018} \times \mathcal{S}_{018}$ sharing the same representation:

\[
\boxed{
\varepsilon(R) = \max_{\substack{S, S' \in \mathcal{S}_{018} \\ R(S) = R(S')}} \left[ U(S, a^*(S)) - U(S, a^*(S')) \right]
}
\]

where:
* $a^*(S) = \arg\max_{a \in \mathcal{A}} U(S, a)$.
* $a^*(S')$ is the optimal choice under state $S'$.

The maximizing witness is frozen as the tuple:
\[
\boxed{
W_R = \Big( S, \ S', \ a^*(S), \ a^*(S'), \ \varepsilon(R) \Big)
}
\]
where $S$ is the true state, $S'$ is the confusing state, and $\varepsilon(R)$ is the regret suffered.
