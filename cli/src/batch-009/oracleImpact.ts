import { CaseData } from '../batch-005/cases.js';
import { computeDecisionSensitivity } from '../batch-005/estimator.js';
import type { CapabilitySignature } from '../batch-005/estimator.js';

const ALL_DIMS: (keyof CapabilitySignature)[] = ['Pf', 'Pr', 'Ps', 'Pc', 'Pm'];
const DIM_TO_DK: Record<string, string> = { Pf: 'Df', Pr: 'Dr', Ps: 'Ds', Pc: 'Dc', Pm: 'Dm' };

interface D_k {
  Df: boolean; Dr: boolean; Ds: boolean; Dc: boolean; Dm: boolean;
}

function computeD_k(cd: CaseData): D_k {
  const d: D_k = { Df: false, Dr: false, Ds: false, Dc: false, Dm: false };
  for (const c of Object.values(cd.candidates)) {
    const s = c.sensitivity;
    if (s.Df) d.Df = true;
    if (s.Dr) d.Dr = true;
    if (s.Ds) d.Ds = true;
    if (s.Dc) d.Dc = true;
    if (s.Dm) d.Dm = true;
  }
  return d;
}

export function oracleImpact(caseData: CaseData): Record<string, number> {
  const D_k = computeD_k(caseData);
  const result: Record<string, number> = {};
  for (const [node, caps] of Object.entries(caseData.graph.capabilities)) {
    let impact = 0;
    for (const dim of ALL_DIMS) {
      const dkKey = DIM_TO_DK[dim];
      if (caps[dim] && D_k[dkKey as keyof D_k]) impact++;
    }
    result[node] = impact;
  }
  return result;
}

export function weightedAlpha(boundaryRhos: Record<string, number>, oracleImpacts: Record<string, number>): number {
  let numer = 0;
  let denom = 0;
  for (const [node, rho] of Object.entries(boundaryRhos)) {
    const impact = oracleImpacts[node] ?? 0;
    numer += rho * impact;
    denom += impact;
  }
  if (denom === 0) return 1;
  return 1 - numer / denom;
}
