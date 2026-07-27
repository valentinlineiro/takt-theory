# ST-016 Normative Runtime Specification & Architecture Contract

## Status
**Frozen Specification** (v1.0) / ST-016 Conformance Reference Standard

## 1. Purpose & Scope

This normative document defines the formal compliance requirements for any software implementation of a **TAKT Governed Runtime**.

### In-Scope Certification
* Formal mapping between theoretical capability kernels ($K_D$) and operational runtime components.
* Mathematical definition of capability necessity, decision preservation, runtime sufficiency, and irreducibility.
* Specification of the 3-layer empirical witness elevation pipeline (`WitnessArtifact` $\to$ `WitnessConsistentWithRuntime` $\to$ `NecessaryCapability`).
* Minimum compliance criteria for any language implementation (TypeScript reference, Rust, Python, etc.).

### Out-of-Scope Details
* Internal algorithmic data structures or database storage layer (e.g. SQLite, libsql).
* Language-specific serialization format (JSON, Protocol Buffers, FlatBuffers).
* Hardware or platform-specific execution constraints.

---

## 2. Abstract Mathematical Model

A conforming TAKT Runtime is defined as a tuple $M = (\mathcal{C}, \pi_M)$, where:

* $\mathcal{R}$ is the universe of observable state representations $R_t$.
* $\mathcal{D} = \{\text{EXECUTE}, \text{REFINE}, \text{STOP}, \text{INTERVENE}\}$ is the discrete decision domain.
* $\pi^* : \mathcal{R} \to \mathcal{D}$ is the optimal theoretical policy under full information.
* $\mathcal{C}$ is a set of abstract runtime capabilities $\mathcal{C} \subseteq \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$.
* $\pi_M : \mathcal{R} \to \mathcal{D}$ is the operational policy enforced by runtime composition $M$.

---

## 3. Normative Capabilities & Mapping Matrix

Every conforming TAKT Runtime MUST implement the three fundamental capability kernels $K_D = K_{\text{contract}} \cap K_{\text{uncertainty}} \cap K_{\text{temporal}}$.

| Abstract Capability | Responsibility | Reference Implementation (TypeScript) | Formal Module (Lean 4) | Empirical Witness Test (EXP-004) |
| :--- | :--- | :--- | :--- | :--- |
| **ContractSoundness** ($C_{\text{contract}}$) | Verification of domain invariants & contract safety | [`ContractEvaluator.ts`](cli/src/runtime/ContractEvaluator.ts) | [`RuntimeSufficiency.lean`](takt-formal/TaktFormal/RuntimeSufficiency.lean) | [`contract.ablation.test.ts`](cli/src/runtime/__tests__/ablation/contract.ablation.test.ts) |
| **UncertaintyBound** ($C_{\text{uncertainty}}$) | Dynamic margin estimation ($M_D \approx 0$) under ambiguity | [`RobustMarginEstimator.ts`](cli/src/runtime/RobustMarginEstimator.ts) | [`RuntimeSufficiency.lean`](takt-formal/TaktFormal/RuntimeSufficiency.lean) | [`uncertainty.ablation.test.ts`](cli/src/runtime/__tests__/ablation/uncertainty.ablation.test.ts) |
| **TemporalConsistency** ($C_{\text{temporal}}$) | History-dependent trajectory monitoring ($\tau = (R_0, \dots, R_t)$) | [`TrajectoryMonitor.ts`](cli/src/runtime/TrajectoryMonitor.ts) | [`RuntimeSufficiency.lean`](takt-formal/TaktFormal/RuntimeSufficiency.lean) | [`temporal.ablation.test.ts`](cli/src/runtime/__tests__/ablation/temporal.ablation.test.ts) |

---

## 4. End-to-End Validation Pipeline

The TAKT validation cycle bridges empirical runtime execution with machine-certified Lean 4 proofs:

```
+-------------------------------------------------------------+
|                Formal Theory (ST-015 / ST-016)              |
|                 takt-formal/TaktFormal/*.lean               |
+-------------------------------------------------------------+
                              |
                              v  [Normative Contract]
+-------------------------------------------------------------+
|           TypeScript Reference Runtime Execution           |
|                     cli/src/runtime/                        |
+-------------------------------------------------------------+
                              |
                              v  [EXP-004 Ablation]
+-------------------------------------------------------------+
|               Witness Artifact Generation                   |
|          cli/src/runtime/__tests__/ablation/                |
+-------------------------------------------------------------+
                              |
                              v  [Bridge Adapter]
+-------------------------------------------------------------+
|          WitnessConsistentWithRuntime Verification          |
|            takt-formal/TaktFormal/RuntimeWitness.lean       |
+-------------------------------------------------------------+
                              |
                              v  [Elevation Theorem]
+-------------------------------------------------------------+
|              NecessaryCapability Certification               |
|                      (0 errors, 0 sorrys)                   |
+-------------------------------------------------------------+
```

---

## 5. Runtime Invariants

Any conforming runtime MUST satisfy the following core invariants:

1. **Policy Preservation Invariant:**  
   $$\forall R \in \mathcal{R}: \pi_{M_{\text{full}}}(R) = \pi^*(R)$$
2. **Capability Irreducibility Invariant:**  
   $$\forall C_i \in \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}, \exists R_i \in \mathcal{R}: \pi_{M_{\text{full}}}(R_i) \neq \pi_{M_{\text{full}} \setminus \{C_i\}}(R_i)$$
3. **Certifiable Witness Generation Invariant:**  
   Every ablation test MUST produce a valid `WitnessArtifact` structure such that `WitnessConsistentWithRuntime M w` evaluates to `True` in Lean 4.

---

## 6. Conformance Criteria

> **Definition (ST-016 Conforming Runtime):**  
> A software runtime implementation is declared **ST-016 Conforming** if and only if:
> 1. It implements operational equivalents for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.
> 2. It produces empirical ablation witnesses $W_i$ for all three capabilities under its experimental domain.
> 3. Its witness artifacts pass formal verification in Lean 4 via `validWitness_implies_necessity` with 0 `sorry`s.

---

## 7. ST-016 Freeze Declaration

By order of this specification, **ST-016 is declared FROZEN**.  
No further modifications to the kernel capability definitions, 3-layer witness certification logic, or runtime compliance invariants shall be made without issuing a formal revision proposal (e.g. ST-016.1 or ST-017).
