# Batch-024 Adversary Search Freeze — Coarsened Partition Algorithm

## 1. Goal

This document locks in the coarsened reachability extraction and partition search loop in `cli/src/batch-024/evaluate.ts`.

---

## 2. Invariant Extraction Algorithm

For each directed graph configuration $S \in \mathcal{S}_{024}$:
1. Compute the simple directed paths invariant $X_{path}(S)$ (Component 2 from Batch-022).
2. For each action candidate $a \in \{T_0, T_1\}$:
   * Define observed active nodes $V_{act}$ and active edges $E_{act}$.
   * Initialize counters: $count_{0.8} = 0$, $count_{0.5} = 0$.
   * Identify all observed nodes $v \in O_2(S).nodes$ with failure rate $pFail(v) > 0$.
   * For each failure node $v$, check reachability to target `'t'` using ONLY edges in $E_{act}$.
   * If reachable:
     * If $pFail(v) == 0.8$, increment $count_{0.8}$.
     * If $pFail(v) == 0.5$, increment $count_{0.5}$.
   * Serialize action signature: `${action}|c8_${count_0.8}|c5_${count_0.5}`.
3. Sort the two action signatures alphabetically and join with `,` to form $X_{coarse\_reach\_string}(S)$.
4. Construct the coarsened key: `keyPath | X_coarse_reach_string`.

---

## 3. Evaluation Search Protocol

The execution loop `cli/src/batch-024/evaluate.ts` will compute this coarsened key for all 38,760 configurations, group them into bins, and calculate:
1. Total bins $N_{coarse}$.
2. Decision conflict bins.
3. The global regret bound $\varepsilon(R_{coarse})$.

---

## 4. Integrity Rule

The coarsened reachability search logic and serialization format are strictly locked. No post-hoc modifications are permitted.
