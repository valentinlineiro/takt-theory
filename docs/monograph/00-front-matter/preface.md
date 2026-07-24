# Preface: Adequacy over Completeness

## The Crisis of Omniscient Representation

Classical decision theory, autonomous control, and reinforcement learning frequently operate under an implicit assumption of **omniscient representation**: to make safe, optimal decisions, an agent or control system must construct a high-fidelity, high-dimensional reconstruction of the underlying state space $S$. In robotics, this takes the form of dense 3D occupancy grids; in financial modeling, high-dimensional latent state spaces; in software monitoring, exhaustive metric tracing.

This paradigm suffers from three fundamental breakdowns:
1. **The Curse of Dimensionality:** As state space resolution grows, state estimation and planning complexity scale exponentially or become computationally intractable.
2. **Observation Friction:** Acquiring, transmitting, and processing dense observations incurs latency, bandwidth, and monetary costs.
3. **Over-Specification Vulnerability:** Systems that depend on complete state models fail catastrophically when unmodeled environmental dynamics corrupt irrelevant dimensions of state space.

## The Principle of Decision Adequacy

TAKT replaces the search for *complete knowledge* with the principle of **Decision Adequacy**:

> **Principle of Decision Adequacy:** A representation $R: S \to Z$ of a decision environment is optimal if and only if it preserves exact decision equivalence under a specified contract $D$, regardless of how much state information it discards.

Rather than reconstructing $S$, TAKT projects state space $S$ onto its minimal quotient space $S / K_D$, where $K_D = \bigcap_{c \in C_D} K_c$ is the **Capability Kernel** dictated by the decision contract $D$. If two states $s_1, s_2 \in S$ produce identical evaluation outcomes under all capabilities required by contract $D$, distinguishing them is not only unnecessary—it is actively harmful to runtime efficiency and governance robustness.

```text
  State Space S                           Minimal Quotient Space S / K_D
 ┌────────────────────────┐              ┌────────────────────────┐
 │  s₁  •   s₂  •   s₃   │  Projection   │  [s₁] = {s₁, s₂, s₃}   │  Preserves
 │      (Equivalence)     │ ────────────> │  (Single Equivalence   │  Optimal
 │  s₄  •   s₅            │   R_min      │   Class)               │  Decision D
 └────────────────────────┘              │  [s₄] = {s₄, s₅}       │
                                         └────────────────────────┘
```

## Core Architectural Pillars of TAKT

The TAKT framework is established upon four core mathematical pillars:

1. **Contract-First Governance:** Representation requirements are not intrinsic to the state space; they are derived structurally from decision contracts $D = (S, A, U, C_D)$.
2. **Information Frugality & Kernel Minimality:** The minimal quotient representation $R_{\text{min}} = S / K_D$ bounds representation complexity to at most $2^k$ equivalence classes, where $k = |C_D|$ is the contract kernel dimension.
3. **Dynamic Governed Convergence:** Under partial or lossy observation, runtime convergence is governed by computing dynamic surprisal margins $M_D$ and certified intervention horizons $h^* = \lfloor M_D / c_{\text{max}} \rfloor$.
4. **Unconditional Mechanized Verification:** Every mathematical claim in this treatise is certified down to Lean 4 kernel primitives without reliance on unproven axioms or external solvers.

## Organization of the Monograph

* **Volume I (Foundations)** formalizes decision systems, representation maps, capability invariants, and decision regret.
* **Volume II (Structural Sufficiency)** proves the foundational Structural Sufficiency Theorem (ST-015) and constructs minimal quotient representations.
* **Volume III (Governance & Information Value)** develops rational information acquisition via EVSI and optimal stopping rules $\pi^*$.
* **Volume IV (Governed Convergence & Geometry)** defines dual governance distances $(d_{\rightarrow}, d_{\equiv})$, surprisal margins $M_D$, and intervention horizons $h^*$.
* **Volume V (Extensions & Metatheory)** establishes metatheory, system composition, monoidal category theory ($\mathbf{GovDet}$), fixed-parameter tractability (FPT), and probabilistic Dirac collapse.
