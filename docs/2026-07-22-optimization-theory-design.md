# Optimization Theory — Phase 1: Strategy Evaluation and Guarantees

**Date:** 2026-07-22  
**Author:** Antigravity AI  
**Status:** Design Specification (Frozen)

---

## 0. Position in the TAKT Architecture

This document specifies the first phase of Optimization Theory in TAKT. It sits
directly above Strategy Theory and below the forthcoming convergence and adaptive
search layers:

```
Representation Theory
        ↓
Landscape Theory
        ↓
Transition Theory
        ↓
Search Theory
        ↓
Strategy Theory          ← previous layer
        ↓
Optimization Theory      ← this document
        ↓
Convergence Theory
```

The key distinction between this phase and algorithmic optimization is:

> **Phase 1 does not optimize. It defines the space in which comparison and
> optimization become meaningful.**

The dependency chain inside this phase is:

```
Strategy
    ↓
Evaluation Relation
    ↓
Guarantees (completeness, optimality)
    ↓
Optimization Algorithms  ← Phase 2, not here
```

---

## 1. Strategy Evaluation Algebra

### 1.1 Motivation

Strategy Theory defines what a strategy *is*. Optimization Theory must define
when one strategy is *better than another*. This requires formalizing a
comparison relation before any algorithm is discussed.

Crucially, "better" must remain abstract. A strategy that minimizes expansions
may be worse under a cost metric, and vice versa. The evaluation space must
accommodate multiple interpretable metrics without collapsing them prematurely
into a single number.

### 1.2 Evaluation Space

An **EvaluationSpace** is a set `E` equipped with a preorder `≤_E`:

```
EvaluationSpace = (E, ≤_E)
```

where `≤_E` is reflexive and transitive. Antisymmetry is *not* assumed: two
distinct evaluation outcomes may be equivalent under `≤_E`.

Examples of valid evaluation spaces:

| Name               | E                          | Meaning of `≤_E`            |
|--------------------|----------------------------|-----------------------------|
| ExpansionCount     | ℕ                          | fewer expansions is better  |
| PathCost           | ℝ≥0 ∪ {∞}                  | lower cost is better        |
| FrontierSize       | ℕ                          | smaller frontier is better  |
| LexicographicPair  | ℕ × ℝ                      | expansions first, then cost |

The framework admits any of these; the choice of `E` is a parameter, not part
of the core theory.

### 1.3 Strategy Performance

Given:
- A strategy `S`
- A search problem `P`
- An evaluation space `(E, ≤_E)`

A **StrategyPerformance** is a function:

```
perf(S, P) : RunResult → E
```

that maps execution outcomes to the evaluation domain.

The `RunResult` type (already defined in `SearchRunner`) provides:
- `trajectory`: the found solution path (or null)
- `expansionCount`: number of expansion steps
- `success`: whether a solution was found

### 1.4 Strategy Evaluation Order

Given two strategies `S₁` and `S₂`, a problem `P`, and an evaluation space `E`:

```
S₁ ≽_E S₂   iff   perf(S₁, P) ≤_E perf(S₂, P)
```

Read: "S₁ is at least as good as S₂ under E on problem P."

Properties that follow from `≤_E` being a preorder:

- **Reflexivity:** `S ≽_E S` (every strategy is at least as good as itself)
- **Transitivity:** if `S₁ ≽_E S₂` and `S₂ ≽_E S₃` then `S₁ ≽_E S₃`
- **Equivalence:** `S₁ ≃_E S₂` iff `S₁ ≽_E S₂` and `S₂ ≽_E S₁`

Equivalence captures the important case: two structurally different strategies
(e.g., two greedy variants with different tie-breaking) may produce equivalent
outcomes on a given problem.

**Note on totality:** `≽_E` is not assumed to be total. Some pairs of strategies
may be incomparable under a given evaluation space, which is the correct
treatment when multi-objective trade-offs exist.

---

## 2. Strategy Composition Laws

### 2.1 Algebraic View of Combinators

The combinators introduced in Strategy Theory:

```
fallback   : Strategy × Strategy → Strategy
depthBound : Strategy × ℕ → Strategy
```

form the basis of a **strategy algebra**. This section formalizes the laws that
hold and explicitly identifies where those laws are conditional.

### 2.2 Fallback Laws

Let `A`, `B`, `C` be strategies and `∅` denote a strategy that always returns
`TERMINATE`.

**Identity (right):**
```
fallback(A, ∅) ≃_E A
```
The fallback to a terminating strategy changes no outcome. Holds unconditionally.

**Identity (left):**
```
fallback(∅, A)
```
This is *not* equivalent to `A`. The primary strategy `∅` terminates immediately;
`A` is never consulted. Left identity does not hold.

**Associativity:**
```
fallback(A, fallback(B, C)) ≃_E fallback(fallback(A, B), C)
```
This is *conditional*: it holds when the decision boundary between primary and
fallback is deterministic (i.e., the primary strategy is pure and context-free
in its DEFER/TERMINATE behavior). Under stochastic strategies, associativity
may fail because the probability of reaching the fallback changes with nesting
order.

**Monotonicity:**
If `A ≽_E A'` then:
```
fallback(A, B) ≽_E fallback(A', B)
```
Improving the primary can only improve or preserve the combined outcome.

### 2.3 DepthBound Laws

Let `b₁ ≤ b₂` be natural number bounds.

**Inclusion:**
```
paths(depthBound(S, b₁)) ⊆ paths(depthBound(S, b₂))
```
A tighter bound explores a subset of the paths that a looser bound explores.

**Monotonicity in bound:**
```
b₁ ≤ b₂  ⟹  depthBound(S, b₁) ≽_E depthBound(S, b₂)
```
Wait — this direction depends on the evaluation space. Under `ExpansionCount`,
`depthBound(S, b₁)` uses fewer expansions (better). Under `PathCost`, a
smaller bound may miss cheaper deep solutions (worse). The monotonicity
direction is **evaluation-space dependent** and must be stated relative to `E`.

**Zero bound:**
```
depthBound(S, 0) ≃_E ∅
```
A depth bound of zero never expands; it is equivalent to immediate termination.

---

## 3. Completeness

### 3.1 Definition

Completeness is a property of a strategy *relative to a problem*. There is no
meaningful notion of absolute completeness.

```
Complete(S, P)  iff  ∀ run of S on P: if P has a solution then run succeeds
```

Formally: a strategy `S` is complete with respect to problem `P` if, for every
initial frontier and every execution of `SearchRunner` with strategy `S` on
problem `P`, `RunResult.success = true` whenever `P` has at least one accepting
trajectory.

### 3.2 Sufficient Conditions

Completeness can be guaranteed when three conditions hold simultaneously:

1. **Finite branching**: `|actions(s)|` is finite for every state `s`.
2. **Fairness**: every path in the frontier is eventually selected for expansion
   (the strategy never permanently ignores a path).
3. **Termination-free**: the strategy does not return `TERMINATE` while
   accepting paths still exist.

```
FiniteBranching(P) ∧ Fair(S, P) ∧ NoSpuriousTermination(S, P)
    ⟹  Complete(S, P)
```

### 3.3 Completeness Under Composition

**fallback preserves completeness** if the primary strategy is complete:
```
Complete(A, P)  ⟹  Complete(fallback(A, B), P)
```
Because the fallback is never invoked.

**fallback recovers completeness** if only the fallback is complete:
```
Complete(B, P)  ⟹  Complete(fallback(A, B), P)
```
Only if `A` always eventually DEFERs (not TERMINATEs) when a solution exists.

**depthBound breaks completeness** in general:
```
¬ Complete(depthBound(S, b), P)  for finite b if solution depth > b
```
This is expected and desirable: `depthBound` is a resource constraint, not a
completeness-preserving combinator.

---

## 4. Optimality

### 4.1 Definition

Optimality is defined relative to the preference preorder `Φ` on trajectories
already present in `SearchProblem`. No new cost notion is introduced here.

```
Optimal(S, P)  iff  ∀ run of S on P:
    if run succeeds with trajectory τ, then
    ¬∃ τ' such that τ' ≺_Φ τ
```

That is: the returned trajectory is not strictly dominated by any other
trajectory that `P` would accept.

### 4.2 Admissibility and Optimality

From Strategy Theory, `isAdmissible(S, P)` checks that no decision of `S`
expands a path whose terminal state cost exceeds an optimal bound. The
relationship is:

```
isAdmissible(S, P) ∧ Complete(S, P)  ⟹  Optimal(S, P)
```

This mirrors the classical A* admissibility theorem, now stated in terms of
TAKT's own abstractions rather than algorithm-specific definitions.

### 4.3 Optimality Under Composition

**fallback may break optimality** even if both components are individually
optimal, because the fallback introduces a secondary decision path that may
select a dominated trajectory when the primary defers.

**depthBound always breaks optimality** for problems where the optimal solution
lies deeper than `b`.

These are not defects — they are correct specifications of the trade-off each
combinator introduces.

---

## 5. Efficiency Bounds

### 5.1 Operational Metrics

The `RunResult` already exposes `expansionCount`. The following metrics extend
the observable surface for efficiency analysis:

| Metric          | Definition                                       |
|-----------------|--------------------------------------------------|
| `expansions`    | number of `EXPAND` decisions before termination  |
| `maxDepth`      | maximum `states.length - 1` across all frontier paths at any point |
| `frontierPeak`  | maximum `frontier.paths.length` across the run   |
| `pathLength`    | `trajectory.states.length - 1` for the solution  |

### 5.2 Cost Model

A **CostModel** over a search problem `P` is a tuple:

```
CostModel(P) = (expansionWeight, depthWeight, frontierWeight)
```

mapping operational metrics to a scalar via a weighted combination. This
provides a single efficiency score without committing to one metric as primary.

The evaluation space for efficiency is then:

```
E_efficiency = ℝ≥0,  ≤_E = ≤ (lower is better)
```

### 5.3 Bounds Under Composition

**depthBound provides a hard upper bound on maxDepth:**
```
maxDepth(depthBound(S, b)) ≤ b
```
This is the primary useful efficiency property of `depthBound` and the reason
it exists in the algebra.

**fallback provides no general bound improvement.** It may increase or decrease
expansion count depending on how frequently the primary defers.

---

## 6. Open Questions for Phase 2

The following questions are explicitly deferred to Optimization Theory Phase 2
(convergence, adaptive search):

1. **Convergence rate**: at what speed does a strategy approach an optimal
   trajectory as problem size grows?
2. **Stochastic guarantees**: completeness and optimality under randomized
   strategies require probability theory — this is out of scope here.
3. **Adaptive strategies**: strategies whose internal parameters change based on
   `history`. These require a richer version of `StrategyContext`.
4. **Multi-objective optimality**: when `Φ` is a partial order, the Pareto
   frontier replaces the unique optimum. This needs a dedicated treatment.

---

## 7. Mapping to Implementation (TAKT Kanban)

The following cards derive from this specification. They are not opened until
this document is frozen.

| Card         | Scope                                              | Depends on     |
|--------------|----------------------------------------------------|----------------|
| CARD-4xx     | `EvaluationSpace` interface and preorder utilities | CARD-398–402   |
| CARD-4xx     | `StrategyPerformance` and evaluation predicates    | above          |
| CARD-4xx     | Completeness predicates                            | above          |
| CARD-4xx     | Optimality predicate + admissibility linkage       | above          |
| CARD-4xx     | Efficiency metrics and `CostModel`                 | above          |
| CARD-4xx     | Composition law tests (algebraic properties)       | CARD-400       |
| CARD-4xx     | Lean formalization stubs                           | all above      |

---

## 8. Architectural Invariants

These invariants must hold throughout Phase 1 implementation:

1. **No new cost concept.** Optimality is defined via `SearchProblem.Φ`, not by
   introducing a separate cost function at this layer.
2. **Evaluation is a parameter, not a constant.** The evaluation space `E` is
   always explicit in predicate signatures; there is no global metric.
3. **Composition laws are conditional, not axioms.** Each law states its
   preconditions explicitly. Unconditional algebraic identity claims must be
   proven or flagged as conjectures.
4. **`RunResult` is the sole runtime observation point.** No implementation
   should peek inside the runner loop to compute metrics; all observability
   flows through `RunResult` or extensions thereof.
