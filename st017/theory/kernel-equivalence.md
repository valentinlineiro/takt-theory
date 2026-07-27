# ST-017 Theory: Mathematical Foundation of Kernel Equivalence & Witness Transport

**Status:** Pre-Formalization Design  
**Baseline Standard:** ST-016 v1.0.0 (`st016-v1.0.0`)  
**Design Spec:** [`docs/superpowers/specs/2026-07-27-st017-witness-transportability-design.md`](../../docs/superpowers/specs/2026-07-27-st017-witness-transportability-design.md)  

---

## 1. Mathematical Kernel Equivalence ($M_1 \sim M_2$)

Two execution runtimes $M_1 = (\mathcal{C}_1, \pi_{M_1})$ and $M_2 = (\mathcal{C}_2, \pi_{M_2})$ are defined as **Kernel Equivalent** ($M_1 \sim M_2$) if and only if their capability kernel structures are isomorphic under policy preservation:

$$\mathcal{K}_D(M_1) \cong \mathcal{K}_D(M_2)$$

Specifically:
1. **Decision Monomorphism:**  
   $$\forall R \in \mathcal{R}, \quad \pi_{M_1}(R) = \pi_{M_2}(R) = \pi^*(R)$$
2. **Capability Isomorphism:**  
   There exists a bi-directional capability mapping $f : \mathcal{C}_1 \to \mathcal{C}_2$ such that removing capability $C \in \mathcal{C}_1$ causes identical decision divergence on $M_2$:
   $$\pi_{M_1 \setminus \{C\}}(R) \neq \pi_{M_1}(R) \iff \pi_{M_2 \setminus \{f(C)\}}(R) \neq \pi_{M_2}(R)$$

---

## 2. Witness Transport Preservation Theorem

Let $W_1$ be a certified empirical witness artifact produced by $M_1$ such that:
$$\text{WitnessConsistentWithRuntime}(M_1, W_1) = \text{True}$$

Under a sound witness transport function $T_W : \mathcal{W}_1 \to \mathcal{W}_2$:

$$\forall M_1 \sim M_2, \quad \text{Certified}(W_1, M_1) \implies \text{Certified}(T_W(W_1), M_2)$$

### Candidate Proof Objective (Lean 4 Target)
$$\text{theorem } \texttt{witness\_transport\_preserves\_necessity} : \dots$$
Proving that $T_W(W_1)$ preserves decision non-preservation under $M_2 \setminus \{f(C)\}$ without requiring independent empirical re-ablation in runtime $M_2$.
