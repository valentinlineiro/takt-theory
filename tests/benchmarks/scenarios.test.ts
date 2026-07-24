import { describe, it, expect } from 'vitest';
import { StateSpaceGenerator } from '../../benchmarks/scenarios/synthetic/StateSpaceGenerator.js';
import { TraceReader, type LLMTraceStep } from '../../benchmarks/scenarios/llm-traces/TraceReader.js';
import type { ScenarioConfig } from '../../benchmarks/interface/BenchmarkEvent.js';

describe('Synthetic StateSpaceGenerator', () => {
  it('should generate deterministic events given a fixed seed', () => {
    const config: ScenarioConfig = {
      id: 'synth-k4',
      seed: 42,
      stateSpaceSize: 50,
      kernelDimensionK: 4,
      capabilityCatalogSize: 8,
      maxDriftRate: 0.05,
      params: {}
    };

    const gen1 = new StateSpaceGenerator(config);
    const events1 = gen1.generateEvents(10);

    const gen2 = new StateSpaceGenerator(config);
    const events2 = gen2.generateEvents(10);

    expect(events1.length).toBe(10);
    expect(events1[0].concreteStateVector).toEqual(events2[0].concreteStateVector);
    expect(events1[5].trueDecision).toEqual(events2[5].trueDecision);
  });
});

describe('LLM TraceReader', () => {
  it('should parse LLM trace steps into concrete benchmark events', () => {
    const traceSteps: LLMTraceStep[] = [
      {
        step: 0,
        toolName: 'read_file',
        requiredCapabilities: ['fs_read'],
        isAllowed: true
      },
      {
        step: 1,
        toolName: 'delete_db',
        requiredCapabilities: ['admin', 'db_write'],
        isAllowed: false
      }
    ];

    const events = TraceReader.parseTraceToEvents(traceSteps);

    expect(events.length).toBe(2);
    expect(events[0]).toEqual({
      stepIndex: 0,
      rawStateId: 'tool_read_file_0',
      concreteStateVector: [1],
      trueDecision: 1,
      availableActions: [0, 1]
    });
    expect(events[1]).toEqual({
      stepIndex: 1,
      rawStateId: 'tool_delete_db_1',
      concreteStateVector: [1, 1],
      trueDecision: 0,
      availableActions: [0, 1]
    });
  });
});
