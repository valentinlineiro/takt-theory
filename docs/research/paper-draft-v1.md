# TAKT: Decision Preservation Under Representational Contraction
## A Formal Framework for Dynamic Safety Governance

### Authors
*The TAKT Research Group*

---

## Abstract
Modern decision-making systems increasingly rely on compressed or quantized intermediate representations to operate under computational, bandwidth, or memory constraints. While traditional validation approaches focus on optimizing continuous utility metrics, they frequently fail to detect representational contractions that preserve value but catastrophically violate decision safety. In this paper, we introduce TAKT (Theory of Adequate Knowledge for Decisions), a formal three-tier framework designed to define, verify, and govern decision safety under representational change. 

We formalize a binary decision safety condition based on kernel containment: $\ker(R) \subseteq \ker(D)$. To transition this static logical property into an operational system, we introduce a metric-space Decision Margin $M(R)$, a Fiber Coverage condition $C(T, S)$ for test generalization, and a Dynamic Safety Contract $\mathcal{C}$ that governs policy execution under temporal drift and multi-agent shifts. The framework is formally verified using the Lean 4 theorem prover and validated operationalizing the contract on an external Edge-AI sensor classifier. Our results show that the Dynamic Safety Contract preemptively alerts and disables unsafe policies under drift, whereas standard empirical test sets fail silently.

---

## 1. Introduction & Problem Statement
Machine learning and control systems operating in production rely heavily on representations: feature extractors, neural embeddings, quantization layers, or dimensionality reducers. A representation $R: S \to Z$ maps a large state space $S$ into a compressed domain $Z$.

A fundamental assumption in representational engineering is that minimizing utility regret (e.g., mean squared error) is sufficient for safety. We define the utility regret of $R$ under a utility function $U: S \times A \to \mathbb{R}$ as:
\[
\varepsilon_U(R) = \max_{s \in S} \left( \max_{a \in A} U(s, a) - U(s, \text{argmax}_{a} \mathbb{E}[U \mid R(s)]) \right)
\]
We define the decision regret under the optimal decision operator $D: S \to A$ as:
\[
\varepsilon_D(R) = \max_{s \in S} \mathbb{I}(D(s) \neq D(\text{mode}(R^{-1}(R(s)))))
\]

Our first key result (verified in **ST-001**) is the separation of utility and decision:
\[
\varepsilon_U(R) = 0 \not\implies \varepsilon_D(R) = 0
\]
This separation demonstrates that a representation can preserve utility perfectly while introducing decision violations at indifference boundaries. Consequently, decision safety must be modeled as a core logical property rather than a byproduct of utility optimization.

---

## 2. The Formal Core (Level 1)
TAKT defines decision safety statically using equivalence relations. Let $S$ be a state space, $A$ a decision space, $D: S \to A$ the optimal decision operator, and $R: S \to Z$ the representation mapping. 

The equivalence kernels of $R$ and $D$ are defined as:
\[
\ker(R) = \{ (x, y) \in S \times S \mid R(x) = R(y) \}
\]
\[
\ker(D) = \{ (x, y) \in S \times S \mid D(x) = D(y) \}
\]

**Definition 1 (Decision Safety).** A representation $R$ is safe under $D$ if and only if:
\[
\ker(R) \subseteq \ker(D)
\]
*Theorem (Decisional Factorization).* $R$ is safe if and only if there exists a factorized policy $\pi: Z \to A$ such that $D = \pi \circ R$. 

---

## 3. Taxonomy of Adversarial Failures
Through rigorous stress-testing, we identified five distinct failure modes under which static safety is broken or becomes unobservable:

1. **Semantic Failure (ST-001):** Occurs at indifference boundaries when continuous value differences collapse under the representation.
2. **Compositional Failure (ST-002):** A pipeline of safe components $R_2 \circ R_1$ fails globally if the second stage is not aligned with the intermediate policy induced by the first stage.
3. **Observational Failure (ST-004):** Given a test set $T \subset S$, empirical safety ($\text{safe}_T(R) = \text{True}$) can coexist with global insecurity due to "hidden kernels" in unobserved partitions.
4. **Distributed Failure (ST-005):** Local safety of an agent $B$ is dynamically violated by policy shifts ($\pi_A \to \pi'_A$) of external agents in the environment.
5. **Temporal Failure (ST-006):** Silent representation drift step-by-step ($\Delta R_t < \tau$) accumulates over time and triggers a sudden, catastrophic safety violation.

---

## 4. The Verification & Governance Layers (Levels 2 & 3)
To mitigate these failures, TAKT v3.0 introduces a verification layer and an operational protocol.

### 4.1. Decision Margin
Let $(S, d)$ be a metric space. The **Decision Margin** $M(R)$ measures the distance from a safe representation to the nearest decision boundary:
\[
M(R) = \begin{cases}
\inf \{ d(x, y) \mid R(x) \neq R(y) \land D(x) \neq D(y) \} & \text{if } \ker(R) \subseteq \ker(D) \\
0 & \text{otherwise}
\end{cases}
\]
*Theorem (Perturbation Bound).* If $R_0$ is safe with margin $M(R_0)$, and $R_t$ is a drifted representation with a boundary displacement of $\delta$, then $R_t$ is safe if $\delta < M(R_0)/2$.

### 4.2. Fiber Coverage
Generalization of safety from a test set $T$ to $S$ requires **Fiber Coverage** $C(T, S)$:
\[
C(T, S) \iff \forall x \in S, \quad \exists x' \in T, \quad R(x) = R(x') \land D(x) = D(x')
\]
*Theorem (Generalization).* If $R$ is empirically safe on $T$ and satisfies $C(T, S)$, then $R$ is globally safe on $S$.

### 4.3. The Dynamic Safety Contract
We unify the layers into a **Dynamic Safety Contract** $\mathcal{C}$:
\[
\mathcal{C} = (R_t, D, \pi, T, d, m_{\text{min}})
\]
The contract is satisfied if:
1. $\text{safe}_T(R_t, D) = \text{True}$ (empirical safety)
2. $C(T, S)$ holds (coverage sufficiency)
3. $M(R_t) \ge m_{\text{min}}$ (margin sufficiency)
4. $\forall x \in T, \quad \pi(R_t(x)) = D(x)$ (policy alignment)

---

## 5. Operational Validation (ST-007)
We validated the contract on an Edge-AI sensor classifier. Under sensor drift ($\theta = 3$), the empirical test set $T$ reported 100% safety because the drift did not cause collisions within the test points. However, the contract's margin monitor detected the global boundary violation, showing:
* $\text{safe}_T(R_1) = \text{True}$ (Test set fails silently).
* $M(R_1) = 0 < m_{\text{min}}$ (Contract triggers alarm and disables policy execution).

This confirms that the TAKT v3.0 contract acts as a robust runtime audit mechanism, successfully preventing silent failures.

---

## 6. Discussion & Conclusion
TAKT shifts the paradigm of safety engineering from optimizing average continuous utility to verifying discrete kernel containment. The three-tier architecture separates logical truths (Core) from empirical indicators (Observability) and governance protocols (Operational). Future work will explore the coordination of contract networks in multi-agent environments and adaptive margin thresholds.
