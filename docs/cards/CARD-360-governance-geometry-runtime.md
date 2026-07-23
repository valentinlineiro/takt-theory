# CARD-360: Governance Geometry Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.2 Theory ([2026-07-23-phase-4c2-governance-geometry-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c2-governance-geometry-design.md)), Lean 4 Proofs ([TaktFormal/GovernanceGeometry.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/GovernanceGeometry.lean)).

---

## 1. Context & Goal

Phase IV-C.2 established the mathematical framework for Governance Geometry (Dual Distance structure $d_{\rightarrow}, d_{\equiv}$, perfection distance functional $\delta(D)$) and proved the 4 core geometry theorems in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.2 and implements executable geometry metrics and empirical distance validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/geometry.ts`)

- **Class `GovernanceGeometry`:**
  - `directedDistance(d1, d2, providers)`: minimum path length under registered providers.
  - `equivalenceDistance(d1, d2)`: symmetric difference size of capabilities $|C(D_1) \Delta C(D_2)|$.
  - `distanceToPerfection(d, d_top, providers)`: quantitative magnitude $\delta(D)$.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-007/`)

- **Batch F-007 Scenarios:**
  - Empirical evaluation of distance reduction under sequential enrichments.
  - Verification of perfection distance characterization ($\delta(D) = 0 \iff D \equiv_{\text{gov}} D_{\text{top}}$).

---

## 3. Definition of Done

1. `cli/src/takt-core/geometry.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/geometry.test.ts` pass via `npx vitest run`.
3. `batch-f-007` implemented and passing via `npx vitest run cli/src/batch-f-007`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
