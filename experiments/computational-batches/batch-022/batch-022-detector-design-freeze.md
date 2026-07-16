# Batch-022 Detector Design Freeze — Ablation Loop Serialization

## 1. Goal

This document locks in the key serialization for each of the five components and the powerset evaluation loop implemented in `cli/src/batch-022/evaluate.ts`.

---

## 2. Invariant Component Serialization Keys

For any graph configuration $S \in \mathcal{S}_{022}$ under $k = 2$:

1. **$X_0$ (Baseline)**:
   ```typescript
   const X0 = `${snap.observation.nodes.length}|${snap.observation.edges.length}|${snap.topology.redundancy.toFixed(3)}|${snap.topology.communities.toFixed(3)}|${sortedCaps}`;
   ```
2. **$X_1$ (Landmarks)**:
   ```typescript
   const X1 = nodes.map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}_${ds(v)}_${dt(v)}`).sort().join(',');
   ```
3. **$X_2$ (Paths)**:
   ```typescript
   const X2 = paths.map(p => `${p.length - 1}|${p.map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}`).join(',')}`).sort().join('*');
   ```
4. **$X_3$ (Activation)**:
   ```typescript
   const X3 = ['T0', 'T1'].map(a => `${V_act(a).length}|${E_act(a).length}|${V_act(a).map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}`).sort().join(',')}`).join('*');
   ```
5. **$X_4$ (Reachability)**:
   ```typescript
   const X4 = ['T0', 'T1'].flatMap(a => nodesWithFail.map(v => `${a}|${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${hasActivePathToTarget(v, 't', E_act(a))}`)).sort().join(',');
   ```

---

## 3. Evaluation Search Protocol

The execution script `cli/src/batch-022/evaluate.ts` will loop through all subsets $J \subseteq \{0, 1, 2, 3, 4\}$, group the 38,760 configurations into bins for each $R_J$, and output the final results and Pareto frontier.

---

## 4. Integrity Rule

The serialization formats, component extraction loops, and metrics definitions are strictly locked. No adjustments are permitted once evaluation begins.
