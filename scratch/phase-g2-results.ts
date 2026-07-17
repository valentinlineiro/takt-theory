import { executeBatchG2001 } from '../cli/src/batch-g2-001/eval.js';
import { executeBatchG2002 } from '../cli/src/batch-g2-002/eval.js';
import { executeBatchG2003 } from '../cli/src/batch-g2-003/eval.js';
import { executeBatchG2004 } from '../cli/src/batch-g2-004/eval.js';

console.log('════════════════════════════════════════════');
console.log('  TAKT v4.0 — Phase G2 Validation Results');
console.log('════════════════════════════════════════════\n');

const g2001 = executeBatchG2001();
console.log('G2-001: Optimistic Model Adversary');
console.log('──────────────────────────────────────────');
console.log(`  P_hat(fail)          = ${g2001.pHatFail}`);
console.log(`  epsilon(s0,a0)       = ${g2001.epsilon}`);
console.log(`  P*(fail) [edge]      = ${g2001.pTrueFail}`);
console.log(`  M_D(P*)  [true]      = ${g2001.mdTrue}`);
console.log(`  M_D_safe [robust]    = ${g2001.mdSafe}`);
console.log(`  Invariant M_D_safe <= M_D(P*): ${g2001.invariantHolds}\n`);

const g2002 = executeBatchG2002();
console.log('G2-002: Uncertainty Collapse Adversary');
console.log('──────────────────────────────────────────');
console.log(`  drift                = ${g2002.drift}  (tau = ${g2002.tau})`);
console.log(`  driftDetected        = ${g2002.driftDetected}`);
console.log(`  naive M_D_safe       = ${g2002.naiveMarginSafe}  (threshold = 1.0)`);
console.log(`  naive falsely safe?  = ${g2002.naiveWouldFalselyMonitor}`);
console.log(`  AuditPolicy decision = ${g2002.decisionWithMonitor}\n`);

const g2003 = executeBatchG2003();
console.log('G2-003: Sparse Observation Boundary (characterization)');
console.log('──────────────────────────────────────────');
console.log(`  epsilon(observed s0_a)   = ${g2003.observedPairEpsilon}`);
console.log(`  epsilon(unobserved s0_b) = ${g2003.unobservedPairEpsilon}`);
console.log(`  M_D(observed)            = ${g2003.observedPairMD}`);
console.log(`  M_D(unobserved)          = ${g2003.unobservedPairMD}`);
console.log(`  Excess conservatism gap  = ${g2003.excessConservatismGap}\n`);

const g2004 = executeBatchG2004();
console.log('G2-004: Distribution Shift Adversary + Recovery');
console.log('──────────────────────────────────────────');
console.log(`  epsilon before shift               = ${g2004.preShiftEpsilon}`);
console.log(`  drift after shift                  = ${g2004.driftAfterShift}  (tau = ${g2004.tau})`);
console.log(`  recalibrated?                      = ${g2004.recalibrated}`);
console.log(`  epsilon immediately post-recovery  = ${g2004.postRecoveryEpsilonImmediate}`);
console.log(`  M_D_safe post-recovery             = ${g2004.postRecoveryMDSafe}  (threshold = 1.0)`);
console.log(`  decision post-recovery             = ${g2004.postRecoveryDecision}`);

console.log('\n════════════════════════════════════════════');
