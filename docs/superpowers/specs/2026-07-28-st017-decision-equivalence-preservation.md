# ST-017 Decision Equivalence Preservation

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no change
to `Axiom 4` in the main design spec.
**Depends on:** [`2026-07-28-st017-syntactic-transport-counterexample.md`](2026-07-28-st017-syntactic-transport-counterexample.md),
[`2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md)

---

## 1. Motivation

The temporal-witness counterexample showed a transport map $T$ that
satisfies Axiom 1 (Capability Geometry Preservation) and Axiom 4 (Witness
Schema Compatibility) by construction — same field names, same types, no
dropped data — while still destroying the information $\pi^*_S$ needed to
tell two trajectories apart. The list→multiset rewrite was structurally
lossless and decision-lossy at the same time.

That result only establishes a negative: *schema compatibility is not
sufficient*. It does not yet say what *would* be sufficient. This note
proposes a candidate condition — **decision equivalence preservation** —
and, following the ST-016 discipline, treats it as a hypothesis to be
checked for necessity/sufficiency/composition, not as a replacement for
Axiom 4.

## 2. Definition: decision-indistinguishability relation $\sim_D$

For a runtime $M = (\mathcal{C}, \pi_M)$ operating over representations
$\mathcal{R}_M$, define:

$$x \sim_{D,M} y \quad\iff\quad \pi_M(x) = \pi_M(y), \qquad x, y \in \mathcal{R}_M$$

i.e. two representations are decision-indistinguishable under $M$ exactly
when $M$'s policy assigns them the same decision. This mirrors Axiom0 from
ST-016 (`kernel_D(x,y) \leftrightarrow K_D(x,y)`,
`paper/sections/03-foundations.tex`) at the level of a single runtime's
*policy*, rather than the decision kernel's capability relations — a
narrower, runtime-local relation, not a restatement of Axiom0.

$\sim_{D,M}$ is trivially an equivalence relation (reflexive, symmetric,
transitive follow directly from equality of $\pi_M(\cdot)$).

## 3. Transport soundness condition

Given $T : \mathcal{R}_{M_1} \to \mathcal{R}_{M_2}$ (a transport map lifted
from witnesses to the representations they carry — the counterexample
note's $T$ acted this way on trajectory encodings), call $T$
**decision-sound** iff:

$$\forall x, y \in \mathcal{R}_{M_1}: \quad x \sim_{D,M_1} y \;\Rightarrow\; T(x) \sim_{D,M_2} T(y)$$

This is a one-directional implication, deliberately. $T$ collapsing two
representations that $M_1$ *already* treats as equivalent is unproblematic
— the interesting failure, exhibited by the counterexample, is the
opposite: $T$ collapsing two representations $M_1$ treats as *distinct*
($x \not\sim_{D,M_1} y$, i.e. $\pi_{M_1}(x) \neq \pi_{M_1}(y)$) into
representations $M_2$ treats as *the same*
($T(x) \sim_{D,M_2} T(y)$). The counterexample's $\tau_3, \tau_4$ are
exactly such a pair: $\tau_3 \not\sim_{D,M_1} \tau_4$ but
$T(\tau_3) \sim_{D,M_2} T(\tau_4)$, so that $T$ is **not** decision-sound
under this definition — consistent with the counterexample's conclusion.

## 4. Relationship to the existing axioms

| Axiom (design spec §2) | What it checks | What it misses |
| :--- | :--- | :--- |
| Axiom 1 — Capability Geometry Preservation | Capability *sets* are isomorphic between $M_1, M_2$ | Says nothing about how each capability *compares* values |
| Axiom 4 — Witness Schema Compatibility | Witness *records* have compatible fields/types | Says nothing about the equality/ordering semantics those fields carry |
| **Decision-sound $T$ (this note)** | $T$ preserves the *decision-indistinguishability partition*, not just the schema | Untested: whether it is implied by, implies, or is independent of Axiom 2 (Policy Decision Monomorphism) — see §6 |

Axiom 2 (Policy Decision Monomorphism, `paper/sections/03-foundations.tex`-style
statement: $\forall R, \pi_{M_1}(R) = \pi_{M_2}(R) = \pi^*(R)$) is a
*global* condition on the two runtimes agreeing with the ground-truth
policy everywhere. Decision-soundness of $T$ is a *local* condition on one
transport map preserving one runtime's existing partition into another's.
They are not obviously the same statement — Axiom 2 could hold between
$M_1$ and $M_2$ while a particular $T$ still fails to be decision-sound
(a bad transport of an otherwise-compatible pair), and conversely a
decision-sound $T$ says nothing about whether $M_2$'s decisions match
$\pi^*$ at all, only that $T$ doesn't introduce *new* collisions beyond
whatever $M_2$ already has. This gap is exactly what §6's open questions
ask about.

## 5. Minimal proof obligation

Given:
- a transport map $T : \mathcal{R}_{M_1} \to \mathcal{R}_{M_2}$,
- a witness $W_{M_1}$ certifying $\text{NecessaryCapability}(C, M_1)$ via
  some pair $R^1 \neq R^2$ with $\pi_{M_1}(R^1) \neq \pi_{M_1}(R^2)$,

decision-soundness of $T$ restricted to this witness reduces to a single
checkable fact:

$$\pi_{M_2}(T(R^1)) \;\neq\; \pi_{M_2}(T(R^2))$$

This is deliberately weaker than proving $T$ decision-sound over all of
$\mathcal{R}_{M_1}$ (§3) — it is the *per-witness* instance of the
condition, analogous to how ST-016 certifies `NecessaryCapability` via
finite witness instances rather than a universal proof
(`paper/sections/07-limitations.tex`, ST016_Conjecture). A future Lean
statement would encode this as:

```
def DecisionSoundOnWitness (T : R1 -> R2) (M1 : Runtime R1 D) (M2 : Runtime R2 D)
    (w : WitnessArtifact) : Prop :=
  M1.policy w.representation1 <> M1.policy w.representation2 ->
  M2.policy (T w.representation1) <> M2.policy (T w.representation2)
```

No such Lean code is being added in this note or commit — this is a sketch
of the eventual proof obligation's shape, not a statement to compile.

## 6. Open questions

- **Necessity:** is decision-soundness (§3) *required* for
  `WitnessConsistentWithRuntime(M_2, T(W))` to hold, or could a
  non-decision-sound $T$ still happen to certify correctly on some
  witnesses by coincidence (e.g. if $M_2$'s policy is coarser everywhere,
  not just on the transported pair)? The counterexample shows
  non-soundness is *sufficient* for certification failure on one witness;
  it doesn't show soundness is *necessary* in general.
- **Sufficiency:** does decision-soundness of $T$, together with Axioms 1
  and 4, *imply* `WitnessConsistentWithRuntime(M_2, T(W))` for every
  witness $W$? Or are there failure modes decision-soundness doesn't
  cover (e.g. $T$ preserving the partition on representations but not on
  the *decision values themselves* — $T(x) \sim_{D,M_2} T(y)$ via a
  different decision label than $\pi_{M_1}(x)$ mapped to)?
- **Composition:** if $T_{12} : M_1 \to M_2$ and $T_{23} : M_2 \to M_3$ are
  each decision-sound, is $T_{23} \circ T_{12}$ decision-sound? This looks
  likely by transitivity of $\sim_D$ but hasn't been checked against a
  three-runtime construction.
- **Relation to Axiom 2:** as noted in §4, whether decision-soundness of
  $T$ is implied by, implies, or is independent of full Policy Decision
  Monomorphism between $M_1$ and $M_2$ remains open.

## 7. What this note does not do

Does not modify Axiom 4 in
[`2026-07-27-st017-witness-transportability-design.md`](2026-07-27-st017-witness-transportability-design.md).
Does not add Lean code. Does not touch `paper/`, ST-016 kernel definitions,
or `RuntimeSufficiency.lean`. Per the sequence in the design spec's
governance boundary, any axiom revision is deferred until the open
questions in §6 are resolved — this note is the "explore
necessity/sufficiency" step, not the "refine axioms" step.
