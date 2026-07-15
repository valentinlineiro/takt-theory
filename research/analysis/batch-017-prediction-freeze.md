# Batch-017 Prediction Freeze — Symmetry Mismatch Predictions

## 1. Goal

This document freezes the ex-ante predictions for the size of the remaining symmetry mismatch set ($|M_{X_i}|$) for each candidate refinement $X_i$ on the 120 node permutations of the canonical graph $S_{clean}$.

---

## 2. Quantitative Predictions

We freeze the predicted size of the remaining mismatch set for each candidate:

### 2.1 Baseline $|M|$ (No Refinement)
* **Predicted Size**:
  \[
  \boxed{|M| \ge 2}
  \]
* **Rationale**: The label-transposition adversary $A_{kernel}^{(2)}$ (swapping `'t'` and `'v3_next_next'`) is completely silent under $\Omega_1$ but changes the optimal action, so it and its inverse are guaranteed to belong to $M$.

### 2.2 Refinement $X_{dist}$ (Relative Distance Signature)
* **Predicted Size**:
  \[
  \boxed{|M_{X_{dist}}| \ge 2}
  \]
* **Rationale**: Because `'t'` and `'v3_next_next'` share identical attributes ($pFail = 0.00$, $Pr = \text{false}$), swapping their labels does not alter the multiset of signature tuples. The signature multiset remains silent, while the utility engine (which matches utility against the literal label `'t'`) changes decision. Thus, $X_{dist}$ fails to close the mismatch.

### 2.3 Refinement $X_{reach}$ (Reachability Signature)
* **Predicted Size**:
  \[
  \boxed{|M_{X_{reach}}| \ge 2}
  \]
* **Rationale**: For the same reason as $X_{dist}$, reachability signatures paired with attributes are invariant to the label transposition of attribute-equivalent nodes.

### 2.4 Refinement $X_{target}$ (Target Distance Invariant)
* **Definition**: $X_{target}(S) = dist(s, t)$ (shortest path distance from source to target).
* **Predicted Size**:
  \[
  \boxed{|M_{X_{target} \oplus X_{dist}}| = 0}
  \]
* **Rationale**: By explicitly tracking the distance of the decision target node `'t'` relative to the source `'s'`, any transposition that shifts the target's relative coordinates changes $X_{target}$ and is detected. Combining $X_{target}$ and the signature multiset $X_{dist}$ is predicted to fully close the symmetry mismatch.

---

## 3. Outcome Classification: Scenario A — Symmetry Closure

If $|M_{X_{target} \oplus X_{dist}}| = 0$, then Scenario A (Symmetry Closure) is confirmed for the combined refinement, showing that relative coordinates anchored by decision targets achieve decisional sufficiency.
