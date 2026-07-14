# Batch-014 Prediction Freeze — Ex-Ante Falsifiable Predictions

## 1. Goal

This document freezes the ex-ante predictions for the representational augmentation candidates $X_1$ and $X_2$ under the joint adversary $A_{014}$ (Case `DEP-005` at transition $k=1 \rightarrow k=2$).

---

## 2. Quantitative Predictions

We statically derive the expected values of the candidates from the graph fixtures and adversary configurations:

### 2.1 Candidate $X_1$: Capability-Role Signature (Hamming-weighted Capabilities)
We define $X_1(k)$ as the sum of node failure rates carrying the recovery capability `Pr`:
\[
X_1(k) = \sum_{v \in V_k} p_f(v) \cdot \mathbb{I}(\text{Pr}_v = \text{true})
\]

* **Clean transition ($k=1 \rightarrow k=2$)**:
  * $V_{clean, 1} = \{s, t, v3\} \implies X_1(1)_{clean} = p_f(v3) \cdot 1 = 0.01$.
  * $V_{clean, 2} = \{s, t, v3, v3\_next, v3\_next\_next\} \implies X_1(2)_{clean} = 0.01$.
  * $\Delta X_{1, clean} = |0.01 - 0.01| = 0.00$.
* **Corrupt transition ($k=1 \rightarrow k=2$)**:
  * $V_{corrupt, 1} = \{s, v3\_next, v3\_next\_next\} \implies X_1(1)_{corrupt} = 0.00$ (since no node in $V_1$ has `Pr = true`).
  * $V_{corrupt, 2} = \{s, t, v3, v3\_next, v3\_next\_next\} \implies X_1(2)_{corrupt} = 0.01$.
  * $\Delta X_{1, corrupt} = |0.01 - 0.00| = 0.01$.
* **Prediction**:
  \[
  \boxed{d_{X1} = 0.01 > \varepsilon_{X1} = 0.005 \quad \text{(Detected, Low Magnitude)}}
  \]

### 2.2 Candidate $X_2$: Structural Failure Sum (Sum of Observed Failure Rates)
We define $X_2(k)$ as the sum of failure rates of observed nodes:
\[
X_2(k) = \sum_{v \in V_k} p_f(v)
\]

* **Clean transition ($k=1 \rightarrow k=2$)**:
  * $V_{clean, 1} = \{s, t, v3\} \implies X_2(1)_{clean} = 0.01$.
  * $V_{clean, 2} = \{s, t, v3, v3\_next, v3\_next\_next\} \implies X_2(2)_{clean} = 0.01 + 0.80 + 0.80 = 1.61$.
  * $\Delta X_{2, clean} = |1.61 - 0.01| = 1.60$.
* **Corrupt transition ($k=1 \rightarrow k=2$)**:
  * $V_{corrupt, 1} = \{s, v3\_next, v3\_next\_next\} \implies X_2(1)_{corrupt} = 0.80 + 0.80 = 1.60$.
  * $V_{corrupt, 2} = \{s, t, v3, v3\_next, v3\_next\_next\} \implies X_2(2)_{corrupt} = 1.61$.
  * $\Delta X_{2, corrupt} = |1.61 - 1.60| = 0.01$.
* **Prediction**:
  \[
  \boxed{d_{X2} = |0.01 - 1.60| = 1.59 > \varepsilon_{X2} = 0.05 \quad \text{(Detected, High Magnitude)}}
  \]

---

## 3. Outcome Classification

We freeze the following classification matrix:

* **Scenario A**: $X_1$ detects, $X_2$ fails.
* **Scenario B**: $X_2$ detects, $X_1$ fails.
* **Scenario C (Expected)**: $X_1$ and $X_2$ both detect ($d_{X1} > 0.005 \land d_{X2} > 0.05$).
* **Scenario D**: $X_1$ and $X_2$ both fail.

### Minimality Verdict:
If **Scenario C** is confirmed, then since:
\[
\dim(X_1) = \dim(X_2) = 1
\]
the minimal dimensional augmentation required to separate the Batch-013 equivalence class is exactly:
\[
\dim(X)_{min} = 1
\]
closing the kernel blind spot with a single scalar sensor.
