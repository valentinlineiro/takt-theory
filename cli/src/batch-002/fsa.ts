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
