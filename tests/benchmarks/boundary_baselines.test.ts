import { describe, it, expect } from 'vitest';
import { NaiveRunner } from '../../benchmarks/baselines/NaiveRunner.js';
import { ExhaustiveRunner } from '../../benchmarks/baselines/ExhaustiveRunner.js';
import type { ScenarioConfig, ConcreteEvent } from '../../benchmarks/interface/BenchmarkRunner.js';

describe('NaiveRunner', () => {
  it('should have correct id and paradigm', () => {
    const runner = new NaiveRunner();
    expect(runner.id).toBe('runner-naive');
    expect(runner.paradigm).toBe('naive');
  });

  it('should reset and finalize without error', async () => {
    const runner = new NaiveRunner();
    const config: ScenarioConfig = {
      id: 'test-scenario',
      seed: 42,
      stateSpaceSize: 10,
      kernelDimensionK: 4,
      capabilityCatalogSize: 8,
      maxDriftRate: 0.05,
      params: {}
    };

    await expect(runner.reset(config)).resolves.toBeUndefined();
    await expect(runner.finalize()).resolves.toBeUndefined();
  });

  it('should pick nominal default action 0 without acquiring observations', async () => {
    const runner = new NaiveRunner();
    const event: ConcreteEvent = {
      stepIndex: 1,
      rawStateId: 'state-1',
      concreteStateVector: [1, 0, 1],
      trueDecision: 2,
      availableActions: [0, 1, 2]
    };

    const stepResult = await runner.step(event);

    expect(stepResult.stepIndex).toBe(1);
    expect(stepResult.actionChosen).toBe(0);
    expect(stepResult.observationsAcquired).toEqual([]);
    expect(stepResult.acquisitionCostIncurred).toBe(0.0);
    expect(stepResult.latencyMs).toBeGreaterThanOrEqual(0);
    expect(stepResult.memoryAllocatedBytes).toBe(128);
  });

  it('should fallback actionChosen to 0 if availableActions is empty', async () => {
    const runner = new NaiveRunner();
    const event: ConcreteEvent = {
      stepIndex: 0,
      rawStateId: 'state-0',
      concreteStateVector: [],
      trueDecision: 1,
      availableActions: []
    };

    const stepResult = await runner.step(event);
    expect(stepResult.actionChosen).toBe(0);
  });
});

describe('ExhaustiveRunner', () => {
  it('should have correct id and paradigm', () => {
    const runner = new ExhaustiveRunner();
    expect(runner.id).toBe('runner-exhaustive');
    expect(runner.paradigm).toBe('exhaustive');
  });

  it('should update kernel dimension k upon reset', async () => {
    const runner = new ExhaustiveRunner();
    const config: ScenarioConfig = {
      id: 'test-scenario-k6',
      seed: 123,
      stateSpaceSize: 10,
      kernelDimensionK: 6,
      capabilityCatalogSize: 10,
      maxDriftRate: 0.01,
      params: {}
    };

    await runner.reset(config);

    const event: ConcreteEvent = {
      stepIndex: 5,
      rawStateId: 'state-5',
      concreteStateVector: [1, 1, 0],
      trueDecision: 3,
      availableActions: [0, 1, 2, 3]
    };

    const stepResult = await runner.step(event);

    expect(stepResult.observationsAcquired).toEqual(['cap_0', 'cap_1', 'cap_2', 'cap_3', 'cap_4', 'cap_5']);
    expect(stepResult.acquisitionCostIncurred).toBe(6.0);
  });

  it('should acquire all k capabilities and return true decision', async () => {
    const runner = new ExhaustiveRunner();
    const config: ScenarioConfig = {
      id: 'test-scenario-k4',
      seed: 42,
      stateSpaceSize: 10,
      kernelDimensionK: 4,
      capabilityCatalogSize: 8,
      maxDriftRate: 0.05,
      params: {}
    };

    await runner.reset(config);

    const event: ConcreteEvent = {
      stepIndex: 2,
      rawStateId: 'state-2',
      concreteStateVector: [1, 0],
      trueDecision: 2,
      availableActions: [0, 1, 2]
    };

    const stepResult = await runner.step(event);

    expect(stepResult.stepIndex).toBe(2);
    expect(stepResult.actionChosen).toBe(2);
    expect(stepResult.observationsAcquired).toEqual(['cap_0', 'cap_1', 'cap_2', 'cap_3']);
    expect(stepResult.acquisitionCostIncurred).toBe(4.0);
    expect(stepResult.latencyMs).toBeGreaterThan(0);
    expect(stepResult.memoryAllocatedBytes).toBe(4096);

    await expect(runner.finalize()).resolves.toBeUndefined();
  });
});
