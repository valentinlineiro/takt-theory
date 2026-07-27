# TAKT (Theory of Adequate Knowledge for Decisions)

TAKT is an axiomatic theory of decision-preserving representations. It provides a formal framework for determining when compressing or abstracting representation states preserves the optimal decisions made under complete information.

This repository consolidates the theoretical foundations, Lean 4 formal proofs, and empirical validation suites for the TAKT framework.

---

## 1. Repository Structure

The project is semantic, functional, and organized as follows:

* **/docs/** — Core theoretical knowledge & specifications
  * `superpowers/specs/` — Normative specifications (ST-016 Runtime Kernel Specification)
  * `01-foundations/` — Axiomatic introduction, formal specifications, and reference guides
  * `02-theoretical-positioning/` — Positioning audits comparing TAKT to Blackwell sufficiency, bisimulation, etc.
  * `03-design-contracts/` — Operational contract definitions
  * `04-academic-paper/` — Academic paper drafts and bibliography
  * `05-archives/` — Historical phase freezes, revisions, and precursor formalisms
* **/artifacts/verification/** — Versioned verification reports, SHA-256 manifests, and environment metadata
* **/takt-formal/** — Canonical Lean 4 verification package
  * `TaktFormal/` — Lean 4 source files demonstrating proofs of safety equivalence, factorization, dynamic contracts, and ST-016 Runtime Sufficiency & Witness elevation
* **/cli/** — TypeScript evaluation engine running batch analysis & EXP-004 ablation suite
* **`theory-manifest.yml`** — Normative specification manifest mapping theoretical capabilities to Lean 4 modules and runtime components

---

## 2. Zero-Contact Reproduction & Verification

To execute the automated zero-contact verification suite (ST-016 v1.0 standard):

```bash
./scripts/bootstrap.sh && ./scripts/verify.sh
```

This single command pipeline automatically:
1. Validates Node.js and auto-provisions Lean 4 (`elan` / `lake`) if missing.
2. Builds the Lean 4 formal proof package with **0 errors and 0 `sorry`s** (230 build jobs).
3. Executes the Vitest test suite (**283 tests across 76 files, 100% passing**).
4. Generates EXP-004 component ablation witnesses for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.
5. Verifies SHA-256 artifact hashes and generates [`CONFORMANCE.md`](CONFORMANCE.md) and [`artifacts/verification/st016-v1.0/st016-v1.0-report.md`](artifacts/verification/st016-v1.0/st016-v1.0-report.md).

### 2.1 Independent TypeScript Test Run
```bash
npx vitest run
```

### 2.2 Independent Lean 4 Build
```bash
cd takt-formal
lake build
```

---

## 3. Scientific Program Status
See [`SCIENTIFIC_STATUS.md`](SCIENTIFIC_STATUS.md) for the active research matrix and frozen theoretical standards.
