import type { BenchmarkRunner, ScenarioConfig, ConcreteEvent, ExecutionStep } from '../interface/BenchmarkRunner.js';

export class OvercompressedRunner implements BenchmarkRunner {
  public readonly id = 'runner-overcompressed';
  public readonly paradigm = 'overcompressed' as const;

  public async reset(_config: ScenarioConfig): Promise<void> {}

  public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    const start = performance.now();

    // Insufficient representation: ignores relevant features, selecting arbitrary action
    // Demonstrates ker(R) NOT subset K_D leads to Regret > 0
    const actionChosen = (event.stepIndex % 2 === 0) ? 0 : 1;

    const end = performance.now();

    return {
      stepIndex: event.stepIndex,
      actionChosen, // Sub-optimal decision due to insufficient state representation
      observationsAcquired: [],
      acquisitionCostIncurred: 0.0,
      latencyMs: end - start,
      memoryAllocatedBytes: 512
    };
  }

  public async finalize(): Promise<void> {}
}
