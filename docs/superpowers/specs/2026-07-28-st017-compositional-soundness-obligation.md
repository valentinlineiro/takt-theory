# ST-017 Compositional Soundness: Minimum Obligation for Composition

**Status:** Open research note / pre-formalization
**Scope:** Theory only. No runtime implementation, no Lean code, no
change to `Sound(T, c)`'s definition in the design spec (it is not yet
in the design spec — still confined to these notes).
**Depends on:** [`2026-07-28-st017-transport-obligation-granularity.md`](2026-07-28-st017-transport-obligation-granularity.md)
(§2, the composition obstruction)

## 1. The question

The previous note found that $\mathrm{Sound}(T,c)$'s consequent —
$\pi_{M_2}(T(x)) \neq \pi_{M_2}(T(y))$ — is too weak to feed the next
map's premise, which needs the full `Attributes` predicate (specifically:
that $c$, not some other capability, is responsible for the surviving
distinction). Two repairs were named without deciding between them:
**(A)** strengthen $\mathrm{Sound}(T,c)$'s consequent to the full
`Attributes` predicate, or **(B)** keep the weak form and carry an
explicit attribution hypothesis alongside each composition. This note
works both far enough to tell them apart, rather than leaving them as a
symmetric list of options.

## 2. Option A: strengthen the consequent

$$\mathrm{Sound}'(T, c) \;:\Leftrightarrow\; \forall x,y \in \mathcal{R}_{M}: \; \mathrm{Attributes}(c, M, x, y) \;\Rightarrow\; \mathrm{Attributes}(c, M', T(x), T(y))$$

**Composition holds unconditionally.** Given $\mathrm{Sound}'(T_{12}, c)$
($M_1 \to M_2$) and $\mathrm{Sound}'(T_{23}, c)$ ($M_2 \to M_3$), and
$\mathrm{Attributes}(c, M_1, x, y)$:

1. $\mathrm{Sound}'(T_{12}, c)$ gives $\mathrm{Attributes}(c, M_2, T_{12}(x), T_{12}(y))$.
2. That is exactly the premise $\mathrm{Sound}'(T_{23}, c)$ needs, applied
   to $(T_{12}(x), T_{12}(y))$: gives
   $\mathrm{Attributes}(c, M_3, T_{23}(T_{12}(x)), T_{23}(T_{12}(y)))$.
3. That is exactly $\mathrm{Sound}'(T_{23} \circ T_{12}, c)$'s consequent
   for $x, y$.

No side conditions — this is direct transitivity, because $\mathrm{Sound}'$
was built to make the output of one map exactly match the input the next
map's premise expects. So Option A does resolve the composition
obstruction cleanly. That settles the "is it accidental" half of the
question: yes, under Option A the previous gap was exactly an accidental
information loss in $\mathrm{Sound}$'s consequent, fully recoverable by
stating the stronger consequent.

## 3. Option A's cost, made concrete

The risk named in the previous note — "too strong" — is checkable, and
turns out to be real, not just a plausible-sounding caveat. Construct
$M_2$ with capabilities including both $C_{\text{temporal}}$ and
$C_{\text{uncertainty}}$ (both in $\mathcal{K}_D$), and $u = T_{12}(x)$,
$v = T_{12}(y)$ such that:

- $\pi_{M_2}(u) \neq \pi_{M_2}(v)$ — the decision still differs.
- $\pi_{M_2 \setminus \{C_{\text{temporal}}\}}(u) \neq \pi_{M_2 \setminus \{C_{\text{temporal}}\}}(v)$
  — ablating $C_{\text{temporal}}$ alone does **not** collapse the
  distinction (some other capability still accounts for it).
- $\pi_{M_2 \setminus \{C_{\text{uncertainty}}\}}(u) = \pi_{M_2 \setminus \{C_{\text{uncertainty}}\}}(v)$
  — ablating $C_{\text{uncertainty}}$ alone **does** collapse it.

This is a coherent (if hypothetical — not claimed to occur in the
reference TypeScript runtime) situation: $M_2$'s governance kernel
organizes the same information differently than $M_1$'s, and what
$C_{\text{temporal}}$ was responsible for in $M_1$ has, after transport,
become $C_{\text{uncertainty}}$'s responsibility in $M_2$. Under this
construction: $\mathrm{Attributes}(C_{\text{temporal}}, M_2, u, v)$ is
**false** (its second conjunct requires the ablation of
$C_{\text{temporal}}$ to collapse the distinction, and it doesn't) even
though $\mathrm{Attributes}(C_{\text{uncertainty}}, M_2, u, v)$ is true
and the decision is, in every practical sense, preserved.

$\mathrm{Sound}'(T_{12}, C_{\text{temporal}})$ therefore rejects this
$T_{12}$ — even though nothing about the transported decision is broken;
only its *internal governance bookkeeping* changed which named capability
is "responsible." Whether that should count as a soundness failure
depends entirely on whether ST-017 cares about capability-name identity
across runtimes or only about decision-preservation-with-attribution-to-
*some* capability in $\mathcal{K}_D$. Option A silently commits to the
former. That is a substantive, not cosmetic, choice, and this note does
not think it should be made by default.

## 4. Option B, sketched further than "add a hypothesis"

Rather than requiring the *same* $c$ to remain the attributor, require
only that *some* capability in the target kernel does:

$$\mathrm{KernelSound}(T, \mathcal{K}_D) \;:\Leftrightarrow\; \forall x,y \in \mathcal{R}_{M}: \; \left(\exists c \in \mathcal{K}_D.\ \mathrm{Attributes}(c, M, x, y)\right) \;\Rightarrow\; \left(\exists c' \in \mathcal{K}_D.\ \mathrm{Attributes}(c', M', T(x), T(y))\right)$$

This is weaker than requiring $c = c'$ (Option A) and stronger than plain
$\mathrm{Sound}(T,c)$ (§2 of the previous note, which only required the
decision to differ, not that *any* capability attributes it — a decision
could differ for reasons outside $\mathcal{K}_D$ altogether under the
weak form, which was never actually ruled out there). Checking
composition for $\mathrm{KernelSound}$: given
$\mathrm{KernelSound}(T_{12}, \mathcal{K}_D)$ and
$\mathrm{KernelSound}(T_{23}, \mathcal{K}_D)$, and some $c$ attributing
$x,y$ in $M_1$: $\exists c \in \mathcal{K}_D$ trivially satisfies the
first premise, giving $\exists c_1' \in \mathcal{K}_D.\ \mathrm{Attributes}(c_1', M_2, T_{12}(x), T_{12}(y))$
— which again is exactly the existential premise $\mathrm{KernelSound}(T_{23}, \mathcal{K}_D)$
needs. **This composes for the same reason Option A does** (the
existential is preserved across the chain, not a specific witness
capability) — but it does not pin the identity of the attributing
capability across the chain, so it does not suffer §3's rejection: the
$C_{\text{temporal}} \to C_{\text{uncertainty}}$ shift is accepted, since
some capability still attributes the distinction at every stage.

This is a genuine third option, better than the binary A/B framing this
note started from: it composes as cleanly as Option A's proof (§2's
argument goes through verbatim with the existential in place of the fixed
$c$), without inheriting Option A's over-rejection (§3). It gives up
tracking *which* capability is responsible, which may or may not matter —
that is now the open question this note leaves behind, not "does
composition work" (answered: yes, for both A and this kernel-level
variant) or "is A too strong" (answered: yes, demonstrably).

## 5. Where this leaves the "portable certificate" question

The architecture sketched in prior discussion —
`Witness + Capability attribution + Transport preservation certificate`
— now has a concrete choice point: does the certificate need to name a
*fixed* capability across the whole transport chain (Option A, simpler
certificate, provably rejects some decision-preserving transports), or
only certify that *some* capability in $\mathcal{K}_D$ remains responsible
at every hop (§4's `KernelSound`, composes equally well, weaker
guarantee about *which* governance mechanism is doing the work)? Neither
is adopted here. The next check this raises: does `KernelSound` actually
suffice for `WitnessConsistentWithRuntime` to transfer end-to-end, or does
losing capability identity break something downstream in how a witness is
interpreted (e.g. if the paper-level claim a witness supports is
capability-specific, "C_temporal is necessary," a kernel-level-only
certificate can't reconstruct which specific claim survived transport) —
not investigated in this note.

## 6. What this note does not do

Does not adopt Option A, Option B as originally posed, or `KernelSound` as
the transport obligation. Does not modify `Sound(T,c)` in the prior
notes — those stand as originally defined, with this note's findings
recorded alongside, not overwriting them. No axiom added or changed, no
Lean code, no runtime implementation, no change to ST-016 or `paper/`.
