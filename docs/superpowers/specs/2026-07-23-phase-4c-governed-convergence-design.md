# Phase IV-C.1 Design Spec: Detector Evolution Theory & Reachability

**Date:** 2026-07-23  
**Author:** TAKT Core Team & Antigravity AI  
**Status:** Theoretical Design Specification (Fase IV-C.1)  
**Prerequisites:** Phase IV Foundational Spec ([theory-roadmap.md](file:///home/valentin/code/takt-theory/docs/theory-roadmap.md)), Governed Enrichment Framework ([governed-enrichment-framework.md](file:///home/valentin/code/takt-theory/docs/governed-enrichment-framework.md)), ST-015 Structural Sufficiency Theorem, ST-008 Impossibility Theorem.

---

## 1. Executive Summary & Conceptual Shift

The foundational phases of TAKT (Phases I–III) characterized **static representational and decision objects**:
- **Phase I (Impossibility - ST-008):** Defined the static lower boundary where $\ker(R) \not\subseteq \ker(D)$.
- **Phase II (Recovery - CARD-356/357/358):** Defined enrichment providers $E_i : R \to R'$ and capability gaps $G(D, R)$.
- **Phase III (Characterization - ST-015):** Proved the structural sufficiency boundary $\mathcal{R}_{\text{sufficient}}(D) = \{ R : \ker(R) \subseteq K_D \}$ and unique minimum $R_{\text{min}}$.

**Phase IV-C** marks a fundamental paradigm shift: **from static objects to dynamic state transformations of governance systems**. 

Specifically, Phase IV-C.1 establishes the mathematical language for how an executable runtime detector $D_{\text{alg}}$ transforms through valid enrichment steps toward the ideal limit detector $D_{\text{top}}$.

---

## 2. Mathematical Definition of the Detector Evolution Space

### 2.1 The Space of Sound Detectors ($\mathcal{D}_{\text{sound}}$)

Let $\mathcal{D}$ be the universe of governance detectors. A detector $D \in \mathcal{D}$ is a triple:
$$D = (\pi_D, \text{Contract}_D, \text{AuditPolicy}_D)$$
where $\pi_D$ is the representation map, $\text{Contract}_D$ is the decision contract, and $\text{AuditPolicy}_D$ is the runtime monitoring policy.

**Definition 2.1 (Sound Detector Space):**  
The set of sound detectors $\mathcal{D}_{\text{sound}} \subset \mathcal{D}$ consists of all detectors whose governance error bound is zero under their declared domain:
$$\mathcal{D}_{\text{sound}} = \{ D \in \mathcal{D} : \forall \tau, \text{Contract}_D(\tau) = \text{PASS} \implies \text{SafetyViolation}(\tau) = \text{FALSE} \}$$

### 2.2 Enrichment Edges ($\mathcal{E}$)

An enrichment transformation $E : \mathcal{D} \to \mathcal{D}$ is an edge in the detector space adding evidence, observation capability, or contract refinement to a detector.

**Definition 2.2 (Valid Enrichment Relation):**  
An enrichment $E$ is valid for $D_1 \to D_2$, denoted $D_1 \xrightarrow{E} D_2$, if and only if $E(D_1) = D_2$ and $E$ satisfies Soundness Preservation:
$$\text{Sound}(D_1) \land E(D_1) = D_2 \implies \text{Sound}(D_2)$$

### 2.3 Detector Evolution Graph ($\mathcal{G}_D$)

**Definition 2.3 (Detector Evolution Graph):**  
The evolution space of detectors is the directed multigraph:
$$\mathcal{G}_D = (\mathcal{D}_{\text{sound}}, \mathcal{E})$$
where:
- Vertices are sound detectors $D \in \mathcal{D}_{\text{sound}}$.
- Directed edges are valid enrichment transformations $E \in \mathcal{E}$.

---

## 3. Transition Operator & Algebraic Axioms

### 3.1 Transition Operator ($\Phi$)

**Definition 3.1 (Detector Transition Operator):**  
The transition operator $\Phi : \mathcal{D}_{\text{sound}} \times \mathcal{E} \to \mathcal{D}$ applies an enrichment transformation to a detector state:
$$\Phi(D, E) \triangleq E(D)$$

### 3.2 Axioms of Detector Evolution

- **Axiom 1 (Soundness Preservation):**
  $$\forall D \in \mathcal{D}_{\text{sound}}, \forall E \in \mathcal{E}(D) : \Phi(D, E) \in \mathcal{D}_{\text{sound}}$$
  *No valid evolution step can introduce contract-unsoundness.*

- **Axiom 2 (Associative Composition):**
  Given $D_0 \xrightarrow{E_1} D_1$ and $D_1 \xrightarrow{E_2} D_2$:
  $$\Phi(\Phi(D_0, E_1), E_2) = \Phi(D_0, E_2 \circ E_1)$$
  where $(E_2 \circ E_1)(D) = E_2(E_1(D))$.

- **Axiom 3 (Identity Evolution):**
  There exists an identity enrichment $E_{\text{id}} \in \mathcal{E}$ such that $\forall D \in \mathcal{D}_{\text{sound}}$:
  $$\Phi(D, E_{\text{id}}) = D$$

---

## 4. Convergence Trajectories & Governance Equivalence

### 4.1 Evolution Trajectories ($\pi$)

**Definition 4.1 (Valid Trajectory):**  
A trajectory $\pi$ of length $n \ge 0$ in $\mathcal{G}_D$ is a sequence of sound detectors and valid enrichments:
$$\pi = (D_0, E_1, D_1, E_2, \dots, E_n, D_n)$$
such that for all $i \in \{0, \dots, n-1\}$, $D_{i+1} = \Phi(D_i, E_{i+1})$.

We write $D_0 \rightsquigarrow^{\pi} D_n$ or simply $D_0 \rightsquigarrow D_n$.

### 4.2 Governance Equivalence ($\equiv_{\text{gov}}$)

**Definition 4.2 (Governance Equivalence to $D_{\text{top}}$):**  
Let $D_{\text{top}}$ be the ideal (complete-information) detector. A detector $D_n$ is governance-equivalent to $D_{\text{top}}$, denoted $D_n \equiv_{\text{gov}} D_{\text{top}}$, if and only if its decision gap $\Delta_{\text{gov}}(D_n, D_{\text{top}}) = 0$.

---

## 5. Main Results: Detector Evolution Reachability Theorem

### Theorem 5.1 (Detector Evolution Reachability Theorem)
*Statement:* An executable sound detector $D_{\text{alg}} \in \mathcal{D}_{\text{sound}}$ can reach perfect governance $D_{\text{top}}$ if and only if there exists a finite sequence of valid enrichments $(E_1, E_2, \dots, E_n) \in \mathcal{E}^*$ such that:
$$\Phi(D_{\text{alg}}, E_n \circ \dots \circ E_1) \equiv_{\text{gov}} D_{\text{top}}$$

*Proof Sketch:*
1. ($\implies$) If $\text{Reachable}(D_{\text{alg}}, D_{\text{top}})$ holds, by definition of reachability in the evolution graph $\mathcal{G}_D$, there exists a path $\pi$ connecting $D_{\text{alg}}$ to some $D_n \in \mathcal{D}_{\text{sound}}$ where $D_n \equiv_{\text{gov}} D_{\text{top}}$.
2. By Axiom 2 (Associative Composition), the step-by-step application $\Phi(\dots \Phi(D_{\text{alg}}, E_1) \dots, E_n)$ equals $\Phi(D_{\text{alg}}, E_n \circ \dots \circ E_1)$.
3. ($\impliedby$) Conversely, if such an enrichment composite exists and preserves soundness (Axiom 1), the path $\pi$ is a valid trajectory in $\mathcal{G}_D$, proving $\text{Reachable}(D_{\text{alg}}, D_{\text{top}})$. $\blacksquare$

---

## 6. Negative Boundary: Characterization of Unreachability

### Definition 6.1 (Unreachable Detector)
A sound detector $D \in \mathcal{D}_{\text{sound}}$ is **unreachable** with respect to $D_{\text{top}}$ under available enrichments $\mathcal{E}$, written $\text{Unreachable}(D, D_{\text{top}}, \mathcal{E})$, if:
$$\neg \exists \pi : D \rightsquigarrow^{\pi} D_{\text{top}} \quad \text{in } \mathcal{G}_D$$

### Proposition 6.2 (Causes of Unreachability)
$\text{Unreachable}(D_{\text{alg}}, D_{\text{top}}, \mathcal{E})$ occurs if and only if at least one of the following conditions holds:
1. **Empty Enrichment Provider Space:** $\mathcal{E}(D_{\text{alg}}) = \emptyset$.
2. **Capability Closure Deficit:** $\text{Closure}_{\mathcal{E}}(D_{\text{alg}}) \cap \{ D : D \equiv_{\text{gov}} D_{\text{top}} \} = \emptyset$.
3. **Soundness Barrier:** Every path extending $D_{\text{alg}}$ toward $D_{\text{top}}$ requires a transformation $E$ that violates Axiom 1 ($\exists D_k, \Phi(D_k, E) \notin \mathcal{D}_{\text{sound}}$).

---

## 7. Runtime Architecture & Contract Mapping

### 7.1 TypeScript Runtime Interface Mapping

In `cli/src/takt-core/`, Phase IV-C.1 introduces the transition contracts:

```typescript
export interface Detector {
  readonly id: string;
  readonly isSound: boolean;
  readonly capabilities: ReadonlySet<string>;
}

export interface Enrichment {
  readonly id: string;
  readonly targetCapability: string;
  readonly preservesSoundness: boolean;
}

export interface DetectorEvolution {
  /**
   * Applies an enrichment transformation to a detector state.
   * Invariant: evolve(D, E).isSound === true whenever D.isSound && E.preservesSoundness
   */
  evolve(detector: Detector, enrichment: Enrichment): Detector;
  
  /**
   * Evaluates if D_top is reachable from D_alg given available enrichments.
   */
  isReachable(detector: Detector, target: Detector, availableEnrichments: ReadonlyArray<Enrichment>): boolean;
}
```

---

## 8. Explicit Non-Goals & Scope Boundaries for IV-C.1

To maintain mathematical rigor and avoid scope confusion, the following concepts are **explicitly excluded** from Phase IV-C.1 and reserved for subsequent sub-phases:

| Concept | Deferred To Sub-Phase | Reason for Exclusion in IV-C.1 |
| :--- | :--- | :--- |
| Metric Distance $d_{\text{gov}}(D_1, D_2)$ | IV-C.2 (Governance Distance) | Requires defined evolution space before measuring distance. |
| Enrichment Monotonicity & Preorder | IV-C.3 (Enrichment Algebra) | Requires evolution graph topology first. |
| Cost / EVSI Optimization ($\pi^*$) | IV-C.4 (Cost Optimization) | Requires reachability and distance metrics. |
| $\epsilon$-Governance Approximation | IV-C.5 (Approximate Governance) | Requires metric space from IV-C.2. |
| Impossible Convergence Limits | IV-C.7 (Impossibility Results) | Built upon Unreachability from IV-C.1 & Cost bounds. |
