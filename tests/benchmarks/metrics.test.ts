import { describe, it, expect, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { MetricCollector } from '../../benchmarks/metrics/MetricCollector.js';
import { DatasetWriter } from '../../benchmarks/metrics/DatasetWriter.js';
import type { ConcreteEvent, ExecutionStep, ScenarioConfig } from '../../benchmarks/interface/BenchmarkRunner.js';

describe('MetricCollector', () => {
  it('initializes with default zeroed summary when no events recorded', () => {
    const collector = new MetricCollector('runner-1', 'takt');
    expect(collector.runnerId).toBe('runner-1');
    expect(collector.paradigm).toBe('takt');

    const summary = collector.getSummary();
    expect(summary.totalSteps).toBe(0);
    expect(summary.totalDurationMs).toBe(0);
    expect(summary.averageStepLatencyMs).toBe(0);
    expect(summary.peakMemoryBytes).toBe(0);
    expect(summary.netValueEnrichment).toBe(0);
    expect(summary.totalDecisionRegret).toBe(0);
    expect(summary.safetyViolationCount).toBe(0);
  });

  it('correctly aggregates steps, regret, violations, latency, peak memory, and NVE', () => {
    const collector = new MetricCollector('runner-1', 'takt');

    const event1: ConcreteEvent = {
      stepIndex: 0,
      rawStateId: 'state-0',
      concreteStateVector: [1, 0],
      trueDecision: 2,
      availableActions: [0, 1, 2]
    };

    const step1: ExecutionStep = {
      stepIndex: 0,
      actionChosen: 2, // correct match -> 0 regret
      observationsAcquired: ['obs-a'],
      acquisitionCostIncurred: 0.2,
      latencyMs: 15,
      memoryAllocatedBytes: 1024
    };

    const event2: ConcreteEvent = {
      stepIndex: 1,
      rawStateId: 'state-1',
      concreteStateVector: [0, 1],
      trueDecision: 1,
      availableActions: [0, 1, 2]
    };

    const step2: ExecutionStep = {
      stepIndex: 1,
      actionChosen: 0, // mismatch -> regret +1, violation +1
      observationsAcquired: ['obs-b', 'obs-c'],
      acquisitionCostIncurred: 0.5,
      latencyMs: 25,
      memoryAllocatedBytes: 2048
    };

    collector.record(event1, step1);
    collector.record(event2, step2);

    const summary = collector.getSummary();
    expect(summary.totalSteps).toBe(2);
    expect(summary.totalDurationMs).toBe(40);
    expect(summary.averageStepLatencyMs).toBe(20);
    expect(summary.peakMemoryBytes).toBe(2048);
    expect(summary.totalDecisionRegret).toBe(1);
    expect(summary.safetyViolationCount).toBe(1);

    // Accuracy gain = 2 total steps - 1 regret = 1
    // Total cost = 0.2 + 0.5 = 0.7
    // NVE = 1 - 0.7 = 0.3
    expect(summary.netValueEnrichment).toBeCloseTo(0.3);
  });
});

describe('DatasetWriter', () => {
  const tempDir = path.join(os.tmpdir(), `takt-metrics-test-${Date.now()}`);

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  const sampleConfig: ScenarioConfig = {
    id: 'scenario-alpha',
    seed: 42,
    stateSpaceSize: 100,
    kernelDimensionK: 5,
    capabilityCatalogSize: 10,
    maxDriftRate: 0.05,
    params: { debug: true }
  };

  it('creates an ExperimentDataset object with hardware and run provenance', () => {
    const collector = new MetricCollector('runner-takt', 'takt');
    const summary = collector.getSummary();

    const dataset = DatasetWriter.createDataset(
      'exp-001',
      'protocols/exp-001.json',
      sampleConfig,
      'abc1234',
      [{ runnerId: collector.runnerId, paradigm: collector.paradigm, metrics: summary }]
    );

    expect(dataset.provenance.gitCommit).toBe('abc1234');
    expect(dataset.provenance.seed).toBe(42);
    expect(dataset.provenance.nodeVersion).toBe(process.version);
    expect(dataset.provenance.hardware.cpus).toBeGreaterThan(0);
    expect(dataset.provenance.hardware.totalMemoryBytes).toBeGreaterThan(0);

    expect(dataset.experiment.id).toBe('exp-001');
    expect(dataset.experiment.protocol).toBe('protocols/exp-001.json');
    expect(dataset.experiment.scenarioConfig).toEqual(sampleConfig);

    expect(dataset.results).toHaveLength(1);
    expect(dataset.results[0].runnerId).toBe('runner-takt');
    expect(dataset.results[0].paradigm).toBe('takt');
  });

  it('writes dataset JSON file to specified directory creating it if non-existent', () => {
    const dataset = DatasetWriter.createDataset(
      'exp-002',
      'protocols/exp-002.json',
      sampleConfig,
      'def5678',
      []
    );

    const targetSubDir = path.join(tempDir, 'nested', 'output');
    const filePath = DatasetWriter.writeToFile(dataset, targetSubDir);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(filePath).toBe(path.join(targetSubDir, 'exp-002-seed-42.json'));

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.experiment.id).toBe('exp-002');
    expect(parsed.provenance.gitCommit).toBe('def5678');
  });
});
