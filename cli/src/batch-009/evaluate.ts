import { runBatch009, aggregate } from './run.js';
import type { ScoreRow } from './eval.js';

import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

export function generateReport(): string {
  const results = runBatch009();
  const agg = aggregate(results);

  const byIncidence: Record<number, ScoreRow[]> = {};
  const byCase: Record<string, ScoreRow[]> = {};
  for (const r of results) {
    if (!byIncidence[r.incidence]) byIncidence[r.incidence] = [];
    byIncidence[r.incidence].push(r);
    if (!byCase[r.caseId]) byCase[r.caseId] = [];
    byCase[r.caseId].push(r);
  }

  const lines: string[] = [];

  lines.push('# Batch-009 Results: Impact-Weighted α_k (Oracle Mechanism Validation)');
  lines.push('');
  lines.push(`Total evaluations: ${results.length} (4 incidences × 3 cases × 9 policies × 5 reps)`);
  lines.push('');

  lines.push('## Overall Scorecard');
  lines.push('');
  lines.push('| Policy | Mismatch Rate | Avg Regret | Avg BlindnessGap | Avg α Error | Probe Rate | Avg α Est | Avg Cost |');
  lines.push('|--------|---------------|------------|------------------|-------------|------------|-----------|----------|');
  for (const [pid, a] of Object.entries(agg)) {
    const row = [
      pid,
      (a.mismatchRate * 100).toFixed(1) + '%',
      a.avgRegret.toFixed(3),
      a.avgBlindnessGap.toFixed(3),
      a.avgAlphaError.toFixed(3),
      (a.probeRate * 100).toFixed(1) + '%',
      a.avgAlphaEst.toFixed(3),
      a.avgActionCost.toFixed(3),
    ].join(' | ');
    lines.push(`| ${row} |`);
  }

  lines.push('');
  lines.push('## By Incidence');
  lines.push('');
  lines.push('| Incidence | Policy | Mismatch Rate | Avg Regret | Probe Rate | Avg α Est |');
  lines.push('|-----------|--------|---------------|------------|------------|-----------|');
  for (const incidence of [0.00, 0.05, 0.10, 0.15]) {
    const rows = byIncidence[incidence] ?? [];
    const byPol: Record<string, ScoreRow[]> = {};
    for (const r of rows) {
      if (!byPol[r.policyId]) byPol[r.policyId] = [];
      byPol[r.policyId].push(r);
    }
    for (const [pid, prs] of Object.entries(byPol)) {
      const n = prs.length;
      const mm = prs.filter(r => r.mismatch).length / n;
      const rg = prs.reduce((s, r) => s + r.regret, 0) / n;
      const pr = prs.filter(r => r.didProbe).length / n;
      const ae = prs.reduce((s, r) => s + r.alphaEstimated, 0) / n;
      lines.push(`| ${incidence.toFixed(2)} | ${pid} | ${(mm * 100).toFixed(1)}% | ${rg.toFixed(3)} | ${(pr * 100).toFixed(1)}% | ${ae.toFixed(3)} |`);
    }
  }

  lines.push('');
  lines.push('## By Case');
  lines.push('');
  lines.push('| Case | Policy | Mismatch Rate | Avg Regret | Avg α Est | Probe Rate |');
  lines.push('|------|--------|---------------|------------|-----------|------------|');
  for (const caseId of ['WRK-002', 'WRK-003', 'DEP-005']) {
    const rows = byCase[caseId] ?? [];
    const byPol: Record<string, ScoreRow[]> = {};
    for (const r of rows) {
      if (!byPol[r.policyId]) byPol[r.policyId] = [];
      byPol[r.policyId].push(r);
    }
    for (const [pid, prs] of Object.entries(byPol)) {
      const n = prs.length;
      const mm = prs.filter(r => r.mismatch).length / n;
      const rg = prs.reduce((s, r) => s + r.regret, 0) / n;
      const ae = prs.reduce((s, r) => s + r.alphaEstimated, 0) / n;
      const pr = prs.filter(r => r.didProbe).length / n;
      lines.push(`| ${caseId} | ${pid} | ${(mm * 100).toFixed(1)}% | ${rg.toFixed(3)} | ${ae.toFixed(3)} | ${(pr * 100).toFixed(1)}% |`);
    }
  }

  lines.push('');
  lines.push('## ΔBlindnessGap (weighted vs unweighted)');
  lines.push('');

  const baselinePolicies = ['ProbeReliability0.3', 'ProbeReliability0.5', 'ProbeReliability0.7'];
  const weightedPolicies = ['ProbeWeighted0.3', 'ProbeWeighted0.5', 'ProbeWeighted0.7'];

  lines.push('| Threshold | Baseline BG | Weighted BG | Δ | Δ Interpretation |');
  lines.push('|-----------|-------------|-------------|---|-----------------|');
  for (let i = 0; i < 3; i++) {
    const bp = baselinePolicies[i];
    const wp = weightedPolicies[i];
    const b = agg[bp];
    const w = agg[wp];
    if (!b || !w) continue;
    const delta = b.avgBlindnessGap - w.avgBlindnessGap;
    const interpret = delta > 1 ? 'Mechanism works (Result A)' :
      delta > 0.1 ? 'Partial improvement (Result B)' :
      'No improvement (Result C/deep failure)';
    lines.push(`| ${bp.replace('ProbeReliability', 'τ=')} | ${b.avgBlindnessGap.toFixed(3)} | ${w.avgBlindnessGap.toFixed(3)} | ${delta.toFixed(3)} | ${interpret} |`);
  }

  lines.push('');
  lines.push('## Δ α Error (weighted vs unweighted)');
  lines.push('');
  lines.push('| Threshold | Baseline α Error | Weighted α Error | Δ |');
  lines.push('|-----------|-----------------|-----------------|---|');
  for (let i = 0; i < 3; i++) {
    const bp = baselinePolicies[i];
    const wp = weightedPolicies[i];
    const b = agg[bp];
    const w = agg[wp];
    if (!b || !w) continue;
    const delta = b.avgAlphaError - w.avgAlphaError;
    lines.push(`| ${bp.replace('ProbeReliability', 'τ=')} | ${b.avgAlphaError.toFixed(3)} | ${w.avgAlphaError.toFixed(3)} | ${delta.toFixed(3)} |`);
  }

  lines.push('');
  lines.push('## Interpretation');
  lines.push('');

  const baselineBG = agg['ProbeReliability0.3']?.avgBlindnessGap ?? 0;
  const weightedBG = agg['ProbeWeighted0.3']?.avgBlindnessGap ?? 0;
  const deltaBG = baselineBG - weightedBG;

  if (deltaBG > 1) {
    lines.push('**Result A: mechanism works.** Weighted α_w^{oracle} closes the BlindnessGap. The problem is not the scalar risk hypothesis — it is finding a corruption-resistant Impact signal.');
    lines.push('');
    lines.push('The next frontier: Impact_robusto = f(Graph, History, Causality). The oracle test confirms the mechanism is sound.');
  } else if (deltaBG > 0.1) {
    lines.push('**Result B: partial improvement.** Weighted α_w reduces but does not close the BlindnessGap. Relevance helps but is insufficient.');
    lines.push('');
    lines.push('The next frontier: α = f(ρ, Impact, Structure). The estimator needs topology context beyond Impact weighting.');
  } else {
    lines.push('**Result C: mechanism fails.** Even with oracle Impact, the weighted α cannot close the BlindnessGap.');
    lines.push('');
    lines.push('Implication: compressing uncertainty into a scalar α_k may be insufficient. The theory must shift from risk estimation to irreducible uncertainty policy.');
  }

  return lines.join('\n');
}

export function runBatch009Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const batchesDir = join(rootDir, 'experiments', 'computational-batches');
  const batchDir = join(batchesDir, 'batch-009');
  mkdirSync(batchDir, { recursive: true });
  const reportPath = join(batchDir, 'batch-009-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-009] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts')) {
  runBatch009Report();
}
