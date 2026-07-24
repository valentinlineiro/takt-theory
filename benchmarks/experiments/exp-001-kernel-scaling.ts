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

export async function runExperiment001(seed = 42): Promise<ExperimentDataset> {
  const config: ScenarioConfig = {
    id: 'synth-k8-s100k',
    seed,
    stateSpaceSize: 100000,
    kernelDimensionK: 8,
    capabilityCatalogSize: 20,
    maxDriftRate: 0.01,
    params: { experiment: 'EXP-001' }
  };

  const generator = new StateSpaceGenerator(config);
  const events = generator.generateEvents(100);

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
    'EXP-001',
    'benchmarks/protocols/exp-001-protocol.md',
    config,
    getGitCommit(),
    results
  );
}
