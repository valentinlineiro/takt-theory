import { describe, it, expect } from 'vitest';
import { TaktRunner } from '../../benchmarks/takt/TaktRunner.js';
import type { ScenarioConfig, ConcreteEvent } from '../../benchmarks/interface/BenchmarkRunner.js';

describe('TaktRunner', () => {
  const config: ScenarioConfig = {
    id: 'test-takt',
    seed: 42,
    stateSpaceSize: 10,
    kernelDimensionK: 4,
    capabilityCatalogSize: 5,
    maxDriftRate: 0.01,
    params: {}
  };

  const event: ConcreteEvent = {
    stepIndex: 0,
    rawStateId: 's0',
    concreteStateVector: [0.8, 0.9, 0.1, 0.2],
    trueDecision: 1,
    availableActions: [0, 1]
  };

  it('should have correct id and paradigm', () => {
    const runner = new TaktRunner();
    expect(runner.id).toBe('runner-takt');
    expect(runner.paradigm).toBe('takt');
  });

  it('TaktRunner should evaluate dynamic margin MD and achieve zero regret with minimal cost', async () => {
    const runner = new TaktRunner();
    await runner.reset(config);
    const step = await runner.step(event);

    expect(step.stepIndex).toBe(0);
    expect(step.actionChosen).toBe(event.trueDecision);
    expect(step.acquisitionCostIncurred).toBeLessThan(4.0); // Less than exhaustive cost
    expect(step.latencyMs).toBeLessThan(5.0);
    expect(step.memoryAllocatedBytes).toBe(1024);
  });

  it('should trigger sparse acquisition according to guaranteed intervention horizon h*', async () => {
    const runner = new TaktRunner();
    // maxDriftRate = 0.01, marginMD = 2 => currentHorizon = floor(2 / 0.01) = 200
    // horizon + 1 = 201
    await runner.reset(config);

    // Step 0 (0 % 201 === 0): should acquire kernel capability
    const step0 = await runner.step({ ...event, stepIndex: 0 });
    expect(step0.observationsAcquired).toEqual(['kernel_cap_4']);
    expect(step0.acquisitionCostIncurred).toBe(0.8);

    // Step 1 (1 % 201 !== 0): rational stopping policy skips acquisition
    const step1 = await runner.step({ ...event, stepIndex: 1 });
    expect(step1.observationsAcquired).toEqual([]);
    expect(step1.acquisitionCostIncurred).toBe(0.0);
    expect(step1.actionChosen).toBe(event.trueDecision);
  });

  it('should handle zero maxDriftRate by defaulting currentHorizon to 100', async () => {
    const runner = new TaktRunner();
    const zeroDriftConfig: ScenarioConfig = {
      ...config,
      maxDriftRate: 0
    };
    await runner.reset(zeroDriftConfig);

    const step0 = await runner.step({ ...event, stepIndex: 0 });
    expect(step0.observationsAcquired).toEqual(['kernel_cap_4']);

    // Step 101 (101 % 101 === 0) should trigger next kernel acquisition
    const step101 = await runner.step({ ...event, stepIndex: 101 });
    expect(step101.observationsAcquired).toEqual(['kernel_cap_3']);
  });

  it('should reset and finalize cleanly', async () => {
    const runner = new TaktRunner();
    await expect(runner.reset(config)).resolves.toBeUndefined();
    await expect(runner.finalize()).resolves.toBeUndefined();
  });
});
