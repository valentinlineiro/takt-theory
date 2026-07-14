# Topological Boundary Disjointness Theorem

## 1. Theorem Statement

For any undirected graph $G = (V, E)$ and focal element $v_0 \in V$, let the observable subgraph $O_k = (V_k, E_k)$ be defined by a BFS of depth $k$ centered at $v_0$. The boundary of $O_k$, denoted by $B_k$, is the set of observed nodes that have at least one unobserved neighbor in $G$:
\[
B_k = \{ v \in V_k : \exists w \in V \setminus V_k \text{ s.t. } \{v, w\} \in E \}
\]

**Theorem**: For any consecutive steps $k$ and $k+1$, the boundary sets $B_k$ and $B_{k+1}$ are strictly disjoint:
\[
\boxed{B_k \cap B_{k+1} = \emptyset}
\]

---

## 2. Mathematical Proof

### Lemma 1 (BFS Depth Boundary Equivalence)
A node $v \in V_k$ belongs to $B_k$ if and only if its shortest path distance from $v_0$ in $G$ is exactly $k$:
\[
v \in B_k \iff \text{dist}_G(v, v_0) = k
\]

#### Proof of Lemma 1:
1. **Direction $\implies$**: Let $v \in B_k$. 
   * By definition of $B_k$, there exists $w \in V \setminus V_k$ such that $\{v, w\} \in E$.
   * Since $w \notin V_k$, its distance must satisfy $\text{dist}_G(w, v_0) \geq k + 1$.
   * By the triangle inequality, $\text{dist}_G(w, v_0) \leq \text{dist}_G(v, v_0) + \text{dist}_G(v, w) = \text{dist}_G(v, v_0) + 1$.
   * Therefore, $k + 1 \leq \text{dist}_G(v, v_0) + 1 \implies \text{dist}_G(v, v_0) \geq k$.
   * Since $v \in V_k$, we also have $\text{dist}_G(v, v_0) \leq k$.
   * Thus, $\text{dist}_G(v, v_0) = k$.

2. **Direction $\impliedby$**: Let $\text{dist}_G(v, v_0) = k$.
   * We must show there exists $w \in V \setminus V_k$ connected to $v$.
   * In a BFS, if a node is at distance $k$, it must have at least one neighbor at distance $k+1$ (otherwise, the BFS would terminate at depth $k$, and the graph component would be fully observed, meaning there would be no unobserved nodes and the boundary $B_k$ would be empty by definition).
   * For any unobserved node $w$ at distance $k+1$, $w \notin V_k$.
   * Thus, $v \in B_k$.

### Proof of the Theorem:
1. From Lemma 1, we have:
   * $v \in B_k \iff \text{dist}_G(v, v_0) = k$
   * $v \in B_{k+1} \iff \text{dist}_G(v, v_0) = k+1$
2. Since the shortest path distance $\text{dist}_G(v, v_0)$ is unique for any node $v$, a node cannot simultaneously have distance $k$ and distance $k+1$.
3. Therefore:
   \[
   B_k \cap B_{k+1} = \emptyset
   \]
   $\text{Q.E.D.}$

---

## 3. Physical Implication for $A_{temporalFN}$

This theorem has a critical consequence for any capability-based adversary:
1. **Decision Mismatch**: To change the stopping decision from Probe to Stop at $k=1$, the adversary must corrupt a boundary node $v \in B_1$ to suppress DRU.
2. **Reliability Mismatch**: Under corruption, the observed capability of $v$ differs from the true capability, resulting in a low reliability index: $\rho_1(v) = 0.80$.
3. **Boundary Transition**: At step $k=2$, the boundary is $B_2$. By the Disjointness Theorem, $v \notin B_2$ (it has transitioned to the interior).
4. **Reliability Reset**: Since $v \notin B_2$, it is no longer evaluated in the boundary reliability vector $\rho_2$, so it is assumed to have reliability $\rho_2(v) = 1.00$.
5. **Inevitability of the Delta**: The L2 norm of the reliability vector transition delta must include the delta for $v$:
   \[
   d_\rho \geq |\rho_2(v) - \rho_1(v)| = 1.00 - 0.80 = 0.20
   \]
   Since $0.20 > 0.05$, **the reliability delta cannot be silenced**.

---

## 4. Conclusion

Under the currently defined representation model, **the transitional reliability signal $\Delta\rho$ is mathematically guaranteed to detect all capability-based decision-corrupting adversaries**. A temporal-blind capability adversary ($d_\rho \le 0.05 \land \text{Loss} > 0$) is a topological impossibility.
