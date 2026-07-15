# Batch-016 Question Freeze — Local Decision Sufficiency

## 1. Origin

Batch-013 and Batch-015 proved that ad-hoc representation expansions ($\Omega_0 \rightarrow \Omega_1 = \Omega_0 \oplus X$) fail to achieve decision sufficiency under pressure, as the adversary simply shifts the blind spot to more abstract equivalence classes (such as swapping identical attribute-carrying nodes to permute their decision roles).

Batch-016 shifts the question from **sensor expansion** to **decision-semantic equivalence closure**.

---

## 2. Core Question

We formulate the definition of a **Decision-Sufficient Representation** ($\Omega^*$):
\[
\Omega^*(S) = \Omega^*(S') \implies \arg\max_a U(a, S) = \arg\max_a U(a, S')
\]

While a global representation can trivialize this by exposing the full graph state $S$, TAKT requires a **governed contraction** that is locally observable at expansion depth $k$ via $O_k$:

\[
\boxed{
\max \text{Loss}(A) \leq \text{bound}(k) \quad \text{s.t.} \quad \Delta\Omega_{local}^{(k)} = \vec{0}
}
\]

Equivalently: **Can we define a local representation $\Omega_{local}^{(k)}$ at depth $k$ that guarantees the maximum decision regret (Loss) under any topological or label-permutation adversary is bounded by a function $f(k)$ that decays as $k \rightarrow kMax$?**

---

## 3. Candidate Local Representations ($\Omega_{local}^{(k)}$)

We evaluate the following candidate invariants at depth $k$:

### 3.1 Candidate $X_{path}$: Local Target Connectivity Bound
* **Definition**: The set of active paths from the focal element to target `'t'` that lie entirely within $O_k$, along with the failure attributes of the nodes participating in those paths:
  \[
  X_{path}(k) = \left\{ \text{paths}(s \rightarrow t) \text{ in } O_k \right\}
  \]
  This makes the target's topological relation to observed node identities explicit within the representation.

### 3.2 Candidate $X_{regret}$: Local Utility Estimators
* **Definition**: Bounded utility intervals $[U_{min}(a, O_k), U_{max}(a, O_k)]$ representing the worst-case and best-case utilities of each candidate action $a$, computed assuming worst-case capabilities for unobserved nodes outside $O_k$.

---

## 4. Outcome Regimes

### Scenario A — Bounded Local Regret
* **Condition**: We prove that by appending $X_{path}$ or $X_{regret}$, the maximum possible decision Loss from any silent adversary is bounded by $f(k)$, and $f(kMax) = 0$.
* **Implication**: Bounded Decision Sufficiency is achievable locally. The representation successfully controls the risk of silent regret.

### Scenario C — Epistemic Decoupling
* **Condition**: A silent adversary can still produce unbounded decision Loss at any $k < kMax$, meaning regret bounds do not decay until full global observability is reached ($k = kMax$).
* **Implication**: Local representation is fundamentally decoupled from global decision safety. Bounded regret requires full state exposure.
