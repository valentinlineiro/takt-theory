import { describe, it, expect } from 'vitest';
import { computeFlowOracle, FlowCase } from './flow.js';

describe('Flow Oracle', () => {
  it('computes dominating flow (FLOW-001)', () => {
    const flow001: FlowCase = {
      id: 'FLOW-001',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 10 },
        { from: 'v2', to: 't', cap: 5 }
      ]
    };
    expect(computeFlowOracle(flow001)).toBe('≻');
  });

  it('computes incomparable flow (FLOW-002)', () => {
    const flow002: FlowCase = {
      id: 'FLOW-002',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 10 },
        { from: 'v2', to: 't', cap: 10 }
      ]
    };
    expect(computeFlowOracle(flow002)).toBe('∥');
  });

  it('computes degrading flow (FLOW-003)', () => {
    const flow003: FlowCase = {
      id: 'FLOW-003',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 15 }
      ]
    };
    expect(computeFlowOracle(flow003)).toBe('≺');
  });

  it('computes equivalent flow (FLOW-004)', () => {
    const flow004: FlowCase = {
      id: 'FLOW-004',
      vertices: ['s', 'v1', 'v2', 't'],
      source: 's',
      sink: 't',
      beforeEdges: [
        { from: 's', to: 'v1', cap: 10 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 10 }
      ],
      afterEdges: [
        { from: 's', to: 'v1', cap: 8 },
        { from: 's', to: 'v2', cap: 5 },
        { from: 'v1', to: 't', cap: 5 },
        { from: 'v2', to: 't', cap: 12 }
      ]
    };
    expect(computeFlowOracle(flow004)).toBe('≡');
  });
});
