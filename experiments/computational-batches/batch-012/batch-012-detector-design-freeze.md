# Batch-012 Detector Design Freeze — Operational Structural Aggregator

## 1. Goal

This document freezes the operational structural aggregator $D_{struct}(\Delta\Omega, \varepsilon) \rightarrow \{\text{detected}, \text{undetected}\}$ ex-ante. The detector is bound strictly to the currently implemented community and redundancy metrics, ensuring no post-hoc tuning is performed during execution.

---

## 2. Operational Structural Metrics

### 2.1 Community Metric (Average Clustering Coefficient)
* **Node Local Clustering**: For any node $v \in V_k$ with degree $d_v \geq 2$, the local clustering coefficient $C(v)$ is the ratio of edges between its neighbors to the maximum possible edges:
  \[
  C(v) = \frac{2 \times |\{ \{u, w\} \in E_k : u, w \in \text{Neighbors}(v) \}|}{d_v(d_v - 1)}
  \]
* **Average Clustering**: Nodes with $d_v < 2$ are excluded. The average clustering coefficient of the observed subgraph $O_k$ is:
  \[
  \text{Communities}(O_k) = \frac{1}{|V_{\geq 2}|} \sum_{v \in V_{\geq 2}} C(v)
  \]
* **Transition Delta**:
  \[
  \Delta \text{Communities} = \text{Communities}(O_{k+1}) - \text{Communities}(O_k)
  \]

### 2.2 Redundancy Metric (Average Disjoint Paths)
* **Average Disjoint Paths**: For all boundary nodes $b \in B_k$, we calculate the number of edge-disjoint paths from the focal element $s$ to $b$ using undirected Ford-Fulkerson unit-capacity search.
* **Average Redundancy**:
  \[
  \text{Redundancy}(O_k) = \frac{1}{|B_k|} \sum_{b \in B_k} \text{countEdgeDisjointPaths}(O_k, s, b)
  \]
  If $|B_k| = 0$, the redundancy is defined as $0.0$.
* **Transition Delta**:
  \[
  \Delta \text{Redundancy} = \text{Redundancy}(O_{k+1}) - \text{Redundancy}(O_k)
  \]

---

## 3. Clean vs. Corrupt Comparison

The structural aggregator measures the absolute deviation of the corrupt transition deltas from the baseline clean transition deltas at the same step:
* **Redundancy Deviation ($\Delta R$)**:
  \[
  \Delta R = |\Delta \text{Redundancy}_{corrupt} - \Delta \text{Redundancy}_{clean}|
  \]
* **Community Deviation ($\Delta Com$)**:
  \[
  \Delta Com = |\Delta \text{Communities}_{corrupt} - \Delta \text{Communities}_{clean}|
  \]

---

## 4. Frozen Aggregator and Thresholds

### 4.1 Frozen Thresholds ($\varepsilon$)
* **Redundancy Threshold**: $\varepsilon_R = 0.10$
* **Community Threshold**: $\varepsilon_{Com} = 0.05$

### 4.2 Aggregation Logic $D_{struct}$
The aggregator returns **detected** if either structural dimension deviates beyond its threshold:

\[
\text{detected} \iff \Delta R > 0.10 \quad \lor \quad \Delta Com > 0.05
\]

Otherwise, the aggregator returns **undetected**.
