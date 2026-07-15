# Batch-017 Fixture Freeze — Symmetry Transformation Space

## 1. Goal

This document locks in the experimental domain ($\mathcal{S}_{017}$), the group of node permutations ($\Pi_{017}$), and the mathematical definitions of the symmetry mismatch set $M$ to evaluate representational equivalence-class repair.

---

## 2. Experimental Domain and Parameters

We freeze the experimental parameters to match Batch-016:
* **Base Graph ($S_{clean}$)**: The canonical 5-node Case `DEP-005`.
* **Nodes ($V$)**: `['s', 't', 'v3', 'v3_next', 'v3_next_next']`
* **Node Permutation Group ($\Pi_{017}$)**: All $5! = 120$ possible bijective mappings $\pi: V \rightarrow V$ in the symmetric group $Sym(V)$.

---

## 3. Symmetry Mismatch Set ($M$)

For any permutation $\pi \in \Pi_{017}$, we define the representation deviation $\Delta_\Omega(\pi)$ and the decision deviation $\Delta_D(\pi)$ on the clean base graph $S_{clean}$ under representation $\Omega_1 = \Omega \oplus X_2$:

1. **Representation Silence**:
   \[
   \Delta_\Omega(\pi) = 0 \iff \Omega_1(\pi S_{clean}) = \Omega_1(S_{clean})
   \]
2. **Decision Mismatch**:
   \[
   \Delta_D(\pi) = 1 \iff a^*(\pi S_{clean}) \neq a^*(S_{clean})
   \]

The observed **Symmetry Mismatch Set** ($M$) is frozen as:
\[
\boxed{
M = \left\{ \pi \in \Pi_{017} : \Delta_\Omega(\pi) = 0 \ \land \ \Delta_D(\pi) = 1 \right}
}
\]

---

## 4. Candidate Refinement Evaluation

For each candidate refinement $X_i$, the refined mismatch set $M_{X_i}$ is:
\[
\boxed{
M_{X_i} = \left\{ \pi \in M : X_i(\pi S_{clean}) = X_i(S_{clean}) \right}
}
\]

The target invariant for achieving local decision sufficiency is:
\[
\boxed{|M_{X_i}| = 0}
\]
meaning the refinement successfully breaks all decision-changing symmetries.
