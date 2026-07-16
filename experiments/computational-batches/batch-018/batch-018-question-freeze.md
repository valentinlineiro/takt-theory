# Batch-018 Question Freeze — $\varepsilon$-Decision Sufficiency

## 1. Origin

Batch-017 successfully closed the label-transposition symmetry gap for a specific permutation group, demonstrating that $\ker(R) \subseteq \ker(D)$ can be enforced through role-relative coordinates. However, exact decision sufficiency ($\varepsilon = 0$) is often too restrictive or expensive to enforce globally. 

Batch-018 shifts the research to **$\varepsilon$-Decision Sufficiency**, defining a quantitative metric of representation safety based on the maximum decisional regret hidden inside representation fibers.

---

## 2. Core Question

We define the representational regret bound $\varepsilon(R)$ over the state space $\mathcal{S}$ as:
\[
\varepsilon(R) = \sup_{z \in Z} \sup_{S, S' \in R^{-1}(z)} Regret_D(S, S')
\]
where the pairwise decision regret is:
\[
Regret_D(S, S') = U(S, a^*(S)) - U(S, a^*(S'))
\]
* $a^*(S) = \arg\max_a U(S, a)$ is the optimal action under state $S$.
* $a^*(S')$ is the optimal action under state $S'$ (which the agent chooses when observing representation $z = R(S') = R(S)$).

**Can we calculate the exact regret bound $\varepsilon(R)$ for various candidate representations ($R_i$) over the complete space of 38,760 directed graphs, establishing a quantitative mapping of representation safety?**

---

## 3. Candidate Representations under Evaluation

We map the regret bound $\varepsilon(R)$ for the following representations at $k = kMax$:

1. **$R_0 = \Omega$** (Baseline structural and capability metrics).
2. **$R_1 = \Omega \oplus X_2$** (Augmented structural failure sum).
3. **$R_2 = \Omega \oplus X_{reach}$** (Bipartite reachability coordinates).
4. **$R_3 = \Omega \oplus X_{dist}$** (Relative distance coordinates).

---

## 4. Outcome Regimes

### Scenario A — Bounded Risk Policy Mapping
* **Condition**: We successfully map the complete spectrum:
  \[
  \varepsilon(R_0) \ge \varepsilon(R_1) \ge \varepsilon(R_2) \ge \varepsilon(R_3) = 0.00
  \]
  confirming that each representational refinement monotonically shrinks the maximum hidden regret.
* **Implication**: TAKT can replace binary safety checks with a quantitative policy threshold $\tau$, accepting bounded-risk representations when $\varepsilon(R) \le \tau$.

### Scenario C — Regret Discontinuity
* **Condition**: The regret bound does not decrease monotonically under partial refinements, or $\varepsilon(R_3)$ remains greater than $0.00$ due to residual unmodeled symmetries.
