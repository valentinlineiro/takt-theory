# Batch-004 Selective Escalation Evaluation Report

> **Status:** Completed

## 1. Executive Summary

This report evaluates the **Selective Escalation** protocol, comparing three baseline execution models:
1. **Pure Local (Baseline A)**: Decides at neighborhood radius $k = 1$.
2. **Always Global (Baseline B)**: Accesses the global graph directly ($k = \infty$).
3. **Adaptive Escalation (Baseline C)**: Evaluates epistemological uncertainty $\hat{I}_k$ at $k = 1$ and escalates up to $k_{\max} = 2$.

Across a dataset of 15 case systems, we compare:
* **Optimal Intervention Accuracy (OIA)**: Accuracy of chosen intervention compared to global oracle optimal.
* **Dangerous Optimization Rate (DOR)**: Rate of selecting destructive interventions (utility/risk worse than control).
* **Mean Search Effort (SE)**: Proportion of the graph inspected.
* **External Escalation Rate (EER)**: Proportion of cases escalated to the global solver.
* **Escalation Recall (ER)**: Proportion of cases needing expansion that were actually expanded.
* **Escalation Precision (EP)**: Proportion of escalated cases that actually needed expansion.
* **Unnecessary Escalation Rate (UER)**: Proportion of cases not needing expansion that were expanded.

## 2. Comparative Scorecard

| Model | OIA | DOR | Mean Search Effort (SE) | EER | ER | EP | UER |
| ----- | --- | --- | ---------------------- | --- | --- | --- | --- |
| **Pure Local (k=1)** | 93.33% | 0.00% | 83.56% | 0.00% | 0.00% | 100.00% | 0.00% |
| **Always Global** | 100.00% | 0.00% | 100.00% | 100.00% | 100.00% | 14.29% | 42.86% |
| **Adaptive Escalation (kMax=2)** | 100.00% | 0.00% | 96.62% | 20.00% | 100.00% | 14.29% | 42.86% |

## 3. Case-by-Case Detailed Results

### Adaptive Escalation (kMax=2)

| Case ID | System Type | Local (k=1) Chosen | Global Chosen | Adaptive Chosen | K_actual | Escalated? | Search Effort (SE) | Destructive? | Match? |
| ------- | ----------- | ------------------ | ------------- | --------------- | -------- | ---------- | ------------------ | ------------ | ------ |
| DEP-001 | dependency | T1 | T1 | T1 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| DEP-002 | dependency | T0 | T0 | T0 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| DEP-003 | dependency | T0 | T0 | T0 | 2 | 💥 Yes | 85.7% | 🛡️ No | ✅ |
| DEP-004 | dependency | T1 | T1 | T1 | 2 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| DEP-005 | dependency | T0 | T0 | T0 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| WRK-001 | workflow | T1 | T1 | T1 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| WRK-002 | workflow | T0 | T0 | T0 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| WRK-003 | workflow | T0 | T0 | T0 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| WRK-004 | workflow | T0 | T2 | T2 | 2 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| WRK-005 | workflow | T0 | T0 | T0 | 2 | 💥 Yes | 81.8% | 🛡️ No | ✅ |
| RES-001 | resource | T1 | T1 | T1 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| RES-002 | resource | T0 | T0 | T0 | 1 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| RES-003 | resource | T0 | T0 | T0 | 2 | 💥 Yes | 81.8% | 🛡️ No | ✅ |
| RES-004 | resource | T2 | T2 | T2 | 2 | 🛡️ No | 100.0% | 🛡️ No | ✅ |
| RES-005 | resource | T0 | T0 | T0 | 2 | 🛡️ No | 100.0% | 🛡️ No | ✅ |

## 4. Category Group Analysis

### H₁-Sufficient Group (8 cases)
These cases do not have truncated boundaries affecting the decision at $k=1$. The local uncertainty $\hat{I}_1 = 0$.
- **Observed Behavior**: Adaptive Escalation successfully terminated at $k=1$ for all 8 cases.
- **Search Effort Saving**: Avoided expanding search space unnecessarily, keeping Search Effort low.
- **Key cases**: DEP-001, DEP-002, DEP-005, WRK-001, WRK-002, WRK-003, RES-001, RES-002

### Expansion-Resolvable Group (4 cases)
These cases have boundary uncertainty at $k=1$ ($\hat{I}_1 = 1$), but the boundaries are fully enclosed at $k=2$ ($\hat{I}_2 = 0$).
- **Observed Behavior**: Adaptive Escalation expanded to $k=2$, resolved the uncertainty, and made the optimal decision.
- **Search Effort Saving**: Inspected only local neighborhood of size $k=2$, avoiding full global graph search.
- **Key cases**: DEP-004, WRK-004, RES-004, RES-005

### External-Resolution-Required Group (3 cases)
These cases contain uncertainty that propagates beyond $k=2$ ($\hat{I}_2 = 1$). To make a safe decision, the model must escalate to the global solver.
- **Observed Behavior**: Adaptive Escalation reached $k_{\max}=2$ with remaining uncertainty and escalated to the global solver, resolving optimally.
- **Safety / Cost Tradeoff**: Incurred high search effort (escalated to global) to guarantee safety and avoid dangerous destructive optimizations.
- **Key cases**: DEP-003, WRK-005, RES-003

## 5. Hansei

The comparative results demonstrate a critical tension between safety recovery and computation efficiency:

### 1. Hypothesis Analysis
*   **H1 (Safety Equivalence): CONFIRMED**
    *   $OIA_{\text{Adaptive}} = OIA_{\text{Global}} = 100\%$ and $DOR = 0\%$. Adaptive Escalation successfully recovered safety, resolving the critical failures of Batch-003 (DEP-005 and RES-005) by detecting uncertainty and expanding its context.
*   **H2 (Effort Minimization): INCONCLUSIVE / PARTIALLY REJECTED**
    *   $SE_{\text{Adaptive}} = 96.62\%$ vs $SE_{\text{Global}} = 100\%$. The search effort reduction is only **3.38%**. While a reduction is present, it does not satisfy the hypothesis of a significant computational advantage ($Effort_{\text{Adaptive}} \ll Effort_{\text{Global}}$). Because the benchmark graphs are small, even $H_1$ covers most of the nodes (as seen in Pure Local's $83.56\%$ base cost).
*   **H3 (Discriminative Escalation): REJECTED IN SELECTIVITY / PRECISION**
    *   While Escalation Recall (sensitivity) is **100%**, Escalation Precision is only **14.29%**, and the Unnecessary Escalation Rate (UER) is high at **42.86%**.
    - **Conclusion**: TAKT recovered global safety through conservative uncertainty detection, but has not yet demonstrated efficient selective escalation. It over-escalates by failing to discriminate between general unknown structure and decision-relevant unknown structure.

### 2. Core Insight: Structural Unknown $\neq$ Decision-Relevant Unknown
The primary limitation of $\hat{I}_k$ is its binary boundary-truncation rule: it treats any unexplored boundary connection as a source of high uncertainty. However, many boundary connections lead to nodes that have no impact on the optimal choice.
- **Future Direction**: The next theoretical iteration must define a mechanism to assess whether a structural unknown is decision-relevant before triggering an escalation step, separating topological frontiers from causal optimization boundaries.
