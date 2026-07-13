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
