# Batch-021 Fixture Freeze — Reachability Signature Canonicalization

## 1. Goal

This document locks in the canonicalization rules for the action-conditioned causal reachability signature $X_{reach}(S)$ to test whether aligning representational safety with action-conditioned risk propagation semantics closes the regret gap.

---

## 2. Experimental Domain and Utility

We reuse the parameters of Batch-020:
* **Domain Space ($\mathcal{S}_{021}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Observation Horizon**: $k = 2$.
* **Utility $U$**: Case `DEP-005` parameters (path limit 3, default fallback $-14.58$).

---

## 3. Causal Reachability Canonicalization Rules ($X_{reach}$)

For any configuration $S \in \mathcal{S}_{021}$ and each action candidate $a \in \{T_0, T_1\}$:

1. **Path Constraint**: A path from $v$ to `'t'` is valid under action $a$ if and only if it is directed, simple, and uses only edges in the observed active edge set $E_{act, a} = O_2(S).edges \cap candidate\_active\_edges(a)$.
2. **Failure Node Extraction**: Identify all observed nodes $v \in O_2(S).nodes$ with failure rate $pFail(v) > 0$.
3. **Causal Connectivity Indicator**: For each failure node $v$, compute the binary flag:
   \[
   hasPathToTarget_a = \mathbf{1}[\text{a valid directed path exists from } v \text{ to } 't' \text{ under } E_{act, a}]
   \]
4. **Signature Compilation**: Serialize each entry as a string tuple:
   `action|pFail(v)_Pr(v)_hasPath`
5. **Final $X_{reach}$ Key**: Sort all signature strings alphabetically and join them with `,` to form the string representation $X_{reach\_string}(S)$.

---

## 4. Verification Contract

Because $R_{reach} = R_{active} \oplus X_{reach}$ is a mathematical refinement of $R_{active}$, the regret bound must satisfy monotonicity:
\[
\boxed{
\varepsilon(R_{active} \oplus X_{reach}) \le \varepsilon(R_{active}) = 13.58
}
\]

We freeze the following outcome classification:

* **Global Sufficiency**: $\varepsilon(R_{active} \oplus X_{reach}) = 0.00$.
* **Strict Improvement**: $0.00 < \varepsilon(R_{active} \oplus X_{reach}) < 13.58$.
* **No Worst-Case Improvement**: $\varepsilon(R_{active} \oplus X_{reach}) = 13.58$.
* **Contract Breach**: $\varepsilon(R_{active} \oplus X_{reach}) > 13.58$.
