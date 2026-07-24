# Global Theoretical Dependency Map

This document presents the unified logical dependency architecture of TAKT across all 5 volumes, tracing the axiomatic foundation ($A0, A1$) down to minimal quotient representations, EVSI stopping rules, governance geometry, monoidal categories, and probabilistic Dirac collapse.

---

## Master Global Dependency Graph (Mermaid)

```mermaid
graph TD
    %% Volume I & Axioms
    subgraph Vol1["Volume I: Foundations & Axioms"]
        A0["Axiom A0<br/>Contract Coherence<br/>ker(D) = ⋂ K_c"]
        A1["Axiom A1<br/>Arbitrary Meets in Poset"]
        DS["Decision System D<br/>(S, A, U, C_D)"]
        REP["Representation R: S → Z"]
        CAP["Capability Space C & Kernels K_c"]
    end

    %% Volume II
    subgraph Vol2["Volume II: Structural Sufficiency"]
        KD["Capability Kernel<br/>K_D = ⋂_{c ∈ C_D} K_c"]
        ST015["Structural Sufficiency Theorem (ST-015)<br/>ker(R) ⊆ K_D ⟺ R ∈ R_sufficient(D)"]
        RMIN["Minimal Quotient Representation<br/>R_min = S / K_D"]
        FPT_BOUND["Finite Quotient Bound<br/>|S / K_D| ≤ 2^k"]
    end

    %% Volume III
    subgraph Vol3["Volume III: Governance & Information Value"]
        DET_GRAPH["Detector Graph G_D"]
        EVSI["Expected Value of Sample Information<br/>EVSI(E)"]
        STOP["Rational EVSI Stopping Theorem π*<br/>EVSI(E) ≤ C_acq(E) ⟹ STOP"]
        PLANNER["Minimal Intervention Planner"]
    end

    %% Volume IV
    subgraph Vol4["Volume IV: Governed Convergence & Geometry"]
        DUAL_GEO["Dual Governance Geometry<br/>(d_→, d_≡)"]
        PERF_DIST["Perfection Distance δ(D)"]
        SURP_MARGIN["Dynamic Surprisal Margin M_D(τ)"]
        HORIZON["Guaranteed Intervention Horizon<br/>h* = ⌊M_D / c_max⌋"]
        CALIB["Asymmetric Calibration M_D^calib"]
    end

    %% Volume V
    subgraph Vol5["Volume V: Extensions & Metatheory"]
        META["Metatheory<br/>Conservativity ι & Independence A1-A3"]
        COMP["System Composition<br/>S_1 ⊗ S_2 , S_2 ∘ S_1"]
        GOVDET["Monoidal Category GovDet<br/>Adjunction A ⊣ E"]
        FPT_COMP["FPT Complexity<br/>O(2^k · |E|)"]
        PROB["Probabilistic Monad T_P &<br/>Dirac Collapse P → δ_τ0"]
    end

    %% Dependencies
    DS --> CAP
    A0 --> KD
    A1 --> KD
    CAP --> KD
    REP --> ST015
    KD --> ST015
    ST015 --> RMIN
    RMIN --> FPT_BOUND

    ST015 --> DET_GRAPH
    DET_GRAPH --> EVSI
    EVSI --> STOP
    STOP --> PLANNER

    KD --> DUAL_GEO
    DUAL_GEO --> PERF_DIST
    PERF_DIST --> SURP_MARGIN
    SURP_MARGIN --> HORIZON
    HORIZON --> CALIB

    ST015 --> META
    ST015 --> COMP
    RMIN --> GOVDET
    FPT_BOUND --> FPT_COMP
    SURP_MARGIN --> PROB
    GOVDET --> PROB

    %% Styling
    classDef axiom fill:#f9f,stroke:#333,stroke-width:2px;
    classDef theorem fill:#bbf,stroke:#333,stroke-width:2px;
    classDef volume fill:#dfd,stroke:#333,stroke-width:1px;

    class A0,A1 axiom;
    class ST015,STOP,HORIZON,GOVDET theorem;
```

---

## Logical Layer Summary

1. **Layer 0 (Axiomatic Base):** Axioms $A0$ (Contract Coherence) and $A1$ (Arbitrary Meets) establish the formal bridge between contract requirements $C_D$ and state space equivalence relations $K_c$.
2. **Layer 1 (Core Structural Sufficiency):** Theorem **ST-015** proves that a representation $R$ preserves optimal decisions iff $\ker(R) \subseteq K_D$, constructing the canonical minimal quotient representation $R_{\text{min}} = S / K_D$ bounded by $2^k$.
3. **Layer 2 (Value of Information & Governance):** Builds detector transition graphs $\mathcal{G}_D$ and proves the Rational EVSI Stopping Theorem $\pi^*$.
4. **Layer 3 (Governed Convergence & Geometry):** Establishes metric space properties $(d_{\rightarrow}, d_{\equiv})$, perfection distance $\delta(D)$, surprisal margins $M_D$, and certified intervention horizons $h^*$.
5. **Layer 4 (Metatheory, Categories & Extensions):** Extends structural sufficiency to monoidal category theory ($\mathbf{GovDet}$), fixed-parameter tractability, system composition, and measure-theoretic probability monads ($\mathcal{T}_{\mathbb{P}}$).
