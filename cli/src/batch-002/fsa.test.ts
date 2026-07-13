import { describe, it, expect } from 'vitest';
import { computeFsaOracle, FsaCase } from './fsa.js';

describe('FSA Oracle', () => {
  it('computes dominating optimization (FSA-001) - ≻', () => {
    const fsa001: FsaCase = {
      id: 'FSA-001',
      states: ['v0', 'v1', 'v2', 'v3', 'v4'],
      startState: 'v0',
      terminalStates: ['v3', 'v4'],
      beforeTransitions: [
        { from: 'v0', to: 'v1', cost: 4 },
        { from: 'v0', to: 'v2', cost: 5 },
        { from: 'v1', to: 'v3', cost: 2 },
        { from: 'v2', to: 'v4', cost: 3 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v1', cost: 4 },
        { from: 'v0', to: 'v2', cost: 2 },
        { from: 'v1', to: 'v3', cost: 2 },
        { from: 'v2', to: 'v4', cost: 3 }
      ]
    };
    expect(computeFsaOracle(fsa001)).toBe('≻');
  });

  it('computes equivalence - ≡', () => {
    const caseData: FsaCase = {
      id: 'FSA-EQ',
      states: ['v0', 'v1', 'v2'],
      startState: 'v0',
      terminalStates: ['v2'],
      beforeTransitions: [
        { from: 'v0', to: 'v1', cost: 1 },
        { from: 'v1', to: 'v2', cost: 2 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v1', cost: 1 },
        { from: 'v1', to: 'v2', cost: 2 }
      ]
    };
    expect(computeFsaOracle(caseData)).toBe('≡');
  });

  it('computes preceded relation - ≺', () => {
    const caseData: FsaCase = {
      id: 'FSA-PREC',
      states: ['v0', 'v1', 'v2'],
      startState: 'v0',
      terminalStates: ['v2'],
      beforeTransitions: [
        { from: 'v0', to: 'v1', cost: 1 },
        { from: 'v1', to: 'v2', cost: 2 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v1', cost: 5 },
        { from: 'v1', to: 'v2', cost: 2 }
      ]
    };
    expect(computeFsaOracle(caseData)).toBe('≺');
  });

  it('computes parallel relation - ∥', () => {
    const caseData: FsaCase = {
      id: 'FSA-PARALLEL',
      states: ['v0', 'v1', 'v2', 'v3'],
      startState: 'v0',
      terminalStates: ['v2', 'v3'],
      beforeTransitions: [
        { from: 'v0', to: 'v2', cost: 2 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v2', cost: 4 },
        { from: 'v0', to: 'v3', cost: 5 }
      ]
    };
    // before: reached = 1, minCost = 2
    // after: reached = 2, minCost = 4
    // g2 (2) > g1 (1) but e2 (4) > e1 (2) -> ∥
    expect(computeFsaOracle(caseData)).toBe('∥');
  });

  it('handles unreachable terminal states', () => {
    const caseData: FsaCase = {
      id: 'FSA-UNREACHABLE',
      states: ['v0', 'v1', 'v2'],
      startState: 'v0',
      terminalStates: ['v2'],
      beforeTransitions: [
        { from: 'v0', to: 'v1', cost: 1 }
      ],
      afterTransitions: [
        { from: 'v0', to: 'v1', cost: 1 }
      ]
    };
    expect(computeFsaOracle(caseData)).toBe('≡');
  });
});
