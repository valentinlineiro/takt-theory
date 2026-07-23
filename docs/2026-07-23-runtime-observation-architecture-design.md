# Runtime Observation Architecture Specification

**Date:** 2026-07-23  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Design Specification

---

## 1. Executive Summary & Core Invariant

This document establishes the architectural contract bridging **Convergence Theory** (and future **Adaptive Strategy Theory**) with the TAKT runtime execution engine.

> **Architectural Invariant — Observation does not influence execution. Adaptation occurs only between executions.**

The core principle is **generic passive observation**: runtime observers MUST NEVER alter the execution mechanism of runners (`SearchRunner`, `MonteCarloRunner`, `ParallelRunner`, etc.) or mutate strategy state during evaluation. All convergence analysis operates strictly on immutably recorded execution evidence.

---

## 2. TAKT Development Meta-Pattern

All layers in TAKT follow a strict, proven development lifecycle that guarantees architectural stability:

$$\text{Mathematical Object} \longrightarrow \text{Mathematical Property} \longrightarrow \text{Lean Formalization} \longrightarrow \text{Runtime Abstraction} \longrightarrow \text{Algorithm}$$

- **Volume I**: Representation $\longrightarrow$ Sufficiency $\longrightarrow$ Lean Proof $\longrightarrow$ Kernel Abstraction $\longrightarrow$ Dynamic Contracts
- **Volume II**: Landscape $\longrightarrow$ Search/Strategy $\longrightarrow$ Lean Proof $\longrightarrow$ SearchRunner $\longrightarrow$ Optimization
- **Volume II (Stage III)**: Infinite Trajectory $\longrightarrow$ Dynamic Behavior $\longrightarrow$ Lean Proof $\longrightarrow$ `ExecutionTrace` $\longrightarrow$ Observation Library

---

## 3. Generic Evidence & Observation Pipeline

The architecture decouples trace generation from specific execution algorithms by treating `ExecutionTrace<S, A>` as **execution evidence**:

```text
ExecutionTrace<S, A> (Evidence Container)
    ├── states: ReadonlyArray<S>
    ├── transitions: ReadonlyArray<Transition<S, A>>
    ├── terminationReason: TerminationStatus
    └── metadata: ReadonlyMap<string, unknown>
```

The pipeline cleanly separates **Information Extraction** (Observers) from **Judgment Emission** (Classifiers):

```text
TransitionSystem
        ↓
ExecutionRunners (SearchRunner, MonteCarloRunner, ParallelRunner, BeamSearchRunner)
        ↓
ExecutionTrace<S, A> (Evidence Container)
        ↓
Observation Library (Extraction: findFixedPoint, findAttractor, cycleLength, stabilizationIndex)
        ↓
Classifiers & Predicates (Judgment: hasConverged, isOscillating, isChaotic)
```

---

## 4. Two-Phase Runtime Decomposition & Re-ordered CARDS

### 4.1 Phase A: Evidence Recording (Passive Instrumentation)
- **CARD-420**: Define generic evidence container `ExecutionTrace<S, A>` and `StateStream<S>` in `cli/src/takt-core/types.ts`.
- **CARD-421**: Implement passive sequence recorder `runSequence` accepting any `ExecutionTrace` producer and pure restart policy $f$.

### 4.2 Phase B: Observation Library & Classifiers (Trace Analysis)
- **CARD-422**: **Observation Library** — Implement pure info-extraction functions (`findFixedPoint`, `findAttractor`, `cycleLength`, `stabilizationIndex`).
- **CARD-423**: **Dynamic Classifiers** — Implement judgment predicates (`hasConverged`, `isOscillating`, `isChaotic`) utilizing CARD-422 observations.
- **CARD-424**: **Empirical Observables** — Implement `convergenceRate(trace, region)`.
- **CARD-425**: **Empirical Test Suite** — Create Vitest suite (`cli/src/takt-core/convergence.test.ts`) validating 100% decoupling over mock traces.

---

## 5. Architecture Review Checklist

Before implementing any code under CARD-420 through CARD-425, the implementation MUST satisfy all items:

- [ ] **Generic Traces**: Does `ExecutionTrace<S, A>` represent complete execution evidence without depending on a specific strategy or runner? *(Must be YES)*
- [ ] **Extraction/Judgment Separation**: Are raw observations (extraction) strictly separated from boolean predicates (judgment)? *(Must be YES)*
- [ ] **Pure Observers**: Are all observer functions and predicates side-effect free, deterministic, and pure? *(Must be YES)*
- [ ] **Execution Integrity**: Does any predicate or observer modify step decisions or runner execution? *(Must be NO)*
- [ ] **Zero-Overhead Disabling**: Can instrumentation be disabled without altering execution outcomes or performance bounds? *(Must be YES)*
- [ ] **Immutable API**: Does the observation API expose exclusively frozen, read-only data structures? *(Must be YES)*

---

## 6. Contract for Future Adaptive Strategy Theory (Stage IV)

By enforcing that observers consume immutable generic evidence, future **Adaptive Strategy Theory** will be constructed by wrapping the Observation Library in a high-level feedback controller that updates strategies *between* executions, preserving the purity of execution kernels.
