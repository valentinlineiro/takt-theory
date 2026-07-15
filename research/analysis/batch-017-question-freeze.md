# Batch-017 Question Freeze — Symmetry Invariance Mismatch

## 1. Origin

Batch-016 demonstrated that increasing local observation depth $k$ does not shrink worst-case silent regret when the representation $\Omega$ itself is decision-insufficient ($B(0) = B(1) = B(2) = 15.58$). This proved that the representational contraction $S \rightarrow \Omega(S)$ possesses more symmetries than the decision problem $S \rightarrow a^*(S)$, creating a symmetry gap:

\[
G_\Omega \not\subseteq G_D
\]

where:
* $G_\Omega = \{ T : \Omega(TS) = \Omega(S) \}$ (Representational Invariance Group)
* $G_D = \{ T : a^*(TS) = a^*(S) \}$ (Decision Invariance Group)

---

## 2. Core Question

**Can we formally characterize the symmetry mismatch $G_\Omega \setminus G_D$, and what is the minimal representation refinement $\Omega_{local} \oplus X_{invariant}$ that restricts the representational symmetries to a subset of the decision symmetries ($G_{\Omega'} \subseteq G_D$), forcing worst-case regret to decay?**

We test the hypothesis that the symmetry mismatch is driven by the representation's blindness to **relative position from decision roles** (source `'s'` and target `'t'`).

---

## 3. Candidate Invariant Refinements

We evaluate the following candidate invariants to break decision-relevant symmetries:

### 3.1 Candidate $X_{dist}$: Relative Distance Signatures
* **Definition**: A multi-dimensional signature mapping each node's shortest-path distance to source `'s'` and target `'t'`:
  \[
  X_{dist}(v) = (dist(s, v), dist(v, t))
  \]
  This preserves the role-relative position of observed nodes without exposing literal identities.

### 3.2 Candidate $X_{reach}$: Bipartite Reachability Matrix
* **Definition**: A boolean connectivity marker capturing whether a node is reachable from source `'s'` and can reach target `'t'`:
  \[
  X_{reach}(v) = (\text{reachable}(s, v), \text{reachable}(v, t))
  \]

---

## 4. Outcome Regimes

### Scenario A — Symmetry Closure (Regret Decay Confirmed)
* **Condition**: Appending $X_{dist}$ or $X_{reach}$ to the local representation successfully narrows $G_{\Omega'}$ such that $G_{\Omega'} \subseteq G_D$. Under this refinement, the regret curve $B'(k)$ is monotonic and decays to exactly $0.00$ at $kMax$.
* **Implication**: Decisional sufficiency is achieved without literal node identities by preserving role-relative geometry.

### Scenario C — Residual Symmetries
* **Condition**: Silent decision-changing transformations still exist in $G_{\Omega'} \setminus G_D$, and the worst-case regret $B'(kMax)$ remains greater than $0.00$.
* **Implication**: Relative position/reachability is insufficient; a stronger invariant is required to close the decision-symmetry gap.
