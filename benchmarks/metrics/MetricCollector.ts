import type { ConcreteEvent, ExecutionStep, ParadigmType } from '../interface/BenchmarkRunner.js';

export interface MetricSummary {
  readonly totalSteps: number;
  readonly totalDurationMs: number;
  readonly averageStepLatencyMs: number;
  readonly peakMemoryBytes: number;
  readonly netValueEnrichment: number;
  readonly totalDecisionRegret: number;
  readonly safetyViolationCount: number;
}

export class MetricCollector {
  private steps: ExecutionStep[] = [];
  private totalRegret = 0;
  private totalViolations = 0;
  private peakMemory = 0;
  private totalCost = 0;

  constructor(
    public readonly runnerId: string,
    public readonly paradigm: ParadigmType
  ) {}

  public record(event: ConcreteEvent, step: ExecutionStep): void {
    this.steps.push(step);
    this.totalCost += step.acquisitionCostIncurred;
    
    // Regret: 0 if action matches ground truth decision, 1 if mismatched
    if (step.actionChosen !== event.trueDecision) {
      this.totalRegret += 1.0;
      this.totalViolations += 1;
    }
    
    if (step.memoryAllocatedBytes > this.peakMemory) {
      this.peakMemory = step.memoryAllocatedBytes;
    }
  }

  public getSummary(): MetricSummary {
    const totalSteps = this.steps.length;
    const totalLatency = this.steps.reduce((acc, s) => acc + s.latencyMs, 0);
    const avgLatency = totalSteps > 0 ? totalLatency / totalSteps : 0;
    
    // Net Value of Enrichment (NVE): decision accuracy gain minus acquisition cost
    const accuracyGain = totalSteps - this.totalRegret;
    const netValue = accuracyGain - this.totalCost;

    return {
      totalSteps,
      totalDurationMs: totalLatency,
      averageStepLatencyMs: avgLatency,
      peakMemoryBytes: this.peakMemory,
      netValueEnrichment: netValue,
      totalDecisionRegret: this.totalRegret,
      safetyViolationCount: this.totalViolations
    };
  }
}
