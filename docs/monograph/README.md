# TAKT Unified Monograph: Master Index & Reading Guide

Welcome to the **TAKT Unified Monograph**, the comprehensive theoretical and formal treatise on the Theory of Governed Decision Systems, Structural Sufficiency, and Certified Runtime Convergence.

This monograph consolidates the complete mathematical foundations of TAKT across 5 logical volumes, accompanied by full front and back matter. Every definition, theorem, and corollary across the entire work is mechanically verified in **Lean 4** (226 certified theorems, 0 `sorry`s).

---

## The Triple Reading Level Paradigm

To serve mathematical theorists, software verification engineers, and systems architects alike, every chapter in this monograph adheres strictly to **Triple Reading Level Traceability**:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                   TRIPLE READING LEVEL ARCHITECTURE                    │
 └────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  Level 1: NARRATIVE           Level 2: MATHEMATICAL        Level 3: MECHANIZED (LEAN 4)
 Conceptual motivation,       Formal definitions,          Direct mapping to `takt-formal/`,
 decision context, and        rigorous text proofs, and    exact Lean symbol names, and 0
 architectural intuition.     system invariants.           `sorry`s mechanization proof.
```

1. **Level 1 (Narrative):** High-level conceptual motivation, system design goals, and physical/logical intuition.
2. **Level 2 (Mathematical Proofs):** Rigorous, self-contained mathematical definitions, propositions, and step-by-step proofs using standard set theory, poset theory, measure theory, and category theory.
3. **Level 3 (Lean 4 Mechanization):** Direct hyperlinked mapping to the Lean 4 source files in `takt-formal/TaktFormal/`, showing exact Lean symbol names, module paths, and verification status.

---

## Monograph Master Structure

The monograph is organized into 5 logical volumes bracketed by Front Matter and Back Matter:

### Front Matter (`docs/monograph/00-front-matter/`)
* [Preface: Adequacy over Completeness](00-front-matter/preface.md) — Philosophical foundation, decision adequacy, and information frugality.
* [Mathematical Conventions & Symbol Table](00-front-matter/notation-conventions.md) — Unified mathematical notation, posets, kernels, metrics, and Lean 4 symbol mapping.
* [Canonical Glossary](00-front-matter/glossary.md) — Harmonized terminology, eliminating domain ambiguity.
* [Global Dependency Map](00-front-matter/global-dependency-map.md) — Master Mermaid graph mapping axiomatic dependencies across all 5 volumes.

### Volumes I–V
* **[Volume I: Foundations](01-volume-1-foundations/volume-1-foundations.md)** — Decision Systems $(S, A, U, D)$, Representations $R: S \to Z$, Capability Invariants, and Regret Bounds.
* **[Volume II: Structural Sufficiency](02-volume-2-structural-sufficiency/volume-2-structural-sufficiency.md)** — Capability Kernels $K_D$, Structural Sufficiency Theorem (ST-015), Minimal Quotient Representation $R_{\text{min}} = S / K_D$, and Finite Quotient Bound $|S / K_D| \le 2^k$.
* **[Volume III: Governance & Information Value](03-volume-3-governance/volume-3-governance.md)** — Governed Detectors, EVSI on Detector Graphs, Rational Stopping Theorem $\pi^*$, and Minimum Intervention Cost Optimization.
* **[Volume IV: Governed Convergence & Geometry](04-volume-4-governed-convergence/volume-4-governed-convergence.md)** — Dual Governance Geometry $(d_{\rightarrow}, d_{\equiv})$, Perfection Distance $\delta(D)$, Dynamic Surprisal Margin $M_D$, Guaranteed Intervention Horizon $h^* = \lfloor M_D / c_{\text{max}} \rfloor$, and Asymmetric Calibration $M_D^{\text{calib}}$.
* **[Volume V: Extensions & Metatheory](05-volume-5-extensions-metatheory/volume-5-extensions-metatheory.md)** — Metatheory (Conservativity $\iota$, Independence $A_1, A_2, A_3$), System Composition ($S_1 \otimes S_2$, $S_2 \circ S_1$), Monoidal Category $\mathbf{GovDet}$ and Adjunction $\mathcal{A} \dashv \mathcal{E}$, FPT Complexity $\mathcal{O}(2^k \cdot |\mathcal{E}|)$, and Probabilistic Governance with Dirac Collapse.

### Back Matter (`docs/monograph/06-back-matter/`)
* [Literature Positioning & Comparative Audit](06-back-matter/literature-positioning.md) — Comparative audit vs Blackwell, Bisimulation, Abstract Interpretation, POMDPs, and EVSI.
* [Theorem Index](06-back-matter/theorem-index.md) — Index of all 226 verified theorems with Lean 4 cross-links.
* [Definition Index](06-back-matter/definition-index.md) — Canonical index of mathematical definitions.
* [Lean 4 Mapping Matrix](06-back-matter/lean-mapping-matrix.md) — 1-to-1 matrix linking Text Theorems $\leftrightarrow$ Lean 4 Symbols $\leftrightarrow$ Verification Status (0 `sorry`s).

---

## Navigation Pathways

Depending on your goal, we recommend the following reading paths:

* **Foundational Theory Track:** `00-front-matter/` $\to$ `01-volume-1-foundations/` $\to$ `02-volume-2-structural-sufficiency/` $\to$ `05-volume-5-extensions-metatheory/` (Section V-A).
* **Runtime & Systems Engineering Track:** `00-front-matter/` $\to$ `02-volume-2-structural-sufficiency/` $\to$ `03-volume-3-governance/` $\to$ `04-volume-4-governed-convergence/`.
* **Category Theory & Metatheory Track:** `02-volume-2-structural-sufficiency/` $\to$ `05-volume-5-extensions-metatheory/` (Sections V-B, V-C, V-D, V-E).

---

## Formal Verification Metrics

* **Lean 4 Version:** `v4.16.0`
* **Verified Theorems:** 226 / 226 (100% mechanized)
* **Unproven Hypotheses / `sorry` Count:** 0
* **Formalization Workspace:** `takt-formal/TaktFormal/`
