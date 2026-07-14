# Batch-010 Design Freeze — Dimensional Loss Detection via ΔΩ

**Status**: Frozen
**Tags**: EVSI Framework, Ω Formalism, representation theory, ARCH core
**Prerequisites**: omega-formalism-v0.1.md, batch-008-experimental-freeze, batch-009-experimental-freeze, batch-0091-experimental-freeze

---

## Question

\[
\boxed{
\text{Can } \Delta\Omega \text{ detect relevant information loss when } \alpha \text{ cannot?}
}
\]

Batch-008 and Batch-009 tested whether α = f(ρ, Impact) can detect epistemic blindness. They proved α ≤ 1 − ρ_min = 0.2 under A_{sparseFN}. Batch-009.1 proved no latent signal exists in ρ — the bottleneck is the representation, not the estimator.

Batch-010 tests whether a richer state vector Ω preserves information that α discards.

---

## Primary hypothesis

\[
H_1: \exists i \in \Omega : \text{Loss}_i(\Omega_k, \Omega_{k+1}) > \varepsilon_i

\quad \text{when} \quad

\alpha_k < \tau
\]

i.e.:

\[
\boxed{
\Delta\Omega > \varepsilon \ \land \ \alpha \leq \tau
}
\]

---

## Change in object of study

Batch-008/009 asked:

> Can we estimate risk?

Batch-010 asks:

> Can we detect that our representation degraded?

Separation:

| Concept | Object | Question |
|---------|--------|---------|
| Observability | Ω | Did we lose information? |
| Decision Value | EVSI | Is it worth recovering it? |

α tried to answer both at once. Ω answers only the first.

---

## Design

### Keep constant

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Adversary | A_{sparseFN} | Same model — isolates signal change |
| Cases | WRK-002, WRK-003, DEP-005 | Same topology triplet |
| Incidences | 0.00, 0.05, 0.10, 0.15 | Same range |
| Cost model | c_expand=1.0, c_verify=0.5, c_escalate=10.0 | Same policy evaluation |
| kMax | Per case (all 2) | Same expansion depth |

No changes to the adversarial model until we know whether the representation level produces signal.

### New capture: Ω state per transition

For each run k → k+1, persist:

```
OmegaState {
  step: k,

  observation:
    nodes
    edges
    capabilities,

  dru:
    unknownDecisionRelevant,

  rho:
    boundaryReliabilityVector,

  topology:
    boundaryCount
    degreeStats (mean, var, min, max)
    redundancy (disjoint paths)
    communities,

  memory:
    previousStates,

  context
}
```

This is the first experiment where the system records its own state, not just the decision output.

### Signals to evaluate independently

No single |ΔΩ| — that would repeat the α mistake (compressing before understanding which dimension carries the signal).

#### 1. ΔO — Observable change

\[
d_O = |O_{k+1} \triangle O_k|
\]

Symmetric difference of node sets between expansion steps. Detects whether the structure of what becomes visible changes under corruption.

**Prediction**: Under A_{sparseFN}, corrupted capabilities may change which nodes appear at k+1, producing d_O > 0 even when α stays low.

#### 2. Δρ — Reliability change

\[
d_\rho = ||\rho_{k+1} - \rho_k||
\]

Norm of the reliability vector difference between steps. Captures degradations that manifest across expansion steps rather than within a single step.

**Prediction**: ρ_k may look clean at k=1 (α=0.1) but the Δ to k=2 may reveal the corruption pattern.

#### 3. ΔT — Topology change

\[
d_T = w_1 \Delta V + w_2 \Delta E + w_3 \Delta \text{Redundancy}
\]

Weighted combination of structural changes. Weights are not calibrated in advance — the experiment discovers which component carries signal.

**Prediction**: Boundary count and identity may change under corruption even when ρ values stay near 1.0.

#### 4. ΔDRU — Uncertainty regime change

\[
d_{DRU} = |DRU_{k+1} - DRU_k|
\]

Binary. Captures whether the decision-relevant uncertainty regime shifted between steps. Directly connects to EVSI.

**Prediction**: DRU may flip between k and k+1 when corruption hides information that the clean system would reveal.

---

## Primary metric

Not:

\[
\text{Accuracy}(\alpha)
\]

But:

\[
\text{DetectionLead} = t(\Delta\Omega) - t(\alpha)
\]

where t(x) is the first expansion step where signal x crosses its threshold.

We seek:

\[
\boxed{\text{DetectionLead} < 0}
\]

ΔΩ detects before α.

---

## Expected outcomes

### Result A — Ω works

\[
\exists i : \text{Loss}_i > \varepsilon_i \quad \text{while} \quad \alpha < \tau
\]

Concrete finding: at least one Ω dimension (topology, observations, or reliability delta) carries signal that α misses.

Implication:

\[
\boxed{\text{Observability is an independent dimension of risk}}
\]

System design should separate "can I observe degradation?" from "how much does the degradation matter?"

### Result B — Ω partial

Only some dimensions work. E.g.:

\[
\Delta\rho = 0, \quad \Delta T > 0
\]

Implication: the correct representation exists but authority must be dimension-specific. Different Ω components are informative in different contexts.

### Result C — Ω fails

\[
\forall i : \text{Loss}_i \approx 0 \quad \text{while} \quad DRU > 0
\]

All Ω dimensions show no signal. The loss is epistemologically invisible from within the system.

Implication: The theory shifts from detection to robust policy. If the system cannot know it is blind, the correct response is not better sensing — it is bounded commitment (expand when cost allows, regardless of signal).

---

## Relationship to earlier batches

| Batch | Asks | Finds |
|-------|------|-------|
| 008 | Can α = 1−median(ρ) detect blindness? | No — median aggregates away the signal |
| 009 | Can α_w = f(ρ, Impact) fix it? | Partially — Impact corrects assignment but ρ has no signal |
| 009.1 | Is there latent ρ signal? | No — ρ vector is binary, invariant |
| **010** | **Can ΔΩ detect dimensional loss?** | **Pending — the first experiment beyond ρ** |

This progression:

\[
\text{Estimator} \rightarrow \text{Weight} \rightarrow \rho \text{ distribution} \rightarrow \text{State representation}
\]

Each step pushes the detection point earlier in the information chain.

---

## Controlled risk

The experiment could find nothing. That is a valid outcome (Result C). If it does:

- The ρ bottleneck is confirmed as fundamental, not accidental
- TAKT must design for irreducible uncertainty, not estimation
- The next step is not "find a better signal" but "design policies that work without detection"

This is hypothesis-driven science, not feature engineering. The design is frozen at this question.

---

## Files

- `research/analysis/omega-formalism-v0.1.md` — theoretical foundation
- `cli/src/batch-010/` — implementation (pending design freeze acceptance)
