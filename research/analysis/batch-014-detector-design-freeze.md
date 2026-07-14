# Batch-014 Detector Design Freeze — Augmented Aggregators

## 1. Goal

This document freezes the operational logic and thresholds for the two candidate representation augmentations ($X_1$ and $X_2$) and the updated joint aggregator $D_{joint}^{+X_i}(\Delta\Omega, \varepsilon)$.

---

## 2. Operational Candidate Sensors

### 2.1 Candidate $X_1$: Capability-Role Signature (Hamming-weighted Capabilities)
* **Operational Formula**: At step $k$, $X_1(k)$ is the sum of node failure rates carrying the recovery capability `Pr`:
  \[
  X_1(k) = \sum_{v \in V_k} p_f(v) \cdot \mathbb{I}(\text{Pr}_v = \text{true})
  \]
  where $V_k$ is the node set of the observable subgraph $O_k$, and $p_f(v)$ is node $v$'s failure rate.
* **Transition Delta**: $\Delta X_1 = |X_1(k+1) - X_1(k)|$.
* **Clean-Corrupt Deviation**: $d_{X1} = |\Delta X_{1, corrupt} - \Delta X_{1, clean}|$.
* **Aggregator Rule**:
  \[
  D_{X_1} = \text{detected} \iff d_{X1} > 0.005
  \]

### 2.2 Candidate $X_2$: Structural Failure Sum (Sum of Observed Failure Rates)
* **Operational Formula**: At step $k$, $X_2(k)$ is the sum of failure rates of observed nodes:
  \[
  X_2(k) = \sum_{v \in V_k} p_f(v)
  \]
* **Transition Delta**: $\Delta X_2 = |X_2(k+1) - X_2(k)|$.
* **Clean-Corrupt Deviation**: $d_{X2} = |\Delta X_{2, corrupt} - \Delta X_{2, clean}|$.
* **Aggregator Rule**:
  \[
  D_{X_2} = \text{detected} \iff d_{X2} > 0.05
  \]

---

## 3. Joint Aggregator Integration

The updated joint detector combines the current representation's aggregation $D_{joint}^{\Omega}$ (from Batch-013) with the candidate sensor $D_{X_i}$:

\[
D_{joint}^{+X_i} = \text{detected} \iff D_{joint}^{\Omega} = \text{detected} \quad \lor \quad D_{X_i} = \text{detected}
\]

Because the frozen adversary $A_{014}$ is proven to bypass $D_{joint}^{\Omega}$ ($D_{joint}^{\Omega} = \text{undetected}$), the joint detector's output simplifies to the candidate's output:
\[
D_{joint}^{+X_i} = D_{X_i}
\]

This isolates the causal impact of the representation augmentation $X_i$ on closing the kernel blind spot.
