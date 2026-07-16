# Batch-015 Fixture Freeze — Augmented Representation Baseline

## 1. Goal

This document locks in the experimental baseline fixture ($F_{015}$) for Batch-015. By reusing the identical 5-node variant of `DEP-005`, we maintain strict experimental continuity to evaluate the stability of $\Omega_1 = \Omega \oplus X_2$.

---

## 2. Canonical Fixture Definition ($F_{015}$)

The fixture is identical to $F_{013}$ and $F_{014}$:

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

## 3. Execution Assertions

The runner must run a unit test in `cli/src/batch-015/fixture.test.ts` to assert that:
1. The loaded case `DEP-005` matches the nodes, edges, focal node, and $kMax$.
2. The serialized representation matches the SHA-256 hash.
3. The executable variables match the specifications in `fixture-semantic-contract.md`.
