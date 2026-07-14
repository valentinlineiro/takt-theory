# Batch-014 Adversary Freeze — Adversary Reuse and Causal Invariants

## 1. Goal

This document freezes the reuse of the joint adversary $A_{kernel}^{(187)}$ as the immutable adversary $A_{014}$ for Batch-014. By keeping the adversary and its associated utility regret constant, we isolate the representational augmentation ($X_i$) as the sole independent variable under test.

---

## 2. Immutable Adversary Configuration ($A_{014}$)

The adversary configuration is strictly equivalent to Configuration #187 from Batch-013:

* **Corrupt Edges**:
  1. `s -> v3_next`
  2. `s -> v3_next_next`
  3. `v3 -> t`
  4. `v3_next_next -> t`
  5. `v3_next -> v3`
  6. `v3_next_next -> v3_next`
* **Intervention Edge Updates**:
  * **$T_0$ Active Edges**: `s->v3_next`, `s->v3_next_next`, `v3->t`, `v3_next_next->t`, `v3_next->v3`, `v3_next_next->v3_next`
  * **$T_1$ Active Edges**: `s->v3_next`, `s->v3_next_next`, `v3_next_next->t`, `v3_next->v3`, `v3_next_next->v3_next`

### 2.1 Mutation Prohibition
Any modification to the edges or nodes of $A_{014}$ is strictly prohibited. The adversary must not be adjusted or tailored to favor either candidate representation ($X_1$ or $X_2$).

---

## 3. Causal Constants

Under $A_{014}$, the baseline results from Batch-013 are frozen as invariants:

* **Utility Regret (Loss)**: $\text{Loss} = 13.58 > 0$
* **Joint State Delta (Current $\Omega$)**: $\Delta\Omega = \vec{0}$
* **Joint Detection (Current $\Omega$)**: $D_{joint}(\Delta\Omega) = \text{undetected}$

---

## 4. Representational Minimality Hypothesis

We evaluate the intervention $\Omega \rightarrow (\Omega, X_i)$ where $\text{size}(X_i) = \dim(X_i) = 1$:

1. Proving that $\dim(X) = 0$ is insufficient to detect $A_{014}$ is established by the Batch-013 result ($D_{joint} = \text{undetected}$).
2. If either candidate representation ($X_1$ or $X_2$) satisfies $D_{joint}(\Delta(\Omega, X_i)) = \text{detected}$, we establish:
   \[
   \dim(X)_{min} = 1
   \]
   proving that a single additional scalar dimension of semantic information is necessary and sufficient to separate this equivalence class and close the kernel blind spot.
