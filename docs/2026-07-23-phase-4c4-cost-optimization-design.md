# Phase IV-C.4 Design Spec: Cost Optimization & EVSI Theory

**Date:** 2026-07-23  
**Author:** TAKT Core Team & Antigravity AI  
**Status:** Theoretical Design Specification (Fase IV-C.4)  
**Prerequisites:** Phase IV-C.1 Detector Evolution Theory ([2026-07-23-phase-4c-governed-convergence-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c-governed-convergence-design.md)), Phase IV-C.2 Governance Geometry Theory ([2026-07-23-phase-4c2-governance-geometry-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c2-governance-geometry-design.md)), Phase IV-C.3 Enrichment Algebra Theory ([2026-07-23-phase-4c3-enrichment-algebra-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c3-enrichment-algebra-design.md)), `TaktFormal/EnrichmentAlgebra.lean`.

---

## 1. Executive Summary & Prescriptive Shift

Phases IV-C.1 through IV-C.3 established **descriptive governance theory**:
1. **IV-C.1 (Detector Evolution):** Proved existence of paths in the evolution graph $(\mathcal{G}_D, \Phi)$.
2. **IV-C.2 (Governance Geometry):** Defined quantitative distance functionals ($d_{\rightarrow}, d_{\equiv}, \delta(D)$).
3. **IV-C.3 (Enrichment Algebra):** Formulated operations over transformations $(\mathcal{E}, \circ, \vee_E, E_{\text{id}})$.

**Phase IV-C.4 (Cost Optimization & EVSI Theory)** transforms TAKT from descriptive to **prescriptive theory**. It asks:
> *"Out of all possible evolution paths in $\mathcal{G}_D$, which path $\pi^*$ minimizes global resource cost and decision regret, and when is it rational to stop evolving before reaching $D_{\text{top}}$?"*

---

## 2. Mathematical Definition of Cost & EVSI Functionals

### 2.1 Trajectory Cost Functional ($C(\pi)$)

Let $\pi = (D_0, E_1, D_1, E_2, \dots, E_n, D_n)$ be a valid evolution trajectory in $\mathcal{G}_D$.

**Definition 2.1 (Trajectory Cost):**  
The cost $C(\pi) \in \mathbb{N}$ is the additive sum of acquisition cost $C_{\text{acq}}$ and residual distance penalty $C_{\text{residual}}$:
$$C(\pi) \triangleq \sum_{i=1}^n \left( C_{\text{acq}}(E_i) + \delta(D_i) \right)$$
where $C_{\text{acq}}(E_i) \ge 1$ is the cost of acquiring enrichment $E_i$, and $\delta(D_i) = d_{\rightarrow}(D_i, D_{\text{top}})$ is the residual distance.

### 2.2 Expected Value of Sample Information ($EVSI$)

**Definition 2.2 (Governance EVSI):**  
For a detector state $D$ and enrichment transformation $E$, the $EVSI(E \mid D) \in \mathbb{N}$ measures the quantitative distance reduction achieved by applying $E$:
$$EVSI(E \mid D) \triangleq \delta(D) - \delta(\Phi(D, E))$$

By Theorem 3.2 of IV-C.2, for strict progress steps, $EVSI(E \mid D) > 0$.

### 2.3 Optimal Evolution Trajectory ($\pi^*$)

**Definition 2.3 (Optimal Evolution Trajectory):**  
Given an initial sound detector $D_{\text{alg}}$ and target $D_{\text{top}}$, an evolution trajectory $\pi^* = D_{\text{alg}} \rightsquigarrow D_{\text{top}}$ is **cost-optimal** if:
$$C(\pi^*) = \min_{\pi : D_{\text{alg}} \rightsquigarrow D_{\text{top}}} C(\pi)$$

### 2.4 Rational EVSI Stopping Criterion

**Definition 2.4 (Optimal Stopping Condition):**  
An evolution process stops rationally at detector $D^*$ if for all available registered enrichment providers $E \in \mathcal{E}_{\text{known}}$:
$$EVSI(E \mid D^*) \le C_{\text{acq}}(E)$$
At this point, acquiring further capabilities costs more than the decision value gained by reducing governance distance.

---

## 3. Four Core Theorems for Cost Optimization & EVSI

### Theorem 3.1 (Path Cost Additivity & Monotonicity)
*Statement:* For any trajectories $\pi_1 = D_0 \rightsquigarrow D_1$ and $\pi_2 = D_1 \rightsquigarrow D_2$, the cost of concatenation satisfies additivity:
$$C(\pi_1 \cdot \pi_2) = C(\pi_1) + C(\pi_2)$$
Furthermore, adding enrichment steps strictly increases acquisition cost: $C(\pi_1 \cdot E) > C(\pi_1)$.

### Theorem 3.2 (EVSI Monotonicity under Distance Reduction)
*Statement:* For any sound detector $D \in \mathcal{D}_{\text{sound}}$ and valid enrichment $E \in \mathcal{E}_{\text{valid}}$, $EVSI(E \mid D) > 0$ if and only if $E$ is a strict progress step ($\delta(\Phi(D, E)) < \delta(D)$).

### Theorem 3.3 (Optimal Trajectory Existence Theorem)
*Statement:* In any finite evolution graph $\mathcal{G}_D$ with finite provider set $\mathcal{E}_{\text{known}}$ where $Reachable(D_{\text{alg}}, D_{\text{top}})$, there exists at least one cost-optimal path $\pi^* = \arg\min_{\pi} C(\pi)$.

### Theorem 3.4 (Rational EVSI Stopping Theorem)
*Statement:* If $EVSI(E \mid D^*) \le C_{\text{acq}}(E)$ for all available providers $E \in \mathcal{E}_{\text{known}}$, continuing evolution beyond $D^*$ strictly increases net expected cost $C_{\text{net}} = C_{\text{acq}} - EVSI$.

---

## 4. Frozen Abstract Contracts for Runtime

```typescript
export interface CostOptimization {
  /** Computes the total trajectory cost C(\pi) */
  computePathCost(trajectory: ReadonlyArray<Enrichment>, initialDetector: Detector): number;
  
  /** Computes EVSI(E | D) */
  computeEVSI(detector: Detector, enrichment: Enrichment): number;
  
  /** Evaluates if rational stopping criterion is satisfied */
  shouldStopRationally(detector: Detector, availableEnrichments: ReadonlyArray<Enrichment>): boolean;
  
  /** Finds the optimal trajectory \pi^* via cost minimization */
  findOptimalTrajectory(initial: Detector, target: Detector, providers: ReadonlyArray<Enrichment>): ReadonlyArray<Enrichment>;
}
```

---

## 5. Explicit Non-Goals & Scope Boundaries for IV-C.4

| Concept | Deferred To Sub-Phase | Reason for Exclusion in IV-C.4 |
| :--- | :--- | :--- |
| $\epsilon$-Governance Approximation | IV-C.5 (Approximate Governance) | Requires optimal cost bounds from IV-C.4 first. |
| Impossibility Limits ($\mathcal{E} = \emptyset$) | IV-C.7 (Impossibility Results) | Evaluated over complete optimization space. |
