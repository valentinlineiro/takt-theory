# Batch-016 Fixture Freeze — Observable Subgraph Hierarchy

## 1. Goal

This document locks in the family of observable subgraphs ($O_0 \subseteq O_1 \subseteq O_2 = S$) and the semantics of unobserved node attributes for fixture $F_{016}$. This hierarchy enables the continuous mathematical mapping of the decision regret bound $B(k)$ over the exploration steps.

---

## 2. Observable Snapshot Hierarchy ($O_k$)

We freeze the BFS observable subgraphs from focal root `'s'`:

### 2.1 Depth $k=0$ (Focal Node Only)
* **Observable Nodes ($V_0$)**: `['s']`
* **Observable Edges ($E_0$)**: `[]`
* **Boundary Nodes ($B_0$)**: `['s']`
* **Unobserved/Unknown Nodes**: `['t', 'v3', 'v3_next', 'v3_next_next']`

### 2.2 Depth $k=1$ (Boundary 1)
* **Observable Nodes ($V_1$)**: `['s', 't', 'v3']`
* **Observable Edges ($E_1$)**: `['s->t', 's->v3', 'v3->t']`
* **Boundary Nodes ($B_1$)**: `['t', 'v3']`
* **Unobserved/Unknown Nodes**: `['v3_next', 'v3_next_next']`

### 2.3 Depth $k=2$ (Full State $S$)
* **Observable Nodes ($V_2$)**: `['s', 't', 'v3', 'v3_next', 'v3_next_next']`
* **Observable Edges ($E_2$)**: `['s->t', 's->v3', 'v3->t', 'v3->v3_next', 'v3_next->v3_next_next', 'v3_next_next->t']`
* **Boundary Nodes ($B_2$)**: `[]` (Empty)
* **Unobserved/Unknown Nodes**: `[]` (Empty)

---

## 3. Semantics of Unobserved Node Attributes

To prevent false ceguera/silence, unobserved nodes ($v \notin V_k$) cannot default to $pFail = 0.00$ in the decision model. Instead, unobserved attributes are bounded within their worst-case intervals:
* **$pFail(v)$ worst-case bound**: $pFail(v) \in [0.00, 0.80]$
* **Capabilities ($C(v)$) worst-case bound**: Any capability not yet observed is assumed present if it maximizes risk.

---

## 4. Completeness Invariant

Because $O_{kMax} = S$ at $k = 2$, the representation becomes complete. We freeze the completeness invariant:
\[
\boxed{B(2) = 0}
\]
meaning that at the maximum expansion depth, no decision regret can escape the representation under any admissible adversary.
