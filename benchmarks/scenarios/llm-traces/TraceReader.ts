import type { ConcreteEvent } from '../../interface/BenchmarkEvent.js';

export interface LLMTraceStep {
  readonly step: number;
  readonly toolName: string;
  readonly requiredCapabilities: string[];
  readonly isAllowed: boolean;
}

export class TraceReader {
  public static parseTraceToEvents(traceSteps: LLMTraceStep[]): ConcreteEvent[] {
    return traceSteps.map((step) => ({
      stepIndex: step.step,
      rawStateId: `tool_${step.toolName}_${step.step}`,
      concreteStateVector: step.requiredCapabilities.map(() => 1),
      trueDecision: step.isAllowed ? 1 : 0,
      availableActions: [0, 1]
    }));
  }
}
