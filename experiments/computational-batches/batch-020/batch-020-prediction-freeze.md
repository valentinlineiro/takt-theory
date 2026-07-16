# Batch-020 Prediction Freeze — Global Activation Sufficiency Predictions

## 1. Goal

This document locks in the ex-ante predictions for the global representational regret bounds under the observation-aware activation refinement $R_{active} = R_{path} \oplus X_{activation}$.

---

## 2. Quantitative Predictions

We freeze the predicted global regret bounds:

### 2.1 Baseline $\varepsilon(R_{path})$ (Path Invariant Only)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{path}) = 15.58}
  \]
* **Rationale**: As proven in Batch-019, representations that ignore whether target nodes are observed under $O_k$ suffer maximum regret due to unobserved active edge and node costs.

### 2.2 Refinement $\varepsilon(R_{active})$ (Observation-Aware Activation Invariant)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{active}) = 0.00}
  \]
* **Rationale**: The utility function $U(S, a)$ in Case `DEP-005` is completely determined by:
  1. The count of observed active edges: $|E_{act, a}|$.
  2. The failure rates of observed active nodes: $pFail(v)$ for $v \in V_{act, a}$.
  3. The paths from `'s'` to `'t'` formed by observed active edges.
  
  Since $X_{activation}$ preserves the count of observed active edges and the multiset of attributes of observed active nodes, and $X_{path}$ preserves the paths, the utility of all actions is identical for any two states sharing the same key:
  \[
  key_{active}(S_1) = key_{active}(S_2) \implies U(S_1, a) = U(S_2, a) \quad \forall a \in \mathcal{A}
  \]
  This guarantees that optimal actions are identical ($a^*(S_1) = a^*(S_2)$), collapsing the hidden regret to exactly zero.

---

## 3. Verification Criteria

We freeze the monotonicity and sufficiency verification check:
\[
\boxed{15.58 = \varepsilon(R_{path}) > \varepsilon(R_{path} \oplus X_{activation}) = 0.00}
}
\]

If confirmed, Scenario A (Global Sufficiency) is achieved, proving that aligning the representation with the observational operator closes the decisional safety gap.
