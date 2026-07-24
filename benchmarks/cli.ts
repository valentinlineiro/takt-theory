import { runExperiment001 } from './experiments/exp-001-kernel-scaling.js';
import { runExperiment002 } from './experiments/exp-002-evsi-stopping.js';
import { runExperiment003 } from './experiments/exp-003-runtime-latency.js';
import { runExperiment004 } from './experiments/exp-004-drift-horizon.js';
import { runExperimentMetaAudit } from './experiments/exp-001-meta-audit.js';
import { DatasetWriter, type ExperimentDataset } from './metrics/DatasetWriter.js';

async function main() {
  const args = process.argv.slice(2);
  const expArg = args[0] && !args[0].startsWith('--') ? args[0].toLowerCase() : 'exp-001';

  let seed = 42;
  const seedIdx = args.indexOf('--seed');
  if (seedIdx !== -1 && args[seedIdx + 1]) {
    seed = parseInt(args[seedIdx + 1], 10);
  }

  let outDir = 'benchmarks/datasets';
  const outDirIdx = args.indexOf('--outDir');
  if (outDirIdx !== -1 && args[outDirIdx + 1]) {
    outDir = args[outDirIdx + 1];
  }

  console.log(`[TAKT Benchmark CLI] Running experiment: ${expArg} | Seed: ${seed} | Output Dir: ${outDir}`);

  const experimentsToRun: Array<() => Promise<ExperimentDataset>> = [];

  if (expArg === 'exp-001' || expArg === 'exp001') {
    experimentsToRun.push(() => runExperiment001(seed));
  } else if (expArg === 'exp-002' || expArg === 'exp002') {
    experimentsToRun.push(() => runExperiment002(seed));
  } else if (expArg === 'exp-003' || expArg === 'exp003') {
    experimentsToRun.push(() => runExperiment003(seed));
  } else if (expArg === 'exp-004' || expArg === 'exp004') {
    experimentsToRun.push(() => runExperiment004(seed));
  } else if (expArg === 'meta-audit' || expArg === 'meta') {
    experimentsToRun.push(() => runExperimentMetaAudit(seed));
  } else if (expArg === 'all') {
    experimentsToRun.push(
      () => runExperiment001(seed),
      () => runExperiment002(seed),
      () => runExperiment003(seed),
      () => runExperiment004(seed),
      () => runExperimentMetaAudit(seed)
    );
  } else {
    console.error(`Unknown experiment '${expArg}'. Available options: exp-001, exp-002, exp-003, exp-004, meta-audit, all`);
    process.exit(1);
  }

  for (const runFn of experimentsToRun) {
    const dataset = await runFn();
    const filePath = DatasetWriter.writeToFile(dataset, outDir);
    console.log(`✓ Experiment ${dataset.experiment.id} complete. Output written to: ${filePath}`);
  }
}

main().catch((err) => {
  console.error('[TAKT Benchmark CLI] Unhandled error:', err);
  process.exit(1);
});
