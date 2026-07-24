import { PlanningDomainAdapter } from '../scenarios/exogenous/PlanningDomainAdapter.js';
import { DistributedDomainAdapter } from '../scenarios/exogenous/DistributedDomainAdapter.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface StatisticalSummary {
  domain: string;
  representation: string;
  seedCount: number;
  meanRegret: number;
  stdRegret: number;
  ci95Regret: [number, number];
  meanNetValue: number;
  stdNetValue: number;
}

export function runStatisticalSweep(seedCount = 1000): StatisticalSummary[] {
  console.log(`[TAKT Statistical Suite] Running 1,000-seed sweep for Domain A (Planning) and Domain B (Distributed)...`);

  const summaries: StatisticalSummary[] = [];

  // Domain A: Classical Planning STRIPS
  const planningReps: Array<'sufficient' | 'insufficient' | 'excessive'> = ['sufficient', 'insufficient', 'excessive'];
  for (const rep of planningReps) {
    const regretList: number[] = [];
    const netValueList: number[] = [];

    for (let s = 1; s <= seedCount; s++) {
      const adapter = new PlanningDomainAdapter(s);
      const events = Array.from({ length: 100 }, (_, i) => adapter.generateEvent(i));

      let regretCount = 0;
      let totalFriction = 0;

      for (const ev of events) {
        const proj = PlanningDomainAdapter.projectRepresentation(ev.concreteStateVector, rep);
        totalFriction += proj.length * 0.1;

        let chosenAction = 0;
        if (rep === 'sufficient') {
          const [robot, box, door] = proj;
          chosenAction = door === 0 ? 2 : robot !== box ? 0 : 1;
        } else if (rep === 'insufficient') {
          chosenAction = 0;
        } else {
          const [robot, box, door] = proj;
          chosenAction = door === 0 ? 2 : robot !== box ? 0 : 1;
        }

        if (chosenAction !== ev.trueDecision) {
          regretCount++;
        }
      }

      const netVal = (100 - regretCount) - totalFriction;
      regretList.push(regretCount);
      netValueList.push(netVal);
    }

    summaries.push(computeStats('Domain A (Planning)', rep, regretList, netValueList));
  }

  // Domain B: Distributed Consensus Paxos
  const distributedReps: Array<'sufficient' | 'insufficient' | 'excessive'> = ['sufficient', 'insufficient', 'excessive'];
  for (const rep of distributedReps) {
    const regretList: number[] = [];
    const netValueList: number[] = [];

    for (let s = 1; s <= seedCount; s++) {
      const adapter = new DistributedDomainAdapter(s);
      const events = Array.from({ length: 100 }, (_, i) => adapter.generateEvent(i));

      let regretCount = 0;
      let totalFriction = 0;

      for (const ev of events) {
        const proj = DistributedDomainAdapter.projectRepresentation(ev.concreteStateVector, rep);
        totalFriction += proj.length * 0.1;

        let chosenAction = 0;
        if (rep === 'sufficient') {
          const [quorum, leader, faults] = proj;
          chosenAction = (faults >= 2 || quorum < 3) ? 1 : leader !== 0 ? 2 : 0;
        } else if (rep === 'insufficient') {
          chosenAction = 0;
        } else {
          const [quorum, leader, faults] = proj;
          chosenAction = (faults >= 2 || quorum < 3) ? 1 : leader !== 0 ? 2 : 0;
        }

        if (chosenAction !== ev.trueDecision) {
          regretCount++;
        }
      }

      const netVal = (100 - regretCount) - totalFriction;
      regretList.push(regretCount);
      netValueList.push(netVal);
    }

    summaries.push(computeStats('Domain B (Distributed)', rep, regretList, netValueList));
  }

  return summaries;
}

function computeStats(domain: string, rep: string, regretList: number[], netValueList: number[]): StatisticalSummary {
  const n = regretList.length;
  const meanRegret = regretList.reduce((a, b) => a + b, 0) / n;
  const varianceRegret = regretList.reduce((a, b) => a + Math.pow(b - meanRegret, 2), 0) / n;
  const stdRegret = Math.sqrt(varianceRegret);

  const meanNetVal = netValueList.reduce((a, b) => a + b, 0) / n;
  const varianceNetVal = netValueList.reduce((a, b) => a + Math.pow(b - meanNetVal, 2), 0) / n;
  const stdNetVal = Math.sqrt(varianceNetVal);

  const margin95 = 1.96 * (stdRegret / Math.sqrt(n));
  const ci95: [number, number] = [
    Math.max(0, Math.round((meanRegret - margin95) * 100) / 100),
    Math.round((meanRegret + margin95) * 100) / 100
  ];

  return {
    domain,
    representation: rep,
    seedCount: n,
    meanRegret: Math.round(meanRegret * 100) / 100,
    stdRegret: Math.round(stdRegret * 100) / 100,
    ci95Regret: ci95,
    meanNetValue: Math.round(meanNetVal * 100) / 100,
    stdNetValue: Math.round(stdNetVal * 100) / 100
  };
}

if (process.argv[1]?.endsWith('statistical-sweep.ts')) {
  const stats = runStatisticalSweep(1000);
  console.table(stats);

  const outputDir = path.resolve('benchmarks/datasets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'R2-1000-seed-statistical-sweep.json'),
    JSON.stringify(stats, null, 2),
    'utf-8'
  );
  console.log('✓ 1,000-Seed Statistical Sweep dataset written to: benchmarks/datasets/R2-1000-seed-statistical-sweep.json');
}
