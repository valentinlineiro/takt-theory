# ST-017 Certificate Granularity: What Does a Portable Governance Certificate Claim?

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no
axiom added or changed.
**Depends on:** [`2026-07-28-st017-compositional-soundness-obligation.md`](2026-07-28-st017-compositional-soundness-obligation.md)

## 1. Naming the three levels precisely

The prior notes defined three notions without arranging them against each
other. To compare them they need to be stated at the same grain — each
quantified over the *whole* capability kernel $\mathcal{K}_D$, not a
single fixed $c$, since $\mathrm{KernelSound}$ is inherently kernel-wide
and comparing it to a single-$c$ statement is a category mismatch:

$$\mathrm{DecisionSound}(T) :\Leftrightarrow \forall c \in \mathcal{K}_D.\ \mathrm{Sound}(T, c)$$
$$\mathrm{KernelSound}(T) :\Leftrightarrow \forall x,y.\ \left(\exists c \in \mathcal{K}_D.\ \mathrm{Attributes}(c,M,x,y)\right) \Rightarrow \left(\exists c' \in \mathcal{K}_D.\ \mathrm{Attributes}(c',M',T(x),T(y))\right)$$
$$\mathrm{CapabilitySound}(T) :\Leftrightarrow \forall c \in \mathcal{K}_D.\ \mathrm{Sound}'(T, c)$$

(using $\mathrm{Sound}$, $\mathrm{Sound}'$, $\mathrm{KernelSound}$ exactly
as defined in the previous two notes.)

## 2. A provable hierarchy, not just a table

**Claim: $\mathrm{CapabilitySound}(T) \Rightarrow \mathrm{KernelSound}(T) \Rightarrow \mathrm{DecisionSound}(T)$.**

*First implication.* Suppose $\mathrm{CapabilitySound}(T)$ and
$\exists c \in \mathcal{K}_D.\ \mathrm{Attributes}(c,M,x,y)$. Fix that
$c$; $\mathrm{Sound}'(T,c)$ (from the universal) gives
$\mathrm{Attributes}(c,M',T(x),T(y))$, which witnesses the existential
$\exists c' \in \mathcal{K}_D.\ \mathrm{Attributes}(c',M',T(x),T(y))$
with $c' = c$. So $\mathrm{KernelSound}(T)$ holds.

*Second implication.* Suppose $\mathrm{KernelSound}(T)$ and fix any
$c \in \mathcal{K}_D$ with $\mathrm{Attributes}(c,M,x,y)$. Its existential
premise is satisfied ($c$ itself witnesses it), so $\mathrm{KernelSound}$
gives $\exists c' \in \mathcal{K}_D.\ \mathrm{Attributes}(c',M',T(x),T(y))$
— and $\mathrm{Attributes}(c',M',u,v)$'s first conjunct is
$\pi_{M'}(u) \neq \pi_{M'}(v)$, which is exactly $\mathrm{Sound}(T,c)$'s
consequent for the original $x,y$, regardless of which $c'$ ended up
being the witness. This holds for arbitrary $c \in \mathcal{K}_D$, so
$\mathrm{DecisionSound}(T)$ holds.

Neither converse is claimed or needed here.

## 3. Which levels compose — checked against the strict hierarchy

- $\mathrm{CapabilitySound}$: composes. If $\mathrm{CapabilitySound}(T_{12})$
  and $\mathrm{CapabilitySound}(T_{23})$, then for every
  $c \in \mathcal{K}_D$, $\mathrm{Sound}'(T_{12},c)$ and
  $\mathrm{Sound}'(T_{23},c)$ hold, so by the direct-transitivity proof in
  the previous note $\mathrm{Sound}'(T_{23} \circ T_{12}, c)$ holds — for
  every $c$, hence $\mathrm{CapabilitySound}(T_{23} \circ T_{12})$.
- $\mathrm{KernelSound}$: composes, by the same transitivity argument
  applied to the existential form (previous note, §4).
- $\mathrm{DecisionSound}$: **does not compose**, and quantifying over
  every $c$ does not rescue it. The obstruction found in
  `2026-07-28-st017-transport-obligation-granularity.md` (§2.2) is
  per-$c$ and structural: $\mathrm{Sound}(T_{12},c)$'s consequent
  ($\pi_{M_2}(T_{12}(x)) \neq \pi_{M_2}(T_{12}(y))$) simply does not
  contain the information $\mathrm{Sound}(T_{23},c)$'s premise needs
  (which specific capability, if any, is now responsible). Having this
  gap at every $c$ independently, rather than one $c$, does not close
  it — there is no cross-$c$ information to borrow from, since each
  instance of the obstruction is self-contained.

This is the counterintuitive part worth stating plainly: the *weakest*
of the three levels — the one that discards the most information per
hop — is the one that fails to compose, while both *stronger* levels
compose cleanly. Composability here is not about how strong a guarantee
is in isolation; it's about whether a guarantee's conclusion supplies
exactly what the next hop's premise consumes. $\mathrm{DecisionSound}$'s
conclusion (bare inequality) is strictly less than what `Attributes`
(any hop's premise) requires; the two stronger notions were built so the
conclusion and the next premise are the same shape.

## 4. Answering the "single certificate or family" question

Given §2–3, the choice isn't between three equally valid options — it's
constrained by which ones survive chaining at all:

- $\mathrm{DecisionSound}$ **cannot** serve as the per-hop contract in a
  multi-runtime transport chain; it isn't composable, full stop. It can
  only be asserted about a *direct*, non-composed transport, or as a
  claim about the *endpoints* of an already-established chain (which it
  gets for free — see §2 — once a composable notion holds along the way).
- $\mathrm{KernelSound}$ and $\mathrm{CapabilitySound}$ are both viable
  per-hop contracts. The choice between them is exactly the tradeoff
  named in the previous note (§3–4 there): $\mathrm{CapabilitySound}$
  preserves which named capability is responsible (needed if a
  downstream claim is capability-specific, e.g. "the transported witness
  still supports *$C_{\text{temporal}}$* is necessary"); $\mathrm{KernelSound}$
  only preserves that *some* capability in $\mathcal{K}_D$ is responsible
  (sufficient if the downstream claim is only "the minimal governance
  kernel as a whole remains necessary and sufficient," not which specific
  member of it did the work for this witness).

So: **not a single certificate, but not an arbitrary family either — a
two-tier one, forced by the composability requirement rather than chosen
for convenience.** A portable governance certificate for a transport
chain needs at minimum a $\mathrm{KernelSound}$-level guarantee to be
composable at all; whether it additionally carries
$\mathrm{CapabilitySound}$-level attribution is a separate design choice
that should be driven by what claims the certificate's consumer needs to
reconstruct downstream — not by composability, since both compose
equally well.

## 5. Open question this raises, not answered here

$\mathrm{DecisionSound}$ being useful only at endpoints (§4) suggests a
certificate might be structured as: a $\mathrm{KernelSound}$ (or
$\mathrm{CapabilitySound}$) proof obligation *per hop*, discharged
incrementally as a chain is built, with the corresponding
$\mathrm{DecisionSound}$ conclusion derived once, at the point the
certificate is consumed, via §2's implication — rather than re-checked at
every hop. Whether that incremental-obligation structure is what
`WitnessConsistentWithRuntime` should be generalized to for multi-runtime
chains is the natural next question, but it starts to brush against
actual formalization (a proof-carrying certificate object), which this
note stops short of per the branch's standing discipline.

## 6. What this note does not do

Does not decide between $\mathrm{KernelSound}$ and $\mathrm{CapabilitySound}$
as *the* per-hop contract — it establishes that the choice is real and
independent of composability, which was the open question left by the
previous note. Does not modify any prior note's definitions. No axiom
added or changed, no Lean code, no runtime implementation, no change to
ST-016 or `paper/`.
