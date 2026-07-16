# Batch-022 Prediction Freeze — Minimal Sufficiency Predictions

## 1. Goal

This document locks in the ex-ante predictions for the Pareto-optimal frontier $P_0$ of safe representations ($\varepsilon = 0.00$) across the 32 subsets.

---

## 2. Invariant Redundancy Predictions

We freeze the following predictions on component redundancies:

### 2.1 Landmark Coordinates Redundancy
* **Prediction**: Landmark-relative coordinates $X_1 = X_{dist}$ are redundant when path composition $X_2 = X_{path}$ and causal reachability $X_4 = X_{reach}$ are present.
* **Rationale**: The utility function $U(S, a)$ evaluates directed path connectivity and failure risk propagation, which are directly captured by $X_2$ and $X_4$. Node-relative geometric coordinates $X_dist$ do not provide any additional utility-relevant constraints.

### 2.2 Structural Baseline Redundancy
* **Prediction**: The structural baseline $\Omega = X_0$ (clustering coefficient, average paths redundancy) is redundant under exact safety.
* **Rationale**: Utility only depends on the subgraphs of active observed elements, not on the global topological properties of the surrounding inactive graph.

---

## 3. Predicted Pareto Frontier $P_0$

We predict that the Pareto frontier of exact decision sufficiency ($\varepsilon = 0.00$) will contain:

1. **$R_{minimal\_1} = X_2 \oplus X_3 \oplus X_4$** (Subsets indices: $\{2, 3, 4\}$).
   * **Epsilon**: $0.00$
   * **Rationale**: This representation contains path geometry ($X_2$), activation counts ($X_3$), and causal connectivity ($X_4$). It eliminates both global baseline $X_0$ and coordinates $X_1$, yielding maximum compression under safety.
2. **$R_{minimal\_2} = X_0 \oplus X_2 \oplus X_3 \oplus X_4$** (Subsets indices: $\{0, 2, 3, 4\}$).
   * **Epsilon**: $0.00$
   * **Rationale**: Standard safety representation including baseline.

We predict that any subset omitting *any* of $\{X_2, X_3, X_4\}$ will fail to achieve sufficiency, yielding $\varepsilon \ge 13.58$.
