import { describe, it, expect } from 'vitest';
import { executeBatch002 } from './eval.js';

describe('Batch 002 Execution', () => {
  it('returns exact expected oracle outputs for all 12 cases', () => {
    const results = executeBatch002();
    expect(results['FSA-001']).toBe('≻');
    expect(results['FSA-002']).toBe('∥');
    expect(results['FSA-003']).toBe('≺');
    expect(results['FSA-004']).toBe('≡');
    expect(results['FLOW-001']).toBe('≻');
    expect(results['FLOW-002']).toBe('∥');
    expect(results['FLOW-003']).toBe('≺');
    expect(results['FLOW-004']).toBe('≡');
    expect(results['RAG-001']).toBe('≻');
    expect(results['RAG-002']).toBe('∥');
    expect(results['RAG-003']).toBe('≺');
    expect(results['RAG-004']).toBe('≡');
  });
});
