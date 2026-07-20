# Iteration 2: M2 — Refinement Planner (Single-step)

**Status:** Interface contract (pre-implementation)
**Depends on:** M1 ConservativeProxy (tag: `m1-baseline`)
**Architecture rule:** M2 → M1 (M1 never depends on M2)

---

## 1. Interfaces (proposed module: `core/refinement/RefinementPlanner.ts`)

### RefinementOption

```typescript
/**
 * A possible action that refines the context C, producing a new
 * morphism C' that may reduce fibre width.
 *
 * Examples:
 *   { type: "more_logs",   cost: 2,  description: "Collect 5 more trajectory samples" }
 *   { type: "recalibrate", cost: 5,  description: "Rebuild transition model with all data" }
 *   { type: "deeper_max_depth", cost: 3, description: "Increase lookahead from 50 to 100" }
 */
interface RefinementOption {
  /** Cost of executing this refinement (arbitrary unit).
   *  Must be non-negative. Zero cost means "free to attempt". */
  cost: number;

  /** Human-readable description of what this refinement does. */
  description: string;
}
```

### RefinementEvaluation

```typescript
/**
 * Result of evaluating a single refinement candidate.
 *
 * expectedBenefit is the estimated improvement in Φ^↓(y) if the
 * refinement is applied — i.e., how much higher (less conservative)
 * the guarantee would become.
 *
 * netValue = expectedBenefit - cost.
 * Only refinements with netValue > 0 should be selected.
 */
interface RefinementEvaluation {
  /** The candidate that was evaluated. */
  option: RefinementOption;

  /** Estimated improvement in lowerBound after refinement.
   *  Zero means "no measurable improvement". */
  expectedBenefit: number;

  /** Net value after subtracting cost.
   *  If ≤ 0, this refinement is not worth executing. */
  netValue: number;
}
```

### PlannerResult

```typescript
/**
 * Result of the planner's selection over the candidate set.
 *
 * Either a chosen refinement or an explicit signal that no
 * refinement is worth executing. This is the single point where
 * M2 answers "what next?" — and the answer may be "nothing".
 */
type PlannerResult =
  | { kind: 'refine'; option: RefinementOption; evaluation: RefinementEvaluation }
  | { kind: 'noRefinement'; reason: string };
```

### RefinementPlanner

```typescript
/**
 * Single-step refinement planner.
 *
 * Given a proxy guarantee and a set of candidate refinements,
 * selects the one with the highest net value. Returns
 * NoRefinement if no candidate has positive net value.
 *
 * Contract:
 *  - Never selects a refinement with netValue ≤ 0.
 *  - If multiple refinements have positive netValue, selects the
 *    one with the highest netValue (ties broken arbitrarily).
 *  - Never modifies the proxy, context, property, or structure.
 *
 * This is deliberately single-step. Multi-step planning,
 * sequential refinement, and global search are deferred to
 * later iterations. */
interface RefinementPlanner<X, Y, L> {
  evaluate(
    candidates: RefinementOption[],
    currentLowerBound: number,
    estimateBenefit: (option: RefinementOption) => number,
  ): PlannerResult;
}
```

---

## 2. Contract tests (proposed: `core/refinement/RefinementPlanner.test.ts`)

### Safety

```typescript
it('never selects a refinement with netValue ≤ 0', () => {
  const candidates = [
    { cost: 100, description: 'expensive' },
    { cost: 1, description: 'cheap but useless' },
  ];
  // Both have zero benefit → both netValue ≤ 0
  const estimateBenefit = () => 0;
  const result = planner.evaluate(candidates, 5.0, estimateBenefit);
  expect(result.kind).toBe('noRefinement');
});
```

### Optimality (bounded)

```typescript
it('selects the candidate with highest netValue', () => {
  const candidates = [
    { cost: 1, description: 'A' },
    { cost: 5, description: 'B' },
    { cost: 10, description: 'C' },
  ];
  // Benefits: A=3 (net=2), B=10 (net=5), C=12 (net=2)
  const estimateBenefit = (opt: RefinementOption) =>
    ({ 'A': 3, 'B': 10, 'C': 12 })[opt.description] ?? 0;
  const result = planner.evaluate(candidates, 5.0, estimateBenefit);
  expect(result.kind).toBe('refine');
  if (result.kind === 'refine') {
    expect(result.option.description).toBe('B');
  }
});
```

### Edge cases

```typescript
it('returns noRefinement when candidates list is empty', () => { ... });
it('handles ties by selecting any of the tied winners', () => { ... });
it('noRefinement when all netValues are negative despite positive benefit', () => { ... });
```

---

## 3. What M2 does NOT do

| Feature | Reason | Target |
|---------|--------|--------|
| Multi-step planning | Requires refinement sequences, not yet modeled | M4 |
| Global search over refinement space | No complete enumeration needed for single-step | Future |
| π* (Act/Refine/Escalate/Stop) | π* consumes the planner output, doesn't replace it | M3 |
| Collapse detection / DRU | Observability of proxy quality, not planning | After M3 |
| Composition of multiple proxies | No multi-property use case yet | Future |
| Modify ConservativeProxy | M2 is a consumer, never an implementer | Never |

---

## 4. Architecture rule

```
M1  ConservativeProxy  ← frozen (tag: m1-baseline)
         ↓  consumes
M2  RefinementPlanner  ← single-step, never modifies M1
         ↓  feeds into
M3  π* (Governance)    ← Act / Refine / Escalate / Stop
```

If implementing M2 reveals a need to change `ConservativeProxy`, the
right response is: "the refinement evaluation is mis-specified" —
not "the proxy needs a new method."

---

## 5. Acceptance criteria

- [ ] Interfaces defined (`RefinementOption`, `RefinementEvaluation`, `PlannerResult`, `RefinementPlanner`)
- [ ] Contract tests pass (safety, optimality-bounded, edge cases)
- [ ] No dependency from `ConservativeProxy.ts` on any refinement module
- [ ] CARD-338 delivered
