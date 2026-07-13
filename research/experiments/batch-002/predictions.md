# Batch-002 Synthetic Benchmark
## Blind Prediction Registry v1.0

Status: Active
Version: 1.0

---

## Experiment Protocol

Objective:

Evaluate whether TAKT predicts Pareto relations between initial systems S and transformed systems T(S).

Prediction target:

T(S) ∈ {
  STRICT_IMPROVEMENT (≻),
  DEGRADATION (≺),
  EQUIVALENCE (≡),
  INCOMPARABLE (∥)
}

Oracle results remain hidden during prediction phase.

---

# Prediction Records

## Record ID: FSA-001

Domain:
Finite State Automata

Available information:

System S:
- States $V = \{v_0, v_1, v_2, v_3, v_4\}$, start state $v_{\text{start}} = v_0$, terminal states $V_{\text{term}} = \{v_3, v_4\}$.
- Transitions $E = \{(v_0, v_1), (v_0, v_2), (v_1, v_3), (v_2, v_4)\}$ with weights $w(v_0, v_1)=4, w(v_0, v_2)=5, w(v_1, v_3)=2, w(v_2, v_4)=3$.
- Goal metric $g(S) = 2$, Environment metric $e(S) = 6$ (minimum path cost to any terminal state).

Transformation T(S):
- Replace transition $(v_0, v_2)$ with cost 2.

---

TAKT Prediction:

Relation:
[x] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
The transformation reduces environment path cost without altering goal reachability.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FSA-002

Domain:
Finite State Automata

Available information:

System S:
- States $V = \{v_0, v_1, v_2, v_3, v_4\}$, start state $v_{\text{start}} = v_0$, terminal states $V_{\text{term}} = \{v_3, v_4\}$.
- Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=10, w(v_0, v_1)=2, w(v_1, v_4)=2$.
- Goal metric $g(S) = 2$, Environment metric $e(S) = 4$.

Transformation T(S):
- Delete $(v_1, v_4)$ and replace $(v_0, v_3)$ with cost 1.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[x] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Goal reachability is reduced (worse) but environment optimal cost is improved (better), presenting a Pareto trade-off.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FSA-003

Domain:
Finite State Automata

Available information:

System S:
- States $V = \{v_0, v_1, v_2, v_3, v_4\}$, start state $v_{\text{start}} = v_0$, terminal states $V_{\text{term}} = \{v_3, v_4\}$.
- Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=2, w(v_0, v_1)=1, w(v_1, v_4)=1$.
- Goal metric $g(S) = 2$, Environment metric $e(S) = 2$.

Transformation T(S):
- Delete $(v_1, v_4)$.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[x] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Reachability to a terminal state is lost while optimal environment cost remains unchanged.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FSA-004

Domain:
Finite State Automata

Available information:

System S:
- States $V = \{v_0, v_1, v_2, v_3, v_4\}$, start state $v_{\text{start}} = v_0$, terminal states $V_{\text{term}} = \{v_3, v_4\}$.
- Transitions $E = \{(v_0, v_3), (v_0, v_1), (v_1, v_4)\}$ with weights $w(v_0, v_3)=5, w(v_0, v_1)=2, w(v_1, v_4)=3$.
- Goal metric $g(S) = 2$, Environment metric $e(S) = 5$.

Transformation T(S):
- Replace $(v_0, v_3)$ with cost 6.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[x] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
The modified transition is not on the optimal path, so neither goal reachability nor optimal path cost is affected.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FLOW-001

Domain:
Flow Networks

Available information:

System S:
- Vertices $V = \{s, v_1, v_2, t\}$, source $s$, sink $t$.
- Edges $E = \{(s, v_1), (s, v_2), (v_1, t), (v_2, t)\}$ with capacities $c(s, v_1)=10, c(s, v_2)=5, c(v_1, t)=5, c(v_2, t)=10$.
- Goal metric $g(S) = 10$ (Max Flow), Environment metric $e(S) = 30$ (Sum of capacities).

Transformation T(S):
- Increase $c(v_1, t)$ to 10 and reduce $c(v_2, t)$ to 5.

---

TAKT Prediction:

Relation:
[x] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Max flow is increased while maintaining the same total environment capacity.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FLOW-002

Domain:
Flow Networks

Available information:

System S:
- Same as FLOW-001. Goal metric $g(S) = 10$, Environment metric $e(S) = 30$.

Transformation T(S):
- Increase $c(v_1, t)$ to 10.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[x] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Max flow is increased at the cost of deploying additional capacity, creating a trade-off.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FLOW-003

Domain:
Flow Networks

Available information:

System S:
- Same as FLOW-001. Goal metric $g(S) = 10$, Environment metric $e(S) = 30$.

Transformation T(S):
- Increase $c(v_2, t)$ to 15.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[x] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Additional capacity is deployed without increasing the max flow.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: FLOW-004

Domain:
Flow Networks

Available information:

System S:
- Same as FLOW-001. Goal metric $g(S) = 10$, Environment metric $e(S) = 30$.

Transformation T(S):
- Reduce $c(s, v_1)$ to 8 and increase $c(v_2, t)$ to 12.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[x] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Total capacity and max flow remain unchanged after redistributing capacity.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: RAG-001

Domain:
Resource Allocation Graphs

Available information:

System S:
- Processes $P = \{p_1, p_2\}$, Resource types $R = \{r_1, r_2\}$.
- Capacities $c(r_1) = 1, c(r_2) = 1$.
- Request edges $E_Q = \{(p_1, r_2), (p_2, r_1)\}$, Allocation edges $E_A = \{(r_1, p_1), (r_2, p_2)\}$.
- Goal metric $g(S) = 0$ (Non-deadlocked processes), Environment metric $e(S) = 6$ (Capacity sum + edges count).

Transformation T(S):
- Cancel $p_2$'s request for $r_1$ and release $p_1$'s allocation of $r_1$.

---

TAKT Prediction:

Relation:
[x] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Deadlock is resolved and resource/edge complexity is reduced.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: RAG-002

Domain:
Resource Allocation Graphs

Available information:

System S:
- Same as RAG-001. Goal metric $g(S) = 0$, Environment metric $e(S) = 6$.

Transformation T(S):
- Replicate resource $r_1$: increase $c(r_1)$ to 2, immediately converting pending request $(p_2, r_1)$ to allocation $(r_1, p_2)$.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[x] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Deadlock is resolved by adding more resource capacity, creating a trade-off.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: RAG-003

Domain:
Resource Allocation Graphs

Available information:

System S:
- Same as RAG-001. Goal metric $g(S) = 0$, Environment metric $e(S) = 6$.

Transformation T(S):
- Add request edge $(p_1, r_1)$.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[x] DEGRADATION (≺)
[ ] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Complexity/edge count is added without improving the deadlock state.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---

## Record ID: RAG-004

Domain:
Resource Allocation Graphs

Available information:

System S:
- Processes $P = \{p_1, p_2\}$, Resource types $R = \{r_1, r_2\}$.
- Capacities $c(r_1) = 1, c(r_2) = 1$.
- Request edges $E_Q = \{(p_1, r_2)\}$, Allocation edges $E_A = \{(r_1, p_1), (r_2, p_2)\}$.
- Goal metric $g(S) = 2$, Environment metric $e(S) = 5$.

Transformation T(S):
- Swap resource names $r_1$ and $r_2$.

---

TAKT Prediction:

Relation:
[ ] STRICT_IMPROVEMENT (≻)
[ ] DEGRADATION (≺)
[x] EQUIVALENCE (≡)
[ ] INCOMPARABLE (∥)

Confidence:
HIGH

Reasoning trace:
Isomorphic swap of resource names has no impact on deadlock status or resource costs.

---

Oracle Result:
LOCKED

---

Evaluation:
Pending

---
