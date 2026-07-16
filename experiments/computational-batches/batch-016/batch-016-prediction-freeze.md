# Batch-016 Prediction Freeze — Ex-Ante Regret Curve Predictions

## 1. Goal

This document freezes the ex-ante predictions for the local regret bounds $B(k)$ at each exploration depth $k \in \{0, 1, 2\}$ under the local representation $\Omega_1 = \Omega \oplus X_2$.

---

## 2. Quantitative Curve Predictions

We freeze the predicted local regret bounds $B(k)$ derived from the fixture and adversary spaces:

### 2.1 Depth $k=0$ (Focal Node Only)
* **Predicted Bound**:
  \[
  \boxed{B(0) \ge 13.58}
  \]
* **Rationale**: At $k=0$, the observer only sees `'s'`. The adversary can construct Configuration #187 (or similar permutations) where the high-risk node `v3_next` ($pFail = 0.8$) is rearranged, flipping the optimal candidate decision and producing regret of at least $13.58$.

### 2.2 Depth $k=1$ (Boundary 1)
* **Predicted Bound**:
  \[
  \boxed{B(1) = 1.00}
  \]
* **Rationale**: At $k=1$, the observer sees $\{s, t, v3\}$, with $pFail(v3) = 0.01$ and $Pr(v3) = \text{true}$. 
  * Any permutation swapping `v3_next` ($pFail = 0.8$) into $V_1$ will trigger $d_{X2} = 0.80 > 0.05$ or capability/reliability deltas, and is detected.
  * The only silent permutation is the transposition of `'t'` and `'v3_next_next'` (both having $pFail = 0.00$ and $Pr = \text{false}$), which is the Batch-015 adversary $A_{kernel}^{(2)}$.
  * This transposition produces a regret of exactly $1.00$.
  * Thus, the maximum hidden regret is capped at exactly $1.00$.

### 2.3 Depth $k=2$ (Full State $S$)
* **Predicted Bound**:
  \[
  \boxed{B(2) = 0.00}
  \]
* **Rationale**: At $k=2$, $O_2 = S$. All node identities, capabilities, and positions are fully resolved, leaving no blind spots. Thus, no regret can hide.

---

## 3. Outcome Classification: Scenario A — Bounded Local Regret

We freeze the following verification criteria:

* **Scenario A (Expected)**:
  * Regret bounds are monotonic: $B(0) > B(1) > B(2)$ (specifically: $B(0) \ge 13.58 > B(1) = 1.00 > B(2) = 0.00$).
  * The completeness invariant holds: $B(2) = 0.00$.
* **Scenario C (Falsified)**:
  * If any regret bound violates monotonicity (e.g. $B(1) < B(2)$) or if $B(2) > 0.00$ (representing failure of the completeness invariant).
