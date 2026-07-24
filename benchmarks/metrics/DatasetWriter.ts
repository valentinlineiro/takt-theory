import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import type { ScenarioConfig } from '../interface/BenchmarkRunner.js';
import type { MetricSummary } from './MetricCollector.js';

export interface ExperimentDataset {
  provenance: {
    timestamp: string;
    gitCommit: string;
    nodeVersion: string;
    seed: number;
    hardware: {
      arch: string;
      platform: string;
      cpus: number;
      totalMemoryBytes: number;
    };
  };
  experiment: {
    id: string;
    protocol: string;
    scenarioConfig: ScenarioConfig;
  };
  results: Array<{
    runnerId: string;
    paradigm: string;
    metrics: MetricSummary;
  }>;
}

export class DatasetWriter {
  public static createDataset(
    experimentId: string,
    protocolPath: string,
    config: ScenarioConfig,
    commitHash: string,
    results: Array<{ runnerId: string; paradigm: string; metrics: MetricSummary }>
  ): ExperimentDataset {
    return {
      provenance: {
        timestamp: new Date().toISOString(),
        gitCommit: commitHash,
        nodeVersion: process.version,
        seed: config.seed,
        hardware: {
          arch: os.arch(),
          platform: os.platform(),
          cpus: os.cpus().length,
          totalMemoryBytes: os.totalmem()
        }
      },
      experiment: {
        id: experimentId,
        protocol: protocolPath,
        scenarioConfig: config
      },
      results
    };
  }

  public static writeToFile(dataset: ExperimentDataset, outputDirPath: string): string {
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
    const filename = `${dataset.experiment.id}-seed-${dataset.provenance.seed}.json`;
    const filePath = path.join(outputDirPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(dataset, null, 2), 'utf-8');
    return filePath;
  }
}
