import { describe, it, expect } from 'vitest';
import { runBaselineLocal, runBaselineGlobal, runBaselineAdaptive } from './baselines.js';
import { loadBatch005Cases, evaluateCaseUtility, solveCaseOracle } from './cases.js';
import { extractObservableSubgraph } from './estimator.js';

describe('Batch-005 Baseline Runners', () => {
  it('runs local, global, and adaptive baselines on case systems successfully', () => {
    const cases = loadBatch005Cases();

    const dep001 = cases.find(c => c.id === 'DEP-001')!;

    const resLocalA = runBaselineLocal(dep001);
    const resGlobalA = runBaselineGlobal(dep001);
    const resAdaptiveA = runBaselineAdaptive(dep001, 2);

    expect(resLocalA).toBe('T0');
    expect(resGlobalA).toBe('T0');
    expect(resAdaptiveA.intervention).toBe('T0');
    expect(resAdaptiveA.kActual).toBe(1);
    expect(resAdaptiveA.finishedUcert).toBe(0);

    // Test case DEP-003 (Case C: escalates to global = T0)
    const dep003 = cases.find(c => c.id === 'DEP-003')!;
    const resLocalC = runBaselineLocal(dep003);
    const resGlobalC = runBaselineGlobal(dep003);
    const resAdaptiveC = runBaselineAdaptive(dep003, 2);

    expect(resLocalC).toBe('T0');
    expect(resGlobalC).toBe('T0');
    expect(resAdaptiveC.intervention).toBe('T0');
    expect(resAdaptiveC.kActual).toBe(2);
    expect(resAdaptiveC.finishedUcert).toBe(1); // Escalated
  });
});
