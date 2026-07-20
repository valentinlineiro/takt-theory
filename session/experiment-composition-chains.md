# Experiment: Composition Chains
## Testing $\Phi^\downarrow_{C_2 \circ C_1} = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}$

Builds on the completion experiments. Tests whether the proxy survives
compositional computation without requiring intermediate completions.

---

## Setup

Contract $C = C_2 \circ C_1$ where:
- $C_1: X \to Y_1$ (first contraction level)
- $C_2: Y_1 \to Y_2$ (second contraction level)

Question: Can we compute $\Phi^\downarrow_C$ by first computing over
$C_1$-fibres, then over $C_2$-fibres of the intermediate proxy?

---

## Construction (where intermediate GLB fails)

Let $L = (\mathbb{Q}, \leq)$ — not meet-complete.

Let $X = \{x_1, x_2, x_3, \ldots\} \cup \{x_{-1}\}$.
- $C_1$: groups positive fractions into one fibre, $x_{-1}$ into another
- $C_2$: maps both fibres to the same output
- $C = C_2 \circ C_1$: constant function

**Define:**
- $C_1(x_n) = a$ for $n \geq 2$, $C_1(x_1) = b$, $C_1(x_{-1}) = c$  
  (three $C_1$-fibres, only $a$ is problematic)
- $C_2(a) = C_2(b) = C_2(c) = z$ (all map to same $z$)
- $\Phi(x_n) = 1/n$ for $n \geq 2$, $\Phi(x_1) = 1$, $\Phi(x_{-1}) = -1$

**$C_1$-fibres:**
- $C_1^{-1}(a) = \{x_2, x_3, \ldots\}$, $\Phi$-image = $\{1/2, 1/3, \ldots\}$
  GLB in $\mathbb{Q}$: **does not exist** (infimum $0 \notin \mathbb{Q}$)
- $C_1^{-1}(b) = \{x_1\}$, $\Phi = \{1\}$, GLB = $1$ ✓
- $C_1^{-1}(c) = \{x_{-1}\}$, $\Phi = \{-1\}$, GLB = $-1$ ✓

**$C$-fibre:** $C^{-1}(z) = X$, $\Phi$-image = $\{-1, 1, 1/2, 1/3, \ldots\}$
GLB in $\mathbb{Q}$: **exists** = $-1$ ($-1$ is the minimum, hence GLB). ✓

### Direct proxy

$$ \Phi^\downarrow_C(z) = -1 \quad \text{(exists)} $$

### Incremental proxy

$$ (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) = \bigsqcap\{
   \Phi^\downarrow_{C_1}(a),\,
   \Phi^\downarrow_{C_1}(b),\,
   \Phi^\downarrow_{C_1}(c)
\} $$

But $\Phi^\downarrow_{C_1}(a)$ is **undefined** ($a$'s fibre has no GLB in $\mathbb{Q}$).
Therefore $(\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z)$ is **undefined**.

### Result: Compositional gap

$$ \Phi^\downarrow_C(z) = -1 \quad \text{(exists)} $$
$$ (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) \quad \text{(does not exist)} $$

The direct proxy exists but the incremental computation fails because
an intermediate $C_1$-fibre lacks a GLB.

### Recovery via completion

Complete $L = \mathbb{Q} \to \bar{L} = \mathbb{R}$. Then:

$$ \Phi^\downarrow_{C_1}(a) = 0 \quad \text{(now exists)} $$
$$ (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) = \min(0, 1, -1) = -1 $$
$$ \Phi^\downarrow_C(z) = -1 $$

**Equality restored.** ✓

---

## Finding

Compositionality $\Phi^\downarrow_{C_2 \circ C_1} = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}$
holds **when all intermediate meets exist**. When some intermediate
meet does not exist, the direct proxy may still exist (because the
union fibre "smoothes over" the incomplete subset by adding a
dominating element).

**This is not a failure of compositionality. It is a requirement:**
to compute compositionally, complete the intermediate codomains or
verify that all fibre images along the chain have GLBs.

---

## Refinement chain: signs → intervals (monotonicity check)

Testing Proposition 5: refinement improves the proxy.

### Setup

- $X = \mathbb{Z}^2$ (pairs of integers)
- $\Phi(x, y) = x$ (property depends only on $x$)
- $L = (\mathbb{R}, \leq)$, complete ✓

### Chain

| Level | $C$ | Codomain $Y$ | Fibre | $\Phi^\downarrow(y)$ |
|-------|-----|-------------|-------|---------------------|
| Full | identity | $\mathbb{Z}^2$ | $\{(x,y)\}$ | $x$ |
| $C_2$ | $C_2(x,y) = x$ | $\mathbb{Z}$ | $\{(x,y') \mid y' \in \mathbb{Z}\}$ | $x$ |
| $C_1$ | $C_1(x,y) = \lfloor x/10 \rfloor$ | $\mathbb{Z}$ | $\{(x',y') \mid \lfloor x'/10\rfloor = n\}$ | $10n$ |

### Compute

$\Phi^\downarrow_{C_1}(n) = \inf\{x \mid \lfloor x/10\rfloor = n\} = 10n$
(at minimum $x = 10n$).

$(\Phi^\downarrow_{C_1})^\downarrow_{C_2}(x) =$ ... wait, this composition
is $C_2 \circ C_1$? No, $C_1$ is coarser than $C_2$. Let me reorder.

The refinement chain from coarsest to finest:
- $C_{\text{coarse}}(x, y) = \lfloor x/10 \rfloor$ (decade)
- $C_{\text{medium}}(x, y) = x$ (exact x)
- $C_{\text{fine}}(x, y) = (x, y)$ (identity — full info)

Where $C_{\text{coarse}} = \phi_{\text{cm}} \circ C_{\text{medium}}$
(with $\phi_{\text{cm}}(x) = \lfloor x/10\rfloor$)
and $C_{\text{medium}} = \phi_{\text{mf}} \circ C_{\text{fine}}$
(with $\phi_{\text{mf}}(x, y) = x$).

**Proxy at coarse level:** $\Phi^\downarrow_{\text{coarse}}(n) = 10n$.

**Proxy at medium level:** $\Phi^\downarrow_{\text{medium}}(x) = x$.

**Monotonicity:** $\Phi^\downarrow_{\text{coarse}}(\phi_{\text{cm}}(x)) = \lfloor x/10\rfloor \cdot 10 \leq x = \Phi^\downarrow_{\text{medium}}(x)$.

E.g., $x = 15$: coarse proxy $= 10$, medium proxy $= 15$.
$10 \leq 15$ ✓. The finer refinement gives a less conservative (more
informative) proxy.

### Proposition 5 confirmed

$$ \Phi^\downarrow_{C'} \circ \phi \sqsubseteq \Phi^\downarrow_{C''} $$

when $C''$ refines $C'$ ($C' = \phi \circ C''$). The proxy strictly
improves (or stays equal) with each refinement step.

---

## From signs to intervals to octagons (abstract interpretation)

Following the user's proposed chain:

$$ \text{concrete} \to \text{signs} \to \text{intervals} \to \text{octagons} $$

### $C_{\text{sign}}$: sign abstraction

$X = \mathbb{Z}$ (single variable $x$)
$\Phi(x) = x$ (real-valued property, $L = \mathbb{R}$)
$C_{\text{sign}}(x) = \text{sgn}(x) \in \{-, 0, +\}$

Fibres and proxies:

| Fibre | Elements | $\Phi^\downarrow$ |
|-------|----------|-------------------|
| $-$ | $\{x < 0\}$ | $-\infty$ (unbounded below) |
| $0$ | $\{0\}$ | $0$ |
| $+$ | $\{x > 0\}$ | $0$ (approaches $0^+$) |

### $C_{\text{int}}$: interval abstraction

$C_{\text{int}}(x) = [x, x]$ (singleton interval)
$C_{\text{sign}} = \phi_{\text{si}} \circ C_{\text{int}}$ with
$\phi_{\text{si}}([l, r]) = \text{sgn}(l)$

Fibre: $C_{\text{int}}^{-1}([x, x]) = \{x\}$
$\Phi^\downarrow_{\text{int}}([x, x]) = x$

**Monotonicity:** $\Phi^\downarrow_{\text{sign}}(\phi_{\text{si}}([x, x])) =
\Phi^\downarrow_{\text{sign}}(\text{sgn}(x))$.

| $x$ | $\Phi^\downarrow_{\text{sign}}(\text{sgn}(x))$ | $\Phi^\downarrow_{\text{int}}([x, x])$ |
|-----|----------------------------------------------|--------------------------------------|
| $5$ | $0$ (from $+$ fibre) | $5$ |
| $-3$ | $-\infty$ | $-3$ |
| $0$ | $0$ | $0$ |

In all cases: $\Phi^\downarrow_{\text{sign}} \leq \Phi^\downarrow_{\text{int}}$.
The finer interval abstraction gives a strictly less conservative proxy
for non-zero values. ✓

### $C_{\text{oct}}$: octagonal abstraction (two variables)

$X = \mathbb{Z}^2$, $\Phi(x, y) = x + y$.
$C_{\text{oct}}(x, y) = \{x \in [a,b], y \in [c,d], x+y \in [e,f]\}$

$C_{\text{int}} = \phi_{\text{io}} \circ C_{\text{oct}}$ with
$\phi_{\text{io}}$ projecting away the $x+y$ constraint.

For a specific fibre: $x \in [0,10], y \in [0,10], x+y \in [5,15]$

$\Phi^\downarrow_{\text{oct}} = \inf\{x+y \mid x \in [0,10], y \in [0,10],
x+y \geq 5\} = 5$. (The octagonal constraint $x+y \geq 5$ raises the
lower bound from $0$ to $5$.)

Compare to $\Phi^\downarrow_{\text{int}}$ (without $x+y$ constraint):
$\Phi^\downarrow_{\text{int}}(x \in [0,10], y \in [0,10]) =
\inf\{x+y \mid x \in [0,10], y \in [0,10]\} = 0$.

**Monotonicity:** $5 = \Phi^\downarrow_{\text{oct}} \geq
\Phi^\downarrow_{\text{int}} = 0$ (octagon gives a less conservative proxy).
✓ Confirmed.

---

## Findings

| Property | Status | Condition |
|----------|--------|-----------|
| $\Phi^\downarrow_{C_2 \circ C_1} = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}$ | **Theorem** | Requires all intermediate GLBs to exist |
| Incremental failure despite direct existence | **Possible** | Intermediate fibre lacks GLB; completed version fixes it |
| $C''$ refines $C' \implies \Phi^\downarrow_{C'} \circ \phi \sqsubseteq \Phi^\downarrow_{C''}$ | **Theorem** (Proposition 5) | Verified across signs → intervals → octagons |
| Refinement never worsens the proxy | **Confirmed** | Each step gives less conservative bounds |

The chain confirms:
1. The proxy improves monotonically with refinement
2. Compositionality holds with intermediate completions
3. Abstract interpretation hierarchy (signs ⊏ intervals ⊏ octagons)
   demonstrates all three patterns in a natural setting
