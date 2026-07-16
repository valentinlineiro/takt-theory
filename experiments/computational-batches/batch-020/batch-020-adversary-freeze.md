# Batch-020 Adversary Search Freeze — Activation Key Algorithm

## 1. Goal

This document locks in the exact algorithm to compute the $X_{activation}$ key for all 38,760 configurations in the experimental space.

---

## 2. Activation Signature Construction Algorithm

For each configuration $S \in \mathcal{S}_{020}$ and each action candidate $a \in \{T_0, T_1\}$:
1. Extract the observed subgraph $O_2(S)$ from root `'s'` at $k = 2$.
2. Filter the observed active nodes:
   ```typescript
   const V_act = O_2.nodes.filter(v => candidate_active_nodes(a).includes(v));
   ```
3. Filter the observed active edges:
   ```typescript
   const E_act = O_2.edges.filter(e => 
     candidate_active_edges(a).includes(`${e.from}->${e.to}`) &&
     V_act.includes(e.from) &&
     V_act.includes(e.to)
   );
   ```
4. Compile the list of node attribute signatures:
   ```typescript
   const nodeAttrs = V_act.map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}`).sort();
   ```
5. Serialize the action signature:
   ```typescript
   const signActive = `${V_act.length}|${E_act.length}|${nodeAttrs.join(',')}`;
   ```
6. Combine the action signatures:
   ```typescript
   const keyActivation = `${signActive_T0}*${signActive_T1}`;
   ```

---

## 3. Representation Key Integration

The representation key $key_{active}(S)$ for $R_{active} = R_{path} \oplus X_{activation}$ is:
\[
key_{active}(S) = key_{path}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} key_{Activation}
\]
where $key_{path}(S)$ is the path signature key from Batch-019.

---

## 4. Integrity Rule

The node and edge filtering conditions, sorting rules, and key concatenation sequence are strictly locked. No alterations are allowed once execution starts.
