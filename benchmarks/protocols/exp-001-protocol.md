# EXP-001 Protocol: Empirical Complexity Scaling over Kernel Dimension $k = |C_D|$

## 1. Executive Summary & Falsifiable Hypothesis

**Hypothesis $H_1$**: The computational overhead and state space exploration complexity of TAKT scales polynomially with the capability kernel dimension $k = |C_D|$, whereas full state bisimulation (`exhaustive`) scales exponentially with state space dimension $|S|$, and POMDP belief space updates scale with simplex dimension $|S|-1$.

- **Primary Assertion**: TAKT execution latency and memory footprint remain strictly bounded as $|S| \to \infty$ for fixed kernel dimension $k \ll |S|$.
- **Falsification Threshold**: If TAKT per-step latency or memory allocation scales super-polynomially with $k$ or grows proportionally with $|S|$, $H_1$ is refuted.

---

## 2. Experimental Variables & Design

### Independent Variables
- **Kernel Dimension $k = |C_D|$**: $\{2, 4, 8, 16, 32\}$
- **State Space Dimension $|S|$**: $\{1,000; 10,000; 100,000\}$
- **Evaluation Seed**: Deterministic integer seed $\sigma \in \mathbb{N}$

### Dependent Variables
1. **Per-Step Execution Latency** ($\text{latencyMs}$): Mean execution time per event in milliseconds.
2. **Total Duration** ($\text{totalDurationMs}$): Cumulative scenario execution time.
3. **Peak Memory Footprint** ($\text{peakMemoryBytes}$): Maximum memory allocated during run.
4. **Decision Regret** ($\text{totalDecisionRegret}$): Frequency of sub-optimal action choices.
5. **Net Value of Enrichment** ($\text{netValueEnrichment}$): Decision accuracy gain minus acquisition cost.

---

## 3. Paradigm Benchmark Matrix

| Paradigm ID | Description | Observation Strategy | Cost Profile | Regret Expectation |
| :--- | :--- | :--- | :--- | :--- |
| `naive` | Default nominal choice | Zero observations acquired | $0.0$ | High (uninformed) |
| `static-rules` | Fixed observation subset | Static prefix observation | Fixed $2.0$ | Medium |
| `exhaustive` | Full state verification | Inspects all $k$ capabilities | High ($k \times 1.0$) | Zero |
| `pomdp` | Simplex belief updates | Continuous Bayesian update | High compute ($|S|$) | Near-zero |
| `takt` | Dynamic kernel collapse | Targeted sparse acquisition | Optimal ($< k \times 1.0$) | Zero under $K_D$ |

---

## 4. Scenario Configuration

```json
{
  "id": "synth-kernel-scaling",
  "seed": 42,
  "stateSpaceSize": 100000,
  "kernelDimensionK": 8,
  "capabilityCatalogSize": 20,
  "maxDriftRate": 0.01,
  "params": {
    "experiment": "EXP-001"
  }
}
```

---

## 5. Execution & Data Collection Workflow

1. Instantiate `StateSpaceGenerator` with `ScenarioConfig`.
2. Generate stream of 100 deterministic `ConcreteEvent` instances.
3. Execute all 5 runners (`naive`, `static-rules`, `exhaustive`, `pomdp`, `takt`) side-by-side.
4. Collect step-level metrics via external `MetricCollector`.
5. Emit standardized JSON dataset via `DatasetWriter` to `benchmarks/datasets/EXP-001-seed-<seed>.json`.
