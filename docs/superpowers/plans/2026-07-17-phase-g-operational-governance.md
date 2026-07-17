# Phase G — Operational Governance (G0 + G1)

**Goal:** Validate that the dynamic contract C_v4 operates on an incrementally arriving trajectory, without access to the future.

**Status:** G0 (boundary) + G1 (runtime primitives). G2 (online P̂) and G3 (ARCH/HANSEI) deferred.

---

## G0 — Runtime Contract Boundary

The interface between the external world and TAKT.

```typescript
interface Event<S, A> {
  state: S
  action: A
  timestamp: number
}
```

A stream arrives as: `event₀ → event₁ → ... → event_t`, forming `τ_{:t}`.

```typescript
type GovernanceDecision =
  | { action: "MONITOR"; margin: number }
  | { action: "INTERVENE"; reason: string; margin: number }
```

No architectural scaffolding beyond this. Every component maps to exactly one of these types.

Separación de responsabilidades:

```
                  Event Stream
                       |
                       v
             TrajectoryMonitor
                       |
                       v
                  Prefix τ:t
                       |
              +--------+--------+
              |                 |
              v                 v

 DynamicMarginEstimator     AuditPolicy
              |                 |
              v                 v

             M_D          MONITOR / INTERVENE
                                |
                                v

                         ContractEvaluator
                                |
                                v

                         ContractReport
```

---

## G1 — Runtime Primitives

```
cli/src/runtime/
├── TrajectoryMonitor.ts      — maintain prefix, detect relevant changes
├── DynamicMarginEstimator.ts — compute M_D from prefix (reuses takt-core)
├── AuditPolicy.ts            — decision from M_D + threshold θ
└── ContractEvaluator.ts      — track loss_t, interventions_t, violations_t
```

### TrajectoryMonitor

- Maintains current prefix `τ_{:t}`
- Ingests new events via `ingest(event): void`
- Exposes `getPrefix(): Trajectory<S, A>`
- Does NOT compute decisions

### DynamicMarginEstimator

- `estimate(prefix): number` — delegates to `takt-core`'s `computeDynamicMargin`
- Reuses existing types and implementations
- No learning yet — assumes known P

### AuditPolicy

- `decide(margin, threshold): GovernanceDecision`
- For now: `M_D < θ → INTERVENE, else MONITOR`
- No optimization — validates the abstraction works online

### ContractEvaluator

- `evaluate(decision, outcome): ContractReport`
- Takes a decision + observed outcome, not the prefix itself
- Tracks cumulative loss, intervention count, violation events
- Checks `E[Σ L_t] ≤ ε`
- Evaluates whether the governance policy worked; does NOT decide how to govern

---

## Exit Criteria (G1)

| R# | Criterion | How to verify |
|----|-----------|---------------|
| R0 | Runtime semantics match formal TDS semantics | Property test: `TrajectoryMonitor` prefix equals formal `τ_{:t}` after every event |
| R1 | Streaming trajectory produces same M_D as batch evaluation | Unit test: same events, same M_D |
| R2 | Online auditor makes same decisions as F-004 simulator | Replay F-004 trajectories through runtime API |
| R3 | F-001–F-004 simulations replayable over runtime API | Integration test: batch → stream adapter |
| R4 | Adversary can inject events and trigger intervention before failure | Integration test: adversarial event sequence |
| R5 | Runtime detects governance failure | Two cases: (a) M_D crosses threshold → INTERVENE recorded; (b) no intervention → loss recorded in ContractReport |

---

## Non-Goals (G1)

- Online P̂ learning
- β adaptation
- ARCH/HANSEI integration
- UI, dashboards, or observability tooling
- Performance optimization (correctness first)

---

## Later Phases (deferred)

**G2:** Estimator → uncertainty model → `M_D_safe = M_D(P̂) - β`. Online P̂ from observations.

**G3:** Trajectory → observation delta → HANSEI reflection → update model P̂.
