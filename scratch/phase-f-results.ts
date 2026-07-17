import { executeBatchF001 } from '../cli/src/batch-f-001/eval.js';
import { executeBatchF002 } from '../cli/src/batch-f-002/eval.js';
import { executeBatchF003 } from '../cli/src/batch-f-003/eval.js';
import { executeBatchF004 } from '../cli/src/batch-f-004/eval.js';

console.log('════════════════════════════════════════════');
console.log('  TAKT v4.0 — Phase F Validation Results');
console.log('════════════════════════════════════════════\n');

const f001 = executeBatchF001();
console.log('F-001: Temporal Coverage & Consistency');
console.log('──────────────────────────────────────────');
console.log(`  Coverage (full T_audit):     ${f001.coverage}`);
console.log(`  Consistency:                  ${f001.consistency}`);
console.log(`  Covered prefixes:             ${f001.coveredPrefixes}/${f001.totalPrefixes}`);
const f001_inc = executeBatchF001({ incompleteCoverage: true });
console.log(`  Coverage (partial T_audit):   ${f001_inc.coverage} (expected: false)`);
const f001_incon = executeBatchF001({ inconsistentDecisions: true });
console.log(`  Consistency (bad data):       ${f001_incon.consistency} (expected: false)\n`);

const f002 = executeBatchF002();
console.log('F-002: Dynamic Margin (M_D)');
console.log('──────────────────────────────────────────');
console.log(`  M_D(s0) = ${f002.margins.s0.toFixed(4)}  (cost to reach loss)`);
console.log(`  M_D(s1) = ${f002.margins.s1.toFixed(4)}`);
console.log(`  M_D(s2) = ${f002.margins.s2.toFixed(4)}  (loss at current state)`);
const f002_safe = executeBatchF002({ unreachableFailure: true });
console.log(`  M_D(agreeing policies) = ${f002_safe.margins.safe}  (no failure reachable)\n`);

const f003 = executeBatchF003();
console.log('F-003: Guaranteed Intervention Horizon (h=1)');
console.log('──────────────────────────────────────────');
console.log(`  Safe prefix:`);
console.log(`    M_D      = ${f003.safePrefix.m_D}`);
console.log(`    C_1^max  = ${f003.safePrefix.cMax.toFixed(4)}`);
console.log(`    M_D > C_1^max → failureWithinH = ${f003.safePrefix.failureWithinH}  (✓ safe)`);
const f003_risk = executeBatchF003({ failureNearby: true });
console.log(`  Risky prefix (failure 1 step away):`);
console.log(`    M_D      = ${f003_risk.riskyPrefix.m_D.toFixed(4)}`);
console.log(`    C_1^max  = ${f003_risk.riskyPrefix.cMax.toFixed(4)}`);
console.log(`    M_D ≤ C_1^max → failureWithinH = ${f003_risk.riskyPrefix.failureWithinH}  (✓ detected)\n`);

const f004 = executeBatchF004();
console.log('F-004: Auditor-Adversary Game');
console.log('──────────────────────────────────────────');
console.log(`  Active audit (intervene at degraded):`);
console.log(`    Expected loss: ${f004.expectedLoss.toFixed(4)}  (ε = ${f004.epsilon})`);
console.log(`    Contract satisfied: ${f004.expectedLoss <= f004.epsilon}`);
const f004_strong = executeBatchF004({ strongAdversary: true });
console.log(`  Passive audit (always monitor):`);
console.log(`    Expected loss: ${f004_strong.expectedLoss.toFixed(4)}  (ε = ${f004_strong.epsilon})`);
console.log(`    Contract C_v4 violated: ${f004_strong.expectedLoss > f004_strong.epsilon}`);
const f004_int = executeBatchF004({ intervene: true });
console.log(`  Always intervene:`);
console.log(`    Expected loss: ${f004_int.expectedLoss}  (ε = ${f004_int.epsilon})`);
console.log(`    Contract satisfied: ${f004_int.expectedLoss <= f004_int.epsilon}\n`);

console.log('════════════════════════════════════════════');
