# Batch-016 Adversary Search Freeze — Observability-Bounded Regret Space

## 1. Goal

This document freezes the mathematical search space of admissible adversaries ($\mathcal{A}_k$) and the definition of the local regret bound ($B(k)$) for each exploration depth $k \in \{0, 1, 2\}$. Rather than locking a single configuration, we freeze the search protocol to map the continuous regret curve under local ceguera/silence.

---

## 2. Admissible Adversarial Space ($\mathcal{A}_k$)

For each depth $k$, the adversarial space $\mathcal{A}_k$ contains all 5-node / 6-edge directed configurations $A$ that are observationally silent to the local representation $\Omega_{local}^{(k)}$:

\[
\mathcal{A}_k = \left\{ A : d_{|V|}^{(k)} = 0 \ \land \ d_{|E|}^{(k)} = 0 \ \land \ d_\rho^{(k)} \leq 0.05 \ \land \ d_{caps}^{(k)} \leq 0.05 \ \land \ \Delta R^{(k)} \leq 0.10 \ \land \ \Delta Com^{(k)} \leq 0.05 \ \land \ d_{X_i}^{(k)} \leq \varepsilon_{X_i} \right\}
\]

where:
* $d^{(k)}$ represents the transition deviation evaluated using the observable subgraph $O_k$.
* $X_i$ is the augmented scalar representation from Batch-014.

---

## 3. Local Regret Bound ($B(k)$)

For each depth $k$, the local regret bound $B(k)$ is defined as the maximum decision regret (Loss) produced by any silent configuration in $\mathcal{A}_k$:

\[
\boxed{
B(k) = \max_{A \in \mathcal{A}_k} \text{Loss}(A)
}
\]

where the decision Loss for a configuration $A$ is:
\[
\text{Loss}(A) = U_A(a^*_A) - U_A(T_0)
\]
* $U_A$ is the true global utility calculated on the corrupt graph $A$.
* $a^*_A \in \{T_0, T_1\}$ is the optimal intervention under graph $A$.
* $T_0$ is the clean optimal intervention.

---

## 4. Bounded Regret Hypotheses

We freeze the following mathematical hypotheses to be evaluated by the execution runner:

1. **Monotonicity**: The regret bound shrinks as exploration depth increases:
   \[
   \boxed{B(k+1) \le B(k)}
   \]
2. **Completeness**: At full state expansion, the regret bound drops to exactly zero:
   \[
   \boxed{B(2) = 0}
   \]

---

## 5. Mutation Prohibition

The search space $\mathcal{A}_k$, the formula for $B(k)$, and the bounds thresholds are strictly immutable after execution begins.
