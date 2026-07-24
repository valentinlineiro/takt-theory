# TAKT Scientific Validity Log & Threat Audit

> **Document Status:** Living Epistemological Audit Register  
> **Repository:** `takt-theory`  
> **Current Version:** `v1.2.0` (Commit `69b0eff`)

---

## Executive Objective

This register tracks all identified threats to validity (Internal, External, Construct, and Conclusion), how they were detected through empirical audits (R0', R1, R2), their current status, and the evidence associated with their resolution.

---

## Cumulative Threat Log

| ID | Threat Category | Identified Threat | Detection Audit | Status | Resolution & Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **V-001** | Internal Validity | **Oracle Leakage:** `TaktRunner` returning `event.trueDecision` directly without computing decision from state abstraction | `R0'` / `R1 Audit` | **RESUELTO** | Fixed in `v1.2.0`. Action selection $a$ now computed directly from $R(S)$ without oracle leakage. Tests verified. |
| **V-002** | Internal Validity | **Non-Deterministic Hashes:** Timestamp in `DatasetWriter.ts` rendering SHA-256 dataset hashes variable across runs | `R0'` Audit | **RESUELTO** | Fixed in `v1.1.0`. Excluded timestamp from hash calculation. Hashes 100% deterministic. |
| **V-003** | Construct Validity | **Non-Discriminative Baselines:** Baselines having zero regret, failing to test non-sufficient state representations | `R1 Audit` | **RESUELTO** | Added `OvercompressedRunner` baseline in `v1.2.0`. Insufficient representation exhibits $53\% - 94\%$ regret. |
| **V-004** | Internal Validity | **Meta-Audit Hardcoded Values:** `exp-001-meta-audit.ts` containing literal numbers instead of dynamic evaluation | `R1 Audit` | **RESUELTO** | Replaced literals with dynamic calculation via `BoundaryExplorer` in `v1.2.0`. |
| **V-005** | External Validity | **Synthetic Benchmark Dependency:** Hypothesis evaluated only on vector benchmark scenarios | `R1 Audit` | **RESUELTO** | Implemented `R2.0` exogenous domains: STRIPS Classical Planning (`EXP-005`) and Paxos Consensus (`EXP-006`). |
| **V-006** | Conclusion Validity | **Single-Seed Bias:** Experiments evaluated under single fixed seed (`seed = 42`) | Internal Review | **RESUELTO** | Executed 1,000-seed statistical sweep (`benchmarks/stats/statistical-sweep.ts`). Confirmed $R_1 \text{ Regret} = 0.00$, $R_2 \text{ Regret} = 66.7\% - 91.2\%$ ($\text{CI}_{95}$ tight, $p < 0.0001$). Dataset saved. |
| **V-007** | External Validity | **Continuous Stochastic Processes:** Unverified performance under continuous stochastic Markov environments | Theory Review | **DECLARADA** | Declared out-of-scope limitation in `CLAIMS.md` and `RELEASE_NOTES_v1.0.md`. |

---

## Audit Governance Rules

1. **No Erasure of History:** Discovered leaks and failed audits ($R_0\text{-FAIL}, R_1\text{-FAIL}$) must remain permanently recorded in `experiments/` as evidence of apparatus calibration.
2. **Prioritization of Falsification:** High priority is assigned to experiments seeking to break theoretical boundaries over confirmative runs.
3. **Traceability Guarantee:** Every resolution must link to commit hashes and executable validation scripts.
