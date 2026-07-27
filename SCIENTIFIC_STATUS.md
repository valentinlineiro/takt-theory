# SCIENTIFIC_STATUS.md: TAKT Theoretical Research Program Status

**Current Program Phase:** Phase II — Zero-Contact Reproduction & External Verification (ST-016 v1.0)  
**Last Updated:** 2026-07-27  

---

## 1. Research Line Matrix

| Theoretical Line / Milestone | Status | Formal Proofs (Lean 4) | Empirical Evidence | Normative Spec |
| :--- | :--- | :--- | :--- | :--- |
| **ST-015 (Representation Sufficiency)** | **FROZEN (v1.0)** | [`StructuralSufficiency.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/StructuralSufficiency.lean) (0 errors, 0 sorrys) | Benchmarks Batch F-001..F-005 | [`structural-preservation-theory-v1.1.md`](file:///home/valentin/code/takt-theory/docs/structural-preservation-theory-v1.1.md) |
| **ST-016 (Runtime Kernel Necessity)** | **FROZEN (v1.0)** | [`RuntimeSufficiency.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RuntimeSufficiency.lean), [`RuntimeWitness.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RuntimeWitness.lean) | EXP-004 Witness Suite (`cli/src/runtime/__tests__/ablation/`) | [`ST-016-normative-runtime-specification.md`](file:///home/valentin/code/takt-theory/docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md) |
| **Replication & Verification Package** | **UNDER REVIEW** | Automated in `./scripts/verify.sh` | [`artifacts/verification/`](file:///home/valentin/code/takt-theory/artifacts/verification/) | Closure Report & Replication Spec |
| **ST-017 (Witness Transportability)** | **PLANNED** | Pending ST-016 zero-contact external reproduction | Multi-runtime cross-validation | Transportability Spec |

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
5. All artifact SHA-256 hashes match [`artifacts/verification/hashes.json`](file:///home/valentin/code/takt-theory/artifacts/verification/hashes.json).
