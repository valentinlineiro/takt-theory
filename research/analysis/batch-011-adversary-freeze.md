# Batch-011 Adversary Freeze — The Temporal-Blind Adversary ($A_{temporalFN}$)

## 1. Objective

The goal of the Batch-011 adversary ($A_{temporalFN}$) is to corrupt the representation in a way that induces a decision regret while remaining undetected by the temporal reliability delta channel $\Delta\rho$. 

To prevent validation bias, the adversary must be defined strictly by construction to satisfy the target conditions, without imposing any manual constraints on the other dimensions of $\Delta\Omega$ ($\Delta V$, $\Delta E$, $\Delta \text{Redundancy}$, or $\Delta \text{Communities}$).

---

## 2. Target Constraints

The adversary must satisfy two conditions by construction:
1. **Decision Loss**: $\text{Loss} > 0$ (produces decision mismatch $a^*_{clean} \neq a^*_{corrupt}$ and utility regret).
2. **Silenced Reliability Delta**: $d_\rho = ||\rho_{k+1} - \rho_k||_2 \leq 0.05$.

---

## 3. Construction Mechanisms

We define two explicit mechanisms to implement $A_{temporalFN}$:

### Mechanism A: Interior Node Corruption (Center-Targeted)
* **Concept**: Corrupt a decision-relevant node that lies strictly within the interior of the initial observable subgraph $O_1$.
* **Implementation**: Target the focal node $v_0$ itself. We apply a false negative (FN) to one of its decision-relevant capabilities.
* **Proof of Silencing**:
  * Since the focal node $v_0$ is at distance 0, it is fully observed at $k=1$ and remains in the interior for all subsequent steps $k \geq 1$.
  * It never becomes a boundary node. Therefore, its reliability is never evaluated in any boundary reliability vector $\rho_k$.
  * All boundary nodes at steps $k=1$ and $k=2$ remain clean, meaning $\rho_1 = \langle 1.0, \dots \rangle$ and $\rho_2 = \langle 1.0, \dots \rangle$.
  * Consequently, $d_\rho = 0.00 \leq 0.05$.
* **Proof of Loss**: The focal node's capabilities are highly decision-relevant; corrupting them directly alters the local optimal action selection, producing regret.

### Mechanism B: Persistent Boundary Node Corruption (Depth-Targeted)
* **Concept**: Corrupt a node that is on the boundary at step $k$, but remains on the boundary at step $k+1$.
* **Implementation**: Target a node $v$ on the boundary of $O_1$ that has global degree $g_v$ larger than its local degree at step $k+2$.
* **Proof of Silencing**:
  * At step $k=1$, the node is on the boundary: $\rho_1(v) = 0.80$ (due to targeted capability corruption).
  * At step $k=2$, the node is still on the boundary: $\rho_2(v) = 0.80$.
  * The difference for this node is $\rho_1(v) - \rho_2(v) = 0$.
  * All other boundary nodes are clean (reliability 1.0) at both steps.
  * Therefore, the transition delta is $d_\rho = 0.00 \leq 0.05$.
* **Proof of Loss**: The boundary node lies on the causal path; corrupting its capability changes the decision-relevant evaluation, leading to suboptimal choices.

---

## 4. Experimental Application

For the experimental run, we will utilize **Mechanism A (Interior Node Corruption)** as it provides the most robust isolation of the interior representation from the boundary reliability checks.

### Target Specifications per Case
* **WRK-002**: Target focal node `v0`, corrupting its mutability (`Pm`) capability to `false`.
* **WRK-003**: Target focal node `v0`, corrupting its mutability (`Pm`) capability to `false`.
* **DEP-005**: Target focal node `v0`, corrupting its recovery/redundancy (`Pr`) capability to `false`.

By targeting the focal element, we guarantee that the corruption is decision-relevant (producing utility loss) while ensuring the boundary reliability vectors at all expansion steps remain completely unaffected.

---

## 5. Agnosticism to Other Dimensions

No constraints, weights, or modifications are applied to the topological dimensions of $\Delta\Omega$:
* $\Delta V$, $\Delta E$, $\Delta \text{Redundancy}$, and $\Delta \text{Communities}$ will evolve naturally according to the BFS expansion of the graph.
* The experiment will evaluate whether these topological deltas deviate from the clean baseline *solely* as a byproduct of the capability-based changes, without any manual guidance.
