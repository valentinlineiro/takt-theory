import { loadBatch005Cases } from '../batch-005/cases.js';
import { getCriticalNodeSpec, applySparseFn } from '../batch-008/sparseFn.js';
import { captureOmegaState, computeDeltaOmega } from './omega.js';
import type { OmegaSnapshot, DeltaOmegaSnapshot } from './omega.js';

export interface Batch010ResultRow {
  caseId: string;
  incidence: number;
  rep: number;
  cleanStates: OmegaSnapshot[];
  corruptStates: OmegaSnapshot[];
  cleanDeltas: DeltaOmegaSnapshot[];
  corruptDeltas: DeltaOmegaSnapshot[];
}

const INCIDENCES = [0.00, 0.05, 0.10, 0.15];
const CASE_IDS = ['WRK-002', 'WRK-003', 'DEP-005'];
const REPS = 5;

export function runBatch010(): Batch010ResultRow[] {
  const all: Batch010ResultRow[] = [];
  const cases = loadBatch005Cases();

  for (const caseId of CASE_IDS) {
    const orig = cases.find(c => c.id === caseId)!;
    const spec = getCriticalNodeSpec(caseId)!;

    // Determine D_k
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
        const seed = `${caseId}:${incidence}:${rep}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
        const cs = applySparseFn(orig, spec, incidence, seed);

        // Run clean states k = 1..kMax
        const cleanStates: OmegaSnapshot[] = [];
        for (let k = 1; k <= orig.kMax; k++) {
          cleanStates.push(captureOmegaState(orig, orig.graph.capabilities, k, D_k));
        }

        // Run corrupt states k = 1..kMax
        const corruptStates: OmegaSnapshot[] = [];
        for (let k = 1; k <= orig.kMax; k++) {
          corruptStates.push(captureOmegaState(orig, cs.obsCaps, k, D_k));
        }

        // Compute deltas k -> k+1
        const cleanDeltas: DeltaOmegaSnapshot[] = [];
        for (let i = 0; i < cleanStates.length - 1; i++) {
          cleanDeltas.push(computeDeltaOmega(cleanStates[i], cleanStates[i + 1]));
        }

        const corruptDeltas: DeltaOmegaSnapshot[] = [];
        for (let i = 0; i < corruptStates.length - 1; i++) {
          corruptDeltas.push(computeDeltaOmega(corruptStates[i], corruptStates[i + 1]));
        }

        all.push({
          caseId,
          incidence,
          rep,
          cleanStates,
          corruptStates,
          cleanDeltas,
          corruptDeltas,
        });
      }
    }
  }

  return all;
}
