# Spec: Batch-005 Boundary Identifiability & Causal Signatures

**Status:** Frozen
**Date:** 2026-07-14
**Version:** 1.0
**Target Domain:** Software Architecture Synthetic Systems (Dependency Graphs, Workflow Systems, Resource Systems)

---

## 1. Core Mathematical Paradigm

Batch-005 evaluates the **Decision-Relevant Uncertainty (DRU)** protocol, verifying if TAKT can discriminate between general unknown structures and unobserved structures that are capable of changing the optimal decision.

### 1.1 Observable Evidence and Metadata
The evidence available to the estimator at depth $k$ is:
$$O'_k = (O_k^{\text{struct}}, \Gamma_k, M_k)$$
where:
*   $O_k^{\text{struct}} = (V_k, E_k, X_k)$ is the observed subgraph topology and state within $k$ hops.
*   $\Gamma_k(v) = \mathbb{I}[\deg_S(v) > \deg_{S_k}(v)]$ is the boundary connectivity metadata.
*   $M_k(v) = (P_f, P_r, P_s, P_c, P_m)$ is the **Boundary Capability Signature** representing causal effects the unobserved structure can produce/modify:
    *   $P_f$: Can propagate failure.
    *   $P_r$: Can introduce recovery/redundancy.
    *   $P_s$: Can isolate or shield propagation.
    *   $P_c$: Can participate in contention.
    *   $P_m$: Can produce mutable/irreversible side-effects.

### 1.2 Decision Sensitivity ($D_k$)
The decision sensitivity $D_k = (D_f, D_r, D_s, D_c, D_m)$ represents the capability dimensions that could change the ranking/optimal choice among competitive interventions $\mathcal{T}_{\text{competitive}}$ given the current local evidence $O_k^{\text{struct}}$:
$$D_k = \text{DecisionSensitivity}(\mathcal{T}_{\text{competitive}}, O_k^{\text{struct}})$$

### 1.3 Decision-Relevant Uncertainty Estimator ($\hat{DRU}_k$)
The proxy estimator is defined as:
$$\hat{DRU}_k = \mathbb{I}\left[ \exists v \in \partial S_k : Relevant_k(v, f) \land \left( D_k \cap M_k(v) \neq \varnothing \right) \right]$$

*   **Decision Loop**:
    - $\hat{DRU}_k = 0 \Rightarrow$ Stop (Decide locally).
    - $\hat{DRU}_k = 1 \land k < k_{\max} \Rightarrow$ Expand.
    - $\hat{DRU}_k = 1 \land k = k_{\max} \Rightarrow$ External Escalation.

---

## 2. Experimental Invariance and Triplets Design

We design **5 triplets** (15 cases total). Within each triplet, all three cases share identical local structure:
$$O_1^{\text{struct}}(A) = O_1^{\text{struct}}(B) = O_1^{\text{struct}}(C)$$

We manipulate only the boundary capability metadata $M_1(v)$ of the open boundary node $v$:

### 2.1 Triplet Case Categories
1.  **Case A (Irrelevant Causal Signature)**:
    - Boundary capabilities have no overlap with decision sensitivity: $D_1 \cap M_1(v) = \varnothing$.
    - *Expected Behavior*: Stop at $k=1$. (Optimal intervention selected locally).
2.  **Case B (Decision-Relevant Signature - Resolvable)**:
    - Overlap exists: $D_1 \cap M_1(v) \neq \varnothing$.
    - *Expected Behavior*: Expand to $k=2$. At $k=2$, the boundary is enclosed ($\hat{DRU}_2 = 0$), resolving optimal decision locally.
3.  **Case C (Ambiguous Signature - Escalation Required)**:
    - Overlap exists: $D_1 \cap M_1(v) \neq \varnothing$.
    - *Expected Behavior*: Expand to $k_{\max}=2$. The boundary remains open ($\hat{DRU}_2 = 1$), triggering external escalation to the global solver.

---

## 3. Scorecard Metrics

1.  **Optimal Intervention Accuracy (OIA)**: Target $\ge 95\%$.
2.  **Dangerous Optimization Rate (DOR)**: Target $0\%$.
3.  **Mean Search Effort ($SE$)**: Measures graph inspection cost.
4.  **External Escalation Rate ($EER$)**: Target $33.33\%$ (5 cases out of 15).
5.  **Escalation Recall ($ER$)**: Target $100\%$.
    $$ER = \frac{|\{c \in \text{Cases B, C} : K_{\text{actual}} > 1\}|}{10}$$
6.  **Escalation Precision ($EP$)**: Target $100\%$.
    $$EP = \frac{|\{c \in \text{Cases B, C} : K_{\text{actual}} > 1\}|}{|\{c : K_{\text{actual}} > 1\}|}$$
7.  **Unnecessary Escalation Rate ($UER$)**: Target $0\%$.
    $$UER = \frac{|\{c \in \text{Cases A} : K_{\text{actual}} > 1\}|}{5}$$
8.  **Capability Value Gain (CVG)**:
    $$CVG = EP_{\text{DRU}} - EP_{\text{Batch-004}}$$
9.  **UER Reduction**:
    $$UER_{\text{Reduction}} = UER_{\text{Batch-004}} - UER_{\text{DRU}}$$
