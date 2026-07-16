# Batch-024 Detector Design Freeze — Coarsened Key Serialization

## 1. Goal

This document locks in the key serialization format for $R_{coarse}$ and the evaluation loop implemented in `cli/src/batch-024/evaluate.ts`.

---

## 2. Key Serialization Logic

For any graph configuration $S \in \mathcal{S}_{024}$:

### 2.1 Coarsened Reachability Signature
1. Identify all observed nodes $v \in O_2(S).nodes$ with failure rate $pFail(v) > 0$.
2. For each action candidate $a \in \{T_0, T_1\}$, calculate whether target `'t'` is reachable from $v$ using active edges of $a$.
3. Count the reachable failed nodes:
   ```typescript
   let c8 = 0;
   let c5 = 0;
   for (const v of nodesWithFail) {
     if (hasActivePathToTarget(v, 't', E_act(a), new Set([v]))) {
       if (failures[v] === 0.8) c8++;
       if (failures[v] === 0.5) c5++;
     }
   }
   const actSig = `${action}|c8_${c8}|c5_${c5}`;
   ```
4. Join the sorted action signatures with `,` to form $X_{coarse\_reach\_string}(S)$.
5. Combine key:
   \[
   key_{coarse}(S) = X_2(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{coarse\_reach\_string}(S)
   \]

---

## 3. Evaluation Search Protocol

The execution runner `cli/src/batch-024/evaluate.ts` will compute this coarsened key for all 38,760 configurations, group them into bins, and calculate total bins, conflict bins, and maximum regret.

---

## 4. Integrity Rule

The serialization format and evaluation loop are strictly locked. No post-hoc changes are allowed.
