# Batch-008 Experimental Freeze: Adversarial α_k Blindness

## 0. Executive Summary

Batch-008 is the first TAKT experiment born from a theoretical prediction rather than empirical discovery. It tests whether α_k = 1 - median(ρ_boundary) can detect adversarial conditions where the system's estimate of information value is catastrophically wrong.

**Result: α_k fails across all tested configurations.** The estimator's dynamic range ([0.1, 0.2]) never reaches any of the tested thresholds (0.3, 0.5, 0.7), producing a 0% probe rate across all ProbeReliability variants. Cumulative BlindnessGap = 3.467 (the system consistently underestimates the value of expansion by ~3.5 utility points). The hypothesis `π_α(I_k) ≈ π*(I_k)` is falsified for the tested estimator `α_k = 1 - median(ρ)`.

**This is Scenario B (bounded failure), not Scenario C (impossibility).** The estimator fails because its signal-to-noise ratio is too weak under the 5-dimension capability model, not because no observable signal can detect epistemic blindness. The refinement path is clear: `α_k = f(ρ, Impact(v))` weighting boundary nodes by decision relevance rather than counting them equally.

### Unexpected finding: topology-dependent degeneracy

The adversarial condition itself is topology-dependent. Cases with 1 boundary node (WRK-002) produce α_k = 0.2 (one corrupted entry in the median), while cases with 2 boundary nodes suppress the signal further to α_k = 0.1 (median of [0.8, 1.0]). A case with 5+ boundary nodes would suppress it further still. The estimator's sensitivity to corruption is inversely related to the number of boundary nodes — the opposite of what safety would require.

## 1. Design

See `research/analysis/batch-008-question-freeze.md` and `research/analysis/batch-008-design-v1.0.md`. Key parameters:

| Parameter | Value |
|-----------|-------|
| Adversarial family | A_{sparseFN} — fn corruption, single critical node |
| Cases | WRK-002 (1 boundary), WRK-003 (2 boundary), DEP-005 (2 boundary) |
| Incidences | 0.00, 0.05, 0.10, 0.15 |
| Policies | AlwaysTrust, AlwaysVerify, ProbeAlways, ProbeReliability×3 |
| Repetitions | 5 |
| Total evaluations | 4 × 3 × 6 × 5 = 360 |
| Cost model | c_expand=1.0, c_verify=0.5, c_escalate=10.0 |
| ρ model | ρ(v) = match(orig, obs) / 5 dimensions; critical node has exactly 1 dim flipped |

## 2. Metrics

Four-layer measurement:

| Layer | Metric | Definition | Value |
|-------|--------|------------|-------|
| Estimator | α Error | α^{true} - α^{estimated} | 2.667 |
| Information | BlindnessGap | EVSI^{true} - EVSÎ | 3.467 |
| Decision | Mismatch rate | P(π_α ≠ π*) | 66.7% (ProbeReliability) |
| Economic | Regret | C(π_α) - C(π*) | -3.333 (ProbeReliability) |

## 3. Results by policy

### AlwaysTrust — 66.7% mismatch, cost 0.000
Baseline: the cost of suppressed DRU. When DRU=0 due to corruption, the system stops at k=1 and makes a decision on incomplete information. In 2 of 3 cases (WRK-002, WRK-003), this decision is globally suboptimal.

### AlwaysVerify — 0.0% mismatch, cost 3.833
Safety baseline: always expanding to kMax eliminates all decision mismatches, but at the highest cost (actions at every level + potential escalation). In WRK-003, DRU remains 1 at kMax despite expansion, forcing escalation at cost 10.0.

### ProbeAlways — 0.0% mismatch, cost 4.333
Single-probe recovery: expanding exactly one level eliminates all mismatches at cost 1.0 per probe. Higher cost than AlwaysVerify in these specific cases because AlwaysVerify only pays 0.5 per level. The cost advantage of AlwaysVerify is case-specific (WRK-003 escalates at 10.0, and AlwaysVerify absorbs this because DRU stays 1).

### ProbeReliability@0.3, 0.5, 0.7 — 66.7% mismatch, 0% probe rate
Complete failure: α_k ∈ [0.1, 0.2] across all configurations. The ρ signal from fn corruption (1 of 5 bits flipped → ρ=0.8) is too weak relative to the threshold. The median aggregation across boundary nodes further suppresses the signal when clean nodes outnumber corrupted ones.

**ProbeReliability degenerates to AlwaysTrust** — identical mismatch rate, identical cost, identical decisions. The α_k estimator provides no additional information relative to the baseline.

## 4. Results by case

| Case | Boundary nodes | α_k range | Mismatch (non-probing) | Why |
|------|---------------|-----------|----------------------|-----|
| WRK-002 | 1 (t2 at k=1) | 0.2 | 100% | t2's Pm flipped; system picks T1 at k=1 (suboptimal); probe reveals t2_next's pFail; picks T0 |
| WRK-003 | 2 (t2 at k=1, t2_next at k=2) | 0.1 | 100% | Same corruption; α_k lower due to median suppression; WRK-003 also suffers escalation need at kMax |
| DEP-005 | 2 (v3 and t at k=1) | 0.1 | 0% | t has blank capabilities, v3's Pr flipped; but T0 is optimal at BOTH k=1 and global for DEP-005. The corruption does not cause a decision mismatch even without probe. |

**DEP-005 is a false positive in the adversarial design:** the corruption successfully flips Pr on v3, but the optimal decision at k=1 (T0) happens to match the global optimum. The adversarial condition requires the optimal decision to differ between k=1 and k=2/global — DEP-005's utility structure doesn't produce this for the T0/T1 choice under this corruption.

This is itself informative: the adversarial condition is not just about suppressing DRU; it's about suppressing DRU specifically where the k=1 decision differs from the global optimum.

## 5. α_k failure analysis

### Root cause: weak ρ signal

The 5-dimension capability model produces ρ values in a narrow range under single-dimension fn corruption:

| Node state | ρ | α_k contribution |
|-----------|-----|-----------------|
| Clean | 1.0 (5/5) | 0.0 |
| 1 dim corrupted (fn) | 0.8 (4/5) | 0.2 |
| All dims corrupted | 0.0 (0/5) | 1.0 |

With one corrupted node (ρ=0.8) and 1-2 clean nodes (ρ=1.0), median ρ stays at 0.8-1.0, producing α_k in [0.0, 0.2]. The 0.3 threshold is never reached.

### Median aggregation amplifies the problem

The median against N boundary nodes with M corrupted:

| N boundary | M corrupted | ρ vector | Median ρ | α_k |
|-----------|-------------|----------|----------|-----|
| 1 | 1 | [0.8] | 0.8 | 0.2 |
| 2 | 1 | [0.8, 1.0] | 0.9 | 0.1 |
| 3 | 1 | [0.8, 1.0, 1.0] | 1.0 | 0.0 |
| 3 | 2 | [0.8, 0.8, 1.0] | 0.8 | 0.2 |

The median suppresses the signal from single-node corruption when the majority is clean. For α_k to reach 0.3, at least 50% of boundary nodes must have ρ ≤ 0.7, which requires corrupting most nodes' metadata — not a sparse adversarial attack.

### Impact of incidence on α_k

Incidence (0.00-0.15) has negligible effect on α_k because it only affects non-critical nodes randomly. At incidence=0.15, roughly 0-1 non-critical boundary nodes may have corrupted random dimensions, but these random corruptions may affect non-decision-relevant dimensions and don't consistently lower ρ.

## 6. Scenario classification

**Scenario B: bounded domain.** α_k fails within a clear boundary defined by:

\[
D_\alpha = \{ \theta : |B_k| \le 2 \land \text{critical node} \in B_k \land \text{fn flips exactly 1 of 5 dims} \}
\]

The estimator's failure is not a fundamental impossibility (Scenario C). It's a signal-to-noise ratio problem: the ρ penalty for fn corruption is small (0.2 per dimension), and the median aggregation suppresses minority signals.

**The EVSI Framework survives.** The failure is in the specific estimator `α_k = 1 - median(ρ)`, not in the general claim `α_k = f(observable signals) catches epistemic blindness`. The framework correctly predicts that ProbeAlways (a structural action that bypasses estimation) works where ProbeReliability fails.

## 7. Refinement path: DecisionImpact-weighted α_k

The root tension exposed by Batch-008:

\[
\text{Reliability mass} \neq \text{Decision relevance}
\]

Counting all boundary nodes equally (via median) weights clean majority more than corrupted minority. A weighted estimator would penalize low ρ only on decision-relevant nodes:

\[
\alpha_k^w = 1 - \frac{\sum_{v \in B_k} \rho(v) \cdot Impact(v)}{\sum_{v \in B_k} Impact(v)}
\]

Where DecisionImpact(v) quantifies "how much does this node's metadata matter for the decision?" In the adversarial condition, the critical node would have high Impact(v), and its low ρ (0.8) would be weighted accordingly.

This is not tested in Batch-008. It would require computing DecisionImpact per boundary node and defining the weighting function. This is the natural target for Batch-009.

## 8. Claims

| Claim | Status | Type |
|-------|--------|------|
| α_k = 1 - median(ρ) fails under sparse fn corruption | Established experimentally | Result |
| The failure is bounded, not fundamental | Supported by analysis | Hypothesis |
| Signal-to-noise ratio of ρ → α_k is the root cause | Supported by analysis | Hypothesis |
| ProbeAlways bypasses the estimation problem | Established experimentally | Result |
| Weighted α_k could resolve the failure | Untested (Batch-009 target) | Candidate principle |
| Topology (boundary node count) determines α_k sensitivity | Established experimentally | Result |
| DEP-005 design is a false positive (corruption ≠ mismatch) | Established experimentally | Result |

## 9. Batch-008 contribution to TAKT theory

Batch-008 is the first TAKT batch that attempted to falsify the theory's core claim and succeeded in finding a boundary. The value is not in confirming a hypothesis but in defining:

\[
Domain(\alpha)
\]

The estimator works when reliability mass ≈ decision relevance, i.e., when boundary nodes are approximately equally important. The estimator fails when a single low-reliability node carries disproportionately high decision relevance — which is exactly the adversarial condition the theory predicted.

This is a sign of a healthy theory: it made a precise prediction, the prediction was tested, and the boundary of validity was found. The next cycle (Batch-009) should test the refinement.
