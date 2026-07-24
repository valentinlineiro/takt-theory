export interface ScenarioConfig {
  readonly id: string;
  readonly seed: number;
  readonly stateSpaceSize: number;
  readonly kernelDimensionK: number;
  readonly capabilityCatalogSize: number;
  readonly maxDriftRate: number;
  readonly params: Record<string, unknown>;
}

export interface ConcreteEvent {
  readonly stepIndex: number;
  readonly rawStateId: string;
  readonly concreteStateVector: number[];
  readonly trueDecision: number;
  readonly availableActions: number[];
}

export interface ExecutionStep {
  readonly stepIndex: number;
  readonly actionChosen: number;
  readonly observationsAcquired: string[];
  readonly acquisitionCostIncurred: number;
  readonly latencyMs: number;
  readonly memoryAllocatedBytes: number;
}
