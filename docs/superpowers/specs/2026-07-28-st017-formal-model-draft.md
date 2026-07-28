# ST-017 Formal Model Draft: Frozen Definitions, Proven Properties, Open Questions

**Status:** Consolidation reference. This is the canonical entry point
for what this branch has established before any Lean is written — its
purpose is to prevent design decisions from being made inside Lean
syntax. Nothing here is new content; every item below cites the note it
was first established in. If a future note revises a definition, that
note must update this file in the same commit, or this file stops being
authoritative.
**Scope:** Theory only. No Lean code exists yet. No axiom in
`2026-07-27-st017-witness-transportability-design.md` is changed. No
change to ST-016 or `paper/`.

---

## 1. Accepted definitions

All definitions below use $M = (\mathcal{C}_M, \pi_M)$ for a runtime,
$\mathcal{R}_M$ for its representations, $M \setminus \{c\}$ for
ablating capability $c$ (existing `RuntimeSufficiency.lean` vocabulary),
and $\mathcal{K}_D$ for the ST-016 minimal governance kernel.

| Name | Definition | Source |
| :--- | :--- | :--- |
| $\mathrm{Attributes}(c, M, x, y)$ | $\pi_M(x) \neq \pi_M(y) \;\wedge\; \pi_{M \setminus \{c\}}(x) = \pi_{M \setminus \{c\}}(y)$ | `2026-07-28-st017-capability-relative-transportability.md` §3 |
| $\mathrm{Sound}(T, c)$ (decision-level) | $\forall x,y \in \mathcal{R}_M.\ \mathrm{Attributes}(c,M,x,y) \Rightarrow \pi_{M'}(T(x)) \neq \pi_{M'}(T(y))$ | `2026-07-28-st017-capability-relative-transportability.md` §4 |
| $\mathrm{Sound}'(T, c)$ (capability-level, single) | $\forall x,y.\ \mathrm{Attributes}(c,M,x,y) \Rightarrow \mathrm{Attributes}(c,M',T(x),T(y))$ | `2026-07-28-st017-compositional-soundness-obligation.md` §2 |
| $\mathrm{KernelSound}(T)$ | $\forall x,y.\ (\exists c \in \mathcal{K}_D.\ \mathrm{Attributes}(c,M,x,y)) \Rightarrow (\exists c' \in \mathcal{K}_D.\ \mathrm{Attributes}(c',M',T(x),T(y)))$ | `2026-07-28-st017-compositional-soundness-obligation.md` §4 |
| $\mathrm{DecisionSound}(T)$ | $\forall c \in \mathcal{K}_D.\ \mathrm{Sound}(T,c)$ | `2026-07-28-st017-certificate-granularity.md` §1 |
| $\mathrm{CapabilitySound}(T)$ | $\forall c \in \mathcal{K}_D.\ \mathrm{Sound}'(T,c)$ | `2026-07-28-st017-certificate-granularity.md` §1 |
| Trichotomy (Preserved / Degraded / Lost) | case split on $c \in \mathcal{C}_{M'}$, then on $\mathrm{Attributes}(c,M',u,v)$ | `2026-07-28-st017-transportability-failure-modes.md` §1 |

Notably **not** in this table: $\mathrm{Sound}(T,c,R)$, the sub-relation
generalization (`2026-07-28-st017-transport-obligation-granularity.md`
§1.2). It is explicitly excluded — see §3, item Q2.

## 2. Proven properties

Each was proved by direct argument on this branch, not asserted. Proof
sketches are one line; full arguments are in the cited note.

| # | Property | Proof sketch | Source |
| :--- | :--- | :--- | :--- |
| P1 | $\mathrm{CapabilitySound}(T) \Rightarrow \mathrm{KernelSound}(T) \Rightarrow \mathrm{DecisionSound}(T)$ | Direct: existential witness reuse, then first-conjunct projection. Neither converse claimed. | `certificate-granularity.md` §2 |
| P2 | $\mathrm{CapabilitySound}$ and $\mathrm{KernelSound}$ each compose under $\circ$ | Transitivity: one map's consequent matches the next map's premise exactly, by construction. | `compositional-soundness-obligation.md` §2, §4 |
| P3 | $\mathrm{DecisionSound}$ does **not** compose, even quantified over all of $\mathcal{K}_D$ | Consequent (bare $\pi_{M'}$ inequality) lacks the information the next hop's `Attributes` premise needs; no cross-capability borrowing closes this. | `transport-obligation-granularity.md` §2.2; `certificate-granularity.md` §3 |
| P4 | Weakest-link: a chain's achievable level is the minimum over hops; any $\mathrm{DecisionSound}$-only hop breaks composability for the whole chain, not just that hop | Downcast stronger hops via P1, then apply P2 to the resulting uniform level. | `certificate-consumers-and-weakest-link.md` §3 |
| P5 | $\mathrm{Attributes}(c,M,u,v)$ is computable from $M, u, v$ alone whenever $c \in \mathcal{C}_M$ — no transport history required | Direct from the definition: no term in $\mathrm{Attributes}$ references $T$ or any predecessor runtime. | `certificate-information-model.md` §1 |
| P6 | The Preserved/Degraded/Lost trichotomy is exhaustive and mutually exclusive | Two nested booleans ($c \in \mathcal{C}_{M'}$; then $\mathrm{Attributes}(c,M',u,v)$) — no fourth case. | `transportability-failure-modes.md` §1 |
| P7 (grounding counterexample) | A transport can satisfy schema compatibility (design spec Axioms 1, 4) while violating decision monomorphism (Axiom 2) | Concrete construction: ordered-list → multiset trajectory encoding collapses an order-sensitive witness pair. | `syntactic-transport-counterexample.md` §3–4 |

## 3. Explicitly open questions

Nothing below has a resolution on this branch. Listed so Lean work does
not silently pick one.

- **Q1 (necessity).** Is $\mathrm{Attributes}$-preservation ever
  *necessary* for `WitnessConsistentWithRuntime` to transfer, or only
  demonstrated-sufficient-to-cause-failure-when-absent (Case B)? No case
  on this branch shows failure *despite* preservation holding.
  (`decision-equivalence-analysis.md` §4)
- **Q2 (granularity below capability).** Is "capability" the right unit
  at all, given $T_C$'s boundary/interior split under one capability? The
  $R_{\text{boundary}}/R_{\text{interior}}$ relations were
  reverse-engineered from a known counterexample; no general method
  derives $R$ from $T$'s structure. (`transport-obligation-granularity.md`
  §1.3)
- **Q3 (which per-hop contract).** $\mathrm{KernelSound}$ vs.
  $\mathrm{CapabilitySound}$ as the default per-hop obligation is
  orthogonal to composability (P2 holds for both) and undecided; it
  depends on what a certificate's consumer needs to reconstruct, not on
  any property proven here. (`certificate-granularity.md` §4;
  `certificate-consumers-and-weakest-link.md` §4)
- **Q4 (certificate structure).** No certificate data structure is
  defined. Whether "certificate of transportability" content (schema-loss
  provenance) belongs inside a certificate object or as external
  auxiliary evidence (validity-only claims) is named but not designed.
  (`transportability-failure-modes.md` §4; `certificate-information-model.md`
  §4)
- **Q5 (relation to Axiom 2).** Whether local, per-transport
  $\mathrm{Sound}$-family properties are implied by, imply, or are
  independent of global Policy Decision Monomorphism between two runtimes
  remains unresolved. (`decision-equivalence-preservation.md` §4)
- **Q6 (mock runtimes).** Every construction on this branch — the
  temporal counterexample, Cases A/B/C, the $C_{\text{uncertainty}}$
  degradation scenario — is a hand-worked example, not an executable
  instance. The Phase III.1 exit bar's required witness "between two
  distinct mock runtimes" does not exist. (design spec §6)

## 4. Recommended Lean formalization order

Lowest-risk first, matching §1–2's definitional/direct-proof character:

1. `Attributes`, `Sound`, `Sound'`, `KernelSound` (definitions only —
   P1–P4 are the theorems that follow from getting these right).
2. P1 (hierarchy) and P2 (composition for the two composable levels) —
   each a few lines, no dependency beyond (1).
3. P6 (trichotomy exhaustiveness) — trivial once `Attributes` and
   $\mathcal{C}_M$ membership are typed correctly.
4. P4 (weakest-link) — follows from P1+P2, stated as a corollary.
5. **Not this phase:** Q1–Q6. Formalizing any of them now would encode
   an undecided design choice as if it were settled.

Mock runtime construction (Q6) is a prerequisite for the design spec's
exit bar regardless of formalization order — it can proceed in parallel
with (1)–(4), since it doesn't depend on which open question gets
resolved first.

## 5. What this note does not do

Does not write Lean. Does not resolve Q1–Q6. Does not modify any prior
note — this file aggregates and cites; it does not supersede the
originals as the record of *how* each result was found, only as the
reference for *what* currently stands. No axiom added or changed, no
change to ST-016 or `paper/`.
