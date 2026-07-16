# Batch-017 Adversary Search Freeze — Candidate Invariant Refinements

## 1. Goal

This document freezes the mathematical definitions of the candidate invariants $X_{dist}$ and $X_{reach}$, the binding rules between node attributes and relative coordinates, and the verification metrics for evaluating the symmetry mismatch closure.

---

## 2. Formal Invariant Definitions

For a graph $S$ with focal node $s$, target node $t$, and node set $V$:

### 2.1 Shortest Path Distances ($d_s(v), d_t(v)$)
* $d_s(v)$ is the length of the shortest directed path from $s$ to $v$. If no path exists, $d_s(v) = 99$.
* $d_t(v)$ is the length of the shortest directed path from $v$ to $t$. If no path exists, $d_t(v) = 99$.

### 2.2 Reachability Indicators ($r_s(v), r_t(v)$)
* $r_s(v) = \mathbf{1}[\text{directed path } s \rightarrow v \text{ exists}]$
* $r_t(v) = \mathbf{1}[\text{directed path } v \rightarrow t \text{ exists}]$

---

## 3. Attribute-Geometry Binding Rules

To preserve the binding between local node attributes and relative position without exposing literal labels, the refinements are represented as **multisets of node signatures**:

### 3.1 Refinement $X_{dist}$ (Relative Distance Signature)
For each node $v \in V$:
\[
Signature_{dist}(v) = \Big( pFail(v), \ Pr(v), \ C(v), \ d_s(v), \ d_t(v) \Big)
\]
The refinement representation $X_{dist}(S)$ is the multiset:
\[
X_{dist}(S) = \left\{ \text{Signature}_{dist}(v) : v \in V \right\}
\]

### 3.2 Refinement $X_{reach}$ (Bipartite Reachability Signature)
For each node $v \in V$:
\[
Signature_{reach}(v) = \Big( pFail(v), \ Pr(v), \ C(v), \ r_s(v), \ r_t(v) \Big)
\]
The refinement representation $X_{reach}(S)$ is the multiset:
\[
X_{reach}(S) = \left\{ \text{Signature}_{reach}(v) : v \in V \right\}
\]

---

## 4. Symmetry Equivalence Check

Two graphs $S_1$ and $S_2$ are equivalent under a refined representation $\Omega_1 \oplus X_i$ if and only if:
1. They are silent under the joint aggregate representation: $\Omega_1(S_1) = \Omega_1(S_2)$.
2. Their signature multisets are identical: $X_i(S_1) = X_i(S_2)$ (allowing any bijective mapping of nodes that preserves the paired attributes and coordinates).
