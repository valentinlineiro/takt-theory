# Batch-019 Adversary Search Freeze — Path Invariant Algorithm

## 1. Goal

This document locks in the exact directed path extraction and serialization algorithm to compute the $X_{path}$ keys for all configurations in the experimental space.

---

## 2. Directed Simple Path Finding Algorithm

To compute $X_{path}(S)$ on a graph $S$:
1. **DFS Explorer**: Run a Depth-First Search starting at `'s'` to find all simple directed paths $p = (v_0, v_1, \dots, v_n)$ ending at `'t'` with length $n \le 3$.
   * A path is simple if all $v_i$ are unique (no node loops).
   * Node names along the path are recorded in sequence.
2. **Signature Compilation**: For each path $p$:
   * For each node $v_i \in p$, construct the attribute tuple: `pFail(v_i)_Pr(v_i)_caps(v_i)`
     * `pFail(v_i)` is the failure rate of the node label.
     * `Pr(v_i)` is the reliability capability flag.
     * `caps(v_i)` is the serialized capability string.
   * Form the path signature string: `length_path|[node_attributes_serialized]`
     where `[node_attributes_serialized]` is the comma-separated sequence of node attribute tuples.
3. **Multiset Sorting**: Sort all path signature strings alphabetically.
4. **Final Key Construction**: Join the sorted path signatures with `,` to form the string representation $X_{path\_string}(S)$.

---

## 3. Representation Key Integration

The representation key $key_{path}(S)$ for $R_{path} = R_{dist} \oplus X_{path}$ is:
\[
key_{path}(S) = key_{dist}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{path\_string}(S)
\]
where $key_{dist}(S)$ is the distance signature key from Batch-018.

---

## 4. Integrity Rule

The path exploration logic, attribute serialization structure, and key construction rules are locked. No modifications to path limits or node properties mappings are permitted once execution begins.
