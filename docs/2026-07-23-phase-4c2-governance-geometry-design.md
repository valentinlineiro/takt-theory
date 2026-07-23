# Phase IV-C.2 Design Spec: Governance Geometry Theory

**Date:** 2026-07-23  
**Author:** TAKT Core Team & Antigravity AI  
**Status:** Theoretical Design Specification (Fase IV-C.2)  
**Prerequisites:** Phase IV-C.1 Detector Evolution Theory ([2026-07-23-phase-4c-governed-convergence-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c-governed-convergence-design.md)), `TaktFormal/DetectorEvolution.lean`.

---

## 1. Executive Summary & Conceptual Shift

Phase IV-C.1 answered the qualitative reachability question: *"Can a sound detector evolve toward perfect governance?"* by constructing the evolution space $(\mathcal{G}_D, \Phi)$ and proving the Detector Evolution Reachability Theorem.

**Phase IV-C.2 (Governance Geometry Theory)** transitions from qualitative reachability ("Does a path exist?") to **quantitative geometry**:
- How far is an initial detector $D$ from perfect governance $D_{\text{top}}$?
- How do we separate directed evolutionary trajectories from symmetric equivalence metric spaces?

We establish a **Dual Geometry** on $\mathcal{D}_{\text{sound}}$, separating directed evolution distance $d_{\rightarrow}$ from symmetric equivalence distance $d_{\equiv}$.

---

## 2. Mathematical Definitions of Governance Geometry

### 2.1 Directed Evolutionary Distance ($d_{\rightarrow}$)

Let $\mathcal{G}_D = (\mathcal{D}_{\text{sound}}, \mathcal{E})$ be the detector evolution graph from IV-C.1.

**Definition 2.1 (Directed Evolutionary Distance):**  
For any $D_1, D_2 \in \mathcal{D}_{\text{sound}}$, the directed evolutionary distance $d_{\rightarrow}(D_1, D_2) \in \mathbb{N} \cup \{\infty\}$ is the minimum path length in $\mathcal{G}_D$:
$$d_{\rightarrow}(D_1, D_2) \triangleq \begin{cases} \min \{ |\pi| : \pi = D_1 \rightsquigarrow D_2 \text{ in } \mathcal{G}_D \} & \text{if } \text{Reachable}(D_1, D_2) \\ \infty & \text{otherwise} \end{cases}$$

#### Properties of $d_{\rightarrow}$:
1. **Self-Identity:** $d_{\rightarrow}(D, D) = 0$.
2. **Directed Triangle Inequality:** $d_{\rightarrow}(D_1, D_3) \le d_{\rightarrow}(D_1, D_2) + d_{\rightarrow}(D_2, D_3)$.
3. **Asymmetry:** In general, $d_{\rightarrow}(D_1, D_2) \neq d_{\rightarrow}(D_2, D_1)$ because evolution is directed along the semilattice order $D_1 \preceq D_2$.

### 2.2 Geometric Governance Pseudometric ($d_{\equiv}$)

**Definition 2.2 (Governance Equivalence Distance):**  
On the quotient space $\mathcal{D}_{\text{sound}} / \equiv_{\text{gov}}$, the symmetric pseudometric $d_{\equiv}(D_1, D_2) \in \mathbb{N}$ measures operational non-equivalence regardless of path direction:
$$d_{\equiv}(D_1, D_2) \triangleq | \text{capabilities}(D_1) \Delta \text{capabilities}(D_2) |$$
where $\Delta$ denotes symmetric difference.

#### Properties of $d_{\equiv}$:
1. **Symmetry:** $d_{\equiv}(D_1, D_2) = d_{\equiv}(D_2, D_1)$.
2. **Triangle Inequality:** $d_{\equiv}(D_1, D_3) \le d_{\equiv}(D_1, D_2) + d_{\equiv}(D_2, D_3)$.
3. **Indiscernibility modulo Equivalence:** $d_{\equiv}(D_1, D_2) = 0 \iff D_1 \equiv_{\text{gov}} D_2$.

### 2.3 Distance to Perfection ($\delta(D)$)

**Definition 2.3 (Perfection Distance Functional):**  
The distance to perfect governance $\delta(D) \in \mathbb{N} \cup \{\infty\}$ for a sound detector $D \in \mathcal{D}_{\text{sound}}$ is:
$$\delta(D) \triangleq d_{\rightarrow}(D, D_{\text{top}})$$

---

## 3. Four Core Theorems for Governance Geometry

### Theorem 3.1 (Extended Quasi-Metric Space)
*Statement:* The pair $(\mathcal{D}_{\text{sound}}, d_{\rightarrow})$ forms an extended quasi-metric space.

*Proof Sketch:*
- $d_{\rightarrow}(D, D) = 0$ via the identity trajectory $\pi = (D)$ of length 0.
- Triangle inequality holds by path concatenation: if $\pi_1 = D_1 \rightsquigarrow D_2$ of length $L_1$ and $\pi_2 = D_2 \rightsquigarrow D_3$ of length $L_2$, then $\pi_1 \cdot \pi_2 = D_1 \rightsquigarrow D_3$ has length $L_1 + L_2 \ge d_{\rightarrow}(D_1, D_3)$. $\blacksquare$

### Theorem 3.2 (Monotonic Distance Reduction under Progress)
*Statement:* For any $D_1, D_2 \in \mathcal{D}_{\text{sound}}$ and valid enrichment $E \in \mathcal{E}$, if $D_2 = \Phi(D_1, E)$ and $E$ is a strict progress step (adding a new capability), then:
$$\delta(D_2) < \delta(D_1)$$

*Proof Sketch:*
- If $\delta(D_1) = L$, there exists a minimal path $\pi = (D_1, E_1, D_2', \dots, D_{\text{top}})$ of length $L$.
- Substituting $D_2 = \Phi(D_1, E)$ yields a remaining trajectory of length $L - 1$. Hence $\delta(D_2) \le L - 1 < \delta(D_1)$. $\blacksquare$

### Theorem 3.3 (Perfection Boundary Characterization)
*Statement:* A sound detector $D \in \mathcal{D}_{\text{sound}}$ achieves perfect governance if and only if its distance to perfection is zero:
$$\delta(D) = 0 \iff D \equiv_{\text{gov}} D_{\text{top}}$$

### Theorem 3.4 (Qualitative to Quantitative Gap Bridge)
*Statement:* The qualitative governance gap $\Delta_{\text{gov}}(D, D_{\text{top}}) > 0$ from Phase IV-B holds if and only if $\delta(D) > 0$.

---

## 4. Frozen Abstract Contracts for Runtime

```typescript
export interface GovernanceGeometry {
  /** Directed evolutionary distance d_{\rightarrow}(D1, D2) */
  directedDistance(d1: Detector, d2: Detector, providers: ReadonlyArray<Enrichment>): number;
  
  /** Symmetric equivalence distance d_{\equiv}(D1, D2) */
  equivalenceDistance(d1: Detector, d2: Detector): number;
  
  /** Distance to perfection \delta(D) */
  distanceToPerfection(d: Detector, target: Detector, providers: ReadonlyArray<Enrichment>): number;
}
```

---

## 5. Explicit Non-Goals & Scope Boundaries for IV-C.2

| Concept | Deferred To Sub-Phase | Reason for Exclusion in IV-C.2 |
| :--- | :--- | :--- |
| Enrichment Provider Algebra & Compositions | IV-C.3 (Enrichment Algebra) | Requires geometry metrics before algebraic laws. |
| Cost / EVSI Optimization ($\pi^*$) | IV-C.4 (Cost Optimization) | Requires distance functional $\delta(D)$ before optimizing path costs. |
| $\epsilon$-Governance Approximation | IV-C.5 (Approximate Governance) | Requires metric bounds from IV-C.2. |
