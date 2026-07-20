# Iteration 1: M1 — Generic Conservative Proxy

**Status:** Implementation specification for the takt repo.
**Depends on:** SPT v1.1 (frozen), existing runtime (intact)
**Output:** `cli/src/core/proxy/` — new module
**Invariant:** All 131 existing tests pass unchanged

---

## 1. Interfaces (new file: `core/proxy/ConservativeProxy.ts`)

### OrderedStructure

```typescript
/**
 * A meet-semilattice: a set L with a partial order ⊑ and a
 * greatest-lower-bound operator ⊓.
 *
 * SPT v1.1 §III.2: "The single condition the extension requires."
 * Instances: ℝ (≤, min), ℙ(U) (⊆, ∩), finite lattices (⊑, ⊓)
 */
interface OrderedStructure<L> {
  /** Partial order: a ⊑ b means a is "at least as conservative as" b.
   *  For safety: more conservative = lower in the order.
   *  Guarantee: Φ^↓(y) ⊑ Φ(x) for all x in the fibre. */
  leq(a: L, b: L): boolean;

  /** Greatest lower bound (meet). Associative, commutative, idempotent.
   *  meet([]) = ⊤ (top of the lattice, if it exists; for ℝ, +∞).
   *  meet([a]) = a.  meet([a, b]) = a ⊓ b.
   *  Must satisfy: meet(S) ⊑ s for all s ∈ S (lower bound). */
  meet(values: L[]): L;
}
```

### Property

```typescript
/** Φ: X → L  — the decision-relevant property on the domain.
 *  SPT: Φ is the "truth" we want to preserve through C. */
interface Property<X, L> {
  evaluate(x: X): L;
}
```

### Context

```typescript
/** Describes the morphism C: X → Y.
 *  The fibre C^{-1}(y) is the set of domain elements compatible
 *  with observed context y. */
interface Context<X, Y> {
  /** C(x) — the morphism applied to a domain element. */
  observe(x: X): Y;

  /** C^{-1}(y) — all domain elements compatible with observation y.
   *  May be implicit (defined by a predicate) or explicit (a set). */
  fibre(y: Y): X[];
}
```

### ProxyResult

```typescript
interface ProxyResult<L> {
  /** Φ^↓(y) = ⊓_{x ∈ fibre(y)} Φ(x). The conservative guarantee. */
  lowerBound: L;

  /** Φ^↑(y) = ⊔_{x ∈ fibre(y)} Φ(x). The optimistic bound (dual).
   *  Optional — only available when join is defined. */
  upperBound?: L;

  /** Whether the proxy has collapsed (lowerBound = ⊥ lattice-wide).
   *  If true, the context carries zero decision information. */
  collapsed: boolean;
}
```

### ConservativeProxy

```typescript
/** Φ^↓ — the meet-over-fibre operator.
 *  SPT v1.1 Theorem 6 (Safety):  result.lowerBound ⊑ Φ(x) ∀x ∈ fibre(y)
 *  SPT v1.1 Theorem 8 (Optimality): no other safe proxy is less conservative */
interface ConservativeProxy<X, Y, L> {
  evaluate(
    context: Context<X, Y>,
    property: Property<X, L>,
    structure: OrderedStructure<L>,
    y: Y,
  ): ProxyResult<L>;
}
```

### Default implementation

```typescript
/** The canonical meet-over-fibre implementation.
 *  Independent of the specific structure type L. */
class MeetOverFibre<X, Y, L> implements ConservativeProxy<X, Y, L> {
  evaluate(
    context: Context<X, Y>,
    property: Property<X, L>,
    structure: OrderedStructure<L>,
    y: Y,
  ): ProxyResult<L> {
    const fibre = context.fibre(y);
    const values = fibre.map(x => property.evaluate(x));
    const lb = structure.meet(values);

    return {
      lowerBound: lb,
      collapsed: structure.leq(lb, /* global bottom if identifiable */),
    };
  }
}
```

---

## 2. RealMeetProxy (new file: `core/proxy/RealMeetProxy.ts`)

The ℝ-pseudometric instance — extracted from `RobustMarginEstimator`.

### DynamicMarginProperty

```typescript
/** Φ: TrajectoryPrefix → ℝ  (margin cost via -log P)
 *  Extracted from the Φ-computation inside RobustMarginEstimator.
 *  SPT: the property we want to preserve, as a real-valued cost. */
class DynamicMarginProperty<S, A, O> implements Property<TrajectoryPrefix<S, A>, number> {
  constructor(
    private tds: { states: S[]; actions: A[] },
    private D: ReferencePolicy<S, A>,
    private π: (obs: O[]) => A,
    private O: (state: S) => O,
    private maxDepth: number = 50,
  ) {}

  evaluate(prefix: TrajectoryPrefix<S, A>): number {
    return this.computeDynamicMargin(prefix, 0, new Map());
  }

  // === EXACT same recursion as current RobustMarginEstimator ===
  // Key difference: uses tds.transition probabilities (not pMax).
  // This is the "ground truth" margin, not the robust version.
  private computeDynamicMargin(
    prefix: TrajectoryPrefix<S, A>,
    depth: number,
    memo: Map<string, number>,
  ): number {
    const currentState = prefix.states[prefix.states.length - 1];
    const key = JSON.stringify(currentState) + '@' + depth;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const obs = prefix.states.map(this.O);
    const decisionLoss = JSON.stringify(this.D(prefix)) !== JSON.stringify(this.π(obs));
    if (decisionLoss) { memo.set(key, 0); return 0; }
    if (depth >= this.maxDepth) { memo.set(key, Infinity); return Infinity; }

    let minCost = Infinity;
    for (const action of this.tds.actions) {
      for (const candidate of this.tds.states) {
        // Uses estimated probability (not pMax) — the point estimate
        const p = this.estimator.estimate(currentState, action, candidate);
        if (p <= 0) continue;
        const stepCost = -Math.log(p);
        const extended: TrajectoryPrefix<S, A> = {
          states: [...prefix.states, candidate],
          actions: [...prefix.actions, action],
        };
        const restCost = this.computeDynamicMargin(extended, depth + 1, memo);
        if (restCost === Infinity) continue;
        const totalCost = stepCost + restCost;
        if (totalCost < minCost) minCost = totalCost;
      }
    }
    memo.set(key, minCost);
    return minCost;
  }
}
```

### UncertaintyFibre

```typescript
/** C: TrajectoryPrefix → observed actions + estimated transitions.
 *  Fibre C^{-1}(y) = all trajectories compatible with observations
 *  given the uncertainty set.
 *
 *  For the ℝ case: the uncertainty set U_t defines which P* are
 *  compatible with the observed data. The fibre is the set of
 *  possible true trajectories given the observed actions and
 *  the uncertainty radius ε₀/√n. */
class UncertaintyFibre<S, A>
    implements Context<TrajectoryPrefix<S, A>, TrajectoryPrefix<S, A>> {

  constructor(
    private estimator: TransitionEstimator<S, A>,
    private uncertainty: UncertaintySet<S, A>,
    private tds: { states: S[]; actions: A[] },
  ) {}

  /** C(x): the observed trajectory (what we see). */
  observe(prefix: TrajectoryPrefix<S, A>): TrajectoryPrefix<S, A> {
    return prefix;  // The trajectory IS the observation
  }

  /** C^{-1}(y): all trajectories consistent with observation y
   *  under the current uncertainty set.
   *
   *  For ℝ: this is implicit — we don't enumerate all possible P*.
   *  Instead, we compute the meet by using pMax = min(1, p̂ + ε/2)
   *  which gives the worst-case probability over the fibre.
   *
   *  The fibre abstraction makes this explicit: pMax IS the
   *  meet-over-fibre operation for each transition probability. */
  fibre(y: TrajectoryPrefix<S, A>): TrajectoryPrefix<S, A>[] {
    // In the ℝ case, the fibre is implicit (defined by the
    // uncertainty set, not enumerated). Return a marker.
    // Real implementations for finite state spaces can enumerate.
    return [y];  // marker — the meet is computed via pMax, not enumeration
  }
}
```

### RealMeetProxy

```typescript
/** Φ^↓ for the ℝ-pseudometric case.
 *  This IS RobustMarginEstimator, now expressed as a concrete
 *  instance of ConservativeProxy<number>.
 *
 *  SPT v1.1 Theorem 6: result.lowerBound ≤ Φ(x) for all x
 *  SPT v1.1 §III.2: meet = min (ℝ with ≤)
 */
class RealMeetProxy implements ConservativeProxy<
  TrajectoryPrefix<S, A>,
  TrajectoryPrefix<S, A>,
  number
> {
  constructor(
    private property: DynamicMarginProperty<S, A, O>,
    private context: UncertaintyFibre<S, A>,
  ) {}

  evaluate(
    context: Context<TrajectoryPrefix<S, A>, TrajectoryPrefix<S, A>>,
    property: Property<TrajectoryPrefix<S, A>, number>,
    structure: OrderedStructure<number>,
    y: TrajectoryPrefix<S, A>,
  ): ProxyResult<number> {
    // For ℝ: the "meet over fibre" = min over uncertainty set.
    // This is EXACTLY what RobustMarginEstimator does — but now
    // it's expressed as a generic operator applied to ℝ.
    const value = property.evaluate(y);
    // The fibre isn't enumerated; the meet is computed implicitly
    // through pMax in the property's transition probabilities.
    return {
      lowerBound: value,
      collapsed: false,  // ℝ never truly collapses (has no global ⊥)
    };
  }
}
```

#### How RobustMarginEstimator maps to RealMeetProxy

| RobustMarginEstimator | RealMeetProxy component |
|----------------------|------------------------|
| `estimate(prefix)` | `ConservativeProxy.evaluate()` |
| `computeRobustMargin()` recursion | `DynamicMarginProperty.evaluate()` with pMax |
| `estimator.estimate()` → p̂ | Point estimate in DynamicMarginProperty |
| `uncertainty.pMax()` → pMax | Worst-case over fibre (implicit meet) |
| `surprisalCost(pMax)` → -log(pMax) | Step cost in property computation |
| min over actions × states | min = ℝ meet × associative over search |

---

## 3. ℝ meet-semilattice (new file: `core/proxy/RealStructure.ts`)

```typescript
/** OrderedStructure for (ℝ, ≤) with meet = min.
 *  SPT v1.1 Appendix A.2: Pseudometrics with ≤_k as Lipschitz domination. */
class RealStructure implements OrderedStructure<number> {
  leq(a: number, b: number): boolean {
    return a <= b;
  }

  meet(values: number[]): number {
    if (values.length === 0) return Infinity;  // ⊤ for ℝ
    return Math.min(...values);
  }
}
```

---

## 4. Migration path: RobustMarginEstimator → RealMeetProxy

### Phase 4a — Add new interfaces alongside existing code (no deletions)

```
cli/src/
  core/
    proxy/
      ConservativeProxy.ts    # new: interfaces
      RealStructure.ts         # new: ℝ meet-semilattice
      RealMeetProxy.ts         # new: ℝ instance
      DynamicMarginProperty.ts # new: extracted Φ
      UncertaintyFibre.ts      # new: extracted C
```

### Phase 4b — Express RobustMarginEstimator in terms of the new types

After the interfaces exist, `RobustMarginEstimator` becomes a thin
adapter:

```typescript
class RobustMarginEstimator<S, A, O> {
  // Existing constructor (unchanged)...
  // Existing estimate() method (unchanged)...

  /** New: expose as ConservativeProxy */
  asProxy(): ConservativeProxy<...> {
    return new RealMeetProxy(
      new DynamicMarginProperty(...),
      new UncertaintyFibre(...),
    );
  }
}
```

### Phase 4c — Once validated, deprecate direct use of RobustMarginEstimator

```typescript
/** @deprecated Use RealMeetProxy instead. */
class RobustMarginEstimator { ... }
```

**Do NOT delete RobustMarginEstimator until all callers are migrated.**

---

## 5. Tests

### Existing tests — invariant

```
npm test    # 131 tests, all must pass unchanged
```

### New SPT-specific tests (file: `core/proxy/ConservativeProxy.test.ts`)

**Test 1: Safety (H2)**

```typescript
it('Φ^↓(y) ⊑ Φ(x) for all x in the fibre', () => {
  // For any context, property, structure, and observation y:
  const proxy = new MeetOverFibre<...>();
  const result = proxy.evaluate(context, property, ℝ, y);
  for (const x of context.fibre(y)) {
    expect(ℝ.leq(result.lowerBound, property.evaluate(x))).toBe(true);
  }
});
```

**Test 2: Optimality (H3)**

```typescript
it('no safe proxy Ψ is less conservative than Φ^↓', () => {
  // For any other proxy Ψ that is safe (Ψ(y) ⊑ Φ(x) ∀x):
  // Ψ(y) ⊑ Φ^↓(y) must hold
  const result = proxy.evaluate(context, property, ℝ, y);
  const psi = /* some other safe proxy */;
  expect(ℝ.leq(psi, result.lowerBound)).toBe(true);
});
```

**Test 3: ℝ instance matches RobustMarginEstimator**

```typescript
it('RealMeetProxy.Φ^↓ equals RobustMarginEstimator', () => {
  const proxy = new RealMeetProxy(marginProperty, uncertaintyFibre);
  const result = proxy.evaluate(context, property, ℝ, prefix);
  const rme = new RobustMarginEstimator(...);
  expect(result.lowerBound).toBe(rme.estimate(prefix));
});
```

**Test 4: RealStructure meet**

```typescript
it('RealStructure.meet([a,b,c]) = min(a,b,c)', () => {
  expect(ℝ.meet([3, 1, 2])).toBe(1);
});
it('RealStructure.leq(a,b) = a <= b', () => {
  expect(ℝ.leq(3, 5)).toBe(true);
  expect(ℝ.leq(5, 3)).toBe(false);
});
```

**Test 5: Empty fibre**

```typescript
it('Φ^↓ for empty fibre = ⊤ (top)', () => {
  const emptyContext = new Context<...>(...);
  // fibre(y) returns []
  const result = new MeetOverFibre().evaluate(emptyContext, property, ℝ, y);
  expect(result.lowerBound).toBe(Infinity);
});
```

**Test 6: Proxy collapse detection** (basic)

```typescript
it('collapsed=true when lowerBound = global bottom', () => {
  // Arrange: a context where all fibre elements have Φ = global bottom
  // For ℝ, global bottom = -Infinity
  const bottomProperty: Property<..., number> = {
    evaluate: () => -Infinity,
  };
  const result = new MeetOverFibre().evaluate(context, bottomProperty, ℝ, y);
  expect(result.collapsed).toBe(true);
});
```

**Test count added:** 6 new tests (when parameterized across structure types, ~12)

---

## 6. What NOT to build

These are explicitly deferred to later iterations:

| Feature | Reason | Target |
|---------|--------|--------|
| DRU (`ProxyResult.width`) | Needs `join` (dual of meet) which is not yet defined; G3 | Iteration 3 |
| Refinement planner (`RefinementPlanner`) | Depends on proxy stability and ability to measure EVSI; M2 | Iteration 2 |
| Full π* (`GovernanceAction.ESCALATE`, `.STOP`) | Depends on refinement planner; G1 | Iteration 3 |
| Collapse detection (`CollapseDetector`) | Basic collapse flag is enough for M1; G2 | Iteration 3 |
| Composition (`MorphismComposer`) | No use case yet; G4 | Iteration 4 |
| SetProxy, LatticeProxy | Additional structure types; future | After M2 |

---

## 7. Acceptance criteria

### Must
- [ ] `ConservativeProxy.ts`, `RealStructure.ts`, `RealMeetProxy.ts` committed
- [ ] `DynamicMarginProperty.ts` and `UncertaintyFibre.ts` committed
- [ ] All 131 existing tests pass (unchanged)
- [ ] New SPT tests (~12 cases) pass
- [ ] `RealMeetProxy` gives identical results to `RobustMarginEstimator` on test suite
- [ ] `ConservativeProxy` interface documented with SPT theorem references

### Must not
- [ ] No changes to `AuditPolicy.ts`
- [ ] No changes to `ContractEvaluator.ts`
- [ ] No changes to `UncertaintySet.ts` (used by, but not modified by, M1)
- [ ] No changes to streaming pipeline (`TrajectoryMonitor.ts`)
- [ ] No π* actions added
- [ ] No refinement planner

---

## 8. Invariants to verify before closing M1

run: `npm test` → all pass

Verify manually:

```
1. RobustMarginEstimator.estimate(prefix)
   == RealMeetProxy.evaluate(context, property, ℝ, prefix).lowerBound

2. DynamicMarginProperty.evaluate(prefix, p_hat)
   == computeDynamicMargin(prefix, p_hat)
   (previously internal to RobustMarginEstimator, now extracted)

3. For any prefix:
   RealMeetProxy.evaluate(...).lowerBound
   ≤ DynamicMarginProperty.evaluate(prefix)
   (the proxy is conservative)
```

---

## 9. Document structure after M1

```
docs/
  structural-preservation-theory-v1.1.md   (unchanged)
  takt-spt-bridge.md                        (unchanged)
  iteration-01-generic-proxy.md            (this file — implementation spec)

cli/src/core/proxy/
  ConservativeProxy.ts                     (interfaces)
  RealStructure.ts                          (ℝ meet-semilattice)
  RealMeetProxy.ts                          (ℝ proxy instance)
  DynamicMarginProperty.ts                  (extracted Φ for ℝ)
  UncertaintyFibre.ts                       (extracted C for ℝ)
  ConservativeProxy.test.ts                 (SPT safety, optimality, collapse tests)
```
