# Batch-016 Detector Design Freeze — Local Regret Estimator

## 1. Goal

This document freezes the operational logic and parameters for the local regret estimator $B(k)$ and the search algorithm used to evaluate the admissible spaces $\mathcal{A}_k$ ex-ante.

---

## 2. Local Detector Formula ($D_{joint}^{(k)}$)

The detector at exploration depth $k$ only processes metrics that are computable within the local subgraph $O_k$:

\[
D_{joint}^{(k)} = \text{detected} \iff d_{|V|}^{(k)} > 0 \lor d_{|E|}^{(k)} > 0 \lor d_\rho^{(k)} > 0.05 \lor d_{caps}^{(k)} > 0.05 \lor \Delta R^{(k)} > 0.10 \lor \Delta Com^{(k)} > 0.05 \lor d_{X2}^{(k)} > 0.05
\]

If $D_{joint}^{(k)} = \text{detected}$, the configuration is excluded from $\mathcal{A}_k$. Otherwise, it is silent ($D_{joint}^{(k)} = \text{undetected}$) and joins the admissible space.

---

## 3. Search Evaluation Algorithm

The local regret bound is evaluated using an executable search script `cli/src/batch-016/search.ts` that implements the following sequence:

1. **Space Enumeration**: Generate all 13,440 possible 5-node / 6-edge directed graph configurations (excluding node duplicates and self-loops).
2. **Observability Filtering**: For each configuration $A$ and depth $k \in \{0, 1, 2\}$, extract the local observed subgraph $O_k(A)$ and run $D_{joint}^{(k)}$.
3. **Regret Calculation**: For all silent configurations, calculate the true global utility regret:
   \[
   \text{Loss}(A) = U_A(a^*_A) - U_A(T_0)
   \]
4. **Max Bound Assignment**:
   \[
   B(k) = \max_{A \in \mathcal{A}_k} \text{Loss}(A)
   \]

---

## 4. Integrity Rule: No Post-Hoc Adjustments

The code of `cli/src/batch-016/search.ts` and the evaluation formulas are strictly locked. No post-hoc modifications to thresholds, filtering rules, or utility estimation routines are permitted after execution begins.
