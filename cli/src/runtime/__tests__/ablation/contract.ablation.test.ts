import { describe, it, expect } from 'vitest';
import { ContractEvaluator } from '../../ContractEvaluator.js';
import { AuditPolicy } from '../../AuditPolicy.js';
import { createWitnessArtifact } from './witnesses.js';

describe('EXP-004: Contract Soundness Ablation (C_contract)', () => {
  it('isolates a contract witness where ContractEvaluator detects domain contract violations', () => {
    const policy = new AuditPolicy();
    const evaluator = new ContractEvaluator(0.3);

    const decision = policy.decide(1.0, 0.5); // MONITOR decision under safe margin

    // Full runtime with ContractEvaluator evaluating state with loss / contract violation
    evaluator.evaluate(decision, { loss: true });
    const fullReport = evaluator.report();
    const fullDecisionStatus = fullReport.violationCount > 0 ? 'STOP_AND_REPORT_VIOLATION' : decision.action;

    // Ablated runtime without ContractEvaluator (silent execution ignoring loss)
    const reducedDecisionStatus = decision.action; // MONITOR

    const artifact = createWitnessArtifact(
      'ContractSoundness',
      { decision, loss: true, report: fullReport },
      fullDecisionStatus,
      reducedDecisionStatus,
      {
        preservedState: true,
        violatedAssumption: 'Contract(R) === false under external loss payload',
      }
    );

    expect(fullReport.violationCount).toBe(1);
    expect(fullDecisionStatus).toBe('STOP_AND_REPORT_VIOLATION');
    expect(reducedDecisionStatus).toBe('MONITOR');
    expect(fullDecisionStatus).not.toBe(reducedDecisionStatus);
    expect(artifact.isWitness).toBe(true);
  });
});
