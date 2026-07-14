import { loadBatch005Cases } from '../batch-005/cases.js';
import { applySparseFn, getCriticalNodeSpec } from '../batch-008/sparseFn.js';
import type { CorruptionState } from '../batch-008/sparseFn.js';

const INCIDENCES = [0.00, 0.05, 0.10, 0.15];
const CASE_IDS = ['WRK-002', 'WRK-003', 'DEP-005'];
const REPS = 5;
const ALL_DIMS = 5;

function mean(vs: number[]): number {
  return vs.reduce((a, b) => a + b, 0) / vs.length;
}

function variance(vs: number[]): number {
  const m = mean(vs);
  return vs.reduce((a, b) => a + (b - m) ** 2, 0) / vs.length;
}

function skewness(vs: number[]): number {
  const m = mean(vs);
  const v = variance(vs);
  if (v === 0) return 0;
  const s3 = vs.reduce((a, b) => a + (b - m) ** 3, 0) / vs.length;
  return s3 / (v ** 1.5);
}

function kurtosis(vs: number[]): number {
  const m = mean(vs);
  const v = variance(vs);
  if (v === 0) return 0;
  const s4 = vs.reduce((a, b) => a + (b - m) ** 4, 0) / vs.length;
  return s4 / (v ** 2) - 3;
}

export interface RhoAnalysis {
  caseId: string;
  incidence: number;
  rep: number;
  nBoundary: number;

  rhoValues: number[];

  rhoMin: number;
  rhoMax: number;
  rhoMean: number;
  rhoMedian: number;
  rhoVariance: number;
  rhoSkewness: number;
  rhoKurtosis: number;

  massBelow085: number;
  massBelow09: number;

  alphaMedian: number;
  alphaMin: number;
  alphaWeighted: number;

  nImpactBoundary: number;
}

const VEC_LEN = ALL_DIMS;

export function analyzeOne(caseId: string): RhoAnalysis[] {
  const cases = loadBatch005Cases();
  const orig = cases.find(c => c.id === caseId)!;
  const spec = getCriticalNodeSpec(caseId)!;
  const results: RhoAnalysis[] = [];

  for (const incidence of INCIDENCES) {
    for (let rep = 1; rep <= REPS; rep++) {
      const seed = `${caseId}+${incidence}+${rep}`.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
      const cs: CorruptionState = applySparseFn(orig, spec, incidence, seed);

      const rhos = Object.values(cs.boundaryRhos);
      const n = rhos.length;
      if (n === 0) continue;

      const sorted = [...rhos].sort((a, b) => a - b);
      const med = n % 2 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      const mn = sorted[0];
      const mx = sorted[n - 1];
      const rhoMean = mean(rhos);
      const rhoVar = variance(rhos);
      const rhoSkew = skewness(rhos);
      const rhoKurt = kurtosis(rhos);

      const mass085 = rhos.filter(v => v < 0.85).length / n;
      const mass09 = rhos.filter(v => v < 0.90).length / n;

      const alphaMedian = 1 - med;
      const alphaMin = 1 - mn;

      results.push({
        caseId,
        incidence,
        rep,
        nBoundary: n,
        rhoValues: [...rhos].sort(),
        rhoMin: mn,
        rhoMax: mx,
        rhoMean,
        rhoMedian: med,
        rhoVariance: rhoVar,
        rhoSkewness: rhoSkew,
        rhoKurtosis: rhoKurt,
        massBelow085: mass085,
        massBelow09: mass09,
        alphaMedian,
        alphaMin,
        alphaWeighted: 0,
        nImpactBoundary: 0,
      });
    }
  }

  return results;
}

export function analyzeAll(): Record<string, RhoAnalysis[]> {
  const out: Record<string, RhoAnalysis[]> = {};
  for (const caseId of CASE_IDS) {
    out[caseId] = analyzeOne(caseId);
  }
  return out;
}

export function generateSignalReport(): string {
  const data = analyzeAll();
  const lines: string[] = [];

  lines.push('# Batch-009.1 — Retrospective Signal Mining');
  lines.push('');
  lines.push('Re-analysis of existing ρ vectors from Batch-008/009 corruption states.');
  lines.push('No new evaluations. Same 4 incidences × 3 cases × 5 reps = 60 corruption states.');
  lines.push('');

  lines.push('## Scorecard: Which signals cross τ=0.3?');
  lines.push('');
  lines.push('| Signal | WRK-002 max | WRK-003 max | DEP-005 max | Any > 0.3? | Minimum incidence |');
  lines.push('|--------|-------------|-------------|-------------|------------|-------------------|');

  const signalDefs: [string, (a: RhoAnalysis) => number][] = [
    ['α_median = 1−median(ρ)', a => a.alphaMedian],
    ['α_min = 1−min(ρ)', a => a.alphaMin],
    ['α_mean = 1−mean(ρ)', a => 1 - a.rhoMean],
    ['σ²(ρ)', a => a.rhoVariance],
    ['|skew(ρ)|', a => Math.abs(a.rhoSkewness)],
    ['kurtosis(ρ)', a => a.rhoKurtosis],
    ['mass_below_0.85', a => a.massBelow085],
    ['mass_below_0.90', a => a.massBelow09],
  ];

  for (const [name, fn] of signalDefs) {
    const cellMax: [string, number][] = [];
    let anyCross = false;
    let minInc = Infinity;

    for (const caseId of CASE_IDS) {
      const rows = data[caseId];
      let mx = -Infinity;
      for (const r of rows) {
        const v = fn(r);
        if (v > mx) mx = v;
      }
      cellMax.push([caseId, mx]);
      if (mx > 0.3) {
        anyCross = true;
        // find lowest incidence where >0.3
        for (const r of rows) {
          const v = fn(r);
          if (v > 0.3 && r.incidence < minInc) minInc = r.incidence;
        }
      }
    }

    const line = [
      name,
      cellMax[0][1].toFixed(4),
      cellMax[1][1].toFixed(4),
      cellMax[2][1].toFixed(4),
      anyCross ? 'YES' : 'no',
      anyCross ? minInc.toFixed(2) : '—',
    ].join(' | ');
    lines.push(`| ${line} |`);
  }

  lines.push('');

  for (const caseId of CASE_IDS) {
    lines.push(`## ${caseId} — Detail`);
    lines.push('');
    lines.push('| Inc | Rep | n | ρ vals | min | med | α_mdn | α_min | σ² | skew | kurt | <0.85 | <0.90 |');
    lines.push('|-----|-----|-----|--------|-----|-----|-------|-------|-----|------|------|-------|-------|');
    for (const r of data[caseId]) {
      const pv = r.rhoValues.map(v => v.toFixed(2)).join(',');
      const row = [
        r.incidence.toFixed(2),
        r.rep,
        r.nBoundary,
        `[${pv}]`,
        r.rhoMin.toFixed(2),
        r.rhoMedian.toFixed(2),
        r.alphaMedian.toFixed(3),
        r.alphaMin.toFixed(3),
        r.rhoVariance.toFixed(4),
        r.rhoSkewness.toFixed(3),
        r.rhoKurtosis.toFixed(3),
        r.massBelow085.toFixed(2),
        r.massBelow09.toFixed(2),
      ].join(' | ');
      lines.push(`| ${row} |`);
    }
    lines.push('');
  }

  lines.push('## Per-Incidence Aggregation');
  lines.push('');
  lines.push('| Case | Inc | α_median | α_min | mean σ² | mean |skew| | mean kurt | mass<0.85 | mass<0.90 |');
  lines.push('|------|-----|----------|-------|---------|-----------|-----------|-----------|-----------|');

  for (const caseId of CASE_IDS) {
    for (const inc of INCIDENCES) {
      const rows = data[caseId].filter(r => r.incidence === inc);
      if (!rows.length) continue;
      const aMdn = mean(rows.map(r => r.alphaMedian));
      const aMin = mean(rows.map(r => r.alphaMin));
      const mV = mean(rows.map(r => r.rhoVariance));
      const mS = mean(rows.map(r => Math.abs(r.rhoSkewness)));
      const mK = mean(rows.map(r => r.rhoKurtosis));
      const m085 = mean(rows.map(r => r.massBelow085));
      const m09 = mean(rows.map(r => r.massBelow09));
      const line = [caseId, inc.toFixed(2), aMdn.toFixed(3), aMin.toFixed(3), mV.toFixed(4), mS.toFixed(3), mK.toFixed(3), m085.toFixed(3), m09.toFixed(3)].join(' | ');
      lines.push(`| ${line} |`);
    }
  }

  lines.push('');
  lines.push('## Interpretation');
  lines.push('');

  const wrk003 = data['WRK-003'];
  const wrk002 = data['WRK-002'];
  const dep005 = data['DEP-005'];

  const anyMinCross = [...wrk002, ...wrk003, ...dep005].some(r => r.alphaMin > 0.3);
  const anyVarNonzero = [...wrk002, ...wrk003, ...dep005].some(r => r.rhoVariance > 0.01);

  if (anyMinCross) {
    lines.push('**α_min crosses threshold.** The minimum ρ value produces α > 0.3 in at least one configuration.');
    lines.push('min(ρ) captures the outlier that median(ρ) dilutes. This is the simplest correction.');
  } else {
    lines.push('**α_min does NOT cross τ=0.3.** Even the most corrupted node produces α ≤ 0.2.');
    lines.push('The ρ ceiling (ρ_min ≈ 0.8 under fn corruption) constrains any scalar derived from ρ.');
  }

  if (anyVarNonzero) {
    lines.push('**σ²(ρ) > 0** in corrupted states — variance carries signal that central tendency discards.');
  } else {
    lines.push('**σ²(ρ) ≈ 0** across all states — variance provides no discriminatory information.');
  }

  lines.push('');
  lines.push('### Recommendation');
  lines.push('');

  if (anyMinCross) {
    lines.push('**Use α_min for ProbeReliability@0.3.** Batch-010 should test α_min as the primary estimator,');
    lines.push('with Impact weighting as secondary correction. The existing data already supports this.');
    lines.push('');
    lines.push('τ can be recalibrated: τ = 1 − ρ_min_bound, where ρ_min_bound is the expected clean-state minimum.');
    lines.push('For A_{sparseFN} where ρ_min = 0.8, usable τ ∈ [0.2, 0.3].');
  } else if (anyVarNonzero) {
    lines.push('**Variance-based detection.** σ²(ρ) distinguishes clean from corrupted, but cannot set a probe threshold.');
    lines.push('Batch-010 should test α = f(σ², Impact, structure) — a multi-signal estimator.');
    lines.push('');
    lines.push('Alternative: variance as gate (if σ² > ε, probe) rather than variance as amplitude.');
  } else {
    lines.push('**No ρ-based scalar works.** Even min, variance, skewness, and kurtosis fail to produce a signal');
    lines.push('above τ = 0.3. The information required is not present in the ρ vector under A_{sparseFN}.');
    lines.push('');
    lines.push('Batch-010 must look beyond ρ: topology-aware α, temporal α, or a fundamentally different estimator.');
  }

  return lines.join('\n');
}

if (process.argv[1]?.endsWith('signalMine.ts')) {
  const report = generateSignalReport();
  console.log(report);
}
