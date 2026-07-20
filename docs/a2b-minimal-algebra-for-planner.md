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

Yes, by the **rank function**: every finite lattice has a monotone
rank function r: L → ℕ (length of maximal chain from ⊥ to x). This
is unique for distributive lattices (Birkhoff's representation), but
not for arbitrary finite lattices where chains may differ.

### 2.5 Assessment

| Criterion | L = ℝ | L = ℙ(U) | Finite lattice |
|-----------|-------|-----------|----------------|
| Existence of valuation | ✅ value(x)=x | ✅ μ(S) or |S| | ✅ rank function |
| Order preservation | ✅ | ✅ (if μ monotone) | ✅ |
| Uniqueness | ✅ (only one) | ❌ (multiple measures) | ⚠️ (unique for distributive) |

**Verdict: Works, but at a cost.** The valuation is not uniquely
determined by the order in general. This means EVSI depends on which
valuation you pick, not just on Φ^↓ and the refinement outcomes.
The ℝ-only pipeline avoids this because there is exactly one
monotone embedding of ℝ into ℝ: the identity.

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

## 4. Candidate: No generalisation exists

Given the analysis above:

| Operation | ℝ | ℙ(U) | Finite lattice |
|-----------|---|------|----------------|
| `weightedSum` → L | ✅ | ❌ | ❌ |
| `diff` → number | ✅ | ⚠️ (via measure) | ⚠️ (via rank) |
| `geq` against ℝ threshold | ✅ | ⚠️ (via measure) | ⚠️ (via rank) |

`weightedSum` (expectation of outcomes) is the blocking operation.
It cannot be defined on sets or lattices without embedding into a
vector space or using a valuation.

### 4.1 Argument for fundamental ℝ-specificity

EVSI is an **information-theoretic** quantity. It measures the
expected reduction in uncertainty from acquiring information.
Information theory is built on ℝ — entropy, mutual information,
expected value — because these quantities are fundamentally
arithmetic (they involve summation, products, and logarithms over
probability distributions).

If EVSI could be defined on arbitrary partially ordered sets without
reference to ℝ, it would mean that information value is independent
of magnitude — which contradicts decision theory's basic result that
utility is real-valued (von Neumann–Morgenstern).

### 4.2 Argument against (i.e., why it might still generalise)

Not all refinements need full EVSI. A weaker planner could use:

- **Order comparison only:** "Does refinement C' produce a Φ^↓
  that is not worse than the current Φ^↓?" (leq-based, no arithmetic)
- **Discrete EVSI:** Only consider whether the outcome is "better,"
  "worse," or "same" — a trinary decision, not a numeric one.

These weaker planners would be generic over any OrderedStructure<L>
but would lose the quantitative cost-benefit tradeoff that EVSI
provides. That's acceptable — the question is whether it answers
the user's need.

---

## 5. Conclusion

### 5.1 Theoretical verdict

**No generalisation of EVSI exists** that preserves its quantitative
cost-benefit semantics for arbitrary L. The blocking operation is
`weightedSum` (expected value over outcomes), which requires either:

- An embedding `v: L → ℝ` (Valuation approach), or
- A vector space / convex structure on L (not available for ℙ(U) or
  general finite lattices).

The Valuation approach works for all three L but introduces a
non-unique choice of valuation for ℙ(U) and non-distributive
lattices. This means EVSI is not uniquely determined by Φ^↓ alone —
it depends on how you measure the domain.

### 5.2 Practical recommendation

**Adopt the Valuation approach** and accept that EVSI depends on a
choice of measure/valuation for non-ℝ domains. This is not a
deficiency — it reflects the fact that "how much better" is not
intrinsic to the order but requires a magnitude.

Implementation:

```typescript
interface Valuation<L> {
  value(x: L): number;
}

// ℝ: valuation is identity
class RealValuation implements Valuation<number> {
  value(x: number): number { return x; }
}

// ℙ(U): valuation is measure (must be provided by caller)
class MeasureValuation implements Valuation<Set<string>> {
  constructor(private measure: (s: Set<string>) => number) {}
  value(x: Set<string>): number { return this.measure(x); }
}

// Finite lattice: valuation is rank function
class RankValuation<L> implements Valuation<L> {
  constructor(private rank: (x: L) => number) {}
  value(x: L): number { return this.rank(x); }
}
```

Then `RefinementPlanner` and `GovernancePolicy` are parameterised
by `Valuation<L>` instead of hardcoded `number`:

```typescript
class RefinementPlanner<L> {
  constructor(private valuation: Valuation<L>) {}
  select(current: L, candidates: RefinementOption<L>[]): RefinementDecision {
    // EVSI operates on valuation.value(x) ∈ ℝ
    const currentValue = this.valuation.value(current);
    // ...
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
    // ...
  }
}
```

### 5.3 Open sub-question

Is there a canonical valuation for each L that is "natural" (i.e.,
determined by the structure of L rather than by caller choice)?

- ℝ: ✅ `value(x) = x` — uniquely determined by the order.
- ℙ(U): ❌ No canonical measure — measure must be chosen.
  However, the measure may be determined by the problem domain
  (e.g., probability measure, counting measure).
- Finite distributive lattices: ✅ Rank function is unique.
- Finite non-distributive lattices: ❌ Rank depends on chain chosen.
  But in practice, the lattice structure usually determines a
  natural valuation (e.g., cost, size, capability level).

### 5.4 What this means for the runtime

The ℝ coupling is **not eliminable** — it is pushed to a single
point (the Valuation interface) rather than eliminated. This is
the right outcome: the ℝ coupling reflects a real mathematical
requirement (magnitude for EVSI), not an implementation accident.

The current runtime can become generic by:

1. Adding `Valuation<L>` interface (one file, ~10 lines).
2. Extracting `RealValuation` from the current hardcoded ℝ code
   (pure refactor, no behavioural change).
3. Parameterising `RefinementPlanner` and `GovernancePolicy` with
   `Valuation<L>` (generic, testable).
4. Adding `MeasureValuation` and `RankValuation` as new instances
   (new proxy domains).
