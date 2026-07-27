# Phase IV-C.1 Design Spec: Detector Evolution Theory & Reachability

**Date:** 2026-07-23  
**Author:** TAKT Core Team & Antigravity AI  
**Status:** Theoretical Design Specification (Fase IV-C.1 - Refined)  
**Prerequisites:** Phase IV Foundational Spec ([theory-roadmap.md](docs/theory-roadmap.md)), Governed Enrichment Framework ([governed-enrichment-framework.md](docs/governed-enrichment-framework.md)), ST-015 Structural Sufficiency Theorem, ST-008 Impossibility Theorem.

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

Let $\mathcal{D}$ be the universe of governance detectors. A detector $D \in \mathcal{D}$ is a static triple:
$$D = (\pi_D, \text{Contract}_D, \text{AuditPolicy}_D)$$
where $\pi_D$ is the representation map, $\text{Contract}_D$ is the decision contract, and $\text{AuditPolicy}_D$ is the runtime monitoring policy.

> **Architectural Separation Principle:** A Detector $D$ represents the *current static state of governance*. A Detector does not contain its own transformation logic or know how to enrich itself; transformations are executed exclusively by external evolution operators in $\mathcal{E}$.

**Definition 2.1 (Sound Detector Space):**  
The set of sound detectors $\mathcal{D}_{\text{sound}} \subset \mathcal{D}$ consists of all detectors whose governance error bound is zero under their declared domain:
$$\mathcal{D}_{\text{sound}} = \{ D \in \mathcal{D} : \forall \tau, \text{Contract}_D(\tau) = \text{PASS} \implies \text{SafetyViolation}(\tau) = \text{FALSE} \}$$

### 2.2 Enrichment Edges ($\mathcal{E}$)

An enrichment transformation $E : \mathcal{D} \to \mathcal{D}$ is an external edge in the detector space adding evidence, observation capability, or contract refinement to a detector.

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

## 3. Transition Operator & The Five Core Invariants

### 3.1 Transition Operator ($\Phi$)

**Definition 3.1 (Detector Transition Operator):**  
The transition operator $\Phi : \mathcal{D}_{\text{sound}} \times \mathcal{E} \to \mathcal{D}_{\text{sound}}$ is executed by an external `EvolutionEngine`. It applies an enrichment transformation $E$ to a detector state $D$:
$$\Phi(D, E) \triangleq E(D)$$

### 3.2 The Five Core Invariants of Detector Evolution

Every valid evolution operator in Phase IV-C.1 must satisfy five foundational invariants:

| # | Invariant | Formal Statement | Purpose & Architectural Significance |
| :--- | :--- | :--- | :--- |
| **1** | **Soundness Preservation** | $\forall D \in \mathcal{D}_{\text{sound}}, E \in \mathcal{E}(D) \implies \Phi(D, E) \in \mathcal{D}_{\text{sound}}$ | Prevents any evolution step from breaking runtime safety. |
| **2** | **Composition** | $\Phi(\Phi(D_0, E_1), E_2) = \Phi(D_0, E_2 \circ E_1)$ | Enables multi-step enrichment chaining. |
| **3** | **Identity Evolution** | $\exists E_{\text{id}} \in \mathcal{E} : \Phi(D, E_{\text{id}}) = D$ | Provides neutral identity transformation. |
| **4** | **Governance Monotonicity** | $D \preceq \Phi(D, E)$ | Connects to IV-B semilattice: evolution never degrades governance capacity. |
| **5** | **Progress Measure** | $\mu(\Phi(D, E)) < \mu(D)$ (for $E \neq E_{\text{id}}$ and progress) | Guarantees non-cyclic evolution toward convergence. |

#### 3.2.1 Governance Monotonicity Invariant ($D \preceq \Phi(D, E)$)
Let $\preceq$ be the capability semilattice ordering from Phase IV-B ([governed-enrichment-framework.md](docs/governed-enrichment-framework.md)). Evolution satisfies monotonicity:
$$\forall D \in \mathcal{D}_{\text{sound}}, E \in \mathcal{E} : D \preceq \Phi(D, E)$$
This guarantees a monotonic refinement chain: $D_0 \preceq D_1 \preceq \dots \preceq D_n \equiv_{\text{gov}} D_{\text{top}}$.

#### 3.2.2 Progress Measure & Termination ($\mu(D)$)
Definition 3.2 (Governance Progress Measure):  
A progress functional $\mu : \mathcal{D}_{\text{sound}} \to \mathbb{R}_{\ge 0}$ satisfies:
1. $\mu(D) = 0 \iff D \equiv_{\text{gov}} D_{\text{top}}$.
2. For any strict enrichment $E \in \mathcal{E}_{\text{strict}}(D)$, $\mu(\Phi(D, E)) < \mu(D)$.

This strictly prevents periodic cycles ($D_1 \to D_2 \to D_1$) in $\mathcal{G}_D$.

---

## 4. Convergence Trajectories & Governance Equivalence

### 4.1 Evolution Trajectories ($\pi$)

**Definition 4.1 (Valid Trajectory):**  
A trajectory $\pi$ of length $n \ge 0$ in $\mathcal{G}_D$ is a sequence of sound detectors and valid enrichments:
$$\pi = (D_0, E_1, D_1, E_2, \dots, E_n, D_n)$$
such that for all $i \in \{0, \dots, n-1\}$, $D_{i+1} = \Phi(D_i, E_{i+1})$ and $D_i \preceq D_{i+1}$.

We write $D_0 \rightsquigarrow^{\pi} D_n$ or simply $D_0 \rightsquigarrow D_n$.

### 4.2 Governance Equivalence ($\equiv_{\text{gov}}$)

**Definition 4.2 (Governance Equivalence to $D_{\text{top}}$):**  
Let $D_{\text{top}}$ be the ideal (complete-information) detector. A detector $D_n$ is governance-equivalent to $D_{\text{top}}$, denoted $D_n \equiv_{\text{gov}} D_{\text{top}}$, if and only if its decision gap $\Delta_{\text{gov}}(D_n, D_{\text{top}}) = 0$ and $\mu(D_n) = 0$.

---

## 5. Main Results: Two-Level Detector Evolution Reachability Theorem

### Theorem 5.1 (Two-Level Reachability Theorem)
*Statement:* The reachability of perfect governance $D_{\text{top}}$ from an initial sound detector $D_{\text{alg}}$ operates at two distinct formal levels:

1. **Abstract Structural Reachability ($\text{Reachable}_{\text{abstract}}(D_{\text{alg}}, D_{\text{top}})$):**
   There exists a valid path $\pi = (D_0, E_1, \dots, E_n, D_n)$ in the abstract evolution graph $\mathcal{G}_D$ such that $D_n \equiv_{\text{gov}} D_{\text{top}}$.

2. **Runtime Executable Reachability ($\text{Reachable}_{\text{runtime}}(D_{\text{alg}}, D_{\text{top}}, \mathcal{E}_{\text{known}})$):**
   $\text{Reachable}_{\text{abstract}}(D_{\text{alg}}, D_{\text{top}})$ holds **and** all required enrichment transformations $E_1, \dots, E_n$ belong to the set of physically registered runtime providers $\mathcal{E}_{\text{known}}$:
   $$\{E_1, \dots, E_n\} \subseteq \mathcal{E}_{\text{known}}$$

*Proof Sketch:*
1. Abstract existence proves that the capability semilattice supports a non-empty path to $D_{\text{top}}$.
2. Executable reachability guarantees that TAKT's runtime can construct $\Phi(D_{\text{alg}}, E_n \circ \dots \circ E_1)$ using registered providers without encountering an unresolvable gap. $\blacksquare$

---

## 6. Negative Boundary: Characterization of Unreachability

### Definition 6.1 (Unreachable Detector)
A sound detector $D \in \mathcal{D}_{\text{sound}}$ is **unreachable** with respect to $D_{\text{top}}$ under runtime enrichments $\mathcal{E}_{\text{known}}$, written $\text{Unreachable}(D, D_{\text{top}}, \mathcal{E}_{\text{known}})$, if:
$$\neg \exists \pi_{\text{runtime}} : D \rightsquigarrow^{\pi} D_{\text{top}} \quad \text{using } \mathcal{E}_{\text{known}}$$

### Proposition 6.2 (Causes of Unreachability)
$\text{Unreachable}(D_{\text{alg}}, D_{\text{top}}, \mathcal{E}_{\text{known}})$ occurs if and only if at least one of the following conditions holds:
1. **Empty Enrichment Provider Space:** $\mathcal{E}_{\text{known}}(D_{\text{alg}}) = \emptyset$.
2. **Capability Closure Deficit:** $\text{Closure}_{\mathcal{E}_{\text{known}}}(D_{\text{alg}}) \cap \{ D : D \equiv_{\text{gov}} D_{\text{top}} \} = \emptyset$.
3. **Soundness Barrier:** Every path extending $D_{\text{alg}}$ toward $D_{\text{top}}$ requires a transformation $E$ that violates Axiom 1 ($\exists D_k, \Phi(D_k, E) \notin \mathcal{D}_{\text{sound}}$).

---

## 7. Runtime Architecture & Contract Mapping

### 7.1 Separation of Responsibilities in TypeScript (`cli/src/takt-core/`)

To prevent circular coupling, `Detector` is a pure read-only state struct, while `EvolutionEngine` implements the transition operator $\Phi$:

```typescript
/** Static state representation of a governance detector */
export interface Detector {
  readonly id: string;
  readonly isSound: boolean;
  readonly capabilities: ReadonlySet<string>;
  readonly progressMeasure: number; // \mu(D)
}

/** Pure enrichment transformation specification */
export interface Enrichment {
  readonly id: string;
  readonly targetCapability: string;
  readonly preservesSoundness: boolean;
}

/** External evolution operator executing \Phi(D, E) */
export interface EvolutionEngine {
  /**
   * Applies an enrichment transformation to a detector state.
   * Invariants enforced:
   * 1. Soundness Preservation: returns sound detector if inputs are sound.
   * 2. Governance Monotonicity: result.capabilities \superseteq detector.capabilities.
   * 3. Progress Measure: result.progressMeasure < detector.progressMeasure for progress steps.
   */
  evolve(detector: Detector, enrichment: Enrichment): Detector;
  
  /**
   * Evaluates two-level reachability from D_alg to target given registered providers.
   */
  isExecutableReachable(
    detector: Detector,
    target: Detector,
    registeredProviders: ReadonlyArray<Enrichment>
  ): boolean;
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
