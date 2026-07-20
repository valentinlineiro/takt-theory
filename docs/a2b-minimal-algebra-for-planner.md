# A2b: Minimal algebra for generic Planner/Governance

**Status:** Open question
**Source:** CARD-349 (transferred from TAKT runtime)
**Depends on:** `docs/finding-generality-boundary.md`

## Question

What is the minimal algebraic structure over `L` that allows `RefinementPlanner` (EVSI) and `GovernancePolicy` (threshold semantics) to operate without ℝ coupling?

## Known constraints

### EVSI needs

```
EVSI(current, option) = E[Φ^↓ after refinement] − Φ^↓(y) − cost
```

This requires:

- **Subtraction:** `E[Φ^↓ after] − Φ^↓(y)` and `result − cost`
- **Expected value:** `Σ value × probability` over discrete outcomes
- **Comparison:** `EVSI > 0` to decide whether refinement is worth it

### Governance needs

```
sufficientGuarantee = Φ^↓(y) ≥ threshold
```

This requires:

- **Comparison against a distinguished element** (threshold)
- **Total order** for `≥` to be well-defined

### What we know works

- `OrderedStructure<L>` (leq, meet) — sufficient for M1 (ConservativeProxy)
- `ℝ+` (≤, min, −, expectation) — sufficient for M2+M3, but ℝ-coupled

## Candidate algebras

### 1. Valuation approach

```typescript
interface Valuation<L> {
  value(x: L): number;  // embed L into ℝ for EVSI arithmetic
  leq(a: L, b: L): boolean;  // preserve order
}
```

This factorizes the ℝ coupling into a single point. EVSI operates on `value()`, governance compares via `leq`.

**Question:** Does every L that appears in practice admit a monotone valuation into ℝ? (Yes for sets with measure, finite lattices with rank, etc. — but not for all partial orders.)

### 2. Enriched ordered structure

```typescript
interface EvaluativeStructure<L> extends OrderedStructure<L> {
  diff(a: L, b: L): number;       // signed difference
  expectation(dist: {value: L; prob: number}[]): L;  // weighted combination
  zero: L;                        // additive identity for cost
}
```

More abstract than valuation, but may not be satisfiable for many L.

### 3. No generalisation exists

It may be that EVSI fundamentally requires ℝ arithmetic and no useful generalisation beyond ℝ exists without losing the properties that make EVSI meaningful in decision theory. This would also be a valid result.

## Method

1. Formalise the algebraic requirements of EVSI and threshold governance.
2. Test each candidate algebra against the three concrete L we care about: ℝ, ℙ(U), finite lattice.
3. If a candidate covers all three, implement it.
4. If none does, document the ℝ-specificity as a fundamental limit.

## References

- `docs/finding-generality-boundary.md` — static analysis confirming the boundary
- `cli/src/core/planner/RefinementPlanner.ts` — EVSI implementation
- `cli/src/core/governance/GovernancePolicy.ts` — threshold implementation
- `cli/src/core/proxy/ConservativeProxy.ts` — generic M1 contract (what works)
