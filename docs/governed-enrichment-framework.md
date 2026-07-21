# Governed Enrichment Framework

> From impossibility to optimal resolution: closing the gap between
> contract violation and capability acquisition.

**Status:** Draft — theoretical foundation for CARD-356/357/358.
**Prerequisite:** ST-008 (Convergence Impossibility Theorem).

---

## 1. Current state

ST-008 establishes:

```
∃ D, R: ker(R) ⊈ ker(D)
```

There exist decisions that cannot be justified under certain representations.
The runtime consequence (CARD-354) is: no execution without verification.

---

## 2. Gap detection

A decision contract defines a set of required capabilities:

```
C_D = { c ∈ 𝒞 : decision D requires c }
```

The current representation provides:

```
C_R = { c ∈ 𝒞 : representation R provides c }
```

The verifier computes the capability gap:

```
G(D, R) = C_D − C_R
```

**Result:**
- `G = ∅` → decision is executable.
- `G ≠ ∅` → representation is insufficient.

The gap is the generalization of ST-008 in operational language:
ST-008 proves that gaps *exist*; the gap function `G(D, R)` makes them
computable.

---

## 3. Capability model (CARD-356)

Defines the capability space `𝒞` and its internal structure:

### Primitives

- **Capability** `c ∈ 𝒞`: an abstract, typed identifier representing a
  class of evidence a representation may provide.
  - Capabilities remain *abstract* — they name what is needed, not how
    to obtain it. Concrete sources (GitHub API, filesystem, human input)
    belong to the enrichment layer.

### Relations

- **Dependency** `c_a → c_b`: acquiring `c_a` requires `c_b` first.
- **Composition** `C₁ ⊕ C₂`: the combined capability of two sets is
  greater than either alone (non-additive in general).
- **Implication** `c_a ⇒ c_b`: providing `c_a` is sufficient to also
  claim `c_b`.
- **Mutual exclusion** `c_a ⊗ c_b`: two capabilities cannot be provided
  by the same representation simultaneously.

### Query

```
Given C_D, what configurations of 𝒞 satisfy the contract?
```

The capability model does not decide which configuration to use — it
only defines the search space.

---

## 4. Enrichment providers (CARD-357)

An enrichment provider is a function that transforms a representation:

```
E_i : R → R'
```

such that:

```
C(R') ⊇ C(R)
```

Each enrichment declares:

- **Capabilities provided**: which elements of `𝒞` this enrichment adds.
- **Cost**: resource cost of applying this enrichment.
- **Risk**: probability that the enrichment fails or provides degraded
  capabilities.
- **Latency**: time cost of applying the enrichment.
- **Prerequisites**: capabilities the representation must already have
  for this enrichment to be applicable.

Enrichment providers do not decide which enrichment to apply — they
only enumerate what is possible.

### Enrichment Closure

The set of all representations reachable from `R` via any sequence of
available providers:

```
Closure_ℰ(R) = { E_n(...E_2(E_1(R))) : E_i ∈ available providers, n ≥ 0 }
```

This defines the effective search space. A gap is resolvable iff:

```
∃ R' ∈ Closure_ℰ(R) : C(R') ⊇ C_D
```

The planner does not search over individual providers — it searches
over **paths in the closure graph**. A path `(E₁, E₂, ..., Eₙ)` is
valid iff each step's prerequisites are satisfied by the cumulative
state after previous steps.

### Open vs finite enrichment space

The enrichment space may be:

- **Finite**: all providers and their compositions are known at
  verification time. Reachability is a closed-world query.
- **Open**: new providers may be discovered or added dynamically.
  Reachability is relative to the current set of known providers —
  an unresolvable gap may become resolvable when the space expands.

TAKT's trajectory (extensible by design) favors the **open** model:
the framework must not assume completeness of the enrichment space.
`UnresolvableGap` means *unresolvable with currently known providers*,
not *unreachable in principle*.

This has architectural consequences:
- `ReachabilityQuery` is parameterized over the current provider set.
- A new provider can retroactively resolve previously unresolvable gaps.
- The system logs unresolvable gaps as potential targets for provider
  expansion, not as permanent impossibilities.

---

## 5. Optimal selection via EVSI (CARD-358)

Given a gap `G(D, R) = C_D − C_R ≠ ∅`, the system must select the
optimal enrichment sequence:

```
min  Cost(E)
 E

subject to: C(E(R)) ⊇ C_D
```

This is a direct application of EVSI (M2), generalized:

```
π*(I_k) = arg min E[C_acquisition + C_decision | I_k]
```

The difference from M2's current EVSI is that `I_k` is not a fixed list
of options but a *state in the capability space*. The planner explores
the space `𝒞` via enrichment providers, evaluates each reachable state,
and selects the minimum-cost path that satisfies the contract.

Constraints:
- **Enrichment planner** does not execute decisions.
- **Enrichment planner** does not define capabilities.
- **Enrichment planner** only searches and selects.

---

## 6. Execution

Once an enrichment `E*` is selected and applied:

```
R' = E*(R)
```

The decision may execute:

```
executeDecision(D, R')
```

is admissible only when:

```
G(D, R') = ∅
```

The verifier checks again before execution — enrichment does not
bypass the gate. This guarantees that every decision is validated
against the final representation, not an intermediate assumption.

---

## 7. Enrichment Reachability

The Governed Enrichment Principle assumes the gap is closable. This
is not a given — it is a hypothesis that must be verified per gap.

Define the set of enrichment-accessible representations from `R`:

```
ℰ(R) = { E(R) : E ∈ available providers }
```

A gap `G(D, R)` is:

- **Resolvable** iff `∃ R' ∈ ℰ(R): C(R') ⊇ C_D`
- **Unresolvable** iff `¬∃ R' ∈ ℰ(R): C(R') ⊇ C_D`

This creates two distinct failure modes:

```
ContractViolationError
  |
  +-- ResolvableGap    → known enrichment path exists → plan + apply
  |
  +-- UnresolvableGap  → no known path → escalate
```

The runtime consequence: `ContractViolationError.missing` lists WHAT
is missing. A separate `ReachabilityQuery` on the enrichment space
determines WHETHER it can be obtained.

This is structurally parallel to ST-008:

| Result | Question |
|---|---|
| ST-008 | Can this decision be preserved under this representation? |
| Reachability | Can this gap be closed with available enrichments? |

One proves an impossibility; the other proves the feasibility of
recovery.

**Enrichment Completeness Assumption (explicit, not implicit):**

The framework does not assert that every gap is resolvable. It asserts:

> Given a resolvable gap, the optimal enrichment exists and can be
> found via EVSI over the capability space.

Unresolvable gaps are not a failure of the framework — they are a
signal that the enrichment space itself is insufficient, which is a
different class of problem (expansion of available providers, not
selection among them).

---

## 8. Governed Enrichment Principle

Every *resolvable* contract violation must be transformable into a
minimal capability acquisition problem under a decision-theoretic cost
function.

Formally:

```
∀ D, R: G(D, R) ≠ ∅ ∧ Resolvable(G(D,R)) ⇒
  ∃ E*: C(E*(R)) ⊇ C_D ∧
    Cost(E*) = min{ Cost(E) : C(E(R)) ⊇ C_D }
```

This states that a resolvable gap is not a dead end — it is a
well-defined optimization problem whose solution restores the invariant.

The runtime consequence: every `ContractViolationError` carries not
only *what* is missing, but — when resolvable — a *path* to resolve it.

---

## 9. Separation of responsibilities

| Component | Decides | Does not decide |
|---|---|---|
| CapabilityModel `𝒞` | Structure of capability space | Which capabilities to acquire |
| Enrichment providers `E_i` | What each enrichment provides | Which enrichment to apply |
| Reachability query | Whether a gap is closable | How to close it |
| EVSI planner | Which enrichment is optimal | Execute the decision |
| executeDecision | When to run the decision | Search for solutions |

Each component's responsibility is derived from the theory, not from
implementation convenience. This is what makes the framework *governed*:
no layer over-reaches.

---

## 10. Connection chain

```
ST-008 → gap exists
  ↓
ContractVerifier → G(D, R) detected
  ↓
Reachability query → resolvable or unresolvable?
  |
  +-- Unresolvable → escalate (beyond available enrichment space)
  |
  +-- Resolvable
       ↓
       CapabilityModel → search space 𝒞 defined
       ↓
       Enrichment providers → transformations enumerated
       ↓
       EVSI planner → optimal E* selected
       ↓
       executeDecision → D runs under R' with G(D, R') = ∅
```

Every link in the chain is a consequence of the previous one. There
is no step that could be removed without breaking the guarantee.

Every link in the chain is a consequence of the previous one. There
is no step that could be removed without breaking the guarantee.

---

## 11. Meta-EVSI: expansion of the provider space

With an open enrichment model, an unresolvable gap signals not failure,
but a potential opportunity: expanding `ℰ_known` may close the gap.

This introduces a meta-level decision problem:

```
Given G(D,R) unresolvable with current ℰ_known,
is it worth expanding ℰ to make it resolvable?
```

The structure is the same EVSI principle, one level up:

```
π*(expand) = arg min E[Cost_expand + Cost_decision | I_k]
```

where `Cost_expand` is the cost of discovering or creating a new
provider that adds the missing capability, and `Cost_decision` is the
expected cost of deferring or escalating the original decision.

This meta-level is not required for CARD-356/357/358 — those cards
operate within a fixed `ℰ_known`. But the framework should acknowledge
the next natural extension: the system can reason about whether
expanding its own enrichment space has positive expected value.

---

## 12. The three limits

The framework now distinguishes three kinds of limits:

| # | Limit | Question | Formal |
|---|---|---|---|
| 1 | Representational (ST-008) | Does R preserve D? | `ker(R) ⊆ ker(D)`? |
| 2 | Enrichment (Reachability) | Can ℰ close the gap? | `∃ R' ∈ Closure_ℰ(R): C(R') ⊇ C_D`? |
| 3 | Provider space (Meta-EVSI) | Is expansion worthwhile? | `E[Value(expand)] > Cost(expand)`? |

These are distinct. A decision may be impossible because:
- The representation is insufficient (1).
- The representation is insufficient AND no known enrichment closes it (2).
- The representation is insufficient, no known enrichment closes it,
  AND expanding the provider space is not worth the cost (3).

Three different "no" answers, each with different architectural
consequences.

---

## 13. Relationship to CARD-356/357/358

- **CARD-356** implements the CapabilityModel: the type system for `𝒞`,
  the relation operators (dependency, composition, implication), and
  the reachability query interface.
- **CARD-357** implements enrichment providers: concrete transformations
  `E_i` that add capabilities to a representation, declaring cost, risk,
  latency, and prerequisites. These constitute the current `ℰ_known`.
- **CARD-358** implements the EVSI planner over the capability space:
  the optimization loop that searches paths in `Closure_ℰ(R)` and
  selects `E*`.

These are not three independent features. They are three layers of the
same operation: *resolving a capability gap under cost constraint*,
each layer depending on the one before it.

**Prerequisite for all three:** the Reachability query — because the
planner must distinguish resolvable from unresolvable gaps before
deciding whether to search or escalate. CARD-356 should therefore
include the reachability interface as part of the CapabilityModel.

Meta-EVSI (provider space expansion, limit 3) is explicitly out of
scope for all three cards. It is the natural next step after CARD-358,
not a requirement for it.
