# Runtime Observation Architecture Specification

**Date:** 2026-07-23  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Design Specification

---

## 1. Executive Summary & Core Invariant

This document establishes the architectural contract bridging **Convergence Theory** (and future **Adaptive Strategy Theory**) with the TAKT runtime execution engine.

> **Architectural Invariant — Observation does not influence execution. Adaptation occurs only between executions.**

The core principle is **generic passive observation**: runtime observers MUST NEVER alter the execution mechanism of runners (`SearchRunner`, `MonteCarloRunner`, `ParallelRunner`, etc.) or mutate strategy state during evaluation. All convergence analysis operates strictly on immutably recorded execution traces.

---

## 2. Generic Trace Architecture & Pipeline

The architecture decouples trace generation from specific execution algorithms by introducing a generic `ExecutionTrace<S>` interface:

```text
TransitionSystem
        ↓
ExecutionRunners (SearchRunner, MonteCarloRunner, ParallelRunner, BeamSearchRunner)
        ↓
ExecutionTrace<S> (Generic Immutable Trajectory Data)
        ↓
StateStream<S> (Extracted Terminal/Intermediate State Stream)
        ↓
Convergence Observers (Pure Trace Analyzers)
        ↓
Dynamic Predicates (hasConverged, isOscillating, findAttractor)
```

### Invariants:
1. **Generic Producers**: Any runner producing a sequence of states implements `ExecutionTrace<S>`. `SearchRunner` is simply one concrete producer.
2. **Zero Inverse Dependency**: Observers and predicates NEVER call back into runners or modify `Strategy` logic.
3. **Strategy Purity**: Strategies remain completely stateless across runs. The restart policy $f : S_{\text{terminal}} \to S_{\text{initial}}$ is purely external.
4. **Execution/Analysis Decoupling**: Execution (`Runners`) is strictly separated from Analysis (`Observers`). There shall be NO combined `ConvergenceRunner` or `AdaptiveRunner`.

---

## 3. Two-Phase Runtime Decomposition & Target CARDS

The implementation is split into two passive phases without mutating existing runners:

### 3.1 Phase A: Observation & Recording (Passive Instrumentation)
- **CARD-420**: Define generic interface `ExecutionTrace<S>` and `StateStream<S>` in `cli/src/takt-core/types.ts`.
- **CARD-421**: Implement passive sequence recorder `runSequence` accepting any `ExecutionTrace` producer and pure restart policy $f$.

### 3.2 Phase B: Pure Predicates & Observables (Trace Analysis)
- **CARD-422**: Implement `hasConverged(stream, region)` and `isOscillating(stream, period)` predicates.
- **CARD-423**: Implement `findFixedPoint(stream)` and `findAttractor(stream)` mathematical observers.
- **CARD-424**: Implement `convergenceRate(stream, region)` empirical observable.
- **CARD-425**: Create Vitest test suite (`cli/src/takt-core/convergence.test.ts`) validating 100% decoupling over mock traces.

---

## 4. Architecture Review Checklist

Before implementing any code under CARD-420 through CARD-425, the implementation MUST satisfy all items:

- [ ] **Generic Traces**: Does `ExecutionTrace<S>` depend on any specific strategy or runner implementation? *(Must be NO)*
- [ ] **Pure Observers**: Are all observer functions and predicates side-effect free, deterministic, and pure? *(Must be YES)*
- [ ] **Execution Integrity**: Does any predicate or observer modify step decisions or runner execution? *(Must be NO)*
- [ ] **Zero-Overhead Disabling**: Can instrumentation be disabled without altering execution outcomes or performance bounds? *(Must be YES)*
- [ ] **Immutable API**: Does the observation API expose exclusively frozen, read-only data structures? *(Must be YES)*
- [ ] **Cost Decoupling**: Is the computational cost of trace analysis completely decoupled from the search algorithm's inner loop? *(Must be YES)*

---

## 5. Contract for Future Adaptive Strategy Theory (Stage IV)

By enforcing that observers consume immutable generic traces, future **Adaptive Strategy Theory** will be constructed by wrapping observers in a high-level feedback controller that updates strategies *between* executions, preserving the purity of execution kernels.
