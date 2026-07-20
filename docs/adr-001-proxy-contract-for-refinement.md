# ADR-001: M1 establishes proxy contract for refinement

**Status:** Accepted
**Date:** 2026-07-20
**Context:** SPT v1.1 validation cycle, M1 implementation
**Depends on:** CARD-331 through CARD-336

## Decision

M2 (Refinement Planner) must not operate on arbitrary estimates. It must operate on proxies that satisfy the SPT contract:

1. **Conservación:** Φ^↓(y) ⊑ Φ(x) ∀x ∈ C^{-1}(y)  (Theorem 6)
2. **Optimalidad:** No safe proxy is less conservative than Φ^↓ (Theorem 8)
3. **Monotonía:** C' ≻ C ⇒ Φ^↓_{C'} ⊒ Φ^↓_C  (Theorem 10)
4. **Collapse baseline:** Collapsed proxy signals structural information absence, not algorithmic failure

## Rationale

Without this contract, a RefinementPlanner could optimize against a metric that does not correspond to the system's actual decision-safety geometry. This would produce a system that:

- Refines based on noise rather than structural information gain
- Cannot distinguish between "needs more data" and "context is fundamentally insufficient"
- Lacks monotonic guarantees for refinement sequences

## Consequences

- M2 receives a well-behaved optimization target
- G1–G3 (π*, collapse detection, DRU) are deferred past M2 because they depend on knowing the refinement space before instrumenting it
- Any future proxy implementation (SetProxy, LatticeProxy) must satisfy the same contract before being consumed by a planner

## References

- SPT v1.1 Theorems 6-10 (`docs/structural-preservation-theory-v1.1.md`)
- M1 spec (`docs/iteration-01-generic-proxy.md`)
- Runtime audit gap classification M1-M2 (`docs/takt-spt-runtime-audit.md`)
