# Batch-021 Detector Design Freeze — Reachability Invariant Serialization Key

## 1. Goal

This document locks in the key serialization format for $R_{reach}$ and the path connectivity check algorithm in `cli/src/batch-021/evaluate.ts`.

---

## 2. Key Serialization Logic

For any graph configuration $S \in \mathcal{S}_{021}$:

### 2.1 Causal Connectivity DFS Search
1. For node $v$ and action $a$, find if there exists a directed path to target `'t'` using only the observed active edges $E_{act, a}$.
2. The DFS is implemented as:
   ```typescript
   function hasActivePathToTarget(curr: string, target: string, E_act: any[], visited: Set<string>): boolean {
     if (curr === target) return true;
     for (const edge of E_act) {
       if (edge.from === curr && !visited.has(edge.to)) {
         visited.add(edge.to);
         if (hasActivePathToTarget(edge.to, target, E_act, visited)) return true;
         visited.delete(edge.to);
       }
     }
     return false;
   }
   ```

### 2.2 Combined $R_{reach}$ Key
1. Compile signature strings for all observed nodes $v \in O_2(S).nodes$ with $pFail(v) > 0$ under both actions $T_0$ and $T_1$:
   ```typescript
   const sig = `${action}|${pFail(v)}_${Pr(v)}_${hasPath}`;
   ```
2. Sort these signature strings alphabetically and join with `,` to form $X_{reach\_string}(S)$.
3. Combine key:
   \[
   key_{reach}(S) = key_{active}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{reach\_string}(S)
   \]

---

## 3. Evaluation Search Protocol

The execution runner `cli/src/batch-021/evaluate.ts` will compute this key, classify all 38,760 configurations into bins, and calculate the global regret bounds $\varepsilon(R_i)$ exactly as frozen.

---

## 4. Integrity Rule

The DFS connectivity rules, serialization format, and evaluation search loops are strictly locked. No alterations are permitted once execution begins.
