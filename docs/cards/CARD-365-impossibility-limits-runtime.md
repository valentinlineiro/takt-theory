# CARD-365: Impossibility & Limits Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.7 Theory ([2026-07-23-phase-4c7-impossibility-limits-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c7-impossibility-limits-design.md)), Lean 4 Proofs ([TaktFormal/ImpossibilityLimits.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/ImpossibilityLimits.lean)).

---

## 1. Context & Goal

Phase IV-C.7 established the mathematical framework for Impossibility & Limits Theory (Unreachability Frontiers, Non-Approximability Barriers, Soundness Barriers, and Fundamental Impossibility Boundaries) and proved the 4 core impossibility theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.7 and implements executable impossibility evaluators, non-approximability detectors, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/impossibility.ts`)

- **Class `ImpossibilityLimits`:**
  - `isUnreachable(detector, target, providers)`: empty provider & path solver.
  - `isNonApproximable(detector, requiredEpsilon, providers)`: saturation check.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-012/`)

- **Batch F-012 Scenarios:**
  - Empirical evaluation of unreachability frontiers and non-approximability thresholds.

---

## 3. Definition of Done

1. `cli/src/takt-core/impossibility.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/impossibility.test.ts` pass via `npx vitest run`.
3. `batch-f-012` implemented and passing via `npx vitest run cli/src/batch-f-012`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
