# Batch-013 Fixture Freeze — Experimental Baseline

## 1. Goal

This document locks in the exact experimental baseline graph (Fixture $F_{013}$) and its canonical metadata. The baseline must remain immutable throughout the Batch-013 cycle, ensuring that any adversarial search is conducted against a deterministic, mathematically defined system.

---

## 2. Canonical Fixture Definition ($F_{013}$)

The fixture is based on Case `DEP-005` (Dependency domain, 5-node variant):

* **Focal Element (Source)**: `s`
* **Target Node**: `t`
* **Expansion Depth**: $kMax = 2$
* **Graph Nodes**: `['s', 't', 'v3', 'v3_next', 'v3_next_next']`
* **Graph Edges**:
  1. `s -> t`
  2. `s -> v3`
  3. `v3 -> t`
  4. `v3 -> v3_next`
  5. `v3_next -> v3_next_next`
  6. `v3_next_next -> t`

### 2.1 Canonical Serialization
To ensure identity across all execution environments, the sorted JSON representation of the fixture structure is defined as:
```json
{"id":"DEP-005","focalElement":"s","kMax":2,"nodes":["s","t","v3","v3_next","v3_next_next"],"edges":[{"from":"s","to":"t"},{"from":"s","to":"v3"},{"from":"v3","to":"t"},{"from":"v3","to":"v3_next"},{"from":"v3_next","to":"v3_next_next"},{"from":"v3_next_next","to":"t"}]}
```

### 2.2 SHA-256 Hash
The canonical hash of the serialization is:
```
33f4419864ac7b16d11c7473a8192a314a8c38b6f3b0e0a4f9570e83353960b5
```

---

## 3. Baseline Sensor Transitions ($k=1 \rightarrow k=2$)

We freeze the exact analytical transition metrics of the clean baseline:

* **Node Count Invariance baseline**:
  * $|V|_1 = 3$ (nodes: `s, t, v3`)
  * $|V|_2 = 5$ (nodes: `s, t, v3, v3_next, v3_next_next`)
  * $\Delta |V|_{clean} = 2$
* **Edge Count Invariance baseline**:
  * $|E|_1 = 3$ (edges: `s->t`, `s->v3`, `v3->t`)
  * $|E|_2 = 6$ (all edges)
  * $\Delta |E|_{clean} = 3$
* **Redundancy baseline**:
  * $\text{Redundancy}_1 = 1.00$ (average disjoint paths to boundary nodes `{v3, t}`)
  * $\text{Redundancy}_2 = 0.00$ (no boundary nodes exist)
  * $\Delta \text{Redundancy}_{clean} = -1.00$
* **Communities baseline**:
  * $\text{Communities}_1 = 1.00$ (local CC of `s, t, v3` is 1.0)
  * $\text{Communities}_2 = 0.333$ (average local CC of the full graph)
  * $\Delta \text{Communities}_{clean} = -0.667$
* **Reliability baseline**:
  * $\rho_1 = \{t: 1.0, v3: 1.0\}$
  * $\rho_2 = \{\}$
  * $d_{\rho, clean} = 0.00$
* **Capabilities baseline**:
  * $d_{caps, clean} = 0.00$

---

## 4. Execution Assertions

The runner must execute a unit test in `cli/src/batch-013/fixture.test.ts` to assert that:
1. The loaded case `DEP-005` matches the nodes, edges, focal node, and $kMax$ defined above.
2. The serialized representation matches the SHA-256 hash.
3. The computed baseline deltas match the frozen values exactly.

---

## 5. Scope Limit

Any adversarial result obtained in Batch-013 is strictly valid under the boundary of this fixture:
\[
\neg\exists A_{kernel} \ \text{on } F_{013} \text{ within the adversarial space}
\]
It does not constitute a proof of universal joint completeness, but rather maps the completeness boundary of the currently operationalized $\Omega$ representation relative to $F_{013}$.
