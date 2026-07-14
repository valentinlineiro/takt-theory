# Batch-008 Question Freeze

## 1. Origin

EVSI Framework v1.1 proposes:

\[
\pi_{\alpha}(I_k) \approx \pi^*(I_k) \quad\text{where}\quad Stop_k \iff \widehat{EVSI}_k \le C_a(1+\alpha_k)
\]

Batch-008 is the first test of this prediction. Not "does ProbeAlways work?" (Batch-007 answered that), but **"can α_k detect when Probe is needed?"** — the first falsifiable prediction the theory generates.

## 2. Core question

\[
\boxed{\text{Can }\alpha_k\text{ detect situations where } \widehat{EVSI}_k \ll EVSI_k^{true}?}
\]

Equivalently: does there exist a measurable condition where the system believes it has sufficient evidence, but the world disagrees — despite α_k being correctly estimated from observable signals?

## 3. Adversarial design

The attack targets the weakest link in the π_α approximation: the mapping from observable signals (ρ, DRU, consistency) to α_k.

### Target condition

\[
\alpha_k^{estimated} \ll \alpha_k^{true}
\]

Where:
- `α_k^{estimated}` = what the system computes from I_k^{obs}
- `α_k^{true}` = the multiplier that would make Stop_k correct if known

### How to construct it

The system computes α_k from:

| Signal | When it fires | Blind spot |
|--------|---------------|------------|
| ρ (aggregate boundary) | High ρ → α_k low (trust estimate) | Sparse corruption: one critical node corrupted, rest clean. Median ρ stays high. |
| DRU | DRU=0 → α_k may increase (suspect silence) | Targeted corruption: a single capability flip on one node can suppress DRU. DRU stays 0. |
| Consistency | Node reappears with different M^{obs} across k | Boundary sets at consecutive k are disjoint — signal never fires in current topologies |

The adversarial condition requires **all three signals to fail simultaneously**:

1. Most boundary nodes are clean → ρ is high (median ≈ 1 - incidence)
2. One critical node has its capabilities flipped → DRU suppressed to 0
3. No node reappears in consecutive boundary sets → consistency silent

The system sees: high ρ, DRU=0, no consistency violation → α_k ≈ 0 → Stop.

The world sees: corrupted node changed the decision boundary → expanding would reveal the correct decision → EVSI_k^{true} > 0.

### The specific corruption

This requires a corruption type that:
- Is sparse (incidence at the node level, not the system level)
- Targets a single decision-relevant node
- Flips capabilities in a way that removes edges from O_k's boundary
- The node's ρ remains close to 1 - incidence (≈ 0.75-0.9 for clean nodes)
- But the false negative (fn) on that single node suppresses DRU

**This is a targeted fn at low incidence, with the median ρ across all boundary nodes remaining high enough to keep α_k low.**

In Batch-006 terms: incidence ≈ 0.10, fn type, on a case where a single boundary node's capabilities determine the decision-relevant overlap. The median of (boundary_rhos) ≈ 0.9 (since 90% of nodes are clean, ρ ≈ 0.9 for clean nodes at incidence=0.10). The one corrupted node has ρ ≈ 0.10. α_k = 1 - 0.9 = 0.1. Stop condition: EVSÎ_k ≤ 1.0 × (1 + 0.1) = 1.1.

If EVSI_k^{true} > 1.1 at this point, the theory fails.

## 4. Candidate cases from existing suite

From Batch-005, cases where a single boundary node's capabilities can change the decision:

| Case | Domain | Structure | Decision depends on |
|------|--------|-----------|-------------------|
| WRK-002 | WRK | Multi-step workflow | Capabilities of v1/v2 nodes at k=2 boundary |
| WRK-003 | WRK | Branching workflow | Capabilities of intermediate gateway node |
| DEP-005 | DEP | Chain with checkpoint | Capabilities of checkpoint node |

These cases have the property that a single node at the k=1 or k=2 boundary carries decision-relevant capability information. If that node's metadata is corrupted to fn, DRU drops to 0, but the decision changes.

## 5. Metric: BlindnessGap

The core question decomposes into two distinct failures that should be measured separately:

\[
BlindnessGap_k = EVSI_k^{true} - \widehat{EVSI}_k
\]

| Metric | What it measures |
|--------|------------------|
| Decision mismatch | Does the policy choose a different action than π*? |
| α error | Did α_k underestimate epistemic blindness? |
| BlindnessGap | How wrong was the EVSI estimate? |
| Cost regret | How much did the wrong decision cost? |

This separates "the policy failed" from "the estimate was wrong" — α could err slightly and cross the threshold, or be completely blind. BlindnessGap quantifies the distance.

## 6. Success scenario framework

Batch-008 is the first batch where the theory itself may be falsified. Three possible outcomes:

### Scenario A — α survives

\[
\alpha_k^{estimated} \approx \alpha_k^{true}
\]

even under targeted sparse corruption. TAKT gains a strong property: epistemic blindness is detectable via aggregate observable signals.

### Scenario B — α fails with a clear boundary

For example: `incidence < 0.15 ∧ single critical node ⇒ failure`. This does not invalidate TAKT — it defines:

\[
Domain(\alpha)
\]

and opens a refinement: \(\alpha_k = f(\rho, Impact(v))\). The framework survives but the estimator is incomplete.

### Scenario C — α fails completely

Small arbitrary corruptions make it impossible to estimate epistemic blindness from observable signals. This yields a deeper result:

\[
\boxed{\text{No estimator based solely on observation reliability can guarantee stopping under adversarial blindness}}
\]

ProbeAlways would transition from heuristic to **epistemic safety policy** — the only action that bypasses the estimation problem entirely.

## 7. The real bet of Batch-008

The definition \(\alpha_k = 1 - median(\rho_{boundary})\) comes from ProbeReliability in Batch-007, but Batch-008 elevates it to a **general estimator of epistemic blindness**. That is the real bet:

\[
\text{Can a local signal of reliability represent global epistemic risk?}
\]

The answer could be no without destroying EVSI Framework. A possible discovery:

\[
\alpha_k = f(\rho, DRU, topology, decision\ sensitivity)
\]

meaning the framework survives but the current estimator is too weak. The root tension is:

\[
\text{Reliability mass} \neq \text{Decision relevance}
\]

Confidence weighted by node count is not the same as confidence weighted by causal influence. Batch-008 may surface this as a formal gap.

## 8. Success criterion

The experiment succeeds if it finds a measurable condition where:

\[
\boxed{\pi_{\alpha}(I_k) \neq \pi^*(I_k)}
\]

Specifically: a configuration where α_k^{estimated} ≈ 0 (system chooses Stop) but EVSI_k^{true} > C_a (expanding would change the decision).

The experiment does NOT need to break all policies. It needs to find **the boundary** where α_k fails. If α_k survives all tested adversarial conditions, that strengthens the theory. If it fails at a specific boundary, that boundary defines the theory's domain of validity.

## 6. Frozen

The following are frozen and will not change during this batch:

1. EVSI Framework v1.1's stopping condition: Stop_k iff EVSÎ_k ≤ C_a(1+α_k)
2. α_k defined as 1 - median(ρ_boundary) when ρ is available (from Batch-007)
3. The adversarial target: α_k^{estimated} << α_k^{true} via sparse targeted fn corruption
4. Success criterion: find the boundary where π_α(I_k) ≠ π*(I_k)
5. Cases from Batch-005 suite (no new graph topologies — topology sensitivity is a separate question)
6. No new corruption types — C_θ modes from Batch-006/007 are sufficient to construct the adversarial condition

## 7. Open for design

1. Exact incidence sweep for the adversarial condition (likely 0.05, 0.10, 0.15 — sparse enough to keep median ρ high)
2. Number of targeted nodes per case (1 critical node vs 2-3)
3. Whether to include ρ-mode=none scenarios (where α_k cannot be estimated at all → forces probe, trivial case)
4. Second-pass: topology sensitivity (different graph classes) — only if primary matrix confirms the adversarial condition exists
