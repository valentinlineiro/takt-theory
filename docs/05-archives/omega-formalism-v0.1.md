# Ω Formalism v0.1 — Observability State Representation

**Status**: Draft
**Tags**: EVSI Framework, α bound, representation theory, ARCH core
**Prerequisite reading**: batch-008-experimental-freeze, batch-009-experimental-freeze, batch-0091-experimental-freeze

---

## Problem

Batch-008/009 experimentally demonstrate a limit:

\[
\alpha = 1 - f(\rho) \leq 1 - \rho_{min}
\]

Under A_{sparseFN}: α ∈ [0, 0.2], invariant to incidence, case, and rep. Batch-009.1 proved no latent signal exists in ρ — the problem is not the estimator but the representation:

\[
\boxed{\text{The system cannot detect what its representation does not preserve.}}
\]

The scalar α collapses a multidimensional state (graph, capabilities, decision context, history) into one number under one function (reliability ratio). This projection discards information before the estimator runs.

## The Contraction Property

Any finite representation of a system is a projection:

\[
I(\text{representation}; S) \leq I(S; S)
\]

Information is necessarily lost at each mapping:

\[
S \rightarrow \rho \rightarrow \alpha \rightarrow \text{Policy}
\]

Batch-008/009 demonstrated contraction at ρ → α (median flattens distribution).
Batch-009.1 demonstrated contraction at S → ρ (ρ is binary under A_{sparseFN}).

### Where the contraction was

Before Batch-009.1, we assumed:

\[
\text{Problem} \in \text{Estimator: } f(\rho) \text{ is wrong}
\]

After Batch-009.1, we know:

\[
\text{Problem} \in \text{Representation: } S \rightarrow \rho \text{ loses causality}
\]

The contraction chain is:

| Step | Loss | Evidence |
|------|------|----------|
| S → ρ | Causal relevance | Batch-009.1: ρ_min = 0.80 invariant |
| ρ → α | Distribution shape | Batch-008: median suppresses outlier |
| α → Policy | Temporal context | Not yet tested |

### Ω does not eliminate contraction

Contraction is unavoidable: any finite representation is a projection. Ω's purpose is not to eliminate contraction but to control **where and when** it occurs:

\[
S \rightarrow \Omega \quad (\text{richer representation, contraction delayed})
\]
\[
\Omega \rightarrow \alpha \quad (\text{contraction only when necessary for decision})
\]

A good representation has:

\[
\text{Loss}_{\text{rep}} \approx \text{Loss}_{\text{necessary}}
\]

A poor one has:

\[
\text{Loss}_{\text{rep}} \gg \text{Loss}_{\text{necessary}}
\]

The goal of Ω is to ensure information loss happens at the decision boundary, not at the sensor boundary.

### Connection to ARCH

This parallels a core ARCH principle: the problem is not storing more data — it is preserving structure until the decision needs to consume it. Each arrow in:

\[
\text{Data} \rightarrow \text{Signal} \rightarrow \text{Metric} \rightarrow \text{Decision}
\]

is a possible contraction point. The correct architecture does not eliminate contraction: **it governs it**.

## Solution: Ω as state vector

Define observability not as a scalar but as a vector:

\[
\Omega_k = \langle O_k, \text{DRU}_k, \rho_k, T_k, M_k, C_k \rangle
\]

Each component captures a different dimension of the system's capacity to observe itself.

### Components

#### 1. Observations (O_k)

The raw observable subgraph at expansion depth k:

\[
O_k = \{v \in V : d(v_0, v) \leq k\}
\]

Including:
- Node set
- Edge set (local topology)
- Capability signatures (observed)

This is the only component the current system uses (as input to ρ, DRU, etc.).

#### 2. Decision-Relevant Uncertainty (DRU_k)

\[
\text{DRU}_k = D_k \cap U(O_k)
\]

Whether decision-relevant information remains outside the observable subgraph.

Current scalar: {0, 1}. Future extension: continuous measure of how much decision-relevant information remains.

#### 3. Reliability vector (ρ_k)

Not the scalar α = 1 − f(ρ), but the full vector:

\[
\rho_k = \langle \rho(v_1), \rho(v_2), \dots, \rho(v_n) \rangle, \quad v_i \in \text{Boundary}(\Omega_k)
\]

Properties per node:
- ρ(v) ∈ [0, 1]
- Dimensional structure: which capabilities match and which don't
- Not collapsed to central tendency

#### 4. Topology (T_k)

Structural properties of the observable subgraph:

- |V_k|, |E_k| — size
- Boundary node count and identity
- Degree distribution (mean, variance, min, max)
- Path redundancy: number of disjoint paths from focal to each boundary
- Community structure: modularity, bridge nodes
- Dependency depth: longest chain from focal to boundary

T_k is currently implicit in the boundary detection but never explicitly recorded.

#### 5. Causal model / memory (M_k)

Accumulated state across expansion steps:

\[
M_k = \{\Omega_1, \Omega_2, \dots, \Omega_k\}
\]

Enables temporal comparison:

- Δρ(k) = ρ_k − ρ_{k-1}: how reliability changed
- ΔT(k) = T_k − T_{k-1}: how topology changed
- Probe history: which nodes were probed, what was found
- Stability: variance of each component over last m steps

Currently absent from the system.

#### 6. Context (C_k)

Case-specific metadata:

- kMax: maximum feasible expansion depth
- Cost model: c_expand, c_verify, c_escalate
- Domain: workflow, deployment, decision
- Decision sensitivities: D_f, D_r, D_s, D_c, D_m
- Candidate interventions: T0, T1, ...

Currently hardcoded per case, never recorded as state.

---

## Fundamental operation: ΔΩ

Instead of:

\[
\alpha > \tau \quad \text{(scalar threshold)}
\]

Define loss as per-dimension divergence between consecutive states:

\[
\text{Loss}_i(\Omega_{k}, \Omega_{k+1}) = d(\Omega^i_k, \Omega^i_{k+1})
\]

where d is a dimension-appropriate distance:

| Component | d(a, b) | Range | Meaning |
|-----------|---------|-------|---------|
| O_k | Symmetric difference count | [0, ∞) | New nodes/edges appeared |
| DRU_k | Absolute difference | {0, 1} | Uncertainty regime changed |
| ρ_k | L₂ or max norm | [0, 1] | Reliability degraded |
| T_k | Composition of per-metric diffs | [0, ∞) | Topology changed |
| M_k | Memory diff (k-step window) | [0, ∞) | Pattern of change |
| C_k | Identity | {0, 1} | Context changed |

### Detection signal

The system detects relevant information loss when:

\[
\exists i : \text{Loss}_i(\Omega_k, \Omega_{k+1}) > \varepsilon_i
\]

The hypothesis: **Loss_i crosses threshold before α crosses τ** for at least one dimension i under A_{sparseFN}.

### Clean vs corrupted transition

Clean:

\[
\Omega_k \xrightarrow{\text{expand}} \Omega_{k+1} : \text{Loss}_{\text{topology}} \approx 0, \text{Loss}_\rho \approx 0
\]

Corrupted (A_{sparseFN}):

\[
\Omega_k \xrightarrow{\text{expand}} \Omega'_{k+1} : \text{Loss}_{\text{topology}} > 0
\]

even when:

\[
\alpha(\rho'_k) = 0.1 \quad (\text{below threshold})
\]

---

## Hypothesis for Batch-010

\[
\boxed{
\Delta\Omega \ \text{detects relevant information loss before} \ \alpha
}
\]

The mechanism:

1. A_{sparseFN} corrupts capability signatures on boundary nodes
2. The system expands from k → k+1
3. The corrupted boundary node's observable signature changes
4. This changes the topology at k+1 (edges, neighbors, capabilities)
5. ΔT(k) and Δρ(k) capture this even when α(k) stays low

Current α misses this because it only looks at ρ of the expansion boundary, not the change in the state vector between k and k+1.

### Predictions

| Condition | α | ΔΩ |
|-----------|---|----|
| Clean, no expansion needed (DRU=0) | 0 | 0 |
| Clean, expansion needed (DRU=1) | 0 | > 0 (transition is large) |
| Corrupted, low incidence | < 0.2 | > ε (topology changes) |
| Corrupted, high incidence | < 0.2 | >> ε (multiple nodes affected) |

---

## Minimum experiment design

Keep A_{sparseFN}. Same 3 cases. Same incidences.

**New**: for each k in each run, record:

1. ρ_k vector (already available in Batch-008 code)
2. Boundary node count and identities
3. O_k node/edge count
4. Δ between k and k+1 for each Ω component
5. Full Ω_k state per expansion step

**Question**:

> Does Δ topology (boundary count change, edge change) between k and k+1 correlate with DRU loss under corruption?
> If yes: we have a signal that α missed.
> If no: the representation problem is deeper than Ω — it may require temporal comparison or causal structure unknown to the agent.

---

## Desired outcome

If ΔΩ works:

\[
\text{Policy} = g(\Delta \Omega) \quad \text{instead of} \quad \text{Policy} = h(\alpha)
\]

where g detects dimensional loss and expands when any dimension crosses its threshold.

If ΔΩ fails:

\[
\boxed{\text{The bottleneck is not representation — it is accessibility}}
\]

The corruption destroys information that is fundamentally unrecoverable from within the system. TAKT must accept a bound on what it can detect and design policies that hedge against irreducible uncertainty rather than trying to estimate it.

---

## Relationship to EVSI Framework

Ω does not replace EVSI. It precedes it:

\[
\Omega \rightarrow \text{Detect loss} \rightarrow \text{Estimate EVSI} \rightarrow \text{Decide}
\]

Current: EVSI → α → decide.

Proposed: Detect information loss → if yes, estimate EVSI → if EVSI > cost, expand.

This separates two concepts that were conflated:
- **Observational capability**: can the system see its own degradation?
- **Decision value**: is it worth expanding to recover the information?

α tried to answer both at once. Ω answers only the first.
