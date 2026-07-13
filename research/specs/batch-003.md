# Spec: Batch-003 Synthetic Intervention Selection Benchmark

**Status:** Frozen
**Date:** 2026-07-13
**Version:** 1.0
**Target Domain:** Software Architecture Synthetic Systems (Dependency Graphs, Workflow Systems, Resource Systems)

---

## 1. Mathematical Core Definitions

For Batch 003, the context is defined by a system state $S$ and a candidate set of transformations $\mathcal{T} = \{T_0, T_1, \dots, T_n\}$, where $T_0$ is the default "no intervention" choice. Each state $S$ has an expected utility function $U(S)$.

### 1.1 Expected Utility
The utility of any system state $S$ is calculated globally as:
$$U(S) = G(S) - E(S) - Risk(S)$$
where:
*   $G(S) \ge 0$ is the Goal capacity (to be maximized).
*   $E(S) \ge 0$ is the Environment cost (to be minimized).
*   $Risk(S) \ge 0$ is the Expected systemic failure risk (to be minimized).

### 1.2 The Oracle Selection Solver
The Oracle has full global visibility of $G(S)$, $E(S)$, and $Risk(S)$ values. The Oracle identifies the set of mathematically optimal transformations:
$$U^*(S) = \max_{T_i \in \mathcal{T}} U(T_i(S))$$
$$\mathcal{T}^*(S) = \{T_k \in \mathcal{T} : U(T_k(S)) = U^*(S)\}$$

### 1.3 Evaluation Metrics
For a chosen intervention $\hat{T}_{\text{TAKT}}$ and predicted friction labels, we evaluate:

1.  **Optimal Intervention Accuracy (OIA)**:
    $$\text{OIA} = \frac{|\{c \in \text{Cases} : \hat{T}_{\text{TAKT}}(c) \in \mathcal{T}^*(c)\}|}{|\text{Cases}|}$$
2.  **Absolute Regret ($R$)**:
    $$R = U^*(S) - U(\hat{T}_{\text{TAKT}}(S))$$
    If $\hat{T}_{\text{TAKT}} \in \mathcal{T}^*(S)$, then $R = 0$.
3.  **Normalized Regret ($NR$)**:
    $$NR = \begin{cases} \frac{U^*(S) - U(\hat{T}_{\text{TAKT}}(S))}{\max_{T_i} U(T_i(S)) - \min_{T_i} U(T_i(S))} & \text{if } \max U \neq \min U \\ 0 & \text{otherwise} \end{cases}$$
4.  **Dangerous Optimization Rate (DOR)**:
    $$\text{DOR} = \frac{|\{c \in \text{Cases} : \hat{T}_{\text{TAKT}}(c) \text{ destructively removes some } f \in F_n \cup F_s\}|}{|\text{Cases}|}$$
    An intervention is flagged as *destructive* if it removes a necessary or stabilizing element without replacing it with an equivalent or superior protection mechanism, resulting in:
    $$(G(\hat{T}_{\text{TAKT}}(S)) < G(S)) \lor (Risk(\hat{T}_{\text{TAKT}}(S)) > Risk(S))$$
5.  **Friction Classification Accuracy (FCA)**:
    $$\text{FCA} = \frac{|\{f \in \text{FrictionLabels} : \text{Classified}(f) = \text{GroundTruth}(f)\}|}{|\text{FrictionLabels}|}$$
    where classes are $\text{FrictionType} \in \{\text{Accidental}, \text{Necessary}, \text{Stabilizing}\}$.

---

## 2. System Families and Metrics Modeling

### 2.1 Family A: Dependency Graphs
*   **Structure**: Directed graph $S = (V, E)$ with service nodes $V$ and dependencies $E$. Source $s \in V$, target $t \in V$.
*   **Goal $G(S)$**:
    $$G(S) = 10 + 2 \times |Paths(s, t)|$$
    where $Paths(s, t)$ is the set of independent edge-disjoint paths from $s$ to $t$ (capped at $G \le 20$). If $t$ is unreachable from $s$, $G(S) = 0$.
*   **Environment $E(S)$**: Structural complexity: $E(S) = |E|$.
*   **Risk $Risk(S)$**:
    $$Risk(S) = \sum_{u \in V \setminus \{t\}} p_u \times P \times FailProb(u, t)$$
    where $p_u$ is the node failure probability, $P = 20$ is the target outage impact, and $FailProb(u, t)$ is the failure propagation probability.
    - An **isolation node** (stabilizing friction $f_s$) reduces $FailProb(u, t)$ along any path it intercepts from $0.90$ to $0.05$.

### 2.2 Family B: Workflow Systems
*   **Structure**: A sequence of tasks from start to finish.
*   **Goal $G(S)$**: Success rate utility:
    $$G(S) = 10 \times SuccessProbability(S)$$
    where $SuccessProbability(S)$ is the combined probability of completing all tasks without unrecoverable rollback failure.
*   **Environment $E(S)$**: Execution cost: $E(S) = \sum_{v \in \text{Tasks}} \text{Cost}(v)$.
*   **Risk $Risk(S)$**: Rollback cost:
    $$Risk(S) = \sum_{u} p_u \times RollbackCost(u)$$
    - A **checkpoint task** (stabilizing friction $f_s$) caches intermediate state.
    - If task $u$ fails, the workflow rolls back to the nearest upstream checkpoint task (or the start if none exists). $RollbackCost(u)$ is the sum of task execution costs between $u$ and the rollback target.

### 2.3 Family C: Resource Systems
*   **Structure**: Resource Allocation Graphs with Processes $P$ and Resource types $R$.
*   **Goal $G(S)$**: Throughput metric:
    $$G(S) = |\{p \in P : \text{Blocked}(p) = 0\}| \times 5$$
*   **Environment $E(S)$**: Allocation complexity: $E(S) = \sum_{r \in R} c(r) + |E_Q| + |E_A|$.
*   **Risk $Risk(S)$**: Contention crash penalty:
    $$Risk(S) = P_{\text{crash}} \times 30$$
    where $P_{\text{crash}} = 1 - e^{-0.5 \times \sum_{r \in R} \max(0, Demand(r) - c(r))}$.
    - A **rate-limiter** (stabilizing friction $f_s$) limits process request rates, reducing $Demand(r)$ at the cost of blocking execution locally (reducing $G$).

---

## 3. Case Matrix (15 Cases)

Each case contains system structure, candidates $\{T_1, \dots, T_n\}$, and difficulty level.

### 3.1 Dependency Graph Cases (DEP)
1.  **DEP-001 (Difficulty: DIRECT)**: Accidental redundant dependency bypass.
    - *Candidate*: $T_1$: Remove bypass.
    - *Oracle optimal*: $T_1$.
2.  **DEP-002 (Difficulty: DIRECT)**: Necessary choke-point dependency.
    - *Candidate*: $T_1$: Remove choke-point.
    - *Oracle optimal*: $T_0$ (no intervention).
3.  **DEP-003 (Difficulty: DIRECT)**: Stabilizing isolation layer removal.
    - *Candidate*: $T_1$: Remove isolation layer to lower path cost.
    - *Oracle optimal*: $T_0$.
4.  **DEP-004 (Difficulty: TRADEOFF)**: Choice between removing redundancy vs removing isolation layer.
    - *Candidates*: $T_1$: Remove redundant edge. $T_2$: Remove isolation node.
    - *Oracle optimal*: $T_1$.
5.  **DEP-005 (Difficulty: ADVERSARIAL)**: Redundant path that acts as critical fault-tolerance.
    - *Candidate*: $T_1$: Remove apparently duplicate edge.
    - *Oracle optimal*: $T_0$ (removing it spikes $Risk$).

### 3.2 Workflow Cases (WRK)
6.  **WRK-001 (Difficulty: DIRECT)**: Accidental duplicate logging task.
    - *Candidate*: $T_1$: Remove duplicate task.
    - *Oracle optimal*: $T_1$.
7.  **WRK-002 (Difficulty: DIRECT)**: Necessary input validation task.
    - *Candidate*: $T_1$: Remove validation to speed up workflow.
    - *Oracle optimal*: $T_0$.
8.  **WRK-003 (Difficulty: DIRECT)**: Stabilizing checkpoint task.
    - *Candidate*: $T_1$: Remove checkpoint to reduce execution cost.
    - *Oracle optimal*: $T_0$.
9.  **WRK-004 (Difficulty: TRADEOFF)**: Optimal checkpoint placement.
    - *Candidates*: $T_1$: Place checkpoint early (cheap but high remaining rollback). $T_2$: Place checkpoint late (optimal).
    - *Oracle optimal*: $T_2$.
10. **WRK-005 (Difficulty: ADVERSARIAL)**: Low-probability failure task with catastrophic rollback penalty.
    - *Candidate*: $T_1$: Remove checkpoint on low-failure task.
    - *Oracle optimal*: $T_0$.

### 3.3 Resource Cases (RES)
11. **RES-001 (Difficulty: DIRECT)**: Redundant lock on non-shared resource.
    - *Candidate*: $T_1$: Remove lock.
    - *Oracle optimal*: $T_1$.
12. **RES-002 (Difficulty: DIRECT)**: Necessary mutex lock on shared state.
    - *Candidate*: $T_1$: Remove mutex.
    - *Oracle optimal*: $T_0$.
13. **RES-003 (Difficulty: DIRECT)**: Stabilizing rate limiter on high contention resource.
    - *Candidate*: $T_1$: Remove rate limiter to improve throughput.
    - *Oracle optimal*: $T_0$.
14. **RES-004 (Difficulty: TRADEOFF)**: Contention mitigation choice.
    - *Candidates*: $T_1$: Add rate limiter. $T_2$: Duplicate resource capacity.
    - *Oracle optimal*: $T_2$ (if cost-effective) or $T_1$.
15. **RES-005 (Difficulty: ADVERSARIAL)**: Rate limiter that appears to cause process starvation locally, but prevents global contention crash.
    - *Candidate*: $T_1$: Remove rate limiter.
    - *Oracle optimal*: $T_0$.
