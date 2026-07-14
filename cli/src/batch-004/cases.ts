import { CaseData, SelectedIntervention } from './baselines.js';
import { ObservableSubgraph, GlobalGraph } from './estimator.js';

// --- Types & Interfaces ---

export interface DepNodeInfo {
  id: string;
  pFail: number;
  isIsolation: boolean;
}

export interface DepEdgeInfo {
  id: string;
  from: string;
  to: string;
}

export interface WrkTaskInfo {
  id: string;
  cost: number;
  pFail: number;
  isCheckpoint: boolean;
}

export interface ResEdgeInfo {
  from: string;
  to: string;
}

export interface ResSystemInfo {
  processes: string[];
  resources: string[];
  capacities: Record<string, number>;
  demands: Record<string, number>;
  requests: ResEdgeInfo[];
  allocations: ResEdgeInfo[];
}

// --- Physical Solvers running on Subgraphs ---

function evaluateDepGraph(
  subgraph: ObservableSubgraph,
  intervention: SelectedIntervention,
  source: string,
  target: string,
  nodesInfo: DepNodeInfo[],
  edgesInfo: DepEdgeInfo[],
  candidateActiveEdges: Record<SelectedIntervention, string[]>
): { g: number; e: number; risk: number; utility: number } {
  const activeIds = candidateActiveEdges[intervention] || [];
  
  // Filter active edges present in the subgraph
  const activeEdges = edgesInfo.filter(
    (edge) =>
      activeIds.includes(edge.id) &&
      subgraph.nodes.includes(edge.from) &&
      subgraph.nodes.includes(edge.to)
  );

  // Find all paths from source to target in the active subgraph
  const paths: string[][] = [];
  const findPaths = (curr: string, path: string[], visited: Set<string>) => {
    if (curr === target) {
      paths.push([...path]);
      return;
    }
    for (const edge of activeEdges) {
      if (edge.from === curr && !visited.has(edge.to)) {
        visited.add(edge.to);
        path.push(edge.id);
        findPaths(edge.to, path, visited);
        path.pop();
        visited.delete(edge.to);
      }
    }
  };

  const hasSource = subgraph.nodes.includes(source);
  const hasTarget = subgraph.nodes.includes(target);
  if (hasSource && hasTarget) {
    findPaths(source, [], new Set([source]));
  }

  const reachable = paths.length > 0;
  if (!reachable) {
    const e = activeEdges.filter((edge) => !edge.id.startsWith('decoy')).length;
    return { g: 0, e, risk: 0, utility: -e };
  }

  // Greedy disjoint paths count
  let pathCount = 0;
  const usedEdges = new Set<string>();
  for (const p of paths) {
    if (p.every((eid) => !usedEdges.has(eid))) {
      pathCount++;
      p.forEach((eid) => usedEdges.add(eid));
    }
  }

  const g = Math.min(20, 10 + 2 * pathCount);
  const e = activeEdges.filter((edge) => !edge.id.startsWith('decoy')).length;

  let risk = 0;
  const targetOutageImpact = 20;

  for (const node of subgraph.nodes) {
    if (node === target || node === source || node.startsWith('decoy')) continue;
    const nodeInfo = nodesInfo.find((n) => n.id === node);
    if (!nodeInfo) continue;
    const p_u = nodeInfo.pFail;
    if (p_u === 0) continue;

    // Check if failure can reach target
    const hasPathToTarget = (start: string, visited: Set<string>): boolean => {
      if (start === target) return true;
      for (const edge of activeEdges) {
        if (edge.from === start && !visited.has(edge.to)) {
          visited.add(edge.to);
          if (hasPathToTarget(edge.to, visited)) return true;
          visited.delete(edge.to);
        }
      }
      return false;
    };

    if (!hasPathToTarget(node, new Set([node]))) continue;

    // Check interception by active isolation node
    let isIntercepted = false;
    const isolationNodes = nodesInfo.filter((n) => n.isIsolation).map((n) => n.id);

    for (const iso of isolationNodes) {
      if (!subgraph.nodes.includes(iso)) continue;

      const pathExistsWithoutIso = (start: string, visited: Set<string>): boolean => {
        if (start === target) return true;
        for (const edge of activeEdges) {
          if (edge.from === start && edge.to !== iso && !visited.has(edge.to)) {
            visited.add(edge.to);
            if (pathExistsWithoutIso(edge.to, visited)) return true;
            visited.delete(edge.to);
          }
        }
        return false;
      };

      if (!pathExistsWithoutIso(node, new Set([node]))) {
        isIntercepted = true;
        break;
      }
    }

    const failProb = isIntercepted ? 0.05 : 0.90;
    risk += p_u * targetOutageImpact * failProb;
  }

  const utility = g - e - risk;
  return { g, e, risk, utility };
}

function evaluateWorkflow(
  subgraph: ObservableSubgraph,
  intervention: SelectedIntervention,
  tasksInfo: WrkTaskInfo[],
  candidateActiveTasks: Record<SelectedIntervention, string[]>
): { g: number; e: number; risk: number; utility: number } {
  const activeIds = candidateActiveTasks[intervention] || [];
  
  // Filter and order active tasks present in the subgraph (excluding decoy tasks)
  const activeTasks = tasksInfo.filter(
    (t) => activeIds.includes(t.id) && subgraph.nodes.includes(t.id) && !t.id.startsWith('decoy')
  );

  // Success Probability
  let successProb = 1.0;
  for (const t of activeTasks) {
    successProb *= (1.0 - t.pFail);
  }
  const g = 10 * successProb;
  const e = activeTasks.reduce((sum, t) => sum + t.cost, 0);

  // Expected rollback cost risk
  let risk = 0;
  for (let i = 0; i < activeTasks.length; i++) {
    const t = activeTasks[i];
    if (t.pFail === 0) continue;

    let rollbackTargetIndex = -1;
    for (let j = i - 1; j >= 0; j--) {
      if (activeTasks[j].isCheckpoint) {
        rollbackTargetIndex = j;
        break;
      }
    }

    let rollbackCost = 0;
    const startIdx = rollbackTargetIndex + 1;
    for (let k = startIdx; k <= i; k++) {
      rollbackCost += activeTasks[k].cost;
    }

    risk += t.pFail * rollbackCost;
  }

  const utility = g - e - risk;
  return { g, e, risk, utility };
}

function evaluateResourceSystem(
  subgraph: ObservableSubgraph,
  intervention: SelectedIntervention,
  systemInfo: ResSystemInfo,
  candidateConfig: Record<
    SelectedIntervention,
    { activeProcesses: string[]; activeResources: string[]; hasRateLimiter: boolean }
  >
): { g: number; e: number; risk: number; utility: number } {
  const config = candidateConfig[intervention];
  if (!config) {
    return { g: 0, e: 0, risk: 0, utility: 0 };
  }

  // Filter active processes and resources in the subgraph (excluding decoy nodes)
  const activeProcesses = config.activeProcesses.filter(
    (p) => subgraph.nodes.includes(p) && !p.startsWith('decoy')
  );
  const activeResources = config.activeResources.filter(
    (r) => subgraph.nodes.includes(r) && !r.startsWith('decoy')
  );
  const hasRateLimiter = config.hasRateLimiter;

  // Requests and allocations in the active subgraph (excluding decoy nodes)
  const activeRequests = systemInfo.requests.filter(
    (edge) =>
      subgraph.nodes.includes(edge.from) &&
      subgraph.nodes.includes(edge.to) &&
      !edge.from.startsWith('decoy') &&
      !edge.to.startsWith('decoy')
  );
  const activeAllocations = systemInfo.allocations.filter(
    (edge) =>
      subgraph.nodes.includes(edge.from) &&
      subgraph.nodes.includes(edge.to) &&
      !edge.from.startsWith('decoy') &&
      !edge.to.startsWith('decoy')
  );

  const edgeCount = activeRequests.length + activeAllocations.length;
  const capacitySum = activeResources.reduce(
    (sum, r) => sum + (systemInfo.capacities[r] ?? 1),
    0
  );
  const e = capacitySum + edgeCount;

  // Goal calculation:
  const subgraphProcesses = systemInfo.processes.filter(
    (p) => subgraph.nodes.includes(p) && !p.startsWith('decoy')
  );
  const baseBlocked = subgraphProcesses.filter((p) => !activeProcesses.includes(p)).length;
  const rateLimiterBlock = hasRateLimiter ? 1 : 0;
  const blockedCount = Math.min(
    subgraphProcesses.length,
    baseBlocked + rateLimiterBlock
  );
  const unblockedCount = Math.max(0, subgraphProcesses.length - blockedCount);
  const g = unblockedCount * 5;

  // Overload calculation
  let totalOverload = 0;
  for (const r of activeResources) {
    const cap = systemInfo.capacities[r] ?? 1;
    let demand = systemInfo.demands[r] ?? 0;
    if (hasRateLimiter) {
      demand = Math.max(0, demand - 1);
    }
    const overload = Math.max(0, demand - cap);
    totalOverload += overload;
  }

  const crashProb = 1.0 - Math.exp(-0.5 * totalOverload);
  const risk = crashProb * 30;

  const utility = g - e - risk;
  return { g, e, risk, utility };
}

// --- Case Definitions Data Store ---

interface InternalCaseDef {
  id: string;
  systemType: 'dependency' | 'workflow' | 'resource';
  focalNode: string;
  globalGraph: GlobalGraph;
  candidateInterventions: SelectedIntervention[];
  solve: (subgraph: ObservableSubgraph, intervention: SelectedIntervention) => { g: number; e: number; risk: number; utility: number };
}

const casesDefinitions: InternalCaseDef[] = [
  // --- Dependency Graph Cases (DEP) ---

  // DEP-001 (Difficulty: DIRECT) - Accidental redundant dependency bypass.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'DEP-001',
    systemType: 'dependency',
    focalNode: 'v1',
    globalGraph: {
      nodes: ['s', 'v1', 't'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 't' },
        { from: 'v1', to: 't' }, // duplicate bypass
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateDepGraph(
        subgraph,
        intervention,
        's',
        't',
        [
          { id: 's', pFail: 0, isIsolation: false },
          { id: 'v1', pFail: 0.1, isIsolation: false },
          { id: 't', pFail: 0, isIsolation: false },
        ],
        [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 't' },
          { id: 'e3', from: 'v1', to: 't' },
        ],
        {
          T0: ['e1', 'e2', 'e3'],
          T1: ['e1', 'e2'],
        }
      );
    },
  },

  // DEP-002 (Difficulty: DIRECT) - Necessary choke-point dependency.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'DEP-002',
    systemType: 'dependency',
    focalNode: 'v1',
    globalGraph: {
      nodes: ['s', 'v1', 't'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 't' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateDepGraph(
        subgraph,
        intervention,
        's',
        't',
        [
          { id: 's', pFail: 0, isIsolation: false },
          { id: 'v1', pFail: 0.1, isIsolation: false },
          { id: 't', pFail: 0, isIsolation: false },
        ],
        [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 't' },
        ],
        {
          T0: ['e1', 'e2'],
          T1: ['e1'],
        }
      );
    },
  },

  // DEP-003 (Difficulty: DIRECT) - Stabilizing isolation layer removal.
  // Group: External-resolution-required (radius = 3 due to decoy chain)
  {
    id: 'DEP-003',
    systemType: 'dependency',
    focalNode: 'v1',
    globalGraph: {
      nodes: ['s', 'v1', 'v2', 't', 'decoy1', 'decoy2', 'decoy3'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 'v2' },
        { from: 'v2', to: 't' },
        { from: 'v1', to: 't' }, // bypass
        { from: 'v1', to: 'decoy1' },
        { from: 'decoy1', to: 'decoy2' },
        { from: 'decoy2', to: 'decoy3' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateDepGraph(
        subgraph,
        intervention,
        's',
        't',
        [
          { id: 's', pFail: 0, isIsolation: false },
          { id: 'v1', pFail: 0.5, isIsolation: false },
          { id: 'v2', pFail: 0, isIsolation: true },
          { id: 't', pFail: 0, isIsolation: false },
        ],
        [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 'v2' },
          { id: 'e3', from: 'v2', to: 't' },
          { id: 'e4', from: 'v1', to: 't' },
          { id: 'decoy_e1', from: 'v1', to: 'decoy1' },
          { id: 'decoy_e2', from: 'decoy1', to: 'decoy2' },
          { id: 'decoy_e3', from: 'decoy2', to: 'decoy3' },
        ],
        {
          T0: ['e1', 'e2', 'e3', 'decoy_e1', 'decoy_e2', 'decoy_e3'],
          T1: ['e1', 'e4', 'decoy_e1', 'decoy_e2', 'decoy_e3'],
        }
      );
    },
  },

  // DEP-004 (Difficulty: TRADEOFF) - Choice between removing redundancy vs removing isolation layer.
  // Group: Expansion-resolvable (radius = 2)
  {
    id: 'DEP-004',
    systemType: 'dependency',
    focalNode: 'v1',
    globalGraph: {
      nodes: ['s', 'v1', 'v2', 'v3', 't'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 't' },
        { from: 'v1', to: 't' }, // redundant
        { from: 's', to: 'v2' },
        { from: 'v2', to: 'v3' },
        { from: 'v3', to: 't' },
        { from: 'v2', to: 't' }, // bypass
      ],
    },
    candidateInterventions: ['T0', 'T1', 'T2'],
    solve(subgraph, intervention) {
      return evaluateDepGraph(
        subgraph,
        intervention,
        's',
        't',
        [
          { id: 's', pFail: 0, isIsolation: false },
          { id: 'v1', pFail: 0.1, isIsolation: false },
          { id: 'v2', pFail: 0.5, isIsolation: false },
          { id: 'v3', pFail: 0, isIsolation: true },
          { id: 't', pFail: 0, isIsolation: false },
        ],
        [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 't' },
          { id: 'e3', from: 'v1', to: 't' },
          { id: 'e4', from: 's', to: 'v2' },
          { id: 'e5', from: 'v2', to: 'v3' },
          { id: 'e6', from: 'v3', to: 't' },
          { id: 'e7', from: 'v2', to: 't' },
        ],
        {
          T0: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
          T1: ['e1', 'e2', 'e4', 'e5', 'e6'], // remove redundant e3
          T2: ['e1', 'e2', 'e3', 'e4', 'e7'], // remove isolation node v3 (bypass via e7)
        }
      );
    },
  },

  // DEP-005 (Difficulty: ADVERSARIAL) - Redundant path that acts as critical fault-tolerance.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'DEP-005',
    systemType: 'dependency',
    focalNode: 'v1',
    globalGraph: {
      nodes: ['s', 'v1', 't'],
      edges: [
        { from: 's', to: 'v1' },
        { from: 'v1', to: 't' },
        { from: 's', to: 't' }, // critical redundancy
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateDepGraph(
        subgraph,
        intervention,
        's',
        't',
        [
          { id: 's', pFail: 0, isIsolation: false },
          { id: 'v1', pFail: 0.5, isIsolation: false },
          { id: 't', pFail: 0, isIsolation: false },
        ],
        [
          { id: 'e1', from: 's', to: 'v1' },
          { id: 'e2', from: 'v1', to: 't' },
          { id: 'e_direct', from: 's', to: 't' },
        ],
        {
          T0: ['e1', 'e2', 'e_direct'],
          T1: ['e1', 'e2'],
        }
      );
    },
  },

  // --- Workflow Cases (WRK) ---

  // WRK-001 (Difficulty: DIRECT) - Accidental duplicate logging task.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'WRK-001',
    systemType: 'workflow',
    focalNode: 't2',
    globalGraph: {
      nodes: ['t1', 't2', 't3'],
      edges: [
        { from: 't1', to: 't2' },
        { from: 't2', to: 't3' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateWorkflow(
        subgraph,
        intervention,
        [
          { id: 't1', cost: 2, pFail: 0.1, isCheckpoint: false },
          { id: 't2', cost: 1, pFail: 0.0, isCheckpoint: false },
          { id: 't3', cost: 3, pFail: 0.0, isCheckpoint: true },
        ],
        {
          T0: ['t1', 't2', 't3'],
          T1: ['t1', 't3'],
        }
      );
    },
  },

  // WRK-002 (Difficulty: DIRECT) - Necessary input validation task.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'WRK-002',
    systemType: 'workflow',
    focalNode: 't1',
    globalGraph: {
      nodes: ['t0', 't1', 't2'],
      edges: [
        { from: 't0', to: 't1' },
        { from: 't1', to: 't2' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateWorkflow(
        subgraph,
        intervention,
        [
          { id: 't0', cost: 15, pFail: 0.0, isCheckpoint: false },
          { id: 't1', cost: 1, pFail: 0.05, isCheckpoint: true },
          { id: 't2', cost: 10, pFail: 0.2, isCheckpoint: false },
        ],
        {
          T0: ['t0', 't1', 't2'],
          T1: ['t0', 't2'],
        }
      );
    },
  },

  // WRK-003 (Difficulty: DIRECT) - Stabilizing checkpoint task.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'WRK-003',
    systemType: 'workflow',
    focalNode: 't1',
    globalGraph: {
      nodes: ['t0', 't1', 't2'],
      edges: [
        { from: 't0', to: 't1' },
        { from: 't1', to: 't2' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateWorkflow(
        subgraph,
        intervention,
        [
          { id: 't0', cost: 10, pFail: 0.0, isCheckpoint: false },
          { id: 't1', cost: 2, pFail: 0.0, isCheckpoint: true },
          { id: 't2', cost: 8, pFail: 0.3, isCheckpoint: false },
        ],
        {
          T0: ['t0', 't1', 't2'],
          T1: ['t0', 't2'],
        }
      );
    },
  },

  // WRK-004 (Difficulty: TRADEOFF) - Optimal checkpoint placement.
  // Group: Expansion-resolvable (radius = 2)
  {
    id: 'WRK-004',
    systemType: 'workflow',
    focalNode: 'tA',
    globalGraph: {
      nodes: ['t0', 't1', 'tA', 't2', 't3'],
      edges: [
        { from: 't0', to: 't1' },
        { from: 't1', to: 'tA' },
        { from: 'tA', to: 't2' },
        { from: 't2', to: 't3' },
      ],
    },
    candidateInterventions: ['T0', 'T1', 'T2'],
    solve(subgraph, intervention) {
      return evaluateWorkflow(
        subgraph,
        intervention,
        [
          { id: 't0', cost: 5, pFail: 0.0, isCheckpoint: false },
          { id: 't1', cost: 1, pFail: 0.0, isCheckpoint: true },
          { id: 'tA', cost: 5, pFail: 0.0, isCheckpoint: false },
          { id: 't2', cost: 1, pFail: 0.0, isCheckpoint: true },
          { id: 't3', cost: 10, pFail: 0.3, isCheckpoint: false },
        ],
        {
          T0: ['t0', 'tA', 't3'],
          T1: ['t0', 't1', 'tA', 't3'], // early checkpoint
          T2: ['t0', 'tA', 't2', 't3'], // late checkpoint
        }
      );
    },
  },

  // WRK-005 (Difficulty: ADVERSARIAL) - Low-probability failure task with catastrophic rollback penalty.
  // Group: External-resolution-required (radius = 3 due to decoy chain)
  {
    id: 'WRK-005',
    systemType: 'workflow',
    focalNode: 't1',
    globalGraph: {
      nodes: ['t0', 't1', 't2', 'decoy1', 'decoy2', 'decoy3'],
      edges: [
        { from: 't0', to: 't1' },
        { from: 't1', to: 't2' },
        { from: 't1', to: 'decoy1' },
        { from: 'decoy1', to: 'decoy2' },
        { from: 'decoy2', to: 'decoy3' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateWorkflow(
        subgraph,
        intervention,
        [
          { id: 't0', cost: 300, pFail: 0.0, isCheckpoint: false },
          { id: 't1', cost: 2, pFail: 0.0, isCheckpoint: true },
          { id: 't2', cost: 10, pFail: 0.01, isCheckpoint: false },
          { id: 'decoy1', cost: 0, pFail: 0, isCheckpoint: false },
          { id: 'decoy2', cost: 0, pFail: 0, isCheckpoint: false },
          { id: 'decoy3', cost: 0, pFail: 0, isCheckpoint: false },
        ],
        {
          T0: ['t0', 't1', 't2', 'decoy1', 'decoy2', 'decoy3'],
          T1: ['t0', 't2', 'decoy1', 'decoy2', 'decoy3'],
        }
      );
    },
  },

  // --- Resource System Cases (RES) ---

  // RES-001 (Difficulty: DIRECT) - Redundant lock on non-shared resource.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'RES-001',
    systemType: 'resource',
    focalNode: 'p1',
    globalGraph: {
      nodes: ['p1', 'r1'],
      edges: [
        { from: 'p1', to: 'r1' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateResourceSystem(subgraph, intervention, {
        processes: ['p1'],
        resources: ['r1'],
        capacities: { r1: 1 },
        demands: { r1: 1 },
        requests: [{ from: 'p1', to: 'r1' }],
        allocations: [],
      }, {
        T0: { activeProcesses: ['p1'], activeResources: ['r1'], hasRateLimiter: false },
        T1: { activeProcesses: ['p1'], activeResources: [], hasRateLimiter: false },
      });
    },
  },

  // RES-002 (Difficulty: DIRECT) - Necessary mutex lock on shared state.
  // Group: H1-sufficient (radius = 1)
  {
    id: 'RES-002',
    systemType: 'resource',
    focalNode: 'r1',
    globalGraph: {
      nodes: ['p1', 'p2', 'r1'],
      edges: [
        { from: 'p1', to: 'r1' },
        { from: 'p2', to: 'r1' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateResourceSystem(subgraph, intervention, {
        processes: ['p1', 'p2'],
        resources: ['r1'],
        capacities: { r1: 1 },
        demands: { r1: 2 },
        requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
        allocations: [],
      }, {
        T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true },
        T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false },
      });
    },
  },

  // RES-003 (Difficulty: DIRECT) - Stabilizing rate limiter on high contention resource.
  // Group: External-resolution-required (radius = 3 due to decoy chain)
  {
    id: 'RES-003',
    systemType: 'resource',
    focalNode: 'r1',
    globalGraph: {
      nodes: ['p1', 'p2', 'r1', 'decoy1', 'decoy2', 'decoy3'],
      edges: [
        { from: 'p1', to: 'r1' },
        { from: 'p2', to: 'r1' },
        { from: 'r1', to: 'decoy1' },
        { from: 'decoy1', to: 'decoy2' },
        { from: 'decoy2', to: 'decoy3' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateResourceSystem(subgraph, intervention, {
        processes: ['p1', 'p2', 'decoy1', 'decoy2', 'decoy3'],
        resources: ['r1'],
        capacities: { r1: 1 },
        demands: { r1: 3 },
        requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
        allocations: [],
      }, {
        T0: { activeProcesses: ['p1', 'p2', 'decoy1', 'decoy2', 'decoy3'], activeResources: ['r1'], hasRateLimiter: true },
        T1: { activeProcesses: ['p1', 'p2', 'decoy1', 'decoy2', 'decoy3'], activeResources: ['r1'], hasRateLimiter: false },
      });
    },
  },

  // RES-004 (Difficulty: TRADEOFF) - Contention mitigation choice.
  // Group: Expansion-resolvable (radius = 2)
  {
    id: 'RES-004',
    systemType: 'resource',
    focalNode: 'r1',
    globalGraph: {
      nodes: ['p1', 'p2', 'r1', 'r2'],
      edges: [
        { from: 'p1', to: 'r1' },
        { from: 'p2', to: 'r1' },
        { from: 'p1', to: 'r2' },
      ],
    },
    candidateInterventions: ['T0', 'T1', 'T2'],
    solve(subgraph, intervention) {
      return evaluateResourceSystem(subgraph, intervention, {
        processes: ['p1', 'p2'],
        resources: ['r1', 'r2'],
        capacities: { r1: 1, r2: 2 },
        demands: { r1: 2, r2: 2 },
        requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
        allocations: [],
      }, {
        T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false },
        T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true },
        T2: { activeProcesses: ['p1', 'p2'], activeResources: ['r2'], hasRateLimiter: false },
      });
    },
  },

  // RES-005 (Difficulty: ADVERSARIAL) - Rate limiter preventing global contention crash.
  // Group: Expansion-resolvable (radius = 2 due to decoy chain)
  {
    id: 'RES-005',
    systemType: 'resource',
    focalNode: 'r1',
    globalGraph: {
      nodes: ['p1', 'p2', 'r1', 'decoy1', 'decoy2'],
      edges: [
        { from: 'p1', to: 'r1' },
        { from: 'p2', to: 'r1' },
        { from: 'r1', to: 'decoy1' },
        { from: 'decoy1', to: 'decoy2' },
      ],
    },
    candidateInterventions: ['T0', 'T1'],
    solve(subgraph, intervention) {
      return evaluateResourceSystem(subgraph, intervention, {
        processes: ['p1', 'p2', 'decoy1', 'decoy2'],
        resources: ['r1'],
        capacities: { r1: 1 },
        demands: { r1: 2 },
        requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
        allocations: [],
      }, {
        T0: { activeProcesses: ['p1', 'p2', 'decoy1', 'decoy2'], activeResources: ['r1'], hasRateLimiter: true },
        T1: { activeProcesses: ['p1', 'p2', 'decoy1', 'decoy2'], activeResources: ['r1'], hasRateLimiter: false },
      });
    },
  },
];

// --- Public APIs ---

export function loadBatch004Cases(): CaseData[] {
  return casesDefinitions.map((def) => ({
    id: def.id,
    systemType: def.systemType,
    focalNode: def.focalNode,
    globalGraph: def.globalGraph,
    candidateInterventions: def.candidateInterventions,
    evaluateUtility(subgraph, intervention) {
      const res = def.solve(subgraph, intervention);
      return res.utility;
    },
  }));
}

export function solveCaseOracle(
  caseData: CaseData,
  intervention: SelectedIntervention
): { g: number; e: number; risk: number; utility: number } {
  const def = casesDefinitions.find((d) => d.id === caseData.id);
  if (!def) {
    throw new Error(`Unknown case ID: ${caseData.id}`);
  }
  // Compute global subgraph
  const globalDegrees: Record<string, number> = {};
  for (const node of caseData.globalGraph.nodes) {
    globalDegrees[node] = 0;
  }
  for (const edge of caseData.globalGraph.edges) {
    if (globalDegrees[edge.from] !== undefined) {
      globalDegrees[edge.from]++;
    }
    if (globalDegrees[edge.to] !== undefined) {
      globalDegrees[edge.to]++;
    }
  }
  const globalSubgraph: ObservableSubgraph = {
    nodes: caseData.globalGraph.nodes,
    edges: caseData.globalGraph.edges,
    globalDegrees,
  };

  return def.solve(globalSubgraph, intervention);
}
