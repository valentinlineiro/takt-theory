# Batch-022 Question Freeze — Minimal Sufficient Contraction

## 1. Origin

Batch-021 successfully demonstrated the existence of a decision-sufficient representation contraction ($R_{reach}$) achieving $\varepsilon = 0.00$ over the entire directed graph space of 38,760 configurations. However, this only establishes the existence of a safe contraction, not its **minimal complexity**.

Batch-022 initiates the study of **Minimal Sufficient Contractions**, shifting the research direction from sufficiency search to complexity optimization.

---

## 2. Core Question

We define the complexity of a representation $R$ along three distinct axes:
1. **$C_{partition}$**: The total number of equivalence classes (bins) $|R(\mathcal{S})|$ induced by the representation. Fewer bins imply higher compression.
2. **$C_{encoding}$**: The byte length of the serialized keys representing $R(S)$.
3. **$C_{evaluation}$**: The computational runtime needed to extract $R(S)$ from state $S$.

We define the Pareto-optimal frontier of representations under exact safety ($\varepsilon(R) = 0.00$) as $P_0$:
\[
P_0 = \{ R_J : \varepsilon(R_J) = 0.00 \text{ and } \nexists R_{J'} \text{ that strictly dominates } R_J \text{ on Complexity } C \}
\]

**By evaluating the complete powerset of $2^5 = 32$ invariant combinations $R_J = \bigoplus_{j \in J} X_j$ over the five candidate components, can we identify the exact Pareto-optimal frontier $P_0$ under exact decision sufficiency?**

The five components under evaluation are:
* $X_0 = \Omega$ (Structural baseline metrics).
* $X_1 = X_{dist}$ (Landmark-relative distance coordinates).
* $X_2 = X_{path}$ (Directed path sequences).
* $X_3 = X_{activation}$ (Observed active node/edge signatures).
* $X_4 = X_{reach}$ (Action-conditioned causal reachability).

---

## 3. Outcome Regimes

### Scenario A — Redundancy and Minimal Frontier
* **Condition**: We find that several sub-combinations (e.g. $J = \{X_4\}$ or $J = \{X_3, X_4\}$) achieve $\varepsilon = 0.00$, proving that structural baseline $\Omega$ and landmarks $X_{dist}$ are partially redundant.
* **Implication**: We identify a non-trivial Pareto frontier of safe, highly compressed representations.

### Scenario C — Monolithic Sufficiency
* **Condition**: Only the complete set $J = \{0, 1, 2, 3, 4\}$ achieves $\varepsilon = 0.00$. Any deletion of components causes regret $\varepsilon > 0.00$.
* **Implication**: The sufficient representation is a monolithic construct where all elements are tightly coupled.
