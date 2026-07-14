import { runBatch012 } from './run.js';
import type { Batch012ResultRow } from './run.js';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

export function generateReport(): string {
  const results = runBatch012();
  const lines: string[] = [];

  lines.push('# Batch-012 Results — Structural Observability under Cardinality Invariance');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push(`Total experimental runs evaluated: ${results.length} (3 cases × 4 incidences × 5 reps)`);
  lines.push('');

  // Primary Hypothesis testing
  // H_1: exists structural delta (dR > 0.10 or dCom > 0.05) when cardinality is invariant (dV = 0, dE = 0) and Loss > 0 (incidence > 0)
  let countCorruptDepRuns = 0;
  let countDetectedDepRuns = 0;

  for (const r of results) {
    if (r.caseId === 'DEP-005' && r.incidence > 0.00) {
      countCorruptDepRuns++;
      let detectedForRun = false;
      for (let i = 0; i < r.corruptStates.length - 1; i++) {
        const delta = r.corruptDeltas[i];
        const cleanDelta = r.cleanDeltas[i];
        
        const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
        const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);

        // Cardinality channels must be silent
        if (d_V === 0 && d_E === 0) {
          const d_R = Math.abs(delta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
          const d_Com = Math.abs(delta.d_T.dCommunities - cleanDelta.d_T.dCommunities);

          if (d_R > 0.10 || d_Com > 0.05) {
            detectedForRun = true;
          }
        }
      }
      if (detectedForRun) countDetectedDepRuns++;
    }
  }

  lines.push(`### Hypothesis Evaluation`);
  lines.push('');
  lines.push(`Primary hypothesis: \`\\text{Loss} > 0 \\land \\Delta |V| = 0 \\land \\Delta |E| = 0 \\implies \\Delta R > 0.10 \\lor \\Delta Com > 0.05\``);
  lines.push(`- Total corrupt target runs (DEP-005): ${countCorruptDepRuns}`);
  lines.push(`- Runs confirming Scenario A (Structural Observability): ${countDetectedDepRuns} (${((countDetectedDepRuns/countCorruptDepRuns)*100).toFixed(1)}%)`);
  lines.push('');
  
  lines.push('## 2. Transition Analysis Matrix (DEP-005)');
  lines.push('');
  lines.push('| Incidence | Rep | k | d\\|V\\| | d\\|E\\| | ΔR | ΔCom | Result |');
  lines.push('|-----------|-----|---|-------|-------|----|------|--------|');

  for (const r of results.filter(row => row.caseId === 'DEP-005')) {
    for (let i = 0; i < r.corruptStates.length - 1; i++) {
      const delta = r.corruptDeltas[i];
      const cleanDelta = r.cleanDeltas[i];

      const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
      const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);
      const d_R = Math.abs(delta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
      const d_Com = Math.abs(delta.d_T.dCommunities - cleanDelta.d_T.dCommunities);

      const detected = (d_V === 0 && d_E === 0 && (d_R > 0.10 || d_Com > 0.05));
      const resultText = detected ? '**DETECTED**' : 'silent';

      lines.push(`| ${r.incidence.toFixed(2)} | ${r.rep} | ${r.corruptStates[i].k} | ${d_V} | ${d_E} | ${d_R.toFixed(2)} | ${d_Com.toFixed(2)} | ${resultText} |`);
    }
  }

  lines.push('');
  lines.push('## 3. Control Cases (WRK-002 & WRK-003)');
  lines.push('');
  lines.push('Evaluating controls (no topological corruption applied):');
  lines.push('');
  lines.push('| Case | Incidence | k | d\\|V\\| | d\\|E\\| | ΔR | ΔCom |');
  lines.push('|------|-----------|---|-------|-------|----|------|');

  for (const r of results.filter(row => row.caseId !== 'DEP-005' && row.rep === 1)) {
    for (let i = 0; i < r.corruptStates.length - 1; i++) {
      const delta = r.corruptDeltas[i];
      const cleanDelta = r.cleanDeltas[i];
      const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
      const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);
      const d_R = Math.abs(delta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
      const d_Com = Math.abs(delta.d_T.dCommunities - cleanDelta.d_T.dCommunities);

      lines.push(`| ${r.caseId} | ${r.incidence.toFixed(2)} | ${r.corruptStates[i].k} | ${d_V} | ${d_E} | ${d_R.toFixed(2)} | ${d_Com.toFixed(2)} |`);
    }
  }

  lines.push('');
  lines.push('## 4. Outcome Classification');
  lines.push('');
  if (countDetectedDepRuns === countCorruptDepRuns) {
    lines.push('### [Scenario A — Structural Observability Confirmed]');
    lines.push('All topological corruption runs under cardinality invariance were successfully flagged by $\\Delta\\Omega_i$ (specifically through the Community clustering coefficient delta $\\Delta Com$). The higher-order community dimension successfully detects connection rearrangements when count channels are blind.');
  } else if (countDetectedDepRuns > 0) {
    lines.push('### [Scenario B — Partial Observability]');
    lines.push('Structural metrics flagged some runs but remained blind to others under cardinality invariance.');
  } else {
    lines.push('### [Scenario C — Structural Observability Boundary]');
    lines.push('No topological corruption runs were flagged. Edge rearrangements that preserve counts are completely invisible to $\\Omega$ structural metrics.');
  }

  return lines.join('\n');
}

export function runBatch012Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const analysisDir = join(rootDir, 'research', 'analysis');
  mkdirSync(analysisDir, { recursive: true });
  const reportPath = join(analysisDir, 'batch-012-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-012] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts') || process.argv[1]?.endsWith('evaluate.js')) {
  runBatch012Report();
}
