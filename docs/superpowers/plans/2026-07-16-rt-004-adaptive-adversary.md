# RT-004 Adaptive Adversary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the RT-004 Adaptive Adversary formalization in Lean 4 and corresponding TypeScript tests in Vitest.

**Architecture:** 
- Lean 4 formalization defines a state space `S`, representation space `Z`, and decision space `A`. It models standard/ideal decisions `D` with an exception state (state `4`) which satisfies the contract but deviates from standard decision class. We prove that there exists an evasion state.
- TypeScript test evaluates a contract on a test set (not containing the exception state) to ensure it is satisfied. An input trajectory including the exception state is processed, showing that policy decisions diverge from standard decisions on the exception state, resulting in a loss count greater than zero while the contract remains satisfied.

**Tech Stack:** Lean 4, TypeScript, Vitest.

## Global Constraints

- Run `lake build` in `takt-formal` directory.
- Run `npx vitest run cli/src/red-team/rt004.test.ts` to verify TypeScript tests.
- Always use TDD: create failing tests/files before making them pass.

---

### Task 1: Scaffolding and Failing TypeScript Test

**Files:**
- Create: `cli/src/red-team/rt004.test.ts`

**Interfaces:**
- Produces: A failing Vitest test suite.

- [ ] **Step 1: Create a test file with a failing assertion**

Write the following content to `cli/src/red-team/rt004.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('RT-004 Adaptive Adversary', () => {
  it('fails initially for TDD verification', () => {
    expect(true).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run cli/src/red-team/rt004.test.ts`
Expected: Test fails with assertion error.

---

### Task 2: Implement Complete TypeScript Test

**Files:**
- Modify: `cli/src/red-team/rt004.test.ts`

**Interfaces:**
- Consumes: Test structure from Task 1.
- Produces: Passing Vitest test suite that models the contract, policy, representation, and adversary trajectory.

- [ ] **Step 1: Write minimal implementation of TypeScript test**

Replace content of `cli/src/red-team/rt004.test.ts` with:
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

- [ ] **Step 2: Run the test to verify it passes**

Run: `npx vitest run cli/src/red-team/rt004.test.ts`
Expected: Test passes successfully.

- [ ] **Step 3: Commit TypeScript work**

Run:
```bash
git add cli/src/red-team/rt004.test.ts
git commit -m "test(red-team): implement RT-004 TypeScript test"
```

---

### Task 3: Implement Lean 4 Formalization

**Files:**
- Create: `takt-formal/TaktFormal/RT004.lean`
- Modify: `takt-formal/TaktFormal.lean`

**Interfaces:**
- Produces: `TaktFormal.RT004` module verified by Lake build.

- [ ] **Step 1: Create Lean module**

Create `takt-formal/TaktFormal/RT004.lean` with:
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

- [ ] **Step 2: Modify Lean root module imports**

Modify `takt-formal/TaktFormal.lean` by adding:
```lean
import TaktFormal.RT004
```

- [ ] **Step 3: Rebuild Lean package**

Run: `cd takt-formal && lake build`
Expected: Build finishes with no errors.

- [ ] **Step 4: Commit Lean work**

Run:
```bash
git add takt-formal/TaktFormal.lean takt-formal/TaktFormal/RT004.lean
git commit -m "feat(formal): add RT-004 Lean 4 formalization"
```
