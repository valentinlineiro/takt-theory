# G2 Mapping: Falsifying the Generality Hypothesis

**Protocol:** Apply the core theory to G2 without modifying axioms or introducing new fundamental concepts. Record result: success, partial, or failure.

---

## 1. Mechanical mapping

| Element of G2 | Element of the core | Notes |
|--------------|---------------------|-------|
| Domain $X$ | True models $P^*$ paired with observation history $H$ | $X = \{(P^*, H)\}$ |
| Morphism $\mathcal{C}$ | Estimation process: $\hat{P} = \text{est}(P^*, H)$ | Contraction: non-injective (different $P^*$ produce same $\hat{P}$) |
| Property $\Phi$ | True margin safety: $\Phi(P^*) = 1$ if $M_D(P^*) - \beta > \theta$, else $0$ | Depends on unknown $P^*$ |
| Structure type | Pseudometric $\mathcal{T}_d$ | $d_{\hat{P}}(\hat{P}_1, \hat{P}_2) = \|\hat{P}_1 - \hat{P}_2\|_1$ (L1) |
| Preservation relation $\preceq$ | Lipschitz domination $\leq_k$ | $d_\Phi \leq k \cdot d_{\hat{P}}$ |
| Refinement | $(\mathcal{C}', \phi)$ where $\mathcal{C}'(P^*, H) = (\hat{P}, \varepsilon(H))$, $\phi(\hat{P}, \varepsilon) = \hat{P}$ | Adds uncertainty $\varepsilon$ |

**Verification of factorization:** $\mathcal{C} = \phi \circ \mathcal{C}'$ holds: $\phi(\mathcal{C}'(P^*, H)) = \phi(\hat{P}, \varepsilon) = \hat{P} = \mathcal{C}(P^*, H)$. ✓

---

## 2. Execution of the procedure

### Step 1: Preservation failure

**Does $\mathcal{C}$ preserve $\Phi$?** No. The point estimate $\hat{P}$ alone does not determine whether the true margin is safe. A single $\hat{P}$ can arise from very different $P^*$ (e.g., $\hat{P}_{\text{fail}} = 0.3$ could mean $P^*_{\text{fail}} = 0.3$ exactly, or $P^*_{\text{fail}} = 0.6$ with insufficient data).

*Sign of failure:* $M_D(\hat{P}) > \theta$ but $M_D(P^*) \leq \theta$ for some $(P^*, H)$ in the same fibre.

### Step 2: Identify problematic fibres

**Fibre:** $\mathcal{C}^{-1}(\hat{P}) = \{(P^*, H) \mid \text{est}(P^*, H) = \hat{P}\}$.

A fibre is problematic when it contains both $\Phi$-safe and $\Phi$-unsafe true models. This happens whenever the amount of observation data $|H|$ is small: with limited data, many $P^*$ are compatible with the same $\hat{P}$.

The problematic region is not a single fibre but a family of fibres indexed by data sparsity. This is typical of the pseudometric case: the problem is quantitative (how much uncertainty remains) rather than categorical (which fibre).

### Step 3: Propose refinement

**Refinement:** $\mathcal{C}'(P^*, H) = (\hat{P}, \varepsilon(H))$, where $\varepsilon(H)$ encodes the residual uncertainty given the data (e.g., $\varepsilon(s,a) = \varepsilon_0 / \sqrt{n(s,a)}$).

**Factorisation:** $\mathcal{C} = \phi \circ \mathcal{C}'$ with $\phi(\hat{P}, \varepsilon) = \hat{P}$. ✓

**How this separates within the fibre:** Two pairs $(P^*_1, H_1)$ and $(P^*_2, H_2)$ with the same $\hat{P}$ may have different $\varepsilon$ if they have different amounts of data. $\mathcal{C}'$ distinguishes them where $\mathcal{C}$ could not.

### Step 4: Verify preservation

**Preservation under $\mathcal{C}'$:** With the refined morphism, use the robust margin $M_D^{\text{safe}} = M_D(\hat{P}) - \beta(\varepsilon)$, where $\beta$ is derived from $\varepsilon$. The guarantee is:

$$ M_D(P^*) \geq M_D(\hat{P}) - \beta(\varepsilon) $$

i.e., the true margin is at least as large as the robust margin minus the estimation error bound.

**Core theory form (Theorem 5):** $d_\Phi \leq k \cdot d_{\mathcal{C}'}$ holds when:
1. Within each fibre: the worst-case margin error is bounded by $\beta(\varepsilon)$
2. Interfibre compatibility: $\phi$ is 1-Lipschitz (the projection $(\hat{P}, \varepsilon) \mapsto \hat{P}$ is trivially 1-Lipschitz for L1 on $\hat{P}$)

**In practice:** $M_D^{\text{safe}}(\hat{P}, \varepsilon) = \min_{P^* \in U_t} M_D(P^*)$ where $U_t = \{P^* \mid \|P^* - \hat{P}\|_1 \leq \varepsilon\}$. This is the robust margin computed by `RobustMarginEstimator`.

---

## 3. Result

**Verdict:** SUCCESS (partial — the pseudometric case already documented in the core)

### What worked

1. The core's 4-step procedure maps directly without modification. ✓
2. The refinement factorisation $\mathcal{C} = \phi \circ \mathcal{C}'$ holds. ✓
3. The fibre analysis identifies the correct locus of action (data-sparse regions). ✓
4. The refinement adds information that separates within the fibre (uncertainty bound). ✓
5. Preservation is achieved via the mechanism the core predicts (bounding the metric). ✓

### What required existing core flexibility

- The pseudometric case (Theorem 5 in the core) was already documented as requiring interfibre compatibility beyond what the equivalence case needs.
- This is not a modification to the core — it's using its existing machinery for a non-equivalence structure type.

### What this confirms

| Claim | Status |
|-------|--------|
| G2 can be described using the core | ✓ |
| The 4-step procedure applies without modification | ✓ |
| The fibre analysis identifies the correct locus of action | ✓ |
| The refinement mechanism matches the core's definition | ✓ |
| Preservation is achieved as the core predicts | ✓ |
| No new axioms or fundamental concepts required | ✓ |

### Evidence Index contribution

| Domain | Core sufficient | Result |
|--------|----------------|--------|
| G3 (HAA-001) | Yes | ✓ |
| **G2 (estimation uncertainty)** | **Yes** | **✓** |
| External (pending) | ? | ? |

**Current EI:** 2/2 = 1.0

---

## 4. Key insight: categorical vs. quantitative within the same procedure

The G2 mapping reveals that the core procedure works for both:
- **Categorical separation** (HAA-001): add a new observable (action) that distinguishes elements within the fibre
- **Quantitative bounding** (G2): add an uncertainty bound that accounts for the worst case within the fibre

Both are instances of refinement $\mathcal{C} = \phi \circ \mathcal{C}'$ where $\mathcal{C}'$ adds fibre-separating information. The difference is in the structure type (equivalence vs. pseudometric), not in the procedure.
