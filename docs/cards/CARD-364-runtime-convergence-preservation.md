# CARD-364: Runtime Convergence & Contract Preservation Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.6 Theory ([2026-07-23-phase-4c6-runtime-convergence-design.md](docs/2026-07-23-phase-4c6-runtime-convergence-design.md)), Lean 4 Proofs ([TaktFormal/RuntimeConvergence.lean](takt-formal/TaktFormal/RuntimeConvergence.lean)).

---

## 1. Context & Goal

Phase IV-C.6 established the mathematical framework for Runtime Convergence & Contract Preservation (Online Prefix Stream Monitors, Runtime Soundness Preservation Invariants, $\epsilon$-Runtime Safety Equivalence) and proved the 4 core runtime theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.6 and implements executable online stream verifiers, incremental event monitors, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/runtime/stream-monitor.ts`)

- **Class `RuntimeConvergence`:**
  - `verifyOnline(streamPrefix, detector)`: online trace compliance verifier.
  - `verifyRuntimeEvolution(detector, enrichment, streamPrefix)`: evolution stream monitor.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-011/`)

- **Batch F-011 Scenarios:**
  - Empirical evaluation of online prefix trace compliance and contract preservation under event streams.

---

## 3. Definition of Done

1. `cli/src/runtime/stream-monitor.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/runtime/stream-monitor.test.ts` pass via `npx vitest run`.
3. `batch-f-011` implemented and passing via `npx vitest run cli/src/batch-f-011`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
