# Batch-008 Design Freeze

## 0. Nature of this batch

Batch-008 is the first TAKT experiment born from a theoretical prediction rather than empirical discovery. It does not ask "what happens if X?" but "is the theory's central claim false?"

\[
\text{Question} \rightarrow \text{Prediction} \rightarrow \text{Experiment} \rightarrow \text{Falsification}
\]

This changes the design logic: the adversarial condition is constructed to break the theory, not to explore a mechanism.

## 1. Core hypothesis under attack

EVSI Framework v1.1 proposes:

\[
\pi_{\alpha}(I_k) \approx \pi^*(I_k) \quad\text{where}\quad \alpha_k = 1 - median(\rho_{boundary})
\]

The specific claim being tested: a local aggregate signal of reliability (median ρ across boundary nodes) can represent global epistemic risk (whether the system should act or acquire more evidence).

## 2. Adversarial family: A_{sparseFN}

Formal definition:

\[
A_{sparseFN} = \{ \theta : corruptionMode=fn, |V_{corrupt}|=1, incidence \in \{0.05,0.10,0.15\}, \text{rest of boundary clean} \}
\]

Properties:
- **fn only**: false negatives — a critical node's capabilities are reported as absent
- **single critical node**: exactly one decision-relevant node is corrupted
- **low incidence**: 5-15% overall, keeping median ρ high
- **boundary disjointness**: consecutive B_k ∩ B_{k-1} = ∅, suppressing consistency signal
- **DRU suppression**: the single fn flip removes edges from O_k's boundary, setting DRU=0

The attack chain:

\[
\text{sparse fn} \rightarrow \text{DRU=0} \rightarrow \text{median}(\rho) \text{ high} \rightarrow \alpha_k \approx 0 \rightarrow Stop
\]

The system sees: "reliable metadata, no uncertainty, stop." The world contains: "the decision boundary has shifted — expansion would change the optimal action."

## 3. Independent variables

\[
\theta = (incidence, case, policy)
\]

| Variable | Levels | Rationale |
|----------|--------|-----------|
| incidence | 0.00 (clean), 0.05, 0.10, 0.15 | Low enough that median ρ stays \(\ge 0.85\) |
| case | WRK-002, WRK-003, DEP-005 | Single critical node determines decision boundary |
| policy | AlwaysTrust, AlwaysVerify, ProbeAlways, ProbeReliability@0.3, ProbeReliability@0.5, ProbeReliability@0.7 | α_k-dependent vs baselines |

**Excluded from primary matrix:**
- New graph topologies (topology sensitivity is a separate question for second pass)
- AdaptiveThreshold (does not use α_k, adds no signal about the hypothesis)
- ProbeConsistency (still non-exercisable under boundary disjointness)
- ρ-mode=none (α_k cannot be estimated at all → forces probe, trivial negative)
- Cascade modes (not relevant to the single-episode adversarial condition)

## 4. Primary metrics

Four metrics, each measuring a distinct failure layer:

### BlindnessGap (theoretical)

\[
BlindnessGap_k = EVSI_k^{true} - \widehat{EVSI}_k
\]

How wrong was the EVSI estimate? Positive gap means the system undervalues expansion.

### DecisionMismatch (decision)

\[
DecisionMismatch = \mathbf{1}[\pi_{\alpha}(I_k) \neq \pi^*(I_k)]
\]

Did α_k lead to a different action than optimal? Binary — the policy either matched π* or it didn't.

### Regret (economic)

\[
Regret = C(\pi_{\alpha}) - C(\pi^*)
\]

How much did the wrong action cost? Continuous — distinguishes near-misses from catastrophic failures.

### α Error (estimator)

\[
\alpha Error = \alpha^{true} - \alpha^{estimated}
\]

Where α^{true} = 1 - median(ρ_{boundary}^{uncorrupted}) in simulation. Measures whether the estimator is biased, not just whether the decision is wrong.

## 5. Matrix

\[
4 \text{ incidences} \times 3 \text{ cases} \times 6 \text{ policies} \times 5 \text{ reps} = 360 \text{ evaluations}
\]

Each evaluation is a complete DRU loop (k=0..2) with the corruption applied at k=0. Scorecards collect per-k metrics and aggregate BlindnessGap, DecisionMismatch, Regret, α Error per episode.

## 6. Success criteria (three outcomes)

### Outcome A — Robust estimator

\[
BlindnessGap \approx 0 \quad \forall \theta \in A_{sparseFN}
\]

α_k survives targeted adversarial corruption. TAKT gains: epistemic blindness is detectable via aggregate reliability signals.

### Outcome B — Bounded domain

There exists a boundary \(D_\alpha \subset A_{sparseFN}\) where:

\[
\theta \in D_\alpha \Rightarrow BlindnessGap \gg 0
\]

but outside \(D_\alpha\), α_k works. The framework survives; the estimator is incomplete. Opens the refinement: \(\alpha_k = f(\rho, Impact(v))\). The key finding would be the boundary itself — quantified by (incidence, criticality) coordinates.

### Outcome C — Impossibility

Across all tested \(\theta\):

\[
\exists \theta \in A_{sparseFN} : BlindnessGap \gg 0 \land \neg\exists \text{ observable signal distinguishing } \theta \text{ from clean}
\]

**No estimator based solely on observation reliability can guarantee stopping under adversarial blindness.** This would transition ProbeAlways from heuristic to *epistemic safety policy* — a structural action that bypasses the estimation problem entirely, because the estimation problem is unsolvable in the general case.

## 7. Frozen

1. Adversarial family: \(A_{sparseFN}\) as defined above
2. Cases: WRK-002, WRK-003, DEP-005 only (no new topologies)
3. Four metrics: BlindnessGap, DecisionMismatch, Regret, α Error
4. Three outcome scenarios: A/B/C as success criteria
5. Policy set: 6 policies (AlwaysTrust, AlwaysVerify, ProbeAlways, ProbeReliability@0.3/0.5/0.7)
6. Repetitions: 5
7. Cost model: unchanged from Batch-007 (c_expand=1.0, c_verify=0.5, c_escalate=10.0)

## 8. Design decisions (closed)

### Critical node selection: analytical, by DecisionImpact

\[
v^* = \arg\max_v DecisionImpact_{Batch005}(v)
\]

White-box attack: the experiment knows where the causal leverage is and attacks there. This keeps the experiment falsable — a single degree of freedom, not a search.

Batch-009 can map the failure surface across all nodes if Outcome B or C emerges. But Batch-008 asks: "given that we know this node matters, can α_k detect it?" Not "can α_k discover importance?"

### DecisionImpact: frozen from Batch-005

Not recomputed. Batch-008 tests EVSI and α_k, not DecisionImpact. Recomputing would conflate two theories: value of information vs detection of causal relevance. DecisionImpact_{Batch005} enters as a pre-established experimental condition.

## 9. Not in scope (deferred)

1. ρ-mode=none secondary matrix — second pass, only if Outcome B or C emerges
2. 2-3 critical nodes (mild cascade) — secondary matrix, same condition
3. New graph topologies — topology sensitivity is a separate question
4. AdaptiveThreshold policy — does not use α_k, adds no signal about the hypothesis
5. ProbeConsistency — still non-exercisable under boundary disjointness
