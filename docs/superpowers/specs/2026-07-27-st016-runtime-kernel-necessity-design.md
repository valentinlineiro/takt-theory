# ST-016 Runtime Kernel Necessity Theorem

## Status
Hypothesis / Design Spec / Experimental Validation

## Motivation
With the TAKT runtime implemented and functional, the research program transitions from a **constructive phase** (demonstrating execution capacity) to a **characterization phase** (proving structural necessity and minimal sufficiency).

While **ST-015** answers *what information is structurally sufficient* to preserve optimal governance decisions, **ST-016** addresses *what architectural mechanisms are unavoidable* within an operational runtime to achieve that sufficiency.

---

## Formal Model

### Representation
Let $R \in \mathcal{R}$ be the observable state representation available at time $t$. A trajectory is defined as a sequence of representations $\tau = (R_0, R_1, \dots, R_t)$.

### Decision Function
Let $\mathcal{D} = \{\text{EXECUTE}, \text{REFINE}, \text{STOP}, \text{INTERVENE}\}$ be the discrete set of decision outputs. The optimal theoretical policy is:
$$\pi^* : \mathcal{R} \to \mathcal{D}$$

### Runtime Capabilities & Composition
Rather than coupling the theory to concrete code class names, we abstract the runtime into a set of theoretical capabilities $\mathcal{C}$:
* $C_{\text{contract}}$ (**ContractSoundness**): Verification of domain invariants and safety constraints.
* $C_{\text{uncertainty}}$ (**UncertaintyBound**): Estimation of residual margin $M_D$ under stochastic or model ambiguity.
* $C_{\text{temporal}}$ (**TemporalConsistency**): History-dependent trajectory monitoring across $\tau$.

A runtime composition $M$ is a set of capabilities $M \subseteq \mathcal{C}$. The operational decision policy under composition $M$ is denoted $\pi_M(R)$.

---

## Definitions

### Decision Preservation
A runtime $M'$ preserves the decisions of runtime $M$ if and only if:
$$\text{PreservesDecision}(M, M') \iff \forall R \in \mathcal{R}: \pi_M(R) = \pi_{M'}(R)$$

### Capability Necessity (Local)
A capability $C_i \in M$ is locally necessary for runtime $M$ if there exists at least one representation $R$ where removing $C_i$ alters the decision outcome:
$$\text{NecessaryCapability}(C_i, M) \iff \exists R \in \mathcal{R}: \pi_M(R) \neq \pi_{M \setminus \{C_i\}}(R)$$

### Runtime Sufficiency
A runtime composition $M$ is sufficient if it preserves the optimal theoretical policy $\pi^*$ across all representations:
$$\text{Sufficient}(M) \iff \forall R \in \mathcal{R}: \pi_M(R) = \pi^*(R)$$

### Runtime Irreducibility
A runtime composition $M$ is irreducible if every capability $C_i \in M$ is necessary:
$$\text{Irreducible}(M) \iff \forall C_i \in M, \text{NecessaryCapability}(C_i, M)$$

### Minimal Runtime
A runtime composition $M$ is minimal if and only if it is both sufficient and irreducible:
$$\text{MinimalRuntime}(M) \iff \text{Sufficient}(M) \land \text{Irreducible}(M)$$

---

## Main Conjecture (ST-016)

> **ST-016 (Runtime Kernel Necessity Theorem):**  
> Let $M_{\text{full}} = \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$ be the canonical TAKT runtime composition, mapped to the capability kernels $K_D = K_{\text{contract}} \cap K_{\text{uncertainty}} \cap K_{\text{temporal}}$.  
> Over non-trivial trajectories with partial observability, $M_{\text{full}}$ is a **Minimal Runtime**:
> $$\text{MinimalRuntime}(M_{\text{full}})$$
> That is, removing any single capability $C_i$ destroys policy equivalence with $\pi^*$.

---

## Runtime Mapping

| Theoretical Capability | Capability Kernel | TypeScript Implementation Component (`cli/src/runtime`) |
| :--- | :--- | :--- |
| **ContractSoundness** ($C_{\text{contract}}$) | $K_{\text{contract}}$ | [`ContractEvaluator.ts`](cli/src/runtime/ContractEvaluator.ts) |
| **UncertaintyBound** ($C_{\text{uncertainty}}$) | $K_{\text{uncertainty}}$ | [`RobustMarginEstimator.ts`](cli/src/runtime/RobustMarginEstimator.ts) |
| **TemporalConsistency** ($C_{\text{temporal}}$) | $K_{\text{temporal}}$ | [`TrajectoryMonitor.ts`](cli/src/runtime/TrajectoryMonitor.ts) |

---

## Experimental Validation: EXP-004 Component Ablation

To prove irreducibility, **EXP-004** will search for empirical witness trajectories $R_{\text{witness}}^{(i)}$ for each capability $C_i$:

1. **Temporal Witness ($C_{\text{temporal}}$):**  
   Construct two trajectories $\tau_1 = (r_0, r_1, r_2)$ and $\tau_2 = (r'_0, r'_1, r_2)$ sharing identical terminal state $r_2$, where historical accumulation causes $\pi_M(\tau_1) = \text{INTERVENE}$ while $\pi_{M \setminus \{C_{\text{temporal}}\}}(\tau_1) = \text{MONITOR}$.

2. **Uncertainty Witness ($C_{\text{uncertainty}}$):**  
   Identify a representation $R$ with critical margin $M_D(R) \approx 0$ where $\pi_M(R) = \text{REFINE}$, but omitting $C_{\text{uncertainty}}$ evaluates to $\pi_{M \setminus \{C_{\text{uncertainty}}\}}(R) = \text{EXECUTE}$.

3. **Contract Witness ($C_{\text{contract}}$):**  
   Identify a state $R$ violating domain safety contracts ($\text{Contract}(R) = \text{false}$) while maintaining positive margin and clean trajectory history, proving $\pi_M(R) = \text{STOP}$ whereas $\pi_{M \setminus \{C_{\text{contract}}\}}(R) = \text{EXECUTE}$.

---

## Falsification Criteria

ST-016 is falsified if either of the following conditions is met:

1. **Redundant Kernel Falsification:** There exists a proper sub-composition $M' \subset M_{\text{full}}$ that is provably $\text{Sufficient}(M')$, demonstrating that at least one kernel in $K_D$ is superflous.
2. **Witness Search Failure:** For any capability $C_i \in M_{\text{full}}$, exhaustive search across valid trajectories fails to construct a witness $R$ such that $\pi_M(R) \neq \pi_{M \setminus \{C_i\}}(R)$.

---

## Execution Roadmap

The implementation of ST-016 follows a 4-card sequence:

* **CARD-464:** Lean 4 Formalization of `RuntimeSufficiency.lean` (Definitions of `PreservesDecision`, `NecessaryCapability`, `MinimalRuntime`, and ST-016 statement).
* **CARD-465:** Test Suite **EXP-004 Component Ablation** (`cli/src/runtime/ablation.test.ts`) generating empirical witnesses.
* **CARD-466:** Lean 4 Certification of EXP-004 witness trajectories.
* **CARD-467:** Theory-to-Runtime Mapping Integration & Documentation.

---

## Relation to ST-015

While **ST-015** proves the existence and boundary of representation kernels ($K_D$), **ST-016** establishes the architectural necessity of the runtime components required to operationalize $K_D$. Together, ST-015 and ST-016 bridge abstract governance theory with concrete execution mechanics.
