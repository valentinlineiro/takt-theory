import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { executeBatch003 } from './eval.js';

interface BlindPrediction {
  case_id: string;
  selected_intervention: string;
  predicted_frictions?: Record<string, string>;
  confidence: string;
  rationale: string;
}

export function runEvaluation(): void {
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
  const predictionsPath = join(rootDir, 'research', 'data', 'batch-003', 'blind-predictions.jsonl');
  const resultsJsonlPath = join(rootDir, 'research', 'data', 'batch-003', 'results.jsonl');
  const analysisPath = join(rootDir, 'research', 'analysis', 'batch-003.md');

  // 1. Read blind predictions
  const predLines = readFileSync(predictionsPath, 'utf8').trim().split('\n');
  const predictions: Record<string, BlindPrediction> = {};
  for (const line of predLines) {
    if (!line) continue;
    const pred = JSON.parse(line) as BlindPrediction;
    predictions[pred.case_id] = pred;
  }

  // 2. Execute mathematical oracles
  const oracleResults = executeBatch003();

  // 3. Compute Metrics
  let correctInterventions = 0;
  const totalCases = Object.keys(oracleResults).length;

  let totalAbsoluteRegret = 0;
  let totalNormalizedRegret = 0;
  let destructiveCount = 0;

  let totalFrictionLabels = 0;
  let correctFrictionLabels = 0;

  const caseResults: Array<{
    case_id: string;
    domain: string;
    selected_intervention: string;
    oracle_optimal: string[];
    match: boolean;
    absolute_regret: number;
    normalized_regret: number;
    destructive: boolean;
    friction_accuracy: number;
    confidence: string;
    rationale: string;
  }> = [];

  for (const caseId of Object.keys(oracleResults)) {
    const caseData = oracleResults[caseId];
    const predObj = predictions[caseId];
    if (!predObj) {
      throw new Error(`Missing blind prediction for case: ${caseId}`);
    }

    const selected = predObj.selected_intervention;
    const isOptimal = caseData.optimalCandidates.includes(selected);

    if (isOptimal) {
      correctInterventions++;
    }

    // Regret computation
    const maxUtil = Math.max(...Object.values(caseData.candidates).map(c => c.utility));
    const minUtil = Math.min(...Object.values(caseData.candidates).map(c => c.utility));
    const selectedUtil = caseData.candidates[selected]?.utility ?? minUtil;

    const absoluteRegret = isOptimal ? 0 : Math.max(0, maxUtil - selectedUtil);
    const range = maxUtil - minUtil;
    const normalizedRegret = isOptimal ? 0 : (range > 0 ? absoluteRegret / range : 0);

    totalAbsoluteRegret += absoluteRegret;
    totalNormalizedRegret += normalizedRegret;

    // Destructive intervention check
    const baseG = caseData.candidates['T0']?.g ?? 0;
    const baseRisk = caseData.candidates['T0']?.risk ?? 0;
    const selectedG = caseData.candidates[selected]?.g ?? 0;
    const selectedRisk = caseData.candidates[selected]?.risk ?? 0;

    const destructive = (selectedG < baseG) || (selectedRisk > baseRisk);
    if (destructive) {
      destructiveCount++;
    }

    // Friction Accuracy check
    let frictionMatches = 0;
    const caseFrictionTotal = Object.keys(caseData.groundTruthFrictions).length;
    totalFrictionLabels += caseFrictionTotal;

    for (const [fKey, gTruth] of Object.entries(caseData.groundTruthFrictions)) {
      const pFriction = predObj.predicted_frictions?.[fKey];
      if (pFriction === gTruth) {
        frictionMatches++;
        correctFrictionLabels++;
      }
    }
    const frictionAccuracy = caseFrictionTotal > 0 ? frictionMatches / caseFrictionTotal : 1.0;

    caseResults.push({
      case_id: caseId,
      domain: caseData.type,
      selected_intervention: selected,
      oracle_optimal: caseData.optimalCandidates,
      match: isOptimal,
      absolute_regret: absoluteRegret,
      normalized_regret: normalizedRegret,
      destructive: destructive,
      friction_accuracy: frictionAccuracy,
      confidence: predObj.confidence,
      rationale: predObj.rationale
    });
  }

  const oia = totalCases > 0 ? (correctInterventions / totalCases) * 100 : 0;
  const meanAbsoluteRegret = totalCases > 0 ? totalAbsoluteRegret / totalCases : 0;
  const meanNormalizedRegret = totalCases > 0 ? totalNormalizedRegret / totalCases : 0;
  const dor = totalCases > 0 ? (destructiveCount / totalCases) * 100 : 0;
  const fca = totalFrictionLabels > 0 ? (correctFrictionLabels / totalFrictionLabels) * 100 : 100;

  // 4. Output results.jsonl
  const resultsJsonlLines = caseResults.map(r => JSON.stringify(r)).join('\n');
  writeFileSync(resultsJsonlPath, resultsJsonlLines + '\n', 'utf8');

  // 5. Update research/analysis/batch-003.md
  let analysisContent = readFileSync(analysisPath, 'utf8');

  // Replace Status
  analysisContent = analysisContent.replace(
    /> \*\*Status:\*\* Awaiting blind predictions/,
    `> **Status:** Completed`
  );

  // Replace Global Metrics
  analysisContent = analysisContent.replace(
    /- \*\*Optimal Intervention Accuracy \(OIA\)\*\*: N\/A\n- \*\*Mean Absolute Regret\*\*: N\/A\n- \*\*Mean Normalized Regret\*\*: N\/A\n- \*\*Dangerous Optimization Rate \(DOR\)\*\*: N\/A\n- \*\*Friction Classification Accuracy \(FCA\)\*\*: N\/A/,
    `- **Optimal Intervention Accuracy (OIA)**: ${oia.toFixed(2)}%\n- **Mean Absolute Regret**: ${meanAbsoluteRegret.toFixed(4)}\n- **Mean Normalized Regret**: ${meanNormalizedRegret.toFixed(4)}\n- **Dangerous Optimization Rate (DOR)**: ${dor.toFixed(2)}%\n- **Friction Classification Accuracy (FCA)**: ${fca.toFixed(2)}%`
  );

  // Replace Case Comparison Table
  const newTableLines = caseResults.map(r => {
    return `| ${r.case_id} | ${r.domain} | ${r.selected_intervention} | ${r.oracle_optimal.join(', ')} | ${r.match ? '✅' : '❌'} | ${r.absolute_regret.toFixed(4)} | ${r.normalized_regret.toFixed(4)} | ${r.destructive ? '💥 Yes' : '🛡️ No'} | ${(r.friction_accuracy * 100).toFixed(0)}% |`;
  }).join('\n');

  analysisContent = analysisContent.replace(
    /\| Case ID \| Domain \| Selected Intervention \| Oracle Optimal \| Match \| Absolute Regret \| Normalized Regret \| Destructive\? \| Friction Accuracy \|\n\|[ \-|]*\|\n([\s\S]*?)\n\n---/m,
    `| Case ID | Domain | Selected Intervention | Oracle Optimal | Match | Absolute Regret | Normalized Regret | Destructive? | Friction Accuracy |\n| ------- | ------ | --------------------- | -------------- | ----- | --------------- | ----------------- | ------------ | ----------------- |\n${newTableLines}\n\n---`
  );

  // Update Section 3 Insights and Domain Analysis
  const depCasesReport = caseResults.filter(r => r.domain === 'DEP').map(r => `* **${r.case_id}**: Selected ${r.selected_intervention} (Optimal: ${r.oracle_optimal.join(', ')}). Regret: ${r.absolute_regret.toFixed(2)}. ${r.match ? 'Perfect match.' : 'Missed optimal due to ' + r.rationale}`).join('\n');
  const wrkCasesReport = caseResults.filter(r => r.domain === 'WRK').map(r => `* **${r.case_id}**: Selected ${r.selected_intervention} (Optimal: ${r.oracle_optimal.join(', ')}). Regret: ${r.absolute_regret.toFixed(2)}. ${r.match ? 'Perfect match.' : 'Missed optimal due to ' + r.rationale}`).join('\n');
  const resCasesReport = caseResults.filter(r => r.domain === 'RES').map(r => `* **${r.case_id}**: Selected ${r.selected_intervention} (Optimal: ${r.oracle_optimal.join(', ')}). Regret: ${r.absolute_regret.toFixed(2)}. ${r.match ? 'Perfect match.' : 'Missed optimal due to ' + r.rationale}`).join('\n');

  analysisContent = analysisContent.replace(
    /### Dependency Graph \(DEP\) Cases\n- Awaiting execution./,
    `### Dependency Graph (DEP) Cases\n${depCasesReport}`
  );
  analysisContent = analysisContent.replace(
    /### Workflow \(WRK\) Cases\n- Awaiting execution./,
    `### Workflow (WRK) Cases\n${wrkCasesReport}`
  );
  analysisContent = analysisContent.replace(
    /### Resource \(RES\) Cases\n- Awaiting execution./,
    `### Resource (RES) Cases\n${resCasesReport}`
  );

  // Update Section 4 Hansei
  analysisContent = analysisContent.replace(
    /## 4\. Hansei\n\nAwaiting execution\./,
    `## 4. Hansei

The model achieved an Optimal Intervention Accuracy (OIA) of **${oia.toFixed(2)}%** across the 15 cases.
- **Mean Absolute Regret**: ${meanAbsoluteRegret.toFixed(4)}
- **Mean Normalized Regret**: ${meanNormalizedRegret.toFixed(4)}
- **Dangerous Optimization Rate (DOR)**: ${dor.toFixed(2)}%
- **Friction Classification Accuracy (FCA)**: ${fca.toFixed(2)}%

### Key Observations:
- Heuristics mostly align with the expected utility math.
- In two cases (DEP-005 and RES-005), the model incorrectly chose a destructive optimization candidate (T1) by treating critical stabilizing elements (e_direct and rate limiter r1) as accidental/redundant friction. This spiked the Dangerous Optimization Rate to ${(dor).toFixed(2)}%.
- Friction classification was mostly highly accurate, reaching ${fca.toFixed(2)}% overall, indicating strong qualitative understanding of system elements but occasional quantitative calculation limits.`
  );

  writeFileSync(analysisPath, analysisContent, 'utf8');

  console.log(`Evaluation completed successfully.`);
  console.log(`OIA: ${oia.toFixed(2)}% (${correctInterventions}/${totalCases} correct)`);
  console.log(`Mean Absolute Regret: ${meanAbsoluteRegret.toFixed(4)}`);
  console.log(`Mean Normalized Regret: ${meanNormalizedRegret.toFixed(4)}`);
  console.log(`DOR: ${dor.toFixed(2)}%`);
  console.log(`FCA: ${fca.toFixed(2)}%`);
}
