# Design Spec: Restructure TAKT Repository Structure

This specification outlines the mechanical migration of the TAKT documentation and experimental results into a structured, unified taxonomy based on **Approach A (Unified & Categorized Portal)**.

---

## 1. Directory Structure Target

The repository will be reorganized into the following folders:

```
takt-theory/
├── README.md
├── docs/
│   ├── 01-foundations/             # Core theory, specification, and reference guide
│   ├── 02-theoretical-positioning/ # Theoretical positioning, comparisons, and audits
│   ├── 03-design-contracts/        # Operational contract milestones (D-001, D-002, D-003)
│   ├── 04-academic-paper/          # Paper drafts and bibliography
│   └── 05-archives/                # Historical freezes, precursor formalisms, and older specs
│
├── experiments/
│   ├── stress-tests/               # Risk stress tests (ST-001 to ST-007)
│   ├── case-studies/               # Specific system case studies (CASE-001 to CASE-005)
│   └── computational-batches/      # The 24 computational runs (batch-001 to batch-024)
│
├── takt-formal/                    # Self-contained Lean 4 formalization package
│   └── TaktFormal/                 # Single source of truth for Lean proof files
│
└── cli/                            # TypeScript source code evaluating computational batches
```

---

## 2. Robust Migration Rules

To ensure a robust, lossless migration, the following rules apply:

### 2.1 Git History Preservation
* **All moves must preserve Git history using `git mv`.**
* No delete-and-copy operations are permitted for versioned files.

### 2.2 Duplication Cleanup
* Duplicate Lean files in `docs/research/D-00x/implementation/` (`DecisionMargin.lean`, `Coverage.lean`, `DynamicSafetyContract.lean`) will be deleted. The canonical source of truth remains `takt-formal/TaktFormal/`.

---

## 3. File Migration Mapping

### 3.1 From `docs/theory/` to `docs/01-foundations/`
* `docs/theory/what-takt-is.md` $\to$ `docs/01-foundations/what-takt-is.md`
* `docs/theory/takt-specification-v3.md` $\to$ `docs/01-foundations/takt-specification-v3.md`
* `docs/theory/takt-formal-foundations-v1.md` $\to$ `docs/01-foundations/takt-formal-foundations-v1.md`
* `docs/theory/takt-theoretical-revision-v3.md` $\to$ `docs/01-foundations/takt-theoretical-revision-v3.md`
* `docs/theory/reference-implementation-guide.md` $\to$ `docs/01-foundations/reference-implementation-guide.md`

### 3.2 From `docs/research/` to `docs/` Subdirectories
* `docs/research/novelty-audit.md` $\to$ `docs/02-theoretical-positioning/novelty-audit.md`
* `docs/research/novelty/` (10 files) $\to$ `docs/02-theoretical-positioning/novelty/`
* `docs/research/D-001/formalization.md` $\to$ `docs/03-design-contracts/D-001/formalization.md`
* `docs/research/D-002/formalization.md` $\to$ `docs/03-design-contracts/D-002/formalization.md`
* `docs/research/D-003/formalization.md` $\to$ `docs/03-design-contracts/D-003/formalization.md`
* `docs/research/paper-draft-v1.md` $\to$ `docs/04-academic-paper/paper-draft-v1.md`
* `docs/research/bibliography.md` $\to$ `docs/04-academic-paper/bibliography.md`
* `docs/research/phase-b-freeze.md` $\to$ `docs/05-archives/phase-b-freeze.md`
* `docs/research/phase-c-freeze.md` $\to$ `docs/05-archives/phase-c-freeze.md`
* `docs/research/phase-d-freeze.md` $\to$ `docs/05-archives/phase-d-freeze.md`
* `docs/research/phase-evolution-freeze-v3.md` $\to$ `docs/05-archives/phase-evolution-freeze-v3.md`

### 3.3 From `experiments/` to `experiments/stress-tests/`
* `experiments/ST-001/` through `experiments/ST-007/` $\to$ `experiments/stress-tests/ST-001/` through `experiments/stress-tests/ST-007/`

### 3.4 From `research/` to `/` Subdirectories
* `research/analysis/batch-001.md` $\to$ `experiments/computational-batches/batch-001/batch-001.md`
* `research/analysis/batch-002.md` $\to$ `experiments/computational-batches/batch-002/batch-002.md`
* `research/analysis/batch-003.md` $\to$ `experiments/computational-batches/batch-003/batch-003.md`
* `research/analysis/batch-004.md` $\to$ `experiments/computational-batches/batch-004/batch-004.md`
* `research/analysis/batch-005.md` $\to$ `experiments/computational-batches/batch-005/batch-005.md`
* `research/analysis/batch-008-*` (4 files) $\to$ `experiments/computational-batches/batch-008/batch-008-*`
* ... similarly for all other batches `009` through `024`.
* `research/analysis/batch-0091-experimental-freeze.md` $\to$ `experiments/computational-batches/batch-0091/batch-0091-experimental-freeze.md`
* `research/analysis/fixture-semantic-contract.md` $\to$ `experiments/computational-batches/fixture-semantic-contract.md`
* `research/analysis/takt-synthesis-report.md` $\to$ `experiments/computational-batches/takt-synthesis-report.md`
* `research/analysis/omega-formalism-v0.1.md` $\to$ `docs/05-archives/omega-formalism-v0.1.md`
* `research/batch-002-design.md` $\to$ `experiments/computational-batches/batch-002/batch-002-design.md`
* `research/batch-002-plan.md` $\to$ `experiments/computational-batches/batch-002/batch-002-plan.md`
* `research/batch-003-plan.md` $\to$ `experiments/computational-batches/batch-003/batch-003-plan.md`
* `research/batch-004-plan.md` $\to$ `experiments/computational-batches/batch-004/batch-004-plan.md`
* `research/batch-005-plan.md` $\to$ `experiments/computational-batches/batch-005/batch-005-plan.md`
* `research/specs/batch-003.md` $\to$ `experiments/computational-batches/batch-003/batch-003-spec.md`
* `research/specs/batch-005.md` $\to$ `experiments/computational-batches/batch-005/batch-005-spec.md`
* `research/experiments/batch-002/predictions.md` $\to$ `experiments/computational-batches/batch-002/predictions.md`
* `research/results/batch-001.json` $\to$ `experiments/computational-batches/batch-001/batch-001.json`
* `research/takt-theoretical-revision-v1.0.md` $\to$ `docs/05-archives/takt-theoretical-revision-v1.0.md`
* `research/takt-theoretical-revision-v2.0-omega.md` $\to$ `docs/05-archives/takt-theoretical-revision-v2.0-omega.md`
* `research/takt-theoretical-revision-v2.1-results.md` $\to$ `docs/05-archives/takt-theoretical-revision-v2.1-results.md`
* `research/cases/CASE-001/` through `CASE-005/` $\to$ `experiments/case-studies/CASE-001/` through `CASE-005/`
* `research/data/batch-002/` $\to$ `experiments/computational-batches/batch-002/data/`
* `research/data/batch-003/` $\to$ `experiments/computational-batches/batch-003/data/`
* `research/data/batch-004/` $\to$ `experiments/computational-batches/batch-004/data/`

---

## 4. Code Reference Adjustments

The TypeScript files inside `cli/src/` containing hardcoded paths referencing the `research/` directory must be adjusted to use clean path abstractions.

Instead of hardcoding batch paths, define a path resolver:

```ts
const batchesDir = join(rootDir, 'experiments', 'computational-batches');
const batchDir = join(batchesDir, batchId);
```

This ensures that evaluating new batches (e.g. `batch-025`) can be done dynamically without code changes.

---

## 5. Pre- and Post-Migration Reference Audits

We will use global grep searches before and after restructuring to ensure no dangling or outdated path references remain.

### 5.1 Before Move
Run audit:
```bash
rg "research/" .
rg "docs/research"
rg "D-001/implementation"
```
Record the results to cross-check.

### 5.2 After Move
Run the same audit:
```bash
rg "research/" .
rg "docs/research"
rg "D-001/implementation"
```
* **Expected Result:** Zero active references to these directories, except historical references explicitly preserved within archived files.

---

## 6. Precursor Context for `omega-formalism-v0.1.md`

To ensure `omega-formalism-v0.1.md` is understood as a vital precursor connecting EVSI to current observability and governed contraction (rather than a dead or abandoned file), a note will be added to the root `README.md` and `docs/01-foundations/` explaining its role:

> **Historical Precursor:**
> * `docs/05-archives/omega-formalism-v0.1.md` — Precursor to the current observability framework, outlining the transition from EVSI to governed representational contraction.

---

## 7. Root README.md Realignment

The root `README.md` will be updated to document the new structure:
* **Theory Directory** (`docs/01-foundations/`, `docs/02-theoretical-positioning/`, `docs/03-design-contracts/`).
* **Validation & Reproduction Evidence** (`experiments/stress-tests/`, `experiments/computational-batches/`).
* **Lean Formal Proofs** (`takt-formal/TaktFormal/`).
* **CLI Execution** (`cli/`).

---

## 8. Verification & Structure Auditing

Post-migration, we will run the following structure audit commands:
* Check folder hierarchy:
  ```bash
  find . -maxdepth 2 -type d | sort
  ```
* Verify JSON results remain intact:
  ```bash
  find experiments/computational-batches -name "*.json"
  ```
* Execute Vitest tests:
  ```bash
  npx vitest run
  ```
* Build Lean formal proofs:
  ```bash
  cd takt-formal && lake build
  ```
