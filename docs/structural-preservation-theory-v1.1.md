# Structural Preservation Theory v1.1

**Date:** 2026-07-20
**Status:** Frozen post-falsification. Core v1.0 intact. Conservative Proxy
Extension added as complementary layer when exact preservation is impossible.

---

## Part I: Canonical Core (v1.0)

A self-contained axiomatic framework for preservation of properties under
morphisms. Full text in `docs/canonical-core-v1.0.md` (303 lines, 5 theorems,
4 verified instances, 4 open questions).

### Axioms

**Axiom 1 (Pullback).** For every function $f: X \to Y$ and every structure
$\sigma \in S_Y$, there exists $f^*(\sigma) \in S_X$. For binary structures,
the pullback is pointwise: $f^*(\sigma)(x_1, x_2) = \sigma(f(x_1), f(x_2))$.

**Axiom 2 (Preorder).** $\preceq_Y$ is a preorder (reflexive and transitive)
on $S_Y$ for every $Y$.

### Key definitions

- **Morphism:** any function $C: X \to Y$.
- **Contraction:** a non-injective morphism.
- **Induced structure:** $\sigma_C = C^*(\sigma)$.
- **Preservation:** $\sigma_C \preceq \tau_\Phi$.
- **Refinement:** a pair $(C', \phi)$ with $C = \phi \circ C'$.

### Theorem 4 (Equivalence preservation)

For equivalence structures with $\preceq\;=\;\subseteq$: $\sim_{C'} \subseteq \sim_\Phi$
iff within each fibre of $C$, $C'$ separates every pair that $\Phi$ separates.

**Refinement can repair broken preservation** — adding distinctions within
fibres restores the inclusion.

### Theorem 5 (Pseudometric preservation)

For pseudometric structures with $\preceq$ as Lipschitz domination:
$d_\Phi \preceq d_{C'}$ requires $d_\Phi \preceq d_C$ to already hold
(the boon condition).

**Refinement improves existing preservation but cannot repair broken
preservation.**

---

## Part II: Refinement Asymmetry

| Theorem | Type | Power |
|---------|------|-------|
| 4 | Equivalence | **Repair**: refinement can fix broken preservation |
| 5 | Pseudometric | **Boon only**: refinement preserves existing preservation |

This asymmetry is structural, not accidental. Equivalence admits within-fibre
categorical separation (add a distinction). Pseudometric requires within-fibre
metric dominance (add a quantitative bound), which is strictly stronger.

When Theorem 4 fails (non-equivalence) or Theorem 5 cannot apply
(preservation already broken), a second mechanism is needed: the
conservative proxy.

---

## Part III: Conservative Proxy Extension

### 1. Setting

Let $C: X \to Y$ be a morphism (any function).
Let $\Phi: X \to L$ be a property where $(L, \sqsubseteq)$ is a poset.

For each $y \in Y$, the fibre image is:

$$ S_y = \{\Phi(x) \mid C(x) = y\} \subseteq L $$

### 2. Existence condition

**Condition (Fibre meet).** For every $y \in Y$, the set $S_y$ has a
greatest lower bound (GLB, meet) in $(L, \sqsubseteq)$.

This is the **single condition** the extension requires. Verified to hold for:

| Codomain $L$ | Order $\sqsubseteq$ | Meet $\sqcap$ | Status |
|-------------|---------------------|---------------|--------|
| $\mathbb{R}$ | $\leq$ | $\min$ | ✓ (bounded-below subsets have infima) |
| $\mathcal{P}(U)$ | $\subseteq$ | $\bigcap$ | ✓ (arbitrary intersections exist) |
| Finite lattice $A$ | $\sqsubseteq$ | $\sqcap$ | ✓ (finite subsets have meets) |
| Complete lattice $A$ | $\sqsubseteq$ | $\sqcap$ | ✓ (all subsets have meets) |

Known to fail for:
- $\mathbb{Q}$ with $\leq$ (e.g., $\{q \mid q^2 < 2\}$ has no GLB)
- Non-complete posets where fibre images lack GLBs

**Completion principle:** When the condition fails, extend $L$ to a
meet-preserving completion $\bar{L}$ (Dedekind for total orders, ideal
completion for posets). After completion, the condition holds and the
proxy is defined. Meet-preserving completions never worsen the proxy.

### 3. The meet-over-fibre operator

Define $\Phi^\downarrow: Y \to L$ by:

$$ \Phi^\downarrow(y) = \bigsqcap S_y = \bigsqcap_{x \in C^{-1}(y)} \Phi(x) $$

For empty fibres ($C^{-1}(y) = \varnothing$), define
$\Phi^\downarrow(y) = \top_L$ if it exists.

### 4. Safety theorem

**Theorem 6 (Safety).** For all $x \in X$:

$$ \Phi^\downarrow(C(x)) \sqsubseteq \Phi(x) $$

*Proof.* $\Phi^\downarrow(C(x)) = \bigsqcap S_{C(x)}$ is a lower bound of
$S_{C(x)}$. Since $\Phi(x) \in S_{C(x)}$, we have
$\Phi^\downarrow(C(x)) \sqsubseteq \Phi(x)$. ∎

The proxy never reports "safe" when the true value is "unsafe." It is a
guaranteed lower bound.

### 5. Preservation theorem

**Theorem 7 (Preservation).** $C$ preserves $\Phi^\downarrow$:

$$ C(x_1) = C(x_2) \implies \Phi^\downarrow(C(x_1)) = \Phi^\downarrow(C(x_2)) $$

*Proof.* If $C(x_1) = C(x_2) = y$, then both equal $\Phi^\downarrow(y)$. ∎

The proxy factors through $C$ by construction.

### 6. Optimality theorem

**Theorem 8 (Optimality).** For any other proxy $\Psi: Y \to L$ such that
$\Psi(C(x)) \sqsubseteq \Phi(x)$ for all $x \in X$:

$$ \Psi(y) \sqsubseteq \Phi^\downarrow(y) \quad \text{for all } y \in Y $$

*Proof.* Fix $y$. For every $x \in C^{-1}(y)$, $\Psi(y) \sqsubseteq \Phi(x)$,
so $\Psi(y)$ is a lower bound of $S_y$. Since $\Phi^\downarrow(y)$ is the
**greatest** lower bound, $\Psi(y) \sqsubseteq \Phi^\downarrow(y)$. ∎

No safe proxy is less conservative than $\Phi^\downarrow$. It is the optimal
safe abstraction of $\Phi$ under $C$.

### 7. Refinement monotonicity theorem

**Theorem 9 (Refinement improves proxy).** If $C''$ refines $C'$
(there exists $\phi$ with $C' = \phi \circ C''$), then:

$$ \Phi^\downarrow_{C'}(\phi(y'')) \sqsubseteq \Phi^\downarrow_{C''}(y'') $$

for all $y'' \in Y''$.

*Proof.* $C''^{-1}(y'') \subseteq C'^{-1}(\phi(y''))$ (a finer fibre is
contained in a coarser one). Therefore
$S^{C'}_{\phi(y'')} \supseteq S^{C''}_{y''}$. The GLB of a superset is
$\sqsubseteq$ the GLB of a subset:
$\bigsqcap S^{C'}_{\phi(y'')} \sqsubseteq \bigsqcap S^{C''}_{y''}$. Hence
$\Phi^\downarrow_{C'}(\phi(y'')) \sqsubseteq \Phi^\downarrow_{C''}(y'')$. ∎

*Interpretation.* A finer representation never gives a worse guarantee.
Concrete chain verified:
$$ \text{signs} \quad\sqsubseteq\quad \text{intervals} \quad\sqsubseteq\quad \text{octagons} $$
with $\Phi^\downarrow$ strictly improving (less conservative) at each step.

### 8. Composition theorem

**Theorem 10 (Compositionality).** Let $C = C_2 \circ C_1$. If all
intermediate fibre images have GLBs, then:

$$ \Phi^\downarrow_{C}(z) = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) $$

*Proof.*

$$ \Phi^\downarrow_C(z) = \bigsqcap\{\Phi(x) \mid C_2(C_1(x)) = z\} $$
$$ = \bigsqcap \bigcup_{y \in C_2^{-1}(z)} \{\Phi(x) \mid C_1(x) = y\} $$
$$ = \bigsqcap_{y \in C_2^{-1}(z)} \bigsqcap \{\Phi(x) \mid C_1(x) = y\} $$
$$ = \bigsqcap_{y \in C_2^{-1}(z)} \Phi^\downarrow_{C_1}(y) $$
$$ = (\Phi^\downarrow_{C_1})^\downarrow_{C_2}(z) $$

The critical step (line 2 to line 3) uses associativity of meets:
$\bigsqcap(\bigcup_i S_i) = \bigsqcap_i (\bigsqcap S_i)$, which holds when
all intermediate meets exist. ∎

**Corollary (Compositional gap).** When an intermediate fibre lacks a GLB,
the direct proxy $\Phi^\downarrow_C$ may still exist (the union fibre
"smoothes over" the gap), but the incremental computation fails. Recovery
requires completing the intermediate codomains.

---

## Part IV: Architecture

### The two-layer structure

```
                     Φ: X → L (full information)
                            |
                            |
                       contraction C
                            |
                            |
              ┌─────────────┴─────────────┐
              │                           │
         Exact preservation          Impossible/stale
              │                           │
        ┌─────┴─────┐             ┌───────┴────────┐
        │           │             │                │
   Equivalence  Pseudometric   Fibre GLB        No GLB
        │           │             │                │
   Theorem 4   Theorem 5      Proxy Φ^↓      Complete L
   (repair)    (boon only)       │             and retry
                                 │
                           ┌─────┴─────┐
                           │           │
                      Useful?      Collapsed?
                           │           │
                       Decision    Refine C
                                   (fallback to v1.0)
```

### Relationship between layers

| Aspect | v1.0 — Exact preservation | v1.1 — Conservative proxy |
|--------|--------------------------|---------------------------|
| Goal | Restore full preservation | Safe bound when restoration impossible |
| Mechanism | Refine $C$ (add distinctions) | Meet-over-fibre of $\Phi$ |
| Structure type | Equivalence (Thm 4), Pseudometric (Thm 5) | Any meet-complete poset |
| Result | $\sim_{C'} \subseteq \sim_\Phi$ | $\Phi^\downarrow \leq \Phi$ pointwise |
| When it applies | Refinement feasible | Refinement infeasible or insufficient |
| Failure mode | — | Collapse $\to$ refine $C$ (falls back to v1.0) |

---

## Part V: Verified instances

| Domain | Structure | Core mechanism | Proxy needed? | Proxy operation |
|--------|-----------|---------------|---------------|-----------------|
| HAA-001 | Equivalence | Theorem 4 (repair via action obs.) | No | — |
| Type erasure | Equivalence | Theorem 4 (repair via signature) | No | — |
| G2 | Pseudometric | Theorem 5 boon only | Yes | $\min$ over fibre (Hoeffding bound) |
| Lossy compression | Pseudometric | Theorem 5 boon only | Yes | $\min$ over fibre (PSNR bound) |
| Noisy sensor | Function boundary | Needs distribution lift | Yes | $\min$ over fibre (confidence) |
| Database views | Equivalence (sets) | Maximal refinement only | Yes | $\bigcap$ over fibre (certain answers) |
| Abstract interpretation | Lattice | Interval refinement | Yes | $\sqcap$ over fibre (safe approx.) |

---

## Part VI: Known boundaries

### B1. Non-meet-complete codomains

If $(L, \sqsubseteq)$ lacks GLBs for some fibre images, the proxy is
undefined. Resolution: meet-preserving completion (Dedekind, ideal).

### B2. Non-function morphisms

If $C: X \to Y$ is not a function (probabilistic, non-deterministic,
context-dependent), the core requires a model lift: expand $X$ to include
random seeds, or use distribution codomain $\text{Dist}(Y)$.

### B3. Usefulness (operational emptiness)

When $\Phi$ varies orthogonally to $C$, the proxy collapses to $\bot$
uniformly across all fibres. The proxy exists, is safe, and is optimal,
but carries no operational information. Resolution: refine $C$
(fallback to v1.0 mechanism).

### B4. Non-preserving completion

Not every completion preserves the order structure. Adding a global bottom
$\bot$ to a poset changes existing GLBs and introduces artificial
conservatism. Only meet-preserving completions (Dedekind, ideal) are
admissible.

---

## Part VII: Falsification record

The extension was subjected to three deliberate falsification campaigns:

### Campaign 1: Structural asymmetry (Theorems 4 vs 5)

| Question | Result |
|----------|--------|
| Is Theorem 5 also a repair theorem? | **No** — it requires original preservation to hold |
| Can pseudometric refinement repair broken preservation? | **No** — the fibre condition (metric dominance) is strictly stronger |
| Is this structural or accidental? | **Structural** — categorical separation vs. quantitative dominance |

### Campaign 2: Conservative proxy hypotheses (H1–H4)

| Hyp | Claim | Result | What was learned |
|-----|-------|--------|-----------------|
| H1 | Fibre meet exists universally | **Falsified** | Requires meet-complete codomain (ℝ ✓, ℚ ✗) |
| H2 | Safety guarantee | **Theorem** | Follows from GLB as lower bound |
| H3 | Optimality | **Theorem** | Follows from GLB as **greatest** lower bound |
| H4 | Usefulness | **Conditional** | Collapse signals refinement need, not proxy failure |

### Campaign 3: Completion and composition

| Question | Result |
|----------|--------|
| Does completion recover the proxy? | **Yes** — meet-preserving completions never worsen it |
| Can completion create operational emptiness? | **No** — emptiness is structural (B3), not completion-induced |
| Does $\Phi^\downarrow$ compose? | **Yes** — when intermediate GLBs exist |
| What if intermediate GLBs fail? | **Compositional gap** — direct proxy may exist, incremental fails; completion recovers |

### Survivors

After all three campaigns, the following withstood falsification:

1. The fibre meet condition (single necessary condition for proxy existence)
2. Safety (Theorem 6)
3. Optimality (Theorem 8)
4. Refinement monotonicity (Theorem 9)
5. Compositionality under intermediate GLBs (Theorem 10)
6. Completion principle (meet-preserving completion recovers proxy)

---

## Part VIII: Open questions

1. **Proxy distance.** Each domain has its own notion of "proxy loss"
   (Hoeffding bound, PSNR gap, certain answer gap, abstract precision).
   Is there a general measure of distance between $\Phi^\downarrow$ and
   $\Phi$ across the fibres?

2. **Dual proxy.** When does the upper envelope (join over fibre) give a
   useful optimistic bound? This would be the mirror: the least unsafe
   upper bound.

3. **Non-poset codomains.** The extension assumes $(L, \sqsubseteq)$ is a
   poset. Generalization to preorders (Axiom 2) is direct: the GLB is
   unique up to equivalence, and all theorems hold.

4. **Threshold decisions.** For safety with threshold $\theta$, the proxy
   decision is $\Phi^\downarrow(y) \leq \theta \implies$ "cannot guarantee
   safety." The relationship between GLB comparison and decision quality
   is not formalized.
