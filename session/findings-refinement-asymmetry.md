# Finding: Refinement Asymmetry — Equivalence Repairable, Pseudometric Not

## Discovery path

While reviewing the mechanical mapping through the fourth domain (lossy
compression), I re-examined the G2 analysis and found a logical error in the
application of Theorem 5. The correction reveals a **structural asymmetry**
between the equivalence and pseudometric refinement theorems.

---

## The error

The G2 mapping claimed Theorem 5 (pseudometric preservation) applied. It does
not. Theorem 5 requires preservation of the original property to already hold:

> If preservation $d_\Phi \leq k \cdot d_{\mathcal{C}}$ held, transitivity
> would give $d_\Phi \leq k \cdot d_{\mathcal{C}'}$. However, this is an
> additional hypothesis; without it, condition 2 alone does not guarantee
> global preservation.

The theorem is a **boon theorem** (refinement preserves existing preservation)
not a **repair theorem** (refinement restores broken preservation). For G2,
$d_\Phi \not\leq k \cdot d_{\mathcal{C}}$ (the whole problem), so Theorem 5
does not apply.

The same issue affects the lossy compression mapping: it also needs
preservation to already hold.

---

## The asymmetry

### Equivalence case (Theorem 4)

**Repairable.** The condition is: within each $\mathcal{C}$-fibre,
$\mathcal{C}'$ separates every pair that $\Phi$ separates. This is achievable
by adding any information that correlates with $\Phi$:

| Domain | $\Phi$ | Refinement $\mathcal{C}'$ adds | Works? |
|--------|--------|-------------------------------|--------|
| HAA-001 | Margin > threshold | Action observation | ✓ |
| Type erasure | Generic type $T$ used | Type signature metadata | ✓ |

**Why it works:** Equivalence only cares about whether two elements are
*distinct* under $\Phi$. Any refinement that makes $\mathcal{C}'$-fibres
smaller than $\Phi$-distinct equivalence classes suffices.

### Pseudometric case (Theorem 5)

**Not repairable** (via the core alone). The condition is: within each
$\mathcal{C}$-fibre, $d_\Phi \leq k \cdot d_{\mathcal{C}'}$. This requires
that $\mathcal{C}'$ encodes a metric that dominates the $\Phi$-metric.

For G2: $\Phi$ depends on $P^*$ (true model), which is not encoded in
$\mathcal{C}'(M) = (\hat{P}, \varepsilon)$. Two models with the same
$(\hat{P}, \varepsilon)$ can have different $M_D(P^*)$, giving $d_\Phi > 0$
when $d_{\mathcal{C}'} = 0$ within the $(\hat{P}, \varepsilon)$ subfibre.

**Why it fails:** Metrics require quantitative dominance, not just
categorical separation. Adding a discrete piece of information (like an
action category or a type name) cannot bound a continuous metric difference.

---

## What happens instead: the conservative proxy pattern

G2 doesn't use the core's refinement to restore preservation. It uses a
different strategy: **replace $\Phi$ with a conservative proxy**.

Let $\Phi : X \to \mathbb{R}$ be the original (non-preservable) property.
Define $\Phi' : Y' \to \mathbb{R}$ as the lower envelope over fibres:

$$ \Phi'(y') = \min_{x \in \mathcal{C}'^{-1}(y')} \Phi(x) $$

Then:
1. $\Phi' \circ \mathcal{C}' \leq \Phi$ pointwise on $X$ (conservative bound)
2. $\mathcal{C}'$ preserves $\Phi'$ (trivially — it factors through
   $\mathcal{C}'$ by construction)
3. If $\Phi'( \mathcal{C}'(x) ) > \theta$, then $\Phi(x) > \theta$ for all
   $x$ (safety guarantee)

### Real form in G2

$$ \Phi'( \hat{P}, \varepsilon ) = M_D(\hat{P}) - \beta(\varepsilon) $$

The Hoeffding bound $\beta(\varepsilon)$ gives the minimum margin within
the $(\hat{P}, \varepsilon)$ subfibre. The safe margin is the lower envelope.
This is not the core's refinement mechanism — it's a different pattern:
**property replacement, not morphism refinement**.

### In lossy compression

For JPEG with property PSNR > threshold $t$:

$$ \Phi'(j, h) = \text{PSNR lower bound from JPEG bitstream } j \text{ and descriptor } h $$

This lower bound can only be guaranteed with the maximal refinement
($h$ = original image hash). Practical refinements (thumbnail, SSIM)
don't bound PSNR tightly — they give heuristic estimates without worst-case
guarantees.

---

## Corrected results

| Domain | Structure | Claimed | Corrected | Why |
|--------|-----------|---------|-----------|-----|
| HAA-001 | Equivalence | SUCCESS | SUCCESS | Theorem 4: repairable by adding action observation |
| G2 | Pseudometric | SUCCESS | **PARTIAL** | Theorem 5 doesn't apply; solution requires conservative proxy (external to core) |
| Type erasure | Equivalence | SUCCESS | SUCCESS | Theorem 4: repairable by adding type signature metadata |
| Lossy compression | Pseudometric | SUCCESS | **PARTIAL** | Same as G2; only maximal refinement works |

**Evidence Index (strict):** domains where core alone solves the problem:
2/4 = 0.5

**Evidence Index (analysis):** domains where core correctly describes the
situation: 4/4 = 1.0

Both measures are legitimate. The first measures the core's power as a
standalone solution. The second measures its power as an analytical
framework.

---

## What this means for the theory

### The core correctly identifies its own limits

The core's Section 8 says "Not every preservation failure is repairable."
G2 and compression confirm this prediction. The core's analysis framework
correctly identifies when refinement works (equivalence) and when it doesn't
(pseudometric without original preservation).

### Gap revealed

The conservative proxy pattern ($\Phi'$ derived from $\Phi$ by lower/upper
envelope over fibres) is **not in the core**. It is:

1. Related to the core (it uses fibre structure)
2. Not derivable from the core (it requires a new operation: envelope
   construction)
3. Practically necessary for the pseudometric case

This suggests a natural extension: **envelope theorems** that give conditions
under which a property $\Phi$ can be replaced by an envelope
$\Phi'(x) = f(\Phi(\mathcal{C}'^{-1}(\mathcal{C}'(x))))$ that $\mathcal{C}'$
preserves, with a known approximation guarantee.

### Todo

- [ ] Add this finding to the core's open questions (Section 8)
- [ ] Formalize the conservative proxy pattern as a potential theorem
- [ ] Check if this pattern recurs in new domains
