# Batch-021 Prediction Freeze — Global Reachability Sufficiency Predictions

## 1. Goal

This document locks in the ex-ante predictions for the global representational regret bounds under the action-conditioned reachability refinement $R_{reach} = R_{active} \oplus X_{reach}$.

---

## 2. Quantitative Predictions

We freeze the predicted global regret bounds:

### 2.1 Baseline $\varepsilon(R_{active})$ (Activation Invariant Only)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{active}) = 13.58}
  \]
* **Rationale**: As proven in Batch-020, even when we know which active edges and nodes are observed, label-blindness prevents us from knowing whether a failed node's path to target is active or blocked under specific actions.

### 2.2 Refinement $\varepsilon(R_{reach})$ (Action-Conditioned Causal Reachability Invariant)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{reach}) = 0.00}
  \]
* **Rationale**: The utility function $U(S, a)$ in Case `DEP-005` evaluates the failure risk of node $v$ only if there is a path from $v$ to `'t'` using the active edges of $a$. Since $X_{reach}$ directly computes this reachability flag for all observed failed nodes under all actions $a \in \mathcal{A}$, the utility contribution of all nodes is completely determined by the representation key:
  \[
  key_{reach}(S_1) = key_{reach}(S_2) \implies U(S_1, a) = U(S_2, a) \quad \forall a \in \mathcal{A}
  \]
  This guarantees that optimal choices are identical ($a^*(S_1) = a^*(S_2)$), collapsing the hidden regret to exactly zero.

---

## 3. Verification Criteria

We freeze the monotonicity and sufficiency verification check:
\[
\boxed{13.58 = \varepsilon(R_{active}) > \varepsilon(R_{active} \oplus X_{reach}) = 0.00}
}
\]

If confirmed, Scenario A (Global Sufficiency) is achieved, proving that aligning the representation with action-conditioned risk propagation semantics closes the decisional safety gap.
