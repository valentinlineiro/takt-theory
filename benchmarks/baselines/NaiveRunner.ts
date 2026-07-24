import type { BenchmarkRunner, ScenarioConfig, ConcreteEvent, ExecutionStep } from '../interface/BenchmarkRunner.js';

export class NaiveRunner implements BenchmarkRunner {
  public readonly id = 'runner-naive';
  public readonly paradigm = 'naive' as const;

  public async reset(_config: ScenarioConfig): Promise<void> {}

  public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    const start = performance.now();
    // Naive strategy: always picks action 0 (nominal default) without observing
    const actionChosen = event.availableActions[0] ?? 0;
    const end = performance.now();

    return {
      stepIndex: event.stepIndex,
      actionChosen,
      observationsAcquired: [],
      acquisitionCostIncurred: 0.0,
      latencyMs: end - start,
      memoryAllocatedBytes: 128
    };
  }

  public async finalize(): Promise<void> {}
}
