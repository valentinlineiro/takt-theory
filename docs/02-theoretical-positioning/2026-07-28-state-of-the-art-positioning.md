# TAKT ST-016 State-of-the-Art Positioning & Comparative Analysis

**Standard Baseline:** ST-016 v1.0.0 (`st016-v1.0.0` / `fca31f0`)  
**DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Target Milestone:** `MILESTONE-PAPER-READY`  

---

## Executive Overview

This positioning audit formally delineates **TAKT (Theory of Adequate Knowledge for Decisions)** and **ST-016 (Runtime Kernel Necessity)** against established computer science and control theory paradigms. 

Rather than proposing a general-purpose model checker or programming language, TAKT establishes an axiomatic framework for **decision-preserving representation contraction** under runtime governance.

---

## 1. Comparative Matrix

| Domain / Paradigm | Primary Objective | Shared Concepts | Distinct TAKT Contribution (ST-016) | Out-of-Scope for TAKT |
| :--- | :--- | :--- | :--- | :--- |
| **Abstract Interpretation** (Cousot & Cousot) | Over-approximation of program semantics for static analysis | Galois connections, abstraction functions $\alpha(S)$, concretization $\gamma(R)$ | TAKT focuses on **decision equivalence ($\pi^*(R) = \pi^*(S)$)** rather than total semantic property over-approximation | Program static analysis, sound compiler transformations |
| **Bisimulation & Refinement** (Milner, Park) | Behavioral equivalence between state transition systems | Simulation relations, trace equivalence, observational equivalence | TAKT introduces **capability kernel necessity ($\mathcal{K}_D$)** under state contraction rather than strict step-by-step state bisimulation | Full transition system trace equivalence |
| **Runtime Verification** (Leucker & Schallhart) | Monitoring executions against formal specifications (LTL/TL) | Trajectory monitoring, execution traces, trace contracts | TAKT bridges empirical trace witness artifacts directly to machine-certified **capability necessity proofs in Lean 4** | General LTL formula checking on arbitrary execution logs |
| **Blackwell Sufficiency** (Blackwell 1951) | Statistical decision theory & experiment comparison | Observational state sufficiency, loss function minimization | TAKT operationalizes sufficiency into an **irreducible 3-capability runtime kernel ($C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}$)** | Continuous Bayesian estimation across arbitrary loss topologies |
| **POMDP / Decision Theory** (Kaelbling et al.) | Optimal control under partial observability | Belief states, policy functions $\pi(b)$, value functions | TAKT provides **formal necessity and elevation certification** for runtime governance components rather than belief update algorithms | Real-time belief state update algorithms & solver performance |

---

## 2. Detailed Paradigm Analysis

### 2.1 Abstract Interpretation vs. TAKT
- **Shared Ground:** Both frameworks map high-dimensional concrete state spaces $\mathcal{S}$ to abstract state representations $\mathcal{R}$ via abstraction operations $R = \rho(S)$.
- **Key Divergence:** Abstract interpretation guarantees sound over-approximation of all execution behaviors ($\llbracket P \rrbracket \subseteq \gamma(\hat{P})$). TAKT enforces strict **policy preservation** ($\pi^*(R) = \pi^*(S)$). TAKT allows under-approximation of non-decision-critical attributes as long as discrete action selection is invariant.

### 2.2 Bisimulation & Refinement vs. TAKT
- **Shared Ground:** Both examine observational equivalence across transition systems.
- **Key Divergence:** Bisimulation requires state-by-state transition matching ($\forall s_1 \to s_2 \implies r_1 \to r_2$). TAKT allows internal trajectory state contractions as long as the temporal prefix monitoring capability ($C_{\text{temporal}}$) maintains policy equivalence $\pi^*(\tau_1) = \pi^*(\tau_2)$.

### 2.3 Runtime Verification vs. TAKT
- **Shared Ground:** Both monitor execution traces dynamically at runtime.
- **Key Divergence:** Standard runtime verification evaluates traces against pre-compiled temporal logic formulas (e.g. LTL). TAKT ST-016 formalizes the **necessity of the runtime governance kernel itself**, demonstrating via ablation (EXP-004) that removing any component ($C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}$) causes decision divergence, backed by Lean 4 elevation proofs (`validWitness_implies_necessity`).

---

## 3. Explicit Boundaries & Non-Claims

To ensure scientific rigor and peer-review clarity, TAKT ST-016 explicitly DOES NOT claim:
1. **Universal Necessity Across All Software:** Kernel necessity is proven **specifically under the defined decision-preserving runtime model** and discrete decision domain $\mathcal{D}$.
2. **Replacement for Static Analysis:** TAKT governs runtime execution decisions under state contraction; it does not replace static type systems or static model checkers.
3. **Solver Algorithms:** TAKT formalizes capability necessity, not specific margin estimation algorithms or solver implementations.
