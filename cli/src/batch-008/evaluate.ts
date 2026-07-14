import { runBatch008, aggregate } from './run.js';
import type { ScoreRow } from './eval.js';

export function generateReport(): string {
  const results = runBatch008();
  const agg = aggregate(results);

  const lines: string[] = [];

  lines.push('# Batch-008 Results: α_k Estimation Under Sparse FN Adversarial Corruption');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push(`Total evaluations: ${results.length} (4 incidences × 3 cases × 6 policies × 5 reps)`);
  lines.push('');

  lines.push('## 2. Overall Scorecard');
  lines.push('');
  lines.push('| Policy | Mismatch Rate | Avg Regret | Avg BlindnessGap | Avg α Error | Probe Rate | Avg K | Avg Cost |');
  lines.push('|--------|---------------|------------|------------------|-------------|------------|-------|----------|');
  for (const [policyId, a] of Object.entries(agg)) {
    const row = [
      policyId,
      (a.mismatchRate * 100).toFixed(1) + '%',
      a.avgRegret.toFixed(3),
      a.avgBlindnessGap.toFixed(3),
      a.avgAlphaError.toFixed(3),
      (a.probeRate * 100).toFixed(1) + '%',
      a.avgKActual.toFixed(2),
      a.avgActionCost.toFixed(3),
    ].join(' | ');
    lines.push(`| ${row} |`);
  }

  lines.push('');
  lines.push('## 3. By Incidence Level');
  lines.push('');
  lines.push('| Incidence | Policy | Mismatch Rate | Avg Regret | Probe Rate | Avg α Est |');
  lines.push('|-----------|--------|---------------|------------|------------|-----------|');

  const byIncidence: Record<number, ScoreRow[]> = {};
  for (const r of results) {
    if (!byIncidence[r.incidence]) byIncidence[r.incidence] = [];
    byIncidence[r.incidence].push(r);
  }

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
  lines.push('## 4. By Case');
  lines.push('');
  lines.push('| Case | Policy | Mismatch Rate | Avg Regret | Avg α Est | Boundary Nodes |');
  lines.push('|------|--------|---------------|------------|-----------|----------------|');

  const byCase: Record<string, ScoreRow[]> = {};
  for (const r of results) {
    if (!byCase[r.caseId]) byCase[r.caseId] = [];
    byCase[r.caseId].push(r);
  }

  for (const caseId of ['WRK-002', 'WRK-003', 'DEP-005']) {
    const rows = byCase[caseId] ?? [];
    const bn = rows.length > 0 ? rows[0].boundaryNodeCount : 0;
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
      lines.push(`| ${caseId} | ${pid} | ${(mm * 100).toFixed(1)}% | ${rg.toFixed(3)} | ${ae.toFixed(3)} | ${bn} |`);
    }
  }

  lines.push('');
  lines.push('## 5. Observations');
  lines.push('');

  const alwaysTrustMM = agg['AlwaysTrust']?.mismatchRate ?? 0;
  const alwaysVerifyMM = agg['AlwaysVerify']?.mismatchRate ?? 0;
  const probeAlwaysMM = agg['ProbeAlways']?.mismatchRate ?? 0;

  lines.push(`- AlwaysTrust mismatch rate: ${(alwaysTrustMM * 100).toFixed(1)}% — baseline cost of suppressed DRU.`);
  lines.push(`- AlwaysVerify mismatch rate: ${(alwaysVerifyMM * 100).toFixed(1)}% — baseline cost of always expanding.`);
  lines.push(`- ProbeAlways mismatch rate: ${(probeAlwaysMM * 100).toFixed(1)}% — effectiveness of single-probe recovery.`);

  for (const pid of ['ProbeReliability0.3', 'ProbeReliability0.5', 'ProbeReliability0.7']) {
    const a = agg[pid];
    if (!a) continue;
    const label = pid.replace('ProbeReliability', 'τ=');
    lines.push(`- ${label} mismatch rate: ${(a.mismatchRate * 100).toFixed(1)}%, probe rate: ${(a.probeRate * 100).toFixed(1)}%, avg α error: ${a.avgAlphaError.toFixed(3)}.`);
  }

  lines.push('');
  lines.push('## 6. Theoretical Implications');
  lines.push('');

  lines.push('### Reliability mass ≠ Decision relevance');
  lines.push('');
  lines.push(`Boundary node count across cases: ${results[0]?.boundaryNodeCount ?? 0}-${Math.max(...results.map(r => r.boundaryNodeCount))}.`);
  lines.push('When boundary node count is low (≤2), the median ρ collapses to individual node reliability,');
  lines.push('making α_k highly sensitive to single-node corruption. This is a topology-dependent property.');

  lines.push('');
  lines.push('### Scenario classification');
  lines.push('');
  lines.push('| Scenario | Condition | Evidence |');
  lines.push('|----------|-----------|----------|');

  lines.push(`| A: α robust | BlindnessGap ≈ 0 ∀θ | ${agg['ProbeReliability0.3']?.avgBlindnessGap.toFixed(3) ?? 'N/A'} |`);
  lines.push(`| B: bounded domain | ∃ boundary D_α | check per-incidence tables above |`);
  lines.push(`| C: impossibility | ∃θ: BlindnessGap ≫ 0, no observable escape | ${agg['AlwaysTrust']?.avgBlindnessGap.toFixed(3) ?? 'N/A'} |`);

  return lines.join('\n');
}

import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

export function runBatch008Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const analysisDir = join(rootDir, 'research', 'analysis');
  mkdirSync(analysisDir, { recursive: true });
  const reportPath = join(analysisDir, 'batch-008-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-008] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts')) {
  runBatch008Report();
}
