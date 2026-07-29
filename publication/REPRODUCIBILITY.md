# TAKT ST-016 Public Reproducibility & Artifact Package

**Standard Version:** ST-016 v1.0.0 (`st016-v1.0.0` / `fca31f0`)  
**Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Formal Core (Lean 4):** [`takt-formal/`](../takt-formal/) (Clean build, **0 sorry**)  
**Evidence Standard:** `ExperimentArtifact` (schema v1)  

---

## 1. Package Overview

This directory contains the self-contained scientific publication assets for **TAKT ST-016 v1.0.0 (Runtime Kernel Necessity)**.

| Asset | Path | Description |
| :--- | :--- | :--- |
| **ArXiv Submission Package** | [`publication/arxiv/`](publication/arxiv/) | Complete TeX sources, compiled PDF, abstract, and category metadata (`cs.LO`, `cs.PL`, `cs.SE`). |
| **Zenodo Metadata & BibTeX** | [`publication/metadata/citation.bib`](publication/metadata/citation.bib) | Permanent DOI and standard BibTeX citation record. |
| **Normative Specification** | [`docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md`](docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md) | Immutable specification of kernel necessity claims. |
| **Closure & Audit Report** | [`docs/superpowers/specs/2026-07-27-st016-closure-report.md`](docs/superpowers/specs/2026-07-27-st016-closure-report.md) | Verification verdict across 6 dry-run audit iterations. |

---

## 2. Zero-Contact Verification Instructions

To independently verify all formal claims and empirical evidence contained in ST-016:

### A. Lean 4 Formal Proofs
```bash
cd takt-formal
lake build
# Expected: Clean compilation, 0 errors, 0 sorrys
```

### B. Empirical Runtime & Ablation Test Suite
```bash
# Run complete runtime Vitest suite
npx vitest run cli/src/runtime

# Execute BENCHMARK-001 reproducible comparison
npx tsx benchmarks/benchmark-001/run.ts
```

---

## 3. Scientific Citation

```bibtex
@misc{lineiro2026takt,
  author       = {Lineiro, Valentin},
  title        = {TAKT ST-016: Runtime Kernel Necessity & Minimal Sufficiency},
  year         = {2026},
  publisher    = {Zenodo},
  version      = {v1.0.0},
  doi          = {10.5281/zenodo.21638014},
  url          = {https://doi.org/10.5281/zenodo.21638014}
}
```
