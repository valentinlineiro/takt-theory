# External Domain 2: Lossy Compression (JPEG)

**Protocol:** Apply the core theory to a second external domain — this time with a **metric property** (pseudometric case, Theorem 5). Record result: success, partial, or failure.

---

## 1. Mechanical mapping

| Element | Instance | Notes |
|---------|----------|-------|
| Domain $X$ | Original images (bitmap pixel arrays) | |
| Codomain $Y$ | JPEG bitstreams | Compressed, lossy representation |
| Morphism $\mathcal{C}$ | JPEG encode at quality $q$: $\mathcal{C}(\text{img}) = \text{JPEG}_q(\text{img})$ | Non-injective: quantization maps many originals to the same DCT coefficients |
| Property $\Phi$ | $\Phi(\text{img}) = \text{PSNR}(\text{img}, \text{decompress}(\mathcal{C}(\text{img})))$ | Peak signal-to-noise ratio between original and its compressed-then-decompressed reconstruction |
| Structure type | Pseudometric $\mathcal{T}_d$ on $\mathbb{R}$ (Euclidean) | $\Phi$ is real-valued; $d_\Phi(\text{img}_1, \text{img}_2) = |\Phi(\text{img}_1) - \Phi(\text{img}_2)|$ |
| Preservation $\preceq$ | Lipschitz domination $\leq_k$ | $d_\Phi \leq k \cdot d_{\mathcal{C}}$ |
| Refinement | $(\mathcal{C}', \phi)$ where $\mathcal{C}'(\text{img}) = (\text{JPEG}_q(\text{img}), h(\text{img}))$, $\phi(j, h) = j$ | $h(\text{img})$ = image hash or quality descriptor (e.g., SSIM, feature embedding) |

**Verification of factorization:** $\mathcal{C} = \phi \circ \mathcal{C}'$ holds: $\phi(\mathcal{C}'(\text{img})) = \phi(\text{JPEG}_q(\text{img}), h(\text{img})) = \text{JPEG}_q(\text{img}) = \mathcal{C}(\text{img})$. ✓

---

## 2. Execution of the procedure

### Step 1: Preservation failure

**Does $\mathcal{C}$ preserve $\Phi$?** Not necessarily. Two distinct originals $\text{img}_1, \text{img}_2$ that encode to the same JPEG bitstream (because quantization maps their DCT differences to the same quantized coefficients) may have different $\Phi$ values.

The fibre $\mathcal{C}^{-1}(j)$ contains all originals that quantize to $j$. Within this fibre:
- $\Phi(\text{img})$ = PSNR of img vs its JPEG reconstruction
- Images that were closer to the JPEG centroid before quantization will have higher PSNR; images that were at the edge of the quantization bin will have lower PSNR

Hence $d_\Phi(\text{img}_1, \text{img}_2) > 0$ even when $d_{\mathcal{C}}(\text{img}_1, \text{img}_2) = 0$ (they share the same JPEG), so $d_\Phi \not\leq k \cdot d_{\mathcal{C}}$ for any finite $k$.

### Step 2: Identify problematic fibres

**Fibre:** $\mathcal{C}^{-1}(j) = \{\text{img} \in X \mid \text{JPEG}_q(\text{img}) = j\}$.

A fibre is problematic when it contains originals with significantly different $\Phi$ values — i.e., when the quantization step is coarse enough that images at opposite ends of a quantization bin produce meaningfully different reconstruction quality.

**What determines fibre size:**
- **JPEG quality $q$:** Lower $q$ = coarser quantization = larger fibres = more problematic
- **Image content complexity:** Smooth regions have fewer DCT differences, so more smooth images share the same quantized coefficients

The problem is quantitative: coarse quantization increases fibre size, which increases the within-fibre variance of $\Phi$.

### Step 3: Propose refinement

**Refinement:** $\mathcal{C}'(\text{img}) = (\text{JPEG}_q(\text{img}), h(\text{img}))$, where $h$ is an auxiliary descriptor that separates within the fibre.

Options for $h$:
| Descriptor | What it separates | Cost |
|-----------|-------------------|------|
| Cryptographic hash of original | Perfect fibre separation (identity within fibre) | High storage, no semantic content |
| Quality estimate (e.g., SSIM) | Separates by reconstruction fidelity | Low cost, directly relevant to $\Phi$ |
| Low-resolution preview | Separates larger image structures | Moderate storage |

For the pseudometric case, any $h$ that makes $\mathcal{C}'$ injective within each fibre (or at least bounds $\Phi$-variation within each $\mathcal{C}'$-fibre) restores preservation.

**Practical instance:** The JPEG standard itself allows EXIF metadata. Adding the original's SSIM or a thumbnail as metadata is a refinement that constrains the possible $\Phi$ values within each fibre.

**Factorisation:** $\mathcal{C} = \phi \circ \mathcal{C}'$ with $\phi(j, h) = j$. ✓

### Step 4: Verify preservation

**Preservation under $\mathcal{C}'$:** The core's Theorem 5 requires:

1. **Fibre condition:** Within each $\mathcal{C}^{-1}(j)$, $d_\Phi \leq k \cdot d_{\mathcal{C}'}$. With $h$ chosen to make $\mathcal{C}'$ injective (e.g., cryptographic hash), $d_{\mathcal{C}'}(\text{img}_1, \text{img}_2) > 0$ for distinct $\text{img}_1, \text{img}_2$, so the condition holds trivially. With a cheaper $h$ (e.g., SSIM), the condition holds as long as $h$ encodes enough information to bound PSNR variation.

2. **Interfibre compatibility:** $\phi$ is 1-Lipschitz for the Euclidean metric on $\mathbb{R}$: $|\Phi(j_1, h_1) - \Phi(j_2, h_2)|$ — wait, $\phi$ is defined on the refined codomain $Y'$, not on $\Phi$.

Let me be precise:
- $\phi: Y' \to Y$ where $Y' = \{(j, h)\}$ and $Y = \{j\}$
- $\phi(j, h) = j$
- $d_Y(\phi(y'_1), \phi(y'_2)) = d_Y(j_1, j_2)$ where $d_Y$ is a metric on JPEG bitstreams (e.g., bitstream edit distance or, more naturally, the L1 distance between decompressed pixel arrays)
- $d_{Y'}(y'_1, y'_2) = d_Y(j_1, j_2) + d_H(h_1, h_2)$ (product metric)
- Then $d_Y(\phi(y'_1), \phi(y'_2)) = d_Y(j_1, j_2) \leq d_Y(j_1, j_2) + d_H(h_1, h_2) = d_{Y'}(y'_1, y'_2)$, so $\phi$ is 1-Lipschitz ✓

**Conclusion:** Theorem 5 holds. Preservation is restored.

---

## 3. Result

**Verdict:** SUCCESS (extends the pseudometric pattern from G2 to a fully external domain)

### What worked

| Step | Status |
|------|--------|
| 1. Contraction identified (JPEG encoding, non-injective) | ✓ |
| 2. Preservation failure documented (within-fibre PSNR variation) | ✓ |
| 3. Fibres characterized (quantization-bin equivalence classes) | ✓ |
| 4. Refinement $\mathcal{C} = \phi \circ \mathcal{C}'$ verified | ✓ |
| 5. Preservation restored (Theorem 5: fibre + interfibre conditions) | ✓ |
| 6. Pseudometric structure handled without core modifications | ✓ |

### What this adds

Lossy compression differs from the previous domains in the nature of the morphism:

| Domain | Morphism type | What is lost | Structure type |
|--------|-------------|-------------|----------------|
| HAA-001 | Margin estimation | Observation history (patient action) | Equivalence |
| G2 | Model estimation | True $P^*$ identification | Pseudometric |
| Type erasure | Information stripping | Generic type annotations | Equivalence |
| **Lossy compression** | **Quantization (continuous)** | **Precise pixel values** | **Pseudometric** |

The repeated success of the pseudometric case (G2 → compression) provides stronger evidence that Theorem 5 captures a general pattern, not a domain-specific coincidence.

---

## 4. Evidence Index update

| Domain | Core sufficient | Structure type | Result |
|--------|----------------|----------------|--------|
| G3 (HAA-001) | Yes | Equivalence | ✓ |
| G2 (estimation uncertainty) | Yes | Pseudometric | ✓ |
| Compilation (type erasure) | Yes | Equivalence | ✓ |
| **Lossy compression** | **Yes** | **Pseudometric** | **✓** |

**Current EI:** 4/4 = 1.0

*Note: Two equivalence instances and two pseudometric instances. Not yet measuring independence between domains (latent variable structure may correlate TAKT-based and compression-based test cases).*

---

## 5. Cumulative pattern

Across all four domains, the core procedure exhibits a consistent structure:

1. **Morphism identification:** Find the non-injective transformation (the "contraction")
2. **Preservation check:** Ask whether the codomain structure distinguishes all elements the property cares about
3. **Fibre characterization:** Identify which fibres contain conflicting property values
4. **Refinement design:** Add information within fibres (metadata, bounds, annotations) to separate what the original morphism conflated
5. **Verification:** Check that the refined morphism satisfies the preservation condition relative to the chosen structure type

The procedure never required:
- Modifying Axiom 1 (pullback) or Axiom 2 (preorder)
- Introducing a new structure type
- Adding a new theorem or lemma
- Changing the definition of refinement

**Prediction:** The procedure will generalize to any domain where:
- There exists a well-defined non-injective morphism $C: X \to Y$
- There exists a property $\Phi: X \to Z$ with a chosen structure
- The preservation relation $\preceq$ is a preorder on structures

**Next test of the boundary:** A domain where the morphism is not a classical function (partial, non-deterministic, or context-dependent).
