# Conservative Proxy Theorem — Formal Statement

**Status:** Candidate theorem, post-falsification. Reduces to a single
condition: fibre images under $\Phi$ have greatest lower bounds.

---

## 1. Setting

Let $C: X \to Y$ be a morphism (any function).
Let $\Phi: X \to L$ be a property where $(L, \sqsubseteq)$ is a poset.

For each $y \in Y$, define the fibre image:

$$ S_y = \{\Phi(x) \mid C(x) = y\} \subseteq L $$

---

## 2. The condition

**Single hypothesis:** For every $y \in Y$, the set $S_y$ has a greatest
lower bound (GLB, meet) in $(L, \sqsubseteq)$. Write:

$$ m_y = \bigsqcap S_y $$

If $S_y = \varnothing$ (empty fibre), define $m_y = \top$
(the top element of $L$ if it exists; otherwise the condition requires
$L$ to have a top element for empty fibre images).

---

## 3. The proxy

Define $\Phi^\downarrow: Y \to L$ by:

$$ \Phi^\downarrow(y) = m_y = \bigsqcap_{x \in C^{-1}(y)} \Phi(x) $$

---

## 4. Propositions

### Proposition 1 (Safety)

$$ \forall x \in X:\; \Phi^\downarrow(C(x)) \sqsubseteq \Phi(x) $$

*Proof.* By definition, $\Phi^\downarrow(C(x))$ is a lower bound of
$S_{C(x)}$. Since $\Phi(x) \in S_{C(x)}$, the GLB property gives
$\Phi^\downarrow(C(x)) \sqsubseteq \Phi(x)$. ∎

### Proposition 2 (Preservation)

$C$ preserves $\Phi^\downarrow$ in the sense of the core:

$$ \forall x_1, x_2 \in X:\; C(x_1) = C(x_2) \implies
   \Phi^\downarrow(C(x_1)) = \Phi^\downarrow(C(x_2)) $$

*Proof.* If $C(x_1) = C(x_2) = y$, then $\Phi^\downarrow(C(x_1))
= \Phi^\downarrow(y) = \Phi^\downarrow(C(x_2))$.
This is trivially true since $\Phi^\downarrow$ is defined on $Y$
and applied to $C(x)$. ∎

### Proposition 3 (Optimality)

For any other proxy $\Psi: Y \to L$ such that $C$ preserves $\Psi$ and:

$$ \forall x \in X:\; \Psi(C(x)) \sqsubseteq \Phi(x) $$

we have:

$$ \Psi(y) \sqsubseteq \Phi^\downarrow(y) \quad \text{for all } y \in Y $$

*Proof.* Fix $y \in Y$. For every $x \in C^{-1}(y)$, the hypothesis gives
$\Psi(y) \sqsubseteq \Phi(x)$. Thus $\Psi(y)$ is a lower bound of $S_y$.
Since $\Phi^\downarrow(y)$ is the GREATEST lower bound of $S_y$, we have
$\Psi(y) \sqsubseteq \Phi^\downarrow(y)$. ∎

*Interpretation.* No safe proxy is less conservative than $\Phi^\downarrow$.
The proxy is the optimal safe abstraction of $\Phi$ under $C$.

### Proposition 4 (Composition)

If $C''$ refines $C'$ (there exists $\phi$ with $C' = \phi \circ C''$),
then for all $y'' \in Y''$:

$$ \Phi_{C'}^\downarrow(\phi(y'')) \sqsubseteq
   \Phi_{C''}^\downarrow(y'') $$

where $\Phi_{C'}^\downarrow$ is the proxy with respect to $C'$, and
$\Phi_{C''}^\downarrow$ with respect to $C''$.

*Proof.* $C''^{-1}(y'') \subseteq C'^{-1}(\phi(y''))$ because
$x \in C''^{-1}(y'')$ implies $C''(x) = y''$, hence
$C'(x) = \phi(C''(x)) = \phi(y'')$. Therefore:

$$ S_{\phi(y'')}^{C'} = \{\Phi(x) \mid C'(x) = \phi(y'')\}
   \supseteq \{\Phi(x) \mid C''(x) = y''\} = S_{y''}^{C''} $$

The GLB of a larger set is $\sqsubseteq$ the GLB of a subset:
$\bigsqcap S_{\phi(y'')}^{C'} \sqsubseteq \bigsqcap S_{y''}^{C''}$.
Hence $\Phi_{C'}^\downarrow(\phi(y'')) \sqsubseteq
\Phi_{C''}^\downarrow(y'')$. ∎

*Interpretation.* A finer refinement gives a less conservative (more
informative) proxy. Refinement never worsens the proxy.

---

## 5. Boundary: when the condition fails

**Case A: No GLB in $L$.** If some $S_y$ lacks a GLB in $(L, \sqsubseteq)$,
the proxy is undefined. This occurs for:

- $(L, \sqsubseteq) = (\mathbb{Q}, \leq)$ with $S_y$ bounded below by an
  irrational (e.g., decreasing to $\sqrt{2}$)
- Non-complete posets where the fibre image is infinite and unbounded below

**Resolution: Completion.** Extend $L$ to a meet-complete poset
$\bar{L}$ (Dedekind completion for total orders, ideal completion for
posets). Embed $\Phi: X \to L \hookrightarrow \bar{L}$. In $\bar{L}$,
every $S_y$ has a GLB by construction. The proxy in $\bar{L}$ may give
a value outside the original $L$, but it is well-defined.

**Observation:** This suggests a meta-principle:

> Every contraction admits a conservative proxy after completing the
> observation structure.

**Case B: Proxy collapses (useless).** If $\Phi^\downarrow(y) = \bot$
for all reachable $y$, the proxy exists and is safe but carries zero
information. This happens when $\Phi$ varies entirely within fibres
and orthogonally to $C$ — i.e., $\Phi$ contains no information
recoverable from $C$.

**Resolution: Refinement.** The core already prescribes this: when the
proxy is useless, refine $C$ to $C'$ such that $C = \phi \circ C'$
and $C'$ captures more of $\Phi$'s variation. The proxy improves
monotonically with refinement (Proposition 4).

---

## 6. Verified instances

| Domain | $L$ | $\sqsubseteq$ | $\sqcap$ | Condition holds? | Proxy useful? |
|--------|-----|---------------|----------|-----------------|---------------|
| G2 (estimation) | $\mathbb{R}$ | $\leq$ | $\min$ | ✓ (ℝ complete) | ✓ (guides $\beta$ bound) |
| Lossy compression | $\mathbb{R}$ | $\leq$ | $\min$ | ✓ | ✓ (PSNR lower bound) |
| Noisy sensor | $\mathbb{R}$ | $\leq$ | $\min$ | ✓ | ✓ (confidence interval) |
| Database views | $\mathcal{P}(U)$ | $\subseteq$ | $\cap$ | ✓ (powerset complete) | ✓ (certain answers) |
| Abstract interp. | Lattice $A$ | $\sqsubseteq$ | $\sqcap$ | ✓ (finite lattice) | ✓ (safe approximation) |

---

## 7. Relationship to core v1.0

| Layer | Scope | Mechanism |
|-------|-------|-----------|
| v1.0 — exact preservation | Refinement restores full preservation | Theorem 4 (equivalence), Theorem 5 (pseudometric, boon) |
| v1.1 — conservative proxy | Preservation impossible; safe bound instead | Meet-over-fibre $\Phi^\downarrow$ |
| Bridge | When proxy collapses | Refine $C$ (fall back to v1.0 mechanism) |

The two layers form a complete pipeline:

```
         Can refinement restore preservation?
                    /            \
                 Yes              No
                  |                |
           Use Theorem 4/5    Does fibre meet exist?
                                  /        \
                               Yes          No
                                |            |
                         Conservative    Complete L
                           proxy        and retry
```

---

## 8. Open questions

1. **Completion generality.** Is it always possible to complete $L$ so
   that every fibre image has a GLB? (Yes for orders via Dedekind/ideal
   completion, but the completion may lose structure — e.g., algebraic
   properties of the original $L$.)

2. **Proxy distance.** When the proxy exists, how far is it from the
   optimal refinement? I.e., what is the gap between $\Phi^\downarrow$
   (under the current $C$) and $\Phi$ (under identity refinement)?
   Each domain has its own measure (Hoeffding bound, PSNR loss, certain
   answer gap, abstract precision). Is there a general notion?

3. **Usefulness threshold.** When is the proxy "useful enough" to stop
   refining? This is domain-specific (safety threshold, statistical
   significance level, query coverage), not a theorem.

4. **Non-poset codomains.** The theorem assumes $(L, \sqsubseteq)$ is
   a poset. Can it be generalized to preorders (Axiom 2 of the core)?
   Yes — the GLB is defined up to equivalence, and all propositions
   hold with $\sqsubseteq$ interpreted as the preorder.
