# ST-017 Counterexample: Syntactic Transport Without Semantic Preservation

**Status:** Open counterexample analysis / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean proof, no paper claim.
**Design Spec:** [`2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md)
**Depends on:** ST-016 `C_temporal` witness (`paper/sections/03-foundations.tex`, Example 1; `paper/sections/05-evaluation.tex`, Table 1)

---

## 1. Why look for a counterexample first

The design spec's four equivalence conditions ($M_1 \sim M_2$) are stated as
a conjunction (§2 of the design spec), but nothing in the spec establishes
that they are independent. If one condition can hold while another fails,
that tells us which axiom is doing the actual work — cheaper to find now,
on paper, than after investing in `takt-rust`/`takt-python` harnesses.
This note constructs a minimal case separating **Axiom 1 (Capability
Geometry Preservation)** from **Axiom 2 (Policy Decision Monomorphism)**.

## 2. Formal model for this note

Following the structure requested for ST-017's formal model:

- **Runtime model $M$:** a tuple $(\mathcal{C}, \pi_M)$ as in ST-016
  (`paper/sections/03-foundations.tex`).
- **Witness $W_M$:** a `WitnessArtifact` produced by $M$, as in ST-016's
  `RuntimeWitness.lean`.
- **Transport map $T : \mathcal{W}_{M_1} \to \mathcal{W}_{M_2}$:** a
  *syntactic* map — it rewrites field values (state encodings, capability
  tags) into $M_2$'s schema without altering their structural type.
- **Preservation property $P$:** $\text{WitnessConsistentWithRuntime}(M_2,
  T(W_{M_1}))$ holds, i.e. the transported witness certifies the same
  capability necessity under $M_2$ that it did under $M_1$.

The question this note asks: **does a $T$ satisfying Axiom 1 (schema
isomorphism) automatically satisfy $P$?**

## 3. The construction

Take the $C_{\text{temporal}}$ witness from ST-016 Example 1: two
trajectory-induced representations $R^1, R^2$ share terminal observation
$r_2$ but arise from $\tau_1 = (r_0, r_1, r_2)$ (safe) and
$\tau_2 = (r'_0, r'_1, r_2)$ (unsafe). The full-capability runtime
distinguishes them ($\pi_M(R^1) \neq \pi_M(R^2)$); this divergence is
exactly what makes $C_{\text{temporal}}$ necessary.

Define two runtimes that both declare a `temporal` capability field — so
Axiom 1 (capability geometry) and Axiom 4 (witness schema compatibility)
hold by construction:

- **$M_1$ (ordered-prefix encoding):** represents trajectory history as an
  ordered list `[r_0, r_1, r_2]`. Its `temporal` capability compares
  prefixes positionally; $\tau_1 \neq \tau_2$ because position 0 differs.
- **$M_2$ (multiset encoding):** represents trajectory history as an
  unordered multiset `{r_0, r_1, r_2}`. Its `temporal` capability field has
  the same name, type signature, and presence/absence semantics as $M_1$'s
  — a schema-level isomorphism holds, satisfying Axiom 1 — but the
  *comparison* it performs is set equality, not sequence equality.

Let $T$ be the obvious syntactic transport: map each field of $W_{M_1}$ to
the identically-named field of $M_2$, converting the list `[r_0, r_1, r_2]`
to the multiset `{r_0, r_1, r_2}` (a well-typed, structure-preserving
rewrite — it does not reorder or drop elements, it just changes the
container's equality semantics).

## 4. Where preservation breaks

Under $M_2$, $T(\tau_1) = \{r_0, r_1, r_2\} = \{r'_0, r_1, r_2\} = T(\tau_2)$
is **false** only if $r_0 \neq r'_0$ as *elements* — which they are (they're
different states). So far so good; the multisets are still distinguishable
here **because this particular counterexample has $r_0 \neq r'_0$.**

The actual break: consider a second witness pair with
$\tau_3 = (r_0, r_1, r_2)$ and $\tau_4 = (r_1, r_0, r_2)$ — a genuine
reordering of the *same* elements, arising because $M_1$'s optimal policy
$\pi^*_S$ is sensitive to *which state was entered first* (e.g., a
contract violation that only matters if it precedes, not follows, a
recovery step). Under $M_1$: $\tau_3 \neq \tau_4$ as ordered sequences, so
$\pi_{M_1}$ can (and, per the governing $\pi^*_S$, must) distinguish them.
Under $M_2$: $T(\tau_3) = \{r_0, r_1, r_2\} = \{r_1, r_0, r_2\} = T(\tau_4)$
— **identical multisets.** $M_2$'s `temporal` capability, despite being
schema-isomorphic to $M_1$'s (Axiom 1 ✓, Axiom 4 ✓ — same field, same
type), cannot represent the distinction the witness certifies. So:

$$\pi_{M_1}(R^3) \neq \pi_{M_1}(R^4) \quad\text{but}\quad \pi_{M_2}(T(R^3)) = \pi_{M_2}(T(R^4))$$

$T(W_{M_1})$ is **not** `WitnessConsistentWithRuntime`-certifiable under
$M_2$: $P$ fails. Axiom 2 (Policy Decision Monomorphism) fails even though
Axioms 1 and 4 hold by construction.

## 5. What this shows (and doesn't)

- **Shows:** Axiom 1 (capability geometry / schema isomorphism) is
  independent of Axiom 2 (policy decision monomorphism) — a transport map
  can be well-typed and structure-preserving at the *schema* level while
  destroying the *ordering* information a capability's semantics depends
  on. "Same field name, same type" is not evidence of semantic
  equivalence; it can be actively misleading, since $T$ here looks
  innocuous (no dropped fields, no type errors).
- **Shows:** the failure is specifically at the level of *how* a capability
  compares values, not *whether* it's present — this is invisible to any
  transport-correctness check that only inspects schemas (Axiom 4-style
  checks). A soundness argument for $T$ needs to inspect the capability's
  comparison semantics, not just its type.
- **Does not show:** that no transport map exists between order-sensitive
  and multiset-based runtimes — only that the naive field-renaming $T$
  used here fails. A order-preserving encoding (e.g., transporting to an
  indexed multiset, or a sequence type in $M_2$) would plausibly restore
  $P$; that's a candidate direction, not proven here.
- **Does not show:** anything about ST-016. $\mathcal{K}_D$, its Lean 4
  proofs, and the frozen `paper-v0.4-arxiv-ready` manuscript are untouched
  — this note only exercises hypothetical $M_2$ constructions that don't
  exist in the reference TypeScript runtime.

## 6. Resulting refinement to the design spec

This motivates tightening Axiom 4 (Witness Schema Compatibility) in
[`2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md#2-theoretical-equivalence-conditions-):
schema-level field compatibility should be treated as **necessary but not
sufficient** for $T$-soundness. A future revision of Axiom 4 should require
that $T$ preserve not just field names/types but the *decision-relevant
equality relation* each capability imposes on its domain — restating Axiom 4
as an explicit condition on $T$ rather than folding it into "both runtimes
emit compatible artifacts." This is a candidate refinement for Phase III.1,
not a change made to the design spec in this commit.
