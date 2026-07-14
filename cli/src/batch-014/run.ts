import { loadBatch005Cases } from '../batch-005/cases.js';
import { applyAdversaryBatch013 } from '../batch-013/adversary.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';
import type { ObservableSubgraph } from '../batch-005/estimator.js';

export interface Batch014ResultRow {
  caseId: string;
  incidence: number;
  rep: number;
  cleanX1: number[]; // X1 at each k
  cleanX2: number[]; // X2 at each k
  corruptX1: number[];
  corruptX2: number[];
  cleanD1: number[]; // Delta X1 between k -> k+1
  cleanD2: number[]; // Delta X2 between k -> k+1
  corruptD1: number[];
  corruptD2: number[];
}

const INCIDENCES = [0.00, 0.05, 0.10, 0.15];
const CASE_IDS = ['WRK-002', 'WRK-003', 'DEP-005'];
const REPS = 5;

export function computeX1(obsSub: ObservableSubgraph, failures: Record<string, number>): number {
  let sum = 0;
  for (const node of obsSub.nodes) {
    const hasPr = obsSub.capabilities[node]?.Pr === true;
    if (hasPr) {
      sum += failures[node] ?? 0;
    }
  }
  return sum;
}

export function computeX2(obsSub: ObservableSubgraph, failures: Record<string, number>): number {
  let sum = 0;
  for (const node of obsSub.nodes) {
    sum += failures[node] ?? 0;
  }
  return sum;
}

export function runBatch014(): Batch014ResultRow[] {
  const all: Batch014ResultRow[] = [];
  const cases = loadBatch005Cases();

  for (const caseId of CASE_IDS) {
    const orig = cases.find(c => c.id === caseId)!;

    for (const incidence of INCIDENCES) {
      for (let rep = 1; rep <= REPS; rep++) {
        // Reuse adversary configuration #187 under corruption
        const cs = applyAdversaryBatch013(orig, incidence);

        const cleanX1: number[] = [];
        const cleanX2: number[] = [];
        const corruptX1: number[] = [];
        const corruptX2: number[] = [];

        for (let k = 1; k <= orig.kMax; k++) {
          const subClean = extractObservableSubgraph(orig.graph, orig.focalElement, k);
          const subCorrupt = extractObservableSubgraph(cs.graph, cs.focalElement, k);

          cleanX1.push(computeX1(subClean, orig.failures));
          cleanX2.push(computeX2(subClean, orig.failures));

          corruptX1.push(computeX1(subCorrupt, cs.failures));
          corruptX2.push(computeX2(subCorrupt, cs.failures));
        }

        // Compute deltas k -> k+1
        const cleanD1: number[] = [];
        const cleanD2: number[] = [];
        const corruptD1: number[] = [];
        const corruptD2: number[] = [];

        for (let i = 0; i < cleanX1.length - 1; i++) {
          cleanD1.push(Math.abs(cleanX1[i + 1] - cleanX1[i]));
          cleanD2.push(Math.abs(cleanX2[i + 1] - cleanX2[i]));
        }

        for (let i = 0; i < corruptX1.length - 1; i++) {
          corruptD1.push(Math.abs(corruptX1[i + 1] - corruptX1[i]));
          corruptD2.push(Math.abs(corruptX2[i + 1] - corruptX2[i]));
        }

        all.push({
          caseId,
          incidence,
          rep,
          cleanX1,
          cleanX2,
          corruptX1,
          corruptX2,
          cleanD1,
          cleanD2,
          corruptD1,
          corruptD2,
        });
      }
    }
  }

  return all;
}
