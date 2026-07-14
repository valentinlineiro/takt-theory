import { loadBatch005Cases } from '../batch-005/cases.js';
import { applySparseFn, getCriticalNodeSpec } from '../batch-008/sparseFn.js';
import { evaluateOne } from './eval.js';
import { oracleImpact } from './oracleImpact.js';
import type { ScoreRow } from './eval.js';

const INCIDENCES = [0.00, 0.05, 0.10, 0.15];
const CASE_IDS = ['WRK-002', 'WRK-003', 'DEP-005'];
const REPS = 5;

export function runBatch009(): ScoreRow[] {
  const all: ScoreRow[] = [];
  const cases = loadBatch005Cases();

  const oracleImpacts: Record<string, Record<string, number>> = {};
  for (const caseId of CASE_IDS) {
    const orig = cases.find(c => c.id === caseId)!;
    oracleImpacts[caseId] = oracleImpact(orig);
  }

  for (const caseId of CASE_IDS) {
    const orig = cases.find(c => c.id === caseId)!;
    const spec = getCriticalNodeSpec(caseId)!;
    const impacts = oracleImpacts[caseId];

    for (const incidence of INCIDENCES) {
      for (let rep = 1; rep <= REPS; rep++) {
        const seed = `${caseId}+${incidence}+${rep}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
        const cs = applySparseFn(orig, spec, incidence, seed);
        const rows = evaluateOne(orig, cs, incidence, rep, impacts);
        all.push(...rows);
      }
    }
  }

  return all;
}

export function aggregate(results: ScoreRow[]): Record<string, any> {
  const groups: Record<string, ScoreRow[]> = {};
  for (const r of results) {
    if (!groups[r.policyId]) groups[r.policyId] = [];
    groups[r.policyId].push(r);
  }
  const out: Record<string, any> = {};
  for (const [pid, rows] of Object.entries(groups)) {
    const n = rows.length;
    out[pid] = {
      n,
      mismatchRate: rows.filter(r => r.mismatch).length / n,
      avgRegret: rows.reduce((s, r) => s + r.regret, 0) / n,
      avgBlindnessGap: rows.reduce((s, r) => s + r.blindnessGap, 0) / n,
      avgAlphaError: rows.reduce((s, r) => s + r.alphaError, 0) / n,
      probeRate: rows.filter(r => r.didProbe).length / n,
      avgKActual: rows.reduce((s, r) => s + r.kActual, 0) / n,
      avgActionCost: rows.reduce((s, r) => s + r.evsiActionCost, 0) / n,
      avgAlphaEst: rows.reduce((s, r) => s + r.alphaEstimated, 0) / n,
    };
  }
  return out;
}
