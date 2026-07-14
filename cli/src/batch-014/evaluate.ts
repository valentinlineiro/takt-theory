import { runBatch014 } from './run.js';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

export function generateReport(): string {
  const results = runBatch014();
  const lines: string[] = [];

  lines.push('# Batch-014 Results — Observability Kernel Augmentations');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push(`Total experimental runs evaluated: ${results.length} (3 cases × 4 incidences × 5 reps)`);
  lines.push('');

  // Primary Hypothesis testing
  // H_1: X_1 detects (dX1 > 0.005) AND X_2 detects (dX2 > 0.05) under corruption (incidence > 0)
  let countCorruptDepRuns = 0;
  let countX1Detected = 0;
  let countX2Detected = 0;

  for (const r of results) {
    if (r.caseId === 'DEP-005' && r.incidence > 0.00) {
      countCorruptDepRuns++;
      
      let x1Detected = false;
      let x2Detected = false;

      for (let i = 0; i < r.corruptX1.length - 1; i++) {
        const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
        const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

        if (d_X1 > 0.005) x1Detected = true;
        if (d_X2 > 0.05) x2Detected = true;
      }

      if (x1Detected) countX1Detected++;
      if (x2Detected) countX2Detected++;
    }
  }

  lines.push(`### Hypothesis Evaluation`);
  lines.push('');
  lines.push(`- Total corrupt target runs (DEP-005): ${countCorruptDepRuns}`);
  lines.push(`- Runs where X1 detected ($d_{X1} > 0.005$): ${countX1Detected} (${((countX1Detected/countCorruptDepRuns)*100).toFixed(1)}%)`);
  lines.push(`- Runs where X2 detected ($d_{X2} > 0.05$): ${countX2Detected} (${((countX2Detected/countCorruptDepRuns)*100).toFixed(1)}%)`);
  lines.push('');
  
  lines.push('## 2. Transition Analysis Matrix (DEP-005)');
  lines.push('');
  lines.push('| Incidence | Rep | k | d_X1 | d_X2 | D_X1 | D_X2 | Joint Verdict |');
  lines.push('|-----------|-----|---|------|------|------|------|---------------|');

  for (const r of results.filter(row => row.caseId === 'DEP-005')) {
    for (let i = 0; i < r.corruptX1.length - 1; i++) {
      const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
      const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

      const v_X1 = d_X1 > 0.005 ? 'detected' : 'silent';
      const v_X2 = d_X2 > 0.05 ? 'detected' : 'silent';
      
      const jointDetected = d_X1 > 0.005 && d_X2 > 0.05;
      const jointText = jointDetected ? '**BOTH DETECT**' : 'partial';

      lines.push(`| ${r.incidence.toFixed(2)} | ${r.rep} | ${i + 1} | ${d_X1.toFixed(3)} | ${d_X2.toFixed(3)} | ${v_X1} | ${v_X2} | ${jointText} |`);
    }
  }

  lines.push('');
  lines.push('## 3. Control Cases (WRK-002 & WRK-003)');
  lines.push('');
  lines.push('Evaluating controls (no topological corruption applied):');
  lines.push('');
  lines.push('| Case | Incidence | k | d_X1 | d_X2 |');
  lines.push('|------|-----------|---|------|------|');

  for (const r of results.filter(row => row.caseId !== 'DEP-005' && row.rep === 1)) {
    for (let i = 0; i < r.corruptX1.length - 1; i++) {
      const d_X1 = Math.abs(r.corruptD1[i] - r.cleanD1[i]);
      const d_X2 = Math.abs(r.corruptD2[i] - r.cleanD2[i]);

      lines.push(`| ${r.caseId} | ${r.incidence.toFixed(2)} | ${i + 1} | ${d_X1.toFixed(3)} | ${d_X2.toFixed(3)} |`);
    }
  }

  lines.push('');
  lines.push('## 4. Outcome Classification & Minimality Proof');
  lines.push('');
  
  const bothDetectAll = (countX1Detected === countCorruptDepRuns && countX2Detected === countCorruptDepRuns);
  if (bothDetectAll) {
    lines.push('### [Scenario C — Both Detect Confirmed]');
    lines.push('Both candidates $X_1$ and $X_2$ successfully separated the Batch-013 equivalence class under corruption, converting the previous blind spot into a detected state ($D_{joint}^{+X_i} = \\text{detected}$).');
    lines.push('');
    lines.push('### Minimality Proof Conclusion:');
    lines.push('1. **$\dim(X) = 0$** was proven **insufficient** in Batch-013 ($D_{joint}^{\\Omega} = \\text{undetected}$).');
    lines.push('2. **$\dim(X) = 1$** is proven **sufficient** in Batch-014 ($D_{joint}^{+X_1} = D_{joint}^{+X_2} = \\text{detected}$).');
    lines.push('3. Therefore, the minimal dimensional augmentation required to separate the Batch-013 equivalence class under the frozen cost metric is exactly:');
    lines.push('   $$\\boxed{\\dim(X)_{min} = 1}$$');
  } else if (countX1Detected === countCorruptDepRuns) {
    lines.push('### [Scenario A — X1 Detects Only]');
    lines.push('Only $X_1$ (Capability-Role Signature) successfully closed the kernel. $\\dim(X)_{min} = 1$ holds via $X_1$.');
  } else if (countX2Detected === countCorruptDepRuns) {
    lines.push('### [Scenario B — X2 Detects Only]');
    lines.push('Only $X_2$ (Structural Failure Sum) successfully closed the kernel. $\\dim(X)_{min} = 1$ holds via $X_2$.');
  } else {
    lines.push('### [Scenario D — Both Fail]');
    lines.push('Neither $X_1$ nor $X_2$ successfully detected the permutation. The blind spot remains open.');
  }

  return lines.join('\n');
}

export function runBatch014Report(): void {
  const report = generateReport();
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const analysisDir = join(rootDir, 'research', 'analysis');
  mkdirSync(analysisDir, { recursive: true });
  const reportPath = join(analysisDir, 'batch-014-results.md');
  writeFileSync(reportPath, report, 'utf8');
  console.log(`[Batch-014] Report written to ${reportPath}`);
}

if (process.argv[1]?.endsWith('evaluate.ts') || process.argv[1]?.endsWith('evaluate.js')) {
  runBatch014Report();
}
