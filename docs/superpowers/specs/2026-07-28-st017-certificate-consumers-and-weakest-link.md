# ST-017 Certificate Consumers and the Weakest-Link Property

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no
axiom added or changed.
**Depends on:** [`2026-07-28-st017-certificate-granularity.md`](2026-07-28-st017-certificate-granularity.md)

## 1. The question

The previous note left $\mathrm{KernelSound}$ vs. $\mathrm{CapabilitySound}$
as a design choice orthogonal to composability. This note asks what
determines the choice: what does a consumer of a transported certificate
actually need to check, and — for a multi-hop chain, which is the
realistic case ST-017 cares about — does a "layered, optional" certificate
(kernel guarantee always, capability provenance as an add-on) actually
behave the way that phrase suggests?

## 2. Two consumer archetypes, stated precisely

- **Governance verifier.** Asks: "is the decision this runtime just made
  still backed by *some* member of $\mathcal{K}_D$, i.e. is the minimal
  governance kernel as a whole still doing its job after transport?"
  This is exactly what $\mathrm{KernelSound}$ certifies — it doesn't need
  to know *which* capability, only that the kernel's collective guarantee
  ("removing any capability breaks preservation," `paper/sections/03-foundations.tex`)
  hasn't silently stopped applying to this witness.
- **Scientific claim verifier.** Asks a narrower, named question: "does
  the specific claim '$C_{\text{temporal}}$ is necessary for this
  witness' still hold after the witness was transported?" This is a
  claim about one named capability, not the kernel collectively — exactly
  what $\mathrm{CapabilitySound}$ certifies and $\mathrm{KernelSound}$
  cannot (by construction: $\mathrm{KernelSound}$'s existential
  deliberately discards which capability was the witness).

These are not just informally different; §2 of the previous note already
proved $\mathrm{CapabilitySound}(T) \Rightarrow \mathrm{KernelSound}(T)$
and not the reverse direction. So a governance verifier can always accept
whatever a scientific claim verifier accepts (downcast the stronger
certificate), but not vice versa. This alone establishes the "layers, not
exclusive choice" intuition for a **single transport** $T$: one
certificate, computed at whatever level $T$ actually achieves, serves
both consumers whenever that level is $\mathrm{CapabilitySound}$, and
serves only the governance verifier when it's $\mathrm{KernelSound}$
only.

## 3. Where the "optional add-on" framing breaks down: chains

The realistic case is a chain $T_{23} \circ T_{12}$ across three runtimes,
where each hop might have been certified independently (by different
teams, at different times) and possibly at different levels. Check: if
$T_{12}$ is $\mathrm{CapabilitySound}$ but $T_{23}$ is only
$\mathrm{KernelSound}$ (not $\mathrm{CapabilitySound}$), what level does
$T_{23} \circ T_{12}$ achieve?

**Claim: $\mathrm{KernelSound}(T_{23} \circ T_{12})$, and no stronger
claim is derivable from these hypotheses.**

*Proof.* $\mathrm{CapabilitySound}(T_{12}) \Rightarrow \mathrm{KernelSound}(T_{12})$
(hierarchy, previous note §2). Now both $T_{12}$ and $T_{23}$ are
$\mathrm{KernelSound}$, and $\mathrm{KernelSound}$ composes (previous
note §3), so $\mathrm{KernelSound}(T_{23} \circ T_{12})$ holds. Nothing in
the hypotheses supplies $\mathrm{Attributes}(c, M_3, \cdot, \cdot)$ for a
*fixed* $c$ carried from $T_{12}$'s certificate — $T_{23}$'s own
certificate only ever promised the existential, so the composed
certificate cannot promise more than the existential either. $\blacksquare$

**Consequence — this is the weakest-link property**: the certificate
level of a chain is the minimum, over its hops, of each hop's individual
level (under the order $\mathrm{CapabilitySound} > \mathrm{KernelSound} >$
no-composable-guarantee, since `DecisionSound` doesn't compose at all —
if any hop only achieves $\mathrm{DecisionSound}$, the chain has *no*
guarantee derivable through composition, not merely a downgraded one; it
would require directly re-verifying the composed transport, defeating the
purpose of certifying hops independently).

This is a real correction to the "optional add-on" phrasing from prior
discussion, not just a restatement of it: **capability provenance is not
something you can attach to a chain after the fact if any single hop
didn't preserve it.** A scientific claim verifier cannot accept "the
chain is $\mathrm{CapabilitySound}$" on the strength of most hops being
$\mathrm{CapabilitySound}$ plus one being merely $\mathrm{KernelSound}$ —
that one hop caps the entire chain at $\mathrm{KernelSound}$, and the
named-capability claim is lost for every witness that routes through it,
not degraded gracefully. "Layers" describes what a *single* transport's
certificate can offer a consumer (§2); it does not describe how those
levels behave once transports are chained (§3) — there, it is strictly a
weakest-link system.

## 4. Practical reading for the two consumers

- A governance verifier's requirement ($\mathrm{KernelSound}$) survives
  chaining through hops of *either* level, since both compose to at least
  $\mathrm{KernelSound}$ (§3). It is the robust choice for long or
  federated transport chains where not every hop's implementation is
  known to preserve capability identity.
- A scientific claim verifier's requirement ($\mathrm{CapabilitySound}$)
  is fragile under chaining: it demands every hop, without exception,
  achieve $\mathrm{CapabilitySound}$. This is a strong requirement to
  impose on a multi-party transport chain, and suggests that claims of
  the form "$C_{\text{temporal}}$ is necessary" transported across
  several runtimes are a materially harder guarantee to obtain than
  "some capability in $\mathcal{K}_D$ remains sufficient" — not just a
  stronger statement in isolation (already known from §2) but one with
  a much stricter chain-wide precondition.

## 5. Open question this raises

Given §3, is there value in a certificate that records *which hops*
achieved $\mathrm{CapabilitySound}$ even when the overall chain doesn't
(i.e., a partial-provenance trail rather than a single pass/fail level)?
That would let a scientific claim verifier ask a narrower question than
"does the whole chain preserve $C_{\text{temporal}}$" — e.g. "does the
claim survive up to hop $k$" — without requiring the property in §3 to be
relaxed. Not explored here; it would start to look like an actual
certificate data structure (a list of per-hop levels), which edges toward
formalization this branch has been deliberately deferring.

## 6. What this note does not do

Does not decide whether ST-017's eventual certificate object should carry
per-hop provenance (§5). Does not modify any prior note's definitions —
$\mathrm{DecisionSound}$, $\mathrm{KernelSound}$, $\mathrm{CapabilitySound}$
and the hierarchy proof stand as given in the previous note. No axiom
added or changed, no Lean code, no runtime implementation, no change to
ST-016 or `paper/`.
