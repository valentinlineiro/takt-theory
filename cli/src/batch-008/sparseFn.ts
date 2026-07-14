import { CaseData } from '../batch-005/cases.js';
import { extractObservableSubgraph, computeDecisionRelevantUncertainty } from '../batch-005/estimator.js';
import type { CapabilitySignature, DecisionSensitivity } from '../batch-005/estimator.js';

export interface CriticalNodeSpec {
  caseId: string;
  node: string;
  dim: keyof CapabilitySignature;
}

export interface CorruptionState {
  obsCaps: Record<string, CapabilitySignature>;
  boundaryRhos: Record<string, number>;
  criticalNode: string;
  corruptedDim: keyof CapabilitySignature;
}

const ALL_DIMS: (keyof CapabilitySignature)[] = ['Pf', 'Pr', 'Ps', 'Pc', 'Pm'];

export function getCriticalNodeSpec(caseId: string): CriticalNodeSpec | null {
  const m: Record<string, CriticalNodeSpec> = {
    'WRK-002': { caseId: 'WRK-002', node: 't2', dim: 'Pm' },
    'WRK-003': { caseId: 'WRK-003', node: 't2', dim: 'Pm' },
    'DEP-005': { caseId: 'DEP-005', node: 'v3', dim: 'Pr' },
  };
  return m[caseId] ?? null;
}

function cloneCaps(caps: Record<string, CapabilitySignature>): Record<string, CapabilitySignature> {
  const r: Record<string, CapabilitySignature> = {};
  for (const [k, v] of Object.entries(caps)) r[k] = { ...v };
  return r;
}

function lcg(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

export function applySparseFn(
  orig: CaseData,
  spec: CriticalNodeSpec,
  incidence: number,
  repSeed: number,
): CorruptionState {
  const obsCaps = cloneCaps(orig.graph.capabilities);
  const rand = lcg(repSeed);
  const { node: cNode, dim: cDim } = spec;

  obsCaps[cNode] = { ...obsCaps[cNode], [cDim]: false };

  for (const n of orig.graph.nodes) {
    if (n === cNode) continue;
    if (rand() < incidence) {
      const rd = ALL_DIMS[Math.floor(rand() * ALL_DIMS.length)];
      obsCaps[n] = { ...obsCaps[n], [rd]: false };
    }
  }

  const boundaryRhos: Record<string, number> = {};
  const D_k: DecisionSensitivity = { Df: false, Dr: false, Ds: false, Dc: false, Dm: false };
  for (const c of Object.values(orig.candidates)) {
    const s = c.sensitivity;
    if (s.Df) D_k.Df = true;
    if (s.Dr) D_k.Dr = true;
    if (s.Ds) D_k.Ds = true;
    if (s.Dc) D_k.Dc = true;
    if (s.Dm) D_k.Dm = true;
  }

  for (let k = 1; k <= orig.kMax; k++) {
    const O_k = extractObservableSubgraph(orig.graph, orig.focalElement, k);

    const localDegs: Record<string, number> = {};
    for (const n of O_k.nodes) localDegs[n] = 0;
    for (const e of O_k.edges) {
      if (localDegs[e.from] !== undefined) localDegs[e.from]++;
      if (localDegs[e.to] !== undefined) localDegs[e.to]++;
    }

    for (const v of O_k.nodes) {
      if (boundaryRhos[v] !== undefined) continue;
      const gd = O_k.globalDegrees[v];
      const ld = localDegs[v];
      if (gd <= ld) continue;

      const origSig = orig.graph.capabilities[v];
      const obsSig = obsCaps[v];
      if (!origSig || !obsSig) continue;

      let match = 0;
      for (const d of ALL_DIMS) {
        if (origSig[d] === obsSig[d]) match++;
      }
      boundaryRhos[v] = match / ALL_DIMS.length;
    }
  }

  return { obsCaps, boundaryRhos, criticalNode: cNode, corruptedDim: cDim };
}
