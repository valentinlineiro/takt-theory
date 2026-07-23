# Convergence Theory: Structural Dynamics of Infinite Trajectories

**Date:** 2026-07-22 (Refined 2026-07-23)  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Design Specification

---

## 0. Architectural Position & Dependency DAG

Convergence Theory is the first layer of TAKT that introduces time as a primary continuum. It is built strictly on top of Transition Systems and Search Theory.

The conceptual dependency DAG is strictly feed-forward:

```
Transition System (T) + Strategy (S)
              ↓
  1. Infinite Trajectories (τ : ℕ → X)
              ↓
  2. Dynamic Behaviors (Taxonomy of Trajectory Types)
              ↓
  3. Stability Objects & Invariance Properties
              ↓
  4. Mathematical Observation Layer
              ↓
  5. Open Problems & Scope Boundaries
```

---

## 1. Infinite Trajectories

### 1.1 Formal Definition
Given a transition system $T = (X, E)$ with state space $X$ and transition relation $E \subseteq X \times X$, an **infinite trajectory** $\tau$ is a sequence:
$$\tau : \mathbb{N} \to X$$
such that for all $k \in \mathbb{N}$, $(\tau(k), \tau(k+1)) \in E$.

### 1.2 Strategy-Induced Infinite Trajectories
Given a strategy $S$ and a restart policy $f : X \to X$, the trajectory sequence induced from initial state $x_0 \in X$ is defined by:
- $x_0 \in X$
- $\tau_0 = \text{run}(S, x_0)$
- $x_{k+1} = f(\text{terminalState}(\tau_k))$
- $\tau_{k+1} = \text{run}(S, x_{k+1})$

The concatenated sequence of terminal states generates the state stream $x : \mathbb{N} \to X$ where $x(k) = \text{terminalState}(\tau_k)$.

---

## 2. Dynamic Behaviors

Dynamic behaviors are structural classifications of the state stream $x : \mathbb{N} \to X$. They represent behavior classes, not optimization outcomes.

### 2.1 Convergent Behavior
A state stream $x$ is **convergent** to a subset $R \subseteq X$ if there exists $N \in \mathbb{N}$ such that for all $k \ge N$, $x(k) \in R$:
$$\text{Convergent}(x, R) \iff \exists N \in \mathbb{N}, \forall k \ge N, x(k) \in R$$

### 2.2 Oscillatory Behavior
A state stream $x$ is **oscillatory** with period $p \ge 1$ if there exists $N \in \mathbb{N}$ such that for all $k \ge N$:
$$\text{Oscillatory}(x, p) \iff \exists N \in \mathbb{N}, \forall k \ge N, x(k+p) = x(k)$$
*(Note: $p=1$ corresponds to a stationary stream).*

### 2.3 Divergent Behavior
A state stream $x$ is **divergent** if it visits an infinite number of distinct states and does not enter any finite stable region $R \subset X$:
$$\text{Divergent}(x) \iff |\{x(k) : k \in \mathbb{N}\}| = \infty \land \neg \exists R \subset X \text{ finite s.t. } \text{Convergent}(x, R)$$

### 2.4 Chaotic Exploration
A state stream $x$ exhibits **chaotic exploration** if it remains bounded within a region $R \subseteq X$ without settling into any periodic orbit:
$$\text{Chaotic}(x, R) \iff \text{Convergent}(x, R) \land \forall p \ge 1, \neg \text{Oscillatory}(x, p)$$

---

## 3. Stability Objects & Invariance Properties

We strictly separate **objects** (mathematical entities), **properties** (predicates over subsets), and **behaviors** (trajectory classes).

### 3.1 Properties over State Subsets
- **Invariant Region**: A set $R \subseteq X$ is *invariant* under strategy $S$ and transition system $T$ if for any state $s \in R$, $\text{terminalState}(\text{run}(S, s)) \in R$:
  $$\text{Invariant}(R, S, T) \iff \forall s \in R, \text{terminalState}(\text{run}(S, s)) \in R$$
- **Stable Region**: A region $R \subseteq X$ is *stable* if it is invariant and minimal with respect to set inclusion under the strategy's dynamics.

### 3.2 Stability Objects
- **Fixed Point**: A state $s^* \in X$ is a *fixed point* if $\{s^*\}$ is an invariant region:
  $$\text{FixedPoint}(s^*, S, T) \iff \text{terminalState}(\text{run}(S, s^*)) = s^*$$
- **Absorbing State**: A fixed point $s^* \in X$ from which no outgoing transition in $T$ exists:
  $$\text{AbsorbingState}(s^*, S, T) \iff \text{FixedPoint}(s^*, S, T) \land \forall a \in A, \neg \exists s', (s^* \xrightarrow{a} s' \in E)$$
- **Attractor**: An invariant region $A \subseteq X$ associated with a basin of attraction $B \subseteq X$ ($B \supseteq A$) such that:
  $$\text{Attractor}(A, B, S, T) \iff \text{Invariant}(A, S, T) \land \forall s_0 \in B, \text{Convergent}(\text{stateStream}(s_0), A)$$
- **Basin of Attraction**: The maximal set $B \subseteq X$ for an attractor $A$ satisfying the condition above.

---

## 4. Observation Layer (Mathematical Observables)

The observation layer maps infinite state streams into mathematical observables without specifying runtime APIs or algorithms.

$$\text{Infinite Trajectory } \tau \longrightarrow \text{Observable } \Phi(\tau) \longrightarrow \text{Predicate}$$

### 4.1 Observable Predicates
- **$\text{hasStabilized}(\tau, W, R)$**: Holds if within observation window $W \subset \mathbb{N}$, all states belong to invariant region $R$.
- **$\text{isOscillating}(\tau, W, p)$**: Holds if within observation window $W$, the stream satisfies $x(k+p) = x(k)$ for all $k \in W$.
- **$\text{convergenceRate}(\tau, R)$**: The mathematical infimum index $N^* = \inf \{N \in \mathbb{N} : \forall k \ge N, x(k) \in R\}$.

---

## 5. Open Problems & Scope Boundaries

The following topics are **explicitly out of scope** for Convergence Theory Phase 1:
1. **Convergence Rates & Performance Optimization**: Proving rate bounds or comparing strategies based on convergence speed.
2. **Lyapunov Functions & Energy Functional Proofs**: Continuous energy functions are deferred until metrics are introduced.
3. **Adaptive Strategies & Online Learning**: Strategies that modify their own transition choices based on trajectory history belong to **Adaptive Strategy Theory** (Stage IV).
4. **Stochastic & Probabilistic Convergence**: Measure-theoretic and probabilistic convergence (almost sure, in expectation) are deferred to Stochastic TAKT.
