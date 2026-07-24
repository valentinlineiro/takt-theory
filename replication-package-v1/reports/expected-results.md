# TAKT R1 Expected Results & Metric Numerical Derivations

> **Reference Baseline Values for Auditors**

---

## 1. Expected Baseline Table

| Experiment | Runner | Total Regret | Net Knowledge Value / Enrichment | Latency Target |
| :--- | :--- | :--- | :--- | :--- |
| **EXP-003** | `takt` | `0` | $+199.2$ | $< 0.001 \text{ ms/step}$ |
| **EXP-001** | `takt` | `0` | $+99.2$ | $< 0.001 \text{ ms/step}$ |
| **Meta-Audit** | `evsi-active` | `0` | $+83.8$ | $< 0.1 \text{ ms/step}$ |


---

## 2. Derivation of EVSI Net Knowledge Value ($+83.8$)

In `exp-001-meta-audit.ts`, the net knowledge value is calculated dynamically using boundary error taxonomy:

$$\text{NetValue} = \text{Math.round}((1.0 - \text{totalError}) \times 100 \times 10) / 10$$

For `evsi-active`:
- **Total Error ($\text{totalError}$):** $0.162$ ($16.2\%$ aggregate boundary uncertainty)
- **Net Value:** $(1.0 - 0.162) \times 100 = +83.8$

For `grid`:
- **Net Value:** $83.8 \times 0.65 = +54.5$

For `random`:
- **Net Value:** $83.8 \times 0.47 = +39.4$

