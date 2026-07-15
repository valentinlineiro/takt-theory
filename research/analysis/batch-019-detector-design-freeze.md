# Batch-019 Detector Design Freeze — Path Invariant Serialization Key

## 1. Goal

This document locks in the key serialization format for $R_{path}$ and the algorithm used to extract simple directed paths in `cli/src/batch-019/evaluate.ts`.

---

## 2. Key Serialization Logic

For any graph configuration $S \in \mathcal{S}_{019}$:

### 2.1 Path Extraction
1. Start at `'s'`. Find all directed simple paths $p = (v_0, \dots, v_n)$ ending at `'t'` with length $n \le 3$.
2. For each path $p$:
   * Extract the node attribute sequence:
     ```typescript
     const seqStr = p.map(v => `${failures[v] ?? 0.00}_${capabilities[v]?.Pr ?? false}_${serializeCaps(capabilities[v] ?? {})}`).join(',');
     ```
   * Form path string: `${p.length}|${seqStr}`
3. Sort all path strings alphabetically.
4. Join with `*` to form the string representation $X_{path\_string}(S)$.

### 2.2 Combined $R_{path}$ Key
The representation key is:
\[
key_{path}(S) = key_{dist}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{path\_string}(S)
\]
where $key_{dist}(S)$ is the distance signature key from Batch-018.

---

## 3. Evaluation Search Protocol

The execution runner `cli/src/batch-019/evaluate.ts` will compute this key, group the 38,760 configurations into bins, and calculate the global regret bounds $\varepsilon(R_i)$ exactly as frozen.

---

## 4. Integrity Rule

The serialization key formats, path limit tolerances, and evaluation loops are strictly locked. No post-hoc parameter modifications are allowed.
