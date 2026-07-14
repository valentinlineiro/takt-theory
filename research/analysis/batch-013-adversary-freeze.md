# Batch-013 Adversary Freeze — The Kernel-Intersecting Adversary ($A_{kernel}$)

## 1. Objective

The goal of the Batch-013 adversary ($A_{kernel}$) is to exploit the label-agnostic nature of structural sensors by applying a topological permutation that preserves graph isomorphism (silencing all structural sensors) and leaves capability signatures uncorrupted (silencing all capability sensors) while altering the utility structure to induce decision regret (`Loss > 0`).

---

## 2. Adversary Construction (Configuration #187)

The adversary reorganizes the graph edges for Case `DEP-005` under corruption (incidence > 0) as follows:

* **Clean Edges**: `s->t`, `s->v3`, `v3->t`, `v3->v3_next`, `v3_next->v3_next_next`, `v3_next_next->t`.
* **Corrupt Edges**:
  1. `s -> v3_next`
  2. `s -> v3_next_next`
  3. `v3 -> t`
  4. `v3_next_next -> t`
  5. `v3_next -> v3`
  6. `v3_next_next -> v3_next`

### 2.1 Shortest Path Distance Verification
The shortest path distances from `s` are permuted:
* `s`: distance 0.
* `v3_next`: connected via `s -> v3_next` $\implies$ distance 1.
* `v3_next_next`: connected via `s -> v3_next_next` $\implies$ distance 1.
* `v3`: connected via `v3_next -> v3` (where `v3_next` is at distance 1) $\implies$ distance 2.
* `t`: connected via `v3_next_next -> t` (where `v3_next_next` is at distance 1) $\implies$ distance 2.

### 2.2 Candidate Intervention Active Edges Update
To reflect the edge mapping under corruption, the active edges of the candidate interventions are dynamically updated:
* **$T_0$ Active Edges**: `s->v3_next`, `s->v3_next_next`, `v3->t`, `v3_next_next->t`, `v3_next->v3`, `v3_next_next->v3_next`.
* **$T_1$ Active Edges**: `s->v3_next`, `s->v3_next_next`, `v3_next_next->t`, `v3_next->v3`, `v3_next_next->v3_next` (recovery edge `v3->t` is removed).

---

## 3. Ex-Ante Proof of Invariance (Observability Kernel)

Because the corrupt graph is isomorphic to the clean graph (it is the exact same graph topology under a node label permutation), all purely topological metrics are mathematically identical to the baseline clean runs:

1. **Cardinality Invariance**:
   * Nodes at distance 1: 2 nodes (`v3_next`, `v3_next_next` under corrupt; `t, v3` under clean).
   * Nodes at distance 2: 2 nodes (`v3`, `t` under corrupt; `v3_next, v3_next_next` under clean).
   * Node count transitions: $\Delta |V|_{corrupt} = \Delta |V|_{clean} = 2 \implies \mathbf{d_{|V|} = 0}$.
   * Edge count transitions: $\Delta |E|_{corrupt} = \Delta |E|_{clean} = 3 \implies \mathbf{d_{|E|} = 0}$.
2. **Redundancy Invariance**:
   * The average disjoint path count is isomorphic: $\Delta R = \mathbf{0.00} \le 0.10$.
3. **Community Invariance**:
   * The local clustering coefficients and triangle structure are isomorphic (exactly 1 triangle: `s, v3_next, v3_next_next` under corrupt; `s, t, v3` under clean): $\Delta Com = \mathbf{0.00} \le 0.05$.
4. **Reliability & Capability Invariance**:
   * No node capabilities are corrupted; they remain equal to their true values in the global graph.
   * Both clean and corrupt boundary nodes evaluate to observed reliability 1.00 at all stages, yielding $\Delta \rho = \mathbf{0.00} \le 0.05$ and $d_{caps} = \mathbf{0.00} \le 0.05$.

This proves that **$A_{kernel}$ lies in the intersection of all observational kernels by construction.**

---

## 4. Ex-Ante Proof of Decision Loss

We statically derive the utilities under corruption for Case `DEP-005`:
* **$T_0$ Utility**: Since the structure is isomorphic to clean, $U_{corrupt}(T_0) = U_{clean}(T_0) = -5.58$.
* **$T_1$ Utility**:
  * The recovery edge `v3 -> t` is inactive.
  * In the active edges of $T_1$, there is no path from `v3` to `t`.
  * The high-risk node `v3_next` ($pFail = 0.8$) only connects to `v3` (via `v3_next -> v3`), which has no path to `t`. So `v3_next`'s path to `t` is cut off.
  * Thus, the risk contribution of `v3_next` drops to 0.0.
  * Total risk drops to 0.0, yielding $U_{corrupt}(T_1) = 8.00$.
* **Decision Mismatch**: The optimal action under corruption is $T_1$, whereas the optimal action under clean is $T_0$.
* **Utility Regret**:
  \[
  \boxed{\text{Loss} = U_{corrupt}(T_1) - U_{corrupt}(T_0) = 8.00 - (-5.58) = 13.58 > 0}
  \]
