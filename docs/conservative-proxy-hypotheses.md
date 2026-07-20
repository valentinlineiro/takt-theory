# Conservative Proxy Extension — Hypotheses Under Falsification

**Status:** Falsification cycle complete (2026-07-20). Results:
- H1: **Falsifiable** — fails for non-meet-complete codomains (ℚ). Holds for ℝ, powersets, finite lattices.
- H2: **Unfalsifiable (theorem)** — follows from definition of GLB as lower bound.
- H3: **Unfalsifiable (theorem)** — follows from definition of GLB as greatest lower bound.
- H4: **Conditional** — not a theorem. Collapse signals need for refinement, not proxy failure.

**Core claim surviving falsification:** The conservative proxy requires
exactly one condition: for each $y \in Y$, the set
$\{\Phi(x) \mid C(x) = y\}$ has a GLB in $(L, \sqsubseteq)$.
When this holds, existence (H1), safety (H2), and optimality (H3) follow.
Usefulness (H4) is contextual.

---

## H1 — Existence of the fibre meet

For every morphism $C: X \to Y$ and every property $\Phi: X \to L$ where
$(L, \sqsubseteq)$ has meets of arbitrary subsets:

$$ \Phi^\downarrow(y) = \bigsqcap_{x \in C^{-1}(y)} \Phi(x) $$

exists for every $y \in Y$.

**Falsify by:** Finding a subset $\{\Phi(x) \mid C(x) = y\}$ that lacks
a greatest lower bound in $(L, \sqsubseteq)$.

---

## H2 — Safety guarantee

For every $x \in X$ with $C(x) = y$:

$$ \Phi^\downarrow(y) \sqsubseteq \Phi(x) $$

(Read: the proxy is a lower bound — it is never less conservative than the
true value.)

**Falsify by:** Finding $x$ where $\Phi^\downarrow(C(x)) \not\sqsubseteq \Phi(x)$,
i.e., the proxy reports "safe" when the true value is "unsafe."

---

## H3 — Optimality

There is no other proxy $\Psi: Y \to L$ such that $C$ preserves $\Psi$ and:

$$ \Phi^\downarrow(y) \sqsubset \Psi(y) \sqsubseteq \Phi(x) $$

for all $x \in C^{-1}(y)$.

("$\Phi^\downarrow$ is the greatest property that $C$ preserves and that is
a safe lower bound for $\Phi$.")

**Falsify by:** Finding $\Psi$ strictly between $\Phi^\downarrow$ and $\Phi$
that $C$ also preserves.

---

## H4 — Usefulness (operational)

Whenever $C^{-1}(y)$ contains at least two elements with distinct $\Phi$
values, and $y$ is reachable, $\Phi^\downarrow(y)$ is not the global minimum
of $\Phi$ over all of $X$.

**Falsify by:** Finding $C$ and $\Phi$ where every non-trivial fibre meet
collapses to $\bot$ (the global minimum), making the proxy useless.

---

## Dependencies

```
H1 (existence of meet)
  |
  ├── H2 (safety) ── requires H1
  ├── H3 (optimality) ── requires H1, H2
  └── H4 (usefulness) ── requires H1
```

H1 is the foundation. If H1 fails in a natural setting, the entire extension
needs a weaker existence condition.

---

## Mathematical families — verified and failed

| Family | $L$ | H1 | Notes |
|--------|-----|----|-------|
| ℝ with ≤ | $\mathbb{R}$ | ✓ | Bounded-below subsets have infima |
| ℚ with ≤ | $\mathbb{Q}$ | **✗** | Decreasing to $\sqrt{2}$ has no rational GLB |
| Powerset $\mathcal{P}(U)$ with ⊆ | $\mathcal{P}(U)$ | ✓ | Arbitrary intersections exist |
| Finite lattice | $A$ | ✓ | Finite subsets have meets |
| Complete lattice | $A$ | ✓ | All subsets have meets |
| Non-complete poset | $L$ | ? | Check fibre subset — may fail |
| Lexicographic $A \times B$ | $A \times B$ | ? | Holds if component orders are meet-complete |
| Reverse order $\mathbb{R}$ with ≥ | $\mathbb{R}$ | ✓ | $\max$ is the meet; direction is conservative only if larger = safer |

---

## Falsification results (see `session/falsification-experiments.md`)

| Experiment | Target | Result | What it revealed |
|-----------|--------|--------|-----------------|
| A | H1 — ∃ meet in ℚ | **Falsified** | ℚ fails; need fibre-image GLB condition |
| B | H4 — useful | **Conditional** | Collapses when Φ varies orthogonally to C; signals refinement need |
| C | H3 — optimal | **Unfalsifiable** | Optimality = definition of GLB; no counterexample possible |
