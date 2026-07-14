import { solveDependencyGraph, DepCase } from './dependency.js';
import { solveWorkflow, WrkCase } from './workflow.js';
import { solveResourceSystem, ResCase } from './resource.js';

export interface CaseEvalResult {
  caseId: string;
  type: 'DEP' | 'WRK' | 'RES';
  candidates: Record<string, { g: number; e: number; risk: number; utility: number }>;
  optimalCandidates: string[];
  groundTruthFrictions: Record<string, 'Accidental' | 'Necessary' | 'Stabilizing'>;
}

const depCasesData: Record<string, {
  caseData: DepCase;
  candidateActiveEdges: Record<string, string[]>;
  groundTruthFrictions: Record<string, 'Accidental' | 'Necessary' | 'Stabilizing'>;
}> = {
  'DEP-001': {
    caseData: {
      id: 'DEP-001',
      nodes: ['s', 'v1', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.1, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' },
        { id: 'e3', from: 'v1', to: 't' } // duplicate bypass
      ]
    },
    candidateActiveEdges: {
      T0: ['e1', 'e2', 'e3'],
      T1: ['e1', 'e2']
    },
    groundTruthFrictions: { e3: 'Accidental' }
  },
  'DEP-002': {
    caseData: {
      id: 'DEP-002',
      nodes: ['s', 'v1', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.1, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' }
      ]
    },
    candidateActiveEdges: {
      T0: ['e1', 'e2'],
      T1: ['e1']
    },
    groundTruthFrictions: { e2: 'Necessary' }
  },
  'DEP-003': {
    caseData: {
      id: 'DEP-003',
      nodes: ['s', 'v1', 'v2', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.5, v2: 0, t: 0 },
      isolationNodes: ['v2'],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 'v2' },
        { id: 'e3', from: 'v2', to: 't' },
        { id: 'e4', from: 'v1', to: 't' } // bypass
      ]
    },
    candidateActiveEdges: {
      T0: ['e1', 'e2', 'e3'],
      T1: ['e1', 'e4']
    },
    groundTruthFrictions: { v2: 'Stabilizing' }
  },
  'DEP-004': {
    caseData: {
      id: 'DEP-004',
      nodes: ['s', 'v1', 'v2', 'v3', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.1, v2: 0.5, v3: 0, t: 0 },
      isolationNodes: ['v3'],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' },
        { id: 'e3', from: 'v1', to: 't' }, // redundant
        { id: 'e4', from: 's', to: 'v2' },
        { id: 'e5', from: 'v2', to: 'v3' },
        { id: 'e6', from: 'v3', to: 't' },
        { id: 'e7', from: 'v2', to: 't' } // bypass
      ]
    },
    candidateActiveEdges: {
      T0: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
      T1: ['e1', 'e2', 'e4', 'e5', 'e6'], // remove redundant e3
      T2: ['e1', 'e2', 'e3', 'e4', 'e7'] // remove isolation node v3
    },
    groundTruthFrictions: { e3: 'Accidental', v3: 'Stabilizing' }
  },
  'DEP-005': {
    caseData: {
      id: 'DEP-005',
      nodes: ['s', 'v1', 't'],
      source: 's',
      target: 't',
      failures: { s: 0, v1: 0.5, t: 0 },
      isolationNodes: [],
      edges: [
        { id: 'e1', from: 's', to: 'v1' },
        { id: 'e2', from: 'v1', to: 't' },
        { id: 'e_direct', from: 's', to: 't' }
      ]
    },
    candidateActiveEdges: {
      T0: ['e1', 'e2', 'e_direct'],
      T1: ['e1', 'e2']
    },
    groundTruthFrictions: { e_direct: 'Stabilizing' }
  }
};

const wrkCasesData: Record<string, {
  caseData: WrkCase;
  candidateActiveTasks: Record<string, string[]>;
  groundTruthFrictions: Record<string, 'Accidental' | 'Necessary' | 'Stabilizing'>;
}> = {
  'WRK-001': {
    caseData: {
      id: 'WRK-001',
      tasks: [
        { id: 't1', cost: 2, pFail: 0.1, isCheckpoint: false },
        { id: 't2', cost: 1, pFail: 0.0, isCheckpoint: false }, // duplicate logging task
        { id: 't3', cost: 3, pFail: 0.0, isCheckpoint: true }
      ]
    },
    candidateActiveTasks: {
      T0: ['t1', 't2', 't3'],
      T1: ['t1', 't3']
    },
    groundTruthFrictions: { t2: 'Accidental' }
  },
  'WRK-002': {
    caseData: {
      id: 'WRK-002',
      tasks: [
        { id: 't0', cost: 15, pFail: 0.0, isCheckpoint: false },
        { id: 't1', cost: 1, pFail: 0.05, isCheckpoint: true }, // validation
        { id: 't2', cost: 10, pFail: 0.2, isCheckpoint: false }
      ]
    },
    candidateActiveTasks: {
      T0: ['t0', 't1', 't2'],
      T1: ['t0', 't2']
    },
    groundTruthFrictions: { t1: 'Necessary' }
  },
  'WRK-003': {
    caseData: {
      id: 'WRK-003',
      tasks: [
        { id: 't0', cost: 10, pFail: 0.0, isCheckpoint: false },
        { id: 't1', cost: 2, pFail: 0.0, isCheckpoint: true }, // checkpoint
        { id: 't2', cost: 8, pFail: 0.3, isCheckpoint: false }
      ]
    },
    candidateActiveTasks: {
      T0: ['t0', 't1', 't2'],
      T1: ['t0', 't2']
    },
    groundTruthFrictions: { t1: 'Stabilizing' }
  },
  'WRK-004': {
    caseData: {
      id: 'WRK-004',
      tasks: [
        { id: 't0', cost: 5, pFail: 0.0, isCheckpoint: false },
        { id: 't1', cost: 1, pFail: 0.0, isCheckpoint: true }, // early checkpoint (suboptimal)
        { id: 'tA', cost: 5, pFail: 0.0, isCheckpoint: false },
        { id: 't2', cost: 1, pFail: 0.0, isCheckpoint: true }, // late checkpoint (optimal)
        { id: 't3', cost: 10, pFail: 0.3, isCheckpoint: false }
      ]
    },
    candidateActiveTasks: {
      T0: ['t0', 'tA', 't3'],
      T1: ['t0', 't1', 'tA', 't3'],
      T2: ['t0', 'tA', 't2', 't3']
    },
    groundTruthFrictions: { t1: 'Accidental', t2: 'Stabilizing' }
  },
  'WRK-005': {
    caseData: {
      id: 'WRK-005',
      tasks: [
        { id: 't0', cost: 300, pFail: 0.0, isCheckpoint: false },
        { id: 't1', cost: 2, pFail: 0.0, isCheckpoint: true }, // checkpoint on low-failure task
        { id: 't2', cost: 10, pFail: 0.01, isCheckpoint: false }
      ]
    },
    candidateActiveTasks: {
      T0: ['t0', 't1', 't2'],
      T1: ['t0', 't2']
    },
    groundTruthFrictions: { t1: 'Stabilizing' }
  }
};

const resCasesData: Record<string, {
  caseData: ResCase;
  candidateConfig: Record<string, { activeProcesses: string[]; activeResources: string[]; hasRateLimiter: boolean }>;
  groundTruthFrictions: Record<string, 'Accidental' | 'Necessary' | 'Stabilizing'>;
}> = {
  'RES-001': {
    caseData: {
      id: 'RES-001',
      processes: ['p1'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 1 },
      requests: [{ from: 'p1', to: 'r1' }],
      allocations: []
    },
    candidateConfig: {
      T0: { activeProcesses: ['p1'], activeResources: ['r1'], hasRateLimiter: false },
      T1: { activeProcesses: ['p1'], activeResources: [], hasRateLimiter: false } // remove redundant lock
    },
    groundTruthFrictions: { r1: 'Accidental' }
  },
  'RES-002': {
    caseData: {
      id: 'RES-002',
      processes: ['p1', 'p2'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 2 },
      requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
      allocations: []
    },
    candidateConfig: {
      T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true }, // mutex active
      T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false } // mutex removed
    },
    groundTruthFrictions: { r1: 'Necessary' }
  },
  'RES-003': {
    caseData: {
      id: 'RES-003',
      processes: ['p1', 'p2'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 3 },
      requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
      allocations: []
    },
    candidateConfig: {
      T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true }, // rate limiter active
      T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false } // rate limiter removed
    },
    groundTruthFrictions: { r1: 'Stabilizing' }
  },
  'RES-004': {
    caseData: {
      id: 'RES-004',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      capacities: { r1: 1, r2: 2 },
      demands: { r1: 2, r2: 2 },
      requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
      allocations: []
    },
    candidateConfig: {
      T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false }, // base (no mitigation)
      T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true }, // add rate limiter
      T2: { activeProcesses: ['p1', 'p2'], activeResources: ['r2'], hasRateLimiter: false } // duplicate capacity
    },
    groundTruthFrictions: { r1: 'Stabilizing', r2: 'Stabilizing' }
  },
  'RES-005': {
    caseData: {
      id: 'RES-005',
      processes: ['p1', 'p2'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 2 },
      requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
      allocations: []
    },
    candidateConfig: {
      T0: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: true }, // rate limiter active
      T1: { activeProcesses: ['p1', 'p2'], activeResources: ['r1'], hasRateLimiter: false } // rate limiter removed
    },
    groundTruthFrictions: { r1: 'Stabilizing' }
  }
};

export function executeBatch003(): Record<string, CaseEvalResult> {
  const results: Record<string, CaseEvalResult> = {};

  // 1. Process Dependency Graph Cases
  for (const [caseId, data] of Object.entries(depCasesData)) {
    const candidates: Record<string, { g: number; e: number; risk: number; utility: number }> = {};
    let maxUtil = -Infinity;

    for (const [candId, activeEdgeIds] of Object.entries(data.candidateActiveEdges)) {
      const solverResult = solveDependencyGraph(data.caseData, activeEdgeIds);
      const utility = solverResult.g - solverResult.e - solverResult.risk;
      candidates[candId] = { ...solverResult, utility };
      if (utility > maxUtil) {
        maxUtil = utility;
      }
    }

    const optimalCandidates = Object.keys(candidates).filter(
      candId => Math.abs(candidates[candId].utility - maxUtil) < 1e-9
    );

    results[caseId] = {
      caseId,
      type: 'DEP',
      candidates,
      optimalCandidates,
      groundTruthFrictions: data.groundTruthFrictions
    };
  }

  // 2. Process Workflow Cases
  for (const [caseId, data] of Object.entries(wrkCasesData)) {
    const candidates: Record<string, { g: number; e: number; risk: number; utility: number }> = {};
    let maxUtil = -Infinity;

    for (const [candId, activeTaskIds] of Object.entries(data.candidateActiveTasks)) {
      const solverResult = solveWorkflow(data.caseData, activeTaskIds);
      const utility = solverResult.g - solverResult.e - solverResult.risk;
      candidates[candId] = { ...solverResult, utility };
      if (utility > maxUtil) {
        maxUtil = utility;
      }
    }

    const optimalCandidates = Object.keys(candidates).filter(
      candId => Math.abs(candidates[candId].utility - maxUtil) < 1e-9
    );

    results[caseId] = {
      caseId,
      type: 'WRK',
      candidates,
      optimalCandidates,
      groundTruthFrictions: data.groundTruthFrictions
    };
  }

  // 3. Process Resource System Cases
  for (const [caseId, data] of Object.entries(resCasesData)) {
    const candidates: Record<string, { g: number; e: number; risk: number; utility: number }> = {};
    let maxUtil = -Infinity;

    for (const [candId, config] of Object.entries(data.candidateConfig)) {
      const solverResult = solveResourceSystem(
        data.caseData,
        config.activeProcesses,
        config.activeResources,
        config.hasRateLimiter
      );
      const utility = solverResult.g - solverResult.e - solverResult.risk;
      candidates[candId] = { ...solverResult, utility };
      if (utility > maxUtil) {
        maxUtil = utility;
      }
    }

    const optimalCandidates = Object.keys(candidates).filter(
      candId => Math.abs(candidates[candId].utility - maxUtil) < 1e-9
    );

    results[caseId] = {
      caseId,
      type: 'RES',
      candidates,
      optimalCandidates,
      groundTruthFrictions: data.groundTruthFrictions
    };
  }

  return results;
}
