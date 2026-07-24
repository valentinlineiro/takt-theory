# EXP-001-Boundary Protocol Specification: Phase Diagram Search

> **Protocol Status:** Registered Boundary Protocol  
> **Theory Baseline:** TAKT-v1.0 Frozen Core  
> **Objective:** Map the quantitative phase diagram boundaries $f_1(k, \Delta D, n) = 0$ separating Structural Advantage, Setup Dominance, Recalibration Bound, and Rupture Regimes.

---

## 1. Experimental Phase Space Sweep

The boundary protocol executes a 3D grid search over kernel dimension $k$, contract drift rate $\Delta D$, and horizon length $n$:

| Dimension | Parameter | Values / Range |
| :--- | :--- | :--- |
| **Kernel Dimension** | $k = |C_D|$ | $\{2, 8, 32, 64, 128\}$ |
| **Contract Drift Rate** | $\Delta D$ | $[0.00, 0.05]$ step $0.01$ |
| **Horizon Length** | $n$ | $[1, 1000]$ logarithmic steps |

---

## 2. Quantitative Boundary Definitions

1. **Break-even Horizon ($n_{\text{break-even}}$):**
   The minimum horizon $n$ satisfying:
   $$C_{\text{setup}} + n \cdot C_{\text{decision}}(\text{takt}) \le C_{\text{baseline}}(n)$$

2. **Critical Drift Rate ($\Delta D_{\text{crit}}$):**
   The maximum contract mutation rate $\Delta D$ where decision regret remains strictly zero ($\text{Regret} = 0$).

3. **Phase Boundary Function ($f_1(k, \Delta D, n) = 0$):**
   The empirical boundary separating:
   - **Zone 1 (Structural Advantage):** $n \ge n_{\text{break-even}}$, $\Delta D \le \Delta D_{\text{crit}}$, $k < 64$.
   - **Zone 2 (Setup Dominance):** $n < n_{\text{break-even}}$.
   - **Zone 3 (Recalibration Bound):** $\Delta D > \Delta D_{\text{crit}}$.
   - **Zone 4 (Rupture Regime):** $k \ge 64$ AND $\Delta D > \Delta D_{\text{crit}}$.

---

## 3. Protocol Outputs

The boundary protocol outputs the **Empirical Atlas of Validity Matrix** mapping every phase space point $(k, \Delta D, n)$ to its classified regime and confidence interval.
