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

Every step is a consequence of the previous one. The theory is not a
collection of results — it is a single argument about what
representations can preserve, how to detect when they do not, how to
recover, and how to know when recovery is complete.
