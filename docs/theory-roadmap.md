# Theory Roadmap

> The four phases of representation theory in TAKT.

## Structure

```
Phase I:  Impossibility   → ST-008: what representations lose
Phase II: Recovery        → CARD-356/357/358: how to regain lost capabilities
Phase III: Characterization → ST-015: the minimum sufficient representation
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

Given a decision class `D` and an observable class `O`, does there
exist a minimal representation `R_min` such that:

```
ker(R_min) ⊆ ker(D)  ∧  R_min = f(O)
```

And critically:

```
∀ R' ≺ R_min: ker(R') ⊈ ker(D)
```

That is: `R_min` works, and every strictly smaller representation fails.
This makes sufficiency a boundary, not an arbitrary point.

The question is no longer *can a representation fail* (ST-008), but
*what is the exact boundary between insufficient and sufficient?*

**Status:** Future — requires stable operational semantics for
"capability", "evidence", and "sufficiency" from CARD-356/357/358.

---

## Phase IV — Optimization

**Optimal Representation Theorem** (future, unnamed)

Among all sufficient representations, which is minimal under global
cost? Where `∆Guarantee / ∆Cost → 0` marks the saturation point.

**Status:** Future — requires ST-015 and EVSI maturity.

---

## The full chain

```
ST-008 → impossibility boundary
   ↓
ContractVerifier → G(D,R) detected
   ↓
CapabilityModel → space 𝒞 defined
   ↓
Enrichment Providers → ℰ_known constructed
   ↓
EVSI Planner → E* selected
   ↓
executeDecision → D runs only if G(D,R') = ∅
   ↓
ST-015 → sufficiency boundary
   ↓
Optimal Representation → cost-effective ceiling
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
| ST-015 | Minimal preservation boundary |

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
ST-015 characterizes the boundary `∂ℛ_sufficient`.
Optimal Representation selects within `ℛ_sufficient` under cost.

There may be many sufficient representations for the same decision.
The theory does not prescribe a single correct one — it provides the
structure to find, compare, and select among them.
