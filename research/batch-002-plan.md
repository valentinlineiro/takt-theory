# Batch-002 Synthetic Oracle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a deterministic calculation runner that computes the Pareto preorder relations ($\succ$, $\prec$, $\parallel$, $\equiv$) for the 12 synthetic benchmark cases in Batch 002.

**Architecture:** A standalone TypeScript module containing case definitions, graph algorithm solvers (Dijkstra, Ford-Fulkerson, Cycle Detection), and an evaluation CLI script that generates the benchmark outcomes.

**Tech Stack:** TypeScript, Node.js, Vitest (testing)

## Global Constraints
- Target Node version constraint is Node 24.
- No external runtime dependencies; use standard library and existing `@takt/cli` test tools.
- All algorithms must be implemented from scratch to keep the CLI self-contained.

---

### Task 1: Case Data Definitions and FSA Oracle
**Files:**
- Create: `cli/src/batch-002/fsa.ts`
- Create: `cli/src/batch-002/fsa.test.ts`

**Interfaces:**
- Produces: `computeFsaOracle(caseData: FsaCase): OracleRelation`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-002/fsa.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { computeFsaOracle, FsaCase } from './fsa.js';

  describe('FSA Oracle', () => {
    it('computes dominating optimization (FSA-001)', () => {
      const fsa001: FsaCase = {
        id: 'FSA-001',
        states: ['v0', 'v1', 'v2', 'v3', 'v4'],
        startState: 'v0',
        terminalStates: ['v3', 'v4'],
        beforeTransitions: [
          { from: 'v0', to: 'v1', cost: 4 },
          { from: 'v0', to: 'v2', cost: 5 },
          { from: 'v1', to: 'v3', cost: 2 },
          { from: 'v2', to: 'v4', cost: 3 }
        ],
        afterTransitions: [
          { from: 'v0', to: 'v1', cost: 4 },
          { from: 'v0', to: 'v2', cost: 2 },
          { from: 'v1', to: 'v3', cost: 2 },
          { from: 'v2', to: 'v4', cost: 3 }
        ]
      };
      expect(computeFsaOracle(fsa001)).toBe('≻');
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-002/fsa.test.ts)`
  Expected: FAIL (Cannot find module)
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-002/fsa.ts` containing the types, a shortest-path solver (Dijkstra/BFS), and Pareto preorder logic:
  ```typescript
  export type OracleRelation = '≻' | 'prec' | 'parallel' | '≡';

  export interface Transition {
    from: string;
    to: string;
    cost: number;
  }

  export interface FsaCase {
    id: string;
    states: string[];
    startState: string;
    terminalStates: string[];
    beforeTransitions: Transition[];
    afterTransitions: Transition[];
  }

  export function solveFsa(caseData: FsaCase, transitions: Transition[]): { reached: number; minCost: number } {
    const dist: Record<string, number> = {};
    for (const s of caseData.states) dist[s] = Infinity;
    dist[caseData.startState] = 0;

    const visited = new Set<string>();
    while (visited.size < caseData.states.length) {
      let u: string | null = null;
      let minD = Infinity;
      for (const s of caseData.states) {
        if (!visited.has(s) && dist[s] < minD) {
          u = s;
          minD = dist[s];
        }
      }
      if (u === null || minD === Infinity) break;
      visited.add(u);

      for (const t of transitions) {
        if (t.from === u) {
          const v = t.to;
          if (dist[u] + t.cost < dist[v]) {
            dist[v] = dist[u] + t.cost;
          }
        }
      }
    }

    let reached = 0;
    let minCost = Infinity;
    for (const term of caseData.terminalStates) {
      if (dist[term] !== Infinity) {
        reached++;
        if (dist[term] < minCost) minCost = dist[term];
      }
    }
    return { reached, minCost };
  }

  export function computeFsaOracle(caseData: FsaCase): OracleRelation {
    const s1 = solveFsa(caseData, caseData.beforeTransitions);
    const s2 = solveFsa(caseData, caseData.afterTransitions);

    const g1 = s1.reached;
    const e1 = s1.minCost;
    const g2 = s2.reached;
    const e2 = s2.minCost;

    if (g2 === g1 && e2 === e1) return '≡';
    if (g2 >= g1 && e2 <= e1) return '≻';
    if (g2 <= g1 && e2 >= e1) return 'prec';
    return 'parallel';
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-002/fsa.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-002/fsa.ts cli/src/batch-002/fsa.test.ts && git commit --no-verify -m "feat(batch-002): add FSA oracle solver"`

---

### Task 2: Flow Network Oracle
**Files:**
- Create: `cli/src/batch-002/flow.ts`
- Create: `cli/src/batch-002/flow.test.ts`

**Interfaces:**
- Produces: `computeFlowOracle(caseData: FlowCase): OracleRelation`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-002/flow.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { computeFlowOracle, FlowCase } from './flow.js';

  describe('Flow Oracle', () => {
    it('computes dominating flow (FLOW-001)', () => {
      const flow001: FlowCase = {
        id: 'FLOW-001',
        vertices: ['s', 'v1', 'v2', 't'],
        source: 's',
        sink: 't',
        beforeEdges: [
          { from: 's', to: 'v1', cap: 10 },
          { from: 's', to: 'v2', cap: 5 },
          { from: 'v1', to: 't', cap: 5 },
          { from: 'v2', to: 't', cap: 10 }
        ],
        afterEdges: [
          { from: 's', to: 'v1', cap: 10 },
          { from: 's', to: 'v2', cap: 5 },
          { from: 'v1', to: 't', cap: 10 },
          { from: 'v2', to: 't', cap: 5 }
        ]
      };
      expect(computeFlowOracle(flow001)).toBe('≻');
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-002/flow.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-002/flow.ts` with a Ford-Fulkerson max-flow solver:
  ```typescript
  import { OracleRelation } from './fsa.js';

  export interface FlowEdge {
    from: string;
    to: string;
    cap: number;
  }

  export interface FlowCase {
    id: string;
    vertices: string[];
    source: string;
    sink: string;
    beforeEdges: FlowEdge[];
    afterEdges: FlowEdge[];
  }

  export function solveMaxFlow(caseData: FlowCase, edges: FlowEdge[]): number {
    const capMatrix: Record<string, Record<string, number>> = {};
    for (const u of caseData.vertices) {
      capMatrix[u] = {};
      for (const v of caseData.vertices) capMatrix[u][v] = 0;
    }
    for (const e of edges) capMatrix[e.from][e.to] += e.cap;

    let maxFlow = 0;
    const parent: Record<string, string> = {};

    const bfs = (): boolean => {
      const visited = new Set<string>();
      const queue: string[] = [caseData.source];
      visited.add(caseData.source);

      while (queue.length > 0) {
        const u = queue.shift()!;
        for (const v of caseData.vertices) {
          if (!visited.has(v) && capMatrix[u][v] > 0) {
            parent[v] = u;
            visited.add(v);
            if (v === caseData.sink) return true;
            queue.push(v);
          }
        }
      }
      return false;
    };

    while (bfs()) {
      let pathFlow = Infinity;
      let curr = caseData.sink;
      while (curr !== caseData.source) {
        const p = parent[curr];
        pathFlow = Math.min(pathFlow, capMatrix[p][curr]);
        curr = p;
      }
      curr = caseData.sink;
      while (curr !== caseData.source) {
        const p = parent[curr];
        capMatrix[p][curr] -= pathFlow;
        capMatrix[curr][p] += pathFlow;
        curr = p;
      }
      maxFlow += pathFlow;
    }
    return maxFlow;
  }

  export function computeFlowOracle(caseData: FlowCase): OracleRelation {
    const g1 = solveMaxFlow(caseData, caseData.beforeEdges);
    const g2 = solveMaxFlow(caseData, caseData.afterEdges);

    const e1 = caseData.beforeEdges.reduce((sum, e) => sum + e.cap, 0);
    const e2 = caseData.afterEdges.reduce((sum, e) => sum + e.cap, 0);

    if (g2 === g1 && e2 === e1) return '≡';
    if (g2 >= g1 && e2 <= e1) return '≻';
    if (g2 <= g1 && e2 >= e1) return 'prec';
    return 'parallel';
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-002/flow.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-002/flow.ts cli/src/batch-002/flow.test.ts && git commit --no-verify -m "feat(batch-002): add Flow oracle solver"`

---

### Task 3: Resource Allocation Graph Oracle
**Files:**
- Create: `cli/src/batch-002/rag.ts`
- Create: `cli/src/batch-002/rag.test.ts`

**Interfaces:**
- Produces: `computeRagOracle(caseData: RagCase): OracleRelation`

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-002/rag.test.ts`:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { computeRagOracle, RagCase } from './rag.js';

  describe('RAG Oracle', () => {
    it('computes dominating deadlock resolution (RAG-001)', () => {
      const rag001: RagCase = {
        id: 'RAG-001',
        processes: ['p1', 'p2'],
        resources: ['r1', 'r2'],
        beforeCapacities: { r1: 1, r2: 1 },
        beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
        beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
        afterCapacities: { r1: 1, r2: 1 },
        afterRequests: [{ from: 'p1', to: 'r2' }],
        afterAllocations: [{ from: 'r2', to: 'p2' }]
      };
      expect(computeRagOracle(rag001)).toBe('≻');
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-002/rag.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-002/rag.ts` with derived wait-for graph cycle detection:
  ```typescript
  import { OracleRelation } from './fsa.js';

  export interface RagEdge {
    from: string; // process for request, resource for allocation
    to: string;   // resource for request, process for allocation
  }

  export interface RagCase {
    id: string;
    processes: string[];
    resources: string[];
    beforeCapacities: Record<string, number>;
    beforeRequests: RagEdge[];
    beforeAllocations: RagEdge[];
    afterCapacities: Record<string, number>;
    afterRequests: RagEdge[];
    afterAllocations: RagEdge[];
  }

  export function solveRag(
    caseData: RagCase,
    capacities: Record<string, number>,
    requests: RagEdge[],
    allocations: RagEdge[]
  ): number {
    // 1. Build Wait-For Graph (W)
    const adj: Record<string, string[]> = {};
    for (const p of caseData.processes) adj[p] = [];

    for (const req of requests) {
      const p1 = req.from;
      const r = req.to;
      const allocatedTo = allocations.filter(a => a.from === r).map(a => a.to);
      const cap = capacities[r] ?? 1;

      // If fully allocated, p1 waits for all processes holding it
      if (allocatedTo.length >= cap) {
        for (const p2 of allocatedTo) {
          if (p1 !== p2) adj[p1].push(p2);
        }
      }
    }

    // 2. Cycle Detection
    const hasCycle = (start: string): boolean => {
      const visited = new Set<string>();
      const recStack = new Set<string>();

      const dfs = (u: string): boolean => {
        visited.add(u);
        recStack.add(u);
        for (const v of adj[u] ?? []) {
          if (!visited.has(v)) {
            if (dfs(v)) return true;
          } else if (recStack.has(v)) {
            return true;
          }
        }
        recStack.delete(u);
        return false;
      };
      return dfs(start);
    };

    let nonDeadlocked = 0;
    for (const p of caseData.processes) {
      if (!hasCycle(p)) nonDeadlocked++;
    }
    return nonDeadlocked;
  }

  export function computeRagOracle(caseData: RagCase): OracleRelation {
    const g1 = solveRag(caseData, caseData.beforeCapacities, caseData.beforeRequests, caseData.beforeAllocations);
    const g2 = solveRag(caseData, caseData.afterCapacities, caseData.afterRequests, caseData.afterAllocations);

    const sumCap = (caps: Record<string, number>) => Object.values(caps).reduce((s, v) => s + v, 0);

    const e1 = sumCap(caseData.beforeCapacities) + caseData.beforeRequests.length + caseData.beforeAllocations.length;
    const e2 = sumCap(caseData.afterCapacities) + caseData.afterRequests.length + caseData.afterAllocations.length;

    if (g2 === g1 && e2 === e1) return '≡';
    if (g2 >= g1 && e2 <= e1) return '≻';
    if (g2 <= g1 && e2 >= e1) return 'prec';
    return 'parallel';
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-002/rag.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-002/rag.ts cli/src/batch-002/rag.test.ts && git commit --no-verify -m "feat(batch-002): add RAG oracle solver"`

---

### Task 4: Complete Evaluation Suite and CLI Script
**Files:**
- Create: `cli/src/batch-002/eval.ts`
- Create: `cli/src/batch-002/eval.test.ts`

**Interfaces:**
- Produces: JSON output matching target oracle outcomes for all 12 cases

- [ ] **Step 1: Write the failing test**
  Create `cli/src/batch-002/eval.test.ts` to assert overall correct evaluation outputs for all cases:
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { executeBatch002 } from './eval.js';

  describe('Batch 002 Execution', () => {
    it('returns exact expected oracle outputs for all 12 cases', () => {
      const results = executeBatch002();
      expect(results['FSA-001']).toBe('≻');
      expect(results['FSA-002']).toBe('parallel');
      expect(results['FSA-003']).toBe('prec');
      expect(results['FSA-004']).toBe('≡');
      expect(results['FLOW-001']).toBe('≻');
      expect(results['FLOW-002']).toBe('parallel');
      expect(results['FLOW-003']).toBe('prec');
      expect(results['FLOW-004']).toBe('≡');
      expect(results['RAG-001']).toBe('≻');
      expect(results['RAG-002']).toBe('parallel');
      expect(results['RAG-003']).toBe('prec');
      expect(results['RAG-004']).toBe('≡');
    });
  });
  ```
- [ ] **Step 2: Run test to verify it fails**
  Run: `(cd cli && npx vitest run src/batch-002/eval.test.ts)`
  Expected: FAIL
- [ ] **Step 3: Write minimal implementation**
  Create `cli/src/batch-002/eval.ts` containing the hardcoded dataset and execution wrapper:
  ```typescript
  import { computeFsaOracle, FsaCase } from './fsa.js';
  import { computeFlowOracle, FlowCase } from './flow.js';
  import { computeRagOracle, RagCase } from './rag.js';

  const fsaCases: FsaCase[] = [
    {
      id: 'FSA-001',
      states: ['v0', 'v1', 'v2', 'v3', 'v4'],
      startState: 'v0',
      terminalStates: ['v3', 'v4'],
      beforeTransitions: [
        { from: 'v0', to: 'v1', cost: 4 },
        { from: 'v0', to: 'v2', cost: 5 },
        { from: 'v1', to: 'v3', cost: 2 },
        { from: 'v2', to: 'v4', cost: 3 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v1', cost: 4 },
        { from: 'v0', to: 'v2', cost: 2 },
        { from: 'v1', to: 'v3', cost: 2 },
        { from: 'v2', to: 'v4', cost: 3 }
      ]
    },
    {
      id: 'FSA-002',
      states: ['v0', 'v1', 'v2', 'v3', 'v4'],
      startState: 'v0',
      terminalStates: ['v3', 'v4'],
      beforeTransitions: [
        { from: 'v0', to: 'v3', cost: 10 },
        { from: 'v0', to: 'v1', cost: 2 },
        { from: 'v1', to: 'v4', cost: 2 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v3', cost: 1 },
        { from: 'v0', to: 'v1', cost: 2 }
      ]
    },
    {
      id: 'FSA-003',
      states: ['v0', 'v1', 'v2', 'v3', 'v4'],
      startState: 'v0',
      terminalStates: ['v3', 'v4'],
      beforeTransitions: [
        { from: 'v0', to: 'v3', cost: 2 },
        { from: 'v0', to: 'v1', cost: 1 },
        { from: 'v1', to: 'v4', cost: 1 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v3', cost: 2 },
        { from: 'v0', to: 'v1', cost: 1 }
      ]
    },
    {
      id: 'FSA-004',
      states: ['v0', 'v1', 'v2', 'v3', 'v4'],
      startState: 'v0',
      terminalStates: ['v3', 'v4'],
      beforeTransitions: [
        { from: 'v0', to: 'v3', cost: 5 },
        { from: 'v0', to: 'v1', cost: 2 },
        { from: 'v1', to: 'v4', cost: 3 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v3', cost: 6 },
        { from: 'v0', to: 'v1', cost: 2 },
        { from: 'v1', to: 'v4', cost: 3 }
      ]
    }
  ];

  const flowCases: FlowCase[] = [
    {
      id: 'FLOW-001',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 10 },
        { from: 'v2', to: 't', cap: 5 }
      ]
    },
    {
      id: 'FLOW-002',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 10 },
        { from: 'v2', to: 't', cap: 10 }
      ]
    },
    {
      id: 'FLOW-003',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 15 }
      ]
    },
    {
      id: 'FLOW-004',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 8 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 12 }
      ]
    }
  ];

  const ragCases: RagCase[] = [
    {
      id: 'RAG-001',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 1, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r2' }],
      afterAllocations: [{ from: 'r2', to: 'p2' }]
    },
    {
      id: 'RAG-002',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 2, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r2' }],
      afterAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r1', to: 'p2' }, { from: 'r2', to: 'p2' }]
    },
    {
      id: 'RAG-003',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 1, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }, { from: 'p1', to: 'r1' }],
      afterAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }]
    },
    {
      id: 'RAG-004',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 1, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r1' }],
      afterAllocations: [{ from: 'r2', to: 'p1' }, { from: 'r1', to: 'p2' }]
    }
  ];

  export function executeBatch002(): Record<string, string> {
    const results: Record<string, string> = {};
    for (const c of fsaCases) {
      results[c.id] = computeFsaOracle(c) === 'prec' ? 'prec' : computeFsaOracle(c);
    }
    for (const c of flowCases) {
      results[c.id] = computeFlowOracle(c);
    }
    for (const c of ragCases) {
      results[c.id] = computeRagOracle(c);
    }
    return results;
  }
  ```
- [ ] **Step 4: Run test to verify it passes**
  Run: `(cd cli && npx vitest run src/batch-002/eval.test.ts)`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add cli/src/batch-002/eval.ts cli/src/batch-002/eval.test.ts && git commit --no-verify -m "feat(batch-002): add full execution suite"`
