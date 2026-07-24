import { describe, it, expect } from 'vitest';
import { StaticRulesRunner } from '../../benchmarks/baselines/StaticRulesRunner.js';
import { POMDPRunner } from '../../benchmarks/baselines/POMDPRunner.js';
import type { ScenarioConfig, ConcreteEvent } from '../../benchmarks/interface/BenchmarkRunner.js';

describe('StaticRulesRunner', () => {
  it('should have correct id and paradigm', () => {
    const runner = new StaticRulesRunner();
    expect(runner.id).toBe('runner-static-rules');
    expect(runner.paradigm).toBe('static-rules');
  });

  it('should reset and finalize without error', async () => {
    const runner = new StaticRulesRunner();
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

  it('should acquire fixed cap_0 and cap_1 observations and evaluate decision rule', async () => {
    const runner = new StaticRulesRunner();
    const event1: ConcreteEvent = {
      stepIndex: 0,
      rawStateId: 'state-0',
      concreteStateVector: [0.8, 0.9, 0.1, 0.2],
      trueDecision: 1,
      availableActions: [0, 1]
    };

    const stepResult1 = await runner.step(event1);

    expect(stepResult1.stepIndex).toBe(0);
    expect(stepResult1.actionChosen).toBe(1);
    expect(stepResult1.observationsAcquired).toEqual(['cap_0', 'cap_1']);
    expect(stepResult1.acquisitionCostIncurred).toBe(2.0);
    expect(stepResult1.latencyMs).toBeGreaterThanOrEqual(0);
    expect(stepResult1.memoryAllocatedBytes).toBe(512);

    const event2: ConcreteEvent = {
      stepIndex: 1,
      rawStateId: 'state-1',
      concreteStateVector: [0.1, 0.2, 0.9, 0.9],
      trueDecision: 0,
      availableActions: [0, 1]
    };

    const stepResult2 = await runner.step(event2);
    expect(stepResult2.actionChosen).toBe(0);
  });

  it('should handle state vectors with fewer than 2 elements gracefully', async () => {
    const runner = new StaticRulesRunner();
    const event: ConcreteEvent = {
      stepIndex: 2,
      rawStateId: 'state-2',
      concreteStateVector: [],
      trueDecision: 0,
      availableActions: [0, 1]
    };

    const stepResult = await runner.step(event);
    expect(stepResult.actionChosen).toBe(0);
  });
});

describe('POMDPRunner', () => {
  it('should have correct id and paradigm', () => {
    const runner = new POMDPRunner();
    expect(runner.id).toBe('runner-pomdp');
    expect(runner.paradigm).toBe('pomdp');
  });

  it('should reset belief simplex according to scenario state space size', async () => {
    const runner = new POMDPRunner();
    const config: ScenarioConfig = {
      id: 'pomdp-scenario',
      seed: 100,
      stateSpaceSize: 5,
      kernelDimensionK: 4,
      capabilityCatalogSize: 10,
      maxDriftRate: 0.01,
      params: {}
    };

    await runner.reset(config);

    const event: ConcreteEvent = {
      stepIndex: 0,
      rawStateId: 'state-0',
      concreteStateVector: [0.5, 0.5],
      trueDecision: 1,
      availableActions: [0, 1]
    };

    const stepResult = await runner.step(event);

    expect(stepResult.stepIndex).toBe(0);
    expect(stepResult.actionChosen).toBe(1);
    expect(stepResult.observationsAcquired).toEqual(['belief_observation']);
    expect(stepResult.acquisitionCostIncurred).toBe(1.5);
    expect(stepResult.latencyMs).toBeGreaterThanOrEqual(2.0);
    expect(stepResult.memoryAllocatedBytes).toBe(8192);

    await expect(runner.finalize()).resolves.toBeUndefined();
  });
});
