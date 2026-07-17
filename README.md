# TAKT (Theory of Adequate Knowledge for Decisions)

TAKT is an axiomatic theory of decision-preserving representations. It provides a formal framework for determining when compressing or abstracting representation states preserves the optimal decisions made under complete information.

This repository consolidates the theoretical foundations, Lean 4 formal proofs, and empirical validation suites for the TAKT framework.

---

## 1. Repository Structure

The project is semantic, functional, and organized as follows:

* **/docs/** — Core theoretical knowledge
  * `01-foundations/` — Axiomatic introduction, v3.0 formal specification, and reference guide
  * `02-theoretical-positioning/` — Positioning audits comparing TAKT to Blackwell sufficiency, bisimulation, etc.
  * `03-design-contracts/` — Operational contract definitions (D-001 Margin, D-002 Coverage, D-003 Dynamic Contracts)
  * `04-academic-paper/` — Academic paper drafts and bibliography. Includes **paper v4** (`2026-07-17-takt-v4-draft.md`), which introduces trajectory-based dynamic governance, the dynamic margin M_D, the guaranteed intervention horizon, and the asymmetric margin effect.
  * `05-archives/` — Historical phase freezes, revisions, and precursor formalisms
* **/experiments/** — Reproducible empirical evidence
  * `stress-tests/` — Target-risk stress tests (ST-001 to ST-007) validating failure boundaries
  * `case-studies/` — Concrete case studies (CASE-001 to CASE-005) showing runtime performance
  * `computational-batches/` — The 24 sequential batch runs (batch-001 to batch-024) mapping the Pareto frontier
* **/takt-formal/** — Canonical Lean 4 verification package
  * `TaktFormal/` — Lean 4 source files demonstrating proofs of safety equivalence, factorization, dynamic contracts, and Red Team attacks (RT-001 to RT-004)
* **/cli/** — TypeScript evaluation engine running batch analysis
* **/session/** — Historical session records (novelty audit, governance backlog)

---

## 2. Validation & Reproduction

### 2.1 Running the Evaluation Suite
The empirical validation suite is written in TypeScript and runs via Vitest on Node:
```bash
npx vitest run
```
The suite currently comprises **131 tests across 51 files, all passing with zero failures**
(F-001 to F-005.1 experiments + Red Team attacks RT-001 to RT-004).

### 2.2 Compiling Lean 4 Proofs
To verify the mathematical proofs, build the Lean 4 core project:
```bash
cd takt-formal
lake build
```
This compilation runs with zero external dependencies and completes with no errors or unresolved sorrys.

---

## 3. Historical Precursors
* `docs/05-archives/omega-formalism-v0.1.md` — Precursor to the current observability framework, outlining the transition from EVSI to governed representational contraction.
