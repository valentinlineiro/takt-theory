# Batch-015 Adversary Freeze — Target Permutation ($A_{kernel}^{(2)}$)

## 1. Objective

The goal of $A_{kernel}^{(2)}$ is to demonstrate that the augmented representation $\Omega_1 = \Omega \oplus X$ remains vulnerable to label-permutation attacks by swapping two observationally equivalent nodes where one carries target-sink decision semantics.

---

## 2. Adversary Construction (Transposition Mapping)

We swap the identities of `'t'` and `'v3_next_next'` using the permutation $\pi$:
\[
\pi(t) = v3\_next\_next, \quad \pi(v3\_next\_next) = t, \quad \pi(v) = v \text{ (others)}
\]

Applying $\pi$ to the clean edges of `DEP-005` yields the corrupt edges of $A_{kernel}^{(2)}$:

1. `s -> v3_next_next` (was `s -> t`)
2. `s -> v3`
3. `v3 -> v3_next_next` (was `v3 -> t`)
4. `v3 -> v3_next`
5. `v3_next -> t` (was `v3_next -> v3_next_next`)
6. `t -> v3_next_next` (was `v3_next_next -> t`)

### 2.1 Candidate Interventions Active Edges Update
* **$T_0$ Active Edges**: All 6 corrupt edges.
* **$T_1$ Active Edges**: All corrupt edges excluding `v3 -> v3_next_next` (recovery edge).

---

## 3. Semantics of the Target Sink

The decision utility engine evaluates paths to the node strictly matching the identity `'t'`. Under clean conditions, `'t'` is adjacent to `'s'` and `'v3'`. Under corruption, the node labeled `'t'` occupies the physical position of `'v3_next_next'` (at distance 2 from `'s'`). 

Since the representation $\Omega_1$ is label-agnostic, it cannot verify which node carries target decision semantics, treating `'t'` and `'v3_next_next'` as interchangeable anonymous nodes.

---

## 4. Ex-Ante Proof of Invariance ($\Delta\Omega_1 = \vec{0}$)

Because the transposition $\pi$ is an isomorphism permutation on unmapped nodes, it is perfectly silent to all structural and semantic sensors:

1. **Topological Isomorphism**: Swapping node labels preserves the complete topology, yielding $\Delta |V| = 0$, $\Delta |E| = 0$, $\Delta R = 0.00$, and $\Delta Com = 0.00$.
2. **Reliability and Capabilities**: No capability properties are altered in the global graph, yielding $d_\rho = 0.00$ and $d_{caps} = 0.00$.
3. **Augmented Metric Invariance ($X_1$, $X_2$)**:
   * Both `'t'` and `'v3_next_next'` have identical attributes: $pFail = 0.00$ and `Pr = false`.
   * At $k=1$, $V_1 = \{s, v3, v3\_next\_next\}$, yielding:
     * $X_2(1)_{corrupt} = p_f(s) + p_f(v3) + p_f(v3\_next\_next) = 0.01$ (matches clean).
     * $X_1(1)_{corrupt} = 0.01$ (matches clean).
   * At $k=2$, all nodes are observed, so sums are identical.
   * Therefore, $d_{X1} = 0.00 \leq 0.005$ and $d_{X2} = 0.00 \leq 0.05$.

This proves $\Delta\Omega_1 = \vec{0}$ by construction.

---

## 5. Ex-Ante Proof of Decision Loss ($\text{Loss} > 0$)

We derive the utilities under corruption using the true fixture parameters:
* **$T_0$ Utility**:
  * Active edges: all 6 edges.
  * Paths from `s` to `'t'`: `s -> v3 -> v3_next -> t`. (Disjoint count = 1).
  * $g = 12$, $e = 6$.
  * Active risk nodes: `v3` ($pFail = 0.01$, connected to `'t'`) and `v3_next` ($pFail = 0.80$, connected to `'t'`).
  * Risk $r = 10 \times (0.01 + 0.80) \times 2 \times 0.90 = 14.58$.
  * $U(T_0) = 12 - 6 - 14.58 = -8.58$.
* **$T_1$ Utility**:
  * Active edges: 5 edges (recovery edge `v3 -> v3_next_next` is cut off).
  * Paths from `s` to `'t'`: `s -> v3 -> v3_next -> t`. (Disjoint count = 1).
  * $g = 12$, $e = 5$.
  * Active risk nodes: `v3` and `v3_next`. Risk $r = 14.58$.
  * $U(T_1) = 12 - 5 - 14.58 = -7.58$.
* **Decision Regret**:
  * Optimal action under corruption flips to $T_1$.
  * \[
    \boxed{\text{Loss} = U(T_1) - U(T_0) = -7.58 - (-8.58) = 1.00 > 0}
    \]
  proving decision loss.
