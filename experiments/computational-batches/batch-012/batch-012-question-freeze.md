# Batch-012 Question Freeze — Structural Observability under Cardinality Invariance

## 1. Origin

Batch-011 proved the transitional completeness of the reliability channel $\Delta\rho$ against capability-based boundary attacks under BFS-based observation. With capability-based ceguera mathematically ruled out under those bounds, the next experimental loop must test **topological corruption** ($A_{topological}$).

Instead of reducing the sensitivity of our detectors, Batch-012 shifts the class of adversary to topological rearrangements. The adversary targets the simplest topological signals: node and edge counts. If an adversary can rearrange connections to alter the optimal decision while keeping node and edge count transitions identical to the clean baseline, we must determine if our higher-order structural metrics can detect this degradation.

---

## 2. Core Question

\[
\boxed{
\text{Given } \text{Loss} > 0 \ \land \ \Delta |V| = 0 \ \land \ \Delta |E| = 0, \quad \text{does } \Delta R > \varepsilon_R \ \lor \ \Delta Com > \varepsilon_{Com}?
}
\]

Equivalently: **When topological corruption is designed to preserve node and edge count transitions (silencing the cardinality channels), do structural metrics (Redundancy $\Delta R$ and Communities $\Delta Com$) preserve a detectable signal of representation degradation?**

---

## 3. Cardinality Invariance vs. Topological Isomorphism

We establish a critical methodological distinction:
* **Cardinality Invariance**: The adversary forces the number of nodes and edges added at each expansion step to remain identical to the clean baseline:
  \[
  |V_{corrupt, k}| = |V_{clean, k}| \quad \land \quad |E_{corrupt, k}| = |E_{clean, k}|
  \]
* **Topological Non-Isomorphism**: The actual graph structure is modified, meaning the clean and corrupt subgraphs are not isomorphic:
  \[
  O_{clean} \ncong O_{corrupt}
  \]

The adversary does not seek to hide all topological changes (which is impossible if the decision changes); it seeks to hide them *solely* from the count-based metrics, testing if structural metrics (disjoint paths and clustering) capture the rearrangement.

---

## 4. Boundary Definitions

### 4.1 Loss (Decision Regret)
* **Decision Mismatch**: The true optimal action under clean conditions differs from the true optimal action under corrupt conditions:
  \[
  a^*_{clean} \neq a^*_{corrupt}
  \]
* **Utility Regret**: The true global utility of the selected action is less than the true global utility of the optimal action:
  \[
  \text{Regret} = U_{true}(a^*_{true}) - U_{true}(a_{selected}) > 0
  \]

### 4.2 Silenced Cardinality Channels
* **Node Count Invariance**:
  \[
  d_{|V|} = ||V_{k+1}|_{corrupt} - |V_k|_{corrupt}| - ||V_{k+1}|_{clean} - |V_k|_{clean}| = 0
  \]
* **Edge Count Invariance**:
  \[
  d_{|E|} = ||E_{k+1}|_{corrupt} - |E_k|_{corrupt}| - ||E_{k+1}|_{clean} - |E_k|_{clean}| = 0
  \]

### 4.3 Structural Signals
* **Redundancy Delta ($\Delta R$)**:
  \[
  \Delta R = |\Delta \text{Redundancy}_{corrupt} - \Delta \text{Redundancy}_{clean}| > 0.10
  \]
* **Community Delta ($\Delta Com$)**:
  \[
  \Delta Com = |\Delta \text{Communities}_{corrupt} - \Delta \text{Communities}_{clean}| > 0.05
  \]

---

## 5. Success Scenarios

The outcomes of Batch-012 will fall into one of three regimes:

### Scenario A — Structural Observability
* **Condition**: $\Delta R > 0.10 \lor \Delta Com > 0.05$ when $\text{Loss} > 0$ and cardinality channels are silenced.
* **Implication**: Higher-order structural metrics successfully detect topological rearrangements even when node and edge counts remain blind. The representation $\Omega$ demonstrates robust structural self-diagnosis.

### Scenario B — Partial Observability
* **Condition**: Detection occurs only on specific topologies or for one of the two structural metrics.
* **Implication**: Observability is topology-dependent. We must map which structural metrics cover which classes of edge rearrangements.

### Scenario C — Structural Observability Boundary
* **Condition**: $\Delta R \le 0.10 \land \Delta Com \le 0.05$ despite $\text{Loss} > 0$ under cardinality invariance.
* **Implication**: We have mapped a clear boundary of observability for the topological dimensions of $\Omega$. Rearrangements that preserve counts are structurally invisible to our metrics, requiring robust hedging policies for topological uncertainty.

---

## 6. Frozen

The following parameters are frozen for the Batch-012 ex-ante phase:
1. The target cases: `WRK-002`, `WRK-003`, `DEP-005`.
2. The core experimental pipeline (clean baseline comparisons, 5 repetitions, incidences `0.00, 0.05, 0.10, 0.15`).
3. The definition of cardinality invariance: $d_{|V|} = 0$ and $d_{|E|} = 0$ at all expansion steps.
4. The requirement that predictions must be frozen and committed *before* designing the adversary or executing the runs.
