# ST-017 Decision Equivalence Analysis

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no change
to `Axiom 4` or any axiom in the main design spec.
**Depends on:** [`2026-07-28-st017-decision-equivalence-preservation.md`](2026-07-28-st017-decision-equivalence-preservation.md),
[`2026-07-28-st017-syntactic-transport-counterexample.md`](2026-07-28-st017-syntactic-transport-counterexample.md)

## 0. What this note is investigating

The previous note proposed $\sim_D$-preservation
($x \not\sim_{D,M_1} y \Rightarrow T(x) \not\sim_{D,M_2} T(y)$) as a
*candidate* condition for transport soundness, and left open whether it is
necessary, sufficient, or neither. This note does **not** assert that
$\sim_D$-preservation is the transportability condition. It investigates,
through three constructed cases, whether $\sim_D$-preservation
*characterizes* transport soundness for witnesses, and surfaces a
question the single counterexample couldn't: whether transportability is
even well-posed as a per-runtime global property, or must be relativized
per capability.

## 1. Case A — Sound transport

**Construction:** $T_A$ maps $M_1$'s ordered-list trajectory encoding
`[r_0, r_1, r_2]` to $M_2'$'s ordered-list encoding of the same
trajectory, differing only in serialization (e.g. a different container
type that still compares by sequence equality — the identity map up to
relabeling, not a structural collapse like the counterexample's multiset).

**Check:** for the counterexample's $\tau_3 = (r_0, r_1, r_2)$,
$\tau_4 = (r_1, r_0, r_2)$: $\tau_3 \not\sim_{D,M_1} \tau_4$ (distinct
sequences under $M_1$'s order-sensitive policy). $T_A(\tau_3) =
[r_0,r_1,r_2]$, $T_A(\tau_4) = [r_1,r_0,r_2]$ remain distinct sequences
under $M_2'$'s policy, so $T_A(\tau_3) \not\sim_{D,M_2'} T_A(\tau_4)$.
$\sim_D$ is preserved for this pair, and by construction (order-preserving
bijection on the underlying trajectory) for every pair. `WitnessConsistentWithRuntime(M_2', T_A(W))` holds whenever it held for
$W$ under $M_1$.

**What this establishes:** one instance where $\sim_D$-preservation and
witness-validity transfer co-occur. It does **not** establish sufficiency
in general — $T_A$ is close to the identity map on the relevant structure;
a harder test of sufficiency would need a $T$ that preserves $\sim_D$
while doing nontrivial structural work (e.g. a bijective re-encoding into
a genuinely different data structure). No such $T$ is constructed here;
this remains open (§4).

## 2. Case B — Structurally compatible, transport-unsound

This is the existing counterexample
(`2026-07-28-st017-syntactic-transport-counterexample.md`), restated for
comparison: `ordered trajectory → multiset trajectory`. Schema-compatible
(Axiom 1, Axiom 4 hold), $\sim_D$ **not** preserved
($\tau_3 \not\sim_{D,M_1} \tau_4$ but $T(\tau_3) \sim_{D,M_2} T(\tau_4)$),
and `WitnessConsistentWithRuntime` fails for the transported witness.

**What this establishes:** a case where $\sim_D$-non-preservation and
witness-validity failure co-occur — but this is the same contrapositive
relationship the definition was built from (§3 of the preservation note),
not independent evidence. It does not, by itself, show that
$\sim_D$-preservation is *necessary* for soundness in general — only that
*this* failure of soundness is *explained by* a failure of
$\sim_D$-preservation. A genuine necessity test would require a case where
soundness fails despite $\sim_D$ being preserved; no such case is
constructed here either (§4).

## 3. Case C — Partially sound transport

**Construction:** $T_C$ maps $M_1$'s full ordered trajectory
`[r_0, r_1, ..., r_n]` to a **bounded window** encoding
`(r_0, r_{n-1}, r_n)` — first state and last two states only, discarding
interior history. This is a plausible real-world transport (a runtime with
bounded memory retaining only entry point and recent context).

Consider two witness pairs under $C_{\text{temporal}}$:

- **Pair 1** (boundary-sensitive): $\tau_5 = (r_0, r_1, r_2)$ vs.
  $\tau_6 = (r_0', r_1, r_2)$ — differ only in the *first* state (this is
  literally ST-016's Example 1 pair). $T_C(\tau_5) = (r_0, r_1, r_2)$,
  $T_C(\tau_6) = (r_0', r_1, r_2)$ — the differing first state survives the
  window. $\sim_D$ is preserved for this pair; transport is sound here.
- **Pair 2** (interior-sensitive): $\tau_7 = (r_0, r_1, r_2, r_3, r_4)$ vs.
  $\tau_8 = (r_0, r_2, r_1, r_3, r_4)$ — differ only in an interior swap
  (positions 1–2), *outside* the 2-element tail window $T_C$ retains.
  $T_C(\tau_7) = (r_0, r_3, r_4) = T_C(\tau_8)$ — the window collapses the
  distinction regardless of what it was. If $\pi_{M_1}$ is sensitive to
  this interior swap (analogous to $\tau_3/\tau_4$ in the original
  counterexample), $\sim_D$ is **not** preserved for this pair, and
  transport is unsound here.

**What this establishes:** a single transport map $T_C$ is
$\sim_D$-preserving for some witness pairs and not for others, under the
*same* runtime pair $M_1 \to M_2$. "Is $T$ decision-sound" is not a
yes/no fact about the pair $(M_1, M_2, T)$ — it depends on *which*
witness, and more specifically on which capability-relevant distinction
that witness encodes (boundary vs. interior, in this construction).

## 4. Open problems (updated from the preservation note)

- **Necessity — still open.** Case B shows non-preservation co-occurring
  with unsoundness, but that's the defining contrapositive, not
  independent evidence. No case here exhibits soundness failing *despite*
  $\sim_D$ being preserved — constructing (or ruling out) such a case is
  the actual necessity test, and remains future work.
- **Sufficiency — still open, and now looks unlikely to hold globally.**
  Case A is consistent with sufficiency but is a near-identity transport,
  not a stress test. Case C is more informative: it suggests
  $\sim_D$-preservation is not a single global fact about $(M_1, M_2, T)$
  at all, which makes "is $\sim_D$-preservation sufficient" a question
  that may not even be well-posed without first fixing the domain over
  which it's evaluated (see next point).
- **New question raised by Case C — is transportability
  capability-relative?** $T_C$ is sound for $C_{\text{temporal}}$
  witnesses that hinge on boundary states and unsound for ones that hinge
  on interior states. This suggests the right unit of analysis may not be
  "$T$ is decision-sound for $M_1 \to M_2$" but "$T$ is decision-sound
  for $M_1 \to M_2$ *restricted to capability $C$*" — echoing how
  ST-016's Axiom0 relates the decision kernel to per-capability kernels
  $K_D$ rather than to $\pi_M$ as an undifferentiated whole
  (`paper/sections/03-foundations.tex`). Whether preservation should be
  required globally (over all of $\mathcal{R}_{M_1}$) or only over the
  subset of distinctions each $C \in \mathcal{K}_D$ actually depends on is
  now the central open question for Phase III.1 — more central than the
  original necessity/sufficiency framing, which implicitly assumed a
  single global answer.
- **Composition — still open**, and Case C adds a wrinkle: if
  soundness is capability-relative, composing two capability-relative
  transports may preserve soundness for the intersection of capabilities
  each was sound for, not their union. Not explored here.
- **Relation to Axiom 2 — still open**, unchanged from the previous note.

## 5. What this note does not do

Does not conclude that $\sim_D$-preservation is necessary, sufficient, or
the right level of granularity — it concludes that the question needs to
be split (per-capability vs. global) before necessity/sufficiency can be
meaningfully asked. Does not modify Axiom 4 or add any new axiom. Does not
add Lean code or touch `paper/`, ST-016 kernel definitions, or
`RuntimeSufficiency.lean`. The three options named in prior discussion —
extending Axiom 4, adding an independent axiom, or scoping the condition
to specific capability domains — remain undecided; this note's main
contribution is evidence favoring the third option being investigated
first, not a decision to adopt it.
