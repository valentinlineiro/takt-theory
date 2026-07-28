# ST-017 Transportability Failure Modes: Consolidation

**Status:** Consolidation note closing the initial conceptual-exploration
stretch of this branch. Does **not** close Phase III.1 against the exit
bar defined in `2026-07-27-st017-witness-transportability-design.md` §6
(zero-`sorry` Lean theorem + witness instance) — no Lean exists yet. This
note only fixes the taxonomy and recommends what's ready to formalize
next.
**Scope:** Theory only. No runtime implementation, no Lean code written,
no axiom added or changed.
**Depends on:** every prior note in this branch; supersedes none of them.

## 1. The trichotomy, stated as a case split, not just two failure modes

For a transport $T : M \to M'$, a capability $c$, and a pair $(x,y)$ with
$\mathrm{Attributes}(c, M, x, y)$, exactly one of three cases holds at
$M'$ for $(u,v) = (T(x), T(y))$:

- **(a) Preserved:** $c \in \mathcal{C}_{M'} \wedge \mathrm{Attributes}(c, M', u, v)$
- **(b) Semantic degradation:** $c \in \mathcal{C}_{M'} \wedge \neg\mathrm{Attributes}(c, M', u, v)$
- **(c) Schema loss:** $c \notin \mathcal{C}_{M'}$

**Exhaustiveness and mutual exclusivity are immediate**, not a new
finding requiring proof: $c \in \mathcal{C}_{M'}$ is a boolean, splitting
into (a)/(b) vs. (c); within $c \in \mathcal{C}_{M'}$,
$\mathrm{Attributes}(c, M', u, v)$ is a boolean, splitting (a) from (b).
The only reason this is worth stating as a lemma at all is completeness:
it rules out a fourth, silent failure mode — there is no case where
$\mathrm{Attributes}(c, M', u, v)$ is simply *undefined* while
$c \in \mathcal{C}_{M'}$; membership in the capability set is exactly the
condition that makes the predicate well-formed. This closes a gap the
prior notes left implicit (they discussed (a)/(b) at length — the
$C_{\text{temporal}} \to C_{\text{uncertainty}}$ example is case (b) —
and named (c) only in passing, in the information-model note's §2, point
ii, without checking it against the other two).

## 2. What distinguishes (b) from (c), restated precisely

- **(b) is a question that can still be asked**, and it can be re-asked
  directly at $M'$: $\mathrm{Attributes}(c, M', u, v)$ is a well-formed
  proposition, currently false. Provenance is auxiliary here
  (`2026-07-28-st017-certificate-information-model.md` §4).
- **(c) is a question that can no longer be formed.**
  $\mathrm{Attributes}(c, M', \cdot, \cdot)$ isn't false, it's not a
  proposition at all, because $M' \setminus \{c\}$ presupposes
  $c \in \mathcal{C}_{M'}$. There is nothing to recompute. Provenance —
  specifically, the fact that $c \in \mathcal{C}_{M_k}$ for some earlier
  $M_k$ in the chain — is the only remaining source for "this claim used
  to be expressible."

## 3. The ST-016 contrast, made exact

ST-016 never encounters case (c). Its $\mathcal{K}_D$ is fixed once and
for all (`paper/sections/03-foundations.tex`: $\mathcal{K}_D = \{C_{\text{contract}}, C_{\text{uncertainty}}, C_{\text{temporal}}\}$),
and ablation ($M \setminus \{C\}$ in `NecessaryCapability`) removes a
capability's *effect on the policy* for the purpose of one check, while
$C$ remains nominally in $\mathcal{C}$ throughout — ablation is a
counterfactual query, not a schema mutation. ST-017 introduces something
ST-016's formal object has no room for: a capability that stops being
*definable at all* for a later runtime, because $\mathcal{C}$ itself
varies across the runtimes a witness is transported between. This is the
concrete content behind the "space where the claim can be formulated"
framing from prior discussion — it names a real structural difference
between the two theories' objects, not just a difference in how far each
has been explored.

## 4. Two certificate kinds this motivates (named, not built)

- **Certificate of validity:** "$\mathrm{Attributes}(c, M', u, v)$ holds
  now." Always case-(a)-only; always recomputable at $M'$ per the
  endpoint-recomputability argument (information-model note, §1).
- **Certificate of transportability:** "this claim was expressible and
  true at some point in the chain, even if $c$ is no longer in
  $\mathcal{C}_{M'}$." Only this second kind needs history, and only
  needs the specific fact "$c \in \mathcal{C}_{M_k}$ and
  $\mathrm{Attributes}(c, M_k, \cdot, \cdot)$ held," not a full replay of
  every hop's witnesses.

Neither is defined as a data structure here — naming them is as far as
this note goes, consistent with every prior note's stated boundary.

## 5. What's ready for Lean, and what isn't

This branch has accumulated several results that are simple, definitional
case-analyses or direct-transitivity proofs, not deep semantic claims —
low-risk first targets for `TaktFormal.RuntimeTransportability`
(design spec §3):

- **Ready:** the trichotomy (§1) — pure case split on two booleans.
- **Ready:** $\mathrm{Attributes}(c, M, x, y)$ itself, and $\mathrm{Sound}(T,c)$,
  $\mathrm{Sound}'(T,c)$, $\mathrm{KernelSound}(T)$ — direct definitions,
  no dependencies beyond `RuntimeSufficiency.lean`'s existing `Runtime`/
  ablation vocabulary.
- **Ready:** the hierarchy $\mathrm{CapabilitySound} \Rightarrow \mathrm{KernelSound} \Rightarrow \mathrm{DecisionSound}$
  and the composition proofs for the two composable levels
  (`2026-07-28-st017-certificate-granularity.md` §2–3) — each is a
  handful of lines of direct proof already checked by hand on this
  branch.
- **Not ready:** anything about $R_{\text{boundary}}/R_{\text{interior}}$-style
  sub-relation granularity (`2026-07-28-st017-transport-obligation-granularity.md`
  §1) — those were reverse-engineered from one example, not derived from
  $T$'s structure; formalizing them now would freeze a definition that
  admittedly doesn't generalize yet.
- **Not ready:** any certificate data structure (§4 here), the weakest-link
  property's practical consequences for real multi-party chains, or a
  concrete $T_{12}, T_{23}$ construction on actual runtimes — all of
  these presuppose design decisions (which certificate kind, what
  provenance format) this branch has deliberately left open.

The Phase III.1 exit bar (design spec §6) also requires "at least one
non-trivial witness instance ... between two distinct mock runtimes."
Nothing on this branch constructs mock runtimes — every construction here
(the $C_{\text{temporal}}$ counterexample, Cases A/B/C, the
$C_{\text{uncertainty}}$ degradation scenario) is a hand-worked example on
paper, not an executable instance. That gap is real and unresolved by
this note; closing it is implementation work this note explicitly
excludes, per every prior note's stated boundary.

## 6. What this note does not do

Does not mark Phase III.1 complete. Does not write Lean. Does not define
a certificate type. Does not choose $\mathrm{KernelSound}$ vs.
$\mathrm{CapabilitySound}$ as the eventual per-hop contract, or decide
between "certificate of validity" and "certificate of transportability"
as the thing ST-017 ultimately produces — it records that these are now
two different things, which is the trichotomy's actual contribution. No
axiom added or changed, no change to ST-016 or `paper/`.
