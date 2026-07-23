# TAKT Scientific Positioning & Literature Audit

> **Document Status:** Active Scientific Audit (Step 1 / Pillar 3).  
> **Prerequisites:** Lean 4 verified core (`v1.0.0-formal-core`, ST-015), Volumes I–V, `docs/2026-07-23-scientific-positioning-audit-design.md`.

---

## Executive Summary & Audit Scope

This document presents the systematic scientific audit comparing TAKT (**Theory of Adequate Knowledge for Decisions**) against foundational results in decision theory, formal verification, category theory, POMDP planning, and value of information theory.

The objective of this audit is to establish TAKT's precise mathematical positioning, identifying:
1. Structural inclusions (where TAKT embeds classical results under minimal assumptions).
2. Theoretical separations (where TAKT relaxes or departs from classical frameworks).
3. Original contributions (novel mathematical primitives and certified invariants).

Section 1 focuses on **Decision Theory and Information: Blackwell Comparison of Experiments (1951/1953)** vs. **TAKT Capability Kernel Refinement ($\text{ker}(R) \subseteq K_D$)**.

---

## 1. Decision Theory & Blackwell Sufficiency Audit

### 1.1 Context & Classical Formalism (Blackwell 1951, 1953)

In statistical decision theory, David Blackwell (1951, 1953) established the foundational framework for ordering statistical experiments by their decision-theoretic informativeness.

#### Definition 1.1 (Statistical Experiment)
A statistical experiment is a tuple:
$$\mathcal{E} = (\Theta, \mathcal{X}, \{P_\theta\}_{\theta \in \Theta})$$
where $\Theta$ is a parameter (or state) space, $\mathcal{X}$ is a sample space of observations, and $\{P_\theta\}_{\theta \in \Theta}$ is a family of probability distributions over $\mathcal{X}$. Alternatively, an experiment can be defined via a Markov kernel $\sigma: \Theta \to \Delta(\mathcal{X})$.

#### Theorem 1.1 (Blackwell Informativeness Theorem, 1953)
Given two experiments $\mathcal{E}_1 = (\Theta, \mathcal{X}_1, \{P^1_\theta\})$ and $\mathcal{E}_2 = (\Theta, \mathcal{X}_2, \{P^2_\theta\})$, experiment $\mathcal{E}_1$ is **more informative than** $\mathcal{E}_2$ (denoted $\mathcal{E}_1 \succeq_{\text{Blackwell}} \mathcal{E}_2$) if and only if any of the following three equivalent conditions hold:

1. **Economic Criterion:** For *every* action space $A$, *every* bounded utility function $u: \Theta \times A \to \mathbb{R}$, and *every* prior distribution $p \in \Delta(\Theta)$, the maximum expected utility achievable under $\mathcal{E}_1$ is at least as large as under $\mathcal{E}_2$:
   $$\sup_{\delta_1} \mathbb{E}_{\theta \sim p, x_1 \sim P^1_\theta}[u(\theta, \delta_1(x_1))] \ge \sup_{\delta_2} \mathbb{E}_{\theta \sim p, x_2 \sim P^2_\theta}[u(\theta, \delta_2(x_2))]$$

2. **Garbling Criterion (Markov Kernel Sufficiency):** There exists a Markov transition kernel $Q: \mathcal{X}_1 \to \Delta(\mathcal{X}_2)$ (a stochastic noise transformation or *garbling*) such that $\mathcal{E}_2$ is obtained by adding noise to $\mathcal{E}_1$:
   $$P^2_\theta(B) = \int_{\mathcal{X}_1} Q(x_1, B) \, dP^1_\theta(x_1) \quad \forall \theta \in \Theta, \, \forall B \in \mathcal{B}(\mathcal{X}_2)$$

3. **Convex Uncertainty Criterion:** For *every* prior $p \in \Delta(\Theta)$ and *every* convex function $\phi: \Delta(\Theta) \to \mathbb{R}$ over posterior belief distributions, the expected uncertainty under $\mathcal{E}_1$ is greater than or equal to that under $\mathcal{E}_2$ (mean-preserving spread of posteriors).

---

### 1.2 TAKT Capability Kernel Refinement ($\text{ker}(R) \subseteq K_D$) & Structural Sufficiency

TAKT models decision systems under minimal algebraic and combinatoric assumptions, isolating decision preservation without imposing probability measures or stochastic garblings.

#### Definition 1.2 (TAKT Decision Contract & Capability Kernel)
Let $S$ be a state space, $A$ an action space, and $D: S \to A$ a decision map (where $D(s) = \arg\max_{a \in A} U(s,a)$ for a utility function $U: S \times A \to \mathbb{R}$). 

Let $C_D$ be the set of capability invariants required by task $D$, and for each $c \in C_D$, let $K_c \subseteq S \times S$ be an equivalence relation partitioning $S$. The **Capability Kernel** $K_D$ is defined as the intersection of equivalence relations:
$$K_D = \bigcap_{c \in C_D} K_c$$

#### Axiom 0 (A0 - Decision-Kernel Compatibility)
The capability kernel preserves the decision boundary:
$$\text{ker}(K_D) \subseteq \text{ker}(D)$$
where $\text{ker}(D) = \{(s_1, s_2) \in S \times S : D(s_1) = D(s_2)\}$.

#### Theorem 1.2 (Structural Sufficiency Theorem ST-015 / Lean Certified)
Let $R: S \to Z$ be a state representation mapping. The representation $R$ is decision-sufficient for task $D$ ($R \in \mathcal{R}_{\text{sufficient}}(D)$) if and only if its kernel refines the capability kernel $K_D$:
$$R \in \mathcal{R}_{\text{sufficient}}(D) \iff \text{ker}(R) \subseteq K_D$$

Moreover, $\mathcal{R}_{\text{sufficient}}(D)$ forms an upset in the lattice of equivalence relations, possessing a unique minimal sufficient representation:
$$R_{\text{min}} = S / K_D \quad \text{such that} \quad \text{ker}(R_{\text{min}}) = K_D$$

*Lean 4 Verification:* Certified in `TaktFormal/StructuralSufficiency.lean` (`T1_characterization`, `T2_upset`, `R_min`).

---

### 1.3 Comparative Audit: Blackwell Garbling vs. TAKT Kernel Refinement

| Eje de Comparación | Blackwell Experiment Ordering (1951, 1953) | TAKT Kernel Refinement ($\text{ker}(R) \subseteq K_D$) |
| :--- | :--- | :--- |
| **Primitiva Teórica** | Experimentos probabilísticos $\mathcal{E} = (\Theta, \mathcal{X}, \{P_\theta\})$ | Contrato decisional $D: S \to A$ y Kerneles $K_D$ |
| **Cuantificación** | Universal ($\forall U, \forall A, \forall p \in \Delta(\Theta)$) | Específico a la tarea ($\text{ker}(R) \subseteq K_D$ para $D$ fijo) |
| **Transformación** | Kernel estocástico $Q: \mathcal{X}_1 \to \Delta(\mathcal{X}_2)$ (Garbling) | Refinamiento de partición $\text{ker}(R) \subseteq K_D$ (Determinista) |
| **Preservación** | Reducción estocástica de información esperada | Preservación binaria exacta del valor de decisión |
| **Métrica de Pérdida** | Riesgo esperado $R_{\mathcal{E}}(\theta, \delta) = \mathbb{E}[L(\theta, \delta(x))]$ | Regret decisional $\varepsilon_U(s) = \max_a U(s,a) - U(s, D_R(s))$ |
| **Complejidad / Verificación** | Intractable / Indecidible en espacios continuos generales | Algoritmo de verificación en runtime $O(1)$ amortizado |
| **Representación Mínima** | Espacio cociente sobre estadísticas suficientes estadísticas | Representación cociente canónica $R_{\text{min}} = S / K_D$ |

---

### 1.4 How TAKT Relaxes Blackwell Sufficiency to Task-Specific Decision Contracts

The comparison between Blackwell ordering and TAKT kernel refinement reveals a fundamental theoretical relaxation executed by TAKT:

#### 1. Universal vs. Task-Specific Scope
Blackwell's ordering requires an experiment $\mathcal{E}_1$ to dominate $\mathcal{E}_2$ across **all possible utility functions $u$ and all possible action sets $A$**. This makes Blackwell ordering extremely strict: two experiments are often incomparable ($\mathcal{E}_1 \not\succeq \mathcal{E}_2$ and $\mathcal{E}_2 \not\succeq \mathcal{E}_1$).

TAKT **relaxes universal sufficiency to task-specific sufficiency**. Instead of demanding that a representation $R$ preserve information for any imaginable decision problem, TAKT restricts the requirement to a specific decision contract $D$ (or family of capability constraints $C_D$).

#### 2. Stochastic Garbling vs. Algebraic Partition Refinement
In Blackwell's framework, information loss is modeled as a Markov kernel $Q(x_2 \mid x_1)$ adding random noise (garbling). 

TAKT replaces stochastic garbling with **algebraic kernel refinement**: $\text{ker}(R) \subseteq K_D$. Under TAKT, a representation $R: S \to Z$ abstracts state space $S$ by partitioning it into equivalence classes $[s]_R$. Safety requires that no equivalence class of $R$ straddles a boundary where decision contract $D$ changes.

#### 3. Elimination of Probabilistic Measures and Priors
Blackwell's formulation depends explicitly on sample distributions $P_\theta$, prior distributions $p(\theta)$, and expectations. 

TAKT operates **without priors or probability measures**, establishing decision preservation purely through set-theoretic inclusion of kernels $\text{ker}(R) \subseteq K_D \subseteq \text{ker}(D)$. This renders TAKT directly applicable to logical, deterministic, and discrete runtime architectures where probabilistic belief distributions are unavailable or non-computable.

#### 4. Operational Computability & Runtime Verification
Because Blackwell ordering requires universal quantification over infinite-dimensional function spaces ($\forall u, \forall A, \forall p$), testing whether $\mathcal{E}_1 \succeq_{\text{Blackwell}} \mathcal{E}_2$ is generally undecidable in continuous state spaces.

In contrast, TAKT's task-specific criterion $\text{ker}(R) \subseteq K_D$ reduces to algebraic checking of equivalence relations. This enables the implementation of online monitoring components (`ContractEvaluator` and `TrajectoryMonitor`) running in $O(1)$ amortized time.

---

### 1.5 Structural Embedding Theorem & Separation Counterexample

#### Theorem 1.3 (Embedding of Blackwell Sufficiency in TAKT)
Let $\mathcal{E}_1$ and $\mathcal{E}_2$ be two deterministic experiments represented as state mappings $R_1: S \to Z_1$ and $R_2: S \to Z_2$. If $R_1$ dominates $R_2$ in the sense of deterministic Blackwell garbling (i.e., $\exists \phi: Z_1 \to Z_2$ such that $R_2 = \phi \circ R_1$), then for any decision contract $D$ with capability kernel $K_D$:
$$\text{ker}(R_2) \subseteq K_D \implies \text{ker}(R_1) \subseteq K_D$$

*Proof.* If $R_2(s_1) = R_2(s_2)$, then $\phi(R_1(s_1)) = \phi(R_1(s_2))$. Hence $R_1(s_1) = R_1(s_2) \implies R_2(s_1) = R_2(s_2)$, meaning $\text{ker}(R_1) \subseteq \text{ker}(R_2)$. If $\text{ker}(R_2) \subseteq K_D$, by transitivity of set inclusion $\text{ker}(R_1) \subseteq K_D$. $\blacksquare$

#### Counterexample 1.1 (Separation: TAKT Safety without Blackwell Dominance)
Consider state space $S = \{s_1, s_2\}$, action space $A = \{a, b\}$, and decision contract $D(s_1) = a, D(s_2) = b$.

Let $R_1: S \to \{0, 1\}$ with $R_1(s_1) = 0, R_1(s_2) = 1$.  
Let $U_1(s_1, a) = 10, U_1(s_1, b) = 0, U_1(s_2, a) = 0, U_1(s_2, b) = 10$.  
Let $U_2(s_1, a) = 2, \, U_2(s_1, b) = 0, U_2(s_2, a) = 0, U_2(s_2, b) = 2$.

Under TAKT, representation $R_1$ is perfectly safe for both $U_1$ and $U_2$ because $\text{ker}(R_1) = \Delta_S \subseteq \text{ker}(D_1) = \text{ker}(D_2) = \Delta_S$. TAKT treats both systems as decisionally equivalent ($\varepsilon_D = 0$).

However, under Blackwell's theorem, scaling utilities changes the magnitude of expected loss under randomized decision rules or noisy observations, rendering the systems non-equivalent in Blackwell's risk metric. This proves that TAKT isolates decision preservation order independently of utility scaling and probabilistic garbling.

---

### 1.6 Epistemological Conclusions & Boundaries

1. **TAKT isolates Decision Preservation as a First-Class Primitive:** While Blackwell treats decision preservation as a derived consequence of universal statistical informativeness over all utility functions, TAKT takes task-specific decision preservation ($\text{ker}(R) \subseteq K_D$) as an axiomatic starting point.
2. **Minimal Structure Requirement:** TAKT achieves maximum generality by removing requirements for probability measures, priors, and stochastic garblings, providing guarantees where Blackwell's theorem is inapplicable or intractable.
3. **Formal Positioning Statement:**
   > *TAKT relaxes Blackwell's universal stochastic experiment order ($\mathcal{E}_1 \succeq \mathcal{E}_2$) to task-specific deterministic capability kernel refinement ($\text{ker}(R) \subseteq K_D$), yielding a computable, probability-free, and Lean-certified decision-preservation framework.*
