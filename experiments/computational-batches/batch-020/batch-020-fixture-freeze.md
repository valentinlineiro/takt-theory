# Batch-020 Fixture Freeze — Activation Structure Canonicalization

## 1. Goal

This document locks in the canonicalization rules for the activation signature $X_{activation}(S)$ to test whether aligning representational safety with observational activation semantics closes the regret gap.

---

## 2. Experimental Domain and Utility

We reuse the parameters of Batch-019:
* **Domain Space ($\mathcal{S}_{020}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Observation Horizon**: $k = 2$.
* **Utility $U$**: Case `DEP-005` parameters (path limit 3, default fallback $-14.58$).

---

## 3. Activation Canonicalization Rules ($X_{activation}$)

For any configuration $S \in \mathcal{S}_{020}$ and each action candidate $a \in \{T_0, T_1\}$:

1. **Active Nodes Intersection**: Identify the set of observed active nodes:
   \[
   V_{act, a} = O_2(S).nodes \cap candidate\_active\_nodes(a)
   \]
2. **Active Edges Intersection**: Identify the set of observed active edges:
   \[
   E_{act, a} = O_2(S).edges \cap candidate\_active\_edges(a)
   \]
3. **Sequence of Observed Active Attributes**:
   * For each node $v \in V_{act, a}$, construct the attribute signature: `pFail(v)_Pr(v)_caps(v)`.
   * Sort these node attribute signatures alphabetically.
4. **Action Signature Serialization**: Form the serialized string for action $a$:
   \[
   Sign(Active_a) = |V_{act, a}| \mathbin{\Vert} \text{"|"} \mathbin{\Vert} |E_{act, a}| \mathbin{\Vert} \text{"|"} \mathbin{\Vert} [sorted\_attributes\_joined\_by\_comma]
   \]
5. **Final $X_{activation}$ Key**: Combine the signatures of both actions:
   \[
   X_{activation\_string}(S) = Sign(Active_{T_0}) \mathbin{\Vert} \text{"*"} \mathbin{\Vert} Sign(Active_{T_1})
   \]

---

## 4. Verification Contract

Because $R_{active} = R_{path} \oplus X_{activation}$ is a mathematical refinement of $R_{path}$ (from Batch-019), the regret bound must satisfy monotonicity:
\[
\boxed{
\varepsilon(R_{path} \oplus X_{activation}) \le \varepsilon(R_{path}) = 15.58
}
\]

We freeze the following outcome classification:

* **Global Sufficiency**: $\varepsilon(R_{path} \oplus X_{activation}) = 0.00$.
* **Strict Improvement**: $0.00 < \varepsilon(R_{path} \oplus X_{activation}) < 15.58$.
* **No Worst-Case Improvement**: $\varepsilon(R_{path} \oplus X_{activation}) = 15.58$.
* **Contract Breach**: $\varepsilon(R_{path} \oplus X_{activation}) > 15.58$.
