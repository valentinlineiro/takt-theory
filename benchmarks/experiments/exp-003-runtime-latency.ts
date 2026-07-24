import { execSync } from 'node:child_process';
import { StateSpaceGenerator } from '../scenarios/synthetic/StateSpaceGenerator.js';
import { MetricCollector } from '../metrics/MetricCollector.js';
import { DatasetWriter, type ExperimentDataset } from '../metrics/DatasetWriter.js';
import { NaiveRunner } from '../baselines/NaiveRunner.js';
import { StaticRulesRunner } from '../baselines/StaticRulesRunner.js';
import { ExhaustiveRunner } from '../baselines/ExhaustiveRunner.js';
import { POMDPRunner } from '../baselines/POMDPRunner.js';
import { TaktRunner } from '../takt/TaktRunner.js';
import type { ScenarioConfig, BenchmarkRunner } from '../interface/BenchmarkRunner.js';

function getGitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'c580608';
  }
}

export async function runExperiment003(seed = 42): Promise<ExperimentDataset> {
  const config: ScenarioConfig = {
    id: 'synth-runtime-latency',
    seed,
    stateSpaceSize: 50000,
    kernelDimensionK: 6,
    capabilityCatalogSize: 15,
    maxDriftRate: 0.005,
    params: { experiment: 'EXP-003' }
  };

  const generator = new StateSpaceGenerator(config);
  const events = generator.generateEvents(200);

  const runners: BenchmarkRunner[] = [
    new NaiveRunner(),
    new StaticRulesRunner(),
    new ExhaustiveRunner(),
    new POMDPRunner(),
    new TaktRunner()
  ];

  const results: Array<{ runnerId: string; paradigm: string; metrics: ReturnType<MetricCollector['getSummary']> }> = [];

  for (const runner of runners) {
    await runner.reset(config);
    const collector = new MetricCollector(runner.id, runner.paradigm);

    for (const event of events) {
      const step = await runner.step(event);
      collector.record(event, step);
    }

    await runner.finalize();
    results.push({
      runnerId: runner.id,
      paradigm: runner.paradigm,
      metrics: collector.getSummary()
    });
  }

  return DatasetWriter.createDataset(
    'EXP-003',
    'benchmarks/protocols/exp-003-protocol.md',
    config,
    getGitCommit(),
    results
  );
}
