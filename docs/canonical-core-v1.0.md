# Structural Preservation Theory — Canonical Core v1.0

A self-contained axiomatic framework for preservation of properties under
morphisms. No domain-specific examples appear in the core; an appendix
lists verified instances.

---

## 1. Structures

A **structure type** $\mathcal{T}$ assigns to each set $Y$ a collection
$S_Y$ of **$\mathcal{T}$-structures on $Y$**, together with a binary
relation $\preceq_Y$ on $S_Y$.

**Axiom 1 (Pullback).** For every function $f: X \to Y$ and every
$\sigma \in S_Y$, there exists $f^*(\sigma) \in S_X$, called the
*pullback of $\sigma$ along $f$*. For **binary** structure types
— those whose structures are functions of pairs — the pullback is
pointwise:

$$ f^*(\sigma)(x_1, x_2) = \sigma(f(x_1), f(x_2)) $$

**Axiom 2 (Preorder).** $\preceq_Y$ is a preorder (reflexive and
transitive) on $S_Y$ for every $Y$. We write $\sigma_1 \preceq \sigma_2$
and say "$\sigma_1$ is sufficiently fine with respect to $\sigma_2$."

**Definition 1 (Monotonicity).** A structure type $(\mathcal{T}, \preceq)$
is *monotone* when: for all $f: X \to Y$, $\sigma_1 \preceq_Y \sigma_2$
implies $f^*(\sigma_1) \preceq_X f^*(\sigma_2)$.

**Lemma 1.** Every binary structure type is monotone.

*Proof.* For binary types, $\preceq$ is defined pointwise:
$f^*(\sigma_i)(x_1, x_2) = \sigma_i(f(x_1), f(x_2))$. If
$\sigma_1 \preceq_Y \sigma_2$, then for all $y_1, y_2 \in Y$,
$\sigma_1(y_1, y_2) \preceq_{\{0,1\}} \sigma_2(y_1, y_2)$
(where $\preceq_{\{0,1\}}$ is the comparison induced by the structure
type's ordering). Substituting $y_i = f(x_i)$ preserves the inequality.
Hence $f^*(\sigma_1) \preceq_X f^*(\sigma_2)$. ∎

*Note.* Non-binary types (e.g., topologies) require a case-by-case
verification of monotonicity; see Appendix A.

---

## 2. Induced structures

Let $\mathcal{C}: X \to Y$ be any function (a **morphism**). Given a
structure $\sigma \in S_Y$, the pair $(\mathcal{C}, \sigma)$ induces
a structure on $X$:

$$ \sigma_\mathcal{C} := \mathcal{C}^*(\sigma) \in S_X $$

A **contraction** is a non-injective morphism — one whose fibres
$\mathcal{C}^{-1}(y) \subseteq X$ contain at least two elements.

Let $\Phi: X \to Z$ be a property. Given $\tau \in S_Z$, the pair
$(\Phi, \tau)$ induces a structure on $X$:

$$ \tau_\Phi := \Phi^*(\tau) \in S_X $$

---

## 3. Preservation

**Definition 2 (Preservation).** $\mathcal{C}$ **preserves** $\Phi$
relative to $(\sigma, \tau)$ when:

$$ \sigma_\mathcal{C} \preceq \tau_\Phi $$

*Interpretation.* The structure that $\mathcal{C}$ induces on $X$ is
fine enough to capture every distinction that $\Phi$ requires.

When $\sigma_\mathcal{C} \not\preceq \tau_\Phi$, we say preservation
**fails**.

---

## 4. Factorization principle

**Theorem 1 (Fibre bound).** Let $\mathcal{C}: X \to Y$ and let
$\sigma \in S_Y$. For any $x_1, x_2 \in X$ with
$\mathcal{C}(x_1) = \mathcal{C}(x_2) = y$,

$$ \sigma_\mathcal{C}(x_1, x_2) = \sigma(y, y) $$

For every binary structure type listed in Appendix A,
$\sigma(y, y)$ is the neutral element of the structure (identity for
equivalences, $0$ for metrics, reflexivity for orders, the whole
space for topologies).

*Proof.* From Axiom 1 (pointwise pullback):
$\sigma_\mathcal{C}(x_1, x_2) = \sigma(\mathcal{C}(x_1), \mathcal{C}(x_2))
= \sigma(y, y)$. ∎

**Corollary 1 (Absolute limit).** The fibre $\mathcal{C}^{-1}(y)$ is an
absolute limit for every structure on $Y$: no choice of $\sigma$ can
distinguish elements within the same fibre.

---

## 5. Refinements

**Definition 3 (Refinement).** Let $\mathcal{C}: X \to Y$. A
**refinement** of $\mathcal{C}$ is a pair $(\mathcal{C}', \phi)$ where
$\mathcal{C}': X \to Y'$ and $\phi: Y' \to Y$ such that:

$$ \mathcal{C} = \phi \circ \mathcal{C}' $$

*Interpretation.* $\mathcal{C}'$ preserves all distinctions made by
$\mathcal{C}$ (since $\mathcal{C}'(x_1) = \mathcal{C}'(x_2)$ implies
$\mathcal{C}(x_1) = \mathcal{C}(x_2)$), and may add new ones.

**Theorem 2 (Inherited structure).** Let $(\mathcal{C}', \phi)$ be a
refinement of $\mathcal{C}$. Let $\sigma \in S_Y$, $\sigma' \in S_{Y'}$.
If $\phi^*(\sigma) \preceq \sigma'$, then:

$$ \sigma_\mathcal{C} \preceq \sigma'_{\mathcal{C}'} $$

*Proof.* $\sigma_\mathcal{C} = \mathcal{C}^*(\sigma) =
(\phi \circ \mathcal{C}')^*(\sigma) = \mathcal{C}'^*(\phi^*(\sigma))$.
By monotonicity (Lemma 1 for binary types),
$\phi^*(\sigma) \preceq \sigma'$ implies
$\mathcal{C}'^*(\phi^*(\sigma)) \preceq \mathcal{C}'^*(\sigma')$.
Hence $\sigma_\mathcal{C} \preceq \sigma'_{\mathcal{C}'}$. ∎

**Extreme refinements:**

- **Trivial:** $\mathcal{C}' = \mathcal{C}$, $\phi = \text{id}_Y$.
- **Maximal:** $\mathcal{C}'(x) = x$, $\phi$ any function with
  $\phi \circ \mathcal{C}' = \mathcal{C}$. (Induces the finest
  possible equivalence — identity. Always solves the preservation
  problem in principle, but may be infeasible.)

---

## 6. Scope theorem

**Theorem 3 (Scope of refinement).** Let $\mathcal{C}: X \to Y$ and
$(\mathcal{C}', \phi)$ a refinement. For any $x_1, x_2 \in X$ in
*distinct* fibres of $\mathcal{C}$ — i.e., $\mathcal{C}(x_1) \neq
\mathcal{C}(x_2)$ — no structure $\sigma' \in S_{Y'}$ can make
$\mathcal{C}'$ identify them:

$$ \mathcal{C}'(x_1) \neq \mathcal{C}'(x_2) $$

*Proof.* $\mathcal{C}(x_1) \neq \mathcal{C}(x_2)$ implies
$\phi(\mathcal{C}'(x_1)) \neq \phi(\mathcal{C}'(x_2))$, therefore
$\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$. ∎

**Corollary 2 (Fibre-wise action).** Every refinement $\mathcal{C}'$
acts exclusively within the fibres of $\mathcal{C}$: it can only add
distinctions inside each fibre $\mathcal{C}^{-1}(y)$; it cannot merge
elements from different fibres.

---

## 7. Preservation theorems

**Theorem 4 (Equivalence preservation).** Assume the structure type is
equivalence relations with $\preceq\; = \;\subseteq$. Let
$\mathcal{C}: X \to Y$, $\Phi: X \to Z$, and $(\mathcal{C}', \phi)$ a
refinement. Then:

$$ \sim_{\mathcal{C}'} \subseteq \sim_\Phi $$

if and only if, for every fibre $\mathcal{C}^{-1}(y)$, the restriction
of $\mathcal{C}'$ separates every pair that $\Phi$ separates:

$$ \forall x_1, x_2 \in \mathcal{C}^{-1}(y):\;
\Phi(x_1) \neq \Phi(x_2) \implies \mathcal{C}'(x_1) \neq \mathcal{C}'(x_2) $$

*Proof.* ($\Rightarrow$) Immediate from the definition of inclusion.

($\Leftarrow$) For $x_1, x_2$ in distinct fibres,
$\mathcal{C}(x_1) \neq \mathcal{C}(x_2)$; by Theorem 3,
$\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$, so
$\sim_{\mathcal{C}'} \subseteq \sim_\Phi$ holds for such pairs
regardless of $\Phi$. For $x_1, x_2$ in the same fibre, the hypothesis
ensures that if $\Phi(x_1) \neq \Phi(x_2)$ then
$\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$. Hence
$\sim_{\mathcal{C}'} \subseteq \sim_\Phi$ globally. ∎

**Theorem 5 (Pseudometric preservation).** Assume the structure type is
pseudometrics with $\preceq$ as Lipschitz domination:
$d_1 \preceq d_2 \iff \exists k > 0.\; d_2 \leq k \cdot d_1$.
Let $\mathcal{C}: X \to Y$, $\Phi: X \to \mathbb{R}$ with the Euclidean
metric on $\mathbb{R}$, and $(\mathcal{C}', \phi)$ a refinement with
$d_{Y'}$ on $Y'$. Then:

$$ d_\Phi \preceq d_{\mathcal{C}'} $$

(i.e., $d_\Phi \leq k \cdot d_{\mathcal{C}'}$) if the following hold:

1. **Fibre condition.** For every fibre $\mathcal{C}^{-1}(y)$:
   $d_\Phi \leq k \cdot d_{\mathcal{C}'}$ within the fibre.
2. **Interfibre compatibility.** $\phi$ is 1-Lipschitz with respect to
   $d_{Y'}$ and $d_Y$: $d_Y(\phi(y'_1), \phi(y'_2)) \leq
   d_{Y'}(y'_1, y'_2)$ for all $y'_1, y'_2 \in Y'$.

*Proof.* Condition 1 covers pairs within the same fibre. For pairs in
distinct fibres, condition 2 ensures $d_\mathcal{C} \leq d_{\mathcal{C}'}$
(since $d_\mathcal{C}(x_1, x_2) = d_Y(\mathcal{C}(x_1), \mathcal{C}(x_2))
\leq d_{Y'}(\mathcal{C}'(x_1), \mathcal{C}'(x_2)) = d_{\mathcal{C}'}(x_1,
x_2)$ by the Lipschitz property). If preservation $d_\Phi \leq k \cdot
d_\mathcal{C}$ held, transitivity would give $d_\Phi \leq k \cdot
d_{\mathcal{C}'}$. However, this is an additional hypothesis; without it,
condition 2 alone does not guarantee global preservation. ∎

*Note.* The difference between Theorem 4 and Theorem 5 reflects a
structural difference between the two structure types. For equivalences,
the scope theorem (Theorem 3) makes interfibre preservation automatic.
For pseudometrics, an explicit compatibility condition is required.

---

## 8. What the theory does not claim

1. **Every structure type is binary.** Topologies use a pullback defined
   by preimages, not pointwise on pairs. Each non-binary type must
   verify Axiom 1 and monotonicity independently.

2. **Every property induces a natural structure.** The theory requires
   a chosen structure on the codomain of $\Phi$. For binary properties
   ($\Phi: X \to \{0,1\}$), the natural choice is the discrete
   equivalence; for real-valued properties, the Euclidean metric.
   Other properties may require an arbitrary choice.

3. **Every preservation failure is repairable.** The theory provides
   a procedure (locate fibre → refine → verify) but does not guarantee
   that a feasible refinement exists. The maximal refinement (identity)
   always works in principle but may be impractical.

4. **The fibre decomposition is not automatic for all types.** Theorem 4
   (equivalences) admits unconditional fibre decomposition. Theorem 5
   (pseudometrics) requires additional compatibility. Other structure
   types may need case-specific conditions.

---

## Appendix A: Verified instances

### A.1 Equivalence relations ($\mathcal{T}_\sim$, $\subseteq$)

- $S_Y$: equivalence relations on $Y$.
- $\sigma_1 \preceq \sigma_2 \iff \sigma_1 \subseteq \sigma_2$.
- **A1:** $f^*(\sim)$ defined by $x_1 \sim_f x_2 \iff f(x_1) \sim f(x_2)$.
- **A2:** Inclusion is a partial order, hence a preorder.
- **Monotonicity:** If $\sim_1 \subseteq \sim_2$, then
  $f^*(\sim_1) \subseteq f^*(\sim_2)$.

### A.2 Pseudometrics ($\mathcal{T}_d$, $\leq_k$)

- $S_Y$: pseudometrics on $Y$.
- $\sigma_1 \preceq \sigma_2 \iff \exists k > 0.\; d_2 \leq k \cdot d_1$.
- **A1:** $f^*(d)(x_1, x_2) = d(f(x_1), f(x_2))$ is a pseudometric.
- **A2:** Lipschitz domination is a preorder.
- **Monotonicity:** If $d_2 \leq k \cdot d_1$ pointwise, then
  $f^*(d_2) \leq k \cdot f^*(d_1)$.

### A.3 Preorders ($\mathcal{T}_\leq$, $\Rightarrow$)

- $S_Y$: preorders on $Y$.
- $\sigma_1 \preceq \sigma_2 \iff (y_1 \leq_1 y_2 \implies y_1 \leq_2 y_2)$.
- **A1:** $f^*(\leq)$ defined by $x_1 \leq_f x_2 \iff f(x_1) \leq f(x_2)$.
- **A2:** Implication of orders is a preorder.
- **Monotonicity:** An analogous pointwise argument holds.

### A.4 Topologies ($\mathcal{T}_\tau$, $\supseteq$)

- $S_Y$: topologies on $Y$.
- $\sigma_1 \preceq \sigma_2 \iff \tau_1 \supseteq \tau_2$ (finer topology).
- **A1:** $f^*(\tau) = \{f^{-1}(U) \mid U \in \tau\}$ (initial topology).
  Note: *not* pointwise on pairs.
- **A2:** Reverse inclusion of topologies is a partial order.
- **Monotonicity:** If $\tau_1 \supseteq \tau_2$, then
  $f^*(\tau_1) \supseteq f^*(\tau_2)$ (verified case-by-case).

---

## Appendix B: Open questions

1. **Characterization of admissible types.** What is the minimal set
   of conditions that a structure type must satisfy to admit all
   theorems of this core? Axioms 1 and 2 are necessary but not
   obviously sufficient for Theorem 5 (pseudometric preservation) or
   its analogues for other types.

2. **Fibre decomposition for arbitrary types.** Does every monotone
   structure type admit a fibre-wise decomposition of the preservation
   condition? Theorem 3 suggests it holds for the scope of refinement,
   but the transfer to preservation depends on the specific $\preceq$.

3. **Compositionality.** If $\mathcal{C}_1$ preserves $\Phi$ and
   $\mathcal{C}_2$ is a refinement of $\mathcal{C}_1$, does
   $\mathcal{C}_2$ automatically preserve $\Phi$? (This depends on
   transitivity of $\preceq$ — assured by Axiom 2 — but subject to
   structure-specific conditions.)

4. **Quantitative bounds.** For metric preservation (Theorem 5), the
   constant $k$ appears without a method to compute it from the
   structure of $\mathcal{C}$ and $\Phi$. When can $k$ be determined
   a priori?
