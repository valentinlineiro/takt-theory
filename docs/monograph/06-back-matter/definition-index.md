# Comprehensive Definition Index

> **TAKT Theory Monograph — Back Matter §3**  
> **Scope:** Volumes I–V Definitions  
> **Lean 4 Verification:** 100% Certified (`0 sorrys`)

---

## Master Definition Index Table

| Definition ID | Monograph Volume & Section | Term / Mathematical Concept | Mathematical Notation & Signature | Lean 4 Symbol / Struct | File Location | Line Range |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Def 1.1** | Vol I, §1.2 | Concrete State Space & Abstraction Map | $S, Z \text{ spaces}, R: S \to Z$ | `StateSpace`, `AbstractionMap` | `TaktFormal/Kernel.lean` | L10–25 |
| **Def 1.2** | Vol I, §1.2 | Decision Policy | $\pi: Z \to A$ | `DecisionPolicy` | `TaktFormal/Kernel.lean` | L28–42 |
| **Def 1.3** | Vol I, §1.2 | Fiber Equivalence & Function Kernel | $\text{ker}(R) = \{(x, y) \in S \times S \mid R(x) = R(y)\}$ | `KernelEquivalence` | `TaktFormal/Kernel/Basic.lean` | L15–35 |
| **Def 1.4** | Vol I, §1.2 | Representation Kernel Preorder | $R_1 \preceq R_2 \iff \text{ker}(R_1) \subseteq \text{ker}(R_2)$ | `KernelPreorder` | `TaktFormal/Representation/Preorder.lean` | L12–30 |
| **Def 1.5** | Vol I, §2.2 | Decision System | Tuple $(S, A, U, D)$ | `DecisionSystem` | `TaktFormal/DecisionSystem.lean` | L18–45 |
| **Def 1.6** | Vol I, §2.2 | Utility-Induced Decision Function | $D_U(s) = \arg\max_{a \in A} U(s, a)$ | `UtilityDecision` | `TaktFormal/DecisionSystem.lean` | L50–75 |
| **Def 1.7** | Vol I, §3.2 | Representation Refinement | $R_2 \text{ refines } R_1 \iff \text{ker}(R_2) \subseteq \text{ker}(R_1)$ | `Refines` | `TaktFormal/Representation/Refinement.lean` | L14–38 |
| **Def 1.8** | Vol I, §4.2 | Capability Provision & Provided Caps | $\text{Prov}(R) \subseteq \mathcal{C}$ | `CapabilityProvision` | `TaktFormal/Basic.lean` | L15–32 |
| **Def 1.9** | Vol I, §4.2 | Capability Kernel $K_D$ | $K_D = \{(x, y) \in S \times S \mid D(x) = D(y)\}$ | `CapabilityKernel` | `TaktFormal/StructuralSufficiency.lean` | L30–55 |
| **Def 1.10** | Vol I, §4.2 | Axiom 0: Contract Coherence | $\forall x, y, K_D(x, y) \implies D(x) = D(y)$ | `AxiomZeroCoherence` | `TaktFormal/StructuralSufficiency.lean` | L60–80 |
| **Def 1.11** | Vol I, §4.2 | Capability Gap $G(D, R)$ | $G(D, R) = C_D \setminus \text{Prov}(R)$ | `CapabilityGap` | `TaktFormal/Basic.lean` | L85–105 |
| **Def 1.12** | Vol I, §5.2 | Decision Regret | $\text{Regret}(R) = U(s, D(s)) - U(s, (\pi \circ R)(s))$ | `decisionRegret` | `TaktFormal/ApproximateGovernance.lean` | L33–48 |
| **Def 1.13** | Vol I, §5.2 | Regret Bound $\epsilon(R)$ | $\sup_{s \in S} \text{Regret}(R)(s) \le \epsilon$ | `GovEpsilon` | `TaktFormal/ApproximateGovernance.lean` | L10–25 |
| **Def 2.1** | Vol II, §2.2 | Sufficient Representation Space | $\mathcal{R}_{\text{sufficient}}(D) = \{R \mid \text{ker}(R) \subseteq K_D\}$ | `SufficientRepresentationSpace` | `TaktFormal/StructuralSufficiency.lean` | L70–95 |
| **Def 2.2** | Vol II, §3.2 | Minimal Quotient Representation | $R_{\text{min}} = S / K_D = \text{Quot.mk}(K_D, s)$ | `R_min` | `TaktFormal/StructuralSufficiency.lean` | L160–190 |
| **Def 2.3** | Vol II, §4.2 | Boolean Capability Feature Map | $\phi(s) = (c_1(s), c_2(s), \dots, c_k(s)) \in \{0, 1\}^k$ | `BooleanFeatureMap` | `TaktFormal/Complexity/Complexity.lean` | L15–38 |
| **Def 2.4** | Vol II, §5.2 | Enrichment Operator $\oplus$ | $R \oplus e = R \cup \text{Prov}(e)$ | `EnrichmentOp` | `TaktFormal/EnrichmentAlgebra.lean` | L20–45 |
| **Def 3.1** | Vol III, §1.2 | Detector State Structure | Tuple $(C, \text{progressMeasure}, \text{isSound})$ | `Detector` | `TaktFormal/Kernel.lean` | L15–38 |
| **Def 3.2** | Vol III, §1.2 | Sound Detector & Valid Enrichment | $\text{Sound}(d) \iff \text{progressMeasure}(d) = 0$ | `ValidEnrichment` | `TaktFormal/DetectorEvolution.lean` | L20–42 |
| **Def 3.3** | Vol III, §1.2 | Evolution Transition Operator $\Phi$ | $\Phi: \text{Detector} \times \text{Enrichment} \to \text{Detector}$ | `EvolutionOp` | `TaktFormal/DetectorEvolution.lean` | L50–75 |
| **Def 3.4** | Vol III, §2.2 | Detector Graph $\mathcal{G}_D$ | Graph $V = \text{Detectors}, E = \text{Enrichments}$ | `DetectorGraph` | `TaktFormal/DetectorEvolution.lean` | L95–120 |
| **Def 3.5** | Vol III, §3.2 | Expected Value of Sample Information | $\text{EVSI}(e) = \mathbb{E}[\Delta \text{Regret}] - \text{Cost}(e)$ | `EVSI` | `TaktFormal/CostOptimization.lean` | L20–48 |
| **Def 3.6** | Vol III, §3.2 | Net Value of Enrichment | $\text{NV}(e) = \text{EVSI}(e) - \text{Cost}(e)$ | `NetValue` | `TaktFormal/CostOptimization.lean` | L55–78 |
| **Def 3.7** | Vol III, §4.2 | Rational EVSI Stopping Policy $\pi^*$ | Policy $\pi^*(d) = \arg\max_{e} \text{NV}(e)$ | `RationalEVSIStopping` | `TaktFormal/CostOptimization.lean` | L120–145 |
| **Def 4.1** | Vol IV, §1.2 | Directed Quasimetric $d_{\rightarrow}$ | Path cost distance on $\mathcal{G}_D$ | `QuasimetricDistance` | `TaktFormal/GovernanceGeometry.lean` | L15–40 |
| **Def 4.2** | Vol IV, §1.2 | Symmetric Governance Distance $d_{\equiv}$ | $d_{\equiv}(D_1, D_2) = \max(d_{\rightarrow}(D_1, D_2), d_{\rightarrow}(D_2, D_1))$ | `SymmetricGovernanceDistance` | `TaktFormal/GovernanceGeometry.lean` | L50–72 |
| **Def 4.3** | Vol IV, §2.2 | Perfection Distance $\delta(D)$ | $\delta(D) = d_{\rightarrow}(D, D^*)$ | `PerfectionDistance` | `TaktFormal/GovernanceGeometry.lean` | L115–138 |
| **Def 4.4** | Vol IV, §3.2 | Dynamic Surprisal Margin $M_D$ | $M_D = \text{SafetyThreshold} - \text{CurrentRisk}$ | `SurprisalMargin` | `TaktFormal/DecisionMargin.lean` | L20–45 |
| **Def 4.5** | Vol IV, §3.2 | Guaranteed Intervention Horizon $h^*$ | $h^* = \lfloor M_D / c_{\text{max}} \rfloor$ | `GuaranteedHorizon` | `TaktFormal/GovernanceGeometry.lean` | L170–192 |
| **Def 4.6** | Vol IV, §4.2 | Asymmetric Calibrated Margin $M_D^{\text{calib}}$ | $M_D - \text{Distortion}(R)$ | `CalibratedMargin` | `TaktFormal/DecisionMargin.lean` | L48–70 |
| **Def 5.1** | Vol V, §2.2 | Parallel Detector $D_1 \otimes D_2$ | Product detector over $C_1 \times C_2$ | `ParallelDetector` | `TaktFormal/Composition/Basic.lean` | L18–35 |
| **Def 5.2** | Vol V, §2.2 | Cascade Detector $D_2 \circ D_1$ | Sequential composite detector | `CascadeDetector` | `TaktFormal/Composition/Basic.lean` | L25–45 |
| **Def 5.3** | Vol V, §3.2 | Category $\mathbf{GovDet}$ | Category of governed detectors & enrichments | `GovDetObj`, `GovDetHom` | `TaktFormal/Categorical/Basic.lean` | L18–32 |
| **Def 5.4** | Vol V, §3.2 | Abstraction Functor $\mathcal{A}$ | Functor $\mathbf{GovDet} \to \mathbf{Rep}$ | `AbstractionFunctor` | `TaktFormal/Categorical/Adjunction.lean` | L18–30 |
| **Def 5.5** | Vol V, §3.2 | Enrichment Functor $\mathcal{E}$ | Functor $\mathbf{Rep} \to \mathbf{GovDet}$ | `EnrichmentFunctor` | `TaktFormal/Categorical/Adjunction.lean` | L21–34 |
| **Def 5.6** | Vol V, §4.2 | Decision Reachability Problem | Decision problem `DetReachProblem` | `DetReachProblem` | `TaktFormal/Complexity/Problems.lean` | L18–32 |
| **Def 5.7** | Vol V, §4.2 | Optimal EVSI Path Problem | Optimization problem `OptEvsiPathProblem` | `OptEvsiPathProblem` | `TaktFormal/Complexity/Problems.lean` | L22–35 |
| **Def 5.8** | Vol V, §4.2 | Minimal Enrichment Problem | Decision problem `MinEnrichProblem` | `MinEnrichProblem` | `TaktFormal/Complexity/Problems.lean` | L26–40 |
| **Def 5.9** | Vol V, §5.2 | Soft Detector State | Detector with continuous probability measure | `SoftDetector` | `TaktFormal/Probabilistic/SoftDetector.lean` | L10–28 |
| **Def 5.10** | Vol V, §5.2 | Probability Monad $\mathcal{T}_{\mathbb{P}}$ | Giry/Giry-like probability monad | `ProbabilityMonad` | `TaktFormal/Probabilistic/Monad.lean` | L12–32 |
