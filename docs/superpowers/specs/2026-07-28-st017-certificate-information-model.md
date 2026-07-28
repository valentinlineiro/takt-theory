# ST-017 Certificate Information Model: What Must Actually Be Retained?

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no
axiom added or changed. Does not define `PortableGovernanceCertificate`.
**Depends on:** [`2026-07-28-st017-certificate-consumers-and-weakest-link.md`](2026-07-28-st017-certificate-consumers-and-weakest-link.md)

## 1. The question, made checkable

Before comparing Snapshot / Chain-provenance / Full-trace as certificate
models, there's a prior fact worth pinning down: **is history ever
actually required to answer a capability-level question, or can it always
be recomputed from the endpoint alone?** This has a definite answer,
because `Attributes` was defined (in `2026-07-28-st017-capability-relative-transportability.md`,
§3) purely in terms of a single runtime and representations within it:

$$\mathrm{Attributes}(c, M, u, v) \;:\Leftrightarrow\; \pi_M(u) \neq \pi_M(v) \;\wedge\; \pi_{M \setminus \{c\}}(u) = \pi_{M \setminus \{c\}}(v)$$

Every term on the right refers only to $M$ and $u, v \in \mathcal{R}_M$ —
nothing about $M$'s predecessors, no transport map, no earlier witness.
**Whenever $c$ remains a named capability of $M_{\text{final}}$**, and
the final representations $u = T(x), v = T(y)$ are in hand,
$\mathrm{Attributes}(c, M_{\text{final}}, u, v)$ — and hence whether a
$\mathrm{CapabilitySound}$-level claim about $c$ currently holds — is
**directly computable at the endpoint, with no history at all.** This
holds regardless of how degraded the chain's certificate level was along
the way (previous note's weakest-link result is about what a certificate
*built by composing per-hop guarantees* can claim without re-checking;
it says nothing about what re-checking at the endpoint can recover).

This sharpens the question from "does provenance let us recover lost
information" (previous message's framing) to: **when, specifically, is
re-derivation at the endpoint unavailable, such that provenance is the
only way to answer a claim?**

## 2. Two distinct reasons history could matter

**(i) Cost.** Re-running the ablation check ($\pi_{M \setminus \{c\}}$)
at the endpoint for every capability, for every witness, on demand, is
exactly the cost `WitnessArtifact` was introduced in ST-016 to avoid —
the whole point of a witness is to let a consumer trust
`WitnessConsistentWithRuntime(M, w)` without re-running EXP-004-style
ablation themselves (`paper/sections/04-formalization.tex`). A recorded
history (even just the final `Attributes` result, cached) serves this
purpose. This is a real reason to retain information, but it is an
*engineering* reason — the information is not lost, only expensive to
regenerate — and it applies equally to a Snapshot-only model (caching the
one endpoint check) as to a full trace.

**(ii) Genuine unrecoverability.** $\mathrm{Attributes}(c, M_{\text{final}}, \cdot, \cdot)$
cannot be computed at all if $c$ is **not a capability of
$M_{\text{final}}$'s schema** — e.g. some hop's transport failed Axiom 1
(Capability Geometry Preservation, `2026-07-27-st017-witness-transportability-design.md`
§2) for $c$ specifically, so $c$ was dropped rather than merely
outcompeted by another capability. In this case there is no ablation to
run at the endpoint — $M \setminus \{c\}$ isn't a meaningful operation if
$c \notin \mathcal{C}_{M_{\text{final}}}$. The claim "$c$ was necessary
for this witness" can only be recovered by looking at the last runtime in
the chain where $c$ still existed, i.e. **only from history.** This is
the one case where provenance is not a convenience but the sole source of
the information.

Case (i) covers *degradation* (the $C_{\text{temporal}} \to C_{\text{uncertainty}}$
shift from the composition note — $C_{\text{temporal}}$ still exists in
$M_2$'s schema, it's just no longer the attributor, and this is directly
checkable at $M_2$ without history). Case (ii) covers *disappearance* —
a strictly different, and strictly less recoverable, failure mode that
hasn't been named on this branch until now.

## 3. Revisiting the three models against (i) vs. (ii)

| Model | Recovers case (i) claims? | Recovers case (ii) claims? | Cost |
| :--- | :--- | :--- | :--- |
| **Snapshot** (endpoint + ability to re-run ablation on $M_{\text{final}}$) | Yes — direct recomputation, per §1 | No — nothing to compute once $c$ is gone | Cheapest to store, most expensive to query repeatedly |
| **Chain provenance** (per-hop level, no full witness replay) | Yes, and cheaply (cached, no recomputation) | Only if the record includes *at which hop* $c$ disappeared, i.e. the schema-membership fact, not just the soundness level | Moderate |
| **Full trace** (every intermediate witness + runtime) | Yes | Yes — can reconstruct $\mathrm{Attributes}(c, M_k, \cdot, \cdot)$ at whichever $M_k$ still had $c$ | Highest |

This refines the comparison from the previous message's version: the
distinguishing question per row isn't "does it conserve history" in
general, it's specifically whether the record retains **schema membership
per hop** (which capabilities existed in each intermediate runtime), not
soundness *levels* per hop. A Chain-provenance model that records "Hop 2:
KernelSound" without recording "and $C_{\text{temporal}}$ was no longer a
capability of $M_2$ at all" cannot distinguish case (i) from case (ii) —
both look like "degraded to KernelSound" from the level alone, but only
one of them is recoverable by re-checking the current endpoint.

## 4. Answering "is provenance part of the certificate or auxiliary evidence?"

Given §2–3, the answer splits, not a single yes/no:

- For **case (i)** information (which capability currently attributes a
  decision), provenance is **auxiliary** — reconstructible on demand from
  the endpoint runtime and representations, exactly as ST-016's
  replication package is auxiliary evidence *for* the Lean proofs rather
  than part of the formal claim itself (`paper/sections/05-evaluation.tex`
  evidence matrix: "Lean model" vs. "Runtime engineering" are separate
  rows precisely because one doesn't need the other to be re-verified).
- For **case (ii)** information (which capabilities existed at
  intermediate stages before some dropped out), provenance is **not**
  auxiliary — it is the only source, so any certificate that wants to
  support claims like "$c$ was necessary somewhere in this chain, even
  though it's not representable anymore" must carry that fact as content,
  not point to reconstructible evidence.

This is the ST-016 parallel the previous message drew, made precise
rather than asserted by analogy: ST-016 could separate artifact / evidence
/ runtime because the Lean proofs don't need the TypeScript runtime to
remain re-checkable (`paper/sections/05-evaluation.tex`'s three evidence
rows are independently valid). ST-017's analogous separation is not
"certificate vs. trace" wholesale — it is "current-endpoint claims
(auxiliary trace, like ST-016) vs. schema-membership history for
capabilities that stopped existing (irreducible certificate content,
unlike anything in ST-016, which never has this failure mode because
$\mathcal{K}_D$ is fixed and never ablated *from the schema*, only
ablated *for a specific necessity check* while remaining nominally part
of $\mathcal{C}$)."

## 5. What this note does not do

Does not define `PortableGovernanceCertificate` or any data structure.
Does not decide whether schema-membership history (§4, case ii) should be
recorded per-hop always, or only lazily when a capability is about to be
dropped. Does not revisit or weaken the weakest-link result — §1's
endpoint-recomputability point is about what a *fresh* re-check can
establish, not about what a *composed-without-rechecking* certificate can
claim, which remains exactly as constrained as the previous note found.
No axiom added or changed, no Lean code, no runtime implementation, no
change to ST-016 or `paper/`.
