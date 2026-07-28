# TAKT (Theory of Adequate Knowledge for Decisions)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21638014.svg)](https://doi.org/10.5281/zenodo.21638014)
[![Release](https://img.shields.io/github/v/release/valentinlineiro/takt-theory?include_prereleases)](https://github.com/valentinlineiro/takt-theory/releases/tag/st016-v1.0.0)
[![Scientific Verification](https://github.com/valentinlineiro/takt-theory/actions/workflows/verify.yml/badge.svg)](https://github.com/valentinlineiro/takt-theory/actions/workflows/verify.yml)

## Executive Summary

**TAKT** is an axiomatic theory of decision-preserving state representations. It addresses a fundamental failure mode in autonomous software systems: *when high-dimensional environmental context is compressed into abstract state representations, ungoverned abstraction causes decision instability.*

The **ST-016 standard** establishes the formal necessity and minimal composition of the runtime governance kernel required to guarantee decision preservation dynamically. This repository provides the machine-certified Lean 4 formalization (0 `sorry`s across 230 build jobs), a reference TypeScript runtime implementation (283/283 tests passing), the EXP-004 component ablation witness suite, and an audited zero-contact replication package.

---

## 1. Project Status & Milestone Registry

| Component Layer | Standard | Status | Artifact / Location |
| :--- | :--- | :--- | :--- |
| **Representation Sufficiency** | **ST-015** | ✅ **FROZEN (v1.0)** | [`takt-formal/TaktFormal/StructuralSufficiency.lean`](takt-formal/TaktFormal/StructuralSufficiency.lean) |
| **Runtime Kernel Necessity** | **ST-016** | ✅ **PUBLISHED (v1.0.0)** | DOI: [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014) |
| **Replication Package** | **v1.0.0** | ✅ **STABLE & AUDITED** | Audited via 6 External Dry Runs ([`st016-v1.0-report.md`](artifacts/verification/st016-v1.0/st016-v1.0-report.md)) |
| **Witness Transportability** | **ST-017** | 🚧 **RESEARCH / DESIGN** | [`st017/README.md`](st017/README.md) |

---

## 2. Navigation Pathways

### 📖 Read the Theory & Specifications
* **Zenodo Archive & DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)
* **GitHub Release:** [`st016-v1.0.0`](https://github.com/valentinlineiro/takt-theory/releases/tag/st016-v1.0.0)
* **Academic Manuscript Draft:** [`docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md`](docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md)
* **Normative Specification:** [`docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md`](docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md)
* **Closure Report:** [`docs/superpowers/specs/2026-07-27-st016-closure-report.md`](docs/superpowers/specs/2026-07-27-st016-closure-report.md)

### 🔬 Reproduce & Verify Results
Execute the automated zero-contact verification suite in a clean environment:
```bash
./scripts/bootstrap.sh && ./scripts/verify.sh
```
This single command automatically provisions Lean 4 (`elan`/`lake`), builds all 230 formal proof jobs, runs the 283-test TypeScript suite, generates EXP-004 witnesses, and verifies SHA-256 artifact hashes against [`artifacts/verification/st016-v1.0/hashes.json`](artifacts/verification/st016-v1.0/hashes.json).

### 🚀 Explore Active Research & Future Work
* **ST-017 Research Questions:** [`docs/superpowers/specs/2026-07-27-st017-research-questions.md`](docs/superpowers/specs/2026-07-27-st017-research-questions.md)
* **Kernel Equivalence Theory:** [`st017/theory/kernel-equivalence.md`](st017/theory/kernel-equivalence.md)
* **Research Program Roadmap:** [`TAKT_RESEARCH_ROADMAP.md`](TAKT_RESEARCH_ROADMAP.md)

---

## 3. How to Cite

If you use TAKT or reference the ST-016 frozen standard release, please cite our official Zenodo archive:

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

---

## 4. Repository Structure

* **/docs/** — Core theoretical knowledge & specifications
  * `04-academic-paper/` — Academic paper drafts ([`2026-07-27-takt-st016-paper-draft.md`](docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md))
* **/publication/** — Publication metadata, BibTeX records, and checklists
* **/artifacts/verification/st016-v1.0/** — Versioned verification reports, SHA-256 manifests, and environment metadata
* **/takt-formal/** — Canonical Lean 4 verification package (`RuntimeSufficiency.lean`, `RuntimeWitness.lean`)
* **/cli/** — Reference TypeScript runtime & EXP-004 ablation experiment suite
* **/st017/** — ST-017 Witness Transportability research line
* **`ST-016_FINAL_STATE.md`** — Invariable snapshot of the ST-016 v1.0.0 release baseline
* **`theory-manifest.yml`** — Normative theory manifest mapping capabilities to Lean 4 modules and runtime components
