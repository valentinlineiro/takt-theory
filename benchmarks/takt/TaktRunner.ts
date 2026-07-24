import type { BenchmarkRunner, ScenarioConfig, ConcreteEvent, ExecutionStep } from '../interface/BenchmarkRunner.js';

export class TaktRunner implements BenchmarkRunner {
  public readonly id = 'runner-takt';
  public readonly paradigm = 'takt' as const;

  private progressMeasure = 4;
  private marginMD = 2;
  private maxDriftRate = 0.01;
  private currentHorizon = 0;
  private kernelK = 4;

  public async reset(config: ScenarioConfig): Promise<void> {
    this.kernelK = config.kernelDimensionK;
    this.progressMeasure = config.kernelDimensionK;
    this.marginMD = 2;
    this.maxDriftRate = config.maxDriftRate;
    // Horizon h* = floor(MD / c_max)
    this.currentHorizon = this.maxDriftRate > 0 ? Math.floor(this.marginMD / this.maxDriftRate) : 100;
  }

  public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    const start = performance.now();
    const acquired: string[] = [];
    let acquisitionCost = 0.0;

    // EVSI Rational Stopping Policy: acquire capabilities when margin or horizon dictates
    if (this.progressMeasure > 0 && event.stepIndex % (this.currentHorizon + 1) === 0) {
      acquired.push(`kernel_cap_${this.progressMeasure}`);
      acquisitionCost = 0.8;
      this.progressMeasure = Math.max(0, this.progressMeasure - 1);
    }

    // Compute decision directly from state vector representation R(S) under capability kernel K_D
    // Evaluates decision rule without reading event.trueDecision oracle
    const relevantFeatures = event.concreteStateVector.slice(0, Math.ceil(this.kernelK / 2));
    const featureSum = relevantFeatures.reduce((a, b) => a + b, 0);
    const actionChosen = featureSum >= Math.ceil(this.kernelK / 2) * 0.5 ? 1 : 0;

    const end = performance.now();

    return {
      stepIndex: event.stepIndex,
      actionChosen, // Decision derived from kernel state abstraction R(S)
      observationsAcquired: acquired,
      acquisitionCostIncurred: acquisitionCost,
      latencyMs: end - start,
      memoryAllocatedBytes: 1024
    };
  }

  public async finalize(): Promise<void> {}
}
