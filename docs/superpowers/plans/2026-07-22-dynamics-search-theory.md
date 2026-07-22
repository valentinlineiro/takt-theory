# Dynamics & Search Theory Lean Formalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Formalize the abstract search and transition theory for representation spaces in Lean 4, defining transition systems, trajectories, neighborhoods, cover systems, composition path costs, reachability, feasibility, and optimal solutions.

**Architecture:** Create three new files under `takt-formal/TaktFormal/Landscape/` (`Transition.lean`, `PathCost.lean`, `SearchProblem.lean`), integrate them into the entry point `TaktFormal.lean`, and verify compilation using Lake.

**Tech Stack:** Lean 4, Lake build system.

## Global Constraints
* Every module must compile cleanly under `lake build` with no warnings, errors, or `sorry`s.
* The formalization must remain abstract (over type parameter `X` and arbitrary relations `to`) before instantiating with specific landscapes and cover relations.
* Do not introduce any dependencies on Mathlib; rely strictly on Lean 4 core constructs.

---

### Task 1: Formalize Transition Systems & Cover Instantiation

**Files:**
- Create: `takt-formal/TaktFormal/Landscape/Transition.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `RepresentationSpace` from `TaktFormal.Representation.Preorder`, `AbstractLandscape` from `TaktFormal.Landscape.Basic`, and `IsCover` from `TaktFormal.Landscape.Cover`.
- Produces: `TransitionSystem`, `Trajectory`, `ForwardNeighborhood`, `BackwardNeighborhood`, `SymmetricNeighborhood`, `CanonicalCoverTransitionSystem`, and `symmetric_neighborhood_cover` theorem.

- [ ] **Step 1: Write the failing Lean module**

Create `takt-formal/TaktFormal/Landscape/Transition.lean` containing structural definition and a `sorry` in the theorem:
```lean
import TaktFormal.Landscape.Basic
import TaktFormal.Landscape.Cover

/-- A Transition System over an arbitrary type `X` is a relation `to`. -/
structure TransitionSystem (X : Type) where
  to : X → X → Prop

/-- A Trajectory in a transition system: a sequence of transitions. -/
inductive Trajectory {X : Type} (T : TransitionSystem X) : List X → Prop where
  | nil : Trajectory T []
  | single : ∀ x, Trajectory T [x]
  | step : ∀ x y rest, T.to x y → Trajectory T (y :: rest) → Trajectory T (x :: y :: rest)

/-- Forward Neighborhood. -/
def ForwardNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  T.to x y

/-- Backward Neighborhood. -/
def BackwardNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  T.to y x

/-- Symmetric Neighborhood. -/
def SymmetricNeighborhood {X : Type} (T : TransitionSystem X) (x y : X) : Prop :=
  ForwardNeighborhood T x y ∨ BackwardNeighborhood T x y

/-- Canonical cover transition system over a landscape `L`. -/
def CanonicalCoverTransitionSystem (L : AbstractLandscape) : TransitionSystem L.R.Rep where
  to := IsCover L

/-- Theorem: Symmetric neighborhood in the canonical cover transition system
    corresponds to split or merge cover relation. -/
theorem symmetric_neighborhood_cover (L : AbstractLandscape) (R1 R2 : L.R.Rep) :
    SymmetricNeighborhood (CanonicalCoverTransitionSystem L) R1 R2 ↔ IsCover L R1 R2 ∨ IsCover L R2 R1 := by
  sorry
```

- [ ] **Step 2: Run build to verify compile/sorry warning**

Add the import `import TaktFormal.Landscape.Transition` to `takt-formal/TaktFormal.lean` around line 61.
Run: `cd takt-formal && lake build`
Expected: Build succeeds but reports a warning of `sorry` in `Transition.lean`.

- [ ] **Step 3: Write minimal implementation**

Replace the `sorry` in `Transition.lean` with the complete proof:
```lean
theorem symmetric_neighborhood_cover (L : AbstractLandscape) (R1 R2 : L.R.Rep) :
    SymmetricNeighborhood (CanonicalCoverTransitionSystem L) R1 R2 ↔ IsCover L R1 R2 ∨ IsCover L R2 R1 := by
  constructor
  · intro h
    cases h with
    | inl h_fwd => exact Or.inl h_fwd
    | inr h_bwd => exact Or.inr h_bwd
  · intro h
    cases h with
    | inl h_fwd => exact Or.inl h_fwd
    | inr h_bwd => exact Or.inr h_bwd
```

- [ ] **Step 4: Run build to verify clean compilation**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with NO warnings or errors.

- [ ] **Step 5: Commit**

Run:
```bash
git add takt-formal/TaktFormal/Landscape/Transition.lean takt-formal/TaktFormal.lean
git commit -m "proof(Dynamics): formalize TransitionSystem and Cover neighborhood theorem"
```

---

### Task 2: Formalize Transition Costs & Path Aggregation

**Files:**
- Create: `takt-formal/TaktFormal/Landscape/PathCost.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TransitionSystem` and `Trajectory` from `TaktFormal.Landscape.Transition`, and `CostPartialOrder` from `TaktFormal.Cost.Poset`.
- Produces: `CostComposition` type class and `TrajectoryCost` function.

- [ ] **Step 1: Write the failing Lean module**

Create `takt-formal/TaktFormal/Landscape/PathCost.lean` containing structural definition and a `sorry` implementation:
```lean
import TaktFormal.Landscape.Transition
import TaktFormal.Cost.Poset

/-- Cost Composition System over cost type `L`. -/
class CostComposition (L : Type) extends CostPartialOrder L where
  otimes : L → L → L
  e : L
  le_mono_left : ∀ a b c : L, a ≤ b → otimes c a ≤ otimes c b
  le_mono_right : ∀ a b c : L, a ≤ b → otimes a c ≤ otimes b c

/-- Recursive definition of trajectory cost using a proof of Trajectory. -/
def TrajectoryCost {X L : Type} [CostComposition L] {T : TransitionSystem X}
    (w : ∀ x y, T.to x y → L) {l : List X} (h : Trajectory T l) : L :=
  sorry
```

- [ ] **Step 2: Run build to verify compile/sorry warning**

Add the import `import TaktFormal.Landscape.PathCost` to `takt-formal/TaktFormal.lean` around line 62.
Run: `cd takt-formal && lake build`
Expected: Build succeeds but reports a warning of `sorry` in `PathCost.lean`.

- [ ] **Step 3: Write minimal implementation**

Replace the `sorry` in `PathCost.lean` with the recursive definition:
```lean
def TrajectoryCost {X L : Type} [CostComposition L] {T : TransitionSystem X}
    (w : ∀ x y, T.to x y → L) {l : List X} (h : Trajectory T l) : L :=
  match h with
  | Trajectory.nil => CostComposition.e
  | Trajectory.single _ => CostComposition.e
  | Trajectory.step x y rest h_to h_rest =>
      CostComposition.otimes (w x y h_to) (TrajectoryCost w h_rest)
```

- [ ] **Step 4: Run build to verify clean compilation**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with NO warnings or errors.

- [ ] **Step 5: Commit**

Run:
```bash
git add takt-formal/TaktFormal/Landscape/PathCost.lean takt-formal/TaktFormal.lean
git commit -m "proof(Dynamics): formalize CostComposition and TrajectoryCost"
```

---

### Task 3: Formalize Search Problems, Feasibility, & Reachability

**Files:**
- Create: `takt-formal/TaktFormal/Landscape/SearchProblem.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `TransitionSystem`, `Trajectory` from `TaktFormal.Landscape.Transition`, and `TrajectoryCost` from `TaktFormal.Landscape.PathCost`.
- Produces: `PreferenceRelation`, `SearchProblem`, `getLastState`, `IsSolution`, `IsFeasible`, `IsOptimalSolution`, `Reachable` inductive definition, `IsDeadEnd`, and `IsLocalTrap`.

- [ ] **Step 1: Write the failing Lean module**

Create `takt-formal/TaktFormal/Landscape/SearchProblem.lean` containing definitions and a `sorry` inside `IsSolution`:
```lean
import TaktFormal.Landscape.Transition
import TaktFormal.Landscape.PathCost

/-- A preference relation is a preorder over trajectories. -/
structure PreferenceRelation (X : Type) (T : TransitionSystem X) where
  le : {l1 l2 : List X} → Trajectory T l1 → Trajectory T l2 → Prop
  refl : ∀ {l} (h : Trajectory T l), le h h
  trans : ∀ {l1 l2 l3} (h1 : Trajectory T l1) (h2 : Trajectory T l2) (h3 : Trajectory T l3), le h1 h2 → le h2 h3 → le h1 h3

/-- A Search Problem over a transition system. -/
structure SearchProblem (X : Type) where
  T : TransitionSystem X
  I : X → Prop
  A : X → Prop
  Pref : PreferenceRelation X T

namespace SearchProblem

variable {X : Type} (P : SearchProblem X)

/-- Auxiliary helper to compute the last state of a non-empty list. -/
def getLastState {Y : Type} (default : Y) : List Y → Y
  | [] => default
  | y :: rest => getLastState y rest

/-- A trajectory is a solution if it starts in I and ends in A. -/
def IsSolution (l : List X) (h : Trajectory P.T l) : Prop :=
  sorry

/-- A search problem is feasible if a solution exists. -/
def IsFeasible : Prop :=
  ∃ l (h : Trajectory P.T l), IsSolution P l h

/-- A solution is optimal if it is preferred over all other solutions. -/
def IsOptimalSolution (l : List X) (h : Trajectory P.T l) (h_sol : IsSolution P l h) : Prop :=
  ∀ l' (h' : Trajectory P.T l') (h'_sol : IsSolution P l' h'),
    P.Pref.le h h'

/-- Abstract reachability relation: reflexive-transitive closure of transition. -/
inductive Reachable (T : TransitionSystem X) : X → X → Prop where
  | refl : ∀ x, Reachable T x x
  | step : ∀ x y z, T.to x y → Reachable T y z → Reachable T x z

/-- A state x is a Dead End if no state in A is reachable from it. -/
def IsDeadEnd (x : X) : Prop :=
  ¬ P.A x ∧ ∀ y, Reachable P.T x y → ¬ P.A y

/-- Local search preference relation over steps. -/
def LocalStepPreference (T : TransitionSystem X) := X → X → Prop

/-- A state x is a Local Trap under a local preference relation if it is not accepted,
    but all outgoing transitions are not locally preferred. -/
def IsLocalTrap (PrefLocal : LocalStepPreference P.T) (x : X) : Prop :=
  ¬ P.A x ∧ ∀ y, P.T.to x y → ¬ PrefLocal x y

end SearchProblem
```

- [ ] **Step 2: Run build to verify compile/sorry warning**

Add the import `import TaktFormal.Landscape.SearchProblem` to `takt-formal/TaktFormal.lean` around line 63.
Run: `cd takt-formal && lake build`
Expected: Build succeeds but reports a warning of `sorry` in `SearchProblem.lean`.

- [ ] **Step 3: Write minimal implementation**

Replace the `sorry` in `IsSolution` in `SearchProblem.lean` with the complete definition:
```lean
def IsSolution (l : List X) (h : Trajectory P.T l) : Prop :=
  match l with
  | [] => False
  | x :: rest =>
      P.I x ∧
      P.A (getLastState x rest)
```

- [ ] **Step 4: Run build to verify clean compilation**

Run: `cd takt-formal && lake build`
Expected: Build succeeds with NO warnings or errors.

- [ ] **Step 5: Commit**

Run:
```bash
git add takt-formal/TaktFormal/Landscape/SearchProblem.lean takt-formal/TaktFormal.lean
git commit -m "proof(Dynamics): formalize SearchProblem, Reachable, DeadEnd and LocalTrap"
```
