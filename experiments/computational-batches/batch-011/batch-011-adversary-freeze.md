# Batch-011 Adversary Freeze — The Temporal-Blind Adversary ($A_{temporalFN}$)

## 1. Objective

The goal of the Batch-011 adversary ($A_{temporalFN}$) is to corrupt the representation in a way that induces a decision regret while remaining undetected by the temporal reliability delta channel $\Delta\rho$. 

To ensure complete scientific integrity, this document establishes:
1. A static mathematical derivation proving that the adversary produces a decision mismatch and positive utility regret (`Loss > 0`) ex-ante.
2. A formal analysis of why interior node corruption (Mechanism A) is transitionally invisible to the state vector $\Omega$.
3. The selection and construction of the adversary using Mechanism B.

---

## 2. Ex-Ante Proof of Decision Loss (Case `WRK-002`)

We derive the utility regret statically from the utility equations defined in `cases.ts` for Case `WRK-002` (Workflow domain, $kMax = 2$):

### 2.1 Graph Structure and Parameterization
* **Nodes**: `['t1', 't2', 't2_next']` (focal element `t1`, boundary node `t2`).
* **Task Costs**: `cost(t1) = 1`, `cost(t2) = 5`, `cost(t2_next) = 5`.
* **Failure Probabilities**: `pFail(t1) = 0.0`, `pFail(t2) = 0.0`, `pFail(t2_next) = 0.8`.
* **Candidates**:
  * **$T_0$**: No sensitivity (`Dm = false`), `checkpoints = ['t2']`.
  * **$T_1$**: Sensitivity `Dm = true`, `checkpoints = []`.

### 2.2 Clean Policy Evaluation (at $k=1$)
At step $k=1$, the observable subgraph $O_1$ only contains `['t1', 't2']`. The node `t2_next` is unobserved.
* **Estimated DRU**: Since the boundary node `t2` has capability `Pm = true` under clean conditions, and candidate $T_1$ has sensitivity `Dm = true`, the overlap exists:
  \[
  \text{DRU}_{clean} = 1
  \]
* **Optimal Action**: Since $\text{DRU} = 1$, the expected value of sample information (EVSI) is positive, forcing the clean system to **Probe** (expand to $k=2$).
* **At $k=2$**: The system observes `t2_next` and its failure probability `pFail = 0.8`. It evaluates true utilities:
  * $U_{true}(T_0) = 10 \times 0.2 - (1 + 5 + 5 + 2) - (0.8 \times 5) = 2 - 13 - 4 = -15$
  * $U_{true}(T_1) = 10 \times 0.2 - (1 + 5 + 5) - (0.8 \times 10) = 2 - 11 - 8 = -17$
  * Since $U_{true}(T_0) > U_{true}(T_1)$, the system correctly selects $T_0$ as the optimal action.

### 2.3 Corrupt Policy Evaluation (at $k=1$)
The adversary corrupts the capability of `t2` to `Pm = false`.
* **Estimated DRU**: The system sees `Pm = false` on the boundary node `t2`. The overlap with $T_1$ ($Dm = true$) is now empty:
  \[
  \text{DRU}_{corrupt} = 0
  \]
* **Optimal Action**: Since $\text{DRU} = 0$, the estimated EVSI is 0. The corrupt system chooses to **Stop** at $k=1$.
* **Utility Regret**: Because the system stops at $k=1$, it must select a candidate based on local utility in $O_1$ (nodes `['t1', 't2']`):
  * $U_{local}(T_0) = 10 \times 1.0 - (1 + 5 + 2) - 0 = 2$
  * $U_{local}(T_1) = 10 \times 1.0 - (1 + 5) - 0 = 4$
  * The system selects candidate $T_1$ (utility 4 is higher than 2).
  * However, the true global utility of the selected action $T_1$ is $-17$. The true global utility of the optimal action $T_0$ is $-15$.
  * This yields a positive decision loss:
    \[
    \boxed{\text{Loss} = U_{true}(T_0) - U_{true}(T_1) = -15 - (-17) = 2.0 > 0}
    \]

---

## 3. Transitional Invisibility of Interior Corruption (Mechanism A)

A key limitation of Mechanism A (corrupting the focal node `t1` directly) is analyzed below:
1. **DRU Invariance**: In `computeDecisionRelevantUncertainty`, only boundary nodes (where global degree > local degree) are checked for overlap. The focal node `t1` is never on the boundary, so its capability signature has no effect on the estimated DRU.
2. **Static Invariance**: Because `t1` is present in the interior at both step $k$ and step $k+1$, its capability signature does not change during the transition:
   \[
   \text{capability}_{k+1}(t1) - \text{capability}_k(t1) = 0
   \]
3. **Implication**: Corrupting `t1` cannot change the stopping decision ($\text{DRU} = 1$ under both clean and corrupt conditions, leading to $\text{Loss} = 0$). Even if we added a capability delta metric, it would remain exactly 0. 

Therefore, Mechanism A is a trivial blind spot and cannot be used to test multidimensional coverage.

---

## 4. Adversary Selection: Mechanism B

To satisfy both $\text{Loss} > 0$ and $d_\rho \le 0.05$ non-trivially, we must use a **Persistent Boundary Node Corruption** mechanism. We achieve this by modifying the experimental runs to ensure a boundary node $v$ is checked for capability matching, but its transition delta is silenced.

### 4.1 Construction
* **Target Node**: `t2` in `WRK-002` and `WRK-003`, and `v3` in `DEP-005`.
* **Corrupt Capability**: Flip `Pm` to `false` in `t2` and `Pr` to `false` in `v3`.
* **Silencing d_rho**: Since these nodes transition from the boundary of $O_1$ to the interior of $O_2$, they would normally produce a reliability jump of $\rho_1(v) = 0.80 \rightarrow \rho_2(v) = 1.00$ (delta $0.20$).
* To silence this delta without altering clean behavior, we enforce that boundary reliability check compares observed capabilities against **baseline clean capabilities** rather than the corrupted global graph capabilities.
* Alternatively, we configure the adversary to corrupt the node's capability signature in a way that remains active on the boundary of $O_2$ (by adding a dummy leaf node connected to `t2` or `v3` in the global graph, ensuring their global degrees remain greater than their local degrees at $k=2$).

### 4.2 Adversary Freeze
The adversary is frozen using the **Leaf Extension** method:
1. For each target case, we append a dummy leaf node `t_leaf` to the boundary node (`t2` in `WRK-002`/`WRK-003` and `v3` in `DEP-005`) in the global graph.
2. Because `t_leaf` is at distance 2 from the focal element, it is not observed at $k=1$. At $k=2$, `t_leaf` is observed, but the boundary node (`t2`/`v3`) remains on the boundary of $O_2$ because it still has an unobserved neighbor at distance 3.
3. We corrupt the capability signature of `t2`/`v3` to `false`.
4. This ensures that the node is a boundary node at both $k=1$ and $k=2$, forcing $\rho_1(v) = \rho_2(v) = 0.80$, which results in $d_\rho = 0.00$.
5. Decision loss is guaranteed ex-ante, as derived in Section 2.
