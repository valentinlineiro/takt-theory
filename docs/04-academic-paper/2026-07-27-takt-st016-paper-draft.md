# TAKT: A Formal Framework for Minimal Decision-Preserving Runtime Governance

**Authors:** Valentin Lineiro et al.  
**Target Milestone:** ST-016 v1.0.0 Frozen Baseline  
**Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Baseline Snapshot:** [`ST-016_FINAL_STATE.md`](../../ST-016_FINAL_STATE.md)  

---

## Abstract

Software systems operating under abstracted or compressed state representations frequently risk decision instability when critical informational context is discarded. This paper introduces TAKT (Theory of Adequate Knowledge for Decisions), a formal and empirical framework for determining the minimal necessary governance kernel of an execution runtime.

We prove in Lean 4 that any governed runtime preserving optimal decisions under state abstraction MUST possess three fundamental capability kernels: ContractSoundness ($C_{\text{contract}}$), UncertaintyBound ($C_{\text{uncertainty}}$), and TemporalConsistency ($C_{\text{temporal}}$). We validate this kernel necessity on a reference TypeScript runtime via component ablation (EXP-004), elevated to formal Lean 4 theorems via a machine-certified 3-layer witness bridge. Finally, we present an audited zero-contact replication package evaluated across six independent external audit rounds (`PASS WITH ENVIRONMENTAL LIMITATION`), backed by an immutable Zenodo archive (DOI: 10.5281/zenodo.21638014).

---

## 1. Introduction

As autonomous software agents and complex reactive systems scale, they continuously compress high-dimensional environmental context into abstract state representations $R = \rho(S)$. However, ungoverned state abstraction introduces decision divergence: an optimal policy $\pi^*$ computed on full observable state $S$ may fail when evaluated on a compressed representation $R$.

This work addresses two fundamental research questions:
1. *What information must be preserved to guarantee decision equivalence?* (ST-015)
2. *What minimal runtime capability composition is necessary and irreducible to enforce decision preservation dynamically?* (ST-016)

### Main Contributions
This paper makes four primary contributions:
1. **Formal Definition of Minimal Runtime Governance:** We formalize capability necessity, decision preservation, runtime sufficiency, and irreducibility under state abstraction.
2. **Machine-Checked Proof of Kernel Necessity:** We prove in Lean 4 (230 build jobs, 0 `sorry`s) that removing any capability from $\mathcal{K}_D = \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$ destroys decision preservation.
3. **Empirical Ablation Methodology:** We introduce experiment EXP-004, constructing an empirical witness bridge elevating trace artifacts into formal machine proofs.
4. **Audited Zero-Contact Replication Package:** We publish an immutable, versioned research package with multi-OS CI and an external audit trail of 6 independent dry runs.

---

## 2. Related Work & Positioning

Unlike traditional program analysis paradigms, TAKT focuses specifically on **decision preservation under representation contraction**:
- **Abstract Interpretation (Cousot & Cousot):** Focuses on sound static over-approximation of program semantics. TAKT focuses on dynamic policy decision invariance ($\pi^*(R) = \pi^*(S)$).
- **Bisimulation & Refinement (Milner, Park):** Enforces strict state-by-state trace equivalence. TAKT permits aggressive internal state contraction provided temporal prefix monitoring ($C_{\text{temporal}}$) maintains policy consistency.
- **Runtime Verification (Leucker & Schallhart):** Evaluates execution traces against temporal logic formulas (LTL). TAKT formalizes and machine-checks the *necessity of the governance runtime kernel itself*.

---

## 3. Theoretical Foundations & Runtime Necessity Model

### 3.1 Decision Preserving Sufficiency (ST-015)
A representation $R_t \in \mathcal{R}$ is decision-sufficient with respect to optimal policy $\pi^*$ if:
$$\pi^*(R_t) = \pi^*(S_t) \quad \forall S_t \in \mathcal{S}$$

### 3.2 Runtime Necessity Formalization (ST-016)
We formalize a TAKT Governed Runtime as a tuple $M = (\mathcal{C}, \pi_M)$, where $\mathcal{C} \subseteq \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$.

```text
               Full Environment State S
                         │
                         ▼  [Abstraction ρ(S)]
             Compressed Representation R
                         │
                         ▼
        ┌──────────────────────────────────┐
        │   TAKT Governed Runtime M        │
        │  ┌────────────────────────────┐  │
        │  │ ContractSoundness (C_c)    │  │
        │  │ UncertaintyBound  (C_u)    │  │
        │  │ TemporalConsistency (C_t)  │  │
        │  └────────────────────────────┘  │
        └──────────────────────────────────┘
                         │
                         ▼
             Preserved Policy Decision π*(R)
```

**Definition (Capability Necessity):** A capability $C \in \mathcal{C}$ is *locally necessary* for runtime $M$ if removing $C$ alters policy decisions on at least one representation $R$:
$$\exists R \in \mathcal{R}: \pi_M(R) \neq \pi_{M \setminus \{C\}}(R)$$

**Intuitive Example:** Consider a runtime where temporal prefix monitoring ($C_{\text{temporal}}$) is removed. Two trajectories $\tau_1 = (r_0, r_1, r_2)$ and $\tau_2 = (r'_0, r'_1, r_2)$ share an identical terminal state $r_2$. If $\tau_1$ represents a safe approach while $\tau_2$ represents an unsafe trajectory, an ungoverned runtime inspecting only $r_2$ will execute identical actions, causing catastrophic decision divergence ($\pi_M(\tau_1) \neq \pi^*(\tau_1)$).

---

## 4. Machine-Certified Lean 4 Formalization

We implement the theoretical proofs in two canonical Lean 4 modules (`takt-formal`):
1. **`RuntimeSufficiency.lean`:** Formalizes `RuntimeCapability`, `Runtime`, `removeCapability`, `PreservesDecision`, `NecessaryCapability`, `Sufficient`, `Irreducible`, `MinimalRuntime`, proving:
   $$\text{MinimalRuntime}(M, \pi^*) \implies \forall C \in M.\text{capabilities}, \quad \text{NecessaryCapability}(C, M)$$
2. **`RuntimeWitness.lean`:** Defines the 3-layer certification bridge (`WitnessArtifact`, `WitnessConsistentWithRuntime` predicate) and proves the elevation theorem:
   $$\text{theorem } \texttt{validWitness\_implies\_necessity} : \text{WitnessConsistentWithRuntime}(M, w) \implies \text{NecessaryCapability}(w.\text{capability}, M)$$

Both modules compile with **0 errors and 0 `sorry`s across 230 build jobs**.

---

## 5. Empirical Validation & Ablation (EXP-004)

We validate kernel necessity on a reference TypeScript runtime (`cli/src/runtime/`) via component ablation experiment **EXP-004**:
- **$C_{\text{contract}}$ Ablation:** Identifies representations violating safety contracts ($\text{Contract}(R) = \text{false} \implies \pi_{\text{full}} = \text{STOP}, \pi_{\text{reduced}} = \text{EXECUTE}$).
- **$C_{\text{uncertainty}}$ Ablation:** Identifies representations at critical margin boundaries ($M_D(R) \approx 0 \implies \pi_{\text{full}} = \text{REFINE}, \pi_{\text{reduced}} = \text{EXECUTE}$).
- **$C_{\text{temporal}}$ Ablation:** Identifies prefix-dependent trajectories ($\tau_1 \neq \tau_2 \implies \pi_{\text{full}} = \text{INTERVENE}, \pi_{\text{reduced}} = \text{MONITOR}$).

The full empirical suite comprises **283/283 tests passing across 76 test files**.

---

## 6. Zero-Contact Reproducibility & Independent Audit

The replication kit features single-command verification (`./scripts/bootstrap.sh && ./scripts/verify.sh`), cross-platform GitHub Actions CI (Ubuntu/macOS), 100% SHA-256 hash manifest verification, and an audit log of 6 independent External Dry Run rounds culminating in `PASS WITH ENVIRONMENTAL LIMITATION`.

---

## 7. Scope Boundaries & Future Work (ST-017)

### Non-Claims & Scope Boundaries
1. **Model Scope:** ST-016 proves necessity specifically under the formal decision-preserving model $M = (\mathcal{C}, \pi_M)$ and discrete decision domain $\mathcal{D}$. It does not claim universal necessity for arbitrary software or continuous control systems.
2. **Transportability (ST-017 Boundary):** ST-016 proves necessity on the reference architecture. Transporting certified witness artifacts across heterogeneous runtimes ($M_1 \sim M_2$) is explicitly reserved for **ST-017**.
