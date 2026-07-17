import { describe, it, expect } from 'vitest';
import { checkCoverage, checkConsistency } from './coverage.js';
import { observationallyEquivalent } from './trajectory.js';

interface TestState { id: string; rep: number; decision: number; }
interface TestAction { id: string; value: number; }
interface TestObs { rep: number; }

const O = (s: TestState): TestObs => ({ rep: s.rep });

// D: ideal policy that maps prefix to optimal action
function D(prefix: { states: TestState[]; actions: TestAction[] }): TestAction {
  const s = prefix.states[prefix.states.length - 1];
  return { id: `a${s.decision}`, value: s.decision };
}

// π: agent policy that maps observations to actions
function π(obs: TestObs[]): TestAction {
  const last = obs[obs.length - 1];
  return { id: `a${last.rep}`, value: last.rep };
}

describe('Coverage and Consistency', () => {
  const s0: TestState = { id: 's0', rep: 0, decision: 0 };
  const s1: TestState = { id: 's1', rep: 0, decision: 1 };
  const s2: TestState = { id: 's2', rep: 1, decision: 1 };

  it('detects full coverage when T_audit covers all observation classes', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [s2], actions: [] as TestAction[] },
    ];
    const allPrefixes = [
      { states: [s1], actions: [] as TestAction[] },
    ];
    const result = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
    expect(result).toBe(true);
  });

  it('detects coverage failure when an observation class is missing', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
    ];
    const allPrefixes = [
      { states: [s2], actions: [] as TestAction[] },
    ];
    const result = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
    expect(result).toBe(false);
  });

  it('detects consistency when equivalent prefixes yield same D', () => {
    // same rep=0 and same decision=0 → observationally equivalent AND same D
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [{ id: 's1', rep: 0, decision: 0 }], actions: [] as TestAction[] },
    ];
    expect(checkConsistency(T_audit, D, O, observationallyEquivalent)).toBe(true);
  });

  it('detects inconsistency when equivalent prefixes yield different D', () => {
    const T_audit = [
      { states: [s0], actions: [] as TestAction[] },
      { states: [s1], actions: [] as TestAction[] },
    ];
    expect(checkConsistency(T_audit, D, O, observationallyEquivalent)).toBe(false);
  });
});
