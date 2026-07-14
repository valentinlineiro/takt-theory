import { describe, it, expect } from 'vitest';
import { calculateScorecard, CaseEvalInput } from './eval.js';
import { runEvaluation } from './evaluate.js';


describe('Batch 004 Evaluation Scorecard Metrics', () => {
  it('calculates metrics correctly for a mock set of results', () => {
    const mockResults: CaseEvalInput[] = [
      {
        caseId: 'MOCK-001',
        selectedIntervention: 'T1',
        optimalGlobal: 'T1',
        optimalLocalH1: 'T2', // NeedExpand = 1
        kActual: 2,           // K_actual > 1 (escalated)
        finishedUcert: 1,    // external escalation
        subgraphNodeCount: 2,
        subgraphEdgeCount: 3,
        globalNodeCount: 5,
        globalEdgeCount: 5,
        isDestructive: false,
      },
      {
        caseId: 'MOCK-002',
        selectedIntervention: 'T0',
        optimalGlobal: 'T0',
        optimalLocalH1: 'T0', // NeedExpand = 0
        kActual: 1,           // K_actual = 1 (not escalated)
        finishedUcert: 0,
        subgraphNodeCount: 1,
        subgraphEdgeCount: 1,
        globalNodeCount: 4,
        globalEdgeCount: 4,
        isDestructive: false,
      },
      {
        caseId: 'MOCK-003',
        selectedIntervention: 'T1',
        optimalGlobal: 'T0',  // match = false
        optimalLocalH1: 'T1', // NeedExpand = 1
        kActual: 1,           // K_actual = 1 (not escalated)
        finishedUcert: 0,
        subgraphNodeCount: 3,
        subgraphEdgeCount: 3,
        globalNodeCount: 4,
        globalEdgeCount: 4,
        isDestructive: true,
      },
      {
        caseId: 'MOCK-004',
        selectedIntervention: 'T2',
        optimalGlobal: 'T2',
        optimalLocalH1: 'T2', // NeedExpand = 0
        kActual: 2,           // K_actual > 1 (escalated)
        finishedUcert: 0,
        subgraphNodeCount: 2,
        subgraphEdgeCount: 2,
        globalNodeCount: 4,
        globalEdgeCount: 4,
        isDestructive: false,
      },
    ];

    const scorecard = calculateScorecard(mockResults);

    // OIA: 3/4 = 75.0%
    expect(scorecard.oia).toBeCloseTo(75.0, 4);
    // DOR: 1/4 = 25.0%
    expect(scorecard.dor).toBeCloseTo(25.0, 4);
    // meanSearchEffort: ( (5/10) + (2/8) + (6/8) + (4/8) ) / 4 = (0.5 + 0.25 + 0.75 + 0.5) / 4 = 2.0 / 4 = 0.50
    expect(scorecard.meanSearchEffort).toBeCloseTo(0.50, 4);
    // EER: 1/4 = 0.25
    expect(scorecard.eer).toBeCloseTo(0.25, 4);
    // ER (recall): TP / (TP + FN) = 1 / 2 = 0.5
    expect(scorecard.er).toBeCloseTo(0.5, 4);
    // EP (precision): TP / (TP + FP) = 1 / 2 = 0.5
    expect(scorecard.ep).toBeCloseTo(0.5, 4);
    // UER (false positive rate): FP / (FP + TN) = 1 / 2 = 0.5
    expect(scorecard.uer).toBeCloseTo(0.5, 4);
  });
});

describe('Batch 004 Evaluation Runner', () => {
  it('runs evaluation and returns results', () => {
    const results = runEvaluation({ dryRun: true });
    expect(results).toBeDefined();
    expect(results.local).toBeDefined();
    expect(results.global).toBeDefined();
    expect(results.adaptive).toBeDefined();
    expect(results.local.oia).toBeTypeOf('number');
  });

  it('runs evaluation and writes the report and results files', () => {
    const results = runEvaluation(); // writes files to research/
    expect(results).toBeDefined();
  });
});


