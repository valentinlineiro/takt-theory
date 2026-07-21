# Convergence Impossibility Theorem

> Las representaciones locales y acotadas no pueden detectar convergencia
> cuando esta depende de información externa al estado observable.

---

## 1. Statement

Let:

- $\mathcal{M} = (\mathcal{S}, \mathcal{A}, U, D)$ be a Decision System as
  defined in `takt-specification-v3.md`, with $\mathcal{S}$ the set of
  **observable** states and $D: \mathcal{S} \to \mathcal{A}$ the decision
  operator.
- $W$ be an **external world state** not observable by $D$: the true
  objective against which convergence is judged.
- $\text{Terminal} \subseteq \mathcal{S} \times W$ be a predicate that
  determines when the process must stop.
- $D^*: \mathcal{S} \times W \to \mathcal{A}$ be the **ideal decision
  operator** that depends on both observable state and world state,
  where $D^*(s, w) = \text{stop} \iff \text{Terminal}(s, w)$ and
  $D^*(s, w) = \text{continue}$ otherwise.
- $\mathcal{F}$ be the family of **local and bounded** representations
  $R: \mathcal{S} \to \mathcal{Z}$ (functions of the observable state
  only, with bounded codomain).

**Convergence Impossibility Theorem.** If there exist two world states
$w_1, w_2 \in W$ such that:

1. $\text{Terminal}(s, w_1) \neq \text{Terminal}(s, w_2)$ for some
   observable state $s \in \mathcal{S}$ (they require different
   convergence decisions), and
2. $w_1$ and $w_2$ produce the same observable trajectory history
   $\tau_{:t}$ (they are indistinguishable under $\mathcal{S}$),

then for every $R \in \mathcal{F}$:

$$
\ker(R) \not\subseteq \ker(D^*)
$$

That is, no local and bounded representation can preserve the convergence
decision.

---

## 2. Proof

**Construction.** Fix $s \in \mathcal{S}$ and $w_1, w_2 \in W$ satisfying
the hypothesis. Construct two trajectories $T_1$ and $T_2$ that:

- Start from $s_0 = s$ with empty trajectory $\tau_{:0}$.
- Execute the same sequence of actions $a_1, \dots, a_n$.
- Arrive at the same observable state $s_n$ with the same trajectory
  $\tau_{:n}$.
- Differ only in the world state: $w_1$ for $T_1$, $w_2$ for $T_2$.

This construction is always possible because the hypothesis guarantees
$w_1$ and $w_2$ produce identical observable behaviour — they are
distinguished only by $\text{Terminal}$, not by any observable.

**Indistinguishability under $R$.** Since each $R \in \mathcal{F}$ is a
function $R: \mathcal{S} \to \mathcal{Z}$, and $s_n(T_1) = s_n(T_2)$
(identical observable state by construction), we have:

$$
R(T_1) = R(T_2)
$$

**Distinguishability under $D^*$.** Since $\text{Terminal}(s_n, w_1)
\neq \text{Terminal}(s_n, w_2)$:

$$
D^*(s_n, w_1) \neq D^*(s_n, w_2)
$$

**Conclusion.** The pair $(T_1, T_2)$ lies in $\ker(R)$ but not in
$\ker(D^*)$. Therefore $\ker(R) \not\subseteq \ker(D^*)$ for all
$R \in \mathcal{F}$.

∎

---

## 3. Remarks

### 3.1 Nature of the impossibility

This is a **structural** impossibility, not a practical one. It does not
say "no representation has been found." It says: under the constraints of
locality (function of $\mathcal{S}$ only) and boundedness, **no possible
representation can succeed**. The proof is universal: it does not depend
on any specific candidate.

### 3.2 Role of boundedness

The boundedness condition ensures $R$ cannot approximate $D^*$ by
enumerating all possible trajectory histories. Even with unbounded
memory, $R$ would still fail because $\mathcal{S}$ contains no
information about $W$ — but boundedness makes the result tighter:
failure occurs even before memory limits become relevant.

### 3.3 Relation to the core theory

The core theory (Theorem 4, Equivalence Preservation) states that
refinement can repair broken preservation by adding distinctions within
fibres. The Convergence Impossibility Theorem identifies a case where
**refinement cannot repair the failure** because the missing information
($W$) is not in the domain of $R$ at all. Fibre refinement operates
within $\mathcal{S}$; it cannot add access to $W$ without violating
locality.

This is not a contradiction of the core theory. The core assumes the
property $\Phi$ is a function of the same domain as the morphism $C$.
When $\Phi$ depends on information outside that domain, the core's
refinement procedure cannot help — the problem is in the choice of
domain, not in the morphism.

### 3.4 Relation to G3

The proof follows the same **non-injectivity pattern** as the G3
Impossibility Theorem (`session/g3-impossibility-theorem.md`):
construct two objects indistinguishable under a contraction but
distinguishable under the property. Here:
- The contraction is $R: \mathcal{S} \to \mathcal{Z}$ (local and bounded).
- The property is $\text{Terminal} \subseteq \mathcal{S} \times W$.
- The indistinguishable pair is $(s_n, w_1)$ vs $(s_n, w_2)$.

### 3.5 What the theorem does not claim

1. **It does not claim convergence is undetectable in general.**
   A representation with access to $W$ (non-local) can detect it.
2. **It does not claim all properties of $W$ are undetectable.**
   Only those that are independent of $\mathcal{S}$ by construction.
3. **It does not claim the Decision System framework is incomplete.**
   It identifies a precise boundary: the Safety Condition
   $\ker(R) \subseteq \ker(D)$ applies to decisions the system can
   observe; it cannot guarantee decisions that depend on unobserved
   external states.

---

## 4. Evidence

The theorem was demonstrated constructively by ST-008 (`Convergence Gap`,
`experiments/stress-tests/ST-008/`). The stress test builds an explicit
pair of trajectories $T_1$/$T_2$ satisfying the hypothesis and verifies
$\ker(R) \not\subseteq \ker(D)$ for all $R \in \mathcal{F}$.

---

## 5. Consequences

1. **For systems with local representations.** If a system's
   representation is restricted to local and bounded observables,
   convergence to an external goal cannot be guaranteed by the Safety
   Condition alone. A separate mechanism (external signal, human
   oversight, or access to $W$) is required.

2. **For the theory of refinement.** The Convergence Impossibility
   Theorem provides the first example of a property that is **not
   refinable** under the locality constraint. This complements the
   core theory's positive results (refinement can repair preservation
   within fibres) with a precise negative result.

3. **For experimental methodology.** The theorem validates the
   distinction between Application Representation Gap (solvable by
   adding information within $\mathcal{S}$) and Structural
   Representation Gap (not solvable without changing the domain).
