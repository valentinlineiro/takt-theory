# ADR-002: M2 depends on M1, not the reverse

**Status:** Accepted
**Date:** 2026-07-20
**Context:** M2 Refinement Planner design

## Decision

M2 must consume `ConservativeProxy` without ever modifying or extending it. If implementing the refinement planner reveals a gap in the proxy's contract, the gap must be addressed by reevaluating the refinement model — not by changing the proxy.

## Rationale

SPT v1.1 established the proxy as a mathematical invariant (Theorems 6–10). Allowing M2 to modify the proxy would:

- Break the stratification: M1 would no longer be independently verifiable
- Create circular dependencies between planning and estimation
- Allow refinement logic to leak into the guarantee computation

## Consequences

- `RefinementPlanner` imports `ProxyResult<L>` but never writes to it
- `ConservativeProxy.ts` must never import from any `refinement/` module
- If a `ConservativeProxy` change is proposed during M2, the proposal must instead be filed as a bug against M1 (tagged to `m1-baseline`)

## References

- M1 baseline tag: `m1-baseline` in takt-theory
- M2 spec: `docs/iteration-02-refinement-planner.md`
