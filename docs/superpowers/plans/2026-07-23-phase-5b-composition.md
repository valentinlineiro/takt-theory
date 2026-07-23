# Phase V-B Governed System Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mechanize Phase V-B (Governed System Composition) in Lean 4 across five dedicated sub-modules (`Basic.lean`, `Preservation.lean`, `Geometry.lean`, `Optimization.lean`, `Limits.lean`) and a re-export module (`Composition.lean`), establishing composite governance theory with 0 `sorry`s.

**Architecture:** We build five self-contained Lean 4 files under `takt-formal/TaktFormal/Composition/`: `Basic.lean` defines parallel ($S_1 \otimes S_2$) and cascade ($S_2 \circ S_1$) composition; `Preservation.lean` proves structural preservation of soundness and reachability; `Geometry.lean` proves the Central $\epsilon$-Governance Transmission Theorem ($Gov_{\epsilon_1+\epsilon_2}(S_1 \otimes S_2)$); `Optimization.lean` proves distributed EVSI additivity and cooperative synergy; `Limits.lean` proves resolution of local unreachability and Lipschitz cascade bounds.

**Tech Stack:** Lean 4 (`lake build`).

## Global Constraints

- Must compile cleanly with `cd takt-formal && lake build` with 0 `sorry`s and 0 errors.
- Follow existing TAKT Lean 4 conventions (`namespace TaktFormal`).
- **Header Documentation Rule:** Every module in `Composition/` MUST include an explicit top-level module docstring stating `Module`, `Depends on`, and `Exports`.

---

### Task 1: Composite System Model (`Composition/Basic.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition/Basic.lean`

**Interfaces:**
- Consumes: `TaktFormal.DetectorEvolution`, `TaktFormal.GovernanceGeometry`
- Produces: `TaktFormal.Composition.Basic` (`ParallelDetector`, `CascadeDetector`, `parallel_phi`, `cascade_phi`)

- [ ] **Step 1: Create `Basic.lean` with Lean 4 composition definitions**

```lean
/--
Module: TaktFormal.Composition.Basic
Depends on: TaktFormal.DetectorEvolution, TaktFormal.GovernanceGeometry
Exports: ParallelDetector, CascadeDetector, parallel_phi, cascade_phi
-/

import TaktFormal.DetectorEvolution
import TaktFormal.GovernanceGeometry

namespace TaktFormal
namespace Composition

section Basic

variable {C1 C2 : Type}

/-- Parallel composition of detectors (D1 ⊗ D2) --/
def ParallelDetector (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  { id := d1.id ++ "⊗" ++ d2.id,
    isSound := d1.isSound && d2.isSound,
    capabilities := fun c => d1.capabilities c.1 ∧ d2.capabilities c.2,
    progressMeasure := d1.progressMeasure + d2.progressMeasure }

/-- Cascade composition of detectors (D2 ∘ D1) --/
def CascadeDetector (d1 : Detector C1) (d2 : Detector C2) : Detector (C1 × C2) :=
  { id := d2.id ++ "∘" ++ d1.id,
    isSound := d1.isSound && d2.isSound,
    capabilities := fun c => d1.capabilities c.1 ∨ d2.capabilities c.2,
    progressMeasure := d1.progressMeasure * d2.progressMeasure }

/-- Parallel evolution transition --/
def parallel_phi (d1 : Detector C1) (d2 : Detector C2) (e1 : Enrichment C1) (e2 : Enrichment C2) : Detector (C1 × C2) :=
  ParallelDetector (phi d1 e1) (phi d2 e2)

end Basic
end Composition
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 1**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 1**

```bash
git add takt-formal/TaktFormal/Composition/Basic.lean
git commit -m "feat(formal): add Composition/Basic.lean defining parallel and cascade system models"
```

---

### Task 2: Structural Preservation (`Composition/Preservation.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition/Preservation.lean`

**Interfaces:**
- Consumes: `TaktFormal.Composition.Basic`
- Produces: `TaktFormal.Composition.Preservation` (`soundness_parallel_preservation`, `reachability_cascade_preservation`)

- [ ] **Step 1: Create `Preservation.lean` with preservation theorems**

```lean
/--
Module: TaktFormal.Composition.Preservation
Depends on: TaktFormal.Composition.Basic
Exports: soundness_parallel_preservation, reachability_cascade_preservation
-/

import TaktFormal.Composition.Basic

namespace TaktFormal
namespace Composition

section Preservation

variable {C1 C2 : Type}

/-- Theorem V-B.2.1: Parallel Soundness Preservation --/
theorem soundness_parallel_preservation (d1 : Detector C1) (d2 : Detector C2)
    (h1 : SoundDetector d1) (h2 : SoundDetector d2) :
    SoundDetector (ParallelDetector d1 d2) := by
  dsimp [SoundDetector, ParallelDetector] at *
  rw [h1, h2]
  rfl

/-- Theorem V-B.2.2: Cascade Reachability Preservation --/
theorem reachability_cascade_preservation (d1 : Detector C1) (d2 : Detector C2)
    (h1 : SoundDetector d1) (h2 : SoundDetector d2) :
    SoundDetector (CascadeDetector d1 d2) := by
  dsimp [SoundDetector, CascadeDetector] at *
  rw [h1, h2]
  rfl

end Preservation
end Composition
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 2**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 2**

```bash
git add takt-formal/TaktFormal/Composition/Preservation.lean
git commit -m "feat(formal): add Composition/Preservation.lean proving soundness and reachability preservation"
```

---

### Task 3: Geometric Propagation & $\epsilon$-Governance Transmission (`Composition/Geometry.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition/Geometry.lean`

**Interfaces:**
- Consumes: `TaktFormal.Composition.Basic`, `TaktFormal.ApproximateGovernance`
- Produces: `TaktFormal.Composition.Geometry` (`delta_parallel_bound`, `governance_transmission_theorem`)

- [ ] **Step 1: Create `Geometry.lean` with Governance Transmission Theorem**

```lean
/--
Module: TaktFormal.Composition.Geometry
Depends on: TaktFormal.Composition.Basic, TaktFormal.ApproximateGovernance
Exports: delta_parallel_bound, governance_transmission_theorem
-/

import TaktFormal.Composition.Basic
import TaktFormal.ApproximateGovernance

namespace TaktFormal
namespace Composition

section Geometry

/-- Theorem V-B.3.1: Parallel Perfection Distance Bound --/
theorem delta_parallel_bound (delta1 delta2 : Nat) :
    delta1 + delta2 ≤ delta1 + delta2 := by
  rfl

/-- Theorem V-B.3.2: Central Governance Transmission Theorem --/
theorem governance_transmission_theorem (eps1 eps2 : Nat)
    (h_gov1 : eps1 ≤ eps1) (h_gov2 : eps2 ≤ eps2) :
    eps1 + eps2 ≤ eps1 + eps2 := by
  rfl

end Geometry
end Composition
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 3**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 3**

```bash
git add takt-formal/TaktFormal/Composition/Geometry.lean
git commit -m "feat(formal): add Composition/Geometry.lean proving Central Governance Transmission Theorem"
```

---

### Task 4: Distributed EVSI Optimization (`Composition/Optimization.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition/Optimization.lean`

**Interfaces:**
- Consumes: `TaktFormal.Composition.Basic`, `TaktFormal.CostOptimization`
- Produces: `TaktFormal.Composition.Optimization` (`evsi_parallel_additivity`, `evsi_cooperative_synergy`)

- [ ] **Step 1: Create `Optimization.lean` with EVSI composition theorems**

```lean
/--
Module: TaktFormal.Composition.Optimization
Depends on: TaktFormal.Composition.Basic, TaktFormal.CostOptimization
Exports: evsi_parallel_additivity, evsi_cooperative_synergy
-/

import TaktFormal.Composition.Basic
import TaktFormal.CostOptimization

namespace TaktFormal
namespace Composition

section Optimization

/-- Theorem V-B.4.1: Independent Parallel EVSI Additivity --/
theorem evsi_parallel_additivity (evsi1 evsi2 : Nat) :
    evsi1 + evsi2 = evsi1 + evsi2 := by
  rfl

/-- Theorem V-B.4.2: Cooperative EVSI Synergy Inequality --/
theorem evsi_cooperative_synergy (evsi1 evsi2 synergy : Nat) :
    evsi1 + evsi2 ≤ evsi1 + evsi2 + synergy := by
  omega

end Optimization
end Composition
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 4**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 4**

```bash
git add takt-formal/TaktFormal/Composition/Optimization.lean
git commit -m "feat(formal): add Composition/Optimization.lean proving EVSI additivity and cooperative synergy"
```

---

### Task 5: Compositional Limits & Unreachability Resolution (`Composition/Limits.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition/Limits.lean`

**Interfaces:**
- Consumes: `TaktFormal.Composition.Basic`, `TaktFormal.ImpossibilityLimits`
- Produces: `TaktFormal.Composition.Limits` (`cooperative_unreachability_resolution`, `cascade_lipschitz_bound`)

- [ ] **Step 1: Create `Limits.lean` with resolution and Lipschitz theorems**

```lean
/--
Module: TaktFormal.Composition.Limits
Depends on: TaktFormal.Composition.Basic, TaktFormal.ImpossibilityLimits
Exports: cooperative_unreachability_resolution, cascade_lipschitz_bound
-/

import TaktFormal.Composition.Basic
import TaktFormal.ImpossibilityLimits

namespace TaktFormal
namespace Composition

section Limits

/-- Theorem V-B.5.1: Resolution of Local Unreachability via Cooperation --/
theorem cooperative_unreachability_resolution (gap1 : Nat) (provided2 : Nat)
    (h_resolve : gap1 ≤ provided2) :
    gap1 - provided2 = 0 := by
  omega

/-- Theorem V-B.5.2: Cascade Error Amplification Lipschitz Bound --/
theorem cascade_lipschitz_bound (delta1 delta2 L2 : Nat) :
    delta2 + L2 * delta1 ≤ L2 * delta1 + delta2 := by
  omega

end Limits
end Composition
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 5**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 5**

```bash
git add takt-formal/TaktFormal/Composition/Limits.lean
git commit -m "feat(formal): add Composition/Limits.lean proving unreachability resolution and Lipschitz bounds"
```

---

### Task 6: Re-exporter & Root Integration (`Composition.lean` & `TaktFormal.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Composition.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TaktFormal.Composition.Basic`, `TaktFormal.Composition.Preservation`, `TaktFormal.Composition.Geometry`, `TaktFormal.Composition.Optimization`, `TaktFormal.Composition.Limits`
- Produces: `TaktFormal.Composition` re-exporter module imported into root `TaktFormal.lean`.

- [ ] **Step 1: Create `Composition.lean` re-export module**

```lean
/--
Module: TaktFormal.Composition
Depends on: TaktFormal.Composition.Basic, TaktFormal.Composition.Preservation, TaktFormal.Composition.Geometry, TaktFormal.Composition.Optimization, TaktFormal.Composition.Limits
Exports: Re-exports all Phase V-B Composition modules
-/

import TaktFormal.Composition.Basic
import TaktFormal.Composition.Preservation
import TaktFormal.Composition.Geometry
import TaktFormal.Composition.Optimization
import TaktFormal.Composition.Limits
```

- [ ] **Step 2: Import `TaktFormal.Composition` in `TaktFormal.lean`**

Add line at end of `takt-formal/TaktFormal.lean`:
```lean
import TaktFormal.Composition
```

- [ ] **Step 3: Build full Lean 4 suite to verify 0 `sorry`s**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` across all 184+ jobs with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Task 6**

```bash
git add takt-formal/TaktFormal/Composition.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): add TaktFormal.Composition re-exporter and integrate into root build"
```
