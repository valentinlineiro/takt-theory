# Batch-023 Question Freeze — Quotient Partition Search

## 1. Origin

Batch-022 mapped the Pareto-optimal frontier of the tested invariant powerset, proving that $R_{minimal} = X_{path} \oplus X_{reach}$ achieves exact safety ($\varepsilon = 0.00$) with only 412 equivalence classes. However, this is only minimal *relative to the candidate component invariants*. It remains open whether the 412 classes can be coarsened further, or if they already align perfectly with the decision kernel $\ker(D)$.

Batch-023 analyzes the quotient partition of $R_{minimal}$ against the decision kernel $\ker(D)$ to establish global representational minimality.

---

## 2. Core Question

We define two distinct decision kernels over the state space $\mathcal{S}_{023}$:

1. **The Optimal Action Kernel ($\ker(D_{opt})$)**:
   \[
   S_1 \sim_{D\_opt} S_2 \iff a^*(S_1) = a^*(S_2)
   \]
   This partition has exactly $|\mathcal{A}| = 2$ classes ($T_0$ optimal vs. $T_1$ optimal).
2. **The Exact Utility Kernel ($\ker(D_{util})$)**:
   \[
   S_1 \sim_{D\_util} S_2 \iff U(S_1, a) = U(S_2, a) \quad \forall a \in \mathcal{A}
   \]
   This partition groups configurations that yield identical utility profiles for all actions.

**What is the exact cardinality of the utility kernel partition $|\mathcal{S} / \ker(D_{util})|$ over the 38,760 graphs, and does the minimal representation partition $\ker(R_{minimal})$ match it exactly?**
\[
\boxed{
\ker(R_{minimal}) \stackrel{?}{=} \ker(D_{util})
}
\]

If $\ker(R_{minimal}) = \ker(D_{util})$, then $R_{minimal}$ is the **globally coarsest representation** that preserves exact utility semantics. If $\ker(R_{minimal}) \subsetneq \ker(D_{util})$, then the 412 fibers contain redundant distinctions that can be safely collapsed.

---

## 3. Outcome Regimes

### Scenario A — Exact Quotient Alignment (Global Minimality)
* **Condition**: The partition size of $R_{minimal}$ matches the exact utility partition size:
  \[
  |\mathcal{S} / \ker(R_{minimal})| = |\mathcal{S} / \ker(D_{util})| = 412
  \]
* **Implication**: $R_{minimal}$ is globally minimal; it preserves only the exact utility distinctions consumed by the decision model.

### Scenario C — Redundant Distinctions
* **Condition**: The utility partition has fewer than 412 classes:
  \[
  |\mathcal{S} / \ker(D_{util})| < 412
  \]
* **Implication**: $R_{minimal}$ preserves some structural properties that are utility-neutral, leaving room for further quotient coarsening.
