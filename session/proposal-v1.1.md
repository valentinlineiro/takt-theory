# Structural Preservation Theory v1.1 — Proposal

**Status:** Research proposal (not merged into canonical core)
**Basis:** 5 independent domain tests across 3 mathematical families

---

## 1. Findings since v1.0

### Finding A: Refinement asymmetry

Theorem 4 (equivalence) and Theorem 5 (pseudometric) are not symmetric:

| Theorem | Type | What it shows |
|---------|------|--------------|
| 4 | Equivalence | Refinement CAN repair broken preservation (fibre-separating condition) |
| 5 | Pseudometric | Refinement ONLY preserves already-holding preservation (boon, not repair) |

**Implication:** The fibre decomposition of Section 7 is not uniform across
structure types. Equivalence admits within-fibre repair; pseudometric requires
the original preservation to already hold. This is structural, not accidental.

**Documented in:** `session/findings-refinement-asymmetry.md`

### Finding B: The meet-over-fibre (conservative proxy)

When refinement cannot restore preservation, a second mechanism exists:
replace $\Phi$ with its **meet over the fibre** of $C'$:

$$ \Phi_\downarrow(y') = \bigsqcap_{x \in C'^{-1}(y')} \Phi(x) $$

where $\sqcap$ is the meet (greatest lower bound) in the property's order.

**Properties:**
1. $\Phi_\downarrow \circ C' \preceq \Phi$ (conservative guarantee)
2. $C'$ preserves $\Phi_\downarrow$ (trivially: factors through $C'$)
3. The meet exists when the structure type has meet-complete preorders

**Appears in 5 independent domains across 3 families:**

| Family | Domain | Meet operation | Result |
|--------|--------|---------------|--------|
| Metric (ℝ, ≤) | G2 estimation | $\min$ | Conservative margin $\beta(\varepsilon)$ |
| Metric (ℝ, ≤) | Lossy compression | $\min$ | Quality lower bound |
| Metric (ℝ, ≤) | Noisy sensor | $\min$ | Confidence interval |
| Set ($\mathcal{P}(U)$, ⊆) | Database views | $\bigcap$ | Certain answers |
| Lattice ($A$, ⊑) | Abstract interpretation | $\sqcap$ | Safe approximation |

**Documented in:** `session/proxy-database-projections.md`,
`session/proxy-abstract-interpretation.md`

### Finding C: Scope delimitation

The core requires $C: X \to Y$ to be a function. Probabilistic or
non-deterministic morphisms require a model lift (seed expansion or
distribution codomain) before the core applies — a genuine boundary,
not a contradiction.

**Documented in:** `session/counterexample-non-functional-morphism.md`

---

## 2. Proposed v1.1 extension

### New definition: meet-over-fibre operator

Given a refinement $C'$ of $C$ and a property $\Phi: X \to (Z, \sqsubseteq)$
where $(Z, \sqsubseteq)$ is a meet-complete preorder:

$$ \Phi_{C'}^\downarrow(y') = \bigsqcap_{x \in C'^{-1}(y')} \Phi(x) $$

### Candidate theorem: conservative proxy

If $(Z, \sqsubseteq)$ is meet-complete and $\Phi_{C'}^\downarrow$ exists
for all $y' \in Y'$, then:

1. **Preservation:** $C'$ preserves $\Phi_{C'}^\downarrow$ with respect to
   the discrete equivalence on $Y'$.
2. **Guarantee:** $\Phi_{C'}^\downarrow \circ C' \sqsubseteq \Phi$
   pointwise on $X$.
3. **Optimality:** $\Phi_{C'}^\downarrow$ is the greatest (least
   conservative) property that $C'$ preserves and that is $\sqsubseteq$
   below $\Phi$.

### Conditions for usefulness

The proxy is **useful** (does not collapse to $\bot$/$\top$) when:

- $C'$ is sufficiently refined that the fibre meet is not the global meet
- $\Phi$ varies meaningfully across fibres (non-constant)
- The meet-completeness condition is not trivially satisfied by a single
  element (e.g., $\top$ only)

### Relationship to existing theorems

- When Theorem 4 applies (equivalence, fibre separability): refinement
  suffices, proxy not needed.
- When Theorem 5 applies (pseudometric, boon): proxy is an alternative when
  the fibre condition (within-fibre metric dominance) cannot be met.
- When neither applies: proxy is the fallback.

---

## 3. Open questions for v1.1

1. **Meet existence.** Which structure types guarantee meet-complete
   preorders? All examples so far (ℝ with ≤, powerset with ⊆, finite
   lattices with ⊑) are meet-complete. Is this always the case for
   the structure types listed in Appendix A?

2. **Guarantee direction.** The proxy gives a guarantee in one direction
   ($\Phi_\downarrow \preceq \Phi$). When does the dual
   ($\Phi^\uparrow(y') = \bigsqcup_{x \in C'^{-1}(y')} \Phi(x)$) give
   a useful upper bound? (G2's dual would be the optimistic margin, used
   for upper-bound risk analysis.)

3. **Compositionality.** If $C''$ refines $C'$, how do the proxies relate?
   Is $\Phi_{C''}^\downarrow \preceq \Phi_{C'}^\downarrow$ (finer refinement
   = less conservative proxy)?

4. **Distance from optimal.** How to measure the "cost" of the proxy —
   how much conservatism does it introduce? For G2, the cost is
   $\beta(\varepsilon)$. For databases, the cost is the gap between
   certain and true answers. Is there a general measure?

5. **v1.0 compatibility.** Does the proxy extension contradict any existing
   theorem? (It should not — it addresses cases the existing theorems
   explicitly leave open, per Section 8.3.)

---

## 4. Not proposed for v1.1

- Changes to Axiom 1 (pullback) or Axiom 2 (preorder) — both intact.
- Non-deterministic morphisms — left as scope boundary.
- New structure types — leave as Appendix A.
- Replacement of Theorem 4 or 5 — they remain correct for their domains.

---

## 5. Mapping

The v1.1 proposal is at the **right level**: it captures a regularity
observed across structurally distinct domains without overgeneralizing.
Its conditions (meet-complete preorder, compatible guarantee direction)
explicitly bound its applicability.

Next step: test whether conditions can be weakened (e.g., does the
proxy exist for non-meet-complete preorders, using alternative
envelope constructions?).
