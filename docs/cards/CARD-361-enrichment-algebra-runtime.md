# CARD-361: Enrichment Algebra Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.3 Theory ([2026-07-23-phase-4c3-enrichment-algebra-design.md](docs/2026-07-23-phase-4c3-enrichment-algebra-design.md)), Lean 4 Proofs ([TaktFormal/EnrichmentAlgebra.lean](takt-formal/TaktFormal/EnrichmentAlgebra.lean)).

---

## 1. Context & Goal

Phase IV-C.3 established the mathematical framework for Enrichment Algebra (Monoid $(\mathcal{E}, \circ, E_{\text{id}})$, refinement order $\preceq_E$, join operator $\vee_E$) and proved the 4 core algebraic theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.3 and implements executable composition, join operators, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/algebra.ts`)

- **Class `EnrichmentAlgebra`:**
  - `compose(e1, e2)`: sequential composition operator.
  - `join(e1, e2)`: capability combination operator.
  - `isSubsumed(e1, e2)`: refinement order check.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-008/`)

- **Batch F-008 Scenarios:**
  - Empirical evaluation of composition associativity and join capability preservation.

---

## 3. Definition of Done

1. `cli/src/takt-core/algebra.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/algebra.test.ts` pass via `npx vitest run`.
3. `batch-f-008` implemented and passing via `npx vitest run cli/src/batch-f-008`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
