# Batch-004 Selective Escalation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Selective Escalation protocol, the three baseline execution models (Pure Local, Always Global, Adaptive), the 15-case dataset representing the three categorization groups, and the evaluation runner CLI subcommand for Batch-004.

**Architecture:** A standalone TypeScript module under `cli/src/batch-004/` containing:
- Graph neighborhood extraction and boundary metadata tracking.
- Epistemological uncertainty estimator $\hat{I}_k$.
- Baseline models execution runner.
- The 15 cases data definitions.
- The comparison report generator and CLI command router integration.

**Tech Stack:** TypeScript, Node.js, Vitest (testing)

## Global Constraints
- Target Node version constraint is Node 24.
- No external runtime dependencies; use standard library and existing `@takt/cli` test tools.
- All algorithms must be implemented from scratch.

---

### Task 1: Observable Subgraph and $\hat{I}_k$ Estimator
**Files:**
- Create: `cli/src/batch-004/estimator.ts`
- Create: `cli/src/batch-004/estimator.test.ts`

**Interfaces:**
- Produces: `extractObservableSubgraph(S: GlobalGraph, f: string, k: number): ObservableSubgraph`
- Produces: `computeProxyUncertainty(O_k: ObservableSubgraph, f: string): 0 | 1`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-004/estimator.test.ts` to assert that for a graph with truncated boundaries at $k=1$, $\hat{I}_1 = 1$, and once boundaries are fully enclosed at $k=2$, $\hat{I}_2 = 0$.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement $S_k$ extraction by traversing $k$ hops from element $f$.
  - Implement boundary connectivity $\Gamma_k(v) = \mathbb{I}[\deg_S(v) > \deg_{S_k}(v)]$.
  - Implement relevance check $Relevant_k(v, f)$ checking if $v$ is connected to $f$ via directed path within $S_k$.
  - Return $\hat{I}_k = 1$ if there exists $v \in \partial S_k$ such that $\Gamma_k(v) = 1 \land Relevant_k(v, f)$, otherwise $0$.
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Adaptive Decision Loop and Baselines
**Files:**
- Create: `cli/src/batch-004/baselines.ts`
- Create: `cli/src/batch-004/baselines.test.ts`

**Interfaces:**
- Produces: `runBaselineLocal(caseData: CaseData): SelectedIntervention`
- Produces: `runBaselineGlobal(caseData: CaseData): SelectedIntervention`
- Produces: `runBaselineAdaptive(caseData: CaseData, kMax: number): { intervention: SelectedIntervention; kActual: number; finishedUcert: 0 | 1 }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-004/baselines.test.ts` verifying that the three baselines terminate with correct halted depth and choice on mock systems.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement Baseline A (decides at $k=1$).
  - Implement Baseline B (accesses global graph directly, returns optimal $T^*$).
  - Implement Baseline C decision loop:
    - Expand $k$ from $1$ to $k_{\max}$.
    - Compute $\hat{I}_k$.
    - If $\hat{I}_k = 0$, stop and return local decision.
    - If $\hat{I}_k = 1 \land k = k_{\max}$, escalate (return optimal global candidate $T^*$).
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Case Matrix (15 Cases) and Oracles
**Files:**
- Create: `cli/src/batch-004/cases.ts`
- Create: `cli/src/batch-004/cases.test.ts`

**Interfaces:**
- Produces: `loadBatch004Cases(): CaseData[]`
- Produces: `solveCaseOracle(caseData: CaseData, intervention: SelectedIntervention): { g: number; e: number; risk: number; utility: number }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-004/cases.test.ts` to assert that the 15 cases are correctly loaded and classified under the three category groups:
  - **H₁-sufficient** (8 cases)
  - **Expansion-resolvable** (4 cases)
  - **External-resolution-required** (3 cases)
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Encode all 15 cases (5 DEP, 5 WRK, 5 RES).
  - Implement expected-utility solvers for Dependency Graph (disjoint path connectivity, boundary propagation risk), Workflow System (rollback caching, success rates), and Resource System (contention load crash risk).
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 4: Scorecard Evaluation and CLI Subcommand
**Files:**
- Create: `cli/src/batch-004/eval.ts`
- Create: `cli/src/batch-004/evaluate.ts`
- Modify: `cli/src/cli.ts`

**Interfaces:**
- Produces: `eval-batch-004` subcommand running the entire comparative evaluation and updating the markdown report.

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-004/eval.test.ts` checking OIA, DOR, Search Effort ($SE$), EER, ER, EP, and UER calculations on mock results.
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
  - Implement evaluation metric formulas:
    - $NeedExpand(c) = \mathbb{I}[T^*_{H_1}(c) \neq T^*_{Global}(c)]$
    - $SE = \frac{|V_{H_{K_{\text{actual}}}}| + |E_{H_{K_{\text{actual}}}}|}{|V_S| + |E_S|}$
    - $EER = \frac{\# \text{external escalations}}{N}$
    - $ER = \frac{|\{c : NeedExpand(c)=1 \land K_{\text{actual}} > 1\}|}{|\{c : NeedExpand(c)=1\}|}$
    - $EP = \frac{TP_{\text{escalation}}}{TP_{\text{escalation}} + FP_{\text{escalation}}}$
    - $UER = \frac{|\{c : NeedExpand(c)=0 \land K_{\text{actual}} > 1\}|}{|\{c : NeedExpand(c)=0\}|}$
  - Write output comparison to `experiments/computational-batches/batch-004/batch-004.md`.
  - Integrate subcommand `eval-batch-004` in `cli/src/cli.ts`.
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit and clean up workspace**
