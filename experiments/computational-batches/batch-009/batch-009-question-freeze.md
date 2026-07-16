# Batch-009 Question Freeze: Impact-Weighted α_k

## 0. Origin

Batch-008 falsified the hypothesis that α_k = 1 - median(ρ_boundary) can detect adversarial blindness. The root cause: reliability mass ≠ decision relevance. The median aggregates boundary nodes equally, so a low-reliability/high-impact minority is suppressed by a high-reliability/low-impact majority.

Batch-009 tests the refinement: can DecisionImpact weight transform local reliability signals into a global epistemic risk estimate?

## 1. Core question

\[
\boxed{\text{Does DecisionImpact contain the information needed to close the BlindnessGap?}}
\]

Equivalently:

\[
\pi_{\alpha_w}(I_k) \approx \pi^*(I_k) \quad\text{where}\quad
\alpha_w = 1 - \frac{\sum_{v \in B_k} \rho(v) \cdot Impact(v)}{\sum_{v \in B_k} Impact(v)}
\]

The unweighted median version is the Batch-008 failure case. The weighted version is the Batch-009 hypothesis. The adversarial condition (A_{sparseFN}) is identical, making this a direct comparison of the estimator, not a new experimental domain.

## 2. Hypothesis under attack

Not "DecisionImpact improves α" — that's too weak and could be true even if the improvement is trivial.

The real hypothesis:

\[
\boxed{\begin{aligned}
&\text{Can causal relevance transform a local reliability signal} \\
&\text{into a global estimate of epistemic risk?}
\end{aligned}}
\]

The specific prediction: weighting by DecisionImpact closes the BlindnessGap because the critical node (low ρ, high Impact) now contributes proportionally to its causal weight, preventing the clean majority from masking the risk.

## 3. Adversary: A_{sparseFN} (inherited from Batch-008)

Identical adversarial condition, unchanged:

| Parameter | Value |
|-----------|-------|
| Corruption | fn (flip decision-relevant capability true→false) |
| Critical node | Exactly one (v* = argmax DecisionImpact) |
| Incidence | {0.00, 0.05, 0.10, 0.15} |
| Cases | WRK-002, WRK-003, DEP-005 |
| Policies | AlwaysTrust, AlwaysVerify, ProbeAlways, ProbeReliability×3, ProbeWeighted (new) |
| Reps | 5 |
| Total | 4 × 3 × 7 × 5 = 420 evaluations |

**Why keep A_{sparseFN} identical**: the grieta is already mapped. Batch-008 proved that `low ρ + high Impact` is invisible to median aggregation. Batch-009 asks whether the same condition becomes visible when Impact is used as weight. Changing the adversary would conflate two variables.

### New policy: ProbeWeighted

A single new policy replaces the unweighted α_k estimator with the weighted version:

```
ProbeWeighted@τ: if α_w > τ → probe (cost 1.0); else stop
```

τ thresholds: {0.3, 0.5, 0.7} — same as ProbeReliability for direct comparison.

### DecisionImpact computation

Impact(v) must be computable from observable information at k. For the Batch-005 framework, the natural definition:

\[
Impact(v) = \begin{cases}
|D_k \cap M_k(v)| & \text{if } \gamma_k(v) = 1 \land connected(v, f) \\
0 & \text{otherwise}
\end{cases}
\]

Where |D_k ∩ M_k(v)| counts the number of sensitivity dimensions that overlap with the node's capability signature. This equals 1 for all boundary nodes with matching capabilities in the current case design, but the formula generalizes naturally.

For the simulation, Impact(v) can also be computed as the global utility difference between the best intervention with M_obs(v) vs. M_obs_without_v — but this requires global oracle access, which the system doesn't have. The experimental comparison uses the observable definition.

## 4. Three outcomes

### A — Full correction

\[
BlindnessGap_{\alpha_w} \approx 0
\]

DecisionImpact fully closes the gap. Weighting by causal relevance is sufficient to transform local ρ into global epistemic risk. This would be the strongest result Batch-009 could produce: the refinement path is correct and complete.

### B — Partial improvement

\[
0 < BlindnessGap_{\alpha_w} < BlindnessGap_{\alpha}
\]

Impact helps but does not suffice. The next refinement layer would be:

\[
\alpha = f(\rho, Impact, Topology)
\]

This tells us that observable local information (ρ + Impact) is directionally correct but missing something — likely topology-dependent (how many boundary nodes, graph degree distribution).

### C — Deep failure

\[
BlindnessGap_{\alpha_w} \approx BlindnessGap_{\alpha}
\]

DecisionImpact adds nothing. This would be a significant theoretical finding:

\[
\boxed{\text{Observable causality is insufficient to estimate information value under adversarial blindness}}
\]

The implication: only structural actions (ProbeAlways) can guarantee epistemic safety, because the estimation problem is fundamentally unsolvable from observable signals alone. This would elevate ProbeAlways from heuristic to principle.

## 5. Success criterion

The experiment succeeds if it produces a clear outcome among A/B/C. "Clear" means the difference between BlindnessGap_w and BlindnessGap is statistically significant (>1 utility point) given 60 evaluations per policy per condition.

The most valuable outcome is B or C — both define a boundary of the refinement and point to the next theoretical gap. Outcome A is the least informative (it only confirms the refinement, closing this research line without generating new questions).

## 6. Frozen

1. Adversarial family: A_{sparseFN} identical to Batch-008
2. Cases: WRK-002, WRK-003, DEP-005
3. Policies: 7 (previous 6 + ProbeWeighted@τ)
4. Estimator: α_w = 1 - weighted_mean(ρ, Impact)
5. Impact definition: |D_k ∩ M_k(v)| for boundary nodes (observable)
6. τ thresholds: {0.3, 0.5, 0.7}
7. All metrics, cost model, incidence levels unchanged from Batch-008
8. BlindnessGap computed identically to Batch-008 for comparability

## 7. Not in scope (deferred)

1. New corruption types or graph topologies
2. Multiple critical nodes / cascades
3. Alternative Impact definitions (e.g., global utility delta — requires oracle access)
4. Topology-weighted α (requires new graph classes)
5. Dynamic α_k thresholds (τ adapted per k or per case)
