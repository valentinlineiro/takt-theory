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

## Phase IV — Governed Convergence Theory & Optimization

**Phase IV-C: Governed Convergence Theory** (Complete - Formalized & Mechanized in Lean 4)

Establishes the complete formal theory of transition from executable detectors $D_{\text{alg}}$ to ideal limit governance $D_{\text{top}}$ across 7 closed sub-phases:

1. **IV-C.1 (Detector Evolution):** Space $(\mathcal{G}_D, \Phi)$, 5 core invariants, Theorem 5.1 Abstract Reachability (`DetectorEvolution.lean`).
2. **IV-C.2 (Governance Geometry):** Dual distance structure ($d_{\rightarrow}, d_{\equiv}$), perfection distance $\delta(D)$, Theorem 3.2 Monotonic Distance Reduction (`GovernanceGeometry.lean`).
3. **IV-C.3 (Enrichment Algebra):** Monoid $(\mathcal{E}, \circ, \vee_E)$, Action Homomorphism $\Phi(D, E_2 \circ E_1) = \Phi(\Phi(D, E_1), E_2)$ (`EnrichmentAlgebra.lean`).
4. **IV-C.4 (Cost Optimization):** Trajectory cost $C(\pi)$, Governance EVSI, $\pi^*$ optimal path, Rational EVSI Stopping Theorem (`CostOptimization.lean`).
5. **IV-C.5 (Approximate Governance):** $\epsilon$-Governance predicate $Gov_{\epsilon}(D)$, saturation bound $\epsilon^*$, decision regret upper bound $\epsilon$ (`ApproximateGovernance.lean`).
6. **IV-C.6 (Runtime Convergence):** Online prefix trace verifier, runtime soundness preservation invariant over event streams (`RuntimeConvergence.lean`).
7. **IV-C.7 (Impossibility & Limits):** Unreachability frontiers, non-approximability barriers, soundness barriers (`ImpossibilityLimits.lean`).

**Status:** Complete — all 7 sub-phases formalized in Lean 4 (168 jobs verified cleanly with 0 `sorry`s). Derived runtime CARDS (CARD-359 through CARD-365) generated for implementation.

---

## Phase V — Extensions & Metatheory (Volume V)

**Phase V-0: Extension Roadmap** (Complete)

Defines the research architecture contract and dependency matrix for the 5 extension tracks (Metatheory, System Composition, Categorical Unification, Computational Complexity, Probabilistic Governance).

See [extension-roadmap.md](file:///home/valentin/code/takt-theory/docs/extension-roadmap.md) for the full Volume V specification.

**Phase V-A: Metatheory of TAKT** (Complete - Formalized & Mechanized in Lean 4)

Formalizes the internal audit of the TAKT core across 4 sub-modules:
1. **Conservativity (`Conservativity.lean`):** Conservative theory embedding $\iota: T_{\text{core}} \hookrightarrow T_{\text{IV-C}}$ and ST-015 collapse corollary.
2. **Independence (`Independence.lean`):** Counterexample models $\mathcal{M}_1, \mathcal{M}_2, \mathcal{M}_3$ proving independence of primitive axioms $A_1, A_2, A_3$.
3. **Minimality (`Minimality.lean`):** Sufficiency of minimal basis $A_{\text{min}} = \{A_1, A_2, A_3\}$ and formal derivation of Rational Stopping and Regret Bounds.
4. **Redundancy (`Redundancy.lean`):** Functional metric generation from dual distance $(d_{\rightarrow}, d_{\equiv})$.

**Status:** Complete — formalized and verified in Lean 4 (178 jobs verified cleanly with 0 `sorry`s). Re-exported via `TaktFormal.Metatheory`.

**Phase V-B: Governed System Composition** (Complete - Formalized & Mechanized in Lean 4)

Establishes composition theory for interacting governed systems across 5 sub-modules:
1. **Composite Model (`Composition/Basic.lean`):** Parallel composition $S_1 \otimes S_2$ and cascade composition $S_2 \circ S_1$.
2. **Preservation (`Composition/Preservation.lean`):** Soundness and reachability preservation theorems.
3. **Geometry (`Composition/Geometry.lean`):** Central Governance Transmission Theorem ($Gov_{\epsilon_1 + \epsilon_2}(S_1 \otimes S_2)$) and perfection distance bounds.
4. **Optimization (`Composition/Optimization.lean`):** EVSI parallel additivity and cooperative synergy inequality.
5. **Limits (`Composition/Limits.lean`):** Resolution of local unreachability and Lipschitz cascade bounds.

**Status:** Complete — formalized and verified in Lean 4 (190 jobs verified cleanly with 0 `sorry`s). Re-exported via `TaktFormal.Composition`.

**Phase V-C: Categorical Unification ($\mathbf{GovDet}$)** (Complete - Formalized & Mechanized in Lean 4)

Establishes canonical category-theoretic unification across 5 sub-modules:
1. **Category $\mathbf{GovDet}$ (`Categorical/Basic.lean`):** Objects, morphisms, composition, identity, and associativity/identity category laws.
2. **Monoidal Structure (`Categorical/Monoidal.lean`):** Symmetric monoidal category $(\mathbf{GovDet}, \otimes, I)$ using parallel tensor operator.
3. **Functors (`Categorical/Functor.lean`):** Representation functor $\mathcal{F}_{\text{Rep}}$ and decision functor $\mathcal{F}_{\text{Dec}}$ preserving sufficiency.
4. **Adjunctions (`Categorical/Adjunction.lean`):** Canonical Abstraction-Enrichment adjunction $\mathcal{A} \dashv \mathcal{E}$.
5. **Limits (`Categorical/Limits.lean`):** Categorical products matching parallel tensor and pullback minimum combined detectors.

**Status:** Complete — formalized and verified in Lean 4 (202 jobs verified cleanly with 0 `sorry`s). Re-exported via `TaktFormal.Categorical`.

**Phase V-D: Computational Complexity Theory** (Complete - Formalized & Mechanized in Lean 4)

Formalizes decision problems, decidability, algorithmic reductions, FPT tractability, and online stream complexity across 5 sub-modules:
1. **Formal Problems (`Complexity/Problems.lean`):** `DET-REACH`, `OPT-EVSI-PATH`, `GOV-VERIFY`, `MIN-ENRICH`.
2. **Decidability (`Complexity/Decidability.lean`):** Decidability in finite models vs semi-decidability in infinite spaces.
3. **Reductions & Hardness (`Complexity/Reductions.lean`):** Polynomial NP verifier check and DAG topological DP bounds.
4. **Parameterized Complexity (`Complexity/Parameterized.lean`):** Fixed-Parameter Tractable (FPT) $O(2^k \cdot |\mathcal{E}|)$ bound by kernel dimension $k$.
5. **Runtime Complexity (`Complexity/Runtime.lean`):** Amortized $O(1)$ verification bound for online event streams.

**Status:** Complete — formalized and verified in Lean 4 (214 jobs verified cleanly with 0 `sorry`s). Re-exported via `TaktFormal.Complexity`.

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
