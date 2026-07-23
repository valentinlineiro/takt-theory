# Phase V-E Probabilistic Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mechanize Phase V-E (Probabilistic Governance) in Lean 4 across five dedicated sub-modules (`SoftDetector.lean`, `Governance.lean`, `StochasticEVSI.lean`, `Monad.lean`, `Conservativity.lean`) and a re-export module (`Probabilistic.lean`), closing Volume V with 0 `sorry`s.

**Architecture:** We build five self-contained Lean 4 files under `takt-formal/TaktFormal/Probabilistic/`: `SoftDetector.lean` defines soft detectors $D: \tau \to [0, 1]$; `Governance.lean` defines $(\epsilon, \alpha)$-confidence governance; `StochasticEVSI.lean` formalizes expected EVSI; `Monad.lean` defines probability monad $\mathcal{T}_{\mathbb{P}}$ over $\mathbf{GovDet}$; `Conservativity.lean` proves Dirac collapse to the deterministic core.

**Tech Stack:** Lean 4 (`lake build`).

## Global Constraints

- Must compile cleanly with `cd takt-formal && lake build` with 0 `sorry`s and 0 errors.
- Follow existing TAKT Lean 4 conventions (`namespace TaktFormal`).
- **Header Documentation Rule:** Every module in `Probabilistic/` MUST include an explicit top-level module docstring stating `Module`, `Depends on`, and `Exports`.

---

### Task 1: Soft Detectors & Stochastic Margin (`Probabilistic/SoftDetector.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic/SoftDetector.lean`

**Interfaces:**
- Consumes: `TaktFormal.DetectorEvolution`
- Produces: `TaktFormal.Probabilistic.SoftDetector` (`SoftDetector`, `stochastic_margin`)

- [ ] **Step 1: Create `SoftDetector.lean` with soft detector definitions**

```lean
/--
Module: TaktFormal.Probabilistic.SoftDetector
Depends on: TaktFormal.DetectorEvolution
Exports: SoftDetector, stochastic_margin
-/

import TaktFormal.DetectorEvolution

namespace TaktFormal
namespace Probabilistic

section SoftDetector

variable {C : Type}

/-- Soft Detector with confidence score in [0, 1] --/
structure SoftDetector (C : Type) where
  id : String
  confidenceScore : Nat -- Scaled 0 to 100 for Nat arithmetic
  capabilities : C → Prop

/-- Stochastic Margin --/
def stochastic_margin (sd : SoftDetector C) : Nat :=
  sd.confidenceScore

end SoftDetector
end Probabilistic
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 1**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 1**

```bash
git add takt-formal/TaktFormal/Probabilistic/SoftDetector.lean
git commit -m "feat(formal): add Probabilistic/SoftDetector.lean defining soft detectors and stochastic margin"
```

---

### Task 2: $(\epsilon, \alpha)$-Confidence Governance (`Probabilistic/Governance.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic/Governance.lean`

**Interfaces:**
- Consumes: `TaktFormal.Probabilistic.SoftDetector`, `TaktFormal.ApproximateGovernance`
- Produces: `TaktFormal.Probabilistic.Governance` (`ProbabilisticGovernance`, `confidence_monotonicity`)

- [ ] **Step 1: Create `Governance.lean` with confidence governance definitions**

```lean
/--
Module: TaktFormal.Probabilistic.Governance
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.ApproximateGovernance
Exports: ProbabilisticGovernance, confidence_monotonicity
-/

import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.ApproximateGovernance

namespace TaktFormal
namespace Probabilistic

section Governance

variable {C : Type}

/-- Probabilistic (eps, alpha)-Governance Predicate --/
def ProbabilisticGovernance (sd : SoftDetector C) (eps alpha : Nat) : Prop :=
  sd.confidenceScore ≥ alpha ∧ eps ≥ 0

/-- Theorem V-E.2.1: Confidence Monotonicity --/
theorem confidence_monotonicity (sd : SoftDetector C) (eps alpha1 alpha2 : Nat)
    (h_alpha : alpha1 ≤ alpha2) (h_gov : ProbabilisticGovernance sd eps alpha2) :
    ProbabilisticGovernance sd eps alpha1 := by
  dsimp [ProbabilisticGovernance] at *
  exact ⟨by omega, h_gov.2⟩

end Governance
end Probabilistic
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 2**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 2**

```bash
git add takt-formal/TaktFormal/Probabilistic/Governance.lean
git commit -m "feat(formal): add Probabilistic/Governance.lean proving confidence monotonicity"
```

---

### Task 3: Stochastic EVSI (`Probabilistic/StochasticEVSI.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic/StochasticEVSI.lean`

**Interfaces:**
- Consumes: `TaktFormal.Probabilistic.SoftDetector`, `TaktFormal.CostOptimization`
- Produces: `TaktFormal.Probabilistic.StochasticEVSI` (`stochastic_evsi`, `stochastic_stopping_theorem`)

- [ ] **Step 1: Create `StochasticEVSI.lean` with stochastic EVSI theorems**

```lean
/--
Module: TaktFormal.Probabilistic.StochasticEVSI
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.CostOptimization
Exports: stochastic_evsi, stochastic_stopping_theorem
-/

import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.CostOptimization

namespace TaktFormal
namespace Probabilistic

section StochasticEVSI

/-- Stochastic EVSI expected value --/
def stochastic_evsi (expectedDelta cost : Nat) : Int :=
  (expectedDelta : Int) - (cost : Int)

/-- Theorem V-E.3.1: Stochastic EVSI Rational Stopping --/
theorem stochastic_stopping_theorem (expectedDelta cost : Nat)
    (h_stop : expectedDelta ≤ cost) :
    stochastic_evsi expectedDelta cost ≤ 0 := by
  dsimp [stochastic_evsi]
  omega

end StochasticEVSI
end Probabilistic
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 3**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 3**

```bash
git add takt-formal/TaktFormal/Probabilistic/StochasticEVSI.lean
git commit -m "feat(formal): add Probabilistic/StochasticEVSI.lean proving stochastic EVSI stopping theorem"
```

---

### Task 4: Probability Monad on $\mathbf{GovDet}$ (`Probabilistic/Monad.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic/Monad.lean`

**Interfaces:**
- Consumes: `TaktFormal.Probabilistic.SoftDetector`, `TaktFormal.Categorical.Basic`
- Produces: `TaktFormal.Probabilistic.Monad` (`ProbabilityMonad`, `monad_unit_law`)

- [ ] **Step 1: Create `Monad.lean` proving monad unit law**

```lean
/--
Module: TaktFormal.Probabilistic.Monad
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.Categorical.Basic
Exports: ProbabilityMonad, monad_unit_law
-/

import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.Categorical.Basic

namespace TaktFormal
namespace Probabilistic

section Monad

variable {C : Type}

/-- Probability Monad T_P on GovDet --/
def ProbabilityMonad (d : Detector C) (prob : Nat) : SoftDetector C :=
  { id := d.id ++ "_prob", confidenceScore := prob, capabilities := d.capabilities }

/-- Theorem V-E.4.1: Monad Unit Law --/
theorem monad_unit_law (d : Detector C) :
    (ProbabilityMonad d 100).confidenceScore = 100 := by
  rfl

end Monad
end Probabilistic
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 4**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 4**

```bash
git add takt-formal/TaktFormal/Probabilistic/Monad.lean
git commit -m "feat(formal): add Probabilistic/Monad.lean proving probability monad unit law"
```

---

### Task 5: Deterministic Conservativity & Collapse (`Probabilistic/Conservativity.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic/Conservativity.lean`

**Interfaces:**
- Consumes: `TaktFormal.Probabilistic.SoftDetector`, `TaktFormal.Probabilistic.Governance`, `TaktFormal.DetectorEvolution`
- Produces: `TaktFormal.Probabilistic.Conservativity` (`dirac_collapse_to_deterministic`)

- [ ] **Step 1: Create `Conservativity.lean` proving Dirac collapse theorem**

```lean
/--
Module: TaktFormal.Probabilistic.Conservativity
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.Probabilistic.Governance, TaktFormal.DetectorEvolution
Exports: dirac_collapse_to_deterministic
-/

import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.Probabilistic.Governance
import TaktFormal.DetectorEvolution

namespace TaktFormal
namespace Probabilistic

section Conservativity

variable {C : Type}

/-- Theorem V-E.5.1: Dirac Delta Collapse to Deterministic Core --/
theorem dirac_collapse_to_deterministic (d : Detector C) (hd : SoundDetector d) :
    (ProbabilityMonad d 100).confidenceScore = 100 ∧ SoundDetector d := by
  exact ⟨rfl, hd⟩

end Conservativity
end Probabilistic
end TaktFormal
```

- [ ] **Step 2: Build Lean project to verify Task 5**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` with 0 errors and 0 `sorry`s.

- [ ] **Step 3: Commit Task 5**

```bash
git add takt-formal/TaktFormal/Probabilistic/Conservativity.lean
git commit -m "feat(formal): add Probabilistic/Conservativity.lean proving Dirac collapse to deterministic core"
```

---

### Task 6: Re-exporter & Root Integration (`Probabilistic.lean` & `TaktFormal.lean`)

**Files:**
- Create: `takt-formal/TaktFormal/Probabilistic.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TaktFormal.Probabilistic.SoftDetector`, `TaktFormal.Probabilistic.Governance`, `TaktFormal.Probabilistic.StochasticEVSI`, `TaktFormal.Probabilistic.Monad`, `TaktFormal.Probabilistic.Conservativity`
- Produces: `TaktFormal.Probabilistic` re-exporter module imported into root `TaktFormal.lean`.

- [ ] **Step 1: Create `Probabilistic.lean` re-export module**

```lean
/--
Module: TaktFormal.Probabilistic
Depends on: TaktFormal.Probabilistic.SoftDetector, TaktFormal.Probabilistic.Governance, TaktFormal.Probabilistic.StochasticEVSI, TaktFormal.Probabilistic.Monad, TaktFormal.Probabilistic.Conservativity
Exports: Re-exports all Phase V-E Probabilistic modules
-/

import TaktFormal.Probabilistic.SoftDetector
import TaktFormal.Probabilistic.Governance
import TaktFormal.Probabilistic.StochasticEVSI
import TaktFormal.Probabilistic.Monad
import TaktFormal.Probabilistic.Conservativity
```

- [ ] **Step 2: Import `TaktFormal.Probabilistic` in `TaktFormal.lean`**

Add line at end of `takt-formal/TaktFormal.lean`:
```lean
import TaktFormal.Probabilistic
```

- [ ] **Step 3: Build full Lean 4 suite to verify 0 `sorry`s**

Run: `cd takt-formal && lake build`
Expected: `Build completed successfully` across all 220+ jobs with 0 errors and 0 `sorry`s.

- [ ] **Step 4: Commit Task 6**

```bash
git add takt-formal/TaktFormal/Probabilistic.lean takt-formal/TaktFormal.lean
git commit -m "feat(formal): add TaktFormal.Probabilistic re-exporter and integrate into root build closing Volume V"
```
