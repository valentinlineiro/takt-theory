import { loadBatch005Cases } from '../batch-005/cases.js';
import { applyAdversaryBatch015 } from './adversary.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';
import { captureOmegaState, computeDeltaOmega } from '../batch-010/omega.js';
import { computeX1, computeX2 } from '../batch-014/run.js';
import type { OmegaSnapshot, DeltaOmegaSnapshot } from '../batch-010/omega.js';

export interface Batch015ResultRow {
  caseId: string;
  incidence: number;
  rep: number;
  cleanStates: OmegaSnapshot[];
  corruptStates: OmegaSnapshot[];
  cleanDeltas: DeltaOmegaSnapshot[];
  corruptDeltas: DeltaOmegaSnapshot[];
  cleanX1: number[];
  cleanX2: number[];
  corruptX1: number[];
  corruptX2: number[];
  cleanD1: number[];
  cleanD2: number[];
  corruptD1: number[];
  corruptD2: number[];
}

const INCIDENCES = [0.00, 0.05, 0.10, 0.15];
const CASE_IDS = ['WRK-002', 'WRK-003', 'DEP-005'];
const REPS = 5;

export function runBatch015(): Batch015ResultRow[] {
  const all: Batch015ResultRow[] = [];
  const cases = loadBatch005Cases();

  for (const caseId of CASE_IDS) {
    const orig = cases.find(c => c.id === caseId)!;

    const D_k = { Df: false, Dr: false, Ds: false, Dc: false, Dm: false };
    for (const c of Object.values(orig.candidates)) {
      const s = c.sensitivity;
      if (s.Df) D_k.Df = true;
      if (s.Dr) D_k.Dr = true;
      if (s.Ds) D_k.Ds = true;
      if (s.Dc) D_k.Dc = true;
      if (s.Dm) D_k.Dm = true;
    }

    for (const incidence of INCIDENCES) {
      for (let rep = 1; rep <= REPS; rep++) {
        const cs = applyAdversaryBatch015(orig, incidence);

        const cleanStates: OmegaSnapshot[] = [];
        const corruptStates: OmegaSnapshot[] = [];
        const cleanX1: number[] = [];
        const cleanX2: number[] = [];
        const corruptX1: number[] = [];
        const corruptX2: number[] = [];

        for (let k = 1; k <= orig.kMax; k++) {
          cleanStates.push(captureOmegaState(orig, orig.graph.capabilities, k, D_k));
          corruptStates.push(captureOmegaState(cs, cs.graph.capabilities, k, D_k));

          const subClean = extractObservableSubgraph(orig.graph, orig.focalElement, k);
          const subCorrupt = extractObservableSubgraph(cs.graph, cs.focalElement, k);

          cleanX1.push(computeX1(subClean, orig.failures));
          cleanX2.push(computeX2(subClean, orig.failures));

          corruptX1.push(computeX1(subCorrupt, cs.failures));
          corruptX2.push(computeX2(subCorrupt, cs.failures));
        }

        const cleanDeltas: DeltaOmegaSnapshot[] = [];
        const corruptDeltas: DeltaOmegaSnapshot[] = [];
        const cleanD1: number[] = [];
        const cleanD2: number[] = [];
        const corruptD1: number[] = [];
        const corruptD2: number[] = [];

        for (let i = 0; i < cleanStates.length - 1; i++) {
          cleanDeltas.push(computeDeltaOmega(cleanStates[i], cleanStates[i + 1]));
          cleanD1.push(Math.abs(cleanX1[i + 1] - cleanX1[i]));
          cleanD2.push(Math.abs(cleanX2[i + 1] - cleanX2[i]));
        }

        for (let i = 0; i < corruptStates.length - 1; i++) {
          corruptDeltas.push(computeDeltaOmega(corruptStates[i], corruptStates[i + 1]));
          corruptD1.push(Math.abs(corruptX1[i + 1] - corruptX1[i]));
          corruptD2.push(Math.abs(corruptX2[i + 1] - corruptX2[i]));
        }

        all.push({
          caseId,
          incidence,
          rep,
          cleanStates,
          corruptStates,
          cleanDeltas,
          corruptDeltas,
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
