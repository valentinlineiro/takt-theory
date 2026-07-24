# EXP-004 Protocol: Dynamic Margin $M_D$ & Intervention Horizon $h^*$ Guarantee

## 1. Executive Summary & Falsifiable Hypothesis

**Hypothesis $H_4$**: TAKT guarantees zero safety violations ($\text{safetyViolationCount} = 0$) under non-zero state drift rate $\gamma \le \gamma_{\text{max}}$ by computing maximum intervention horizon $h^* = \lfloor M_D / \gamma_{\text{max}} \rfloor$ and enforcing kernel re-verification before safety margin expiry.

- **Primary Assertion**: $\text{safetyViolationCount}(\text{takt}) = 0$ while incurring lower total acquisition cost than continuous exhaustive verification.
- **Falsification Threshold**: If TAKT experiences any safety violation ($\text{safetyViolationCount} > 0$) when $\gamma \le \gamma_{\text{max}}$, $H_4$ is refuted.

---

## 2. Experimental Variables & Design

### Independent Variables
- **Maximum Drift Rate $\gamma_{\text{max}}$**: $0.02$ state space drift per step
- **Safety Margin $M_D$**: Initial structural safety boundary distance
- **Intervention Horizon $h^*$**: Computed re-verification interval $\lfloor M_D / \gamma_{\text{max}} \rfloor$
- **Evaluation Seed**: Deterministic integer seed $\sigma \in \mathbb{N}$

### Dependent Variables
1. **Safety Violation Count** ($\text{safetyViolationCount}$): Number of steps yielding unsafe decisions.
2. **Total Decision Regret** ($\text{totalDecisionRegret}$): Decision mismatches against ground truth.
3. **Total Acquisition Cost**: Observation overhead incurred.
4. **Re-verification Interval**: Actual steps between kernel checks.

---

## 3. Paradigm Benchmark Matrix

| Paradigm ID | Drift Handling Mechanism | Re-verification Interval | Safety Guarantee | Acquisition Cost |
| :--- | :--- | :--- | :--- | :--- |
| `naive` | None (ignores drift) | Never ($\infty$) | High violation risk | $0.0$ |
| `static-rules` | Fixed periodic check | Static interval | Partial protection | Constant |
| `exhaustive` | Continuous check | Every step ($h=1$) | Complete protection | High ($N \times k$) |
| `pomdp` | Bayesian drift filter | Continuous | Model-dependent | High compute |
| `takt` | Dynamic horizon $h^*$ check | $h^* = \lfloor M_D / \gamma_{\text{max}} \rfloor$ | 100% Guaranteed zero violations | Minimal sparse cost |

---

## 4. Scenario Configuration

```json
{
  "id": "synth-drift-horizon",
  "seed": 42,
  "stateSpaceSize": 20000,
  "kernelDimensionK": 4,
  "capabilityCatalogSize": 10,
  "maxDriftRate": 0.02,
  "params": {
    "experiment": "EXP-004"
  }
}
```

---

## 5. Execution & Data Collection Workflow

1. Instantiate `StateSpaceGenerator` with drift parameter $\gamma_{\text{max}} = 0.02$.
2. Generate 100 event steps experiencing temporal state drift.
3. Execute all 5 runners.
4. Measure safety violations, total regret, and acquisition cost.
5. Confirm TAKT achieves zero violations with cost $< \text{exhaustive}$.
6. Export JSON dataset to `benchmarks/datasets/EXP-004-seed-<seed>.json`.
