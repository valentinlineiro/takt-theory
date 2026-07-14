import { describe, it, expect } from 'vitest';
import { loadBatch005Cases } from '../batch-005/cases.js';
import { applySparseFn, getCriticalNodeSpec } from '../batch-008/sparseFn.js';
import { oracleImpact, weightedAlpha } from './oracleImpact.js';
import { evaluateOne } from './eval.js';

describe('Batch-009 Oracle Impact', () => {
  const cases = loadBatch005Cases();

  it('computes nonzero Impact for decision-relevant nodes', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const im = oracleImpact(wrk002);
    expect(im['t2']).toBe(1);
    expect(im['t1']).toBe(0);
    expect(im['t2_next']).toBe(0);
  });

  it('survives fn corruption (Impact from M_true)', () => {
    const wrk002 = cases.find(c => c.id === 'WRK-002')!;
    const spec = getCriticalNodeSpec('WRK-002')!;
    const cs = applySparseFn(wrk002, spec, 0.10, 42);
    const im = oracleImpact(wrk002);
    expect(im['t2']).toBe(1);
  });

  it('WRK-003 oracle Impact is 1 for all Pm nodes', () => {
    const wrk003 = cases.find(c => c.id === 'WRK-003')!;
    const im = oracleImpact(wrk003);
    expect(im['t2']).toBe(1);
    expect(im['t2_next']).toBe(1);
    expect(im['decoy_t3']).toBe(1);
  });

  it('DEP-005 oracle Impact is 1 for v3 (Pr), 0 for t (blank)', () => {
    const dep005 = cases.find(c => c.id === 'DEP-005')!;
    const im = oracleImpact(dep005);
    expect(im['v3']).toBe(1);
    expect(im['t']).toBe(0);
  });
});

describe('Batch-009 WeightedAlpha', () => {
  it('computes α_w from boundaryRhos and oracle Impacts', () => {
    const rhos = { v1: 0.8, v2: 1.0 };
    const impacts = { v1: 1, v2: 0 };
    const aw = weightedAlpha(rhos, impacts);
    expect(aw).toBeCloseTo(0.2, 5);
  });

  it('falls back to 1 when no boundary node has Impact > 0', () => {
    const rhos = { v1: 0.8 };
    const impacts = { v1: 0 };
    expect(weightedAlpha(rhos, impacts)).toBe(1);
  });

  it('matches median when all boundary nodes have equal Impact', () => {
    const rhos = { v1: 0.8, v2: 1.0 };
    const impacts = { v1: 1, v2: 1 };
    const aw = weightedAlpha(rhos, impacts);
    expect(aw).toBeCloseTo(0.1, 5);
  });

  it('DEP-005: t (Impact=0) weighted at ρ=1.0 is excluded from numerator', () => {
    const rhos = { v3: 0.8, t: 1.0 };
    const impacts = { v3: 1, t: 0 };
    const aw = weightedAlpha(rhos, impacts);
    expect(aw).toBeCloseTo(0.2, 5);
  });
});

describe('Batch-009 Policy Evaluation', () => {
  const cases = loadBatch005Cases();

  it('ProbeWeighted@0.3 probes on DEP-005 (α_w=0.2 < 0.3 → no probe)', () => {
    const dep005 = cases.find(c => c.id === 'DEP-005')!;
    const spec = getCriticalNodeSpec('DEP-005')!;
    const cs = applySparseFn(dep005, spec, 0.10, 42);
    const im = oracleImpact(dep005);
    const rows = evaluateOne(dep005, cs, 0.10, 1, im);
    const pw = rows.find(r => r.policyId === 'ProbeWeighted0.3')!;
    expect(pw.didProbe).toBe(false);
  });

  it('ProbeWeighted@0.3 has higher α on DEP-005 than ProbeReliability@0.3', () => {
    const dep005 = cases.find(c => c.id === 'DEP-005')!;
    const spec = getCriticalNodeSpec('DEP-005')!;
    const cs = applySparseFn(dep005, spec, 0.10, 42);
    const im = oracleImpact(dep005);
    const rows = evaluateOne(dep005, cs, 0.10, 1, im);
    const pr = rows.find(r => r.policyId === 'ProbeReliability0.3')!;
    const pw = rows.find(r => r.policyId === 'ProbeWeighted0.3')!;
    expect(pw.alphaEstimated).toBeGreaterThan(pr.alphaEstimated);
  });
});

describe('Batch-009 Full Matrix', () => {
  it('runs 540 evaluations without error', async () => {
    const m = await import('./run.js');
    const results = m.runBatch009();
    expect(results.length).toBe(540);

    const policyCounts = new Map<string, number>();
    for (const r of results) {
      policyCounts.set(r.policyId, (policyCounts.get(r.policyId) ?? 0) + 1);
    }

    expect(policyCounts.get('ProbeWeighted0.3')).toBe(60);
    expect(policyCounts.get('ProbeWeighted0.5')).toBe(60);
    expect(policyCounts.get('ProbeWeighted0.7')).toBe(60);

    const agg = m.aggregate(results);
    expect(agg['ProbeWeighted0.3'].probeRate).toBeDefined();
  });
});
