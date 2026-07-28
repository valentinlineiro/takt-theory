# ST-016 Research Baseline Snapshot (v1.0.0 Frozen)

**Standard:** ST-016 Runtime Kernel Necessity & Minimal Sufficiency  
**Version:** `v1.0.0`  
**Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Git Tag:** [`st016-v1.0.0`](https://github.com/valentinlineiro/takt-theory/releases/tag/st016-v1.0.0)  
**Reference Commit:** `fca31f0`  
**Date:** 2026-07-27  
**Manifest:** [`theory-manifest.yml`](theory-manifest.yml) (Schema 1.0)  

---

## 1. Baseline Summary

This baseline snapshot records the exact frozen reference state of **ST-016 v1.0.0** following 6 independent zero-contact external audit rounds.

| Component Layer | Asset / Module | Status | Evidence / Artifact |
| :--- | :--- | :--- | :--- |
| **Normative Standard** | `docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md` | FROZEN | `theory-manifest.yml` Schema 1.0 |
| **Formal Model (Lean 4)** | `TaktFormal.RuntimeSufficiency`, `TaktFormal.RuntimeWitness` | VERIFIED | 230 jobs, 0 errors, 0 `sorry`s |
| **Reference Runtime (TS)** | `cli/src/runtime/` | VERIFIED | 283/283 Vitest tests passing (76 files) |
| **Empirical Witnesses** | EXP-004 Ablation Test Suite | CERTIFIED | Witnesses for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, $C_{\text{temporal}}$ |
| **Elevation Theorem** | `validWitness_implies_necessity` | PROVED | Lean 4 proof in `RuntimeWitness.lean` |
| **Verification Suite** | `./scripts/bootstrap.sh && ./scripts/verify.sh` | PASS | `artifacts/verification/st016-v1.0/` |
| **CI Automation** | `.github/workflows/verify.yml` | PASS | Ubuntu & macOS Runners |
| **External Audit** | 6 Independent Dry Run Iterations | VERIFIED | Final Verdict: `PASS WITH ENVIRONMENTAL LIMITATION` |
| **Closure Report** | `docs/superpowers/specs/2026-07-27-st016-closure-report.md` | COMPLETE | Full research closure |
| **Zenodo Citation** | `10.5281/zenodo.21638014` | ARCHIVED | Permanent citable scientific object |

---

## 2. Invariable Hash Manifest

| Target File | SHA-256 Digest |
| :--- | :--- |
| `theory-manifest.yml` | `e11a0d512ce6e3e9aab1cd4a16969dfc9cb60654590d1f059dd8b3871abc0326` |
| `ST-016 Normative Specification` | `9bb10afd79c695652f9d0e5f5c02e17e34e70d5dd0de824640d34f77c81aef36` |
| `RuntimeSufficiency.lean` | `135af1989386758a67966035d86469dff805d82b863fb2546831d2f8b98b0827` |
| `RuntimeWitness.lean` | `19a04716b0ce03d6115c589cb11970b91f913d70367abc8df5d576dcb8833c0a` |
| `temporal.ablation.test.ts` | `627d4ce7cc693ea75751b6241ed5c50bf3637c929fde57822a51acc3bcbfac60` |
| `uncertainty.ablation.test.ts` | `a64fe0f1db303cfbc4db626eed774631c6f3efdfcac1bae6b17808b15e26cf47` |
| `contract.ablation.test.ts` | `8fd5dfcd88703585c03b3e6eb86f98b3acf96a92c929fd800a38f5aff8e7608a` |

---

## 3. Transition to ST-017

With ST-016 v1.0.0 established as an immutable scientific baseline, research progresses to **ST-017**:
- **ST-015:** Representation Sufficiency ($\Sigma^*$)
- **ST-016:** Runtime Kernel Necessity ($\mathcal{K}_D$) — DOI: [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)
- **ST-017:** Witness Transportability & Cross-Implementation Equivalence ($M_1 \sim M_2$)
