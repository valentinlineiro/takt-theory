# Batch-014 Fixture Freeze — Direct Causal Comparability

## 1. Goal

This document locks in the experimental baseline fixture ($F_{014}$) and the definition of the representational minimality metric. By forcing $F_{014} \equiv F_{013}$ and reusing the identical canonical hash, we guarantee that the only independent variable changing between Batch-013 and Batch-014 is the state representation itself ($X$), preserving strict causal comparability.

---

## 2. Canonical Fixture Definition ($F_{014}$)

The fixture is identical to $F_{013}$ (Case `DEP-005` 5-node variant):

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

### 2.1 Serialization JSON
```json
{"id":"DEP-005","focalElement":"s","kMax":2,"nodes":["s","t","v3","v3_next","v3_next_next"],"edges":[{"from":"s","to":"t"},{"from":"s","to":"v3"},{"from":"v3","to":"t"},{"from":"v3","to":"v3_next"},{"from":"v3_next","to":"v3_next_next"},{"from":"v3_next_next","to":"t"}]}
```

### 2.2 SHA-256 Hash
```
33f4419864ac7b16d11c7473a8192a314a8c38b6f3b0e0a4f9570e83353960b5
```

---

## 3. Minimality Metric Freeze

We freeze the definition of the representational cost metric:

\[
\boxed{\text{size}(X) = \dim(X)}
\]

where $\dim(X)$ is the dimensionality of the additional vector representation. A candidate $X$ is considered minimal if it separates the states with a single additional scalar observable per step:
\[
\text{size}(X) = 1
\]

---

## 4. Execution Assertions

The runner must execute a unit test in `cli/src/batch-014/fixture.test.ts` to assert that:
1. The loaded case `DEP-005` matches the nodes, edges, focal node, and $kMax$ defined above.
2. The serialized representation matches the SHA-256 hash.
3. The computed baseline transitions match the values defined in `batch-013-fixture-freeze.md`.
