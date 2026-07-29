# TAKT v1.0 — Scope, Empirical Limitations, and Validity Boundaries

**Document Version:** `v1.0.0`  
**Date:** 2026-07-29  
**Status:** Official Scientific Boundary Declaration  

---

## 1. Covered Empirical Domains (What is Verified)

The TAKT v1.0 experimental platform and theory (ST-015, ST-016, ST-017) have been verified across the following concrete operational regimes (`BENCHMARK-001` through `BENCHMARK-005`):

1. **Policy & Decision Threshold Preservation:** Conservative policies maintaining decision margins ($\Delta M_D \ge 0.50$) prevent contract degradation transitions (`BENCHMARK-001`).
2. **Spatial Dimensionality Invariance ($|S|$):** State space abstraction via task capability kernel projection is invariant under state vector scaling up to $|S| = 1000$ dimensions (`BENCHMARK-002`).
3. **Temporal Horizon Boundaries ($H_{\text{bound}}$):** Governed trajectories under environmental drift rate $\theta = 0.05$ degrade deterministically at $H_{\text{bound}} = 10$ steps without incurring contract breaches (`VIOLATION = 0`) (`BENCHMARK-003`).
4. **Stochastic Asynchrony & Delay ($\tau_{\text{delay}}$):** Single-contract state machines absorb communication delays up to $\tau_{\text{delay}} = 20$ steps safely via local `DEGRADED` transitions (`BENCHMARK-004`).
5. **Static Priority Multi-Contract Composition:** Conservative contracts deterministically dominate permissive contracts in multi-contract evaluation topologies without deadlocks (`BENCHMARK-005`).

---

## 2. Unresolved Boundaries & Open Questions (What is NOT Verified)

The following operational phenomena remain **unexercised** and fall outside the empirical guarantees of TAKT v1.0:

1. **Continuous Markov Decision Processes (MDPs):** Non-discrete state space projections requiring continuous kernel metrics.
2. **Asynchronous Byzantine Multi-Agent Consensus:** Multi-node state divergence under hostile or non-cooperative message corruption.
3. **Dynamic Contract Negotiation:** Real-time online contract re-negotiation under dynamic multi-agent priority shifts.
4. **Cross-Language Runtime Interoperability (Fase 4):** Execution of Protocol B (`ExperimentArtifact` schema v1) on non-Node/TS runtimes (e.g. `takt-rust`, `takt-python`).

---

## 3. Mandatory Triggers for Future Extension ST-018

Creation of the **ST-018** extension module remains **LOCKED**. ST-018 will be initiated **ONLY** if future empirical benchmarks demonstrate one of the following concrete conditions:

1. **Byzantine State Disruption:** Unhandled contract violations ($\text{VIOLATION} > 0$) occurring under hostile message manipulation across distributed nodes.
2. **Dynamic Multi-Contract Deadlock:** Deadlock conditions (no valid state transition) arising during dynamic multi-contract negotiation without static priority dominance.

---

## 4. Summary Matrix of Public Release Assets

| Release Asset | Repository Path | Responsibilities & Purpose |
| :--- | :--- | :--- |
| **Formal Core** | [`takt-formal/`](takt-formal/) | Lean 4 Mechanized Proofs (ST-015, ST-016, ST-017 / **0 sorry**) |
| **Experimental Platform** | [`cli/src/runtime/`](cli/src/runtime/) | `CertifiedRuntimePipeline`, `EventBus`, `ExperimentArtifact`, `ArtifactReader` |
| **Knowledge Registry** | [`CLAIMS.md`](CLAIMS.md) | Official claims, non-claims, and empirical evidence traceability matrix |
| **Empirical Evidence** | [`benchmarks/`](benchmarks/) | Reproducible benchmarks `BENCHMARK-001..005` + `ExperimentArtifact` (v1) |
| **Scope & Boundaries** | [`SCOPE_AND_LIMITATIONS.md`](SCOPE_AND_LIMITATIONS.md) | Explicit declaration of verified domains and open research frontiers |
