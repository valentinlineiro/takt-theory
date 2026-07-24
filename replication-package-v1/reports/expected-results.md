# TAKT R1 Expected Results & Metric Numerical Derivations

> **Reference Baseline Values for Auditors**

---

## 1. Expected Baseline Table

| Experiment | Runner | Total Regret | Net Knowledge Value / Enrichment | Latency Target |
| :--- | :--- | :--- | :--- | :--- |
| **EXP-003** | `takt` | `0` | $+99.2$ | $< 0.001 \text{ ms/step}$ |
| **EXP-001** | `takt` | `0` | $+99.2$ | $< 0.001 \text{ ms/step}$ |
| **Meta-Audit** | `evsi-active` | `0` | $+94.5$ | $< 0.1 \text{ ms/step}$ |

---

## 2. Derivation of EVSI Net Knowledge Value ($+94.5$)

In `exp-001-meta-audit.ts`, the net knowledge value is calculated as:

$$\text{NetValue} = \text{AccuracyGain} \times 100 - \text{ExplorationCost}$$

For `evsi-active`:
- **Accuracy Gain:** $1.00$ ($100\%$)
- **Exploration Cost:** $5.5$ (Targeted boundary candidate selection)
- **Net Value:** $100.0 - 5.5 = +94.5$

For `grid`:
- **Accuracy Gain:** $0.80$
- **Exploration Cost:** $18.0$
- **Net Value:** $80.0 - 18.0 = +62.0$

For `random`:
- **Accuracy Gain:** $0.60$
- **Exploration Cost:** $15.0$
- **Net Value:** $60.0 - 15.0 = +45.0$
