# Convergence Theory: Logical Map of Results & Mathematical Foundations

**Date:** 2026-07-23  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Theoretical Specification (Logical Map)

---

## 0. Executive Summary & Logical Stratification

This document establishes the **Logical Map of Results** for TAKT Convergence Theory. To maintain strict scientific rigor before Lean formalization, results are stratified into:

```text
Definitions (Primitive & Derived Objects)
      ↓
Lemmas (Local Support Properties)
      ↓
Theorems (Proven Core Results with Exact Hypotheses)
      ↓
Corollaries (Immediate Structural Consequences)
      ↓
Observation Sufficiency (Parallel to Volume I Representation Theory)
      ↓
Open Conjectures & Research Program
```

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
If $|X| < \infty$ (A1) and A3 holds, the image set $\Phi(X) \subset \mathbb{R}$ is finite. Any strictly decreasing sequence in $\Phi(X)$ has length at most $|\Phi(X)| \le |X|$.

### Lemma 2.2 (Absorbing State Invariance under Compatibility)
If $s^*$ is an absorbing state of $T$ (Definition 1.4) and $g$ is $T$-compatible, then $g(s^*) = s^*$.

### Lemma 2.3 (DAG Path Length Boundedness)
If $G_T = (X, E)$ is a Directed Acyclic Graph (DAG) with maximum depth $d = \text{depth}(G_T)$, then any $T$-compatible path contains at most $d+1$ distinct states.

---

## 3. Proven Core Theorems

### Theorem 3.1 (Finite Strictly Monotone Fixed-Point Convergence)
**Hypotheses:** Assumptions A1 ($|X| < \infty$), A2 (Deterministic $g$), and A4 (Strict Monotonicity over $\Phi$).  
**Thesis:** For every initial state $x_0 \in X$, the state stream $x(k) = g^k(x_0)$ converges to a fixed point $s^* \in \text{FixedPoint}(g)$ in at most $|X|$ steps.

*Proof:* By Lemma 2.1, $\Phi(x(k))$ forms a strictly decreasing sequence in $\Phi(X)$ for all $x(k) \notin \text{FixedPoint}(g)$. Since $\Phi(X)$ is finite, the strictly decreasing sequence must terminate at some step $N \le |X|$ where $\Phi(g(x(N))) = \Phi(x(N))$. By A4, this implies $x(N) \in \text{FixedPoint}(g)$, so $g(x(N)) = x(N) = s^*$. $\blacksquare$

### Theorem 3.2 (Non-Oscillation under Strict Monotonicity)
**Hypotheses:** Assumption A4 (Strict Monotonicity over $\Phi$).  
**Thesis:** No state stream $x(k)$ can exhibit periodic oscillation of period $p \ge 2$.

*Proof:* Assume $x(k+p) = x(k)$ for $p \ge 2$ with distinct states. By A4, $\Phi(x(k+p)) < \Phi(x(k+p-1)) < \dots < \Phi(x(k))$, which yields $\Phi(x(k+p)) < \Phi(x(k))$, contradicting $\Phi(x(k+p)) = \Phi(x(k))$. $\blacksquare$

### Theorem 3.3 (DAG Convergence and Cycle Impossibility)
**Hypotheses:** The transition graph $G_T = (X, E)$ is a DAG, and $g$ is $T$-compatible.  
**Thesis:** 
1. No periodic oscillation of period $p \ge 2$ can exist under $g$.
2. Every state stream converges to a fixed point in at most $\text{depth}(G_T)$ steps.

*Proof:* (1) A periodic orbit of period $p \ge 2$ forms a directed cycle in $G_T$, contradicting $G_T$ being a DAG. (2) Follows directly from Lemma 2.3. $\blacksquare$

### Theorem 3.4 (Weak Monotonicity Orbit Characterization)
**Hypotheses:** Assumption A1 ($|X| < \infty$) and A3 (Weak Monotonicity).  
**Thesis:** A periodic orbit of period $p \ge 2$ exists under $g$ if and only if there exists a subset $C \subseteq X$ such that $\forall x \in C, \Phi(x) = c$ (constant cost) and $g|_C : C \to C$ forms a closed permutation cycle of length $p$.

*Proof:* $(\Leftarrow)$ Obvious. $(\Rightarrow)$ If $x(k+p) = x(k)$ under A3, $\Phi(x(k)) \ge \Phi(x(k+1)) \ge \dots \ge \Phi(x(k+p)) = \Phi(x(k))$, forcing equality at every step. Thus all states in the orbit have identical cost $c$. $\blacksquare$

### Theorem 3.5 (Connected Component Basin Enclosure)
**Hypotheses:** Let $X = \bigsqcup_{i=1}^m C_i$ be the decomposition of $G_T$ into weakly connected graph components.  
**Thesis:** For any attractor $A$, its basin of attraction $B_A$ is entirely contained within a single component $C_k$.

*Proof:* Transitions in $T$ cannot cross between disconnected components $C_i$ and $C_j$ ($i \neq j$). Thus trajectories initialized in $C_k$ remain in $C_k$. $\blacksquare$

---

## 4. Corollaries

### Corollary 4.1 (Unique Global Attractor under Strict Gradient Reachability)
**Hypotheses:** Assumptions A1, A4, $\Phi$ has a unique minimum $s^*$, AND $s^*$ is reachable from all $x \in X$ under $g$.  
**Thesis:** $\{s^*\}$ is the unique global attractor with basin of attraction $B = X$.

### Corollary 4.2 (Absorbing Fixed-Point Trap)
**Hypotheses:** $s^*$ is an absorbing state of $T$ and $g$ is $T$-compatible.  
**Thesis:** $s^*$ is a fixed point of $g$, and no trajectory initialized at $s^*$ can leave $s^*$.

---

## 5. Observation Sufficiency Theory (Bridge to Volume I)

Parallel to Volume I's **Representational Sufficiency** ($\pi : X \to \bar{X}$ preserving optimal decisions), we establish **Observation Sufficiency** ($\sigma : \text{Trace}(X) \to Y$ preserving dynamic classification).

### Definition 5.1 (Observation Sufficiency)
An observation mapping $\sigma : \text{ExecutionTrace}(X) \to Y$ is **sufficient** for a dynamic classifier $P : \text{ExecutionTrace}(X) \to \{\text{True}, \text{False}\}$ if there exists a reduced classifier $P^* : Y \to \{\text{True}, \text{False}\}$ such that:
$$P(\tau) = P^*(\sigma(\tau)) \quad \forall \tau \in \text{ExecutionTrace}(X)$$

### Definition 5.2 (Information Preorder over Observables)
For two observables $\sigma_1 : \text{Trace}(X) \to Y_1$ and $\sigma_2 : \text{Trace}(X) \to Y_2$, we say $\sigma_1 \le_{\text{info}} \sigma_2$ ($\sigma_1$ is a refinement/coarser observation of $\sigma_2$) if there exists a factorizing map $h : Y_2 \to Y_1$ such that:
$$\sigma_1 = h \circ \sigma_2$$

This directly mirrors the **Factorization Theorem of Volume I** ($\pi_1 = h \circ \pi_2$).

---

## 6. Open Conjectures & Research Program

### Conjecture 6.1 (Minimal Observation Sufficiency for Oscillation)
*Conjecture:* The observation mapping $\sigma_{\text{cycle}}(\tau) = (\text{lastRepeatedState}(\tau), \text{cycleLength}(\tau))$ is minimal (up to information isomorphism $\cong_{\text{info}}$) among all sufficient observables for the oscillation classifier $P_{\text{osc}}$.

### Conjecture 6.2 (Attractor Basin Partitioning)
*Conjecture:* In any finite transition system $T$, the union of all basins of attraction $\bigcup_i B(A_i)$ forms a dense cover of $X \setminus \text{DivergentStates}$.

### Conjecture 6.3 (Representational-Dynamic Duality Theorem)
*Conjecture:* An $M_D$-preserving representational contraction $\pi : X \to \bar{X}$ (Volume I) preserves the dynamic behavior class (Convergent, Oscillatory, Chaotic) of trajectories under $g$.
