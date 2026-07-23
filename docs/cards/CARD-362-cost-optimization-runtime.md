# CARD-362: Cost Optimization & EVSI Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.4 Theory ([2026-07-23-phase-4c4-cost-optimization-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c4-cost-optimization-design.md)), Lean 4 Proofs ([TaktFormal/CostOptimization.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/CostOptimization.lean)).

---

## 1. Context & Goal

Phase IV-C.4 established the mathematical framework for Cost Optimization & EVSI Theory (Trajectory Cost $C(\pi)$, Governance EVSI, Optimal Trajectory $\pi^*$, Rational EVSI Stopping Criterion) and proved the 4 core optimization theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.4 and implements executable cost minimization, EVSI planners, rational stopping evaluators, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/optimizer.ts`)

- **Class `CostOptimization`:**
  - `computePathCost(trajectory, initialDetector)`: total trajectory cost $C(\pi)$.
  - `computeEVSI(detector, enrichment)`: EVSI calculator.
  - `shouldStopRationally(detector, availableEnrichments)`: rational stopping evaluator.
  - `findOptimalTrajectory(initial, target, providers)`: $\pi^*$ search solver.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-009/`)

- **Batch F-009 Scenarios:**
  - Empirical evaluation of optimal path search ($\pi^* = \arg\min C(\pi)$).
  - Empirical evaluation of rational EVSI stopping ($EVSI \le C_{\text{acq}}$).

---

## 3. Definition of Done

1. `cli/src/takt-core/optimizer.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/optimizer.test.ts` pass via `npx vitest run`.
3. `batch-f-009` implemented and passing via `npx vitest run cli/src/batch-f-009`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
