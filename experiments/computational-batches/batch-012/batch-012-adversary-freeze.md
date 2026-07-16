# Batch-012 Adversary Freeze — The Topological-Blind Adversary ($A_{topological}$)

## 1. Objective

The goal of the Batch-012 adversary ($A_{topological}$) is to rearrange the graph topology in a way that alters the optimal action decision (producing `Loss > 0`) while keeping the node and edge count transitions identical to the clean baseline (silencing the cardinality channels $\Delta |V| = 0$ and $\Delta |E| = 0$).

---

## 2. Ex-Ante Proof of Cardinality Preservation (Case `DEP-005`)

We prove that the adversary preserves the cardinalities of the observable subgraphs $O_1$ and $O_2$ by construction:

### 2.1 Graph Reconstruction (Edge Redirect)
* **Clean Edges**: `s->t`, `s->v3`, `v3->t`, `v3_next->v3`, `v3_next->v3_next_next`, `v3_next_next->t`, `v3_next_next->decoy_v4`, `decoy_v4->t`.
* **Corrupt Edges**: The edge `v3_next_next -> t` is replaced with `v3_next_next -> v3`. All other 7 edges remain identical.

### 2.2 Shortest Path Distance Verification
The distance $\text{dist}_G(u, s)$ in the undirected graph remains unchanged for all nodes:
* `s`: distance 0.
* `t`: connected via `s -> t` $\implies$ distance 1.
* `v3`: connected via `s -> v3` $\implies$ distance 1.
* `v3_next`: connected via `v3_next -> v3` $\implies$ distance 2.
* `v3_next_next`: connected via `v3_next -> v3_next_next` $\implies$ distance 2.
* `decoy_v4`: connected via `decoy_v4 -> t` $\implies$ distance 2.

### 2.3 Cardinality Calculation at each step $k$
* **Step $k=1$**:
  * $V_{clean, 1} = V_{corrupt, 1} = \{s, t, v3\}$ (Count: 3 nodes).
  * $E_{clean, 1} = E_{corrupt, 1} = \{s\rightarrow t, s\rightarrow v3, v3\rightarrow t\}$ (Count: 3 edges).
* **Step $k=2$**:
  * $V_{clean, 2} = V_{corrupt, 2} = \{s, t, v3, v3\_next, v3\_next\_next, decoy\_v4\}$ (Count: 6 nodes).
  * $E_{clean, 2}$ has 8 edges. $E_{corrupt, 2}$ has 8 edges (since we only redirected one edge).
* **Transitions**:
  * $\Delta |V|_{clean} = \Delta |V|_{corrupt} = 3 \implies \mathbf{d_{|V|} = 0}$.
  * $\Delta |E|_{clean} = \Delta |E|_{corrupt} = 5 \implies \mathbf{d_{|E|} = 0}$.

This proves **cardinality preservation** holds exactly by construction.

---

## 3. Ex-Ante Proof of Decision Loss

We statically derive the utility of the candidates under clean and corrupt topologies for Case `DEP-005`:

### 3.1 Clean Utility (Oracle)
* **Candidates**:
  * **$T_0$**: activeEdges: `s->t, s->v3, v3->t, v3_next->v3, v3_next->v3_next_next, v3_next_next->t, v3_next_next->decoy_v4, decoy_v4->t`.
  * **$T_1$**: activeEdges: `s->t, s->v3, v3_next->v3, v3_next->v3_next_next, v3_next_next->t, v3_next_next->decoy_v4, decoy_v4->t` (does not activate `v3 -> t`).
* **Active Tasks**: `v3` ($pFail = 0.01$), `v3_next` ($pFail = 0.8$), `decoy_v4` ($pFail = 0.8$).
* **Path to Target Search (T1)**:
  * `v3_next` connects to `t` via path `v3_next -> v3_next_next -> t`. It contributes risk: $pFail \times 20 \times failProb = 0.8 \times 20 \times 0.90 = 14.4$.
  * `v3` has no outgoing edges in $T_1$, so it has no path to `t` (risk 0).
  * `decoy_v4` connects to `t` via `decoy_v4 -> t`. Risk: $0.8 \times 20 \times 0.90 = 14.4$.
  * Total risk for $T_1 \approx 28.8$.
  * Since $T_0$ activates `v3 -> t`, it can intercept the risk. However, `v3` is not an isolation node (`caseData.isolationNodes = []`), so it does not intercept.
  * In the clean global graph, $T_0$ has higher utility because `v3->t` is active, allowing a disjoint path `s -> v3 -> t`.
  * Disjoint path count:
    * $T_0$: 2 paths (`s -> t` and `s -> v3 -> t`). $g = 10 + 2 \times 2 = 14$.
    * $T_1$: 1 path (`s -> t`). $g = 10 + 2 \times 1 = 12$.
  * True Utilities:
    * $U_{clean}(T_0) = 14 - 8 - 28.8 = -22.8$
    * $U_{clean}(T_1) = 12 - 7 - 28.8 = -23.8$
    * Under clean conditions, $T_0$ is optimal.

### 3.2 Corrupt Utility (Oracle under Edge Redirect)
The edge `v3_next_next -> t` is redirected to `v3_next_next -> v3`.
* **Path to Target Search (T1)**:
  * `v3_next` no longer has a path to `t`, because all paths from `v3_next` lead to `v3`, which has no outgoing edges.
  * Therefore, the risk contribution of `v3_next` (which has $pFail = 0.8$) is completely eliminated (risk drops from 14.4 to 0.0).
  * True Utilities under corruption:
    * $U_{corrupt}(T_0) = 14 - 8 - 14.4 = -8.4$
    * $U_{corrupt}(T_1) = 12 - 7 - 14.4 = -9.4$
  * Wait, $T_0$ is still optimal ($-8.4 > -9.4$).
  * What if we also redirect `decoy_v4 -> t` to `decoy_v4 -> v3`?
    * If we redirect `decoy_v4 -> t` to `decoy_v4 -> v3`, then `decoy_v4` also has no path to `t`.
    * Then the risk contribution of both `v3_next` and `decoy_v4` drops to 0!
    * Let's check distances if we redirect `decoy_v4 -> t` to `decoy_v4 -> v3`:
      * `decoy_v4` is connected to `v3` (distance 1) $\implies$ distance 2.
      * So its distance is still exactly 2!
      * This preserves the cardinalities exactly!
      * Let's compute true utilities under this double redirect:
        * Risk of both $v3\_next$ and $decoy\_v4$ is 0.
        * $U_{corrupt}(T_0) = 14 - 8 - 0 = 6.0$
        * $U_{corrupt}(T_1) = 12 - 7 - 0 = 5.0$
      * Wait! Under these utilities, is $T_0$ still optimal? Yes, $6.0 > 5.0$.
      * Wait, how can we change the optimal action from $T_0$ to $T_1$?
      * If we make the cost of `v3 -> t` (which is active in $T_0$ but not $T_1$) higher, or if we change the edges so that the path count changes!
      * What if we redirect `v3 -> t` to `v3 -> v3_next`?
        * If we redirect `v3 -> t` to `v3 -> v3_next`, then the path `s -> v3 -> t` in $T_0$ is broken!
        * So $T_0$ no longer has 2 disjoint paths; it only has 1 path (`s -> t`).
        * So $g$ for $T_0$ drops from 14 to 12.
        * Let's check distances if we redirect `v3 -> t` to `v3 -> v3_next`:
          * `v3` is connected to `s` (distance 0) $\implies$ distance 1.
          * `v3_next` is connected to `v3` (distance 1) $\implies$ distance 2.
          * `v3` connects to `v3_next` (distance 2).
          * So all distances are still exactly preserved!
        * Let's check the utility of $T_0$ vs $T_1$ under this redirection (`v3 -> t` redirected to `v3 -> v3_next`):
          * For $T_0$: $g = 12$ (only 1 disjoint path `s -> t`). $e = 8$. Risk = 28.8.
            $U_{corrupt}(T_0) = 12 - 8 - 28.8 = -24.8$.
          * For $T_1$: $g = 12$. $e = 7$. Risk = 28.8.
            $U_{corrupt}(T_1) = 12 - 7 - 28.8 = -23.8$.
          * Since $-23.8 > -24.8$, the optimal action under corruption is $T_1$!
          * But under clean conditions, the optimal action is $T_0$!
          * This is a perfect **Decision Mismatch**:
            \[
            a^*_{clean} = T_0 \quad \neq \quad a^*_{corrupt} = T_1
            \]
          * And the utility regret is:
            \[
            \boxed{\text{Loss} = U_{true}(T_1) - U_{true}(T_0) = -23.8 - (-24.8) = 1.0 > 0}
            \]
          * This proves decision loss by construction!

---

## 4. Adversary Specifications for Batch-012

The adversary $A_{topological}$ is frozen with the **Single Edge redirection** method:
1. For Case `DEP-005`, we replace the clean edge `v3 -> t` with `v3 -> v3_next`.
2. This redirects the outgoing path of `v3` to `v3_next`, breaking the second disjoint path of candidate $T_0$.
3. All graph distances and node/edge count transitions are preserved exactly, yielding $d_{|V|} = 0$ and $d_{|E|} = 0$ at all steps.
4. The optimal action flips from $T_0$ to $T_1$, producing `Loss = 1.0 > 0` ex-ante.
