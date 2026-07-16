# TAKT Research Structure Consolidation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the TAKT repository structure into a clean, unified portal by moving documents and results using `git mv`, repairing code and markdown references, and validating the final state via tests and compilers.

**Architecture:** A semantic separation into functional directories: stable theory (`docs/`), reproducible results and stress tests (`experiments/`), mathematical proofs (`takt-formal/`), and cli runners (`cli/`).

**Tech Stack:** Bash, TypeScript (Vitest), Lean 4, Git.

## Global Constraints
- Preserve git history for all versioned files using `git mv`.
- Consolidate all Lean proof files in `takt-formal/TaktFormal/` and remove duplicate implementations in `docs/research/`.
- Abstain from modifying the text content of migrated files except for adjusting relative path references.
- All testing cycles must pass before a task is considered done.

---

### Task 1: Freeze Current State
**Files:**
- Modify: `README.md`
**Interfaces:** None.

- [ ] **Step 1: Check git status to ensure tree is clean**
  Run: `git status`
  Expected: "nothing to commit, working tree clean" (except for any unstaged plans)
- [ ] **Step 2: Create a local git tag to freeze the pre-migration state**
  Run: `git tag pre-migration-freeze`
- [ ] **Step 3: Run pre-migration global reference audit**
  Run: `rg "research/" .` and `rg "docs/research"` and `rg "D-001/implementation"`
  Expected: Print list of references and verify they match the expected baseline.
- [ ] **Step 4: Commit tag to git**
  Run: `git push origin pre-migration-freeze` (or ignore if no remote push permissions, local tag is sufficient)

---

### Task 2: Structural Documentation Migration
**Files:**
- Create: `docs/01-foundations/`
- Create: `docs/02-theoretical-positioning/`
- Create: `docs/03-design-contracts/`
- Create: `docs/04-academic-paper/`
- Create: `docs/05-archives/`
- Create: `docs/superpowers/plans/` (already exists)
**Interfaces:** None.

- [ ] **Step 1: Create target documentation directories**
  Run: `mkdir -p docs/01-foundations docs/02-theoretical-positioning docs/03-design-contracts docs/04-academic-paper docs/05-archives`
- [ ] **Step 2: Migrate theory documents from `docs/01-foundations/` to `docs/01-foundations/` using `git mv`**
  Run:
  ```bash
  git mv docs/01-foundations/what-takt-is.md docs/01-foundations/what-takt-is.md
  git mv docs/01-foundations/takt-specification-v3.md docs/01-foundations/takt-specification-v3.md
  git mv docs/01-foundations/takt-formal-foundations-v1.md docs/01-foundations/takt-formal-foundations-v1.md
  git mv docs/01-foundations/takt-theoretical-revision-v3.md docs/01-foundations/takt-theoretical-revision-v3.md
  git mv docs/01-foundations/reference-implementation-guide.md docs/01-foundations/reference-implementation-guide.md
  ```
- [ ] **Step 3: Remove the now-empty `docs/01-foundations/` directory**
  Run: `rm -rf docs/theory`
- [ ] **Step 4: Migrate novelty audit and positioning files from `docs/research/` to `docs/02-theoretical-positioning/`**
  Run:
  ```bash
  git mv docs/02-theoretical-positioning/novelty-audit.md docs/02-theoretical-positioning/novelty-audit.md
  git mv docs/research/novelty docs/02-theoretical-positioning/novelty
  ```
- [ ] **Step 5: Migrate design contract milestones from `docs/research/` to `docs/03-design-contracts/`**
  Run:
  ```bash
  git mv docs/03-design-contracts/D-001/formalization.md docs/03-design-contracts/D-001/formalization.md
  git mv docs/03-design-contracts/D-002/formalization.md docs/03-design-contracts/D-002/formalization.md
  git mv docs/03-design-contracts/D-003/formalization.md docs/03-design-contracts/D-003/formalization.md
  ```
- [ ] **Step 6: Delete the duplicate Lean files under `docs/03-design-contracts/D-00x/implementation/` and remove empty dirs**
  Run: `git rm -r docs/03-design-contracts/D-001/implementation docs/03-design-contracts/D-002/implementation docs/03-design-contracts/D-003/implementation` and remove parent empty folders.
- [ ] **Step 7: Migrate academic paper files to `docs/04-academic-paper/`**
  Run:
  ```bash
  git mv docs/04-academic-paper/paper-draft-v1.md docs/04-academic-paper/paper-draft-v1.md
  git mv docs/04-academic-paper/bibliography.md docs/04-academic-paper/bibliography.md
  ```
- [ ] **Step 8: Migrate freeze archives and historical revisions to `docs/05-archives/`**
  Run:
  ```bash
  git mv docs/05-archives/phase-b-freeze.md docs/05-archives/phase-b-freeze.md
  git mv docs/05-archives/phase-c-freeze.md docs/05-archives/phase-c-freeze.md
  git mv docs/05-archives/phase-d-freeze.md docs/05-archives/phase-d-freeze.md
  git mv docs/05-archives/phase-evolution-freeze-v3.md docs/05-archives/phase-evolution-freeze-v3.md
  git mv research/takt-theoretical-revision-v1.0.md docs/05-archives/takt-theoretical-revision-v1.0.md
  git mv docs/05-archives/takt-theoretical-revision-v2.0-omega.md docs/05-archives/takt-theoretical-revision-v2.0-omega.md
  git mv research/takt-theoretical-revision-v2.1-results.md docs/05-archives/takt-theoretical-revision-v2.1-results.md
  git mv docs/05-archives/omega-formalism-v0.1.md docs/05-archives/omega-formalism-v0.1.md
  ```
- [ ] **Step 9: Remove now-empty `docs/research/` directory**
  Run: `rm -rf docs/research`
- [ ] **Step 10: Commit phase 2 documentation migration**
  Run: `git commit -m "refactor(docs): migrate documentation to structured categories"`

---

### Task 3: Structural Experiments Migration
**Files:**
- Create: `experiments/stress-tests/`
- Create: `experiments/case-studies/`
- Create: `experiments/computational-batches/`
**Interfaces:** None.

- [ ] **Step 1: Create target experiment folders**
  Run: `mkdir -p experiments/stress-tests experiments/case-studies experiments/computational-batches`
- [ ] **Step 2: Move root stress tests ST-001 through ST-007 to `experiments/stress-tests/`**
  Run:
  ```bash
  git mv experiments/stress-tests/ST-001 experiments/stress-tests/ST-001
  git mv experiments/stress-tests/ST-002 experiments/stress-tests/ST-002
  git mv experiments/stress-tests/ST-003 experiments/stress-tests/ST-003
  git mv experiments/stress-tests/ST-004 experiments/stress-tests/ST-004
  git mv experiments/stress-tests/ST-005 experiments/stress-tests/ST-005
  git mv experiments/stress-tests/ST-006 experiments/stress-tests/ST-006
  git mv experiments/stress-tests/ST-007 experiments/stress-tests/ST-007
  ```
- [ ] **Step 3: Move cases study folder CASE-001 through CASE-005**
  Run: `git mv experiments/case-studies experiments/case-studies` (renaming case-studies/cases to case-studies/ is handled by `git mv experiments/case-studies experiments/case-studies`)
- [ ] **Step 4: Create individual batch subfolders and move batch analysis, specs, data, results to `experiments/computational-batches/batch-XXX/`**
  Run:
  * For batch-001:
    ```bash
    mkdir -p experiments/computational-batches/batch-001
    git mv experiments/computational-batches/batch-001/batch-001.md experiments/computational-batches/batch-001/batch-001.md
    git mv research/results/batch-001.json experiments/computational-batches/batch-001/batch-001.json
    ```
  * For batch-002:
    ```bash
    mkdir -p experiments/computational-batches/batch-002
    git mv experiments/computational-batches/batch-002/batch-002.md experiments/computational-batches/batch-002/batch-002.md
    git mv research/batch-002-design.md experiments/computational-batches/batch-002/batch-002-design.md
    git mv research/batch-002-plan.md experiments/computational-batches/batch-002/batch-002-plan.md
    git mv research/data/batch-002 experiments/computational-batches/batch-002/data
    git mv research/experiments/batch-002/predictions.md experiments/computational-batches/batch-002/predictions.md
    ```
  * For batch-003:
    ```bash
    mkdir -p experiments/computational-batches/batch-003
    git mv experiments/computational-batches/batch-003/batch-003.md experiments/computational-batches/batch-003/batch-003.md
    git mv research/batch-003-plan.md experiments/computational-batches/batch-003/batch-003-plan.md
    git mv research/specs/batch-003.md experiments/computational-batches/batch-003/batch-003-spec.md
    git mv research/data/batch-003 experiments/computational-batches/batch-003/data
    ```
  * For batch-004:
    ```bash
    mkdir -p experiments/computational-batches/batch-004
    git mv experiments/computational-batches/batch-004/batch-004.md experiments/computational-batches/batch-004/batch-004.md
    git mv research/batch-004-plan.md experiments/computational-batches/batch-004/batch-004-plan.md
    git mv research/data/batch-004 experiments/computational-batches/batch-004/data
    ```
  * For batch-005:
    ```bash
    mkdir -p experiments/computational-batches/batch-005
    git mv experiments/computational-batches/batch-005/batch-005.md experiments/computational-batches/batch-005/batch-005.md
    git mv research/batch-005-plan.md experiments/computational-batches/batch-005/batch-005-plan.md
    git mv research/specs/batch-005.md experiments/computational-batches/batch-005/batch-005-spec.md
    ```
  * For batches 008 to 024 (excluding 0091):
    Write a loop/command sequence to create directories and git mv:
    ```bash
    for b in 008 009 010 011 012 013 014 015 016 017 018 019 020 021 022 023 024; do
      mkdir -p experiments/computational-batches/batch-$b
      git mv experiments/computational-batches/batch-$b-* experiments/computational-batches/batch-$b/
    done
    ```
  * For batch-0091:
    ```bash
    mkdir -p experiments/computational-batches/batch-0091
    git mv experiments/computational-batches/batch-0091-* experiments/computational-batches/batch-0091/
    ```
- [ ] **Step 5: Move general reports and fixtures**
  Run:
  ```bash
  git mv research/analysis/fixture-semantic-contract.md experiments/computational-batches/fixture-semantic-contract.md
  git mv research/analysis/takt-synthesis-report.md experiments/computational-batches/takt-synthesis-report.md
  ```
- [ ] **Step 6: Clean up empty source directories in `research/` and `experiments/`**
  Run: `rm -rf research/analysis research/data research/experiments research/results research/specs`
- [ ] **Step 7: Commit phase 3 structural experiments migration**
  Run: `git commit -m "refactor(experiments): migrate batches, cases, and stress tests to experiments directory"`

---

### Task 4: Code & Documentation Reference Repair
**Files:**
- Modify: `cli/src/batch-*/evaluate.ts`
- Modify: `cli/src/batch-*/eval.test.ts`
- Modify: `README.md`
- Modify: `docs/01-foundations/what-takt-is.md` and other moved docs containing relative links.
**Interfaces:**
- CLI code path resolution updates.

- [ ] **Step 1: Refactor path resolution in `cli/src/batch-*/evaluate.ts`**
  Refactor each batch evaluation script to use:
  ```ts
  const batchesDir = join(rootDir, 'experiments', 'computational-batches');
  const batchDir = join(batchesDir, batchId);
  ```
  Specifically update the target write paths from `join(rootDir, 'research', 'analysis')` to `join(batchesDir, batchId)`.
- [ ] **Step 2: Update read/write data paths in `cli/src/batch-*/evaluate.ts` and `cli/src/batch-*/eval.test.ts`**
  Specifically update read/write paths for predictions and results from `research/data/batch-XXX/` to `experiments/computational-batches/batch-XXX/data/`.
- [ ] **Step 3: Update root `README.md`**
  Rewrite structure overview section, validation commands, Lean compile guidelines, and append the Omega Precursor note:
  > **Historical Precursor:**
  > * `docs/05-archives/omega-formalism-v0.1.md` — Precursor to the current observability framework, outlining the transition from EVSI to governed representational contraction.
- [ ] **Step 4: Repair broken relative markdown links in `docs/` and `experiments/`**
  Search for references to `docs/research/`, `docs/01-foundations/`, and `research/` in all markdown files and update them to the new paths.
- [ ] **Step 5: Commit phase 4 reference repair**
  Run: `git commit -a -m "refactor(repo): repair path references in CLI and Markdown links"`

---

### Task 5: Post-Migration Validation & Clean Audit
**Files:** None.
**Interfaces:** None.

- [ ] **Step 1: Run global reference audit to ensure no dangling references**
  Run: `rg "research/" .` and `rg "docs/research"` and `rg "D-001/implementation"`
  Expected: Zero active reference occurrences (except explicitly in archives or design spec documentation).
- [ ] **Step 2: Verify the target directory structure**
  Run: `find . -maxdepth 2 -type d | sort`
  Expected: Matches the target Approach A taxonomy.
- [ ] **Step 3: Verify JSON result files are intact**
  Run: `find experiments/computational-batches -name "*.json"` and `find experiments/computational-batches -name "*.jsonl"`
  Expected: Lists the migrated predictions/results files.
- [ ] **Step 4: Execute CLI evaluation suite**
  Run: `npx vitest run`
  Expected: All 95 tests pass successfully.
- [ ] **Step 5: Re-compile Lean 4 formal proofs**
  Run: `cd takt-formal && lake build`
  Expected: Compilation completes with no errors or warnings (except allowed default unnecessarySimpa/constructorNameAsVariable warnings).
- [ ] **Step 6: Tag final consolidated release**
  Run: `git tag post-migration-complete`
- [ ] **Step 7: Push tag to origin**
  Run: `git push origin post-migration-complete` (if permissions allow)
