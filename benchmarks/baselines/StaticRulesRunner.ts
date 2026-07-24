import type { BenchmarkRunner, ScenarioConfig, ConcreteEvent, ExecutionStep } from '../interface/BenchmarkRunner.js';

export class StaticRulesRunner implements BenchmarkRunner {
  public readonly id = 'runner-static-rules';
  public readonly paradigm = 'static-rules' as const;

  public async reset(_config: ScenarioConfig): Promise<void> {}

  public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    const start = performance.now();
    // Static rules: fixed observation of first 2 features
    const acquired = ['cap_0', 'cap_1'];
    const v0 = event.concreteStateVector[0] ?? 0;
    const v1 = event.concreteStateVector[1] ?? 0;
    const actionChosen = (v0 + v1) / 2 >= 0.5 ? 1 : 0;
    const end = performance.now();

    return {
      stepIndex: event.stepIndex,
      actionChosen,
      observationsAcquired: acquired,
      acquisitionCostIncurred: 2.0,
      latencyMs: end - start,
      memoryAllocatedBytes: 512
    };
  }

  public async finalize(): Promise<void> {}
}
