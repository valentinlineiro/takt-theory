# Mathematical Conventions & Symbol Table

This document establishes the canonical mathematical notation, algebraic structures, typesetting rules, and formal Lean 4 symbol mappings used throughout the TAKT Unified Monograph.

---

## 1. Set Theory, Order Theory & Posets

* **State Space ($S$):** An arbitrary non-empty set representing true system states.
* **Action Space ($A$):** An arbitrary non-empty set of executable actions or decision outputs.
* **Equivalence Relations ($\text{Rel}(S)$):** The set of reflexive, symmetric, and transitive binary relations on $S$.
* **Kernel Order ($\sqsubseteq$):** For representations $R_1: S \to Z_1$ and $R_2: S \to Z_2$, $R_1 \sqsubseteq R_2$ denotes kernel refinement, defined by $\ker(R_2) \subseteq \ker(R_1)$.
* **Equivalence Class Quotient ($S / K$):** Partition of $S$ under equivalence relation $K \subseteq S \times S$.

---

## 2. Core Symbol Table & Lean 4 Mapping

| Symbol | Mathematical Description | Domain / Codomain | Lean 4 Symbol Path |
| :--- | :--- | :--- | :--- |
| $S$ | State Space | Type / Set | `S : Type` |
| $A$ | Action Space | Type / Set | `A : Type` |
| $U$ | Utility / Outcome Function | $S \times A \to \mathbb{R}$ | `utility : S → A → ℝ` |
| $D$ | Decision System / Contract | Tuple $(S, A, U, C_D)$ | `DecisionSystem` |
| $\mathcal{C}$ | Universe of Capabilities | Set of evaluation functions | `Capability` |
| $K_c$ | Equivalence Kernel of Capability $c$ | Rel$(S)$ | `kernel c` |
| $K_D$ | Capability Kernel of Contract $D$ | $\bigcap_{c \in C_D} K_c$ | `capabilityKernel D` |
| $\ker(R)$ | Representation Kernel of $R: S \to Z$ | relation $(s_1, s_2) \iff R(s_1) = R(s_2)$ | `relKernel R` |
| $R_{\text{min}}$ | Minimal Quotient Representation | $S / K_D$ | `Quotient K_D` |
| $\mathcal{R}_{\text{sufficient}}(D)$ | Class of Sufficient Representations | $\{ R \mid \ker(R) \subseteq K_D \}$ | `IsSufficient R D` |
| $G(D, R)$ | Gap Set of Representation $R$ | $\{ c \in C_D \mid \ker(R) \not\subseteq K_c \}$ | `capabilityGap R D` |
| $\mathcal{G}_D$ | Detector Graph | Directed Graph $(V, E)$ | `DetectorGraph` |
| $EVSI(E)$ | Expected Value of Sample Info | $\mathbb{E}[\Delta \text{Value}] - C_{\text{acq}}(E)$ | `evsi E` |
| $\pi^*$ | Rational Stopping Policy | Stop when $\max_E EVSI(E) \le 0$ | `rationalStopping` |
| $d_{\rightarrow}(D_1, D_2)$ | Directed Governance Distance | Asymmetric capability deficit | `distDirected D1 D2` |
| $d_{\equiv}(D_1, D_2)$ | Symmetric Capability Pseudometric | $d_{\rightarrow}(D_1, D_2) + d_{\rightarrow}(D_2, D_1)$ | `distSymmetric D1 D2` |
| $\delta(D)$ | Perfection Distance | Functional distance to ideal detector | `perfectionDistance D` |
| $M_D(\tau_{:t})$ | Dynamic Surprisal Margin | Non-negative scalar uncertainty budget | `surprisalMargin D tau` |
| $h^*$ | Guaranteed Intervention Horizon | $\lfloor M_D / c_{\text{max}} \rfloor$ | `interventionHorizon D` |
| $\mathbf{GovDet}$ | Monoidal Category of Detectors | Ob = Detectors, Mor = Enrichments | `GovDetCategory` |
| $\mathcal{A} \dashv \mathcal{E}$ | Abstraction-Enrichment Adjunction | Left functor $\mathcal{A}$, Right $\mathcal{E}$ | `AbstractionEnrichmentAdjunction` |
| $\mathcal{T}_{\mathbb{P}}$ | Probability Monad | Distribution monad over state space | `ProbabilityMonad` |

---

## 3. Editorial & Formal Conventions

1. **Definitions:** Formally introduced in callout blocks labeled **Definition X.Y** (e.g., **Definition II.3** for Capability Kernels).
2. **Theorems:** Formally stated as **Theorem X.Y**, followed immediately by a Lean 4 badge:
   `[Lean 4: TaktFormal.StructuralSufficiency.theorem_st015]`
3. **Proofs:** Every theorem includes a step-by-step Level 2 text proof, concluded by a Q.E.D. symbol ($\blacksquare$) and hyperlinked Level 3 Lean code block.
