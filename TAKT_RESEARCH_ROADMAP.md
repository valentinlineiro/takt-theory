# TAKT Research Program Trajectory & Roadmap

**Program Status:** Phase II Completed / Phase III Initiated  
**Frozen Standard Baseline:** ST-016 v1.0.0 (`st016-v1.0.0` / `fca31f0`)  

---

## 1. Research Line Trajectory

```text
ST-015: Representation Sufficiency Theory (FROZEN v1.0)
  │
  ├─► Problem: What state information must be preserved under abstraction?
  └─► Output: Characterization of minimal decision-preserving state kernels Σ*.
        │
        ▼
ST-016: Runtime Kernel Necessity & Certification (FROZEN v1.0.0)
  │
  ├─► Problem: What minimal runtime capability composition is necessary to govern decisions dynamically?
  └─► Output: Proof of necessity for K_D = {ContractSoundness, UncertaintyBound, TemporalConsistency},
              3-layer Lean 4 certification bridge, and zero-contact replication kit.
        │
        ▼
ST-017: Witness Transportability & Equivalence (PRE-FORMALIZATION / DESIGN)
  │
  ├─► Problem: Under what formal conditions M1 ~ M2 can certified witness artifacts be transported
  │           across heterogeneous runtime implementations (Rust, Python) while preserving Lean 4 proofs?
  └─► Output: Kernel equivalence axioms, witness translation functions, multi-runtime test harness.
        │
        ▼
ST-018: Distributed Governance & Asynchronous Consensus (PLANNED)
  │
  ├─► Problem: How do runtime governance kernels preserve policy decisions across distributed, asynchronous nodes?
  └─► Output: Distributed contract consistency, fault-tolerant margin estimation, trajectory consensus.
```

---

## 2. Milestone Registry

| Milestone | Scope | Formal Model | Empirical Evidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ST-015** | Representation Sufficiency | `StructuralSufficiency.lean` | Benchmarks Batch F-001..F-005 | **FROZEN v1.0** |
| **ST-016** | Runtime Kernel Necessity | `RuntimeSufficiency.lean`, `RuntimeWitness.lean` | EXP-004 Witness Suite (Vitest 283/283) | **FROZEN v1.0.0** |
| **ST-017** | Witness Transportability | `TaktFormal.RuntimeTransportability` | Cross-implementation test harness (`takt-rust`, `takt-python`) | **DESIGN** |
| **ST-018** | Distributed Governance | `TaktFormal.DistributedGovernance` | Multi-node consensus simulation | **PLANNED** |
