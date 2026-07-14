import { describe, it, expect } from 'vitest';
import { loadBatch005Cases } from '../batch-005/cases.js';
import { applySparseFn, getCriticalNodeSpec } from './sparseFn.js';
import { evaluateOne } from './eval.js';
import { runBatch008, aggregate } from './run.js';

describe('Batch-008 SparseFN Corruption', () => {
  const cases = loadBatch005Cases();

  it('applies fn corruption to critical node capability', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;

    expect(spec.node).toBe('t2');
    expect(spec.dim).toBe('Pm');
    expect(wrk002.graph.capabilities['t2'].Pm).toBe(true);

    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    expect(cs.obsCaps['t2'].Pm).toBe(false);
    expect(cs.criticalNode).toBe('t2');
  });

  it('preserves uncorrupted capabilities', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);

    expect(cs.obsCaps['t1'].Pm).toBe(wrk002.graph.capabilities['t1'].Pm);
    expect(cs.obsCaps['t2_next']?.Pm).toBe(wrk002.graph.capabilities['t2_next']?.Pm);
  });

  it('computes boundary rhos for boundary nodes', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);

    expect(Object.keys(cs.boundaryRhos).length).toBeGreaterThan(0);
    expect(cs.boundaryRhos['t2']).toBeLessThanOrEqual(0.8);
  });
});

describe('Batch-008 Policy Evaluation', () => {
  const cases = loadBatch005Cases();

  it('AlwaysTrust stops at k=1 and may mismatch under corruption', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    const rows = evaluateOne(wrk002, cs, 0.10, 1);

    const at = rows.find(r => r.policyId === 'AlwaysTrust')!;
    expect(at.kActual).toBe(1);
    expect(at.mismatch).toBe(true);
  });

  it('AlwaysVerify expands to kMax', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    const rows = evaluateOne(wrk002, cs, 0.10, 1);

    const av = rows.find(r => r.policyId === 'AlwaysVerify')!;
    expect(av.kActual).toBe(2);
  });

  it('ProbeAlways probes once and gets optimal action', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    const rows = evaluateOne(wrk002, cs, 0.10, 1);

    const pa = rows.find(r => r.policyId === 'ProbeAlways')!;
    expect(pa.didProbe).toBe(true);
    expect(pa.kActual).toBe(2);
    expect(pa.mismatch).toBe(false);
  });

  it('ProbeReliability may probe depending on α_k and threshold', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;

    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    const rows = evaluateOne(wrk002, cs, 0.10, 1);

    const pr3 = rows.find(r => r.policyId === 'ProbeReliability0.3')!;
    expect(pr3.didProbe).toBe(pr3.alphaEstimated > 0.3);
  });
});

describe('Batch-008 Full Matrix', () => {
  it('runs 360 evaluations without error', () => {
    const results = runBatch008();
    expect(results.length).toBe(360);

    const policyCounts = new Map<string, number>();
    for (const r of results) {
      policyCounts.set(r.policyId, (policyCounts.get(r.policyId) ?? 0) + 1);
    }

    expect(policyCounts.get('AlwaysTrust')).toBe(60);
    expect(policyCounts.get('AlwaysVerify')).toBe(60);
    expect(policyCounts.get('ProbeAlways')).toBe(60);
    expect(policyCounts.get('ProbeReliability0.3')).toBe(60);
    expect(policyCounts.get('ProbeReliability0.5')).toBe(60);
    expect(policyCounts.get('ProbeReliability0.7')).toBe(60);
  });

  it('produces aggregatable results', () => {
    const results = runBatch008();
    const agg = aggregate(results);

    expect(agg['AlwaysTrust']).toBeDefined();
    expect(agg['AlwaysTrust'].n).toBe(60);
    expect(typeof agg['AlwaysTrust'].mismatchRate).toBe('number');
    expect(typeof agg['AlwaysTrust'].avgBlindnessGap).toBe('number');
  });
});
