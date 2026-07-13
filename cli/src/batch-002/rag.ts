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
