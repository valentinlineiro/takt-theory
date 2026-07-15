# Batch-024 Fixture Freeze — Coarsened Reachability Invariant

## 1. Goal

This document locks in the definition of the coarsened reachability invariant $X_{coarse\_reach}$ to test if aggregate failure node counts are sufficient for decision safety.

---

## 2. Experimental Domain and Utility

We reuse the parameters of Batch-023:
* **Domain Space ($\mathcal{S}_{024}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Observation Horizon**: $k = 2$.
* **Utility $U$**: Case `DEP-005` parameters (path limit 3, default fallback $-14.58$).

---

## 3. Coarsened Invariant Serialization ($X_{coarse\_reach}$)

For each configuration $S \in \mathcal{S}_{024}$ and each action candidate $a \in \{T_0, T_1\}$:

1. Identify all observed nodes $v \in O_2(S).nodes$ with failure rate $pFail(v) > 0$ that have a valid active directed path to target `'t'` under action $a$ (using the DFS reachability check).
2. Count these nodes grouped by their failure rates:
   * $count_{0.8}(a)$: number of reachable nodes with $pFail(v) = 0.8$.
   * $count_{0.5}(a)$: number of reachable nodes with $pFail(v) = 0.5$.
3. Serialize the action signature as:
   `action|c8_${count_0.8}|c5_${count_0.5}`
4. Join the signatures for $T_0$ and $T_1$ with `,` to form the string representation $X_{coarse\_reach\_string}(S)$.
5. The coarsened representation key is:
   \[
   key_{coarse}(S) = X_{path}(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_{coarse\_reach\_string}(S)
   \]

---

## 4. Verification Check

We freeze the outcomes classification:
* **Coarsened Sufficiency**: $R_{coarse}$ achieves $\varepsilon = 0.00$ with partition size $N_{coarse} < 412$.
* **Node-Specific Resolution Required**: $R_{coarse}$ fails to achieve safety ($\varepsilon > 0.00$), proving that aggregate counts lose too much topology and that individual node mapping is required for safety.
