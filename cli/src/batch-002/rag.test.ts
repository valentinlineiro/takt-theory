import { describe, it, expect } from 'vitest';
import { computeRagOracle, RagCase } from './rag.js';

describe('RAG Oracle', () => {
  it('computes dominating deadlock resolution (RAG-001) - ≻', () => {
    const rag001: RagCase = {
      id: 'RAG-001',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 1, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r2' }],
      afterAllocations: [{ from: 'r2', to: 'p2' }]
    };
    expect(computeRagOracle(rag001)).toBe('≻');
  });

  it('computes equivalence when nothing changes - ≡', () => {
    const caseEquiv: RagCase = {
      id: 'RAG-EQUIV',
      processes: ['p1'],
      resources: ['r1'],
      beforeCapacities: { r1: 1 },
      beforeRequests: [],
      beforeAllocations: [],
      afterCapacities: { r1: 1 },
      afterRequests: [],
      afterAllocations: []
    };
    expect(computeRagOracle(caseEquiv)).toBe('≡');
  });

  it('computes precedence when state degrades (deadlock introduced, more edges) - ≺', () => {
    const casePrec: RagCase = {
      id: 'RAG-PREC',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }],
      beforeAllocations: [{ from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 1, r2: 1 },
      afterRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      afterAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }]
    };
    expect(computeRagOracle(casePrec)).toBe('≺');
  });

  it('computes parallel when resolution improves but complexity/cost increases - ∥', () => {
    const caseParallel: RagCase = {
      id: 'RAG-PARALLEL',
      processes: ['p1', 'p2'],
      resources: ['r1', 'r2'],
      beforeCapacities: { r1: 1, r2: 1 },
      beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
      beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
      afterCapacities: { r1: 2, r2: 2 },
      afterRequests: [{ from: 'p1', to: 'r2' }],
      afterAllocations: [{ from: 'r2', to: 'p2' }, { from: 'r1', to: 'p1' }, { from: 'r2', to: 'p1' }]
    };
    expect(computeRagOracle(caseParallel)).toBe('∥');
  });
});
