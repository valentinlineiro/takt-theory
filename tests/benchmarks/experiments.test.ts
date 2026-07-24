import { describe, it, expect, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { runExperiment001 } from '../../benchmarks/experiments/exp-001-kernel-scaling.js';
import { runExperiment002 } from '../../benchmarks/experiments/exp-002-evsi-stopping.js';
import { runExperiment003 } from '../../benchmarks/experiments/exp-003-runtime-latency.js';
import { runExperiment004 } from '../../benchmarks/experiments/exp-004-drift-horizon.js';
import { DatasetWriter } from '../../benchmarks/metrics/DatasetWriter.js';

describe('Experiment Orchestrators & CLI Suite', () => {
  const testOutputDir = path.join(process.cwd(), 'benchmarks', 'test-datasets');

  afterAll(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it('EXP-001: should execute all 6 paradigms side-by-side and produce valid dataset', async () => {
    const dataset = await runExperiment001(42);

    expect(dataset.experiment.id).toBe('EXP-001');
    expect(dataset.experiment.protocol).toBe('benchmarks/protocols/exp-001-protocol.md');
    expect(dataset.provenance.seed).toBe(42);
    expect(dataset.provenance.gitCommit).toBeDefined();
    expect(dataset.provenance.hardware.cpus).toBeGreaterThan(0);

    expect(dataset.results.length).toBe(6);
    const paradigms = dataset.results.map((r) => r.paradigm);
    expect(paradigms).toEqual(['naive', 'static-rules', 'overcompressed', 'exhaustive', 'pomdp', 'takt']);

    const taktResult = dataset.results.find((r) => r.paradigm === 'takt');
    expect(taktResult).toBeDefined();
    expect(taktResult?.metrics.totalSteps).toBe(100);
  });

  it('EXP-002: should evaluate EVSI stopping policy across all 5 paradigms', async () => {
    const dataset = await runExperiment002(42);

    expect(dataset.experiment.id).toBe('EXP-002');
    expect(dataset.results.length).toBe(5);

    const taktResult = dataset.results.find((r) => r.paradigm === 'takt');
    const exhaustiveResult = dataset.results.find((r) => r.paradigm === 'exhaustive');

    expect(taktResult).toBeDefined();
    expect(exhaustiveResult).toBeDefined();
  });

  it('EXP-003: should evaluate real-time event stream monitoring latency', async () => {
    const dataset = await runExperiment003(42);

    expect(dataset.experiment.id).toBe('EXP-003');
    expect(dataset.results.length).toBe(5);

    for (const res of dataset.results) {
      expect(res.metrics.totalSteps).toBe(200);
      expect(res.metrics.averageStepLatencyMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('EXP-004: should guarantee zero safety violations under dynamic horizon h*', async () => {
    const dataset = await runExperiment004(42);

    expect(dataset.experiment.id).toBe('EXP-004');
    expect(dataset.results.length).toBe(5);

    const taktResult = dataset.results.find((r) => r.paradigm === 'takt');
    expect(taktResult).toBeDefined();
    expect(taktResult?.metrics.safetyViolationCount).toBe(0);
    expect(taktResult?.metrics.totalDecisionRegret).toBe(0);
  });

  it('DatasetWriter: should persist experiment dataset to disk reproducibly', async () => {
    const dataset = await runExperiment001(100);
    const filePath = DatasetWriter.writeToFile(dataset, testOutputDir);

    expect(fs.existsSync(filePath)).toBe(true);

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    expect(parsed.experiment.id).toBe('EXP-001');
    expect(parsed.provenance.seed).toBe(100);
    expect(parsed.results.length).toBe(6);
  });

  it('Reproducibility: executing experiment with same seed yields identical deterministic metric results', async () => {
    const runA = await runExperiment001(777);
    const runB = await runExperiment001(777);

    const metricsA = runA.results.map(r => ({
      runnerId: r.runnerId,
      paradigm: r.paradigm,
      netValueEnrichment: r.metrics.netValueEnrichment,
      totalDecisionRegret: r.metrics.totalDecisionRegret,
      safetyViolationCount: r.metrics.safetyViolationCount
    }));

    const metricsB = runB.results.map(r => ({
      runnerId: r.runnerId,
      paradigm: r.paradigm,
      netValueEnrichment: r.metrics.netValueEnrichment,
      totalDecisionRegret: r.metrics.totalDecisionRegret,
      safetyViolationCount: r.metrics.safetyViolationCount
    }));

    expect(metricsA).toEqual(metricsB);
  });
});
