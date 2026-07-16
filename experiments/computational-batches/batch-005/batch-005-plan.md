# Batch-005 Boundary Identifiability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Boundary Capability Signatures, Decision Sensitivity calculations, the 5 triplets (15 cases total), the three baseline models, and the evaluation runner subcommand `eval-batch-005`.

**Architecture:** A standalone TypeScript module under `cli/src/batch-005/` containing:
- Capability signatures and decision sensitivity overlap logic.
- The 15 triplet cases data definitions.
- The baseline models decision loop.
- The comparison report generator and CLI command router integration.

**Tech Stack:** TypeScript, Node.js, Vitest (testing)

## Global Constraints
- Target Node version constraint is Node 24.
- No external runtime dependencies; use standard library and existing `@takt/cli` test tools.
- All algorithms must be implemented from scratch.

---

### Task 1: Capability Signatures and Sensitivity Estimator
**Files:**
- Create: `cli/src/batch-005/estimator.ts`
- Create: `cli/src/batch-005/estimator.test.ts`

**Interfaces:**
- Produces: `computeDecisionSensitivity(competitive: SelectedIntervention[], O_k: ObservableSubgraph): CapabilityBitmask`
- Produces: `computeDecisionRelevantUncertainty(O_k: ObservableSubgraph, f: string, D_k: CapabilityBitmask): 0 | 1`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-005/estimator.test.ts` to assert that when a boundary has non-overlapping capabilities, $\hat{DRU}_1 = 0$, and when it has overlapping capabilities, $\hat{DRU}_1 = 1$.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement $M_k(v)$ representation.
  - Implement $DecisionSensitivity$ by assessing if unobserved capabilities could change the ranking among competitive candidates.
  - Implement intersection check $D_k \cap M_k(v) \neq \varnothing$.
  - Return $\hat{DRU}_k = 1$ if there exists $v \in \partial S_k$ such that $Relevant_k(v, f) \land (D_k \cap M_k(v) \neq \varnothing)$, otherwise $0$.
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Triplets Case Matrix (15 Cases / 5 Triplets)
**Files:**
- Create: `cli/src/batch-005/cases.ts`
- Create: `cli/src/batch-005/cases.test.ts`

**Interfaces:**
- Produces: `loadBatch005Cases(): CaseData[]`
- Produces: `solveCaseOracle(caseData: CaseData, intervention: SelectedIntervention): { g: number; e: number; risk: number; utility: number }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-005/cases.test.ts` to assert that the 15 cases are grouped into 5 triplets, where the local structures $O_1^{\text{struct}}$ are identical within each triplet, but the boundary capabilities $M_1(v)$ vary to yield Case A (Stop), Case B (Expand), and Case C (Escalate).
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Encode 5 triplets (15 cases total) across Dependency Graph, Workflow System, and Resource Contention Graph families.
  - Implement global expected utility solvers for each family.
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Decision Loop and Baselines
**Files:**
- Create: `cli/src/batch-005/baselines.ts`
- Create: `cli/src/batch-005/baselines.test.ts`

**Interfaces:**
- Produces: `runBaselineLocal(caseData: CaseData): SelectedIntervention`
- Produces: `runBaselineGlobal(caseData: CaseData): SelectedIntervention`
- Produces: `runBaselineAdaptive(caseData: CaseData, kMax: number): { intervention: SelectedIntervention; kActual: number; finishedUcert: 0 | 1 }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-005/baselines.test.ts` verifying early termination for Case A at $k=1$, local termination for Case B at $k=2$, and global escalation for Case C at $k_{\max}=2$.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement Baseline A (always halts at $k=1$).
  - Implement Baseline B (always runs global solver).
  - Implement Baseline C (adaptive escalation loop using $\hat{DRU}_k$).
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 4: Scorecard Evaluation and CLI Subcommand
**Files:**
- Create: `cli/src/batch-005/eval.ts`
- Create: `cli/src/batch-005/evaluate.ts`
- Modify: `cli/src/cli.ts`

**Interfaces:**
- Produces: `eval-batch-005` subcommand running the scorecard comparisons and updating the analysis report.

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-005/eval.test.ts` asserting OIA, DOR, SE, EER, ER, EP, UER, CVG, and UER Reduction calculations.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement evaluation metric formulas including Capability Value Gain (CVG) and UER Reduction comparing Adaptive Escalation against the Batch-004 structural-only baseline results.
  - Write output comparison report to `experiments/computational-batches/batch-005/batch-005.md`.
  - Integrate subcommand `eval-batch-005` in `cli/src/cli.ts`.
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit and clean up workspace**
