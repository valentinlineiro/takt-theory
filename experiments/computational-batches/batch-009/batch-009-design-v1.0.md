# Batch-009 Design Freeze: Impact-Weighted α_k

## 0. Nature of this batch

Batch-009 is a **mechanism validation experiment**, not an operational evaluation. It tests whether the weighted-averaging mechanism (replacing median with Impact-weighted mean) closes the BlindnessGap when Impact is correctly specified. The experiment uses oracle Impact (M_true) to isolate the mechanism hypothesis from the observability hypothesis.

The adversarial condition, cases, and metrics are identical to Batch-008. The single variable changed is the estimator: from α = 1 - median(ρ) to α_w^{oracle} = 1 - weighted_mean(ρ, Impact_true).

This is a causal separation experiment. It asks: "if the system had a perfect measure of causal relevance, would the weighted estimator solve the blindness?" The answer determines whether the next frontier is finding a corruption-resistant Impact signal (Result A), adding structure to the estimator (Result B), or abandoning the scalar hypothesis entirely (Result C).

## 1. Core hypothesis

\[
\alpha_w = 1 - \frac{\sum_{v \in B_k} \rho(v) \cdot Impact(v)}{\sum_{v \in B_k} Impact(v)}
\]

where:

\[
Impact(v) = |D_k \cap M_k(v)|
\]

That is: for each boundary node, Impact counts the number of decision-sensitivity dimensions that overlap with the node's observed capability signature. In the current case design, this is 0 (blank capabilities, non-overlapping) or 1 (matching the decision-relevant capability).

## 2. The topology constraint

An analysis of the candidate cases reveals a limitation:

| Case | Boundary nodes (with Impact>0) | α | α_w | Difference |
|------|-------------------------------|----|-----|------------|
| WRK-002 | 1 (t2, Impact=1) | 0.2 | 0.2 | 0 |
| WRK-003 | 2 (t2 Impact=1, t2_next Impact=1) | 0.1 | 0.1 | 0 |
| DEP-005 | 2 (v3 Impact=1, t Impact=0) | 0.1 | 0.2 | +0.1 |

For WRK-002 and WRK-003, α_w = α because the Impact weighting has no distinguishing information — all boundary nodes have equal decision relevance. The weighting only changes the estimate when boundary nodes have heterogeneous Impact values.

**This is not a design flaw — it's a finding about the cases.** The current topology produces few boundary nodes with uniform capabilities. The Impact weighting mechanism requires cases where:
- Multiple boundary nodes exist at the same k level
- Some have decision-relevant capabilities, others do not
- The critical (corrupted) node is among the high-Impact ones

Given the constraint of no new topologies in this batch, the experiment proceeds with the existing cases. Any difference between α and α_w will be driven entirely by DEP-005, where the blank-capability boundary node (t) dilutes the median.

**This is itself informative:** if the weighted estimator only differs from the median estimator in 1 of 3 cases, and that case (DEP-005) didn't produce mismatches in Batch-008, the overall BlindnessGap reduction will be small. This would imply that Impact weighting helps but requires richer boundary-node diversity to be effective — pointing to topology as the next variable.

## 3. Pre-analysis finding: the positive feedback ceiling

Before running any experiment, an analysis of the Impact definition reveals a fundamental problem:

### Impact(v) = |D_k ∩ M_k(v)| degrades under fn corruption

Empirical verification on all three candidate cases:

| Case | Node | True Impact | Obs Impact (corrupted) | Boundary node? |
|------|------|-------------|----------------------|----------------|
| WRK-002 | t2 | 1 (Dm∩Pm) | 0 (Pm flipped) | Yes (k=1) |
| WRK-003 | t2 | 1 (Dm∩Pm) | 0 (Pm flipped) | Yes (k=1) |
| WRK-003 | t2_next | 1 (Dm∩Pm) | 1 (Pm preserved) | Yes (k=2) |
| DEP-005 | v3 | 1 (Dr∩Pr) | 0 (Pr flipped) | Yes (k=1) |
| DEP-005 | t | 0 | 0 | Yes (k=1) |

For the decision point at k=1 (where DRU=0 due to corruption):

- **WRK-002**: sole boundary node t2 has Impact=0 → denominator = 0 → α_w undefined
- **WRK-003**: sole boundary node at k=1 (t2) has Impact=0 → same problem; t2_next has Impact=1 but is not a boundary node at the decision point (k=1)
- **DEP-005**: both boundary nodes (v3, t) have Impact=0 → denominator = 0

### The positive feedback problem

The corruption simultaneously:
1. Suppresses DRU (hides the need to expand)
2. Destroys Impact on the critical node (removes the weight that would signal need to expand)

This is not a bug in the estimator. It's a structural limitation: the estimator's weight depends on the same observed metadata that corruption targets. If the corruption can flip D_k∩M_k(v) from non-empty to empty, the weighted estimator is blind to the node that matters most.

### Implications for the design

This pre-analysis finding constrains the experimental design. Three possible paths:

#### Path A — Oracle Impact (mechanism test)

Use M_true for Impact computation. The system has access to the uncorrupted capability signature for weighting purposes. This is not epistemically valid (the system doesn't know M_true) but tests whether the weighted-averaging mechanism works in principle.

**If α_w with oracle Impact succeeds**: the mechanism is sound. The problem is finding a corruption-resistant Impact signal.
**If α_w with oracle Impact fails**: the mechanism itself (weighted average replacing median) is insufficient — even with correct weights, the estimator cannot close the BlindnessGap.

#### Path B — Accept the ceiling (theory finding)

Document that |D_k ∩ M_obs(v)| cannot work as an Impact definition under adversarial fn corruption. The estimator has a ceiling: it can only work when corruption preserves the capability dimensions that determine Impact. Since the adversarial condition is explicitly designed to suppress these dimensions, the ceiling is inherent.

This is itself a theoretical result: any estimator using only observable metadata values has a positive feedback vulnerability. TAKT gains a negative result: observable metadata value is insufficient to weight boundary nodes for epistemic risk estimation under adversarial corruption.

#### Path C — Structural Impact (valid, changes meaning)

Define Impact from graph properties that survive semantic corruption:
- Node degree (centrality)
- Boundary persistence (how many k levels the node remains a boundary node)
- Distance from focal element

These survive corruption because they depend on graph structure, not capability metadata. However, they may not correlate with decision relevance, reducing the estimator's effectiveness.

### Recommended path

**Path A (oracle Impact) for the primary experiment**, with Path B as the theoretical frame. The oracle test tells us whether the weighted averaging mechanism works in principle. If it does, the positive feedback ceiling is a separate problem (find a corruption-resistant Impact signal). If it doesn't, the mechanism itself is wrong.

The ceiling implication (Path B) is documented here as a pre-analysis finding rather than an experimental outcome. This changes the nature of Batch-009: it is no longer testing "does Impact weighting work?" but rather "does the weighted averaging mechanism close the BlindnessGap when Impact is correctly specified?"

### Practical implementation: oracle Impact

Impact(v) is derived from M_true(v) (the case definition's capabilities), which the system does NOT know in a real deployment. In simulation:

```ts
function computeOracleImpact(caseData: CaseData): Record<string, number> {
  const D_k = computeDecisionSensitivity(...);
  const impacts: Record<string, number> = {};
  for (const v of Object.keys(caseData.graph.capabilities)) {
    const M_true = caseData.graph.capabilities[v];
    const overlap = countMatchedDimensions(D_k, M_true);
    impacts[v] = overlap;
  }
  return impacts;
}
```

The oracle Impact is a fixed per-node weight, computed once from case definition data, never updated during episodes. This gives the weighted estimator its best chance.

## 4. New policy: ProbeWeighted@τ

\[
\pi_{\alpha_w}(I_k): \text{probe if } \alpha_w > \tau
\]

Same structure as ProbeReliability, but using α_w instead of α.

| Policy ID | Estimator | Threshold |
|-----------|-----------|-----------|
| ProbeWeighted0.3 | α_w | 0.3 |
| ProbeWeighted0.5 | α_w | 0.5 |
| ProbeWeighted0.7 | α_w | 0.7 |

Total policies: 9 (6 from Batch-008 + 3 ProbeWeighted variants).

## 5. Primary metric

\[
\Delta BlindnessGap = BlindnessGap_{\alpha} - BlindnessGap_{\alpha_w}
\]

Positive Δ means the weighted estimator reduces the gap. Δ = 0 means no improvement. Negative Δ means weighting makes things worse (possible with Option C, unlikely with Option B).

Secondary metrics (unchanged from Batch-008):
- DecisionMismatch rate
- α Error (using α_w instead of α)
- Regret
- Probe rate

## 6. Matrix

\[
4 \text{ incidences} \times 3 \text{ cases} \times 9 \text{ policies} \times 5 \text{ reps} = 540 \text{ evaluations}
\]

The 3 additional policies add 180 evaluations to Batch-008's 360. The Batch-008 results serve as the baseline for ΔBlindnessGap — no need to re-run them.

## 7. Three outcomes

### A — Full correction (Δ ≈ BlindnessGap_α)

α_w closes the gap for all cases where α failed. This requires DEP-005's difference (0.1 gap) to propagate to other cases. Given the topology constraint, this is unlikely — the weighting helps only where boundary nodes have heterogeneous Impact, which is only DEP-005.

### B — Partial improvement (0 < Δ < BlindnessGap_α)

The weighted estimator reduces BlindnessGap in DEP-005 but cannot help WRK-002 or WRK-003 (where all boundary nodes have equal Impact). This is the most likely outcome. It tells us: Impact weighting is directionally correct but requires richer topology to be effective.

### C — Deep failure (Δ ≈ 0)

If Option C is used (Impact computed from M_obs), the estimator degrades with corruption and fails to improve. Even with Option B, if the pre-computed Impact assignment doesn't distinguish boundary nodes enough, the result converges with α. This would establish that Impact(|D_k ∩ M_k|) is too coarse to differentiate boundary nodes — the Impact values are binary (0 or 1) under current case design.

## 8. Frozen

1. Impact definition: |D_k ∩ M_k(v)| with weights assigned from initial observation (pre-corruption)
2. Topology constraint: same 3 cases, no new topologies
3. Policies: 9 (6 existing + 3 ProbeWeighted)
4. Primary metric: ΔBlindnessGap
5. All Batch-008 frozen parameters (cost model, metrics, incidence levels, reps, ρ model)
6. A_{sparseFN} adversarial family inherited unchanged

## 9. Not in scope (deferred)

1. New graph topologies — needed for richer Impact heterogeneity, belongs in Batch-010
2. Alternative Impact definitions (global utility delta, topology-weighted)
3. Dynamic Impact (re-estimated at each k level)
4. Cascading multi-node corruption
