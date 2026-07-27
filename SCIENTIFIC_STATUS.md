# SCIENTIFIC_STATUS.md: TAKT Theoretical Research Program Status

**Current Program Phase:** Phase II — Zero-Contact Reproduction & External Verification (ST-016 v1.0)  
**Last Updated:** 2026-07-27  

---

## 1. Research Line Matrix

| Theoretical Line / Milestone | Status | Formal Proofs (Lean 4) | Empirical Evidence | Normative Spec |
| :--- | :--- | :--- | :--- | :--- |
| **ST-015 (Representation Sufficiency)** | **FROZEN (v1.0)** | [`StructuralSufficiency.lean`](takt-formal/TaktFormal/StructuralSufficiency.lean) (0 errors, 0 sorrys) | Benchmarks Batch F-001..F-005 | [`structural-preservation-theory-v1.1.md`](docs/structural-preservation-theory-v1.1.md) |
| **ST-016 (Runtime Kernel Necessity)** | **FROZEN (v1.0)** | [`RuntimeSufficiency.lean`](takt-formal/TaktFormal/RuntimeSufficiency.lean), [`RuntimeWitness.lean`](takt-formal/TaktFormal/RuntimeWitness.lean) | EXP-004 Witness Suite (`cli/src/runtime/__tests__/ablation/`) | [`ST-016-normative-runtime-specification.md`](docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md) |
| **Replication & Verification Package** | **FROZEN (v1.0)** | Automated in `./scripts/verify.sh` & GitHub Actions | [`artifacts/verification/st016-v1.0/`](artifacts/verification/st016-v1.0/) | [`CONFORMANCE.md`](CONFORMANCE.md) |
| **ST-017 (Witness Transportability)** | **PLANNED** | Pending ST-017 research line initiation | Multi-runtime cross-validation | Transportability Spec |

---

## 2. Reproduction Criteria (ST-016 v1.0)

A zero-contact reproduction of ST-016 v1.0 requires running:
```bash
./scripts/bootstrap.sh && ./scripts/verify.sh
```
and verifying that:
1. Lean 4 compiles with 0 errors and 0 `sorry`s across 230 build jobs.
2. Vitest runs 283/283 tests passing across 76 test files.
3. EXP-004 generates valid `WitnessArtifact` records for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.
4. Lean 4 theorem `validWitness_implies_necessity` certifies capability necessity.
5. All artifact SHA-256 hashes match [`artifacts/verification/st016-v1.0/hashes.json`](artifacts/verification/st016-v1.0/hashes.json).

---

## 3. External Reproduction Audit Log
- **External Dry Runs Executed:** 6 total rounds
- **Final Result:** `PASS WITH ENVIRONMENTAL LIMITATION` (Audited in `dry-run-report-v6.md`)
- **Status:** **REPRODUCED & VERIFIED**
