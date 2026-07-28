# ST-017 Capability-Relative Transportability

**Status:** Open model-refinement note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no new
axiom, no change to `Axiom 4` in the main design spec.
**Depends on:** [`2026-07-28-st017-decision-equivalence-analysis.md`](2026-07-28-st017-decision-equivalence-analysis.md)
(Case C), [`2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md)

## 1. What Case C actually found

Case C constructed one transport $T_C$ that was $\sim_D$-preserving for a
boundary-sensitive $C_{\text{temporal}}$ witness pair and
$\sim_D$-collapsing for an interior-sensitive pair, under the same
$(M_1, M_2, T_C)$. That result means $\mathrm{Sound}(T)$ — "is this
transport decision-sound" as a single yes/no fact — is the wrong shape of
question. This note reformulates the target as $\mathrm{Sound}(T, C)$:
soundness relative to a specific capability's decision-relevant
distinctions, and asks what that should mean formally.

## 2. Existing state-level precedent

`StructuralSufficiency.lean` already makes exactly this move, one layer
down (over full states $S$, for ST-015's sufficiency question, not over
runtime representations $\mathcal{R}$ for ST-016/ST-017's necessity
question):

```lean
def K_D (x y : S) : Prop :=
  ∀ c, C_D c → K c x y
```

`K_D` is the intersection of per-capability kernels `K c`; `Axiom0`
(`kernel D x y ↔ K_D K C_D x y`) ties the *global* decision kernel to that
intersection. This is the formal object Case C's finding is the runtime
analogue of: a global equivalence built from capability-local pieces, so
a transport can respect one piece and not another. The construction below
is a **new, runtime-layer definition inspired by this pattern**, not a
reuse of `K_D`/`K` — those are defined over $S$ with a fixed capability
kernel function `K : Capability → S → S → Prop` given upfront; ST-017
needs the analogous notion defined over *two different runtimes'*
representations, connected by $T$, which `StructuralSufficiency.lean`
does not provide.

## 3. Definition: capability-attributed distinction

Using the vocabulary already in `RuntimeSufficiency.lean`/
`paper/sections/03-foundations.tex` (`NecessaryCapability`,
$M \setminus \{C\}$ for ablation), define: capability $c$ **attributes**
the distinction between $x, y \in \mathcal{R}_M$ under runtime $M$ when
removing $c$ collapses a distinction that was present with $c$ intact:

$$\mathrm{Attributes}(c, M, x, y) \;:\Leftrightarrow\; \pi_M(x) \neq \pi_M(y) \;\wedge\; \pi_{M \setminus \{c\}}(x) = \pi_{M \setminus \{c\}}(y)$$

This is deliberately phrased to match `NecessaryCapability`'s existential
witness shape (`∃ r, M.policy r ≠ (M \ C).policy r`,
`04-formalization.tex`) rather than introduce a free-standing per-capability
kernel predicate — a witness pair for `NecessaryCapability(c, M)` is
exactly a pair $(x,y)$ with $\mathrm{Attributes}(c, M, x, y)$. ST-016's
Example 1 pair $(R^1, R^2)$ is the canonical instance:
$\mathrm{Attributes}(C_{\text{temporal}}, M, R^1, R^2)$ holds.

## 4. Definition: capability-relative transport soundness

$$\mathrm{Sound}(T, c) \;:\Leftrightarrow\; \forall x, y \in \mathcal{R}_{M_1}: \; \mathrm{Attributes}(c, M_1, x, y) \;\Rightarrow\; \pi_{M_2}(T(x)) \neq \pi_{M_2}(T(y))$$

$T$ is sound for capability $c$ when every distinction $c$ is responsible
for in $M_1$ survives into $M_2$ after transport — regardless of whether
$c$ (or any capability) is what preserves it on the $M_2$ side; the
obligation is only that the *decision* differs, matching the weaker,
per-witness form already used in the preservation note (§5 there).

**Re-reading Case C through this definition** (both pairs carry the same
caveat the source note used: $\mathrm{Attributes}$ presupposes
$\pi_{M_1}$ is actually sensitive to the swap in question, which was
posited for illustration, not established for the reference TypeScript
runtime):

- If $\mathrm{Attributes}(C_{\text{temporal}}, M_1, \tau_5, \tau_6)$
  holds (boundary pair, ST-016 Example 1's own construction — this one
  *is* established), then $\pi_{M_2}(T_C(\tau_5)) \neq \pi_{M_2}(T_C(\tau_6))$
  — the obligation is met for this instance.
- If $\mathrm{Attributes}(C_{\text{temporal}}, M_1, \tau_7', \tau_8')$
  holds (interior pair, hypothetical), then
  $\pi_{M_2}(T_C(\tau_7')) = \pi_{M_2}(T_C(\tau_8'))$ regardless — the
  obligation fails for this instance whenever the premise holds.

So $T_C$ is **not** $\mathrm{Sound}(T_C, C_{\text{temporal}})$ overall
(one counterexample instance is enough to fail the universal
quantifier) — but the definition now lets us ask the sharper question
Case C actually raised: not "is $T$ sound for $C_{\text{temporal}}$" (no,
demonstrated), but "what fraction / which subset of
$C_{\text{temporal}}$-attributed pairs does $T$ preserve" — a question
$\mathrm{Sound}(T,c)$ as a strict universal doesn't have room for, and
that gap is itself worth naming (§6).

## 5. Relation to the design spec's Axiom 4

This does **not** propose rewriting Axiom 4. It proposes that whatever
Axiom 4 eventually becomes should be stated as a conjunction over
capabilities — $\bigwedge_{c \in \mathcal{K}_D} \mathrm{Sound}(T, c)$ —
rather than a single global soundness fact, precisely mirroring how
`K_D` is $\forall c, C_D\, c \to K\, c\, x\, y$ rather than a single
undifferentiated relation. Whether that conjunction should range over all
of $\mathcal{K}_D$, or only the capabilities a specific witness invokes,
is left open (§6).

## 6. Open questions

- **Granularity below "per capability."** Case C's $T_C$ fails
  $\mathrm{Sound}(T_C, C_{\text{temporal}})$ globally but succeeds on a
  strict subset of $C_{\text{temporal}}$-attributed pairs (boundary
  cases). Is "per capability" even the right grain, or does soundness
  need to be indexed by something finer — e.g. per *distinguishing
  feature* (boundary state vs. interior sequence) rather than per named
  capability? `RuntimeSufficiency.lean`'s capability type doesn't carry
  that finer structure today.
- **Partial transportability as a first-class notion.** If $T$ is sound
  for some but not all instances of $c$'s witnesses, is "partially
  transportable" a property worth formalizing (e.g. as a proportion, or
  as a characterization of *which* witnesses survive), or is it better
  treated as: $T$ is simply unsound for $c$, and partial results are an
  engineering observation rather than a theoretical category? This note
  takes no position.
- **The central open question for ST-017**, restated precisely now:
  *does there exist a transport $T$ and a governance obligation on $T$,
  stated purely in terms of the per-capability relations
  $\mathrm{Attributes}(c, M_1, \cdot, \cdot)$ for $c \in \mathcal{K}_D$,
  such that $\mathrm{WitnessConsistentWithRuntime}(M_2, T(W))$ follows
  for every witness $W$ built from those capabilities?* If yes, this
  connects ST-017 to ST-015/ST-016 the same way `Axiom0` connects the
  decision kernel to capability kernels — transportability soundness
  would be *derived from* the same capability-relative structure ST-016
  already uses to establish necessity, rather than a separate condition
  invented for ST-017. If no (or only for restricted $\mathcal{K}_D$
  subsets), that is itself the interesting negative result.

## 7. What this note does not do

Does not add or modify any axiom in the design spec. Does not claim
$\mathrm{Sound}(T, c)$ is sufficient, or that per-capability decomposition
resolves necessity/sufficiency — it only gives the reformulated question a
precise shape so the next case-construction step (testing whether
per-capability soundness composes, or whether finer-than-capability
granularity is required) has definitions to build on. No Lean code, no
runtime implementation, no change to ST-016 or `paper/`.
