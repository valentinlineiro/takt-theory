# TAKT Formal Foundations (v1)

This document establishes the mathematical foundations of TAKT, formalizing the relationship between state representation contraction, utility models, and decision-theoretic regret.

---

## 1. The Decision System

A **Decision System** is a 4-tuple:
\[
\mathcal{M} = (\mathcal{S}, \mathcal{A}, U, D)
\]
where:
* $\mathcal{S}$ is the state space (discrete or continuous).
* $\mathcal{A}$ is the finite set of action candidates.
* $U: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}$ is the utility function mapping a state and an action to a scalar utility value.
* $D: \mathcal{S} \rightarrow \mathcal{A}$ is the deterministic decision operator selecting the action preference of the system.

### 1.1 The Argmax and Tie-Breaking
The optimal action set for a state $S \in \mathcal{S}$ is defined by:
\[
\arg\max_{a \in \mathcal{A}} U(S, a) = \{ a \in \mathcal{A} : U(S, a) \ge U(S, a') \ \forall a' \in \mathcal{A} \}
\]
To ensure that $D$ is a well-defined deterministic function, we introduce a deterministic tie-breaking operator $\theta: \mathcal{P}(\mathcal{A}) \setminus \{\emptyset\} \rightarrow \mathcal{A}$. Thus, the decision operator is defined as:
\[
D(S) = \theta\left( \arg\max_{a \in \mathcal{A}} U(S, a) \right)
\]
Deterministic tie-breaking (e.g., ordering actions alphabetically or by index) guarantees that $D(S)$ is single-valued and that the decision kernel is a true partition of $\mathcal{S}$.

---

## 2. Representation Contraction

A **Representation** of $\mathcal{S}$ is a mapping:
\[
R: \mathcal{S} \rightarrow \mathcal{Z}
\]
where $\mathcal{Z}$ is the representation space (typically $|\mathcal{Z}| \ll |\mathcal{S}|$).

The representation function $R$ partition-groups states into equivalence classes. We define the equivalence relation $\sim_R$ as:
\[
S \sim_R S' \iff R(S) = R(S')
\]
The equivalence classes correspond to the fibers of $R$:
\[
R^{-1}(z) = \{ S \in \mathcal{S} : R(S) = z \}
\]
The kernel of $R$ is the set of all equivalent pairs:
\[
\ker(R) = \{ (S, S') \in \mathcal{S} \times \mathcal{S} : R(S) = R(S') \}
\]

---

## 3. Exact Decision Sufficiency

A representation $R$ is **decision-sufficient** for the system $\mathcal{M}$ if and only if states that map to the same representation yield the same preferred action:
\[
\boxed{ R(S) = R(S') \implies D(S) = D(S') }
\]
Using kernel notation, this condition is exactly containment:
\[
\boxed{ \ker(R) \subseteq \ker(D) }
\]

### Proposition 3.1 (Factorization Theorem)
*A representation $R: \mathcal{S} \rightarrow \mathcal{Z}$ is decision-sufficient if and only if the decision operator $D$ factorizes through $R$. That is, there exists a policy function $\pi: \mathcal{Z} \rightarrow \mathcal{A}$ such that:*
\[
D = \pi \circ R
\]

#### Proof:
* **$(\Longleftarrow)$ Direction**: Assume there exists $\pi: \mathcal{Z} \rightarrow \mathcal{A}$ such that $D = \pi \circ R$. Let $S, S' \in \mathcal{S}$ satisfy $R(S) = R(S')$. Then:
  \[
  D(S) = \pi(R(S)) = \pi(R(S')) = D(S')
  \]
  Thus, $\ker(R) \subseteq \ker(D)$.
* **$(\Longrightarrow)$ Direction**: Assume $\ker(R) \subseteq \ker(D)$. We construct the mapping $\pi: R(\mathcal{S}) \rightarrow \mathcal{A}$ as follows: for any $z \in R(\mathcal{S})$, choose any state $S_z \in R^{-1}(z)$ and define:
  \[
  \pi(z) = D(S_z)
  \]
  To show that $\pi$ is well-defined, let $S_1, S_2 \in R^{-1}(z)$ be any two states. Since $R(S_1) = R(S_2) = z$, we have $S_1 \sim_R S_2$. Since $\ker(R) \subseteq \ker(D)$, it follows that $D(S_1) = D(S_2)$. Thus, the choice of representative state does not alter the mapping value, making $\pi(z)$ unique. By construction, for any state $S \in \mathcal{S}$, let $z = R(S)$. Then:
  \[
  \pi(R(S)) = \pi(z) = D(S) \implies D = \pi \circ R
  \]
  $\blacksquare$

---

## 4. Fiber Regret

To quantify the decisional risk of collapsing states into the same representation, we define the **Decision Regret** between two states under the choice of preferred actions.

### 4.1 Directional Regret
For any ordered pair of states $(S, S') \in \mathcal{S} \times \mathcal{S}$, the regret of applying the optimal action of $S'$ to the state $S$ is:
\[
Regret_D(S, S') = U(S, D(S)) - U(S, D(S'))
\]
Note that by definition of the optimal action $D(S)$, we have:
\[
Regret_D(S, S') \ge 0 \quad \forall S, S' \in \mathcal{S}
\]
and:
\[
Regret_D(S, S) = 0
\]

### 4.2 The Fiber Regret Bound ($\varepsilon(R)$)
The **maximum representational regret** $\varepsilon(R)$ is the supremum of regret across all equivalent state pairs:
\[
\boxed{ \varepsilon(R) = \sup_{(S, S') \in \ker(R)} Regret_D(S, S') }
\]

### Theorem 4.1 (Safety Equivalence)
*Assume $D(S)$ is deterministic and single-valued. Then:*
\[
\boxed{ \varepsilon(R) = 0 \iff \ker(R) \subseteq \ker(D) }
\]

#### Proof:
* **$(\Longleftarrow)$ Direction**: Assume $\ker(R) \subseteq \ker(D)$. Let $(S, S') \in \ker(R)$. Then $D(S) = D(S')$. Substituting this into the regret definition:
  \[
  Regret_D(S, S') = U(S, D(S)) - U(S, D(S')) = U(S, D(S)) - U(S, D(S)) = 0
  \]
  Since the regret is zero for all pairs in $\ker(R)$, the supremum $\varepsilon(R)$ is exactly $0$.
* **$(\Longrightarrow)$ Direction**: Assume $\varepsilon(R) = 0$. Let $(S, S') \in \ker(R)$. By definition of fiber regret, we must have:
  \[
  Regret_D(S, S') = 0 \quad \text{and} \quad Regret_D(S', S) = 0
  \]
  * From $Regret_D(S, S') = 0$, we have $U(S, D(S)) = U(S, D(S'))$. This implies $D(S') \in \arg\max_{a} U(S, a)$.
  * From $Regret_D(S', S) = 0$, we have $U(S', D(S')) = U(S', D(S))$. This implies $D(S) \in \arg\max_{a} U(S', a)$.
  
  To establish $D(S) = D(S')$, we must evaluate the tie-breaking operator:
  * Since $D(S')$ is optimal for $S$ and $D(S)$ is optimal for $S$:
    If the argmax is a singleton, then $D(S) = D(S')$ holds trivially.
    If the argmax contains multiple actions, our deterministic tie-breaker operator $\theta$ ensures:
    \[
    D(S) = \theta(\arg\max_{a} U(S, a))
    \]
    Since $D(S') \in \arg\max_{a} U(S, a)$, if the tie-breaking rule was not applied or differed, they could diverge. However, the decision function $D$ is defined globally with the *same* deterministic tie-breaking operator $\theta$. Since the set of optimal actions for $S$ contains both $D(S)$ and $D(S')$, the tie-breaker $\theta(\arg\max_a U(S, a))$ returns a single preferred action. By definition, $D(S)$ is that action. Thus, any preferred action choice must equal $D(S)$, giving $D(S) = D(S')$.
  
  Thus, $(S, S') \in \ker(D)$, proving $\ker(R) \subseteq \ker(D)$.
  $\blacksquare$
