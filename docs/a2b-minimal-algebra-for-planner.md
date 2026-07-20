# A2b: Minimal algebra for generic Planner/Governance

**Status:** Active investigation
**Source:** CARD-349 (transferred from TAKT runtime)
**Previous:** `docs/finding-generality-boundary.md`
**Tags:** `cycle-close-2026-07-20`, `a2-generality-boundary`

---

## 1. Formal requirements

### 1.1 What EVSI actually needs

From `cli/src/core/planner/RefinementPlanner.ts`:

```
EVSI(current, option) = E[Φ^↓ after refinement] − Φ^↓(y) − cost
```

This decomposes into four algebraic primitives:

| Operation | Symbol | Arity | Required for |
|-----------|--------|-------|-------------|
| **Weighted combination** | Σ pᵢ × vᵢ | (ℝ×L)ⁿ → L | Expected value over outcomes |
| **Difference** | a − b | L × L → ℝ | Improvement from refinement |
| **Cost subtraction** | x − c | ℝ × ℝ → ℝ | Net benefit (cost is numeric) |
| **Sign test** | x > 0 | ℝ → bool | Is refinement worth it? |

Note that cost is always numeric (refinements have a real cost), so
cost subtraction is always ℝ-on-ℝ. The genuinely L-specific operations
are weighted combination and difference.

### 1.2 What governance needs

From `cli/src/core/governance/GovernancePolicy.ts`:

```
sufficientGuarantee = Φ^↓(y) ≥ threshold
```

| Operation | Arity | Required for |
|-----------|-------|-------------|
| **Threshold comparison** | L × ℝ → bool | Is the guarantee sufficient? |

Threshold is always numeric (a real value), so this is always L-vs-ℝ
comparison.

### 1.3 Summary

The pipeline needs an interface over L that supports:

1. `weightedSum(pairs: {prob: number; value: L}[]): L` — convex combination
2. `difference(a: L, b: L): number` — signed distance for EVSI
3. `geq(a: L, threshold: number): boolean` — threshold test for governance

---

## 2. Candidate: Valuation (v: L → ℝ)

### 2.1 Definition

```typescript
interface Valuation<L> {
  /** Monotone embedding of L into ℝ. Must preserve order:
   *  leq(a, b) ⇒ value(a) ≤ value(b). */
  value(x: L): number;
  /** The partial order on L. */
  leq(a: L, b: L): boolean;
}
```

All operations reduce to ℝ:

| Generic operation | Implementation |
|------------------|---------------|
| `weightedSum(pairs)` | Σ p × value(v) |
| `difference(a, b)` | value(a) − value(b) |
| `geq(a, t)` | value(a) ≥ t |

### 2.2 Does it work for L = ℝ?

Yes, trivially: `value(x) = x`, `leq = (≤)`. This is the current
implementation.

### 2.3 Does it work for L = ℙ(U) (sets)?

Yes, if we choose a monotone valuation. Two natural candidates:

**Measure-based:** `value(S) = μ(S)` for some measure μ. If μ is
monotone (S ⊆ T ⇒ μ(S) ≤ μ(T)), the order is preserved.

**Membership-based:** `value(S) = |S|` (cardinality). Also monotone.
But this loses most of the set structure — only size matters.

**Problem:** Measure is not unique. Different measures give different
valuations, and therefore different EVSI values. The valuation
approach introduces a choice that the current ℝ-only pipeline does
not have.

### 2.4 Does it work for finite lattices?

**Only if the lattice is graded** (all maximal chains between the
same elements have the same length). For graded lattices, the rank
function r: L → ℕ is unique and monotone.

For **non-graded** finite lattices (where chains between ⊥ and x may
have different lengths), no canonical rank exists. A valuation must
be chosen externally — e.g., cost, capability level, or some
problem-specific numeric attribute.

This is not a deficiency of the valuation approach; it reflects the
fact that "magnitude" is not intrinsic to the order for non-graded
structures.

### 2.5 The linearity assumption

The valuation approach reduces all operations to ℝ via `v: L → ℝ`.
But EVSI computes:

```
v(E[Φ^↓ after refinement]) − v(Φ^↓(y)) − cost
```

This requires:

```
v(E[Φ]) = E[v(Φ)]   i.e.,   v(Σ pᵢ × xᵢ) = Σ pᵢ × v(xᵢ)
```

This is **not free**. It requires v to be **affine** with respect to
convex combinations — equivalently, v must be a linear functional on
the convex hull of L. For ℝ with v(x) = x, this holds trivially.
For ℙ(U) with measure μ, this holds because μ is additive.

For arbitrary L, this cannot be assumed. Any `Valuation<L>` intended
for EVSI must also satisfy this linearity condition. This rules out,
for example, valuations based on non-additive measures or arbitrary
monotone functions.

### 2.6 Assessment

| Criterion | L = ℝ | L = ℙ(U) | Graded finite lattice |
|-----------|-------|-----------|----------------------|
| Existence of valuation | ✅ v(x)=x | ✅ μ(S) or |S| | ✅ rank function |
| Affine (v(E) = E(v)) | ✅ (identity) | ✅ (measure additive) | ✅ (rank additive?) |
| Order preservation | ✅ | ✅ (if μ monotone) | ✅ |
| Uniqueness | ✅ (only one) | ❌ (multiple measures) | ⚠️ (unique for distributive) |

**Verdict: Works, but at a cost.** The valuation is not uniquely
determined by the order in general, and the linearity requirement
(v affine) is an additional constraint. EVSI depends on which
valuation you pick, not just on Φ^↓ and the refinement outcomes.
The ℝ-only pipeline avoids this because there is exactly one
affine monotone embedding of ℝ into ℝ: the identity.

---

## 3. Candidate: EvaluativeStructure<L>

### 3.1 Definition

```typescript
interface EvaluativeStructure<L> extends OrderedStructure<L> {
  /** Signed difference: how much more conservative is a than b?
   *  Positive means a is more conservative than b. */
  diff(a: L, b: L): number;
  /** Weighted combination: expected value over outcome distribution. */
  expectation(dist: {value: L; prob: number}[]): L;
  /** Neutral element: diff(a, zero) = diff(zero, a) ??? Must define. */
  zero: L;
}
```

### 3.2 Does it work for L = ℝ?

Yes: `diff(a, b) = a − b`, `expectation(dist) = Σ p × v`,
`zero = 0`.

### 3.3 Does it work for L = ℙ(U)?

**diff:** What is S₁ − S₂ for sets? Set difference? That gives a
set, not a number. Signed measure? That needs a measure, which
brings back the valuation problem. |S₁| − |S₂|? Works numerically
but loses all set structure.

**expectation:** What is the weighted combination of sets?
Σ pᵢ × Sᵢ is not defined unless we interpret it as a measure:
`λx. Σ pᵢ × 𝟙_{Sᵢ}(x)`. This produces a function, not a set — it's
a fuzzy set. To get a crisp set back, we'd need to threshold:
`{x | Σ pᵢ × 𝟙_{Sᵢ}(x) ≥ t}`. But what threshold?

**Verdict for ℙ(U):** Expectation cannot be defined cleanly on
sets without either (a) a measure (valuation again) or (b) a
thresholding operation (new parameter).

### 3.4 Does it work for finite lattices?

**diff:** a ⊓ complement(b)? Not standard. height(a) − height(b)?
Numeric, but loses lattice structure.

**expectation:** Weighted join? Σ pᵢ × xᵢ (where × is scalar
multiplication) is not defined on lattices unless the lattice is
a vector lattice (ℝⁿ). Most finite lattices are not.

**Verdict:** No — expectation cannot be defined on general lattices
without additional structure (convexity, vector space structure).

### 3.5 Assessment

| Criterion | L = ℝ | L = ℙ(U) | Finite lattice |
|-----------|-------|-----------|----------------|
| diff | ✅ a−b | ❌ not numeric | ❌ not defined |
| expectation | ✅ Σ p×v | ❌ fuzzy/threshold | ❌ no convexity |
| zero | ✅ 0 | ⚠️ ∅? | ✅ ⊥? |

**Verdict: Fails for ℙ(U) and finite lattices.** Expectation cannot
be defined on arbitrary sets or lattices without additional
structure (measure, convexity, vector space).

---

## 4. Question of minimality: what weaker structures might suffice?

The preceding analysis shows that **Valuation<L> is a working
solution**. But this does not prove it is the **minimal** solution.
Minimality requires showing that all strictly weaker structures
fail. This section is open: the candidates below are plausible
weaker algebras that have not been ruled out.

### 4.1 Candidate: Ordinal EVSI (no magnitudes)

Instead of `E[Φ^↓] − Φ^↓`, compare outcomes ordinally:

```
outcome ∈ {better, worse, same}
```

This only requires `OrderedStructure<L>` (already proven for M1).
Cost would be handled as a budget constraint, not as arithmetic
subtraction. EVSI becomes discrete: does refinement improve the
guarantee, yes or no?

**Open question:** Does this preserve enough information for useful
decisions? The current quantitative EVSI can distinguish "barely
better" from "much better" — ordinal EVSI cannot.

### 4.2 Candidate: Affine functional (partial embedding)

Instead of a full valuation `v: L → ℝ`, define an affine functional
only on the convex hull of outcome distributions:

```typescript
interface AffineExpectation<L> {
  expected(dist: {value: L; prob: number}[]): number;
}
```

No need to embed all of L — only the outcomes that appear in
refinement distributions. This is a strictly weaker requirement
than a global valuation.

**Open question:** How often does the planner encounter new L values
not seen in training data? If outcome distributions are finite and
known, this may suffice. If not, a global valuation is needed.

### 4.3 Candidate: Partial homomorphism

Extend `OrderedStructure<L>` with a monoid structure for differences:

```typescript
interface DifferenceStructure<L> extends OrderedStructure<L> {
  diff(a: L, b: L): L;   // difference lives in L, not ℝ
  zero: L;                // diff(a, a) = zero
}
```

EVSI would compute `E[diff(Φ^↓ after, Φ^↓)]` and compare against
cost (which would also need to embed into L). This avoids ℝ entirely
but requires L to have a group-like structure.

**Open question:** What natural L have this structure? ℝ does
(diff = subtraction). ℙ(U) does not (set difference is not signed).
Finite lattices do not (no inverse).

### 4.4 What this means

None of these weaker candidates is ruled out by the analysis so far.
Each has its own limitations, and each may fail for specific L.
But proving minimality requires showing they all fail.

**The current result is:** Valuation<L> is the most general working
solution found so far. Whether a strictly weaker solution exists
remains an open question.

---

## 5. Established result and open questions

### 5.1 What is settled

The analysis confirms a structural boundary that was previously only
suspected:

| Claim | Status |
|-------|--------|
| `OrderedStructure<L>` is insufficient for EVSI | ✅ Confirmed. EVSI needs weighted combination and signed difference, not just order. |
| A quantitative planner needs a notion of **magnitude** beyond order | ✅ Confirmed. Arithmetic (Σ, −, ≥) cannot be derived from order alone. |
| `Valuation<L>` is a working solution for ℝ, ℙ(U), and graded lattices | ✅ Confirmed. Embedding L → ℝ supports all three required operations. |
| The linearity condition v(E[Φ]) = E[v(Φ)] is required | ✅ Identified. v must be affine, not just monotone. |

### 5.2 What remains open

| Question | Status |
|----------|--------|
| Is `Valuation<L>` the **minimal** structure? | ❌ Open. Ordinal EVSI, affine functionals, and difference structures (see §4) have not been ruled out. |
| Do any of the weaker candidates preserve enough information for useful decisions? | ❌ Open. The trade-off between generality and expressiveness is not settled. |
| Does every practically relevant L admit a **canonical** affine valuation? | ❌ Open. ℝ does (identity), ℙ(U) does not (multiple measures), graded distributive lattices do (rank). Non-graded lattices are open. |

### 5.3 Leading candidate: Valuation<L>

Despite the open questions, `Valuation<L>` is the leading candidate
because it is the simplest structure known to work for all three
target domains (ℝ, ℙ(U), finite lattices) while supporting the full
quantitative semantics of EVSI.

Implementation for the runtime (if adopted):

```typescript
interface Valuation<L> {
  /** Embed L into ℝ for EVSI arithmetic.
   *  Must be affine: v(Σ pᵢ × xᵢ) = Σ pᵢ × v(xᵢ). */
  value(x: L): number;
}

// ℝ: valuation is identity (trivially affine)
class RealValuation implements Valuation<number> {
  value(x: number): number { return x; }
}

// ℙ(U): valuation is measure (affine if measure is additive)
class MeasureValuation implements Valuation<Set<string>> {
  constructor(private measure: (s: Set<string>) => number) {}
  value(x: Set<string>): number { return this.measure(x); }
}

// Graded lattice: valuation is rank function
class RankValuation<L> implements Valuation<L> {
  constructor(private rank: (x: L) => number) {}
  value(x: L): number { return this.rank(x); }
}
```

### 5.4 If Valuation is adopted

`RefinementPlanner` and `GovernancePolicy` become parameterised
by `Valuation<L>`:

```typescript
class RefinementPlanner<L> {
  constructor(private valuation: Valuation<L>) {}
  select(current: L, candidates: RefinementOption<L>[]): RefinementDecision {
    const currentValue = this.valuation.value(current);
    // EVSI operates on ℝ via valuation.value
  }
}

class GovernancePolicy<L> {
  constructor(
    private valuation: Valuation<L>,
    private guaranteeThreshold: number,
    private hasCapacity: () => boolean,
  ) {}
  decide(input: GovernanceInput<L>): GovernanceAction {
    const sufficient = this.valuation.value(input.proxy.lowerBound) >= this.guaranteeThreshold;
  }
}
```

The ℝ coupling is **factorized to a single point** (the Valuation
interface) rather than eliminated. This is not a compromise — it
reflects the fact that magnitude for EVSI requires ℝ arithmetic.

### 5.5 Recommendation

Depending on the project's next goal:

- **If the goal is to build generic proxy instances now:** adopt
  `Valuation<L>` as the interface, implement `RealValuation` as a
  refactor, and defer the minimality question. This is a practical
  choice that works.
- **If the goal is to settle the minimality question:** design and
  test the weaker candidates from §4 against ℝ, ℙ(U), and finite
  lattices before committing to any implementation.
