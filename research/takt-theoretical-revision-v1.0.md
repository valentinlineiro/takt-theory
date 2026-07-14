# Theoretical Revision Note: From Structural Types to Causal Context (v1.0)

**Date:** 2026-07-14  
**Status:** Active  
**Predecessor:** Batch-003 Experimental Outcome  

---

## 1. Core Paradigm Shift: Rol Contextual vs. Tipo Estático

The findings from Batch-003 demonstrated that local structural heuristics are insufficient to guarantee safe optimizations when protective functions emerge from global interactions. To resolve this, we decouple the concept of friction from static structural properties.

### 1.1 Mathematical Formulation of System and Context
We define a system state $S$ and its evaluation context $C$ as:
$$S = (V, E, X)$$
where:
*   $(V, E)$ is the system topology (nodes and dependencies).
*   $X$ is the internal state of the system (loads, capacities, local error probabilities, etc.).

$$C = (\Phi, \Omega, \mathcal{D})$$
where:
*   $\Phi$ is the set of invariants and constraints that must be preserved (e.g., safety, liveness, consistency).
*   $\Omega$ is the set of external operating conditions.
*   $\mathcal{D}$ is the perturbation and failure model applied during evaluation.

### 1.2 The Friction Role Mapping
The classification of a friction $f$ is no longer intrinsic to its structural type. Instead, it is a mapped role under the system state and context:
$$FrictionRole(f, S, C) \in \{\text{Accidental}, \text{Necessary}, \text{Stabilizing}\}$$

A friction $f$ is evaluated under this mapping by analyzing the differential state of the system upon its removal:
*   **Accidental**: $\Delta \Phi = 0 \land E(S \setminus \{f\}) < E(S) \land Risk(S \setminus \{f\}) \le Risk(S)$.
*   **Necessary**: $\Phi$ is violated or $G(S \setminus \{f\}) < G(S)$.
*   **Stabilizing**: $E(S \setminus \{f\}) < E(S)$ but $Risk(S \setminus \{f\}) - Risk(S) > E(S) - E(S \setminus \{f\})$, reducing global utility.

---

## 2. Epistemological Uncertainty $I_k(f, S, C)$

To prevent TAKT from executing destructive optimizations blindly, it must measure its own informational insufficiency. We define the **Structural Uncertainty** $I_k$ at depth $k$ as the entropy of the role prediction:

$$I_k(f, S, C) = \mathcal{U}\left( P(R_f \mid O_k(f, S, C)) \right)$$
where:
*   $R_f = FrictionRole(f, S, C)$.
*   $H_k$ is the causal horizon of depth $k$ (the neighborhood of radius $k$ around $f$).
*   $O_k(f, S, C)$ is the observable information available within $H_k$.
*   $\mathcal{U}$ is the uncertainty metric (e.g., Shannon entropy or margin between the top two hypotheses).

### 2.1 Structural Features (Signals) Influencing $I_k$
Rather than defining $I_k$ directly, structural topology markers act as features that increase the estimated entropy:
*   **Cycles & Disjoint Paths**: High local node degree combined with path asymmetry increases $I_k$ for candidate bypasses.
*   **Asymmetric Rollback Costs**: Extreme scale differences between local task costs and downstream failure penalties increase $I_k$ at shallow depths.
*   **Shared Contention**: High overlap in resource requests by unrelated processes increases contention complexity and $I_k$.

---

## 3. Adaptive Causal Horizon Escalation

TAKT starts evaluations locally with a shallow horizon $H_1$. It escalates its view dynamically using the following decision loop:

```
                      O_k (Observable info at depth k)
                                   │
                                   ▼
                      Compute FrictionRole and I_k
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
               [ I_k <= tau ]               [ I_k > tau ]
                    │                             │
                    ▼                             ▼
              Apply Decision                Check k < k_max
                                            ┌─────┴─────┐
                                            ▼           ▼
                                          [ Yes ]      [ No ]
                                            │           │
                                            ▼           ▼
                                      Expand H_{k+1}  Escalate
```

### 3.1 Stopping Criteria
1.  **Confidence Reached**: $I_k \le \tau$ (Decide locally).
2.  **Horizon Limit Reached**: $k = k_{\max} \land I_k > \tau$ (Escalate to global solver or human operator).
3.  **Information Saturation**: $|I_{k+1} - I_k| < \epsilon$ (If uncertainty remains high, escalate due to lack of informative signal).

---

## 4. Blueprint for Batch-004: Selective Escalation

The goal of Batch-004 is to evaluate if TAKT can accurately identify *when* to escalate rather than over-optimizing or over-searching.

### 4.1 Evaluation Metrics
1.  **Escalation Recall**: Rate of correctly escalating in cases where local view leads to incorrect decisions (DEP-005, RES-005).
2.  **Unnecessary Escalation Rate (UER)**: Rate of escalating in cases where local view is sufficient (DEP-001, WRK-001).
3.  **OIA (Optimal Intervention Accuracy)**: Combined decision accuracy.
4.  **DOR (Dangerous Optimization Rate)**: Rate of executing destructive removals without escalation.

### 4.2 Baselines
We will compare three execution models:
*   **Baseline A (Pure Local Heuristic)**: $H_1$ only, never escalates. (Low cost, high DOR).
*   **Baseline B (Always Global Solver)**: $H_{\max}$ always. (High cost, zero DOR).
*   **Baseline C (TAKT Adaptive Escalation)**: Dynamic $H_k$ based on $I_k$. (Low cost, near-zero DOR).
