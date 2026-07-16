import { describe, it, expect } from 'vitest';

// Audit setup representing OOD drift
interface State {
  id: string;
  rep: number;
  decision: number;
}

const S_audit: State[] = [
  { id: 'a1', rep: -1, decision: 0 },
  { id: 'a2', rep: -1, decision: 0 },
  { id: 'a3', rep: 0, decision: 1 },
];

const S_real: State[] = [
  ...S_audit,
  { id: 'r_ood', rep: -1, decision: 1 }, // OOD Collision: rep = -1, but decision = 1
];

const T = ['a2', 'a3'];
const pi = (rep: number) => rep <= -1 ? 0 : 1;

function evaluateContract(states: State[], testIds: string[], policy: (r: number) => number) {
  // 1. Empirical safety on T
  const testStates = states.filter(s => testIds.includes(s.id));
  for (const x of testStates) {
    for (const y of testStates) {
      if (x.rep === y.rep && x.decision !== y.decision) {
        return false;
      }
    }
  }
  // 2. Fiber Coverage
  for (const x of states) {
    const covered = testStates.some(t => t.rep === x.rep && t.decision === x.decision);
    if (!covered) return false;
  }
  // 3. Policy alignment on T
  for (const x of testStates) {
    if (policy(x.rep) !== x.decision) return false;
  }
  return true;
}

describe('RT-001 False Coverage Attack', () => {
  it('succeeds in bypassing contract satisfied state to cause real decision loss', () => {
    // Contract evaluated on audited space S_audit
    const auditSatisfied = evaluateContract(S_audit, T, pi);
    expect(auditSatisfied).toBe(true);

    // Real execution Loss on S_real
    const loss = S_real.filter(s => pi(s.rep) !== s.decision).length / S_real.length;
    expect(loss).toBeGreaterThan(0); // Success condition: Loss > 0 while Contract = True
    console.log(`[RT-001 Results] Contract satisfied: ${auditSatisfied}, Real Loss: ${loss.toFixed(2)}`);
  });
});
