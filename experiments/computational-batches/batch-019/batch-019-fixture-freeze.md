# Batch-019 Fixture Freeze — Path Canonicalization and Verification Contracts

## 1. Goal

This document locks in the experimental domain ($\mathcal{S}_{019}$), exact path canonicalization rules for $X_{path}$, and the strict verification contract thresholds to evaluate global representational safety.

---

## 2. Experimental Domain and Utility

We reuse the exact parameters from Batch-018:
* **Domain Space ($\mathcal{S}_{019}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Utility $U$**: Evaluated matching Case `DEP-005` under path limit 3:
  * $T_0$ evaluates the path: `s -> v3 -> v3_next -> v3_next_next`.
  * $T_1$ evaluates the path: `s -> t`.
  * Default fallback utility for broken paths is $-14.58$.

---

## 3. Path Canonicalization Rules ($X_{path}$)

The compositional invariant $X_{path}(S)$ is defined as the **sorted multiset of canonical path signatures**:

1. **Path Selection**: Collect all directed, simple paths $p$ starting at `'s'` and ending at `'t'` of length $\ell(p) \le 3$.
2. **Endpoint Inclusions**: Both `'s'` and `'t'` attributes are included in the sequence.
3. **Attribute Sequencing**: For each path $p$, extract the sequence of attributes of its constituent nodes in order:
   \[
   Seq(p) = \left[ \Big( pFail(v), \ Pr(v), \ C(v) \Big) \right]_{v \in p}
   \]
4. **Serialization and Multiplicity**: Serialize each sequence to a string key. The refinement representation $X_{path}(S)$ is the sorted collection (multiset) of these path signature strings.
5. **No Path Fallback**: If no paths $s \leadsto t$ of length $\le 3$ exist, the multiset is empty.

---

## 4. Verification Contract

Because $R_{dist} \oplus X_{path}$ is a mathematical refinement of $R_{dist}$, the regret bound must satisfy monotonicity:
\[
\boxed{
\varepsilon(R_{dist} \oplus X_{path}) \le \varepsilon(R_{dist}) = 15.58
}
\]

We freeze the following outcome classification:

* **Global Sufficiency**: $\varepsilon(R_{dist} \oplus X_{path}) = 0.00$.
* **Strict Improvement**: $0.00 < \varepsilon(R_{dist} \oplus X_{path}) < 15.58$.
* **No Worst-Case Improvement**: $\varepsilon(R_{dist} \oplus X_{path}) = 15.58$.
* **Contract Breach**: $\varepsilon(R_{dist} \oplus X_{path}) > 15.58$ (indicates code/math definition anomaly).
