# Batch-014 Question Freeze — Closing the Observability Kernel

## 1. Origin

Batch-013 proved the existence of a kernel-intersecting adversary ($A_{kernel}^{(187)}$) exploiting a fundamental gap in $\Omega$: **structural equivalence does not imply decision-semantic equivalence**. The structural metrics in $\Omega$ treat nodes as anonymous entities, whereas the utility engine relies on the specific identity and failure rates of each node.

Batch-014 aims to identify and evaluate the minimal additional information dimension $X$ that must be appended to the state vector transition $\Delta\Omega$ to close this blind spot:
\[
(\Omega, X)(S) \neq (\Omega, X)(A(S))
\]

---

## 2. Core Question

\[
\boxed{
\exists X \quad \text{s.t.} \quad D_{joint}(\Delta(\Omega, X), \varepsilon) = \text{detected} \quad \land \quad \text{size}(X) \text{ is minimized}
}
\]

Equivalently: **What is the minimal additional representation dimension $X$ (representing decision-semantic role preservation) that, when integrated into $\Omega$, successfully exposes label-permutation attacks without collapsing the computational benefits of the contracted state?**

---

## 3. Candidate Invariants ($X$)

We explore two main candidate invariants for $X$:

### 3.1 Candidate $X_1$: Capability-Role Signature (Hamming-weighted Capabilities)
* **Definition**: A vector that maps observed capability signatures to their specific BFS distance sets, weighted by the failure rates of the nodes carrying them:
  \[
  X_1(k) = \sum_{v \in V_k} p_f(v) \cdot C_k(v)
  \]
  Because permutation changes which node failure rates are associated with which topological distances, this breaks the structural isomorphism of the representation.

### 3.2 Candidate $X_2$: Structural Failure Entropy
* **Definition**: The entropy of failure rates across BFS distance shells:
  \[
  X_2(k) = -\sum_{d} P(p_f | \text{dist}=d) \log P(p_f | \text{dist}=d)
  \]
  This measures the distribution of risks across the BFS exploration steps, flagging if high-risk tasks are rearranged relative to the focal node.

---

## 4. Operational Aggregator Rule

For the updated representation $(\Omega, X)$, the joint aggregator $D_{joint}$ is expanded to include the deviation of $X$:

\[
D_{joint} = \text{detected} \iff \Delta\Omega \text{ triggers} \quad \lor \quad |\Delta X| > \varepsilon_X
\]

---

## 5. Success Scenarios

### Scenario A — Closed Kernel
* **Condition**: Appending $X_1$ or $X_2$ successfully flags the permutation ($D_{joint} = \text{detected}$) while keeping the size of $X$ negligible (preserving the tractability of the contraction).
* **Implication**: The kernel blind spot of $\Omega$ is closed. Governed contraction is maintained by exposing a minimal role-preservation signature.

### Scenario C — Inherent Epistemic Boundary
* **Condition**: No low-dimensional candidate $X$ can detect the permutation; any successful detection requires exposing the full system state $S$ (collapsing the contraction).
* **Implication**: The permutation blind spot is a fundamental boundary of local representation. The system cannot monitor role-rearrangements without full observability.
