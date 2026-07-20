# Finding: Generality boundary of the SPT runtime

**Date:** 2026-07-20
**Source:** CARD-348 (static analysis before implementation)
**Status:** Confirmed by static inspection, no experiment needed

## Claim tested

> The SPT pipeline (ConservativeProxy → RefinementPlanner → GovernancePolicy) is independent of the domain L. SetProxy (L = ℙ(U)) and LatticeProxy (L = finite lattice) should work without modifying Planner or Governance.

## Result: False

M1 (`ConservativeProxy<X, Y, L>`) is genuinely generic over L. M2 and M3 are ℝ-coupled by construction, not by incidental code:

| Module | Type signature | L-generic? |
|--------|---------------|------------|
| `ConservativeProxy<X, Y, L>` | `evaluate(...) → ProxyResult<L>` | ✅ Yes |
| `EVSICalculator.estimate` | `(currentValue: number, option) → number` | ❌ No |
| `RefinementPlanner.select` | `(currentValue: number, ...) → RefinementDecision` | ❌ No |
| `GovernancePolicy.decide<L>` | `<L extends number>(...) → GovernanceAction` | ❌ No |
| `GovernancePolicy` body | `lowerBound >= threshold` (numeric `>=`) | ❌ No |

## Why this is not a bug

The ℝ coupling reflects real requirements:

- **EVSI** computes expected value − current value − cost. This requires subtraction, which `OrderedStructure<L>` does not provide.
- **Governance** compares `Φ^↓(y) ≥ threshold`. This requires a total order with a distinguished element (threshold) plus comparison against it. A partial order (⊑) is insufficient for threshold semantics.

## Next question

What is the minimal algebraic structure over L that M2/M3 actually need?

Candidate operators:
- **Comparison:** `geq(a: L, b: L): boolean` (threshold semantics)
- **Difference / distance:** `diff(a: L, b: L): number` (EVSI needs subtraction)
- **Combination:** some notion of expectation over outcome distributions
- **Cost:** refinements have numeric cost independently of L

The answer is not obvious: EVSI fundamentally involves arithmetic (expected value, subtraction), which suggests any generic M2/M3 will need at least a valuation function `v: L → ℝ` or a richer structure than `OrderedStructure<L>`.

## References

- CARD-348 (original scope: generic proxy validation)
- `ConservativeProxy.ts` (M1, genuinely generic)
- `RefinementPlanner.ts` (M2, ℝ-coupled)
- `GovernancePolicy.ts` (M3, ℝ-coupled)
