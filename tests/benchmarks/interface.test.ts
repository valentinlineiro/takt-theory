import { describe, it, expect } from 'vitest';
import type {
  BenchmarkRunner,
  ScenarioConfig,
  ConcreteEvent,
  ExecutionStep,
  ParadigmType
} from '../../benchmarks/interface/BenchmarkRunner.js';

describe('Benchmark Interface Contract', () => {
  it('should allow constructing valid ScenarioConfig and ConcreteEvent objects', () => {
    const config: ScenarioConfig = {
      id: 'test-scenario',
      seed: 42,
      stateSpaceSize: 100,
      kernelDimensionK: 4,
      capabilityCatalogSize: 10,
      maxDriftRate: 0.1,
      params: { customParam: 'value' }
    };
    expect(config.id).toBe('test-scenario');
    expect(config.seed).toBe(42);
    expect(config.stateSpaceSize).toBe(100);
    expect(config.kernelDimensionK).toBe(4);
    expect(config.capabilityCatalogSize).toBe(10);
    expect(config.maxDriftRate).toBe(0.1);
    expect(config.params.customParam).toBe('value');

    const event: ConcreteEvent = {
      stepIndex: 0,
      rawStateId: 's-0',
      concreteStateVector: [1.0, 0.0, 0.5],
      trueDecision: 1,
      availableActions: [0, 1]
    };
    expect(event.stepIndex).toBe(0);
    expect(event.rawStateId).toBe('s-0');
    expect(event.concreteStateVector).toEqual([1.0, 0.0, 0.5]);
    expect(event.trueDecision).toBe(1);
    expect(event.availableActions).toEqual([0, 1]);
  });

  it('should support dummy implementations for all valid ParadigmTypes', async () => {
    const validParadigms: ParadigmType[] = ['naive', 'static-rules', 'exhaustive', 'pomdp', 'takt'];

    for (const paradigm of validParadigms) {
      class TestRunner implements BenchmarkRunner {
        readonly id = `runner-${paradigm}`;
        readonly paradigm = paradigm;

        async reset(_config: ScenarioConfig): Promise<void> {}

        async step(event: ConcreteEvent): Promise<ExecutionStep> {
          return {
            stepIndex: event.stepIndex,
            actionChosen: event.availableActions[0] ?? 0,
            observationsAcquired: ['obs-1'],
            acquisitionCostIncurred: 1.0,
            latencyMs: 5.0,
            memoryAllocatedBytes: 512
          };
        }

        async finalize(): Promise<void> {}
      }

      const runner = new TestRunner();
      expect(runner.id).toBe(`runner-${paradigm}`);
      expect(runner.paradigm).toBe(paradigm);

      const config: ScenarioConfig = {
        id: 'scenario-1',
        seed: 123,
        stateSpaceSize: 10,
        kernelDimensionK: 2,
        capabilityCatalogSize: 3,
        maxDriftRate: 0.05,
        params: {}
      };

      await runner.reset(config);

      const executionStep = await runner.step({
        stepIndex: 0,
        rawStateId: 'raw-1',
        concreteStateVector: [0.1, 0.9],
        trueDecision: 1,
        availableActions: [0, 1]
      });

      expect(executionStep.stepIndex).toBe(0);
      expect(executionStep.actionChosen).toBe(0);
      expect(executionStep.observationsAcquired).toEqual(['obs-1']);
      expect(executionStep.acquisitionCostIncurred).toBe(1.0);
      expect(executionStep.latencyMs).toBe(5.0);
      expect(executionStep.memoryAllocatedBytes).toBe(512);

      await runner.finalize();
    }
  });
});
