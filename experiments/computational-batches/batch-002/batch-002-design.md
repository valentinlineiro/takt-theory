# Spec: Batch-002 Synthetic Benchmark Design

**Status:** Frozen
**Date:** 2026-07-13
**Version:** 1.0
**Target Domain:** Formal Automata & Flow Networks (Synthetic)

---

## 1. Mathematical Core Definitions

For Batch 002, the context $C = (S, G, E)$ defines a system $S$ under a Goal metric $g(S)$ (to be maximized) and an Environment metric $e(S)$ (to be minimized). The comparison between systems is governed by a strict Pareto preorder.

### 1.1 Pareto Preorder $\succeq_{G,E}$
For any two systems $S_1$ and $S_2$:
* $S_1 \succeq_{G,E} S_2 \iff (g(S_1) \ge g(S_2)) \land (e(S_1) \le e(S_2))$
* $S_1 \succ_{G,E} S_2 \iff (S_1 \succeq_{G,E} S_2) \land (g(S_1) > g(S_2) \lor e(S_1) < e(S_2))$
* $S_1 \parallel_{G,E} S_2 \iff \neg(S_1 \succeq_{G,E} S_2) \land \neg(S_2 \succeq_{G,E} S_1)$
* $S_1 \equiv_{G,E} S_2 \iff (S_1 \succeq_{G,E} S_2) \land (S_2 \succeq_{G,E} S_1) \iff (g(S_1) = g(S_2)) \land (e(S_1) = e(S_2))$

Equality is represented by mutual preorder ($\equiv$), not by incomparability ($\parallel$).

---

## 2. Representation Families

### 2.1 Family 1: Finite State Automata (FSA) with Transition Costs
* **System $S$:** A tuple $(V, E, w, v_{\text{start}}, V_{\text{term}})$ where $V$ is a finite set of states, $E \subseteq V \times V$ is a set of transitions, $w: E \rightarrow \mathbb{R}^+$ is a transition cost function, $v_{\text{start}} \in V$ is the start state, and $V_{\text{term}} \subset V$ is a set of terminal states.
* **Goal $g(S)$:** Number of reachable terminal states.
  $$g(S) = |\{v \in V_{\text{term}} : v \text{ is reachable from } v_{\text{start}}\}|$$
* **Environment $e(S)$:** Cost of the optimal path. Let $P(S)$ be the set of all simple paths from $v_{\text{start}}$ to any terminal state in $V_{\text{term}}$.
  $$e(S) = \begin{cases} \min_{p \in P(S)} \sum_{e \in p} w(e) & \text{if } P(S) \neq \emptyset \\ \infty & \text{otherwise} \end{cases}$$
* **Friction $f$:** A specific transition edge $f = (u, v) \in E$.
* **Transformation $T$:** An operation on transitions such that $f \notin T(S)$.
* **Admissibility Constraints:**
  * $g(S) \ge 1$ before transformation, unless the friction itself explicitly concerns reachability failure.
  * Cases must contain at least one alternative path or transition trade-off.

### 2.2 Family 2: Flow Networks
* **System $S$:** A network tuple $(V, E, c, s, t)$ where $V$ is a set of vertices, $E \subseteq V \times V$ is a set of directed edges, $c: E \rightarrow \mathbb{R}^+$ is the capacity function, $s \in V$ is the source, and $t \in V$ is the sink.
* **Goal $g(S)$:** Max flow value from $s$ to $t$.
  $$g(S) = \text{max\_flow}(S, s, t)$$
* **Environment $e(S)$:** Total deployed capacity required by the network (setup cost).
  $$e(S) = \sum_{e \in E} c(e)$$
* **Friction $f$:** An edge $f \in E$.
* **Transformation $T$:** An operation modifying capacity such that $f \notin T(S)$ or $c(f)$ is changed.

### 2.3 Family 3: Resource Allocation Graphs (RAG)
* **System $S$:** A tuple $(P, R, E_Q, E_A, c)$ where:
  * $P$ is a set of processes.
  * $R$ is a set of resource types.
  * $E_Q \subseteq P \times R$ are request edges.
  * $E_A \subseteq R \times P$ are allocation edges.
  * $c: R \rightarrow \mathbb{N}^+$ is the capacity function (units per resource type).
* **Derived Wait-For Graph $W(S)$:** Bipartite cycles mapping resource dependencies. A directed edge $(p_1, p_2)$ exists in $W(S)$ if process $p_1$ has a request edge $(p_1, r) \in E_Q$ for a resource type $r$ that is currently allocated to process $p_2$ ($(r, p_2) \in E_A$) and all units of $r$ are fully allocated.
* **Goal $g(S)$:** Deadlock avoidance. A process $p \in P$ is blocked if it belongs to a directed cycle in $W(S)$.
  $$g(S) = |\{p \in P : \text{Blocked}(p) = 0\}|$$
* **Environment $e(S)$:** Total capacity of resource units plus request/allocation edges.
  $$e(S) = \sum_{r \in R} c(r) + |E_Q| + |E_A|$$
* **Friction $f$:** An edge in $E_Q \cup E_A$ that is part of a deadlock cycle in $W(S)$.
* **Transformation $T$:** Operations modifying capacities or edges (such that $f \notin T(S)$).
* **Semantic Rule:** Resource replication adds capacity units but preserves existing allocations unless explicitly reassigned.

---

## 3. Case Matrix (12 Cases)

### 3.1 FSA Family
States $V = \{v_0, v_1, v_2, v_3, v_4\}$, start state $v_{\text{start}} = v_0$, terminal states $V_{\text{term}} = \{v_3, v_4\}$.

* **FSA-001 (Dominating Optimization - $\succ$):**
  * **System $S$:** Transitions $E = \{(v_0, v_1), (v_0, v_2), (v_1, v_3), (v_2, v_4)\}$ with weights $w(v_0, v_1)=4, w(v_0, v_2)=5, w(v_1, v_3)=2, w(v_2, v_4)=3$. ($g=2, e=6$).
  * **Friction $f$:** Suboptimal transition edge $(v_0, v_2)$ (cost 5).
  * **Transformation $T$:** Replace $(v_0, v_2)$ with cost 2.
  * **Outcome:** $g(T(S)) = 2$, $e(T(S)) = 5$.
  * **Oracle Relation:** $T(S) \succ S$.

* **FSA-002 (Incomparable Trade-off - $\parallel$):**
  * **System $S$:** Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=10, w(v_0, v_1)=2, w(v_1, v_4)=2$. ($g=2, e=4$).
  * **Friction $f$:** Edge $(v_1, v_4)$ (cost 2).
  * **Transformation $T$:** Delete $(v_1, v_4)$ and replace $(v_0, v_3)$ with cost 1.
  * **Outcome:** $g(T(S)) = 1$ (only $v_3$ reachable), $e(T(S)) = 1$.
  * **Oracle Relation:** $T(S) \parallel S$.

* **FSA-003 (Strict Degradation - $\prec$):**
  * **System $S$:** Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=2, w(v_0, v_1)=1, w(v_1, v_4)=1$. ($g=2, e=2$).
  * **Friction $f$:** Transition edge $(v_1, v_4)$.
  * **Transformation $T$:** Delete $(v_1, v_4)$.
  * **Outcome:** $g(T(S)) = 1$, $e(T(S)) = 2$.
  * **Oracle Relation:** $T(S) \prec S$.

* **FSA-004 (Equivalence - $\equiv$):**
  * **System $S$:** Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=5, w(v_0, v_1)=2, w(v_1, v_4)=3$. ($g=2, e=5$).
  * **Friction $f$:** Edge $(v_0, v_3)$ (cost 5).
  * **Transformation $T$:** Replace $(v_0, v_3)$ with cost 6.
  * **Outcome:** $g(T(S)) = 2$, $e(T(S)) = 5$.
  * **Oracle Relation:** $T(S) \equiv S$.

---

### 3.2 Flow Networks Family
Vertices $V = \{s, v_1, v_2, t\}$, source $s$, sink $t$.

* **FLOW-001 (Dominating Optimization - $\succ$):**
  * **System $S$:** Edges $E = \{(s, v_1), (s, v_2), (v_1, t), (v_2, t)\}$ with capacities $c(s, v_1)=10, c(s, v_2)=5, c(v_1, t)=5, c(v_2, t)=10$. ($g=10, e=30$).
  * **Friction $f$:** Bottleneck edge $(v_1, t)$ of capacity 5.
  * **Transformation $T$:** Increase $c(v_1, t)$ to 10 and reduce $c(v_2, t)$ to 5.
  * **Outcome:** $g(T(S)) = 15$, $e(T(S)) = 30$. (The max-flow values are computed by independent parallel paths; no residual augmentation changes the value.)
  * **Oracle Relation:** $T(S) \succ S$.

* **FLOW-002 (Incomparable Trade-off - $\parallel$):**
  * **System $S$:** Same as FLOW-001. ($g=10, e=30$).
  * **Friction $f$:** Bottleneck edge $(v_1, t)$ of capacity 5.
  * **Transformation $T$:** Increase $c(v_1, t)$ to 10.
  * **Outcome:** $g(T(S)) = 15$, $e(T(S)) = 35$.
  * **Oracle Relation:** $T(S) \parallel S$.

* **FLOW-003 (Strict Degradation - $\prec$):**
  * **System $S$:** Same as FLOW-001. ($g=10, e=30$).
  * **Friction $f$:** Redundant capacity on edge $(v_2, t)$.
  * **Transformation $T$:** Increase $c(v_2, t)$ to 15.
  * **Outcome:** $g(T(S)) = 10$, $e(T(S)) = 35$.
  * **Oracle Relation:** $T(S) \prec S$.

* **FLOW-004 (Equivalence - $\equiv$):**
  * **System $S$:** Same as FLOW-001. ($g=10, e=30$).
  * **Friction $f$:** Redundant capacity on $(s, v_1)$.
  * **Transformation $T$:** Reduce $c(s, v_1)$ to 8 and increase $c(v_2, t)$ to 12.
  * **Outcome:** $g(T(S)) = 10$, $e(T(S)) = 30$. (The max-flow values are computed by independent parallel paths; no residual augmentation changes the value.)
  * **Oracle Relation:** $T(S) \equiv S$.

---

### 3.3 Resource Allocation Graphs (RAG) Family
Processes $P = \{p_1, p_2\}$, Resource types $R = \{r_1, r_2\}$.

* **RAG-001 (Dominating Optimization - $\succ$):**
  * **System $S$:** Capacities $c(r_1) = 1, c(r_2) = 1$. $E_Q = \{(p_1, r_2), (p_2, r_1)\}, E_A = \{(r_1, p_1), (r_2, p_2)\}$. ($g=0, e=6$).
  * **Friction $f$:** The deadlock cycle.
  * **Transformation $T$:** Cancel $p_2$'s request for $r_1$ and release $p_1$'s allocation of $r_1$.
  * **Outcome:** $E_Q = \{(p_1, r_2)\}$, $E_A = \{(r_2, p_2)\}$. ($g=2, e=4$).
  * **Oracle Relation:** $T(S) \succ S$.

* **RAG-002 (Incomparable Trade-off - $\parallel$):**
  * **System $S$:** Same as RAG-001. ($g=0, e=6$).
  * **Friction $f$:** The deadlock cycle.
  * **Transformation $T$:** Replicate resource $r_1$: increase $c(r_1)$ to 2, immediately converting pending request $(p_2, r_1)$ to allocation $(r_1, p_2)$.
  * **Outcome:** $E_Q = \{(p_1, r_2)\}, E_A = \{(r_1, p_1), (r_1, p_2), (r_2, p_2)\}$. ($g=2, e=7$).
  * **Oracle Relation:** $T(S) \parallel S$.

* **RAG-003 (Strict Degradation - $\prec$):**
  * **System $S$:** Same as RAG-001. ($g=0, e=6$).
  * **Friction $f$:** Request edge $(p_2, r_1)$.
  * **Transformation $T$:** Add request edge $(p_1, r_1)$.
  * **Outcome:** $g(T(S)) = 0$, $e(T(S)) = 7$.
  * **Oracle Relation:** $T(S) \prec S$.

* **RAG-004 (Equivalence - $\equiv$):**
  * **System $S$:** Capacities $c(r_1) = 1, c(r_2) = 1$. $E_Q = \{(p_1, r_2)\}, E_A = \{(r_1, p_1), (r_2, p_2)\}$. ($g=2, e=5$).
  * **Friction $f$:** Allocation edge $(r_1, p_1)$.
  * **Transformation $T$:** Swap resource names $r_1$ and $r_2$.
  * **Outcome:** $E_Q = \{(p_1, r_1)\}, E_A = \{(r_2, p_1), (r_1, p_2)\}$. ($g=2, e=5$).
  * **Oracle Relation:** $T(S) \equiv S$.
