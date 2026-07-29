# TAKT v1.0 — Claims, Non-Claims, and Falsification Criteria

> **Document Status:** Official Scientific Declaration (v1.0 Frozen Core)  
> **Purpose:** Explicitly declare the scope of claims, non-claims, and falsification conditions for TAKT v1.0.

---

## 1. What TAKT Claims (WE CLAIM)

1. **Structural Sufficiency (Theorem ST-015 / Lean Certified):**
   A state representation $R: S \to Z$ preserves the decision contract $D: S \to A$ if and only if its kernel refines the task capability kernel: $\text{ker}(R) \subseteq K_D$.

2. **Existence of Unique Minimal Representation ($R_{\text{min}}$):**
   The quotient space $S / K_D$ constitutes the unique minimal representation preserving $D$ without loss of decision quality.

3. **Runtime Governance Horizon (Theorem G2-H1):**
   Under bounded environment non-stationarity ($\theta < \theta_{\text{crit}}$) and non-negative robust decision margin ($M_D(\tau_{:t}) \ge 0$), the safety contract is guaranteed to hold for at least $H$ decision steps.

4. **Information Friction Monotonicity:**
   Any finer representation $R_1 \subseteq R_2$ incurs a transformation friction $C_{\text{trans}}(R_1) \ge C_{\text{trans}}(R_2)$.

---

## 2. What TAKT Does NOT Claim (WE DO NOT CLAIM)

1. **Universal Blackwell Dominance:** TAKT does *not* claim to preserve informativeness across all possible utility functions or arbitrary decision tasks simultaneously. Sufficiency is strictly task-specific to contract $D$.

2. **Omniscient Adversarial Detection:** TAKT does *not* claim that runtime observation $F_\Gamma$ can detect hostile policies $\pi_{\text{adv}}$ prior to observable evidence when $F_\Gamma$ is non-injective ($M_D = \infty$ during delay).

3. **Unbounded Non-Stationary Immunity:** TAKT does *not* claim safety preservation under unobserved environment drift ($\theta \ge \theta_{\text{crit}}$) without dynamic contract recalibration.

4. **Stochastic Process Optimality:** TAKT v1.0 does *not* claim optimal filtering or control for continuous stochastic Markov decision processes without discrete capability kernel projections.

---

## 3. What Would Falsify TAKT v1.0 (FALSIFICATION CONDITIONS)

The TAKT framework v1.0 would be considered **refuted or fundamentally flawed** if any of the following empirical or mathematical observations are demonstrated:

1. **Decision Error under Kernel Refinement:** Demonstration of a state space $S$, decision contract $D$, and representation $R$ satisfying $\text{ker}(R) \subseteq K_D$ where $D(s_1) \neq D(s_2)$ for $R(s_1) = R(s_2)$ (Direct contradiction of ST-015).
2. **Sub-optimal Minimal Quotient:** Discovery of a representation $R'$ strictly coarser than $S / K_D$ ($\text{ker}(S/K_D) \subsetneq \text{ker}(R')$) that preserves decision accuracy for all $s \in S$.
3. **Margin Contract Breach:** Observation of a contract violation ($D(s) \neq \hat{D}(s)$) during a period where $M_D(\tau_{:t}) > 0$ and measured drift rate $\theta < \theta_{\text{crit}}$ (Contradiction of G2 Governance Horizon).
4. **Computational Negative Value:** Empirical proof across diverse benchmarks that the computational overhead of computing $K_D$ and evaluating $M_D$ strictly exceeds full-state search or naive sampling across all parameter regimes.

---

## 4. Evidence Traceability & Verification Protocol (PROTOCOL C)

All official scientific claims of TAKT are bound to empirical evidence artifacts formatted according to the **`ExperimentArtifact` (schema v1)** specification and validated via reproducible benchmarks.

| Claim / Theorem | Formal Basis (Lean 4) | Benchmark Target | Empirical Evidence (Schema v1) | Claim Status | Open Questions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ST-015 Structural Sufficiency** | `TaktFormal.StructuralSufficiency` | `benchmarks/batch-f-001..005` | `ExperimentArtifact` (v1) | **Supported** | Generalization to continuous MDPs |
| **ST-016 Runtime Kernel Necessity** | `TaktFormal.RuntimeSufficiency`<br>`TaktFormal.RuntimeWitness` | `benchmarks/benchmark-001`<br>`benchmarks/benchmark-002` | [`BENCHMARK-001/artifact-policy-a.json`](file:///home/valentin/code/takt-theory/benchmarks/benchmark-001/artifact-policy-a.json)<br>[`BENCHMARK-002/artifact-dim-1000.json`](file:///home/valentin/code/takt-theory/benchmarks/benchmark-002/artifact-dim-1000.json) | **Empirically Exercised** (v1.0.0 + $|S|$ Invariance) | Multi-node consensus under delay (ST-018) |
| **ST-017 Witness Transportability** | `TaktFormal.RuntimeTransportability` | `cli/src/st017-transportability` | `mockRuntime.ts` Witness | **Supported Core** (Phase III.1) | Q1–Q6 (Granularity, certificate structure, cross-lang) |
| **G2 Governance Horizon** | `TaktFormal.DynamicSafetyContract` | `benchmarks/batch-g2-001..004` | `ExperimentArtifact` (v1) | **Supported** | Recalibration frequency limits (BENCHMARK-003) |

