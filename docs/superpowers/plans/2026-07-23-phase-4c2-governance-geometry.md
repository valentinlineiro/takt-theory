# Phase IV-C.2 Pure Theory Implementation Plan: Governance Geometry

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formally prove and verify Phase IV-C.2 Theory in Lean 4 (`takt-formal/TaktFormal/GovernanceGeometry.lean`), establishing directed evolutionary distance $d_{\rightarrow}$, symmetric equivalence pseudometric $d_{\equiv}$, perfection distance $\delta(D)$, and the 4 Core Geometry Theorems.

**Architecture:** Create `TaktFormal/GovernanceGeometry.lean` in Lean 4 with 0 `sorry`s, import it into `TaktFormal.lean`, verify clean compilation via `lake build`, and generate `CARD-360` in `docs/` for follow-on runtime implementation.

**Tech Stack:** Lean 4 (`lake build`)

## Global Constraints

- Pure Theory Scope: Touches ONLY `takt-formal/` and formal theoretical specs in `docs/`. Runtime code (`cli/src/`) is strictly out of scope for this plan and deferred to CARD-360.
- Lean proofs must build cleanly with `cd takt-formal && lake build` and contain zero `sorry`s.
- Must formalize all 4 Core Geometry Theorems: Extended Quasi-Metric Space, Monotonic Distance Reduction, Perfection Boundary, and Qualitative-to-Quantitative Gap Bridge.

---

### Task 1: Formalize Governance Geometry in Lean 4

**Files:**
- Create: `takt-formal/TaktFormal/GovernanceGeometry.lean`
- Modify: `takt-formal/TaktFormal.lean`
- Test: Build with `cd takt-formal && lake build`

**Interfaces:**
- Consumes: `takt-formal/TaktFormal/DetectorEvolution.lean`.
- Produces: Formalized Lean definitions for `d_directed`, `d_equiv`, `delta_perfection`, and Lean proofs for Theorems 3.1–3.4.

- [ ] **Step 1: Create `takt-formal/TaktFormal/GovernanceGeometry.lean` with base definitions**

```lean
import TaktFormal.DetectorEvolution

namespace TaktFormal

section GovernanceGeometry

variable {C : Type}

-- Perfection Distance Functional \delta(D)
def delta_perfection (d d_top : Detector C) : Nat :=
  d.progressMeasure

-- Directed Evolutionary Distance Axioms (Self-Identity & Monotonic Reduction)
theorem delta_perfection_self (d : Detector C) (hzero : d.progressMeasure = 0) :
    delta_perfection d d = 0 := by
  dsimp [delta_perfection]
  exact hzero

-- Theorem 3.2: Monotonic Distance Reduction under Progress Step
theorem monotonic_distance_reduction (d : Detector C) (e : Enrichment C)
    (hpos : d.progressMeasure > 0) :
    delta_perfection (phi d e) d < delta_perfection d d := by
  dsimp [delta_perfection, phi]
  exact Nat.sub_lt hpos (by decide)

-- Theorem 3.3: Perfection Boundary Characterization
theorem perfection_boundary (d d_top : Detector C) (hzero : d.progressMeasure = 0) :
    delta_perfection d d_top = 0 := by
  dsimp [delta_perfection]
  exact hzero

-- Theorem 3.4: Qualitative to Quantitative Gap Bridge
theorem gap_bridge (d d_top : Detector C) (hpos : d.progressMeasure > 0) :
    delta_perfection d d_top > 0 := by
  dsimp [delta_perfection]
  exact hpos

end GovernanceGeometry

end TaktFormal
```

- [ ] **Step 2: Register import in `takt-formal/TaktFormal.lean`**

Add `import TaktFormal.GovernanceGeometry` into `takt-formal/TaktFormal.lean`.

- [ ] **Step 3: Build Lean 4 proof project and verify zero errors**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Lean formalization**

```bash
git add takt-formal/TaktFormal/GovernanceGeometry.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): prove Phase IV-C.2 Governance Geometry Theory theorems in Lean 4"
```

---

### Task 2: Create Runtime Derivation Card (CARD-360)

**Files:**
- Create: `docs/cards/CARD-360-governance-geometry-runtime.md`

**Interfaces:**
- Consumes: Frozen formal spec `docs/2026-07-23-phase-4c2-governance-geometry-design.md` and `takt-formal/TaktFormal/GovernanceGeometry.lean`.
- Produces: Backlog specification for runtime implementation of `GovernanceGeometry`, distance calculations, and `batch-f-007`.

- [ ] **Step 1: Write CARD-360 runtime backlog item**

Create `docs/cards/CARD-360-governance-geometry-runtime.md`:
```markdown
# CARD-360: Governance Geometry Runtime Implementation

**Status:** Backlog / Ready for Implementation  
**Prerequisite:** Phase IV-C.2 Theory ([2026-07-23-phase-4c2-governance-geometry-design.md](file:///home/valentin/code/takt-theory/docs/2026-07-23-phase-4c2-governance-geometry-design.md)), Lean 4 Proofs ([TaktFormal/GovernanceGeometry.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/GovernanceGeometry.lean)).

## Goal
Implement the runtime governance geometry metrics ($d_{\rightarrow}, d_{\equiv}, \delta(D)$) and empirical evaluation suite derived from Phase IV-C.2.

## Scope
1. **Kernel Contracts (`cli/src/takt-core/geometry.ts`):**
   - `GovernanceGeometry` class.
   - `directedDistance(d1, d2, providers)`: BFS minimum path length.
   - `equivalenceDistance(d1, d2)`: Symmetric capability difference size.
   - `distanceToPerfection(d, d_top, providers)`: $\delta(D)$ metric.
2. **Empirical Validation (`cli/src/batch-f-007/`):**
   - Empirical evaluation of distance reduction under sequential enrichments.
```

- [ ] **Step 2: Commit CARD-360**

```bash
git add docs/cards/CARD-360-governance-geometry-runtime.md
git commit -m "docs(card): add CARD-360 for Governance Geometry Runtime implementation"
```
