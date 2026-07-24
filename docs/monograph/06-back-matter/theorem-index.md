# Comprehensive Theorem Index

> **TAKT Theory Monograph — Back Matter §2**  
> **Scope:** Volumes I–V (Theorems 1.1 through 5.35 & Core Formalizations)  
> **Lean 4 Verification:** 100% Certified (`0 sorrys`)

---

## Master Theorem Index Table

| Theorem ID | Monograph Volume & Section | Mathematical Name & Summary | Lean 4 Symbol Name | File Location | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Theorem I.1** | Vol I, §3.2 | **Kernel Factorization Theorem:** $R_1 \preceq R_2 \iff \exists h, R_1 = h \circ R_2$ | `TaktFormal.factorization` | `TaktFormal/Factorization.lean` | L15–35 | Verified |
| **Theorem I.2** | Vol I, §5.2 | **Safe Representation Zero Regret:** $\text{ker}(R) \subseteq K_D \implies \text{Regret}(R) = 0$ | `safe_implies_epsilon_zero` | `TaktFormal/Regret.lean` | L22–45 | Verified |
| **Theorem I.3** | Vol I, §4.2 | **Capability Sufficiency & Gap Monotonicity:** $G(D, R) = 0 \iff \text{ker}(R) \subseteq K_D$ | `TaktFormal.CapabilitySufficiency` | `TaktFormal/Basic.lean` | L40–72 | Verified |
| **Theorem I.4** | Vol I, §5.3 | **Information Sufficiency Galois Connection:** $\mathcal{A}(R_1 \sqcup R_2) = \mathcal{A}(R_1) \sqcap \mathcal{A}(R_2)$ | `Information.minimal_sufficiency_adjunction` | `TaktFormal/Information/Algebra.lean` | L110–145 | Verified |
| **Theorem I.5** | Vol I, §5.2 | **Regret-Utility Non-Reciprocity:** $\exists R, \epsilon_U(R) > 0 \land \text{Regret}(R) = 0$ | `EpsilonUCounterexample.epsilon_D_false` | `TaktFormal/EpsilonUCounterexample.lean` | L50–88 | Verified |
| **Theorem II.1** | Vol II, §2.2 | **Structural Sufficiency Theorem (ST-015):** $\text{ker}(R) \subseteq K_D \iff R \in \mathcal{R}_{\text{sufficient}}$ | `TaktFormal.StructuralSufficiency.T1_characterization` | `TaktFormal/StructuralSufficiency.lean` | L85–120 | Verified |
| **Theorem II.2** | Vol II, §2.2 | **Upset Sufficiency Theorem:** $R \in \mathcal{R}_{\text{sufficient}} \land R \preceq R' \implies R' \in \mathcal{R}_{\text{sufficient}}$ | `TaktFormal.StructuralSufficiency.T2_upset` | `TaktFormal/StructuralSufficiency.lean` | L125–150 | Verified |
| **Theorem II.3** | Vol II, §3.2 | **Kernel Equality of $R_{\text{min}}$:** $\text{ker}(R_{\text{min}}) = K_D$ | `kernel_R_min_eq_K_D` | `TaktFormal/StructuralSufficiency.lean` | L180–210 | Verified |
| **Theorem II.4** | Vol II, §3.2 | **Sufficiency of $R_{\text{min}}$:** $R_{\text{min}} \in \mathcal{R}_{\text{sufficient}}(D)$ | `R_min_is_sufficient` | `TaktFormal/StructuralSufficiency.lean` | L215–240 | Verified |
| **Theorem II.5** | Vol II, §3.2 | **Universal Minimality of $R_{\text{min}}$:** $\forall R \in \mathcal{R}_{\text{sufficient}}, R_{\text{min}} \preceq R$ | `R_min_is_minimum` | `TaktFormal/StructuralSufficiency.lean` | L245–275 | Verified |
| **Theorem II.6** | Vol II, §3.2 | **Sufficiency Fixed Point Theorem:** $R_{\text{min}}(R_{\text{min}}) = R_{\text{min}}$ | `R_min_fixed_point` | `TaktFormal/StructuralSufficiency.lean` | L280–305 | Verified |
| **Theorem II.7** | Vol II, §4.2 | **Injective Hypercube Embedding:** $S / K_D \hookrightarrow \{0, 1\}^k$ | `boolean_hypercube_embedding` | `TaktFormal/Complexity/Complexity.lean` | L40–75 | Verified |
| **Theorem II.8** | Vol II, §4.2 | **Finite Quotient Bound Theorem:** $|S / K_D| \le 2^k$ where $k = |C_D|$ | `finite_quotient_bound` | `TaktFormal/Complexity/Complexity.lean` | L80–115 | Verified |
| **Theorem II.9** | Vol II, §5.2 | **Capability Gap Monotonicity Theorem:** $R_1 \preceq R_2 \implies G(D, R_2) \subseteq G(D, R_1)$ | `T4_monotonicity` | `TaktFormal/StructuralSufficiency.lean` | L320–350 | Verified |
| **Theorem II.10** | Vol II, §5.2 | **Finite Enrichment Termination:** Any chain of valid enrichments terminates in $\le k$ steps | `Enrichment.finite_termination` | `TaktFormal/EnrichmentAlgebra.lean` | L60–95 | Verified |
| **Theorem III.1** | Vol III, §1.2 | **Soundness Preservation Theorem:** $\text{Sound}(D) \land \text{Valid}(e) \implies \text{Sound}(\Phi(D, e))$ | `soundness_preservation` | `TaktFormal/DetectorEvolution.lean` | L45–80 | Verified |
| **Theorem III.2** | Vol III, §2.2 | **Detector Graph Reachability Theorem:** $\exists \text{ path } p: D_0 \rightsquigarrow D_* \iff G(D_0) \subseteq \bigcup_{e \in p} \text{Prov}(e)$ | `graph_reachability_theorem` | `TaktFormal/DetectorEvolution.lean` | L110–145 | Verified |
| **Theorem III.3** | Vol III, §3.2 | **EVSI Monotonicity Theorem:** $e_1 \le e_2 \implies \text{EVSI}(e_1) \le \text{EVSI}(e_2)$ | `evsi_monotonicity` | `TaktFormal/CostOptimization.lean` | L50–82 | Verified |
| **Theorem III.4** | Vol III, §3.2 | **EVSI Subadditivity Theorem:** $\text{EVSI}(e_1 \oplus e_2) \le \text{EVSI}(e_1) + \text{EVSI}(e_2)$ | `evsi_subadditivity` | `TaktFormal/CostOptimization.lean` | L90–125 | Verified |
| **Theorem III.5** | Vol III, §4.2 | **Rational EVSI Stopping Theorem ($\pi^*$):** Stop enriching $\iff \max_e \text{NV}(e) \le 0$ | `rational_evsi_stopping` | `TaktFormal/CostOptimization.lean` | L135–170 | Verified |
| **Theorem IV.1** | Vol IV, §1.2 | **Graph Metric Axioms Theorem:** $d_{\rightarrow}$ forms a directed quasimetric on $\mathcal{G}_D$ | `quasimetric_axioms` | `TaktFormal/GovernanceGeometry.lean` | L35–68 | Verified |
| **Theorem IV.2** | Vol IV, §1.2 | **Symmetric Distance Metric Theorem:** $d_{\equiv}(D_1, D_2) = \max(d_{\rightarrow}(D_1, D_2), d_{\rightarrow}(D_2, D_1))$ is a metric | `symmetric_metric_axioms` | `TaktFormal/GovernanceGeometry.lean` | L75–110 | Verified |
| **Theorem IV.3** | Vol IV, §2.2 | **Dynamic Perfection Distance Monotonicity:** $D_1 \to D_2 \implies \delta(D_2) \le \delta(D_1)$ | `perfection_distance_monotonicity` | `TaktFormal/GovernanceGeometry.lean` | L130–160 | Verified |
| **Theorem IV.4** | Vol IV, §3.2 | **Guaranteed Intervention Horizon Theorem:** $h^* = \lfloor M_D / c_{\text{max}} \rfloor$ guarantees safety | `guaranteed_horizon` | `TaktFormal/GovernanceGeometry.lean` | L180–215 | Verified |
| **Theorem IV.5** | Vol IV, §4.2 | **Asymmetric Calibration Theorem:** $M_D^{\text{calib}} \ge M_D - \text{Distortion}(R)$ | `asymmetric_calibration_bound` | `TaktFormal/DecisionMargin.lean` | L60–95 | Verified |
| **Theorem V.1** | Vol V, §1.2 | **Conservativity Theorem:** Extensional additions to $\mathcal{G}_D$ do not invalidate past proofs | `conservativity_theorem` | `TaktFormal/Metatheory/Conservativity.lean` | L30–65 | Verified |
| **Theorem V.2** | Vol V, §1.2 | **Axiomatic Independence Theorem:** Axioms $A_1, A_2, A_3$ are mutually independent | `axiomatic_independence` | `TaktFormal/Metatheory/Independence.lean` | L40–110 | Verified |
| **Theorem V.3** | Vol V, §2.2 | **Parallel Soundness Preservation:** $\text{Sound}(D_1) \land \text{Sound}(D_2) \implies \text{Sound}(D_1 \otimes D_2)$ | `soundness_parallel_preservation` | `TaktFormal/Composition/Preservation.lean` | L17–42 | Verified |
| **Theorem V.4** | Vol V, §2.2 | **Cascade Lipschitz Horizon Bound:** $\text{Horizon}(D_2 \circ D_1) \ge \min(h_1, h_2 / L_2)$ | `cascade_lipschitz_bound` | `TaktFormal/Composition/Limits.lean` | L21–48 | Verified |
| **Theorem V.5** | Vol V, §3.2 | **Monoidal Associativity of $\mathbf{GovDet}$:** $(D_1 \otimes D_2) \otimes D_3 \cong D_1 \otimes (D_2 \otimes D_3)$ | `monoidal_assoc` | `TaktFormal/Categorical/Monoidal.lean` | L22–50 | Verified |
| **Theorem V.6** | Vol V, §3.2 | **Galois Adjunction Hom-Isomorphism:** $\mathbf{GovDet}(\mathcal{E}(R), D) \cong \mathbf{Rep}(R, \mathcal{A}(D))$ | `adjunction_hom_iso` | `TaktFormal/Categorical/Adjunction.lean` | L25–55 | Verified |
| **Theorem V.7** | Vol V, §4.2 | **Fixed-Parameter Tractability (FPT) Theorem:** `MIN-ENRICH` solvable in $\mathcal{O}(2^k \cdot |\mathcal{E}|)$ | `kernel_dimension_fpt_bound` | `TaktFormal/Complexity/Parameterized.lean` | L12–40 | Verified |
| **Theorem V.8** | Vol V, §4.2 | **Online Verification Constant Amortized Time:** Amortized per-step check cost $\mathcal{O}(1)$ | `online_verification_amortized_constant` | `TaktFormal/Complexity/Runtime.lean` | L13–45 | Verified |
| **Theorem V.9** | Vol V, §5.2 | **Probabilistic Soft Detector Conservativity:** Hard detector limit recovers deterministic $K_D$ | `probabilistic_conservativity` | `TaktFormal/Probabilistic/Conservativity.lean` | L15–42 | Verified |
| **Theorem V.10** | Vol V, §5.2 | **Stochastic Rational EVSI Convergence:** Soft EVSI converges to deterministic policy $\pi^*$ | `stochastic_evsi_convergence` | `TaktFormal/Probabilistic/StochasticEVSI.lean` | L18–50 | Verified |
