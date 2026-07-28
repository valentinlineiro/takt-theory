# ST-017 Transport Obligation: Granularity and Composition

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no
axiom added or changed.
**Depends on:** [`2026-07-28-st017-capability-relative-transportability.md`](2026-07-28-st017-capability-relative-transportability.md)

## Block 1 — Capability-level vs. relation-level preservation

### 1.1 Why capability alone is too coarse

$\mathrm{Sound}(T, c)$ (previous note, §4) universally quantifies over
*every* pair attributed to $c$. Case C already falsified this universal
for $T_C$ and $c = C_{\text{temporal}}$ using a single counterexample
pair — but the boundary-pair half of Case C *did* satisfy the obligation.
$\mathrm{Sound}(T, c)$ as a single true/false fact discards that
structure: it can only say "no" once any pair fails, even when a large,
well-defined subset of $c$'s witnesses transport correctly.

### 1.2 Relation-level preservation

Introduce a sub-relation $R \subseteq \mathcal{R}_{M_1} \times \mathcal{R}_{M_1}$
restricting which $c$-attributed pairs the obligation is checked against:

$$\mathrm{Sound}(T, c, R) \;:\Leftrightarrow\; \forall x, y: \; R(x,y) \wedge \mathrm{Attributes}(c, M_1, x, y) \;\Rightarrow\; \pi_{M_2}(T(x)) \neq \pi_{M_2}(T(y))$$

$\mathrm{Sound}(T, c) = \mathrm{Sound}(T, c, \top)$ (the previous,
unrestricted notion) is the coarsest case. Case C's two pairs instantiate
two natural sub-relations:

- $R_{\text{boundary}}(x, y) :\Leftrightarrow$ $x, y$ differ only in their
  first element. Case C: $\mathrm{Sound}(T_C, C_{\text{temporal}}, R_{\text{boundary}})$
  holds (verified for $\tau_5, \tau_6$; consistent with $T_C$'s
  construction, which always retains the first element).
- $R_{\text{interior}}(x, y) :\Leftrightarrow$ $x, y$ differ only outside
  the retained tail window. Case C: $\mathrm{Sound}(T_C, C_{\text{temporal}}, R_{\text{interior}})$
  fails (the hypothetical $\tau_7', \tau_8'$ pair, per that note's own
  caveat that the premise — $\pi_{M_1}$ actually caring about this swap —
  was posited, not established).

### 1.3 Where granularity bottoms out

At the finest extreme, $R$ could be the identity relation on a single
witnessed pair — at that point $\mathrm{Sound}(T, c, R)$ is a fact about
one instance, true or false by direct computation, and calling it a
"relation" adds no content beyond "check this one pair." That extreme is
uninformative as a *transportability theory*: it doesn't generalize to
unseen witnesses. The open question is not whether finer grains than $c$
exist (they trivially do, down to single pairs) but whether there is a
grain **coarser than single pairs and finer than the whole capability**
that is *structurally motivated* — tied to some feature of $T$ or of
$c$'s decision-relevant structure, not just "whichever pairs happened not
to fail." $R_{\text{boundary}}$/$R_{\text{interior}}$ are structurally
motivated in this sense (they correspond to what $T_C$'s window keeps vs.
discards); a general theory would need a way to derive such $R$ from $T$
and $c$ rather than reverse-engineering it from a known counterexample,
which is what was done here. No such derivation is attempted in this
note.

This mirrors, at a different layer, how ST-016's own evidence matrix
(`paper/sections/05-evaluation.tex`) already grades claims by scope —
"Lean model" vs. "3 witness scenarios" vs. "TypeScript" are exactly a
coarse-to-fine spectrum of how much a claim generalizes past what was
directly checked.

## Block 2 — Composition

### 2.1 The question

Given $T_{12} : M_1 \to M_2$ with $\mathrm{Sound}(T_{12}, c)$ and
$T_{23} : M_2 \to M_3$ with $\mathrm{Sound}(T_{23}, c)$, does
$\mathrm{Sound}(T_{23} \circ T_{12}, c)$ hold?

### 2.2 Attempted proof, and where it breaks

Take $x, y \in \mathcal{R}_{M_1}$ with $\mathrm{Attributes}(c, M_1, x, y)$.
By $\mathrm{Sound}(T_{12}, c)$: $\pi_{M_2}(T_{12}(x)) \neq \pi_{M_2}(T_{12}(y))$.
Write $u = T_{12}(x)$, $v = T_{12}(y)$. To invoke
$\mathrm{Sound}(T_{23}, c)$ and conclude
$\pi_{M_3}(T_{23}(u)) \neq \pi_{M_3}(T_{23}(v))$, its premise
$\mathrm{Attributes}(c, M_2, u, v)$ is required — which by definition
(previous note, §3) needs **both**:

1. $\pi_{M_2}(u) \neq \pi_{M_2}(v)$ — established above, and
2. $\pi_{M_2 \setminus \{c\}}(u) = \pi_{M_2 \setminus \{c\}}(v)$ — that
   $c$ *specifically* is what distinguishes $u, v$ in $M_2$, not some
   other capability, or a combination.

$\mathrm{Sound}(T_{12}, c)$ only supplies (1). It says nothing about
which capability of $M_2$ is responsible for the surviving distinction —
by its own definition (previous note, §4: "regardless of whether $c$ …
is what preserves it on the $M_2$ side"), that was an intentional
weakening. So the proof cannot proceed: **composition does not follow
from the two soundness facts as currently defined.** This is not a
failure to find a clever argument; the second premise of
$\mathrm{Attributes}$ is simply not implied by anything
$\mathrm{Sound}(T_{12}, c)$ states.

### 2.3 Two ways to close the gap (neither adopted here)

- **(a) Strengthen $\mathrm{Sound}(T, c)$** to require the full
  $\mathrm{Attributes}(c, M_2, T(x), T(y))$ as the consequent, not just
  $\pi_{M_2}(T(x)) \neq \pi_{M_2}(T(y))$. This makes the composition
  proof in §2.2 go through directly (chain the strengthened consequent
  into the next map's premise). Cost: it is a strictly stronger, and
  possibly too strong, requirement — a transport that preserves a
  decision but causes a *different* capability to become "responsible"
  for it in $M_2$ would fail this stronger condition, even though the
  decision itself, and arguably the witness's practical validity, is
  unaffected.
- **(b) Keep $\mathrm{Sound}(T, c)$ as is** and add composition as a
  separate, explicit hypothesis whenever chaining transports — i.e. do
  not assume composability; require it to be checked (or proven) at each
  chain, the same way `NecessaryCapability` witnesses are checked
  per-instance rather than assumed to generalize (`ST016_Conjecture`,
  `paper/sections/07-limitations.tex`, is the precedent for refusing to
  assume a universal without proof).

No decision is made between (a) and (b) here. (a) trades weaker
compositionality for a stronger per-map obligation; (b) keeps the weaker
obligation but pushes the composition question to whoever chains
transports.

## 3. What this note does not do

Does not decide the granularity question (§1.3) or the composition
question (§2.3) — it locates precisely where each becomes hard and shows,
via a checked proof attempt rather than assertion, that composition is
genuinely blocked by the existing definition, not merely unproven. No
axiom added or changed, no Lean code, no runtime implementation, no
change to ST-016 or `paper/`.
