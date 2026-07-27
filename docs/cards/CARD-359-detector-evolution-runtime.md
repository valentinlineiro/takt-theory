# CARD-359: Detector Evolution Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.1 Theory ([2026-07-23-phase-4c-governed-convergence-design.md](docs/2026-07-23-phase-4c-governed-convergence-design.md)), Lean 4 Proofs ([TaktFormal/DetectorEvolution.lean](takt-formal/TaktFormal/DetectorEvolution.lean)).

---

## 1. Context & Goal

Phase IV-C.1 established the mathematical framework for Detector Evolution ($\mathcal{G}_D, \Phi$, 5 Core Invariants, Theorem 5.1 Abstract Reachability) and proved it in Lean 4 without `sorry`s.

This CARD defines the **runtime implementation item** to be executed by a runtime agent. It consumes the frozen formal contracts of Phase IV-C.1 and implements executable state transitions, reachability solving, and empirical validation.

---

## 2. Technical Scope

### 2.1 Kernel Contracts (`cli/src/takt-core/evolution.ts`)

- **Interfaces & Types:**
  - `Detector`: immutable state struct (`id`, `isSound`, `capabilities`, `progressMeasure`).
  - `Enrichment`: transformation descriptor (`id`, `targetCapability`, `preservesSoundness`).
  - `EvolutionEngine`: external operator interface executing $\Phi(D, E)$.
- **Class `DefaultEvolutionEngine`:**
  - Implements `evolve(detector, enrichment): Detector`.
  - Enforces the 5 Core Invariants at runtime:
    1. *Soundness Preservation:* Throws `UnsoundEvolutionError` if $D$ is unsound or $E$ does not preserve soundness.
    2. *Composition:* Supports sequential chaining $\Phi(\Phi(D, E_1), E_2)$.
    3. *Identity:* Handles identity enrichment without mutation.
    4. *Governance Monotonicity:* Guarantees $\text{result.capabilities} \supseteq \text{detector.capabilities}$.
    5. *Progress Measure:* Strictly decrements `progressMeasure` when new capabilities are acquired.
- **BFS Reachability Solver:**
  - `isExecutableReachable(initial, targetCapabilities, registeredProviders): boolean`.
  - Performs Breadth-First Search over registered runtime providers $\mathcal{E}_{\text{known}}$ to determine executable reachability.

### 2.2 Empirical Validation Suite (`cli/src/batch-f-006/`)

- **Batch F-006 Scenarios:**
  - *Scenario A (Full Convergence Trajectory):* Validates $D_{\text{alg}} \rightsquigarrow D_{\text{top}}$ via 3 sequential enrichments.
  - *Scenario B (Unreachable Deficit):* Validates detection of closure deficit when required provider is missing from $\mathcal{E}_{\text{known}}$.
  - *Scenario C (Soundness Barrier):* Validates rejection of unsafe enrichment provider ($E.preservesSoundness = false$).

---

## 3. Definition of Done

1. `cli/src/takt-core/evolution.ts` created and exported from `index.ts`.
2. Unit tests in `cli/src/takt-core/evolution.test.ts` pass via `npx vitest run`.
3. `batch-f-006` implemented and passing via `npx vitest run cli/src/batch-f-006`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
