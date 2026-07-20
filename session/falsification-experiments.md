# Falsification Experiments: Conservative Proxy Hypotheses

Running three experiments against H1 (existence), H4 (usefulness), H3 (optimality).

---

## Experiment A: Fibre without meet (H1)

**Target:** $L = (\mathbb{Q}, \leq)$ — rationals with the usual order.
$\mathbb{Q}$ is not meet-complete: bounded-below subsets may lack a greatest
lower bound in $\mathbb{Q}$ (e.g., $S = \{q \in \mathbb{Q} \mid q^2 < 2\}$
has infimum $-\sqrt{2} \notin \mathbb{Q}$ and no GLB in $\mathbb{Q}$).

**Construction:**
- $X = \mathbb{N}$
- $C: \mathbb{N} \to \{0\}$ (constant — single fibre)
- $\Phi: \mathbb{N} \to \mathbb{Q}$ where $\Phi(n)$ = the $n$-th decimal
  approximation of $\sqrt{2}$ from above: $2, 1.5, 1.42, 1.415, \ldots$
  (decreasing towards $\sqrt{2}$)

**Fibre:** $C^{-1}(0) = \mathbb{N}$.
**Set in $\mathbb{Q}$:** $S = \{\Phi(n) \mid n \in \mathbb{N}\} =
\{2, 1.5, 1.42, 1.415, \ldots\}$ — decreasing, bounded below by $\sqrt{2}$.

**Does the meet exist in $\mathbb{Q}$?** The set $S$ has no greatest lower
bound in $\mathbb{Q}$: for any rational $r < \sqrt{2}$, there is another
rational $r'$ with $r < r' < \sqrt{2}$ (density of $\mathbb{Q}$). And no
rational equals $\sqrt{2}$. Therefore $\Phi^\downarrow(0)$ does not exist.

**Result: H1 FALSIFIED** for $(L, \sqsubseteq) = (\mathbb{Q}, \leq)$.

**Recovery:** Require $L$ to be meet-complete for the subsets $\Phi(C^{-1}(y))$.
This is WEAKER than requiring $L$ to be globally meet-complete (only the
fibre images need meets, not all subsets). For the case above, any complete
lattice containing $\sqrt{2}$ (e.g., $\mathbb{R}$) would suffice.

**Practical implication:** Properties with non-complete codomains fail.
Examples: $\Phi$ valued in strictly positive rationals, or in any set whose
lower bounds may fall outside the set. Resolution: extend $\Phi$'s codomain
to a completion (always possible via Dedekind completion or real closure).

---

## Experiment B: Proxy collapses to ⊥ (H4 — usefulness)

**Target:** Show $\Phi^\downarrow$ exists and is safe but is uniformly
$\bot$ across all fibres — making it correct but useless.

**Construction:**
- $X = \mathbb{R}^2$
- $C: \mathbb{R}^2 \to \mathbb{R}$ by $C(x, y) = x$ (projection)
- $\Phi: \mathbb{R}^2 \to \mathbb{R}$ by $\Phi(x, y) = y$
- $L = \mathbb{R} \cup \{-\infty, \infty\}$ with $\leq$
  ($\bot = -\infty$, $\top = \infty$)

**Fibre:** $C^{-1}(x) = \{(x, y') \mid y' \in \mathbb{R}\}$.
**Set in $L$:** $S_x = \Phi(C^{-1}(x)) = \mathbb{R}$ (all real values, same
for every fibre).

**Proxy:** $\Phi^\downarrow(x) = \inf(\mathbb{R}) = -\infty = \bot$.

**Safety:** $-\infty \leq y$ for all $y \in \mathbb{R}$. ✓ (vacuously safe)
**Usefulness:** Identical for every $x$ — $\Phi^\downarrow(x) = \bot$ for
all $x$. No fibre is distinguished. The proxy carries zero information.

**Result: H4 CONDITIONALLY FALSE.** The proxy exists (H1 ✓), is safe
(H2 ✓), is optimal (H3 ✓), but is useless.

**What this reveals:** This is not a failure of the proxy theory — it's the
theory correctly identifying that $C$ captures nothing about $\Phi$.
$\Phi(x, y) = y$ varies orthogonally to $C(x, y) = x$. The core already
handles this: $\sim_C \not\subseteq \sim_\Phi$ and the correct action is
*refinement* (add $y$ to the morphism), not proxy.

**Connection to H4:** Usefulness is not a theorem — it's a conditional
property that holds when $\Phi$ varies meaningfully within fibres but not
too much. When it fails, the solution is refinement (which is already
in the core). The proxy is a fallback for cases where refinement is
infeasible, and the proxy's uselessness is a signal that refinement is
necessary.

**Practical implication:** In safety-critical applications, if the proxy
collapses to $\bot$, you MUST refine the morphism. The proxy is not a
replacement for adequate observation.

---

## Experiment C: Break optimality (H3)

**Target:** Find $\Psi: Y \to L$ such that $\Psi$ is safe
($\Psi(y) \sqsubseteq \Phi(x)$ for all $x \in C^{-1}(y)$), $C$ preserves
$\Psi$, and $\Phi^\downarrow(y) \sqsubset \Psi(y)$ (strictly greater —
less conservative).

**Analysis:**

Let $S = \{\Phi(x) \mid C(x) = y\}$. By definition:
- $\Phi^\downarrow(y) = \bigsqcap S$ (the GLB of $S$).
- A safe proxy $\Psi(y)$ satisfies $\Psi(y) \sqsubseteq \Phi(x)$ for all
  $x \in C^{-1}(y)$ — i.e., $\Psi(y)$ is a lower bound of $S$.
- The GLB of $S$ is, by definition, the GREATEST lower bound.
- Therefore: $\Psi(y) \sqsubseteq \Phi^\downarrow(y)$ for any safe $\Psi$.

This means $\Psi(y) \sqsubset \Phi^\downarrow(y)$ is IMPOSSIBLE in the
opposite direction — no safe proxy can be strictly greater than the meet.
The only possible orderings are:
- $\Psi(y) \sqsubset \Phi^\downarrow(y)$ (worse — more conservative)
- $\Psi(y) = \Phi^\downarrow(y)$ (equal — equally optimal)
- $\Psi(y)$ and $\Phi^\downarrow(y)$ incomparable (possible in non-total
  orders — both are maximal safe proxies)

**Edge case:** Non-total orders where multiple incomparable GLBs exist.

Let $L$ be a lattice where $S$ has multiple maximal lower bounds.

**Construction:**
- $L = \{a, b, c, d\}$ with $a \sqsubseteq c$, $a \sqsubseteq d$,
  $b \sqsubseteq c$, $b \sqsubseteq d$, and $c, d$ incomparable
  (a 4-element boolean lattice).
- $X = \{x_1, x_2\}$, $C: X \to \{0\}$ (constant)
- $\Phi(x_1) = c$, $\Phi(x_2) = d$
- $S = \{c, d\}$. Lower bounds of $\{c, d\}$: $\{a, b\}$.

**What is GLB($c, d$)?** In a boolean lattice, the GLB of two incomparable
elements is their unique meet: $c \sqcap d = \bot$. If $a$ and $b$ are both
lower bounds and there's a unique GLB that's below both, then neither $a$
nor $b$ is optimal — the optimal is $c \sqcap d$ which is below both.

But if $L$ is a **preorder** (not a partial order) where antisymmetry
fails, there could be multiple non-comparable "greatest" lower bounds. In
a partial order, the GLB is unique if it exists. In a preorder, the GLB
is unique up to equivalence.

**Attempt to break H3:** Find $L$ where S has two incomparable maximal
lower bounds (both are GLBs). Then Φ^↓ is not a unique answer.

**Construction:** Let L be a **meet-semilattice that is not join-semilattice**
where two elements have two incomparable maximal common lower bounds...

Actually, in a meet-semilattice, the meet of any two elements is UNIQUE
and is their GREATEST common lower bound. So there's a unique GLB.

In a NON-TRANSITIVE preorder... but Axiom 2 requires transitivity.

So in any preorder satisfying Axiom 2, if a GLB exists, it is unique up
to equivalence (any two GLBs of the same set are equivalent). The GLB
may not be unique ELEMENT-WISE, but all GLBs are isomorphic in the
preorder.

This means: there's no room for a "better" proxy. Any safe proxy is at
most equivalent to Φ^↓.

**Result: H3 is UNFALSIFIABLE** — it follows from the definition of the
GLB. The only way to "break" H3 is to violate the definition of the meet,
which would mean H1 fails instead.

**Practical implication:** The proxy is always optimal. If it appears too
conservative (not useful), the issue is not optimality but the coarseness
of C. The solution is refinement, not a different proxy.

---

## Summary of results

| Hyp | Claim | Status | Notes |
|-----|-------|--------|-------|
| H1 | Fibre meet exists | **FALSIFIABLE** | Fails for non-meet-complete codomains like $\mathbb{Q}$. Needs condition: "the fibre image has a GLB in $L$." |
| H2 | Safety guarantee | **UNFALSIFIABLE (theorem)** | Follows from definition of GLB as lower bound. Need order orientation (conservative ⊑ risky). |
| H3 | Optimality | **UNFALSIFIABLE (theorem)** | Follows from definition of GLB as GREATEST lower bound. |
| H4 | Usefulness | **Conditional** — not a theorem | Fails when $\Phi$ varies orthogonally to $C$. This is a signal to refine $C$, not a proxy failure. |

## Revised claim

The ONLY mathematical condition the conservative proxy requires is:

> **Fibre meet condition:** For each $y \in Y$, the set
> $\{\Phi(x) \mid C(x) = y\}$ has a greatest lower bound in $L$.

When this holds:
- $\Phi^\downarrow(y) = \bigsqcap_{C(x) = y} \Phi(x)$ exists (H1)
- $\Phi^\downarrow(y) \sqsubseteq \Phi(x)$ for all $x$ in the fibre (H2, by definition)
- $\Phi^\downarrow$ is the greatest safe proxy (H3, by definition)
- Usefulness (H4) is a contextual property, not a theorem

## Three mathematical families tested against this:

| Family | $L$ | Meet-complete for fibre images? | H1 holds? |
|--------|-----|-------------------------------|-----------|
| ℝ with ≤ | ℝ | Yes (bounded-below subsets have infima) | ✓ |
| ℚ with ≤ | ℚ | No (counterexample above) | ✗ |
| Powerset $\mathcal{P}(U)$ with ⊆ | $\mathcal{P}(U)$ | Yes (arbitrary intersections exist) | ✓ |
| Finite lattice | $A$ | Yes (finite subsets have meets) | ✓ |
| Complete lattice | $A$ | Yes (all subsets have meets) | ✓ |
| Non-complete poset with joins | $L$ | Depends on the fibre subset | **Check per case** |

## Bottom line

The conservative proxy extension reduces to a single condition: "the
fibre images under $\Phi$ have GLBs in $L$." This is:

- **Trivially satisfied** for ℝ, powersets, finite lattices, complete lattices
- **Not guaranteed** for ℚ, non-complete posets, and domains with missing
  limit points
- **Always resolvable** by completing $L$ (Dedekind completion for orders,
  ideal completion for lattices)

The extension is robust across all practical domains (ℝ, sets, lattices)
and fails only in pathological codomains that are incomplete for the fibre
subsets in question.
