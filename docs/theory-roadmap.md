# Theory Roadmap

> The four phases of representation theory in TAKT.
>
> **Status:** Foundational theory complete. Three phases closed
> (Impossibility, Recovery, Characterization). Phase IV (Optimization)
> is future work. Theory is frozen as foundational version with no
> new theoretical fronts open.

## Three invariants for the implementation phase

These invariants constrain CARD-356/357/358 and must not be violated:

### Invariant 1 — Capability is not a label

A capability must be a property derived from evidence, not a declared
tag:

```
R ⊢ c    (representation R provides evidence for capability c)
```

not:

```
c ∈ R.capabilities    (capability as arbitrary metadata)
```

This prevents a system that merely claims to have a capability without
demonstrable evidence.

### Invariant 2 — Enrichment does not bypass the gate

Enrichment produces a representation candidate, not an automatic
guarantee. The chain must remain:

```
R → E(R) → Verify → Execute
```

Never:

```
R → E(R) → Execute
```

### Invariant 3 — Sufficiency is relative to the contract

There is no absolute `R_sufficient`. There is only:

```
R_sufficient(D)
```

A representation may be sufficient for decision `D₁` and insufficient
for `D₂`. This becomes critical as the CapabilityModel grows.

## Structure

```
Phase I:  Impossibility   → ST-008: what representations lose
Phase II: Recovery        → CARD-356/357/358: how to regain lost capabilities
Phase III: Characterization → ST-015: the minimum sufficient representation (Complete)
Phase IV: Optimization    → Future: which sufficient representation is optimal
```

---

## Phase I — Impossibility

**ST-008 (Convergence Impossibility Theorem)**

```
∃ D, R: ker(R) ⊈ ker(D)
```

Some decisions cannot be justified under a given representation. This
defines the *lower* boundary of the representation space:
representations that collapse distinctions the decision needs.

**Status:** Closed.

---

## Phase II — Recovery

**CARD-356 (CapabilityModel)**

What is a capability? How are they composed, ordered, and queried?

Defines the space `𝒞` and the relation between a representation `R`
and the capabilities `C_R` it provides.

**Status:** Open (Backlog).

---

**CARD-357 (Enrichment Providers)**

Concrete transformations `E_i: R → R'` that add capabilities to a
representation. Each declares cost, risk, latency, prerequisites.

Constitutes the current known enrichment space `ℰ_known`.

**Status:** Open (Backlog).

---

**CARD-358 (EVSI Planner)**

Optimal path search over `Closure_ℰ(R)`:

```
E* = arg min Cost(E) subject to C(E(R)) ⊇ C_D
```

Transforms a resolvable gap into an optimization problem.

**Status:** Open (Backlog).

---

## Phase III — Characterization

**ST-015 (Structural Sufficiency Theorem)**

```
ℛ_sufficient(D) = { R : ker(R) ⊆ K_D }

where K_D = ⋂_{c∈C_D} K_c
```

The sufficient set is characterized by the **capability kernel** `K_D`,
the intersection of the equivalence relations induced by each required
capability. The set has a unique minimum `R_min` with `ker(R_min) = K_D`.
Every representation finer than `R_min` is sufficient; every coarser
representation is insufficient.

Six theorems established:
1. Characterization — sufficiency as `ker(R) ⊆ K_D`
2. Upset and unique minimum — `ℛ_sufficient(D)` has minimum `R_min`
3. Gap correspondence — `G(D,R) = { c ∈ C_D : ker(R) ⊈ K_c }`
4. Monotonicity — refinement never increases the gap
5. Fixed point — `K_D` is the fixed point of enrichment
6. Generalization — extends to any binary monotonic structure type

**Status:** Complete. Caracterización completa, demostración formal
(6 teoremas).

---

## Phase IV — Optimization

**Optimal Representation Theorem** (future, unnamed)

Among all sufficient representations, which is minimal under global
cost? Where `∆Guarantee / ∆Cost → 0` marks the saturation point.

**Status:** Future — requires ST-015 and EVSI maturity.

---

## The full chain

```
ST-008 → impossibility boundary (∃ D,R: ker(R) ⊈ ker(D))
   ↓
ContractVerifier → G(D,R) detected
   ↓
CapabilityModel → space 𝒞 defined, K_c per capability
   ↓
Enrichment Providers → ℰ_known constructed
   ↓
EVSI Planner → E* selected: closure_ℰ(R₀) → K_D
   ↓
executeDecision → D runs only if G(D,R') = ∅
   ↓
ST-015 → sufficiency boundary (ℛ_sufficient = {R: ker(R) ⊆ K_D})
   ↓
Optimal Representation → cost-effective ceiling (Future)
```

## Loss and recovery — a unified view

The earlier ST results can be seen as special cases of preservation
failure:

| Result | What it characterizes |
|---|---|
| ST-002 | Loss of semantic alignment in policy composition |
| ST-004 | Loss from uncovered fibres in representation |
| ST-005 | Distributed drift — error accumulation across steps |
| ST-006 | Loss of decision margin |
| ST-008 | Inevitable loss under contraction — no local bounded R preserves decisions depending on W |

The roadmap adds the positive half:

| Result | What it characterizes |
|---|---|
| CARD-356 | Structure of what can be preserved |
| CARD-357 | Transformations that restore lost capabilities |
| CARD-358 | Optimal recovery path |
| ST-015 | Minimal preservation boundary — `ker(R) ⊆ K_D` |

Every step is a consequence of the previous one. The theory is not a
collection of results — it is a single argument about what
representations can preserve, how to detect when they do not, how to
recover, and how to know when recovery is complete.

---

## Representation spaces (not points)

The phases above use a linear progression:

```
R_insufficient → R_sufficient → R_optimal
```

But these are sets, not a single path. The correct picture:

```
ℛ_insufficient = { R : ker(R) ⊈ ker(D) }
ℛ_sufficient  = { R : ker(R) ⊆ ker(D) }
ℛ_optimal     ⊆ ℛ_sufficient
```

ST-008 defines `ℛ_insufficient` — the forbidden zone.
CARD-356/357/358 navigate within `ℛ_sufficient`.
ST-015 characterizes the boundary `∂ℛ_sufficient = {R: ker(R) = K_D}`.
Optimal Representation selects within `ℛ_sufficient` under cost (Future).

There may be many sufficient representations for the same decision.
The theory does not prescribe a single correct one — it provides the
structure to find, compare, and select among them.
