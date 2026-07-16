# Phase E — Adversarial Governance Validation (Red Team v3.0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Lean 4 formalization and Vitest TypeScript simulations for the four Red Team attacks (RT-001, RT-002, RT-003, RT-004) under the Phase E spec, validating and classifying the boundaries of the Dynamic Safety Contract.

**Architecture:** We construct Lean 4 files demonstrating counterexamples and proofs of boundary conditions, and TypeScript test suites verifying that the contract's monitored state transitions can be bypassed or produce decision loss ($L > 0$) while reporting compliance.

**Tech Stack:** Lean 4, TypeScript, Vitest, Node.js.

## Global Constraints

- The adversary must act strictly within the specified capabilities of the Threat Model.
- The adversary cannot modify the mathematical definition of $\mathcal{C}$ or the core axioms of TAKT.
- Red Team Success Condition: $\text{AttackSuccess}(\mathcal{A}) \iff L > 0 \land \text{contract\_satisfied}(\mathcal{C}) = \text{True}$.
- All tests must run with `npx vitest run` (TypeScript) and Lean proofs must build via `lake build` inside `takt-formal`.

---

## File Structure Map

```
takt-theory/
├── docs/superpowers/plans/2026-07-16-phase-e-adversarial-validation-plan.md
├── takt-formal/
│   ├── TaktFormal.lean
│   └── TaktFormal/
│       ├── RT001.lean  (New: RT-001 coverage counterexample)
│       ├── RT002.lean  (New: RT-002 transition margin counterexample)
│       ├── RT003.lean  (New: RT-003 cascade inversion theorem)
│       └── RT004.lean  (New: RT-004 infinite domain evasion)
└── cli/src/
    └── red-team/
        ├── rt001.test.ts  (New: RT-001 OOD data drift simulation)
        ├── rt002.test.ts  (New: RT-002 transition constraint simulation)
        ├── rt003.test.ts  (New: RT-003 latent shift simulation)
        └── rt004.test.ts  (New: RT-004 optimization evasion loop)
```

---

### Task 1: RT-001 — False Coverage Attack (Observabilidad)

**Files:**
- Create: `takt-formal/TaktFormal/RT001.lean`
- Create: `cli/src/red-team/rt001.test.ts`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: `DynamicSafetyContract.SafetyContract` and `DynamicSafetyContract.contract_satisfied` from `TaktFormal/DynamicSafetyContract.lean`.
- Produces: `TaktFormal.RT001` containing `theorem rt001_success` proving that coverage on audited space does not guarantee global safety on real space.

- [ ] **Step 1: Write the Lean 4 formalization**
  Create `takt-formal/TaktFormal/RT001.lean` and define the audited vs real space counterexample:
  ```lean
  import TaktFormal.DynamicSafetyContract

  open DynamicSafetyContract

  namespace RT001

  inductive SAudit : Type where
    | a1 : SAudit
    | a2 : SAudit
    | a3 : SAudit
    deriving DecidableEq

  inductive SReal : Type where
    | r1 : SReal
    | r2 : SReal
    | r3 : SReal
    | r_ood : SReal
    deriving DecidableEq

  def inject : SAudit → SReal
    | SAudit.a1 => SReal.r1
    | SAudit.a2 => SReal.r2
    | SAudit.a3 => SReal.r3

  def D_real : SReal → Nat
    | SReal.r1 => 0
    | SReal.r2 => 0
    | SReal.r3 => 1
    | SReal.r_ood => 1

  def R_real : SReal → Int
    | SReal.r1 => -1
    | SReal.r2 => -1
    | SReal.r3 => 0
    | SReal.r_ood => -1  -- Collision with r1 / r2 but decision is 1!

  def D_audit (x : SAudit) : Nat := D_real (inject x)
  def R_audit (x : SAudit) : Int := R_real (inject x)

  def T_audit : SAudit → Prop
    | SAudit.a1 => False
    | SAudit.a2 => True
    | SAudit.a3 => True

  def dist_audit (x y : SAudit) : Nat := 0
  def all_S_audit : List SAudit := [SAudit.a1, SAudit.a2, SAudit.a3]

  def π : Int → Nat
    | -1 => 0
    | 0 => 1
    | _ => 0

  def c_audit : SafetyContract SAudit Int Nat := {
    R := R_audit
    D := D_audit
    π := π
    T := T_audit
    all_S := all_S_audit
    dist := dist_audit
    m_min := 1
  }

  -- Target theorem proving RT-001: contract satisfied on audit but unsafe globally
  theorem rt001_success : 
    contract_satisfied c_audit ∧ 
    ¬ (∀ (x y : SReal), R_real x = R_real y → D_real x = D_real y) := by
    refine ⟨?_, ?_⟩
    · dsimp [contract_satisfied, c_audit, T_audit, safe_on_T, fiber_coverage, decisionMargin, has_unsafe_pair]
      refine ⟨?_, ⟨?_, ⟨?_, ⟨?_, ?_⟩⟩⟩⟩
      · intro x y hx hy hk
        cases x <;> cases y <;> first | rfl | contradiction
      · intro x
        cases x
        · exact ⟨SAudit.a2, True.intro, rfl, rfl⟩
        · exact ⟨SAudit.a2, True.intro, rfl, rfl⟩
        · exact ⟨SAudit.a3, True.intro, rfl, rfl⟩
      · decide
      · decide
      · intro x hx
        cases x <;> first | rfl | contradiction
    · intro h_safe
      have h_col : R_real SReal.r1 = R_real SReal.r_ood := rfl
      have h_dec := h_safe SReal.r1 SReal.r_ood h_col
      contradiction

  end RT001
  ```

- [ ] **Step 2: Export module in Lean core**
  Append `import TaktFormal.RT001` to `takt-formal/TaktFormal.lean`.
  Run verification:
  ```bash
  cd takt-formal && lake build
  ```
  Expected: Successful compilation without errors or warnings.

- [ ] **Step 3: Write the failing Vitest TypeScript test**
  Create `cli/src/red-team/rt001.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';

  // Audit setup representing OOD drift
  interface State {
    id: string;
    rep: number;
    decision: number;
  }

  const S_audit: State[] = [
    { id: 'a1', rep: -1, decision: 0 },
    { id: 'a2', rep: -1, decision: 0 },
    { id: 'a3', rep: 0, decision: 1 },
  ];

  const S_real: State[] = [
    ...S_audit,
    { id: 'r_ood', rep: -1, decision: 1 }, // OOD Collision: rep = -1, but decision = 1
  ];

  const T = ['a2', 'a3'];
  const pi = (rep: number) => rep <= -1 ? 0 : 1;

  function evaluateContract(states: State[], testIds: string[], policy: (r: number) => number) {
    // 1. Empirical safety on T
    const testStates = states.filter(s => testIds.includes(s.id));
    for (const x of testStates) {
      for (const y of testStates) {
        if (x.rep === y.rep && x.decision !== y.decision) {
          return false;
        }
      }
    }
    // 2. Fiber Coverage
    for (const x of states) {
      const covered = testStates.some(t => t.rep === x.rep && t.decision === x.decision);
      if (!covered) return false;
    }
    // 3. Policy alignment on T
    for (const x of testStates) {
      if (policy(x.rep) !== x.decision) return false;
    }
    return true;
  }

  describe('RT-001 False Coverage Attack', () => {
    it('succeeds in bypassing contract satisfied state to cause real decision loss', () => {
      // Contract evaluated on audited space S_audit
      const auditSatisfied = evaluateContract(S_audit, T, pi);
      expect(auditSatisfied).toBe(true);

      // Real execution Loss on S_real
      const loss = S_real.filter(s => pi(s.rep) !== s.decision).length / S_real.length;
      expect(loss).toBeGreaterThan(0); // Success condition: Loss > 0 while Contract = True
      console.log(`[RT-001 Results] Contract satisfied: ${auditSatisfied}, Real Loss: ${loss.toFixed(2)}`);
    });
  });
  ```

- [ ] **Step 4: Run test to verify success**
  Run: `npx vitest run cli/src/red-team/rt001.test.ts`
  Expected: Test passes and console prints loss.

- [ ] **Step 5: Commit**
  ```bash
  git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/RT001.lean cli/src/red-team/rt001.test.ts
  git commit -m "feat(red-team): implement RT-001 false coverage attack"
  ```

---

### Task 2: RT-002 — Structural Margin Attack (Modelo Estructural)

**Files:**
- Create: `takt-formal/TaktFormal/RT002.lean`
- Create: `cli/src/red-team/rt002.test.ts`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: Static margin concepts.
- Produces: `TaktFormal.RT002` proving the existence of transition paths crossing classes in 1 step despite arbitrary static margins.

- [ ] **Step 1: Write the Lean 4 formalization**
  Create `takt-formal/TaktFormal/RT002.lean`:
  ```lean
  import TaktFormal.DynamicSafetyContract

  namespace RT002

  -- State Space: S = {0, 1, 2}
  inductive S : Type where
    | s0 : S
    | s1 : S
    | s2 : S
    deriving DecidableEq

  -- Decisions
  def D : S → Nat
    | S.s0 => 0
    | S.s1 => 0
    | S.s2 => 1

  -- Representation
  def R : S → Int
    | S.s0 => -1
    | S.s1 => -1
    | S.s2 => 0

  -- Metric d: s0 and s2 are far, but Transition graph allows s0 -> s2 directly
  def d : S → S → Nat
    | S.s0, S.s0 => 0
    | S.s0, S.s1 => 1
    | S.s0, S.s2 => 5  -- High static distance
    | S.s1, S.s0 => 1
    | S.s1, S.s1 => 0
    | S.s1, S.s2 => 4
    | S.s2, S.s0 => 5
    | S.s2, S.s1 => 4
    | S.s2, S.s2 => 0

  -- Dynamic Transition (step allowed)
  def step_allowed : S → S → Prop
    | S.s0, S.s2 => True  -- Transition directly crosses decision boundary in 1 step!
    | _, _ => False

  theorem rt002_success : 
    d S.s0 S.s2 = 5 ∧ 
    D S.s0 ≠ D S.s2 ∧ 
    step_allowed S.s0 S.s2 := by
    refine ⟨rfl, ⟨decide, rfl⟩⟩

  end RT002
  ```

- [ ] **Step 2: Export module and rebuild Lean**
  Append `import TaktFormal.RT002` to `takt-formal/TaktFormal.lean`.
  Rebuild:
  ```bash
  cd takt-formal && lake build
  ```
  Expected: No errors.

- [ ] **Step 3: Write the Vitest TypeScript test**
  Create `cli/src/red-team/rt002.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';

  // State space with high metric distance but direct transition constraint (rail)
  interface State2D {
    id: string;
    x: number;
    y: number;
    decision: number;
  }

  const states: State2D[] = [
    { id: 's0', x: 0, y: 0, decision: 0 },
    { id: 's1', x: 10, y: 0, decision: 1 },
  ];

  // Euclidean metric
  const d = (sA: State2D, sB: State2D) => Math.sqrt((sA.x - sB.x) ** 2 + (sA.y - sB.y) ** 2);

  // Transition constraint: A mechanical guide allows a transition path of high speed
  const allowedTransition = (from: string, to: string) => from === 's0' && to === 's1';

  describe('RT-002 Structural Margin Attack', () => {
    it('demonstrates high static margin with immediate dynamic decision violation', () => {
      const margin = d(states[0], states[1]);
      expect(margin).toBe(10); // Static margin is 10 >= minimum margin of 5

      // Transition occurs
      const transitionFails = allowedTransition('s0', 's1') && states[0].decision !== states[1].decision;
      expect(transitionFails).toBe(true);

      console.log(`[RT-002 Results] Static Margin: ${margin}, Immediate transition failure possible: ${transitionFails}`);
    });
  });
  ```

- [ ] **Step 4: Run verification**
  Run: `npx vitest run cli/src/red-team/rt002.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/RT002.lean cli/src/red-team/rt002.test.ts
  git commit -m "feat(red-team): implement RT-002 structural margin attack"
  ```

---

### Task 3: RT-003 — Causal Cascade Inversion (Causalidad)

**Files:**
- Create: `takt-formal/TaktFormal/RT003.lean`
- Create: `cli/src/red-team/rt003.test.ts`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: Contract variables (Coverage, Margin, Alignment).
- Produces: `TaktFormal.RT003` showing that alignment can drop to violated without coverage or margin dropping.

- [ ] **Step 1: Write the Lean 4 formalization**
  Create `takt-formal/TaktFormal/RT003.lean`:
  ```lean
  namespace RT003

  -- State variables representing contract health at time t
  structure ContractState where
    coverage_satisfied : Bool
    margin_satisfied : Bool
    alignment_optimal : Bool

  -- Initial state: everything is normal
  def t0 : ContractState := {
    coverage_satisfied := true,
    margin_satisfied := true,
    alignment_optimal := true
  }

  -- Inversion state: alignment collapses due to exogenous shift, but coverage/margin remain intact
  def t_collapse : ContractState := {
    coverage_satisfied := true,
    margin_satisfied := true,
    alignment_optimal := false
  }

  theorem rt003_cascade_inversion :
    t0.alignment_optimal = true ∧
    t_collapse.alignment_optimal = false ∧
    t_collapse.coverage_satisfied = true ∧
    t_collapse.margin_satisfied = true := by
    refine ⟨rfl, ⟨rfl, ⟨rfl, rfl⟩⟩⟩

  end RT003
  ```

- [ ] **Step 2: Export module and rebuild Lean**
  Append `import TaktFormal.RT003` to `takt-formal/TaktFormal.lean`.
  Rebuild:
  ```bash
  cd takt-formal && lake build
  ```
  Expected: No errors.

- [ ] **Step 3: Write the Vitest TypeScript test**
  Create `cli/src/red-team/rt003.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';

  // Multi-agent system: sub-agent change breaks global alignment exogenously
  interface AgentState {
    id: string;
    representationMargin: number;
    coverageSatisfied: boolean;
    localPolicyAligned: boolean;
  }

  describe('RT-003 Causal Cascade Inversion', () => {
    it('demonstrates alignment violation without prior coverage/margin degradation', () => {
      // Time t0: normal operation
      let system: AgentState = {
        id: 'node_1',
        representationMargin: 8,
        coverageSatisfied: true,
        localPolicyAligned: true,
      };

      // Exogenous shift on dependent node alters optimal decision space
      // Time t1: localPolicyAligned drops directly due to logic mismatch
      system.localPolicyAligned = false;

      // Assert that first variable showing violation is alignment, while others are stable
      expect(system.localPolicyAligned).toBe(false);
      expect(system.coverageSatisfied).toBe(true);
      expect(system.representationMargin).toBeGreaterThanOrEqual(5); // Still above minimum threshold

      console.log(`[RT-003 Results] Cascade Inverted. Alignment: Violated, Coverage: Satisfied, Margin: ${system.representationMargin}`);
    });
  });
  ```

- [ ] **Step 4: Run verification**
  Run: `npx vitest run cli/src/red-team/rt003.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/RT003.lean cli/src/red-team/rt003.test.ts
  git commit -m "feat(red-team): implement RT-003 cascade inversion"
  ```

---

### Task 4: RT-004 — Adaptive Adversary (Gobernanza)

**Files:**
- Create: `takt-formal/TaktFormal/RT004.lean`
- Create: `cli/src/red-team/rt004.test.ts`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Consumes: Full contract validation rules.
- Produces: `TaktFormal.RT004` and TypeScript test showing a sequence of inputs evading contract alert while generating positive loss.

- [ ] **Step 1: Write the Lean 4 formalization**
  Create `takt-formal/TaktFormal/RT004.lean`:
  ```lean
  namespace RT004

  -- Mathematical representation of the game space
  -- S is infinite (Nat), representation Z is finite (Bool)
  def S : Type := Nat
  def Z : Type := Bool
  def A : Type := Bool

  def R (x : S) : Z := (x % 2 == 0)

  -- Ideal decisions: state x is odd/even but with an exception state
  def D (x : S) : A
    | 0 => false
    | 1 => true
    | 2 => false
    | 3 => true
    | 4 => true  -- Exception state! Even but decision is true
    | _ => true

  -- The adversary plays on exception states that satisfy the general even/odd representation
  -- but deviate from standard decision classes, bypassing contract.
  theorem exists_evasion_state : ∃ (x : S), R x = R 0 ∧ D x ≠ D 0 := by
    use 4
    refine ⟨rfl, decide⟩

  end RT004
  ```

- [ ] **Step 2: Export module and rebuild Lean**
  Append `import TaktFormal.RT004` to `takt-formal/TaktFormal.lean`.
  Rebuild:
  ```bash
  cd takt-formal && lake build
  ```
  Expected: Rebuild successful.

- [ ] **Step 3: Write the Vitest TypeScript test**
  Create `cli/src/red-team/rt004.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';

  // System states and decisions
  function D(x: number) {
    if (x === 4) return 1; // Exception state
    return x % 2 === 0 ? 0 : 1;
  }

  function R(x: number) {
    return x % 2 === 0 ? 0 : 1;
  }

  const pi = (rep: number) => rep; // Policy copies representation

  // Test set does not contain exception state 4
  const T = [0, 1, 2, 3];

  function evaluateContract(testSet: number[]) {
    // Check safety on test set
    for (const x of testSet) {
      for (const y of testSet) {
        if (R(x) === R(y) && D(x) !== D(y)) {
          return false;
        }
      }
    }
    return true;
  }

  describe('RT-004 Adaptive Adversary', () => {
    it('optimizes inputs to maximize loss while keeping contract satisfied', () => {
      // Adversary chooses input trajectory. State 4 yields Loss > 0 but evades test-based contract
      const inputTrajectory = [0, 1, 4, 3];
      
      const contractSatisfied = evaluateContract(T);
      expect(contractSatisfied).toBe(true); // Contract remains satisfied based on T

      // Calculate total loss over the trajectory
      let lossCount = 0;
      for (const x of inputTrajectory) {
        if (pi(R(x)) !== D(x)) {
          lossCount++;
        }
      }

      const totalLoss = lossCount / inputTrajectory.length;
      expect(totalLoss).toBeGreaterThan(0); // Success: Loss > 0 under satisfaction
      
      console.log(`[RT-004 Results] Evasion succeeded. Contract: Satisfied, Trajectory Loss: ${totalLoss.toFixed(2)}`);
    });
  });
  ```

- [ ] **Step 4: Run verification**
  Run: `npx vitest run cli/src/red-team/rt004.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/RT004.lean cli/src/red-team/rt004.test.ts
  git commit -m "feat(red-team): implement RT-004 adaptive adversary"
  ```
