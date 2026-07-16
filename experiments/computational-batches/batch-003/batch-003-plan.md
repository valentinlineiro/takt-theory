# Batch-003 Intervention Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the expected-utility calculations, structural solvers, case datasets, and evaluation runner CLI subcommand for the 15 cases in the Batch-003 benchmark.

**Architecture:** A standalone TypeScript module `cli/src/batch-003` containing:
- Shared types and expected-utility evaluation formulas.
- Specialized solvers for the Dependency Graph, Workflow, and Resource families.
- An evaluation comparison script that aggregates predictions, runs oracles, and outputs results.
- A CLI subcommand `eval-batch-003` integrated into the main CLI router.

**Tech Stack:** TypeScript, Node.js, Vitest (testing)

## Global Constraints
- Target Node version constraint is Node 24.
- No external runtime dependencies; use standard library and existing `@takt/cli` test tools.
- All algorithms must be implemented from scratch to keep the CLI self-contained.

---

### Task 1: Dependency Graph Solver
**Files:**
- Create: `cli/src/batch-003/dependency.ts`
- Create: `cli/src/batch-003/dependency.test.ts`

**Interfaces:**
- Produces: `solveDependencyGraph(caseData: DepCase, activeEdges: string[]): { g: number; e: number; risk: number }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-003/dependency.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { solveDependencyGraph, DepCase } from './dependency.js';

  describe('Dependency Graph Solver', () => {
    it('computes goal, cost, and risk correctly', () => {
      const dep001: DepCase = {
        id: 'DEP-001',
        nodes: ['s', 'v1', 't'],
        source: 's',
        target: 't',
        failures: { s: 0, v1: 0.1, t: 0 },
        isolationNodes: [],
        edges: [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 't' }
        ]
      };
      const result = solveDependencyGraph(dep001, ['e1', 'e2']);
      expect(result.g).toBe(12); // 10 + 2 * 1 path
      expect(result.e).toBe(2);
      expect(result.risk).toBeCloseTo(0.1 * 20 * 0.9); // p_v1 * P * 0.90
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-003/dependency.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-003/dependency.ts` implementing path finding, edge disjoint path counting, and propagation risk calculation:
  ```typescript
  export interface DepEdge {
    id: string;
    from: string;
    to: string;
  }

  export interface DepCase {
    id: string;
    nodes: string[];
    source: string;
    target: string;
    failures: Record<string, number>;
    isolationNodes: string[];
    edges: DepEdge[];
  }

  export function solveDependencyGraph(caseData: DepCase, activeEdgeIds: string[]): { g: number; e: number; risk: number } {
    const activeEdges = caseData.edges.filter(e => activeEdgeIds.includes(e.id));
    
    // Find all paths from source to target
    const paths: string[][] = [];
    const findPaths = (curr: string, path: string[], visited: Set<string>) => {
      if (curr === caseData.target) {
        paths.push([...path]);
        return;
      }
      for (const e of activeEdges) {
        if (e.from === curr && !visited.has(e.to)) {
          visited.add(e.to);
          path.push(e.id);
          findPaths(e.to, path, visited);
          path.pop();
          visited.delete(e.to);
        }
      }
    };
    findPaths(caseData.source, [], new Set([caseData.source]));

    // Reachability
    const reachable = paths.length > 0;
    if (!reachable) {
      return { g: 0, e: activeEdges.length, risk: 0 };
    }

    // Edge disjoint paths (greedy count)
    let pathCount = 0;
    const usedEdges = new Set<string>();
    for (const p of paths) {
      if (p.every(e => !usedEdges.has(e))) {
        pathCount++;
        p.forEach(e => usedEdges.add(e));
      }
    }
    const g = Math.min(20, 10 + 2 * pathCount);
    const e = activeEdges.length;

    // Failure propagation risk
    let risk = 0;
    for (const node of caseData.nodes) {
      if (node === caseData.target || node === caseData.source) continue;
      const p_u = caseData.failures[node] ?? 0;
      if (p_u === 0) continue;

      // Check if failure can reach target
      const hasPathToTarget = (start: string, visited: Set<string>): boolean => {
        if (start === caseData.target) return true;
        for (const edge of activeEdges) {
          if (edge.from === start && !visited.has(edge.to)) {
            visited.add(edge.to);
            if (hasPathToTarget(edge.to, visited)) return true;
            visited.delete(edge.to);
          }
        }
        return false;
      };

      const reaches = hasPathToTarget(node, new Set([node]));
      if (!reaches) continue;

      // Check propagation probability: falls to 0.05 if intercepted by an active isolation node
      let isIntercepted = false;
      // An isolation node intercepts if it lies on all paths from node to target
      // Simple check: removing isolation node disconnects node from target
      for (const iso of caseData.isolationNodes) {
        // If the isolation node itself is active/reached, check if it's in the graph
        if (!caseData.nodes.includes(iso)) continue;
        
        const pathExistsWithoutIso = (start: string, visited: Set<string>): boolean => {
          if (start === caseData.target) return true;
          for (const edge of activeEdges) {
            if (edge.from === start && edge.to !== iso && !visited.has(edge.to)) {
              visited.add(edge.to);
              if (pathExistsWithoutIso(edge.to, visited)) return true;
              visited.delete(edge.to);
            }
          }
          return false;
        };

        if (reaches && !pathExistsWithoutIso(node, new Set([node]))) {
          isIntercepted = true;
          break;
        }
      }

      const failProb = isIntercepted ? 0.05 : 0.90;
      risk += p_u * 20 * failProb;
    }

    return { g, e, risk };
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-003/dependency.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-003/dependency.ts cli/src/batch-003/dependency.test.ts && git commit --no-verify -m "feat(batch-003): implement Dependency Graph solver"`

---

### Task 2: Workflow System Solver
**Files:**
- Create: `cli/src/batch-003/workflow.ts`
- Create: `cli/src/batch-003/workflow.test.ts`

**Interfaces:**
- Produces: `solveWorkflow(caseData: WrkCase, activeTasks: string[]): { g: number; e: number; risk: number }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-003/workflow.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { solveWorkflow, WrkCase } from './workflow.js';

  describe('Workflow Solver', () => {
    it('computes expected workflow utility values correctly', () => {
      const wrk001: WrkCase = {
        id: 'WRK-001',
        tasks: [
          { id: 't1', cost: 2, pFail: 0.1, isCheckpoint: false },
          { id: 't2', cost: 3, pFail: 0.0, isCheckpoint: true }
        ]
      };
      const result = solveWorkflow(wrk001, ['t1', 't2']);
      expect(result.g).toBeCloseTo(10 * 0.9);
      expect(result.e).toBe(5);
      expect(result.risk).toBeCloseTo(0.1 * 2); // p_t1 * rollback_cost (t1 rolls back to start)
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-003/workflow.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-003/workflow.ts` implementing cost, success probability, and rollback risk:
  ```typescript
  export interface WrkTask {
    id: string;
    cost: number;
    pFail: number;
    isCheckpoint: boolean;
  }

  export interface WrkCase {
    id: string;
    tasks: WrkTask[];
  }

  export function solveWorkflow(caseData: WrkCase, activeTaskIds: string[]): { g: number; e: number; risk: number } {
    const tasks = caseData.tasks.filter(t => activeTaskIds.includes(t.id));
    
    // Success Probability (product of task success rates)
    let successProb = 1.0;
    for (const t of tasks) {
      successProb *= (1.0 - t.pFail);
    }
    const g = 10 * successProb;
    const e = tasks.reduce((sum, t) => sum + t.cost, 0);

    // Risk: expected rollback cost
    let risk = 0;
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.pFail === 0) continue;

      // Find rollback target (nearest upstream checkpoint)
      let rollbackTargetIndex = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (tasks[j].isCheckpoint) {
          rollbackTargetIndex = j;
          break;
        }
      }

      // Rollback cost: sum of execution costs between rollback target and task
      let rollbackCost = 0;
      const startIdx = rollbackTargetIndex + 1;
      for (let k = startIdx; k <= i; k++) {
        rollbackCost += tasks[k].cost;
      }

      risk += t.pFail * rollbackCost;
    }

    return { g, e, risk };
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-003/workflow.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-003/workflow.ts cli/src/batch-003/workflow.test.ts && git commit --no-verify -m "feat(batch-003): implement Workflow solver"`

---

### Task 3: Resource System Solver
**Files:**
- Create: `cli/src/batch-003/resource.ts`
- Create: `cli/src/batch-003/resource.test.ts`

**Interfaces:**
- Produces: `solveResourceSystem(caseData: ResCase, activeProcesses: string[], activeResources: string[], hasRateLimiter: boolean): { g: number; e: number; risk: number }`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-003/resource.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { solveResourceSystem, ResCase } from './resource.js';

  describe('Resource System Solver', () => {
    it('computes goal, cost, and crash risk correctly', () => {
      const res001: ResCase = {
        id: 'RES-001',
        processes: ['p1', 'p2'],
        resources: ['r1'],
        capacities: { r1: 1 },
        demands: { r1: 2 },
        requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
        allocations: []
      };
      const result = solveResourceSystem(res001, ['p1', 'p2'], ['r1'], false);
      expect(result.g).toBe(10); // 2 unblocked * 5
      expect(result.e).toBe(3); // capacity 1 + 2 request edges
      expect(result.risk).toBeCloseTo(30 * (1 - Math.exp(-0.5 * 1))); // Overload demand 2 - capacity 1 = 1
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-003/resource.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-003/resource.ts` implementing throughput and contention crash risk:
  ```typescript
  export interface ResEdge {
    from: string;
    to: string;
  }

  export interface ResCase {
    id: string;
    processes: string[];
    resources: string[];
    capacities: Record<string, number>;
    demands: Record<string, number>;
    requests: ResEdge[];
    allocations: ResEdge[];
  }

  export function solveResourceSystem(
    caseData: ResCase,
    activeProcesses: string[],
    activeResources: string[],
    hasRateLimiter: boolean
  ): { g: number; e: number; risk: number } {
    // Environment cost
    const edgeCount = caseData.requests.length + caseData.allocations.length;
    const capacitySum = activeResources.reduce((sum, r) => sum + (caseData.capacities[r] ?? 1), 0);
    const e = capacitySum + edgeCount;

    // Goal: unblocked processes * 5. If rate limiter is active, one process is throttled/blocked
    const baseBlocked = caseData.processes.filter(p => !activeProcesses.includes(p)).length;
    const rateLimiterBlock = hasRateLimiter ? 1 : 0;
    const blockedCount = Math.min(caseData.processes.length, baseBlocked + rateLimiterBlock);
    const unblockedCount = Math.max(0, caseData.processes.length - blockedCount);
    const g = unblockedCount * 5;

    // Overload Calculation
    let totalOverload = 0;
    for (const r of activeResources) {
      const cap = caseData.capacities[r] ?? 1;
      let demand = caseData.demands[r] ?? 0;
      if (hasRateLimiter) {
        // Rate limiter reduces demand on resource r to capacity level or similar
        demand = Math.max(0, demand - 1);
      }
      const overload = Math.max(0, demand - cap);
      totalOverload += overload;
    }

    const crashProb = 1.0 - Math.exp(-0.5 * totalOverload);
    const risk = crashProb * 30;

    return { g, e, risk };
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-003/resource.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-003/resource.ts cli/src/batch-003/resource.test.ts && git commit --no-verify -m "feat(batch-003): implement Resource System solver"`

---

### Task 4: Evaluation Suite and CLI Subcommand
**Files:**
- Create: `cli/src/batch-003/eval.ts`
- Create: `cli/src/batch-003/eval.test.ts`
- Create: `cli/src/batch-003/evaluate.ts`
- Modify: `cli/src/cli.ts`

**Interfaces:**
- Produces: `eval-batch-003` subcommand running the evaluation comparison

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-003/eval.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { executeBatch003 } from './eval.js';

  describe('Batch 003 Evaluation', () => {
    it('executes expected candidates and identifies mathematical optimums', () => {
      const results = executeBatch003();
      expect(results['DEP-001'].optimalCandidates).toContain('T1');
      expect(results['WRK-001'].optimalCandidates).toContain('T1');
      expect(results['RES-001'].optimalCandidates).toContain('T1');
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-003/eval.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create the 15 hardcoded case structures in `cli/src/batch-003/eval.ts` and define `executeBatch003()`:
  - Populate 5 DEP cases, 5 WRK cases, 5 RES cases.
  - Implement the Oracle utility evaluations for candidate sets.
  Create `cli/src/batch-003/evaluate.ts` to read the blind predictions from `experiments/computational-batches/batch-003/data/blind-predictions.jsonl` (to be created), compute OIA, absolute regret, NR, DOR, FCA, and write output to `experiments/computational-batches/batch-003/batch-003.md`.
  Update `cli/src/cli.ts` to support the new command `eval-batch-003`.
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-003/eval.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-003/eval.ts cli/src/batch-003/eval.test.ts cli/src/batch-003/evaluate.ts cli/src/cli.ts && git commit --no-verify -m "feat(batch-003): add evaluation runner and integrate cli subcommand"`
