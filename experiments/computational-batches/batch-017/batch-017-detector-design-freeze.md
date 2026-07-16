# Batch-017 Detector Design Freeze — Symmetry Mismatch Search Protocol

## 1. Goal

This document freezes the operational code definitions for the candidate invariants and the search algorithm used to evaluate the symmetry mismatch sets $M_{X_i}$ on the node permutations.

---

## 2. Invariant Code Implementation

The evaluation script `cli/src/batch-017/evaluate.ts` will implement the invariants as follows:

### 2.1 Shortest Path Distance Algorithm
Using a standard Breadth-First Search (BFS) on the directed graph, for any node $v$:
* `dist(from, to)` computes the directed distance.
* `ds(v) = dist('s', v)`
* `dt(v) = dist(v, 't')`

### 2.2 Invariant Comparisons
Two multisets of tuples are compared by sorting their serialized string keys. They match if and only if their sorted keys are identical.

---

## 3. Evaluation Search Protocol

The execution runner performs the following steps:

1. **Permutation Scan**: Generate all 120 permutations of the node labels `['s', 't', 'v3', 'v3_next', 'v3_next_next']`.
2. **Baseline Mismatch Identification**: For each permuted graph $S' = \pi S_{clean}$:
   * Verify if the transition $S_{clean} \rightarrow S'$ is silent under the baseline joint representation $\Omega_1$ ($D_{joint}^{(2)} = \text{undetected}$).
   * Verify if the optimal decision changes ($a^*(S') \neq a^*(S_{clean})$).
   * If both hold, add $\pi$ to the baseline mismatch set $M$.
3. **Refinement Filtering**: For each $\pi \in M$, compute the candidate invariants for $S_{clean}$ and $\pi S_{clean}$:
   * $X_{dist}$
   * $X_{reach}$
   * $X_{target}$
   * $X_{target} \oplus X_{dist}$
   and record whether they remain silent.
4. **Output Mismatch Counts**: Print and save the size of the remaining mismatch sets ($|M_{X_i}|$).

---

## 4. Integrity Rule

The evaluation protocol, search space, and metric definitions are strictly frozen. No post-hoc parameters adjustments are allowed after execution begins.
