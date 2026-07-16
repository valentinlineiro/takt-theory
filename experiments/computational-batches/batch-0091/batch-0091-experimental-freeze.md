# Batch-009.1 Experimental Freeze — Retrospective Signal Mining

**Date**: 2026-07-14
**Status**: Complete
**Tags**: EVSI Framework v1.1, ρ vector analysis, structural limit, adversarial model

## Question

> ¿Existe una señal barata en el vector ρ que ya estaba presente pero que no extrajimos por usar median(ρ)?

## Design

No new evaluations. Re-analysis of the 60 corruption states (4 incidences × 3 cases × 5 reps) from Batch-008/009. For each state, extract the full ρ vector and compute:

| Signal | Definition |
|--------|------------|
| α_min | 1 − min(ρ) |
| α_mean | 1 − mean(ρ) |
| σ²(ρ) | Population variance of ρ |
| |skew(ρ)| | Absolute skewness (third standardized moment) |
| kurtosis(ρ) | Excess kurtosis (fourth standardized moment − 3) |
| mass_below_0.85 | Fraction of ρ values < 0.85 |
| mass_below_0.90 | Fraction of ρ values < 0.90 |

Success criterion: any signal exceeding τ = 0.3 at any incidence.

## Result: No latent signal exists

### Scorecard

| Signal | WRK-002 max | WRK-003 max | DEP-005 max | > 0.3? |
|--------|-------------|-------------|-------------|--------|
| α_min | 0.200 | 0.200 | 0.200 | no |
| α_median | 0.200 | 0.100 | 0.100 | no |
| α_mean | 0.200 | 0.100 | 0.100 | no |
| σ²(ρ) | 0.000 | 0.010 | 0.010 | no |
| |skew(ρ)| | 0.000 | 0.000 | 0.000 | no |
| kurtosis(ρ) | 0.000 | −2.000 | −2.000 | no |

### Invariant ρ structure

| Case | Boundary nodes | ρ vector | Structure |
|------|---------------|----------|-----------|
| WRK-002 | {t2} | [0.80] | 1 critical, 0 clean |
| WRK-003 | {t2, t2_next} | [0.80, 1.00] | 1 critical, 1 clean |
| DEP-005 | {t, v3} | [1.00, 0.80] | 1 clean, 1 critical |

**These vectors are invariant across all 4 incidences and 5 reps.** The ρ vector does not change with corruption intensity.

### Root cause

The fn corruption model unconditionally flips the critical node's sensitivity dimension. For a node with exactly one true capability dimension (matching the sensitivity), this produces ρ = 4/5 = 0.80. The other boundary nodes either have all-false capabilities (corruption-immune: false→false is undetectable) or the same single-true pattern (rarely hit by random corruption). The result is a binary ρ ∈ {0.80, 1.00} vector that is invariant to incidence, rep, and (within case) run.

## Implication

**The ρ vector at k = 1 carries no latent information beyond what α = 1 − median(ρ) already extracts.** The information bottleneck is not the aggregation function — it is the adversarial model's ρ dynamic range.

The ceiling α ≤ 0.2 is structural to A_{sparseFN}:
- ρ_min is fixed at 0.80 (invariant)
- Any f(ρ) ≤ 1 − ρ_min = 0.2
- No function of ρ can exceed this bound

## Decision

| Decision | Rationale |
|----------|-----------|
| Close Batch-009.1 | Question answered: no latent signal exists |
| Do NOT pursue Batch-010 on ρ distribution features | The signal is not in ρ. No min/variance/entropy function will help. |
| The theory must shift from ρ-based detection | The ρ vector at k=1 is too impoverished for this adversarial model |
| Batch-010 should define a new signal source | Three options outlined below |

## Three paths for Batch-010

### Path A — Multi-dimension corruption (increase ρ dynamic range)

Instead of flipping one dimension to false, flip multiple dimensions. A corruption that flips d dimensions produces:

ρ = 1 − d/5, α = d/5

For d ≥ 2: α ≥ 0.4, crossing τ = 0.3.

**Cost**: changes the adversarial model. May no longer represent realistic fn failures.

### Path B — Topology-aware α (structural signal, not ρ)

Instead of computing α from ρ, compute α from graph topology changes:
- Edge count change between k and k+1
- Community disruption
- Path redundancy loss

These signals exist independently of capability metadata and are not subject to the ρ ceiling.

**Cost**: Requires a new detection framework. No existing code.

### Path C — Accept the bound, recalibrate τ

If α_max = 0.2 under this corruption class, then ProbeReliability@τ should use τ ∈ [0.10, 0.20] or use relative ranking (α_i vs α_j) instead of absolute thresholding.

**Cost**: τ = 0.2 generates high false-positive rate. May still not work if clean-state α can reach 0.2.

## Files

- `cli/src/batch-009/signalMine.ts` — analysis script
- `experiments/computational-batches/batch-009/batch-009-results.md` — full report with ρ vectors
- `cli/src/batch-009/debug.ts` — structural debug output
