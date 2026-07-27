# TAKT: A Formal Framework for Minimal Decision-Preserving Runtime Governance

**Authors:** Valentin Lineiro et al.  
**Target Milestone:** ST-016 v1.0.0 Frozen Baseline  
**DOI / Reference:** [`ST-016_FINAL_STATE.md`](../../ST-016_FINAL_STATE.md)  

---

## Abstract

Software systems operating under abstracted or compressed state representations frequently risk decision instability when critical informational context is discarded. This paper introduces TAKT (Theory of Adequate Knowledge for Decisions), a formal and empirical framework for determining the minimal necessary governance kernel of an execution runtime. We prove in Lean 4 that any governed runtime preserving optimal decisions under state abstraction MUST possess three fundamental capability kernels: ContractSoundness ($C_{\text{contract}}$), UncertaintyBound ($C_{\text{uncertainty}}$), and TemporalConsistency ($C_{\text{temporal}}$). We provide a reference TypeScript runtime implementation, empirical component ablation evidence (EXP-004), a machine-certified 3-layer witness elevation bridge, and a zero-contact replication package audited across 6 independent external verification rounds.

---

## 1. Introduction

As autonomous and agentic software systems scale, they continuously compress high-dimensional environmental context into abstract state representations. However, ungoverned state abstraction introduces decision divergence: an optimal policy $\pi^*$ computed on full observable state $S$ may fail when evaluated on a compressed representation $R = \rho(S)$.

This work addresses two fundamental questions:
1. *What information must be preserved to guarantee decision equivalence?* (ST-015)
2. *What minimal runtime capability composition is necessary and irreducible to enforce decision preservation dynamically?* (ST-016)

---

## 2. Theoretical Foundations (ST-015 Representation Sufficiency)

We define a representation $R_t \in \mathcal{R}$ as decision-sufficient with respect to policy $\pi^*$ if:
$$\pi^*(R_t) = \pi^*(S_t) \quad \forall S_t \in \mathcal{S}$$

The minimal decision-preserving information kernel is given by the intersection of task contracts:
$$\mathcal{K}_D = \bigcap_{c \in \text{Contracts}} K_c$$

---

## 3. Runtime Necessity Model (ST-016)

We formalize a TAKT Governed Runtime as a tuple $M = (\mathcal{C}, \pi_M)$, where $\mathcal{C} \subseteq \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$.

### Definition (Capability Necessity)
A capability $C \in \mathcal{C}$ is *locally necessary* for runtime $M$ if removing $C$ alters policy decisions on at least one representation $R$:
$$\exists R \in \mathcal{R}: \pi_M(R) \neq \pi_{M \setminus \{C\}}(R)$$

### Definition (Minimal Runtime & Irreducibility)
A runtime $M$ is *minimal* if it is sufficient ($\forall R, \pi_M(R) = \pi^*(R)$) and *irreducible*:
$$\forall C \in \mathcal{C}, \quad C \text{ is necessary for } M$$

---

## 4. Formal Proofs (Lean 4)

We present two canonical Lean 4 proof modules in `takt-formal`:
- **`RuntimeSufficiency.lean`**: Formalizes `RuntimeCapability`, `Runtime`, `removeCapability`, `PreservesDecision`, `NecessaryCapability`, `Sufficient`, `Irreducible`, `MinimalRuntime`, and proves the kernel necessity theorems.
- **`RuntimeWitness.lean`**: Defines the 3-layer certification bridge (`WitnessArtifact`, `WitnessConsistentWithRuntime`, `validWitness_implies_necessity` theorem) linking empirical data to machine proofs with 0 `sorry`s.

---

## 5. Empirical Validation (EXP-004 Component Ablation)

We validate kernel necessity on a reference TypeScript runtime (`cli/src/runtime/`) via component ablation experiment **EXP-004**:
1. **$C_{\text{contract}}$ Ablation:** Demonstrates safety contract breaches ($\text{Contract}(R) = \text{false}$).
2. **$C_{\text{uncertainty}}$ Ablation:** Demonstrates margin degradation ($M_D(R) \approx 0$).
3. **$C_{\text{temporal}}$ Ablation:** Demonstrates trajectory prefix dependence ($\tau_1 \neq \tau_2$).

Each ablation produces a machine-verifiable `WitnessArtifact` record elevated to a formal Lean 4 theorem.

---

## 6. Zero-Contact Reproducibility & Audit

Our replication kit features:
- Single-command verification: `./scripts/bootstrap.sh && ./scripts/verify.sh`.
- Multi-OS CI matrix (`ubuntu-latest`, `macos-latest`).
- Audit log of 6 independent External Dry Run rounds culminating in `PASS WITH ENVIRONMENTAL LIMITATION`.
- 100% hash verification across all canonical artifacts (`hashes.json`).

---

## 7. Limitations & Future Work (ST-017)

ST-016 proves necessity on the reference architecture. **ST-017 (Witness Transportability Theory)** extends this foundation to investigate under what conditions certified witness artifacts can be transported across heterogeneous implementations ($M_1 \sim M_2$) while preserving formal safety guarantees.
