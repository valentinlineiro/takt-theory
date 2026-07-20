# Experimentum Crucis: Codomain Completion and Operational Preservation

**Question:** Can codomain completion recover a useful proxy when the
original codomain lacks fibre meets? Or does completion risk producing
mathematically valid but operationally empty proxies?

---

## Experiment A: Completion preserves operational meaning (ℚ → ℝ)

**Construction:**
- $X = \{1, \frac{1}{2}, \frac{1}{3}, \frac{1}{4}, \ldots\}$ (no zero)
- $C: X \to \{0\}$ (constant — single fibre)
- $\Phi: X \to \mathbb{Q}$ by $\Phi(x) = x$ (identity)
- $L = (\mathbb{Q}, \leq)$ — not meet-complete

**Fibre image:** $S_0 = \{\frac{1}{n} \mid n \in \mathbb{N}^+\}$
— decreasing to 0.

**GLB in $\mathbb{Q}$:** Does not exist. For any rational $r < 0$,
$r$ is a lower bound but not the greatest (e.g., $r/2$ is larger and
still below $S_0$). $0$ is the real infimum but $0 \notin \mathbb{Q}$.

**Completion:** $\bar{L} = (\mathbb{R}, \leq)$ (Dedekind completion).
In $\bar{L}$: $\bigsqcap S_0 = 0$.

**Proxy:** $\Phi^\downarrow(0) = 0$.

**Is 0 operational?** Compare to threshold $t > 0$ (e.g., safety
requires $\Phi(x) > t$):
- Proxy = $0 \leq t$
- Decision: "cannot guarantee safety above any positive threshold"
- This is **meaningful** — it correctly identifies that for any
  $t > 0$, some elements of the fibre (e.g., $\Phi(\frac{1}{n})$ for
  large $n$) fall below threshold.

**Verdict:** Completion recovers a mathematically correct AND
operationally meaningful proxy. The completed value $0$ is not a
possible $\Phi$ value (no $x$ has $\Phi(x) = 0$), but it is a valid
lower bound that supports correct decisions.

---

## Experiment B: Completion with unbounded fibre (proxy collapses)

**Construction:**
- $X = \mathbb{Z}$ (all integers, unbounded below)
- $C: X \to \{0\}$ (constant)
- $\Phi: X \to \mathbb{Q}$ by $\Phi(n) = n$

**Fibre image:** $S_0 = \mathbb{Z}$ — unbounded below.

**GLB in $\mathbb{Q}$:** Does not exist ($\mathbb{Z}$ has no lower bound
in $\mathbb{Q}$).

**Completion:** $\bar{L} = (\mathbb{R} \cup \{-\infty, \infty\}, \leq)$.
In $\bar{L}$: $\bigsqcap S_0 = -\infty$.

**Proxy:** $\Phi^\downarrow(0) = -\infty$.

**Operational assessment:** $-\infty$ is below any threshold.
Decision: always "unsafe" regardless of the true $\Phi(x)$. This is
mathematically correct (safe) but operationally useless for
discriminating safe from unsafe elements.

**Was this caused by completion?** No. The collapse was already present
in the structure of $C$ and $\Phi$ — $\Phi$ varies orthogonally to $C$
(the fibre is unbounded below regardless of $C$). Completion merely
made the collapse explicit by assigning $-\infty$ as the GLB. The same
collapse occurs in $\mathbb{R}$ (which is already complete) if
$\Phi: X \to \mathbb{R}$ with $\Phi(n) = n$ and $C$ constant.

**Verdict:** Completion does not introduce operational emptiness. The
emptiness is structural (H4 condition: $\Phi$ varies orthogonally to
$C$) and appears identically in complete codomains.

---

## Experiment C: Arbitrary completion vs. order-preserving completion

**Construction:** Same as Experiment A ($\{1/n\}$ in $\mathbb{Q}$).

**Bad completion:** $\bar{L}_1 = \mathbb{Q} \cup \{\bot\}$ where
$\bot$ is a new global minimum ($\bot \sqsubseteq q$ for all
$q \in \mathbb{Q}$).

In $\bar{L}_1$: $\bigsqcap S_0 = \bot$.

Proxy: $\Phi^\downarrow(0) = \bot$.

**Good completion:** $\bar{L}_2 = \mathbb{R}$ (Dedekind completion).

In $\bar{L}_2$: $\bigsqcap S_0 = 0$.

Proxy: $\Phi^\downarrow(0) = 0$.

**What's the difference?** The bad completion $\bar{L}_1$ preserves
the set ($\mathbb{Q} \subseteq \bar{L}_1$) but destroys the order
structure: existing subsets like $\{q \in \mathbb{Q} \mid q > 0\}$
now have GLB $\bot$ instead of $0$. The bad completion is not
**meet-preserving** — it changes the GLB of subsets that already
had one in $\mathbb{Q}$.

The Dedekind completion $\bar{L}_2$ IS meet-preserving: every
subset of $\mathbb{Q}$ keeps its original GLB if it had one, and
gets the missing GLB added if it didn't.

**Result:** The choice of completion matters. A meet-preserving
completion (Dedekind for total orders, ideal completion for posets)
is required to avoid introducing artificial conservatism.

**Principle:** Meet-preserving completions never worsen the proxy —
they only improve it (from undefined to defined). Non-preserving
completions can create operational emptiness.

---

## Experiment D: Proxy composition

**Question:** Is $\Phi^\downarrow$ compositional?
If $C = C_2 \circ C_1$, does
$\Phi^\downarrow_{C_2 \circ C_1} = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}$?

**Construction:**
- $X = \mathbb{R}^2$ with points $(a, b)$
- $C_1(a, b) = a$ (project x)
- $C_2(a) = \lfloor a \rfloor$ (floor)
- $C = C_2 \circ C_1: (a, b) \to \lfloor a \rfloor$
- $\Phi(a, b) = a + b$

**Compute $\Phi^\downarrow_C$ directly:**

Fibre $C^{-1}(n) = \{(a, b) \mid \lfloor a \rfloor = n\}$.

$\Phi^\downarrow_C(n) = \inf\{a + b \mid \lfloor a \rfloor = n\}
= -\infty$ (since $b$ is unbounded below). This is useless.

**Compute $\Phi^\downarrow_{C_1}$ first:**

Fibre $C_1^{-1}(a) = \{(a, b') \mid b' \in \mathbb{R}\}$.

$\Phi^\downarrow_{C_1}(a) = \inf\{a + b' \mid b' \in \mathbb{R}\}
= -\infty$ (same reason).

Then $(\Phi^\downarrow_{C_1})^\downarrow_{C_2}$:

$(\Phi^\downarrow_{C_1})^\downarrow_{C_2}(n) =
\inf\{\Phi^\downarrow_{C_1}(a) \mid \lfloor a \rfloor = n\}
= \inf\{-\infty \mid \lfloor a \rfloor = n\} = -\infty$.

**Result:** Both paths give $-\infty$. Composition holds trivially
for this case, but only because both proxies collapsed.

**More informative case:**
- $C_1(a, b) = a$ (project x)
- $C_2(a) = a$ (identity — no further contraction)
- $\Phi(a, b) = a \cdot \sin(b)$
- $\Phi^\downarrow_{C_1}(a) = \inf\{a \cdot \sin(b') \mid b' \in \mathbb{R}\}
  = -|a|$ (if $a \neq 0$), $0$ (if $a = 0$)

Then $(\Phi^\downarrow_{C_1})^\downarrow_{C_2}(a) =
\inf\{\Phi^\downarrow_{C_1}(a') \mid a' = a\} = \Phi^\downarrow_{C_1}(a)$
(since $C_2$ is identity).

And $\Phi^\downarrow_{C_2 \circ C_1}(a) = \Phi^\downarrow_{C_1}(a)$
(since $C_2$ is identity, $C_2 \circ C_1 = C_1$).

**Result:** Composition holds for these examples. The general question:

Does $\Phi^\downarrow_{C_2 \circ C_1} =
(\Phi^\downarrow_{C_1})^\downarrow_{C_2}$ always hold when GLBs exist?

**Proof sketch:**

Let $C = C_2 \circ C_1$.

$$ \Phi^\downarrow_C(z) =
\bigsqcap\{\Phi(x) \mid C_2(C_1(x)) = z\} $$

$$ (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) =
\bigsqcap\{\Phi^\downarrow_{C_1}(y) \mid C_2(y) = z\} =
\bigsqcap_{C_2(y) = z}\;
\bigsqcap_{C_1(x) = y} \Phi(x) $$

The double meet equals the meet over the union of all fibres of
$C_1$ within fibres of $C_2$:

$$ \bigsqcap_{z \in Z} \bigsqcap_{y \in C_2^{-1}(z)}
\bigsqcap_{x \in C_1^{-1}(y)} \Phi(x) =
\bigsqcap_{x \in C_2^{-1}(z) \circ C_1^{-1}(y) \ldots} $$

Actually, $C^{-1}(z) = \bigcup_{y \in C_2^{-1}(z)} C_1^{-1}(y)$.
The GLB over a union equals the GLB of the GLBs:

$$ \bigsqcap \bigcup_i S_i = \bigsqcap_i (\bigsqcap S_i) $$

when all GLBs exist (associativity of meets in a complete lattice).

Therefore $\Phi^\downarrow_{C_2 \circ C_1} =
(\Phi^\downarrow_{C_1})^\downarrow_{C_2}$ when all intermediate
GLBs exist. **Compositionality holds.**

**Verdict:** $\Phi^\downarrow$ is compositional under meet-preserving
completions. This is a strong property: it means the proxy can be
computed incrementally across a chain of contractions.

---

## Summary of completion experiments

| Experiment | Result | Key insight |
|-----------|--------|-------------|
| A: ℚ → ℝ for $\{1/n\}$ | ✓ Proxy recovered, meaningful | Dedekind completion adds 0 as correct safe bound |
| B: Unbounded fibre | Proxy = $-\infty$ (collapsed) | Not caused by completion — structural (H4) |
| C: Bad completion (⊥) | Proxy = ⊥, useless | Completion must be MEET-PRESERVING |
| D: Composition | Holds when GLBs exist | $\Phi^\downarrow_{C_2 \circ C_1} = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}$ |

## What survived

The **completion principle** withstands the attack:

> Every contraction admits a conservative proxy after completing the
> observation structure via a meet-preserving completion (Dedekind
> for total orders, ideal completion for posets).

The proxy after meet-preserving completion is:
1. **Mathematically correct** (safe lower bound by construction)
2. **Operationally meaningful** (the completion adds only the GLB,
   preserving existing meets)
3. **Compositional** ($\Phi^\downarrow$ distributes over composition
   of contractions)

The only source of operational emptiness remains the structural
relationship between $C$ and $\Phi$ (H4), never the completion itself.
