# Step 2: Unified Monograph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute Step 2 of the post-Lean roadmap by building the complete 5-Volume TAKT Unified Monograph in `docs/monograph/` featuring Triple-Level Traceability (Narrative, Mathematical, Formal Lean 4 mapping).

**Architecture:** We build a structured monograph repository in `docs/monograph/` comprising Front Matter, Volumes I–V, and Back Matter with exhaustive Lean 4 code traceability matrices mapping all 226 verified theorems.

---

### Task 1: Front Matter (`docs/monograph/00-front-matter/`)

**Files:**
- Create: `docs/monograph/README.md`
- Create: `docs/monograph/00-front-matter/preface.md`
- Create: `docs/monograph/00-front-matter/notation-conventions.md`
- Create: `docs/monograph/00-front-matter/glossary.md`
- Create: `docs/monograph/00-front-matter/global-dependency-map.md`

- [ ] **Step 1: Write Front Matter files**
  - `README.md`: Master Index & Triple Reading Level Guide.
  - `preface.md`: Conceptual motivation ("Adequacy over Completeness").
  - `notation-conventions.md`: Math symbols, posets, kernels, metrics.
  - `glossary.md`: Harmonized terminology from Step 1 audit.
  - `global-dependency-map.md`: Mermaid dependency graph across all 5 volumes.

- [ ] **Step 2: Commit Task 1**
```bash
git add docs/monograph/
git commit -m "docs(monograph): create Front Matter and master monograph structure"
```

---

### Task 2: Volume I — Foundations (`docs/monograph/01-volume-1-foundations/`)

**Files:**
- Create: `docs/monograph/01-volume-1-foundations/volume-1-foundations.md`

- [ ] **Step 1: Write Volume I with 3-Level Traceability**
  - Problem Statement, Decision Systems $(S, A, U, D)$, Representations $R: S \to Z$, Capability Invariants, Regret.
  - Include Level 1 (Narrative), Level 2 (Math Proofs), Level 3 (Lean 4 mapping to `TaktFormal/Basic.lean`).

- [ ] **Step 2: Commit Task 2**
```bash
git add docs/monograph/01-volume-1-foundations/
git commit -m "docs(monograph): write Volume I - Foundations with triple traceability"
```

---

### Task 3: Volume II — Structural Sufficiency (`docs/monograph/02-volume-2-structural-sufficiency/`)

**Files:**
- Create: `docs/monograph/02-volume-2-structural-sufficiency/volume-2-structural-sufficiency.md`

- [ ] **Step 1: Write Volume II with 3-Level Traceability**
  - Capability Kernels $K_D$, Structural Sufficiency Theorem (ST-015) ($\text{ker}(R) \subseteq K_D$), Minimal Quotient Representation $R_{\text{min}} = S / K_D$, Finite Bound $|S / K_D| \le 2^k$.
  - Include Level 1 (Narrative), Level 2 (Math Proofs), Level 3 (Lean 4 mapping to `TaktFormal/StructuralSufficiency.lean`).

- [ ] **Step 2: Commit Task 3**
```bash
git add docs/monograph/02-volume-2-structural-sufficiency/
git commit -m "docs(monograph): write Volume II - Structural Sufficiency with triple traceability"
```

---

### Task 4: Volume III — Governance & Information Value (`docs/monograph/03-volume-3-governance/`)

**Files:**
- Create: `docs/monograph/03-volume-3-governance/volume-3-governance.md`

- [ ] **Step 1: Write Volume III with 3-Level Traceability**
  - Governance predicates, EVSI on detector graphs, Rational EVSI Stopping Theorem $\pi^*$, Net Value of Enrichment.
  - Include Level 1 (Narrative), Level 2 (Math Proofs), Level 3 (Lean 4 mapping to `TaktFormal/Cost/*.lean`).

- [ ] **Step 2: Commit Task 4**
```bash
git add docs/monograph/03-volume-3-governance/
git commit -m "docs(monograph): write Volume III - Governance & Information Value with triple traceability"
```

---

### Task 5: Volume IV — Governed Convergence & Geometry (`docs/monograph/04-volume-4-governed-convergence/`)

**Files:**
- Create: `docs/monograph/04-volume-4-governed-convergence/volume-4-governed-convergence.md`

- [ ] **Step 1: Write Volume IV with 3-Level Traceability**
  - Detector graph $\mathcal{G}_D$, Dual Geometry $(d_{\rightarrow}, d_{\equiv})$, Perfection Distance $\delta(D)$, Dynamic Surprisal Margin $M_D$, Guaranteed Intervention Horizon $h^* = \lfloor M_D / c_{\text{max}} \rfloor$, Asymmetric Calibration $M_D^{\text{calib}}$.
  - Include Level 1 (Narrative), Level 2 (Math Proofs), Level 3 (Lean 4 mapping to `TaktFormal/GovernanceGeometry.lean`, `DecisionMargin.lean`).

- [ ] **Step 2: Commit Task 5**
```bash
git add docs/monograph/04-volume-4-governed-convergence/
git commit -m "docs(monograph): write Volume IV - Governed Convergence & Geometry with triple traceability"
```

---

### Task 6: Volume V — Extensions & Metatheory (`docs/monograph/05-volume-5-extensions-metatheory/`)

**Files:**
- Create: `docs/monograph/05-volume-5-extensions-metatheory/volume-5-extensions-metatheory.md`

- [ ] **Step 1: Write Volume V with 3-Level Traceability**
  - Metatheory (Conservativity $\iota$, Independence $A_1, A_2, A_3$, Minimality, Redundancy).
  - System Composition ($S_1 \otimes S_2$, $S_2 \circ S_1$).
  - Categorical Unification ($\mathbf{GovDet}$, Adjunction $\mathcal{A} \dashv \mathcal{E}$).
  - Computational Complexity (FPT $\mathcal{O}(2^k \cdot |\mathcal{E}|)$ by kernel dimension $k$).
  - Probabilistic Extension (Soft Detectors, Probability Monad $\mathcal{T}_{\mathbb{P}}$, Dirac Collapse).
  - Include Level 1 (Narrative), Level 2 (Math Proofs), Level 3 (Lean 4 mapping to `TaktFormal/Metatheory/*.lean`, `Composition/*.lean`, `Categorical/*.lean`, `Complexity/*.lean`, `Probabilistic/*.lean`).

- [ ] **Step 2: Commit Task 6**
```bash
git add docs/monograph/05-volume-5-extensions-metatheory/
git commit -m "docs(monograph): write Volume V - Extensions & Metatheory with triple traceability"
```

---

### Task 7: Back Matter & Lean Traceability Matrix (`docs/monograph/06-back-matter/`)

**Files:**
- Create: `docs/monograph/06-back-matter/literature-positioning.md`
- Create: `docs/monograph/06-back-matter/theorem-index.md`
- Create: `docs/monograph/06-back-matter/definition-index.md`
- Create: `docs/monograph/06-back-matter/lean-mapping-matrix.md`

- [ ] **Step 1: Write Back Matter files**
  - `literature-positioning.md`: Comparative audit from Step 1.
  - `theorem-index.md`: Hyperlinked index of all 226 theorems.
  - `definition-index.md`: Hyperlinked index of all definitions.
  - `lean-mapping-matrix.md`: Full 1-to-1 mapping matrix (Text Theorem $\leftrightarrow$ Lean File & Symbol $\leftrightarrow$ 0 `sorry`s status).

- [ ] **Step 2: Commit Task 7**
```bash
git add docs/monograph/06-back-matter/
git commit -m "docs(monograph): finalize Back Matter and full Lean 4 traceability matrix"
```
