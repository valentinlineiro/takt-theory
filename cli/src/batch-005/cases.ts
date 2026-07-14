import {
  GlobalGraph,
  ObservableSubgraph,
  DecisionSensitivity,
  GraphEdge,
  CapabilitySignature,
} from './estimator.js';

export interface CaseIntervention {
  id: string;
  sensitivity: DecisionSensitivity;
  activeNodes: string[];
  activeEdges: string[];
  hasRateLimiter?: boolean;
  checkpoints?: string[];
}

export interface CaseData {
  id: string;
  domain: 'DEP' | 'WRK' | 'RES';
  focalElement: string;
  kMax: number;
  graph: GlobalGraph;
  candidates: Record<string, CaseIntervention>;
  // Physical parameters for the utility solvers
  failures: Record<string, number>;
  isolationNodes: string[];
  tasks?: Array<{ id: string; cost: number; pFail: number; isCheckpoint: boolean }>;
  capacities?: Record<string, number>;
  demands?: Record<string, number>;
}

const blankCapabilities = (): CapabilitySignature => ({
  Pf: false,
  Pr: false,
  Ps: false,
  Pc: false,
  Pm: false,
});

export function solveCaseOracle(
  caseData: CaseData,
  interventionId: string
): { g: number; e: number; risk: number; utility: number } {
  const globalSub: ObservableSubgraph = {
    nodes: caseData.graph.nodes,
    edges: caseData.graph.edges,
    globalDegrees: {},
    capabilities: caseData.graph.capabilities,
  };
  for (const node of caseData.graph.nodes) {
    let degree = 0;
    for (const edge of caseData.graph.edges) {
      if (edge.from === node || edge.to === node) {
        degree++;
      }
    }
    globalSub.globalDegrees[node] = degree;
  }

  return evaluateCaseUtility(caseData, globalSub, interventionId);
}

export function evaluateCaseUtility(
  caseData: CaseData,
  O_k: ObservableSubgraph,
  interventionId: string
): { g: number; e: number; risk: number; utility: number } {
  const intervention = caseData.candidates[interventionId];
  if (!intervention) {
    return { g: 0, e: 0, risk: 0, utility: -999 };
  }

  if (caseData.domain === 'DEP') {
    return evaluateDepGraph(caseData, O_k, intervention);
  } else if (caseData.domain === 'WRK') {
    return evaluateWorkflow(caseData, O_k, intervention);
  } else {
    return evaluateResourceSystem(caseData, O_k, intervention);
  }
}

// 1. Dependency Graph Utility Evaluation
function evaluateDepGraph(
  caseData: CaseData,
  O_k: ObservableSubgraph,
  intervention: CaseIntervention
): { g: number; e: number; risk: number; utility: number } {
  const activeNodes = O_k.nodes.filter((n) => intervention.activeNodes.includes(n));
  const activeEdges = O_k.edges.filter(
    (edge) =>
      intervention.activeEdges.includes(`${edge.from}->${edge.to}`) &&
      activeNodes.includes(edge.from) &&
      activeNodes.includes(edge.to)
  );

  const source = 's';
  const target = 't';

  const paths: string[][] = [];
  const findPaths = (curr: string, path: string[], visited: Set<string>) => {
    if (curr === target) {
      paths.push([...path]);
      return;
    }
    for (const e of activeEdges) {
      if (e.from === curr && !visited.has(e.to)) {
        visited.add(e.to);
        path.push(`${e.from}->${e.to}`);
        findPaths(e.to, path, visited);
        path.pop();
        visited.delete(e.to);
      }
    }
  };

  if (activeNodes.includes(source) && activeNodes.includes(target)) {
    findPaths(source, [], new Set([source]));
  }

  const disjointPaths: string[][] = [];
  const usedEdges = new Set<string>();
  for (const path of paths) {
    if (path.every((e) => !usedEdges.has(e))) {
      disjointPaths.push(path);
      path.forEach((e) => usedEdges.add(e));
    }
  }

  const disjointCount = disjointPaths.length;
  const g = paths.length > 0 ? Math.min(20, 10 + 2 * disjointCount) : 0;
  const e = activeEdges.length;

  let risk = 0;
  for (const node of O_k.nodes) {
    if (node === source || node === target || !activeNodes.includes(node)) continue;
    const p_u = caseData.failures[node] ?? 0;
    if (p_u === 0) continue;

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

    let isIntercepted = false;
    for (const iso of caseData.isolationNodes) {
      if (!activeNodes.includes(iso)) continue;

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
    risk += p_u * 20 * failProb;
  }

  return { g, e, risk, utility: g - e - risk };
}

// 2. Workflow System Utility Evaluation
function evaluateWorkflow(
  caseData: CaseData,
  O_k: ObservableSubgraph,
  intervention: CaseIntervention
): { g: number; e: number; risk: number; utility: number } {
  const activeTasks = (caseData.tasks ?? []).filter(
    (t) => intervention.activeNodes.includes(t.id) && O_k.nodes.includes(t.id)
  );

  let successProb = 1.0;
  for (const t of activeTasks) {
    successProb *= 1.0 - t.pFail;
  }

  const g = activeTasks.length > 0 ? 10 * successProb : 0;

  let e = activeTasks.reduce((sum, t) => sum + t.cost, 0);
  let hasCheckpoint = false;
  for (const t of activeTasks) {
    const isCheckpoint = intervention.checkpoints?.includes(t.id) ?? t.isCheckpoint;
    if (isCheckpoint) {
      hasCheckpoint = true;
    }
  }
  if (hasCheckpoint) {
    e += 2;
  }

  let risk = 0;
  for (let i = 0; i < activeTasks.length; i++) {
    const t = activeTasks[i];
    if (t.pFail === 0) continue;

    let rollbackTargetIndex = -1;
    for (let j = 0; j < i; j++) {
      const activeTask = activeTasks[j];
      const isCheckpoint = intervention.checkpoints?.includes(activeTask.id) ?? activeTask.isCheckpoint;
      if (isCheckpoint) {
        rollbackTargetIndex = j;
      }
    }

    let rollbackCost = 0;
    const startIdx = rollbackTargetIndex + 1;
    for (let k = startIdx; k <= i; k++) {
      rollbackCost += activeTasks[k].cost;
    }

    risk += t.pFail * rollbackCost;
  }

  return { g, e, risk, utility: g - e - risk };
}

// 3. Resource System Utility Evaluation
function evaluateResourceSystem(
  caseData: CaseData,
  O_k: ObservableSubgraph,
  intervention: CaseIntervention
): { g: number; e: number; risk: number; utility: number } {
  const activeResources = (caseData.graph.nodes ?? []).filter(
    (n) => n.startsWith('r') && O_k.nodes.includes(n) && intervention.activeNodes.includes(n)
  );
  const activeProcesses = (caseData.graph.nodes ?? []).filter(
    (n) => n.startsWith('p') && O_k.nodes.includes(n) && intervention.activeNodes.includes(n)
  );

  const edgeCount = O_k.edges.filter(
    (edge) => intervention.activeEdges.includes(`${edge.from}->${edge.to}`)
  ).length;

  const capacitySum = activeResources.reduce(
    (sum, r) => sum + (caseData.capacities?.[r] ?? 1),
    0
  );
  const e = capacitySum + edgeCount;

  const baseBlocked = (caseData.graph.nodes ?? []).filter(
    (n) => n.startsWith('p') && !activeProcesses.includes(n)
  ).length;
  const rateLimiterBlock = intervention.hasRateLimiter ? 1 : 0;
  const blockedCount = Math.min(
    activeProcesses.length + baseBlocked,
    baseBlocked + rateLimiterBlock
  );
  const unblockedCount = Math.max(0, activeProcesses.length - blockedCount);
  const g = activeProcesses.length > 0 ? unblockedCount * 5 : 0;

  let totalOverload = 0;
  for (const r of activeResources) {
    const cap = caseData.capacities?.[r] ?? 1;
    let demand = caseData.demands?.[r] ?? 0;
    if (intervention.hasRateLimiter) {
      demand = Math.max(0, demand - 1);
    }
    const overload = Math.max(0, demand - cap);
    totalOverload += overload;
  }

  const crashProb = 1.0 - Math.exp(-0.5 * totalOverload);
  const risk = crashProb * 30;

  return { g, e, risk, utility: g - e - risk };
}

export function loadBatch005Cases(): CaseData[] {
  const cases: CaseData[] = [];

  const addSensitivity = (
    Df: boolean,
    Dr: boolean,
    Ds: boolean,
    Dc: boolean,
    Dm: boolean
  ): DecisionSensitivity => ({ Df, Dr, Ds, Dc, Dm });

  // ----------------------------------------------------
  // TRIPLET 1: DEP-001 (A), DEP-002 (B), DEP-003 (C)
  // Local structure: s->t, s->v1, v1->t, v1->v1_next.
  // Boundary node is v1.
  // Sensitivity Df = true.
  // ----------------------------------------------------
  const baseDep1 = (id: string, Pf: boolean, includeDecoy: boolean, hasIsolation: boolean): CaseData => {
    const graphNodes = ['s', 'v1', 'v1_next', 'v1_next_next', 't'];
    const graphEdges: GraphEdge[] = [
      { from: 's', to: 't' },
      { from: 's', to: 'v1' },
      { from: 'v1', to: 't' },
      { from: 'v1', to: 'v1_next' },
      { from: 'v1_next', to: 'v1_next_next' },
    ];

    if (includeDecoy) {
      graphNodes.push('decoy_v2');
      graphEdges.push({ from: 'v1_next_next', to: 'decoy_v2' });
      graphEdges.push({ from: 'decoy_v2', to: 't' });
    } else {
      graphEdges.push({ from: 'v1_next_next', to: 't' });
    }

    const caps: Record<string, CapabilitySignature> = {
      s: blankCapabilities(),
      v1: { Pf, Pr: false, Ps: false, Pc: false, Pm: false },
      v1_next: { Pf: id === 'DEP-003' ? true : false, Pr: false, Ps: false, Pc: false, Pm: false },
      v1_next_next: { Pf: id === 'DEP-003' ? true : false, Pr: false, Ps: false, Pc: false, Pm: false },
      t: blankCapabilities(),
    };
    if (includeDecoy) {
      caps['decoy_v2'] = blankCapabilities();
    }

    const candidates: Record<string, CaseIntervention> = {
      T0: {
        id: 'T0',
        sensitivity: addSensitivity(false, false, false, false, false),
        activeNodes: [...graphNodes],
        activeEdges: ['s->t', 's->v1', 'v1->t', 'v1_next->v1', 'v1_next->v1_next_next', 'v1_next_next->t', 'v1_next_next->decoy_v2', 'decoy_v2->t'],
      },
      T1: {
        id: 'T1',
        sensitivity: addSensitivity(true, false, false, false, false), // Df = true
        activeNodes: [...graphNodes],
        activeEdges: ['s->t', 's->v1', 'v1_next->v1', 'v1_next->v1_next_next', 'v1_next_next->t', 'v1_next_next->decoy_v2', 'decoy_v2->t'],
      },
    };

    const isCaseA = id === 'DEP-001';

    return {
      id,
      domain: 'DEP',
      focalElement: 's',
      kMax: 2,
      graph: { nodes: graphNodes, edges: graphEdges, capabilities: caps },
      candidates,
      failures: { v1: 0.01, v1_next: isCaseA ? 0.0 : 0.8, decoy_v2: isCaseA ? 0.0 : 0.8 },
      isolationNodes: hasIsolation ? ['v1_next_next'] : [],
    };
  };

  cases.push(baseDep1('DEP-001', false, false, false)); // Case A: Pf=false, stops at k=1
  cases.push(baseDep1('DEP-002', true, false, true));  // Case B: Pf=true, expands to k=2, resolved
  cases.push(baseDep1('DEP-003', true, true, false));  // Case C: Pf=true, open decoy at k=2, escalates

  // ----------------------------------------------------
  // TRIPLET 2: DEP-004 (A), DEP-005 (B), DEP-006 (C)
  // Sensitivity: Dr = true.
  // ----------------------------------------------------
  const baseDep2 = (id: string, Pr: boolean, includeDecoy: boolean, hasRecovery: boolean): CaseData => {
    const graphNodes = ['s', 'v3', 'v3_next', 'v3_next_next', 't'];
    const graphEdges: GraphEdge[] = [
      { from: 's', to: 't' },
      { from: 's', to: 'v3' },
      { from: 'v3', to: 't' },
      { from: 'v3', to: 'v3_next' },
      { from: 'v3_next', to: 'v3_next_next' },
    ];

    if (includeDecoy) {
      graphNodes.push('decoy_v4');
      graphEdges.push({ from: 'v3_next_next', to: 'decoy_v4' });
      graphEdges.push({ from: 'decoy_v4', to: 't' });
    } else {
      graphEdges.push({ from: 'v3_next_next', to: 't' });
    }

    const caps: Record<string, CapabilitySignature> = {
      s: blankCapabilities(),
      v3: { Pf: false, Pr, Ps: false, Pc: false, Pm: false },
      v3_next: { Pf: false, Pr: id === 'DEP-006' ? true : false, Ps: false, Pc: false, Pm: false },
      v3_next_next: { Pf: false, Pr: id === 'DEP-006' ? true : false, Ps: false, Pc: false, Pm: false },
      t: blankCapabilities(),
    };
    if (includeDecoy) {
      caps['decoy_v4'] = blankCapabilities();
    }

    const candidates: Record<string, CaseIntervention> = {
      T0: {
        id: 'T0',
        sensitivity: addSensitivity(false, false, false, false, false),
        activeNodes: [...graphNodes],
        activeEdges: ['s->t', 's->v3', 'v3->t', 'v3_next->v3', 'v3_next->v3_next_next', 'v3_next_next->t', 'v3_next_next->decoy_v4', 'decoy_v4->t'],
      },
      T1: {
        id: 'T1',
        sensitivity: addSensitivity(false, true, false, false, false), // Dr = true
        activeNodes: [...graphNodes],
        activeEdges: ['s->t', 's->v3', 'v3_next->v3', 'v3_next->v3_next_next', 'v3_next_next->t', 'v3_next_next->decoy_v4', 'decoy_v4->t'],
      },
    };

    const isCaseA = id === 'DEP-004';

    return {
      id,
      domain: 'DEP',
      focalElement: 's',
      kMax: 2,
      graph: { nodes: graphNodes, edges: graphEdges, capabilities: caps },
      candidates,
      failures: { v3: 0.01, v3_next: isCaseA ? 0.0 : 0.8, decoy_v4: isCaseA ? 0.0 : 0.8 },
      isolationNodes: [],
    };
  };

  cases.push(baseDep2('DEP-004', false, false, false)); // Case A: Pr=false, stops at k=1
  cases.push(baseDep2('DEP-005', true, false, true));  // Case B: Pr=true, expands to k=2
  cases.push(baseDep2('DEP-006', true, true, false));  // Case C: Pr=true, open decoy, escalates

  // ----------------------------------------------------
  // TRIPLET 3: WRK-001 (A), WRK-002 (B), WRK-003 (C)
  // Workflow: t1 -> t2 -> t2_next -> decoy_t3. Focal node is t1.
  // Boundary node t2.
  // Sensitivity Dm = true.
  // ----------------------------------------------------
  const baseWrk1 = (id: string, Pm: boolean, includeDecoy: boolean, isCheckpoint: boolean): CaseData => {
    const graphNodes = ['t1', 't2', 't2_next'];
    const graphEdges: GraphEdge[] = [
      { from: 't1', to: 't2' },
      { from: 't2', to: 't2_next' },
    ];
    if (includeDecoy) {
      graphNodes.push('decoy_t3');
      graphEdges.push({ from: 't2_next', to: 'decoy_t3' });
    }

    const caps: Record<string, CapabilitySignature> = {
      t1: blankCapabilities(),
      t2: { Pf: false, Pr: false, Ps: false, Pc: false, Pm },
      t2_next: { Pf: false, Pr: false, Ps: false, Pc: false, Pm: id === 'WRK-003' ? true : false },
    };
    if (includeDecoy) {
      caps['decoy_t3'] = { Pf: false, Pr: false, Ps: false, Pc: false, Pm: id === 'WRK-003' ? true : false };
    }

    const candidates: Record<string, CaseIntervention> = {
      T0: {
        id: 'T0',
        sensitivity: addSensitivity(false, false, false, false, false),
        activeNodes: [...graphNodes],
        activeEdges: ['t1->t2', 't2->t2_next', 't2_next->decoy_t3'],
        checkpoints: ['t2'], // T0 checkpoints at t2
      },
      T1: {
        id: 'T1',
        sensitivity: addSensitivity(false, false, false, false, true), // Dm = true
        activeNodes: [...graphNodes],
        activeEdges: ['t1->t2', 't2->t2_next', 't2_next->decoy_t3'],
        checkpoints: [], // T1 does not checkpoint
      },
    };

    const isCaseA = id === 'WRK-001';

    const tasks = [
      { id: 't1', cost: 1, pFail: 0.0, isCheckpoint: false },
      { id: 't2', cost: 5, pFail: 0.0, isCheckpoint: false },
      { id: 't2_next', cost: 5, pFail: isCaseA ? 0.0 : 0.8, isCheckpoint: false },
      { id: 'decoy_t3', cost: 5, pFail: isCaseA ? 0.0 : 0.8, isCheckpoint: false },
    ];

    return {
      id,
      domain: 'WRK',
      focalElement: 't1',
      kMax: 2,
      graph: { nodes: graphNodes, edges: graphEdges, capabilities: caps },
      candidates,
      failures: {},
      isolationNodes: [],
      tasks,
    };
  };

  cases.push(baseWrk1('WRK-001', false, false, false)); // Case A: Pm=false, stops at k=1
  cases.push(baseWrk1('WRK-002', true, false, true));  // Case B: Pm=true, expands to k=2
  cases.push(baseWrk1('WRK-003', true, true, false));  // Case C: Pm=true, open decoy, escalates

  // ----------------------------------------------------
  // TRIPLET 4: WRK-004 (A), WRK-005 (B), WRK-006 (C)
  // Sensitivity: Ds = true.
  // ----------------------------------------------------
  const baseWrk2 = (id: string, Ps: boolean, includeDecoy: boolean, isCheckpoint: boolean): CaseData => {
    const graphNodes = ['t1', 't2', 't2_next'];
    const graphEdges: GraphEdge[] = [
      { from: 't1', to: 't2' },
      { from: 't2', to: 't2_next' },
    ];
    if (includeDecoy) {
      graphNodes.push('decoy_t4');
      graphEdges.push({ from: 't2_next', to: 'decoy_t4' });
    }

    const caps: Record<string, CapabilitySignature> = {
      t1: blankCapabilities(),
      t2: { Pf: false, Pr: false, Ps, Pc: false, Pm: false },
      t2_next: { Pf: false, Pr: false, Ps: id === 'WRK-006' ? true : false, Pc: false, Pm: false },
    };
    if (includeDecoy) {
      caps['decoy_t4'] = { Pf: false, Pr: false, Ps: id === 'WRK-006' ? true : false, Pc: false, Pm: false };
    }

    const candidates: Record<string, CaseIntervention> = {
      T0: {
        id: 'T0',
        sensitivity: addSensitivity(false, false, false, false, false),
        activeNodes: [...graphNodes],
        activeEdges: ['t1->t2', 't2->t2_next', 't2_next->decoy_t4'],
        checkpoints: ['t2'], // T0 checkpoints at t2
      },
      T1: {
        id: 'T1',
        sensitivity: addSensitivity(false, false, true, false, false), // Ds = true
        activeNodes: [...graphNodes],
        activeEdges: ['t1->t2', 't2->t2_next', 't2_next->decoy_t4'],
        checkpoints: [], // T1 does not checkpoint
      },
    };

    const isCaseA = id === 'WRK-004';

    const tasks = [
      { id: 't1', cost: 2, pFail: 0.0, isCheckpoint: false },
      { id: 't2', cost: 5, pFail: 0.0, isCheckpoint: false },
      { id: 't2_next', cost: 5, pFail: isCaseA ? 0.0 : 0.8, isCheckpoint: false },
      { id: 'decoy_t4', cost: 5, pFail: isCaseA ? 0.0 : 0.8, isCheckpoint: false },
    ];

    return {
      id,
      domain: 'WRK',
      focalElement: 't1',
      kMax: 2,
      graph: { nodes: graphNodes, edges: graphEdges, capabilities: caps },
      candidates,
      failures: {},
      isolationNodes: [],
      tasks,
    };
  };

  cases.push(baseWrk2('WRK-004', false, false, false)); // Case A: Ps=false, stops at k=1
  cases.push(baseWrk2('WRK-005', true, false, true));  // Case B: Ps=true, expands to k=2
  cases.push(baseWrk2('WRK-006', true, true, false));  // Case C: Ps=true, open decoy, escalates

  // ----------------------------------------------------
  // TRIPLET 5: RES-001 (A), RES-002 (B), RES-003 (C)
  // Resource Contention Graph: p1 -> r1 -> decoy_p2. Focal element is p1.
  // Boundary node r1.
  // Sensitivity Dc = true.
  // ----------------------------------------------------
  const baseRes1 = (id: string, Pc: boolean, includeDecoy: boolean, capacity: number): CaseData => {
    const graphNodes = ['p1', 'r1'];
    const graphEdges: GraphEdge[] = [
      { from: 'p1', to: 'r1' },
    ];
    if (includeDecoy) {
      graphNodes.push('decoy_p2');
      graphEdges.push({ from: 'decoy_p2', to: 'r1' });
      graphNodes.push('decoy_r2');
      graphEdges.push({ from: 'decoy_p2', to: 'decoy_r2' });
    }

    const caps: Record<string, CapabilitySignature> = {
      p1: blankCapabilities(),
      r1: { Pf: false, Pr: false, Ps: false, Pc, Pm: false },
    };
    if (includeDecoy) {
      caps['decoy_p2'] = { Pf: false, Pr: false, Ps: false, Pc: id === 'RES-003' ? true : false, Pm: false };
      caps['decoy_r2'] = blankCapabilities();
    }

    const candidates: Record<string, CaseIntervention> = {
      T0: {
        id: 'T0',
        sensitivity: addSensitivity(false, false, false, false, false),
        activeNodes: [...graphNodes],
        activeEdges: ['p1->r1', 'decoy_p2->r1', 'decoy_p2->decoy_r2'],
        hasRateLimiter: false,
      },
      T1: {
        id: 'T1',
        sensitivity: addSensitivity(false, false, false, true, false), // Dc = true
        activeNodes: [...graphNodes],
        activeEdges: ['p1->r1', 'decoy_p2->r1', 'decoy_p2->decoy_r2'],
        hasRateLimiter: true,
      },
    };

    return {
      id,
      domain: 'RES',
      focalElement: 'p1',
      kMax: 2,
      graph: { nodes: graphNodes, edges: graphEdges, capabilities: caps },
      candidates,
      failures: {},
      isolationNodes: [],
      capacities: { r1: capacity, decoy_r2: 1 },
      demands: { r1: id === 'RES-001' ? 1 : 3, decoy_r2: 1 },
    };
  };

  cases.push(baseRes1('RES-001', false, false, 2)); // Case A: Pc=false, stops at k=1
  cases.push(baseRes1('RES-002', true, false, 1));  // Case B: Pc=true, expands to k=2
  cases.push(baseRes1('RES-003', true, true, 1));  // Case C: Pc=true, open decoy, escalates

  return cases;
}
