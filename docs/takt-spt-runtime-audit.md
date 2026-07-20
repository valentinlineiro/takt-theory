# TAKT Runtime — SPT v1.1 Audit

**Purpose:** Map every component of the existing runtime to its SPT v1.1
counterpart. Identify invariants, gaps, and refactoring risks before
touching code.

---

## Layer 1: Direct Mapping

### Core primitives (`cli/src/takt-core/`)

| File | Existing component | SPT counterpart | Status |
|------|-------------------|-----------------|--------|
| `types.ts` | `TrajectoryPrefix<S,A>` | Domain element $x \in X$ (partial trajectory) | ✓ Exact |
| `types.ts` | `AgentPolicy<S,A,O>` | Morphism $C: \text{prefix} \to \text{action}$ | ✓ Exact |
| `types.ts` | `ReferencePolicy<S,A>` | Property $\Phi: \text{prefix} \to \text{ideal action}$ | ✓ Exact |
| `margin.ts` | `computeDynamicMargin()` | Property $\Phi$ (margin cost) | ✓ Exact |
| `margin.ts` | `C_h^max` | Conservative bound on $\Phi$ | ✓ Exact |
| `coverage.ts` | `prefixCoverage()` | Pullback structure $\sigma_C$ | ✓ Exact |
| `trajectory.ts` | Observational equivalence | Structure on domain induced by $C$ | ✓ Exact |

### Runtime components (`cli/src/runtime/`)

| File | Existing component | SPT counterpart | Status |
|------|-------------------|-----------------|--------|
| `TrajectoryMonitor.ts` | Event accumulation | Observation history $H$ | ✓ Exact |
| `DynamicMarginEstimator.ts` | $M_D(\tau_{:t})$ | Property $\Phi$ evaluated on trajectory | ✓ Exact |
| `TransitionEstimator.ts` | $\hat{P}(s' \mid s, a)$ | Morphism $C: P^* \to \hat{P}$ (estimation) | ✓ Exact |
| `UncertaintySet.ts` | $\varepsilon_0/\sqrt{n}$, $p_{\max}$ | Fibre width / DRU (ℝ-pseudometric case) | ✓ Instance |
| `RobustMarginEstimator.ts` | $\min_{P^* \in U_t} M_D(P^*)$ | Conservative proxy $\Phi^\downarrow$ for ℝ | ✓ Instance |
| `ValidityMonitor.ts` | Drift detection | Non-stationarity detection | ✓ Operational |
| `AuditPolicy.ts` | `decide()` / `decideSafe()` | Partial policy $\pi$ ({Act, Refine} only) | ✓ Partial |
| `ContractEvaluator.ts` | Loss tracking | DRU monitoring / Ω metrics | ✓ Partial |

### Design contracts (`docs/03-design-contracts/`)

| Contract | SPT counterpart | Status |
|----------|-----------------|--------|
| D-001: Static margin $M(R)$ | Property $\Phi$ | ✓ Formalized in Lean |
| D-002: Coverage | Structure $\sigma_C \preceq \tau_\Phi$ | ✓ Formalized |
| D-003: Dynamic safety contracts | Refinement + proxy lifecycle | ✓ Formalized |

---

## Layer 2: Invariants

These invariants hold in the existing runtime and must be preserved
through any refactoring.

### Invariant 1: Proxy safety

The conservative margin must be a true lower bound:

$$ \text{current: } M_D^{\text{safe}}(\hat{P}, \varepsilon) = \min_{P^* \in U_t} M_D(P^*) $$

$$ \text{guarantee: } M_D^{\text{safe}}(\hat{P}, \varepsilon) \leq M_D(P^*) \text{ for all } P^* \in U_t $$

**Where it's enforced:** `RobustMarginEstimator.ts:15-19` (min over
uncertainty set). The `UncertaintySet.pMax` ensures $P^*$ inclusion
with Hoeffding confidence.

**Refactor risk:** Any generalization of `RobustMarginEstimator` to a
generic `ConservativeProxy` must preserve this guarantee. The min
over set is the correct meet for ℝ; switching to a different meet
operation (or a different structure type) requires its own safety proof.

### Invariant 2: Refinement monotonicity

When uncertainty contracts (more data → smaller ε → smaller fibre),
the proxy must improve:

$$ \varepsilon_1 \leq \varepsilon_2 \implies M_D^{\text{safe}}(\hat{P}, \varepsilon_1) \geq M_D^{\text{safe}}(\hat{P}, \varepsilon_2) $$

**Where it's enforced:** `UncertaintySet.ts` — $\varepsilon_0/\sqrt{n}$
decreases monotonically with $n$. `RobustMarginEstimator` uses $p_{\max}$
which shrinks with $\varepsilon$, so margin increases.

**Refactor risk:** Formalized as Theorem 9 in SPT v1.1. Any refinement
planner must verify monotonicity across the chain $C_0 \to C_1 \to C_2$.

### Invariant 3: Safety-first policy

The policy must never Act when the proxy cannot guarantee safety:

$$ M_D^{\text{safe}}(\hat{P}, \varepsilon) \leq \theta \implies \text{not ACT} $$

**Where it's enforced:** `AuditPolicy.decideSafe()` — INTERVENE or
RECALIBRATE when margin < θ; MONITOR_SAFE only when margin ≥ θ.

**Refactor risk:** The four-action policy $\pi^*$ (Act, Refine, Escalate,
Stop) must preserve this invariant. The refinement planner and escalation
path are additional actions, not replacements for the safety check.

### Invariant 4: Streaming correctness

Online computation matches batch computation:

$$ M_D^{\text{stream}}(\tau_{:t}) = M_D^{\text{batch}}(\tau_{:t}) $$

**Where it's enforced:** runtime test R0 (R0-R5 streaming correctness).

**Refactor risk:** Any new pipeline stage (refinement planner, DRU
estimator, collapse detector) must not couple into the streaming path
in a way that breaks this equality.

---

## Layer 3: Exact Gaps

### Gap M1 — Generic meet-over-fibre (mathematical)

**Current state:** `RobustMarginEstimator` hardcodes the ℝ-pseudometric
meet ($\min$). There is no `ConservativeProxy<S, A, L>` generic over
structure type $(L, \sqsubseteq, \sqcap)$.

**Required:**

```typescript
interface MeetSemilattice<L> {
  leq(a: L, b: L): boolean
  meet(values: L[]): L
}

interface ConservativeProxy<S, A, L> {
  // Φ^↓(y) = ⊓_{x ∈ C^{-1}(y)} Φ(x)
  evaluate(context: Context<S, A>, property: Property<S, A, L>): ProxyResult<L>
}
```

**Priority:** High. Without this, the proxy concept cannot be extended
to other structure types (sets, lattices, preorders).

**Existing data:** `RobustMarginEstimator`, `UncertaintySet`,
`DynamicMarginEstimator` already compute a correct ℝ-instance. The
abstraction must not regress this.

---

### Gap M2 — Refinement planner (operational)

**Current state:** `RECALIBRATE` resets uncertainty but does not
search over alternative morphisms $C'$.

**Required:**

```typescript
interface RefinementPlanner<S, A> {
  // Given current C and proxy collapse, find best refinement C'
  plan(context: Context<S, A>): RefinementOption<S, A>[]
  // EVSI: expected improvement in proxy vs cost
  evaluate(option: RefinementOption): { benefit: number; cost: number }
}
```

**Priority:** High. This is the primary operational mechanism when
proxy collapses. Without it, the loop is incomplete.

**Existing data:** The codebase has experience with what refinements
work (trajectory expansion, observation enrichment, model recalibration)
but no structured planner.

---

### Gap G1 — Full π* (governance)

**Current state:** `AuditPolicy.decide()` returns
{MONITOR, INTERVENE, RECALIBRATE, MONITOR_SAFE}. This is a subset of
the required actions: Escalate (to human) and Stop (irrecoverable
failure) are missing.

**Required:**

```typescript
enum GovernanceAction {
  ACT,       // Proxy sufficient — proceed
  REFINE,    // Proxy insufficient, refinement available and cost-effective
  ESCALATE,  // Proxy insufficient, refinement too costly — hand to human
  STOP       // Proxy insufficient, no further options — fail safe
}
```

**Priority:** Medium. The existing three-action policy covers the most
common cases. Escalate and Stop are edge cases but critical for safety.

**Existing data:** The `ContractEvaluator` could track escalation and
stop events, but these channels don't exist yet.

---

### Gap G2 — Proxy collapse detection (observability)

**Current state:** No metric tracks whether the proxy has collapsed to
$\bot$ uniformly across all fibres. `UncertaintySet` tracks per-(s,a)
uncertainty but doesn't aggregate to a collapse signal.

**Required:**

```typescript
interface CollapseDetector<L> {
  // Is the proxy uniformly ⊥ across all reachable fibres?
  isCollapsed(proxy: ProxyResult<L>[]): boolean
  // What fraction of fibres have proxy = ⊥?
  collapseRate(proxy: ProxyResult<L>[]): number
}
```

**Priority:** Medium. Collapse detection is the trigger for the
transition from "proxy mode" to "refinement mode."

**Existing data:** Not present. Requires new aggregation logic.

---

### Gap G3 — DRU as fibre width (observability)

**Current state:** DRU is implicit in `UncertaintySet` ($\varepsilon$)
and `RobustMarginEstimator` (gap between $M_D^{\text{safe}}$ and
$M_D$). But there's no explicit DRU: `width(Φ(C^{-1}(y)))`.

**Required:**

```typescript
interface DecisionRelevantUncertainty<L> {
  // DRU(y) = sup Φ(C^{-1}(y)) - inf Φ(C^{-1}(y))
  width(context: Context<S, A>, property: Property<S, A, L>): L
  // Is the width small enough for reliable decisions?
  isActionable(dru: L, threshold: L): boolean
}
```

**Priority:** Low. The information is derivable from existing
components. Formal extraction would help but is not blocking.

---

### Gap G4 — Composition of morphisms (mathematical)

**Current state:** Only single morphisms exist (mostly
$C: \text{prefix} \to \text{action}$ or $C: P^* \to \hat{P}$). No
composition $C = C_2 \circ C_1$.

**Required:**

```typescript
interface MorphismComposer<S, A> {
  compose<M1, M2>(c1: Morphism<S, M1>, c2: Morphism<M1, M2>): Morphism<S, M2>
  // Verify Thm 9: refinement improves proxy
  monotonicity<L>(c1: Morphism, c2: Morphism, property: Property<S, A, L>): boolean
}
```

**Priority:** Low. Composition is needed for multi-stage pipelines
(sensor → feature → decision) but the current single-stage setup
covers the main use cases.

---

## Layer 4: Refactor Risks

### Risk A — Overgeneralization of the proxy

**Scenario:** Converting `RobustMarginEstimator` into a generic
`ConservativeProxy<L>` before the generic interface is stable.

**Consequence:** The generic interface forces design decisions that
constrain future structure types. The ℝ-pseudometric case is well
tested (131 tests); introducing a generic abstraction risks breaking
the validated behavior.

**Mitigation:** Keep the existing `RobustMarginEstimator` as the
ℝ-instance. Add the generic interface alongside it, then if needed
refactor `RobustMarginEstimator` to implement the interface.
Sequence: add interface → implement → verify invariants → (if needed)
refactor existing.

### Risk B — Confusing DRU with statistical uncertainty

**Scenario:** Renaming `UncertaintySet.epsilon` to `DRU` and treating
the Hoeffding bound as the definition of decision-relevant uncertainty.

**Consequence:** The theory is clear: DRU = width of $\Phi(C^{-1}(y))$,
which for the ℝ-pseudometric case happens to be proportional to
$\varepsilon_0/\sqrt{n}$. But for other structure types, DRU may take
a completely different form. Hardcoding the equivalence creates
confusion when extending.

**Mitigation:** Keep `UncertaintySet.epsilon` as-is. Add a separate
`DRU<L>` component that computes width generically. The current
$\varepsilon$ is one specific DRU instance (for ℝ-pseudometric).

### Risk C — π* before proxy stability

**Scenario:** Implementing the four-action governance loop before the
generic proxy and refinement planner are operational.

**Consequence:** The Escalate and Stop actions have no operational
justification without the proxy and refinement planner. They become
dead code or, worse, trigger incorrectly.

**Mitigation:** Implement in dependency order:
1. Generic proxy interface (Gap M1)
2. Refinement planner (Gap M2)
3. Full π* with four actions (Gap G1)
4. DRU and collapse detection (Gaps G2, G3) — can be parallel with 2
5. Composition (Gap G4) — last, only if needed

### Risk D — Breaking streaming correctness

**Scenario:** Adding the refinement planner or collapse detector to the
streaming pipeline introduces latency or state coupling.

**Consequence:** Invariant 4 (streaming = batch) breaks. Tests R0-R5
fail.

**Mitigation:** The refinement planner operates at the DECISION
frequency (when proxy is evaluated), not at the EVENT frequency (when
trajectories are ingested). Keep them in separate pipelines.

---

## Summary table

| Gap | Component | Current state | Required | Priority | Dependencies |
|-----|-----------|---------------|----------|----------|-------------|
| M1 | Generic proxy | `RobustMarginEstimator` (ℝ only) | `ConservativeProxy<L>` interface | High | — |
| M2 | Refinement planner | `RECALIBRATE` resets only | `RefinementPlanner` with EVSI | High | M1 |
| G1 | Full π* | {Act, Refine} only | {Act, Refine, Escalate, Stop} | Medium | M1, M2 |
| G2 | Collapse detection | Not present | `CollapseDetector` | Medium | M1 |
| G3 | DRU as fibre width | Implicit in `UncertaintySet` | `DRU<L>` explicit component | Low | M1 |
| G4 | Composition | Not present | `MorphismComposer` | Low | M1 |

### Implementation order

```
Iteration 1: M1 (generic proxy interface + ℝ instance)
Iteration 2: M2 (refinement planner)
Iteration 3: G1 (full π*), G2 (collapse), G3 (DRU) — parallel
Iteration 4: G4 (composition) — if needed
```

### Null hypothesis

If after adding these components the runtime shows no improvement over
the existing `AuditPolicy` + `RECALIBRATE` loop, the theoretical
extension is not operationally useful for this domain. That would be
a valid finding — the theory is correct but the extra machinery doesn't
matter in practice.
