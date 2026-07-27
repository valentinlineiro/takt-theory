# CARD-363: Approximate Governance Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.5 Theory ([2026-07-23-phase-4c5-approximate-governance-design.md](docs/2026-07-23-phase-4c5-approximate-governance-design.md)), Lean 4 Proofs ([TaktFormal/ApproximateGovernance.lean](takt-formal/TaktFormal/ApproximateGovernance.lean)).

---

## 1. Context & Goal

Phase IV-C.5 established the mathematical framework for Approximate Governance ($\epsilon$-Governance predicate $Gov_{\epsilon}(D)$, saturation bound $\epsilon^*$, decision regret upper bounds) and proved the 4 core approximate governance theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.5 and implements executable $\epsilon$-governance verifiers, saturation bound solvers, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/epsilon-governance.ts`)

- **Class `EpsilonGovernance`:**
  - `isEpsilonGoverned(detector, epsilon)`: verifier for $\delta(D) \le \epsilon$.
  - `computeSaturationBound(initial, providers)`: $\epsilon^*$ saturation solver.
  - `findEpsilonOptimalDetector(initial, providers)`: $\epsilon^*$-optimal detector search.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-010/`)

- **Batch F-010 Scenarios:**
  - Empirical evaluation of $\epsilon$-governance tolerance bounds and saturation limits.

---

## 3. Definition of Done

1. `cli/src/takt-core/epsilon-governance.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/epsilon-governance.test.ts` pass via `npx vitest run`.
3. `batch-f-010` implemented and passing via `npx vitest run cli/src/batch-f-010`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
