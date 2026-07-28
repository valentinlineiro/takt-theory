# TAKT (Theory of Adequate Knowledge for Decisions)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21638014.svg)](https://doi.org/10.5281/zenodo.21638014)
[![Release](https://img.shields.io/github/v/release/valentinlineiro/takt-theory?include_prereleases)](https://github.com/valentinlineiro/takt-theory/releases/tag/st016-v1.0.0)
[![Scientific Verification](https://github.com/valentinlineiro/takt-theory/actions/workflows/verify.yml/badge.svg)](https://github.com/valentinlineiro/takt-theory/actions/workflows/verify.yml)

TAKT is an axiomatic theory of decision-preserving representations. It provides a formal framework for determining when compressing or abstracting representation states preserves the optimal decisions made under complete information.

This repository consolidates the theoretical foundations, Lean 4 formal proofs, reference TypeScript runtime implementation, and empirical validation suites for the TAKT framework.

---

## 1. How to Cite

If you use TAKT, reference the ST-016 frozen standard release, or build upon the formal Lean 4 models, please cite our official Zenodo archive:

```bibtex
@software{takt_st016_2026,
  author    = {Lineiro, Valentin},
  title     = {TAKT ST-016: Minimal Decision-Preserving Runtime Governance Standard},
  year      = {2026},
  publisher = {Zenodo},
  version   = {1.0.0},
  doi       = {10.5281/zenodo.21638014},
  url       = {https://doi.org/10.5281/zenodo.21638014}
}
```

* **Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)
* **GitHub Release:** [`st016-v1.0.0`](https://github.com/valentinlineiro/takt-theory/releases/tag/st016-v1.0.0)
* **Scientific Manuscript Draft:** [`docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md`](docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md)
* **Scientific Closure Report:** [`docs/superpowers/specs/2026-07-27-st016-closure-report.md`](docs/superpowers/specs/2026-07-27-st016-closure-report.md)

---

## 2. Zero-Contact Reproduction & Verification

To execute the automated zero-contact verification suite (ST-016 v1.0.0 standard):

```bash
./scripts/bootstrap.sh && ./scripts/verify.sh
```

This single command pipeline automatically:
1. Validates Node.js and auto-provisions Lean 4 (`elan` / `lake`) if missing.
2. Builds the Lean 4 formal proof package with **0 errors and 0 `sorry`s** (230 build jobs).
3. Executes the Vitest test suite (**283 tests across 76 files, 100% passing**).
4. Generates EXP-004 component ablation witnesses for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.
5. Verifies SHA-256 artifact hashes and generates [`CONFORMANCE.md`](CONFORMANCE.md) and [`artifacts/verification/st016-v1.0/st016-v1.0-report.md`](artifacts/verification/st016-v1.0/st016-v1.0-report.md).

---

## 3. Repository Structure

* **/docs/** — Core theoretical knowledge & specifications
  * `superpowers/specs/` — Normative specifications (ST-016 Runtime Kernel Specification)
  * `04-academic-paper/` — Academic paper drafts and bibliography ([`2026-07-27-takt-st016-paper-draft.md`](docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md))
* **/publication/** — Publication metadata, BibTeX records, and checklists
* **/artifacts/verification/st016-v1.0/** — Versioned verification reports, SHA-256 manifests, and environment metadata
* **/takt-formal/** — Canonical Lean 4 verification package (`RuntimeSufficiency.lean`, `RuntimeWitness.lean`)
* **/cli/** — Reference TypeScript runtime & EXP-004 ablation experiment suite
* **`ST-016_FINAL_STATE.md`** — Invariable snapshot of the ST-016 v1.0.0 release baseline
* **`theory-manifest.yml`** — Normative theory manifest mapping capabilities to Lean 4 modules and runtime components

---

## 4. Scientific Program Status & Trajectory
* **Scientific Status Registry:** [`SCIENTIFIC_STATUS.md`](SCIENTIFIC_STATUS.md)
* **Research Roadmap:** [`TAKT_RESEARCH_ROADMAP.md`](TAKT_RESEARCH_ROADMAP.md)
* **ST-017 Research Line (Transportability):** [`st017/README.md`](st017/README.md)
