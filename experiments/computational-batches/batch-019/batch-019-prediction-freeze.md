# Batch-019 Prediction Freeze — Global Path Suficiency Predictions

## 1. Goal

This document locks in the ex-ante predictions for the global representational regret bounds under the compositional path invariant refinement $R_{path} = R_{dist} \oplus X_{path}$.

---

## 2. Quantitative Predictions

We freeze the predicted global regret bounds:

### 2.1 Baseline $\varepsilon(R_{dist})$ (Landmark-Relative Coordinates)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{dist}) = 15.58}
  \]
* **Rationale**: As proven in Batch-018, relative node coordinate multisets are blind to the composition of paths, leaving the worst-case regret at its maximum.

### 2.2 Refinement $\varepsilon(R_{path})$ (Compositional Path Invariant)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{path}) = 0.00}
  \]
* **Rationale**: The utility function $U(S, a)$ is a deterministic function of the simple directed paths from `'s'` to `'t'` of length $\le 3$ and the attribute sequences along those paths. Since $X_{path}$ preserves the exact multiset of these paths and attribute sequences, the utilities of all actions are identical for any two states sharing the same $X_{path}$ representation:
  \[
  X_{path}(S_1) = X_{path}(S_2) \implies U(S_1, a) = U(S_2, a) \quad \forall a \in \mathcal{A}
  \]
  This guarantees that optimal choices are identical ($a^*(S_1) = a^*(S_2)$), collapsing the hidden regret to exactly zero.

---

## 3. Verification Criteria

We freeze the monotonicity and sufficiency verification check:
\[
\boxed{15.58 = \varepsilon(R_{dist}) > \varepsilon(R_{dist} \oplus X_{path}) = 0.00}
}
\]

If this holds, Scenario A (Global Compositional Sufficiency) is confirmed, proving that aligning representation invariants with the decision computational structure achieves decision safety.
