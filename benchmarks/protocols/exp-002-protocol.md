# EXP-002 Protocol: Rational EVSI Stopping Policy ($\pi^*$) Efficiency

## 1. Executive Summary & Falsifiable Hypothesis

**Hypothesis $H_2$**: TAKT's rational stopping policy $\pi^*$ based on Expected Value of Sample Information (EVSI) incurs strictly non-negative Net Value of Enrichment ($\text{NVE} \ge 0$) by acquiring capability observations only when the expected decision improvement exceeds observation cost ($\text{EVSI}(E | D^*) > C_{\text{acq}}(E)$), outperforming fixed-rule and exhaustive sensing strategies.

- **Primary Assertion**: $\text{NVE}(\text{takt}) > \text{NVE}(\text{exhaustive})$ and $\text{NVE}(\text{takt}) \ge \text{NVE}(\text{static-rules})$ across non-trivial acquisition cost regimes.
- **Falsification Threshold**: If $\text{NVE}(\text{takt}) < \text{NVE}(\text{exhaustive})$ or if TAKT incurs negative net enrichment value ($\text{NVE} < 0$), $H_2$ is refuted.

---

## 2. Experimental Variables & Design

### Independent Variables
- **Capability Acquisition Cost $C_{\text{acq}}$**: Varied acquisition cost per observation $[0.1, 2.0]$
- **Prior Decision Margin $M_D$**: Initial safety margin before capability sensing
- **Evaluation Seed**: Deterministic integer seed $\sigma \in \mathbb{N}$

### Dependent Variables
1. **Net Value of Enrichment** ($\text{NVE}$): $\text{AccuracyGain} - \text{TotalAcquisitionCost}$
2. **Total Acquisition Cost Incurred**: Cumulative observation cost spent
3. **Total Decision Regret**: Mismatches against ground truth decision
4. **Safety Violation Count**: Unsafe action selections

---

## 3. Paradigm Benchmark Matrix

| Paradigm ID | Stopping Condition | Capability Selection | Cost Efficiency |
| :--- | :--- | :--- | :--- |
| `naive` | Always stop (0 observations) | None | Zero cost, zero enrichment |
| `static-rules` | Fixed observation count (2) | Static subset | Constant cost regardless of EVSI |
| `exhaustive` | Never stop until $|C_D|$ verified | All capabilities | High cost, maximal enrichment |
| `pomdp` | Entropy threshold stopping | Simplex update | High compute, variable cost |
| `takt` | Rational EVSI $\pi^*$ stopping | Kernel-targeted | Optimal cost-benefit tradeoff |

---

## 4. Scenario Configuration

```json
{
  "id": "synth-evsi-stopping",
  "seed": 42,
  "stateSpaceSize": 10000,
  "kernelDimensionK": 4,
  "capabilityCatalogSize": 10,
  "maxDriftRate": 0.01,
  "params": {
    "experiment": "EXP-002"
  }
}
```

---

## 5. Execution & Data Collection Workflow

1. Instantiate `StateSpaceGenerator` with `ScenarioConfig`.
2. Generate stream of 100 deterministic `ConcreteEvent` instances.
3. Evaluate all 5 runners side-by-side.
4. Record acquisition cost incurred and decision accuracy per step.
5. Compute aggregate NVE and export JSON dataset to `benchmarks/datasets/EXP-002-seed-<seed>.json`.
