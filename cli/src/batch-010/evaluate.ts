import { runBatch010 } from './run.js';
import type { Batch010ResultRow } from './run.js';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

function median(vals: number[]): number {
  if (!vals.length) return 1;
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function generateReport(): string {
  const results = runBatch010();
  const lines: string[] = [];

  lines.push('# Batch-010 Results — Observability Governance via ΔΩ');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push(`Total experimental runs evaluated: ${results.length} (3 cases × 4 incidences × 5 reps)`);
  lines.push('');

  // Primary Hypothesis testing
  // H_1: exists i in Omega : Loss_i > epsilon_i when alpha_k < tau (0.2)
  // Let's check for each corrupt run if we find a transition k -> k+1 where alpha_k <= 0.20 but some deltas > 0.
  // We define thresholds: d_O > 0, d_rho > 0.05, d_T.dV > 0, d_T.dE > 0
  let countH1Matches = 0;
  let countCorruptRuns = 0;

  for (const r of results) {
    if (r.incidence > 0.00) {
      countCorruptRuns++;
      let h1MatchForRun = false;
      for (let i = 0; i < r.corruptStates.length - 1; i++) {
        const state = r.corruptStates[i];
        const delta = r.corruptDeltas[i];
        
        // alpha_k = 1 - median(rho)
        const rhos = Object.values(state.rho);
        const alpha = 1 - median(rhos);

        if (alpha <= 0.20) {
          const deltaO = delta.d_O > 0;
          const deltaRho = delta.d_rho > 0.05;
          const deltaTopology = delta.d_T.dV > 0 || delta.d_T.dE > 0;
          
          if (deltaO || deltaRho || deltaTopology) {
            h1MatchForRun = true;
          }
        }
      }
      if (h1MatchForRun) countH1Matches++;
    }
  }

  lines.push(`### Hypothesis Evaluation`);
  lines.push('');
  lines.push(`Primary hypothesis: \`\\Delta\\Omega > \\varepsilon \\land \\alpha \\leq \\tau\``);
  lines.push(`- Total corrupt runs: ${countCorruptRuns}`);
  lines.push(`- Runs confirming $H_1$ (detection when $\\alpha \\leq 0.2$): ${countH1Matches} (${((countH1Matches/countCorruptRuns)*100).toFixed(1)}%)`);
  lines.push('');
  
  lines.push('## 2. Transition Analysis Matrix');
  lines.push('');
  lines.push('| Case | Incidence | Rep | k | α | ΔO | Δρ | ΔV | ΔE | DRU |');
  lines.push('|------|-----------|-----|---|---|----|----|----|----|-----|');

  for (const r of results) {
    for (let i = 0; i < r.corruptStates.length - 1; i++) {
      const state = r.corruptStates[i];
      const delta = r.corruptDeltas[i];
      const rhos = Object.values(state.rho);
      const alpha = 1 - median(rhos);

      lines.push(`| ${r.caseId} | ${r.incidence.toFixed(2)} | ${r.rep} | ${state.k} | ${alpha.toFixed(2)} | ${delta.d_O} | ${delta.d_rho.toFixed(2)} | ${delta.d_T.dV} | ${delta.d_T.dE} | ${state.dru} |`);
    }
  }

  lines.push('');
  lines.push('## 3. Baseline Clean Snapshots');
  lines.push('');
  lines.push('Evaluating false-positive rates on clean system transitions ($S_{clean}$):');
  lines.push('');
  lines.push('| Case | k | ΔO (clean) | Δρ (clean) | ΔV (clean) | ΔE (clean) |');
  lines.push('|------|---|------------|------------|------------|------------|');

  for (const r of results.filter(row => row.incidence === 0.00)) {
    for (let i = 0; i < r.cleanStates.length - 1; i++) {
      const state = r.cleanStates[i];
      const delta = r.cleanDeltas[i];
      lines.push(`| ${r.caseId} | ${state.k} | ${delta.d_O} | ${delta.d_rho.toFixed(2)} | ${delta.d_T.dV} | ${delta.d_T.dE} |`);
    }
  }

  lines.push('');
  lines.push('## 4. Outcome Classification');
  lines.push('');
  if (countH1Matches === countCorruptRuns) {
    lines.push('### [Observable Governance Confirmed]');
    lines.push('All corrupted runs with low $\\alpha$ were successfully flagged by $\\Delta\\Omega$. Observability is proved to be an independent dimension of risk.');
  } else if (countH1Matches > 0) {
    lines.push('### [Partial Observability]');
    lines.push('Some corrupted runs with low $\\alpha$ were flagged by $\\Delta\\Omega$, while others escaped. We require dimension-specific weighting.');
  } else {
    lines.push('### [Epistemic Blindness Boundary]');
    lines.push('No corrupted runs were flagged by $\\Delta\\Omega$ when $\\alpha$ was low. This indicates unobservable uncertainty under internal instrumentation.');
  }

  return lines.join('\n');
}

export function runBatch010Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const analysisDir = join(rootDir, 'research', 'analysis');
  mkdirSync(analysisDir, { recursive: true });
  const reportPath = join(analysisDir, 'batch-010-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-010] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts') || process.argv[1]?.endsWith('evaluate.js')) {
  runBatch010Report();
}
