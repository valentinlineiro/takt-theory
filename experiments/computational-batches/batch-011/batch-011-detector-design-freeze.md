# Batch-011 Detector Design Freeze — Operationalized Aggregator

## 1. Goal

This document freezes the operational aggregation function $D(\Delta\Omega, \varepsilon) \rightarrow \{\text{detected}, \text{undetected}\}$ before execution. The detector is bound strictly to the currently defined and operationalized state vector $\Omega$, ensuring that no post-hoc changes are made to the observation model after running the experiment.

---

## 2. State Vector Dimensions ($\Omega_k$)

The operationalized representation $\Omega_k$ is captured by the `OmegaSnapshot` defined in `omega.ts` and contains the following dimensions:
1. **Node Set**: $V_k$
2. **Edge Set**: $E_k$
3. **Capabilities Map**: $C_k$ (observed capability signatures of visited nodes)
4. **Boundary Reliability Vector**: $\rho_k$ (reliability index for boundary nodes)
5. **Topological Metrics**: Node count $V$, Edge count $E$, Redundancy, and Communities (clustering coefficient).

---

## 3. Transition Delta Metrics ($\Delta\Omega$)

For the transition $k \rightarrow k+1$, we define the distance functions for each dimension:

| Dimension | Transition Delta | Distance Function |
|-----------|------------------|-------------------|
| **Nodes ($O$)** | $\Delta O$ | Symmetric difference of node sets: $|V_{k+1} \triangle V_k|$ |
| **Reliability ($\rho$)** | $\Delta\rho$ | L2 norm of boundary reliability vector difference: $||\rho_{k+1} - \rho_k||_2$ |
| **Node Count ($V$)** | $\Delta V$ | Node count difference: $|V_{k+1}| - |V_k|$ |
| **Edge Count ($E$)** | $\Delta E$ | Edge count difference: $|E_{k+1}| - |E_k|$ |
| **Redundancy ($R$)** | $\Delta \text{Redundancy}$ | Difference in average disjoint paths to boundary nodes |
| **Communities ($Com$)** | $\Delta \text{Communities}$ | Difference in local clustering coefficient |
| **Capabilities ($C$)** | $\Delta C$ | Sum of Hamming distances of capabilities for nodes in $V_k \cap V_{k+1}$ |

### 3.1 Capabilities Transition Formula ($\Delta C$)
For nodes observed at both step $k$ and $k+1$, we sum the Hamming distance of their capability signatures:
\[
\Delta C = \sum_{v \in V_k \cap V_{k+1}} \text{dist}_{\text{Hamming}}(C_{k+1}(v), C_k(v))
\]
Because capability corruption is static throughout the execution, the capability of any node $v$ remains identical between steps: $C_k(v) = C_{k+1}(v)$, yielding $\Delta C = 0$ ex-ante. This formally models the exclusion of static capability deltas from the transition signal.

---

## 4. Thresholds ($\varepsilon$) and Aggregator

The aggregation function checks if the corrupted execution transition deviates from the baseline clean execution transition at the same step.

### 4.1 Frozen Thresholds ($\varepsilon$)
* **Symmetric Node Diff**: $\varepsilon_O = 0$
* **Reliability L2 Norm**: $\varepsilon_\rho = 0.05$
* **Node Count Diff**: $\varepsilon_V = 0$
* **Edge Count Diff**: $\varepsilon_E = 0$
* **Redundancy Diff**: $\varepsilon_R = 0.10$
* **Clustering Diff**: $\varepsilon_{Com} = 0.05$
* **Capabilities Diff**: $\varepsilon_C = 0$

### 4.2 Aggregation Logic $D(\Delta\Omega, \varepsilon)$
The aggregator returns **detected** if any single dimension deviates from the clean baseline beyond its threshold:

\[
\text{detected} \iff \begin{cases}
|\Delta O_{corrupt} - \Delta O_{clean}| > \varepsilon_O & \lor \\
\Delta\rho_{corrupt} > \varepsilon_\rho & \lor \\
|\Delta V_{corrupt} - \Delta V_{clean}| > \varepsilon_V & \lor \\
|\Delta E_{corrupt} - \Delta E_{clean}| > \varepsilon_E & \lor \\
|\Delta \text{Redundancy}_{corrupt} - \Delta \text{Redundancy}_{clean}| > \varepsilon_R & \lor \\
|\Delta \text{Communities}_{corrupt} - \Delta \text{Communities}_{clean}| > \varepsilon_{Com} & \lor \\
\Delta C_{corrupt} > \varepsilon_C
\end{cases}
\]

Otherwise, the aggregator returns **undetected**.

---

## 5. Frozen Scope

The aggregation function $D(\Delta\Omega, \varepsilon)$ is frozen. During the execution of Batch-011, the aggregator will be implemented exactly as specified here. If the output of $D(\Delta\Omega, \varepsilon)$ is **undetected** while $\text{Loss} > 0$, the boundary of the operationalized representation $\Omega$ under $A_{temporalFN}$ is confirmed.
