# ST-017 Research Line: Witness Transportability Research Questions

**Status:** Open Research Questions / Pre-Formalization  
**Prerequisite Baseline:** ST-016 v1.0.0 Frozen Baseline (`st016-v1.0.0`)  
**Design Spec:** [`docs/superpowers/specs/2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md)  

---

## 1. Primary Research Questions

1. **Kernel Equivalence Axiomatization ($\mathcal{M}_1 \sim \mathcal{M}_2$):**  
   What minimal formal axioms must hold between two distinct execution runtimes $\mathcal{M}_1$ (e.g. TypeScript) and $\mathcal{M}_2$ (e.g. Rust, Python) to declare them decision-equivalent?

   $$\mathcal{M}_1 \sim \mathcal{M}_2 \iff \forall R \in \mathcal{R}, \quad \pi_{\mathcal{M}_1}(R) = \pi_{\mathcal{M}_2}(R) = \pi^*(R)$$

2. **Witness Transportability Soundness:**  
   Given an ablation witness artifact $W_{\mathcal{M}_1}$ produced by $\mathcal{M}_1$, under what translation function $T : \mathcal{W}_1 \to \mathcal{W}_2$ does Lean 4 certify $W_{\mathcal{M}_2}$ without re-executing empirical ablation in $\mathcal{M}_2$?

   $$\text{WitnessConsistentWithRuntime}(\mathcal{M}_1, W_1) \implies \text{WitnessConsistentWithRuntime}(\mathcal{M}_2, T(W_1))$$

3. **Capability Homomorphism:**  
   How do capability kernels $K_D = \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$ map across language boundaries with different memory models, concurrency guarantees, and numerical precision?

4. **Minimum Certified Metadata:**  
   What minimal metadata payload must accompany a transported witness artifact to guarantee non-repudiation and Lean 4 elevation certification across heterogeneous platforms?

---

## 2. Research Roadmap & Milestone Gate

- **Phase III.1:** Axiomatization in Lean 4 (`TaktFormal.RuntimeTransportability`).
- **Phase III.2:** Conformance test harnesses for Rust (`takt-rust`) and Python (`takt-python`).
- **Phase III.3:** Empirical cross-runtime witness transportability validation.
