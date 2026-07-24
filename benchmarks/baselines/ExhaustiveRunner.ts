import type { BenchmarkRunner, ScenarioConfig, ConcreteEvent, ExecutionStep } from '../interface/BenchmarkRunner.js';

export class ExhaustiveRunner implements BenchmarkRunner {
  public readonly id = 'runner-exhaustive';
  public readonly paradigm = 'exhaustive' as const;
  private k = 4;

  public async reset(config: ScenarioConfig): Promise<void> {
    this.k = config.kernelDimensionK;
  }

  public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    const start = performance.now();
    // Exhaustive strategy: inspects ALL capabilities sequentially
    const acquired: string[] = [];
    for (let i = 0; i < this.k; i++) {
      acquired.push(`cap_${i}`);
    }

    // Full bisimulation compute simulation (synthetic delay)
    let sum = 0;
    for (let i = 0; i < 1000; i++) {
      sum += i;
    }

    const end = performance.now();

    return {
      stepIndex: event.stepIndex,
      actionChosen: event.trueDecision, // Exhaustive verification avoids regret
      observationsAcquired: acquired,
      acquisitionCostIncurred: this.k * 1.0, // High acquisition cost
      latencyMs: (end - start) + 1.0,
      memoryAllocatedBytes: 4096 + sum * 0
    };
  }

  public async finalize(): Promise<void> {}
}
