# Batch-020 Detector Design Freeze — Activation Invariant Serialization Key

## 1. Goal

This document locks in the key serialization format for $R_{active}$ and the algorithm to extract observed active nodes/edges in `cli/src/batch-020/evaluate.ts`.

---

## 2. Key Serialization Logic

For any graph configuration $S \in \mathcal{S}_{020}$ and each action candidate $a \in \{T_0, T_1\}$:

### 2.1 Activation Signatures
1. Compute the observed active nodes:
   ```typescript
   const V_act = O_2.nodes.filter(v => action.activeNodes.includes(v));
   ```
2. Compute the observed active edges:
   ```typescript
   const E_act = O_2.edges.filter(e => 
     action.activeEdges.includes(`${e.from}->${e.to}`) &&
     V_act.includes(e.from) &&
     V_act.includes(e.to)
   );
   ```
3. Serialize observed active node attributes:
   ```typescript
   const nodeAttrs = V_act.map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}`).sort();
   ```
4. Form action signature string:
   ```typescript
   const signActive = `${V_act.length}|${E_act.length}|${nodeAttrs.join(',')}`;
   ```

### 2.2 Combined $R_{active}$ Key
Combine T0 and T1 signatures, and append to $key_{path}$:
\[
key_{active}(S) = key_{path}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} signActive_{T_0} \mathbin{\Vert} \text{"*"} \mathbin{\Vert} signActive_{T_1}
\]

---

## 3. Evaluation Search Protocol

The execution runner `cli/src/batch-020/evaluate.ts` will compute this key, classify all 38,760 configurations into bins, and calculate the global regret bounds $\varepsilon(R_i)$ exactly as frozen.

---

## 4. Integrity Rule

The serialization formats, filtering conditions, and search loops are strictly frozen. No post-hoc parameter modifications are permitted.
