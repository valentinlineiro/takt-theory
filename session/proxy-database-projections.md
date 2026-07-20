# Conservative Proxy Outside Pseudometrics: Database Certain Answers

**Question:** Does the conservative proxy (lower envelope over fibres) appear
in a **non-pseudometric** domain? If so, the pattern is not specific to
metrics and is a stronger candidate for a general principle.

---

## Database projections (equivalence case)

| Core element | Instance |
|-------------|----------|
| Domain $X$ | Full database (all tables, all columns, all rows) |
| Morphism $C$ | SQL projection: $C(db) = \pi_{\text{cols}}(db)$ (keep only specified columns) |
| Codomain $Y$ | Projected view (subset of columns) |
| Property $\Phi$ | True answer to query $Q$: $\Phi(db) = Q(db) \subseteq \text{Universe}$ (set of tuples) |
| Structure type | Set inclusion $\subseteq$ on $\mathcal{P}(\text{Universe})$ |
| Preservation | $\sim_C \subseteq \sim_\Phi$: if $C(db_1) = C(db_2)$ then $Q(db_1) = Q(db_2)$ |

Note: $\Phi$ is set-valued (the query result). The discrete equivalence on
$\mathcal{P}(\text{Universe})$ treats two results as "the same" iff they
are identical sets.

### Step 1: Preservation failure

$C(db_1) = C(db_2)$ means the projected columns match in both databases.
But $db_1$ and $db_2$ can differ in the non-projected columns, and $Q$
might reference those columns. So $\Phi(db_1) \neq \Phi(db_2)$ is possible
even when $C(db_1) = C(db_2)$. Preservation fails.

### Step 2: Fibres

$C^{-1}(v) = \{db \mid \pi_{\text{cols}}(db) = v\}$.
All full databases consistent with the projected view $v$.

### Step 3: Conservative proxy (lower envelope)

The standard database-theoretic solution is **certain answers**:

$$ \Phi_{\text{certain}}(v) = \bigcap_{db \in C^{-1}(v)} Q(db) $$

This is the **lower envelope over the fibre**, using set intersection ($\cap$)
as the "min" operation for the inclusion order ($\subseteq$).

**Properties:**
1. $\Phi_{\text{certain}} \circ C \subseteq \Phi$: certain answer ⊆ true answer
   (the guarantee direction: if a tuple is certain, it's in the true answer)
2. $C$ preserves $\Phi_{\text{certain}}$: $\Phi_{\text{certain}}(v)$ depends
   only on $v$, not on which $db$ produced it (trivially, it's defined by
   the fibre)
3. $\sim_C \subseteq \sim_{\Phi_{\text{certain}}}$ holds by construction

**This is exactly the same pattern as G2, in a different structure type.**

---

## Comparison across all four proxy instances

| Domain | Structure type | Original $\Phi$ | Proxy operation | Guarantee direction |
|--------|---------------|-----------------|-----------------|-------------------|
| G2 | Pseudometric (ℝ) | True margin $M_D(P^*)$ | $\min$ over fibre (Hoeffding bound) | Proxy ≤ true (safe) |
| Lossy compression | Pseudometric (ℝ) | PSNR | $\min$ over fibre | Proxy ≤ true |
| Noisy sensor | Pseudometric (ℝ) | True temperature | $\min$ over fibre (confidence bound) | Proxy ≤ true (safe) |
| **Database views** | **Equivalence (sets)** | **Query result $Q(db)$** | **$\bigcap$ over fibre (certain answer)** | **Proxy ⊆ true** |

### The unifying principle

In all four cases:

$$ \Phi_{\text{safe}}(C'(x)) = \bigsqcup_{x' \in C'^{-1}(C'(x))} \Phi(x') $$

where $\bigsqcup$ is the **meet** (greatest lower bound) in the structure
type's order:

- ℝ with ≤: meet = $\min$
- $\mathcal{P}(U)$ with $\subseteq$: meet = $\bigcap$

The proxy is the **meet over the fibre**.

---

## Implication

The conservative proxy pattern is **not specific to pseudometrics**. It
appears with the same structure in the equivalence case (database
projections), using the meet of the structure's order as the envelope
operation.

This means:

1. The pattern is structural, not contingent on metric properties
2. The meet-over-fibre construction generalizes to any structure type
   with an order (preorder) that has meets
3. The core's open question about "what happens when preservation can't be
   restored" has a partial answer: replace $\Phi$ with its fibre meet

---

## Evidence Index

| Domain | Structure | Core-mechanism result | Proxy present? |
|--------|-----------|----------------------|----------------|
| HAA-001 | Equivalence | SUCCESS (repair via refinement) | No (refinement sufficed) |
| Type erasure | Equivalence | SUCCESS (repair via refinement) | No (refinement sufficed) |
| G2 | Pseudometric | PARTIAL (boon only) | **Yes** |
| Lossy compression | Pseudometric | PARTIAL (boon only) | **Yes** |
| Noisy sensor | Scope boundary | PARTIAL (needs lifting) | **Yes** |
| **Database views** | **Equivalence** | **PARTIAL (if refinement insufficient)** | **Yes** |

**Conservative proxy appearances:** 4 independent domains across 2 structure
types. The user's threshold for formalization consideration is met — the
pattern is not an artifact of metrics.

*Note: Database projections are listed as PARTIAL because the refinement
solution (add all missing columns to the projection) is the maximal
refinement, not a practical solution. The practical solution IS the proxy
(certain answers).*
