# Conservative Proxy in Abstract Interpretation (Lattice Domain)

**Falsifying question:** Does the meet-over-fibre produce a useful analysis
or collapse to ⊥/⊤?

---

## Mapping

| Core element | Instance |
|-------------|----------|
| Domain $X$ | Concrete program states (e.g., variable values $x \in \mathbb{Z}$) |
| Morphism $C$ | Abstraction $\alpha: \text{Concrete} \to \text{Abstract lattice}$ (e.g., sign abstraction $\text{sgn}(x) \in \{\bot, -, 0, +, \top\}$) |
| Codomain $Y$ | Abstract lattice $A$ (with concretization $\gamma: A \to \mathcal{P}(\text{Concrete})$) |
| Property $\Phi$ | "Variable $x$ does not overflow 32-bit signed integer": $\Phi(c) \in \{\text{safe}, \text{unsafe}\}$ |
| Structure type | Preorder on $\{\text{safe}, \text{unsafe}\}$ with $\text{unsafe} \sqsubseteq \text{safe}$ (conservative order) |
| Preservation | $C(c_1) = C(c_2) \implies \Phi(c_1) = \Phi(c_2)$ |

---

## Step 1: Preservation failure

$C(c_1) = C(c_2) = +$ (sign positive) but $c_1 = 5$ (safe) and $c_2 = 2^{31}$
(overflow). Same abstraction, different $\Phi$. Preservation fails.

## Step 2: Fibres

$C^{-1}(a) = \gamma(a)$ — all concrete states that abstract to $a$ (the
concretization). In abstract interpretation terms: the fibre IS the
concretization function.

## Step 3: Conservative proxy (meet over fibre)

$$ \Phi_\downarrow(a) = \bigsqcap_{c \in \gamma(a)} \Phi(c) $$

For the safety lattice $\{\text{unsafe} \sqsubseteq \text{safe}\}$:
$\sqcap = \min$ in this order (unsafe = 0, safe = 1).

| Abstract state | $\gamma(a)$ contains | $\Phi_\downarrow(a)$ |
|--------------|-------------------|-------------------|
| $\bot$ | Empty set | $\text{safe}$ (vacuously) |
| $-$ | All negative ints | $\text{unsafe}$ ($-2^{31}$ overflows) |
| $0$ | $\{0\}$ | $\text{safe}$ |
| $+$ | All positive ints | $\text{unsafe}$ ($2^{31}$ overflows) |
| $\top$ | All ints | $\text{unsafe}$ |

**Useful**: The proxy correctly identifies that sign abstraction is
insufficient for overflow detection. It does NOT collapse to ⊥/⊤ — it
gives granular information ($0$ is safely distinguishable as safe, while
$+$ and $-$ are not). This guides the refinement choice.

## Step 4: Refinement (interval abstraction)

Replace $C$ (signs) with $C'$ (intervals $[l, r]$ with $l \leq r$):
$$ C'(c) = [c, c] $$
Factorisation: $\phi([l, r]) = \text{sgn}([l, r])$ (sign of the interval bound)
$$ C = \phi \circ C' $$

Now $\Phi_\downarrow$ under $C'$:
$$ \Phi_\downarrow([l, r]) = \text{safe iff } l \geq -2^{31} \text{ and } r \leq 2^{31}-1 $$

This is the **standard interval analysis** for overflow detection. It is
useful (does not collapse) and matches existing practice exactly.

---

## Result: pattern confirmed at lattice level

| Aspect | Abstract interpretation |
|--------|----------------------|
| Structure type | Lattice (not metric, not set) |
| Proxy operation | Meet ($\sqcap$) in the safety lattice |
| Useful analysis? | Yes — guides refinement choice |
| Collapses to ⊥/⊤? | No — granular per abstract element |
| Matches existing practice? | Yes — standard abstract interpretation |

**The meet-over-fibre pattern now appears across 3 mathematical families:**

| Family | Example | Meet operation |
|--------|---------|---------------|
| Metric (ℝ, ≤) | G2, compression, sensor | $\min$ |
| Set ($\mathcal{P}(U)$, ⊆) | Database views | $\bigcap$ |
| **Lattice ($A$, ⊑)** | **Abstract interpretation** | **$\sqcap$** |

---

## Updated Evidence

| Domain | Structure | Core sufficient? | Proxy pattern? |
|--------|-----------|----------------|----------------|
| HAA-001 | Equivalence | SUCCESS | Not needed |
| Type erasure | Equivalence | SUCCESS | Not needed |
| G2 | Pseudometric | PARTIAL | ✓ (min) |
| Lossy compression | Pseudometric | PARTIAL | ✓ (min) |
| Noisy sensor | Scope boundary | PARTIAL | ✓ (min) |
| Database views | Equivalence (sets) | PARTIAL | ✓ (∩) |
| **Abstract interpretation** | **Lattice** | **PARTIAL** | **✓ (⊓)** |

**5 proxy instances across 3 mathematical families.** The pattern is not an
artifact of metrics or of any single structure type.

The meet-over-fibre construction:

$$ \Phi_\downarrow(C'(x)) = \bigsqcap_{x' \in C'^{-1}(C'(x))} \Phi(x') $$

is a candidate for a general theorem — provided the structure type has
meet-complete preorders and the meet direction is compatible with the
conservative guarantee.
