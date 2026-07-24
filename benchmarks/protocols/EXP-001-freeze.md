# EXP-001 Preregistered Protocol Freeze: Empirical Kernel Scaling

> **Protocol Status:** Frozen Preregistration (v1.0)  
> **Theory Baseline:** TAKT-v1.0 Frozen Core  
> **Instrument Baseline:** Calibrated (`EXP-003-baseline` Verified)

---

## 1. Primary Hypothesis ($H_1$)

Under application assumptions $A_1 \dots A_4$ (stable contract $D$, observable representation $R$, estimable acquisition cost, bounded decision space), the task capability kernel $K_D = \bigcap_{c \in C_D} K_c$ induces a representation $S / K_D$ that:

1. Reduces the effective state space dimension for decision making from $|S|$ to $|S / K_D| \ll |S|$.
2. Keeps per-step decision latency and memory footprint polynomial in $k = |C_D|$ and bounded as $|S| \to \infty$.

---

## 2. Experimental Design Matrix (E1 – E9 Grid)

The benchmark executes across a 3×3 matrix of state space dimensions $|S|$ and kernel dimensions $k$:

| Grid ID | $|S|$ (State Space Dimension) | $k = |C_D|$ (Kernel Dimension) | Capability Catalog Size |
| :--- | :--- | :--- | :--- |
| **E1** | 1,000 | 2 (Small) | 10 |
| **E2** | 10,000 | 2 (Small) | 10 |
| **E3** | 100,000 | 2 (Small) | 10 |
| **E4** | 1,000 | 8 (Medium) | 20 |
| **E5** | 10,000 | 8 (Medium) | 20 |
| **E6** | 100,000 | 8 (Medium) | 20 |
| **E7** | 1,000 | 32 (Large) | 50 |
| **E8** | 10,000 | 32 (Large) | 50 |
| **E9** | 100,000 | 32 (Large) | 50 |

---

## 3. Independent & Dependent Variables

### Independent Variables
- State Space Dimension $|S| \in \{1.000, 10.000, 100.000\}$
- Kernel Dimension $k = |C_D| \in \{2, 8, 32\}$
- Deterministic Evaluation Seeds $\sigma \in \{42, 101, 2024\}$

### Dependent Variables
1. **Quotient Compression Ratio:** $\mathcal{C}_{\text{ratio}} = |S| / |S / K_D|$
2. **Kernel Construction Time:** Time to compute $S / K_D$ (ms).
3. **Per-Step Decision Latency:** Mean decision latency (ms/step).
4. **Peak Memory Footprint:** Memory allocation (Bytes).
5. **Total Decision Regret:** Cumulative regret $\sum \varepsilon_U(s_t)$.

---

## 4. Evaluated Paradigms (Sequence)

1. `naive`: Zero acquisition, random nominal action choice.
2. `static-rules`: Fixed heuristic observation subset.
3. `exhaustive`: Full capability state verification ($k \times 1.0$).
4. `pomdp`: Continuous Bayesian belief updates over simplex $|S|-1$.
5. `takt`: Dynamic kernel collapse ($S / K_D$).

---

## 5. Classification Criteria (A / B / C)

- **Resultado A (Confirmación Estructural):** $\mathcal{C}_{\text{ratio}} \gg 1.0$, TAKT decision regret $= 0$, and per-step latency scales polynomially in $k$ independently of $|S|$.
- **Resultado B (Límite de Aplicabilidad):** Advantages manifest for $k \le 16$, but for $k = 32$ kernel construction time approaches exhaustive search time.
- **Resultado C (Contradicción Empírica):** TAKT decision regret $> 0$ despite $A_1 \dots A_4$ holding, or TAKT latency exceeds `exhaustive` for small $k$.

---

## 6. Exact Falsification Conditions

$H_1$ is deemed **falsified for a parameter regime** if:
1. Decision regret $> 0$ occurs under TAKT while $\text{ker}(R) \subseteq K_D$.
2. TAKT per-step latency scales super-polynomially with $k$ or linearly with $|S|$.
3. Overall computational overhead of computing $S / K_D$ exceeds `exhaustive` search across all grid cells E1–E9.
