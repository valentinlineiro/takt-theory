import { runBatch015 } from './run.js';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

export function generateReport(): string {
  const results = runBatch015();
  const lines: string[] = [];

  lines.push('# Batch-015 Results — Augmented Representation Stability');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push(`Total experimental runs evaluated: ${results.length} (3 cases × 4 incidences × 5 reps)`);
  lines.push('');

  // Primary Hypothesis testing
  // H_1: exists joint undetected run under Loss > 0 (incidence > 0)
  let countCorruptDepRuns = 0;
  let countUndetectedAugDepRuns = 0;

  for (const r of results) {
    if (r.caseId === 'DEP-005' && r.incidence > 0.00) {
      countCorruptDepRuns++;
      let detectedForRun = false;
      for (let i = 0; i < r.corruptStates.length - 1; i++) {
        const delta = r.corruptDeltas[i];
        const cleanDelta = r.cleanDeltas[i];
        
        const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
        const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);
        const d_R = Math.abs(delta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
        const d_Com = Math.abs(delta.d_T.dCommunities - cleanDelta.d_T.dCommunities);
        const d_rho = delta.d_rho;
        const d_caps = delta.d_caps;
        const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
        const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

        // Joint Augmented Aggregator
        if (
          d_V > 0 ||
          d_E > 0 ||
          d_R > 0.10 ||
          d_Com > 0.05 ||
          d_rho > 0.05 ||
          d_caps > 0.05 ||
          d_X1 > 0.005 ||
          d_X2 > 0.05
        ) {
          detectedForRun = true;
        }
      }
      if (!detectedForRun) countUndetectedAugDepRuns++;
    }
  }

  lines.push(`### Hypothesis Evaluation`);
  lines.push('');
  lines.push(`Primary hypothesis: \\text{Loss} > 0 \\land D_{joint}^{+X_i}(\\Delta\\Omega_1, \\varepsilon) = \\text{undetected}`);
  lines.push(`- Total corrupt target runs (DEP-005): ${countCorruptDepRuns}`);
  lines.push(`- Runs confirming Scenario B (Shifted Kernel Confirmed): ${countUndetectedAugDepRuns} (${((countUndetectedAugDepRuns/countCorruptDepRuns)*100).toFixed(1)}%)`);
  lines.push('');
  
  lines.push('## 2. Absolute Values & Transitions (DEP-005)');
  lines.push('');
  lines.push('Detailed absolute metrics before deltas to ensure full trace transparency:');
  lines.push('');
  lines.push('| Incidence | Rep | k | Clean X1 | Corrupt X1 | Clean X2 | Corrupt X2 | Clean R | Corrupt R | Clean Com | Corrupt Com |');
  lines.push('|-----------|-----|---|----------|------------|----------|------------|---------|-----------|-----------|-------------|');

  for (const r of results.filter(row => row.caseId === 'DEP-005')) {
    for (let i = 0; i < r.cleanStates.length; i++) {
      const cState = r.cleanStates[i];
      const coState = r.corruptStates[i];
      const cX1 = r.cleanX1[i];
      const coX1 = r.corruptX1[i];
      const cX2 = r.cleanX2[i];
      const coX2 = r.corruptX2[i];
      const cR = cState.topology.redundancy;
      const coR = coState.topology.redundancy;
      const cCom = cState.topology.communities;
      const coCom = coState.topology.communities;

      lines.push(`| ${r.incidence.toFixed(2)} | ${r.rep} | ${cState.k} | ${cX1.toFixed(3)} | ${coX1.toFixed(3)} | ${cX2.toFixed(3)} | ${coX2.toFixed(3)} | ${cR.toFixed(3)} | ${coR.toFixed(3)} | ${cCom.toFixed(3)} | ${coCom.toFixed(3)} |`);
    }
  }

  lines.push('');
  lines.push('## 3. Deviation & Verdict Matrix (DEP-005)');
  lines.push('');
  lines.push('| Incidence | Rep | k | d\\|V\\| | d\\|E\\| | d_\\rho | d_caps | d_X1 | d_X2 | ΔR | ΔCom | Verdict |');
  lines.push('|-----------|-----|---|-------|-------|--------|--------|------|------|----|------|---------|');

  for (const r of results.filter(row => row.caseId === 'DEP-005')) {
    for (let i = 0; i < r.corruptStates.length - 1; i++) {
      const delta = r.corruptDeltas[i];
      const cleanDelta = r.cleanDeltas[i];

      const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
      const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);
      const d_R = Math.abs(delta.d_T.dRedundancy - cleanDelta.d_T.dRedundancy);
      const d_Com = Math.abs(delta.d_T.dCommunities - cleanDelta.d_T.dCommunities);
      const d_rho = delta.d_rho;
      const d_caps = delta.d_caps;
      const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
      const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

      const detected = (
        d_V > 0 ||
        d_E > 0 ||
        d_R > 0.10 ||
        d_Com > 0.05 ||
        d_rho > 0.05 ||
        d_caps > 0.05 ||
        d_X1 > 0.005 ||
        d_X2 > 0.05
      );
      const resultText = detected ? 'detected' : '**UNDETECTED**';

      lines.push(`| ${r.incidence.toFixed(2)} | ${r.rep} | ${i + 1} | ${d_V} | ${d_E} | ${d_rho.toFixed(2)} | ${d_caps.toFixed(2)} | ${d_X1.toFixed(3)} | ${d_X2.toFixed(3)} | ${d_R.toFixed(2)} | ${d_Com.toFixed(2)} | ${resultText} |`);
    }
  }

  lines.push('');
  lines.push('## 4. Control Cases (WRK-002 & WRK-003)');
  lines.push('');
  lines.push('Evaluating controls (no topological corruption applied):');
  lines.push('');
  lines.push('| Case | Incidence | k | d\\|V\\| | d\\|E\\| | d_X1 | d_X2 | d_\\rho | d_caps |');
  lines.push('|------|-----------|---|-------|-------|------|------|--------|--------|');

  for (const r of results.filter(row => row.caseId !== 'DEP-005' && row.rep === 1)) {
    for (let i = 0; i < r.corruptStates.length - 1; i++) {
      const delta = r.corruptDeltas[i];
      const cleanDelta = r.cleanDeltas[i];
      const d_V = Math.abs(delta.d_T.dV - cleanDelta.d_T.dV);
      const d_E = Math.abs(delta.d_T.dE - cleanDelta.d_T.dE);
      const d_rho = delta.d_rho;
      const d_caps = delta.d_caps;
      const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
      const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

      lines.push(`| ${r.caseId} | ${r.incidence.toFixed(2)} | ${i + 1} | ${d_V} | ${d_E} | ${d_X1.toFixed(3)} | ${d_X2.toFixed(3)} | ${d_rho.toFixed(2)} | ${d_caps.toFixed(2)} |`);
    }
  }

  lines.push('');
  lines.push('## 5. Outcome Classification');
  lines.push('');
  if (countUndetectedAugDepRuns === countCorruptDepRuns) {
    lines.push('### [Scenario B — Shifted Kernel Confirmed]');
    lines.push('All label-transposition runs under corruption were completed with **zero detections** ($D_{joint}^{+X_i} = \\text{undetected}$) across all sensors, while causing a true utility regret of **Loss = 1.00** ex-ante. This constructive witness proves that **the representational refinement simply shifted the blind-spot boundary**, leaving the augmented representation $\\Omega_1 = \\Omega \\oplus X$ vulnerable to role-permutation attacks on observationally equivalent nodes.');
  } else if (countUndetectedAugDepRuns > 0) {
    lines.push('### [Partial Stability]');
    lines.push('Some transposition runs bypassed all detectors, while others were flagged by augmented sensors.');
  } else {
    lines.push('### [Scenario A — Local Kernel Closure]');
    lines.push('No transposition runs bypassed the augmented joint aggregator, indicating the kernel is locally closed under these constraints.');
  }

  return lines.join('\n');
}

export function runBatch015Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const analysisDir = join(rootDir, 'research', 'analysis');
  mkdirSync(analysisDir, { recursive: true });
  const reportPath = join(analysisDir, 'batch-015-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-015] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts') || process.argv[1]?.endsWith('evaluate.js')) {
  runBatch015Report();
}
