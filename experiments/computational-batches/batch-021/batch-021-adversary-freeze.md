# Batch-021 Adversary Search Freeze — Reachability Signature Algorithm

## 1. Goal

This document locks in the reachability path search and serialization algorithm to compute the $X_{reach}$ key for all 38,760 configurations.

---

## 2. Directed Reachability Search Algorithm

To compute the reachability flag $hasPathToTarget(v, a)$ on a graph $S$ under action $a$:
1. Define the active edge set $E_{act}$ present in the observed subgraph:
   ```typescript
   const V_act = subGraph.nodes.filter(n => action.activeNodes.includes(n));
   const E_act = subGraph.edges.filter(e => 
     action.activeEdges.includes(`${e.from}->${e.to}`) &&
     V_act.includes(e.from) &&
     V_act.includes(e.to)
   );
   ```
2. Run a Depth-First Search starting at node $v$ to find if target `'t'` is reachable:
   * Keep a set of visited nodes to prevent infinite loops.
   * At node $curr$, if $curr == 't'$, return `true`.
   * For each edge in $E_{act}$, if $edge.from == curr$, recursively search from $edge.to$.
   * If search terminates without reaching `'t'`, return `false`.

---

## 3. Representation Key Integration

The representation key $key_{reach}(S)$ for $R_{reach} = R_{active} \oplus X_{reach}$ is:
\[
key_{reach}(S) = key_{active}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{reach\_string}(S)
\]
where $key_{active}(S)$ is the active signature key from Batch-020, and $X_{reach\_string}(S)$ is the sorted, comma-joined reachability signatures: `${action}|${pFail(v)}_${Pr(v)}_${hasPath}`.

---

## 4. Integrity Rule

The directed DFS connectivity search conditions and the serialization layout are strictly locked. No post-hoc changes are permitted.
