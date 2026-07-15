# TAKT Fixture Semantic Contract

## 1. Objective

This document serves as the single source of truth for the semantic rules, parameter mappings, and fallback behaviors of experimental graph fixtures. All mathematical models and ex-ante predictions must align with the executable contracts specified here to prevent discrepancy errors between mental models and runner execution.

---

## 2. Parameter Mappings & Fallbacks (Case `DEP-005`)

### 2.1 Node Failure Probabilities ($pFail$)
The system maps failure rates using a strict node-name lookup.
* **Defined Values**:
  * `v3` = `0.01`
  * `v3_next` = `0.80`
  * `decoy_v4` = `0.80`
* **Absence Fallback Rule**: Any node not explicitly defined in the failure map defaults to:
  \[
  \boxed{pFail = 0.00}
  \]
  * Specifically: `v3_next_next` = `0.00`, `s` = `0.00`, `t` = `0.00`.

### 2.2 Node Capabilities
* `v3`: `Pr = true` (recovery capability present)
* `v3_next`: `Pr = false` (or unmapped)
* `v3_next_next`: `Pr = false` (or unmapped)
* `s`, `t`: `Pr = false` (or unmapped)

---

## 3. Topology & BFS Expansion Contracts

* **Focal Node**: `s` (root, distance = 0)
* **Target Node**: `t` (sink)
* **BFS step $k=1$ node set**: $V_1 = \{s, t, v3\}$
* **BFS step $k=2$ node set**: $V_2 = \{s, t, v3, v3\_next, v3\_next\_next\}$

---

## 4. Utility Decision Math

### 4.1 Profit Component ($g$)
* If paths exist from `s` to `t` under active intervention edges:
  \[
  g = \min(20, 10 + 2 \times \text{disjointCount})
  \]
  Otherwise, $g = 0$.

### 4.2 Cost Component ($e$)
* $e$ matches the count of active edges present in the observed subgraph $O_k$.

### 4.3 Risk Component ($r$)
For each active node $v \in V_k$ (excluding `s` and `t`):
1. **Connectivity Check**: Path from $v$ to `t` must exist under active edges.
2. **Isolation/Interception Check**:
   * If path is intercepted by an active isolation node: `failProb = 0.05`.
   * Otherwise: `failProb = 0.90`.
3. **Risk contribution**:
   \[
   r_v = pFail(v) \cdot 20 \cdot \text{failProb}
   \]

---

## 5. Invariant Contracts

No runner execution or adversary construction is allowed to modify:
1. The global node capability definitions (`caps`).
2. The global failure probability mappings (`failures`).
3. The default fallback rule ($pFail = 0.00$ for unmapped nodes).
