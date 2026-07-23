# Convergence Theory: Logical Map of Results & Research Program

**Date:** 2026-07-23  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Theoretical Specification (Logical Map & Research Program)

---

## 0. Executive Summary & Unified Principle

This document establishes the **Logical Map of Results** for TAKT Convergence Theory.

### The Unified Principle of Information Sufficiency
> **A transformation of information is sufficient when it preserves exactly the relevant property for a target observer or decision-maker.**

- **Volume I (State Space)**: $R$ is sufficient $\iff D(R) = D(X)$ (preserves optimal decision).
- **Volume III (Trajectory Space)**: $O$ is sufficient $\iff C(O(\tau)) = C(\tau)$ (preserves dynamic classification).

---

## 1. Structural Definitions

Let $T = (X, E)$ be a transition system with state space $X$ and transition relation $E \subseteq X \times X$. Let $g : X \to X$ be a deterministic step map induced by a strategy $S$ and restart policy $f$, such that $g$ is **$T$-compatible**: $\forall x \in X, (x, g(x)) \in E \lor g(x) = x$.

- **Definition 1.1 (State Stream)**: A sequence $x : \mathbb{N} \to X$ where $x(k+1) = g(x(k))$ for initial state $x(0) = x_0$.
- **Definition 1.2 (Cost Functional & Monotonicity)**: A functional $\Phi : X \to \mathbb{R}$.
  - **Weak Monotonicity (A3)**: $\forall x \in X, \Phi(g(x)) \le \Phi(x)$.
  - **Strict Monotonicity (A4)**: $\forall x \notin \text{FixedPoint}(g), \Phi(g(x)) < \Phi(x)$.
- **Definition 1.3 (Fixed Point)**: $s^* \in X$ such that $g(s^*) = s^*$.
- **Definition 1.4 (Absorbing State of $T$)**: $s^* \in X$ such that $\neg \exists y \in X \setminus \{s^*\}, (s^*, y) \in E$.
- **Definition 1.5 (Invariant Region)**: $R \subseteq X$ such that $\forall x \in R, g(x) \in R$.
- **Definition 1.6 (Attractor & Basin)**: An invariant set $A \subseteq X$ is an *attractor* with *basin of attraction* $B \subseteq X$ ($B \supseteq A$) if $\forall x_0 \in B, \exists N \in \mathbb{N}, \forall k \ge N, x(k) \in A$.

---

## 2. Supporting Lemmas

### Lemma 2.1 (Finite Monotone Image Bound)
- **Minimal Hypotheses:** A1 ($|X| < \infty$), A3 (Weak Monotonicity).
- **Dependencies:** Def 1.1, Def 1.2.
- **Runtime Significance:** Guarantees upper bound on trajectory history length.
- **Status:** `Proven`

*Statement:* The image set $\Phi(X) \subset \mathbb{R}$ is finite. Any strictly decreasing sequence in $\Phi(X)$ has length at most $|\Phi(X)| \le |X|$.

### Lemma 2.2 (Absorbing State Invariance under Compatibility)
- **Minimal Hypotheses:** $s^*$ absorbing state of $T$, $g$ is $T$-compatible.
- **Dependencies:** Def 1.4, $T$-compatibility.
- **Runtime Significance:** Guarantees that search cannot leave dead-end termination states.
- **Status:** `Proven`

*Statement:* If $s^*$ is an absorbing state of $T$ and $g$ is $T$-compatible, then $g(s^*) = s^*$.

### Lemma 2.3 (DAG Path Length Boundedness)
- **Minimal Hypotheses:** $G_T = (X, E)$ is a DAG, $g$ is $T$-compatible.
- **Dependencies:** Graph Theory / Transition System definitions.
- **Runtime Significance:** Bounds search depth on directed acyclic execution spaces.
- **Status:** `Proven`

*Statement:* If $G_T = (X, E)$ is a DAG with maximum depth $d = \text{depth}(G_T)$, then any $T$-compatible path contains at most $d+1$ distinct states.

---

## 3. Core Theorems

### Theorem 3.1 (Finite Strictly Monotone Fixed-Point Convergence)
- **Minimal Hypotheses:** A1 ($|X| < \infty$), A2 (Deterministic $g$), A4 (Strict Monotonicity over $\Phi$).
- **Dependencies:** Lemma 2.1.
- **Runtime Significance:** Guarantees finite-step termination of gradient-compatible strategies.
- **Status:** `Proven`

*Statement & Proof:* For every initial state $x_0 \in X$, the state stream $x(k) = g^k(x_0)$ converges to a fixed point $s^* \in \text{FixedPoint}(g)$ in at most $|X|$ steps. $\Phi(x(k))$ forms a strictly decreasing sequence in $\Phi(X)$ for non-fixed points. Finite image forces termination at $N \le |X|$ where $g(x(N)) = x(N)$. $\blacksquare$

### Theorem 3.2 (Non-Oscillation under Strict Monotonicity)
- **Minimal Hypotheses:** A4 (Strict Monotonicity over $\Phi$).
- **Dependencies:** Def 1.2.
- **Runtime Significance:** Allows classifiers to safely skip cycle-detection when cost is strictly decreasing.
- **Status:** `Proven`

*Statement & Proof:* No state stream $x(k)$ can exhibit periodic oscillation of period $p \ge 2$. Strict decrease $\Phi(x(k+p)) < \Phi(x(k))$ contradicts periodic equality $\Phi(x(k+p)) = \Phi(x(k))$. $\blacksquare$

### Theorem 3.3 (DAG Convergence and Cycle Impossibility)
- **Minimal Hypotheses:** $G_T$ is a DAG, $g$ is $T$-compatible.
- **Dependencies:** Lemma 2.3.
- **Runtime Significance:** Guarantees convergence on non-cyclic workflows without requiring cost functionals.
- **Status:** `Proven`

*Statement & Proof:* 1. No periodic oscillation of period $p \ge 2$ can exist under $g$. 2. Every state stream converges to a fixed point in at most $\text{depth}(G_T)$ steps. Cycles in $g$ would form cycles in $G_T$, contradicting the DAG hypothesis. $\blacksquare$

### Theorem 3.4 (Weak Monotonicity Orbit Characterization)
- **Minimal Hypotheses:** A1 ($|X| < \infty$), A3 (Weak Monotonicity).
- **Dependencies:** Lemma 2.1.
- **Runtime Significance:** Enables `findAttractor` to isolate plateau cycles of constant cost.
- **Status:** `Proven`

*Statement & Proof:* A periodic orbit of period $p \ge 2$ exists under $g$ if and only if there exists a subset $C \subseteq X$ such that $\forall x \in C, \Phi(x) = c$ (constant cost) and $g|_C : C \to C$ forms a closed permutation cycle of length $p$. $\blacksquare$

### Theorem 3.5 (Connected Component Basin Enclosure)
- **Minimal Hypotheses:** $X = \bigsqcup_{i=1}^m C_i$ partition into weakly connected graph components of $G_T$.
- **Dependencies:** $T$-compatibility.
- **Runtime Significance:** Enables parallel observers to analyze basins independently across components.
- **Status:** `Proven`

*Statement & Proof:* For any attractor $A$, its basin of attraction $B_A$ is entirely contained within a single component $C_k$. Transitions cannot cross disconnected components. $\blacksquare$

---

## 4. Corollaries

### Corollary 4.1 (Unique Global Attractor under Strict Gradient Reachability)
- **Minimal Hypotheses:** A1, A4, unique minimum $s^*$ of $\Phi$, $s^*$ reachable from all $x \in X$ under $g$.
- **Dependencies:** Theorem 3.1.
- **Runtime Significance:** Identifies optimal strategies that globally converge to the unique optimum.
- **Status:** `Proven`

### Corollary 4.2 (Absorbing Fixed-Point Trap)
- **Minimal Hypotheses:** $s^*$ absorbing state of $T$, $g$ is $T$-compatible.
- **Dependencies:** Lemma 2.2.
- **Runtime Significance:** Ensures observers correctly identify dead-end states as stationary traps.
- **Status:** `Proven`

---

## 5. Observation Sufficiency Theory (Bridge to Volume I)

### Definition 5.1 (Observation Sufficiency)
An observation mapping $\sigma : \text{ExecutionTrace}(X) \to Y$ is **sufficient** for a dynamic classifier $P : \text{ExecutionTrace}(X) \to \{\text{True}, \text{False}\}$ if there exists a reduced classifier $P^* : Y \to \{\text{True}, \text{False}\}$ such that $P(\tau) = P^*(\sigma(\tau))$ for all $\tau$.

### Definition 5.2 (Information Preorder over Observables)
For two observables $\sigma_1 : \text{Trace}(X) \to Y_1$ and $\sigma_2 : \text{Trace}(X) \to Y_2$, we say $\sigma_1 \le_{\text{info}} \sigma_2$ ($\sigma_1$ is a coarser observation than $\sigma_2$) if there exists a factorizing map $h : Y_2 \to Y_1$ such that $\sigma_1 = h \circ \sigma_2$.

*Symmetry with Volume I:* Mirrors the Factorization Theorem of Volume I ($\pi_1 = h \circ \pi_2$).

---

## 6. Open Conjectures & Research Program

### Conjecture 6.1 (Minimal Observation Sufficiency for Oscillation)
- **Status:** `Open Conjecture`
- **Goal:** Prove that $\sigma_{\text{cycle}}(\tau) = (\text{lastRepeatedState}(\tau), \text{cycleLength}(\tau))$ is minimal (up to $\cong_{\text{info}}$) among all sufficient observables for oscillation classification.

### Conjecture 6.2 (Attractor Basin Partitioning)
- **Status:** `Open Conjecture`
- **Goal:** Prove that in any finite transition system $T$, the union of all basins of attraction $\bigcup_i B(A_i)$ forms a dense cover of $X \setminus \text{DivergentStates}$.

### Conjecture 6.3 (Representational-Dynamic Duality Theorem)
- **Status:** `Open Conjecture`
- **Goal:** Prove that an $M_D$-preserving representational contraction $\pi : X \to \bar{X}$ (Volume I) preserves the dynamic behavior class (Convergent, Oscillatory, Chaotic) of trajectories under $g$.
