# Batch-018 Detector Design Freeze — Representation Key Serialization

## 1. Goal

This document locks in the serialization algorithms used to compute unique representation keys for $R_0, R_1, R_2,$ and $R_{dist}$ in the execution script `cli/src/batch-018/evaluate.ts`.

---

## 2. Key Serialization Algorithms

For any graph configuration $S \in \mathcal{S}_{018}$:

### 2.1 Baseline $R_0$ Key
1. Compute the observable snapshot $O_2(S)$ from root `'s'`.
2. Serialize:
   * Node count: $|V_2|$
   * Edge count: $|E_2|$
   * Redundancy: average edge-disjoint paths
   * Communities: clustering coefficient
   * Sorted list of observed capabilities: for each node $v \in V_2$, serialize `serializeCaps(caps[v])`, sort alphabetically, and join with `,`.
3. Join these with `|` to form the string $key_0(S)$.

### 2.2 Refinements $R_1$ and $R_2$ Keys
* $key_1(S) = key_0(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_1(S).toFixed(3)$
* $key_2(S) = key_0(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_2(S).toFixed(3)$

### 2.3 Refinement $R_{dist}$ Key
1. For each node $v \in V_2$:
   * Compute shortest directed path distance to `'s'` ($d_s$) and to `'t'` ($d_t$).
   * Form signature tuple string: `pFail(v)_Pr(v)_caps(v)_ds_dt`
2. Sort the signature tuple strings alphabetically.
3. Join them with `,` to form the string $X_{dist\_string}(S)$.
4. Form the key:
   \[
   key_{dist}(S) = key_0(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{dist\_string}(S)
   \]

---

## 3. Search and Regret Mapping Script

The execution runner at `cli/src/batch-018/evaluate.ts` will implement this key generation, classify all 38,760 configurations into bins, and calculate the global regret bounds $\varepsilon(R_i)$ exactly as frozen.

---

## 4. Integrity Rule

The key formatting, serialization logic, and evaluation loop are strictly frozen. No parameters or tolerances may be modified post-hoc.
