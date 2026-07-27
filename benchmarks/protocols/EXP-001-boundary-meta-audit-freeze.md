# EXP-001-Boundary-Meta-Audit Preregistered Protocol Freeze

> **Protocol Status:** Meta-Audit Preregistration Freeze (v1.0)  
> **Theory Baseline:** TAKT-v1.0 Frozen Core  
> **Instrument Baseline:** Calibrated (`EXP-003-baseline` Verified)  
> **Objective:** Evaluate Epistemological Sufficiency ($R_{\text{evidencia}} \models D_{\text{investigación}}$) by comparing EVSI active exploration against Random and Grid sampling strategies.

---

## 1. Meta-Hypothesis ($H_{\text{meta1}}$)

Active EVSI sampling achieves a faster reduction in Atlas classification uncertainty $U(\hat{f}_1)$ per unit of experimental budget $C_{\text{experimento}}$ compared to non-adaptive strategies (Random and Grid), while maintaining an EVSI misspecification error $\epsilon_{\text{model}} < 0.10$.

---

## 2. Compared Strategy Paradigms

| Paradigm ID | Strategy Description | Selection Policy | 20% Random Quota |
| :--- | :--- | :--- | :--- |
| `random` | Uniform random sampling | $\text{Unbiased Uniform Random}$ | N/A (100% Random) |
| `grid` | Uniform Cartesian grid sweep | $\text{Deterministic Step Sweep}$ | N/A |
| `evsi-active` | Active EVSI boundary search | $\max \text{EVSI Priority Score}$ | Included (20%) |

---

## 3. Evaluated Meta-Metrics

1. **Uncertainty Reduction Rate:**
   $$\text{URR} = \frac{\Delta U(\hat{f}_1)}{C_{\text{experimento}}}$$

2. **EVSI Model Error ($\epsilon_{\text{model}}$):**
   $$\epsilon_{\text{model}} = |\text{EVSI}_{\text{predicted}} - \Delta \text{Knowledge}_{\text{observed}}|$$

3. **Execution Noise Error ($\epsilon_{\text{exec}}$):**
   $$\epsilon_{\text{exec}} = \frac{\text{noiseMs}}{10.0}$$

4. **Interpretation Error ($\epsilon_{\text{interpret}}$):**
   $$\epsilon_{\text{interpret}} = \text{Variance of Regime Classification}$$

---

## 4. Auditable Action Rules

- **If $\epsilon_{\text{model}} \uparrow$ (High Model Error):** Recalibrate EVSI acquisition weights in [boundary-explorer.ts](benchmarks/atlas/boundary-explorer.ts).
- **If $\epsilon_{\text{exec}} \uparrow$ (High Execution Noise):** Isolate hardware benchmarking process and pin CPU affinity.
- **If $\epsilon_{\text{interpret}} \uparrow$ (High Interpretation Error):** Refine classification thresholds in [boundary-estimator.ts](benchmarks/atlas/boundary-estimator.ts).
