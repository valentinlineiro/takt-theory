# Phase E Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor RT002, RT003, and RT004 Lean files to formally verify structural margin, policy alignment collapse, and audited contract evasion, then verify with `lake build` and Vitest.

**Architecture:** We will use the existing `SafetyContract`, `decisionMargin`, `fiber_coverage` and other structures from TaktFormal to instantiate the respective scenarios and write complete proofs in Lean 4.

**Tech Stack:** Lean 4 (Lake build), Vitest

## Global Constraints
- Do not introduce compilation errors in the Lean package.
- All 99 Vitest tests must pass.

---

### Task 1: Refactor RT002 to verify static margin satisfaction and dynamic class boundary crossing

**Files:**
- Modify: `takt-formal/TaktFormal/RT002.lean`

**Interfaces:**
- Consumes: `decisionMargin` from `TaktFormal.DecisionMargin`
- Produces: `rt002_margin_satisfied` and `rt002_transition_crosses_classes` theorems

- [ ] **Step 1: Replace RT002.lean content with updated Lean proofs**
- [ ] **Step 2: Run lake build to verify Task 1 compilation**
  Run: `cd takt-formal && lake build`
  Expected: Successful compilation of RT002

---

### Task 2: Refactor RT003 to instantiate a concrete SafetyContract and show exogenous alignment failure

**Files:**
- Modify: `takt-formal/TaktFormal/RT003.lean`

**Interfaces:**
- Consumes: `SafetyContract`, `fiber_coverage`, `decisionMargin`
- Produces: `c_bad` contract, `rt003_coverage_satisfied`, `rt003_margin_satisfied`, `rt003_alignment_failed` theorems

- [ ] **Step 1: Replace RT003.lean content with concrete SafetyContract and proofs**
- [ ] **Step 2: Run lake build to verify Task 2 compilation**
  Run: `cd takt-formal && lake build`
  Expected: Successful compilation of RT003

---

### Task 3: Refactor RT004 to build a contract on an audited subset and prove evasion on an out-of-subset state

**Files:**
- Modify: `takt-formal/TaktFormal/RT004.lean`

**Interfaces:**
- Consumes: `SafetyContract`, `contract_satisfied`
- Produces: `c_audit` contract, `rt004_success` theorem

- [ ] **Step 1: Replace RT004.lean content with audited/real space structures and proofs**
- [ ] **Step 2: Run lake build to verify Task 3 compilation**
  Run: `cd takt-formal && lake build`
  Expected: Successful compilation of RT004

---

### Task 4: Verify entire suite and write report

**Files:**
- Modify: `/home/valentin/code/takt-theory/.superpowers/sdd/task-4-report.md`

- [ ] **Step 1: Run full vitest run**
  Run: `npx vitest run`
  Expected: All 99 tests pass
- [ ] **Step 2: Append report to `/home/valentin/code/takt-theory/.superpowers/sdd/task-4-report.md`**
