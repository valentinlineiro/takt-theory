import type { ScenarioConfig, ConcreteEvent, ExecutionStep } from './BenchmarkEvent.js';

export type ParadigmType = 'naive' | 'static-rules' | 'exhaustive' | 'pomdp' | 'takt';

export interface BenchmarkRunner {
  readonly id: string;
  readonly paradigm: ParadigmType;

  /** Resets the runner state before starting a scenario run */
  reset(config: ScenarioConfig): Promise<void>;

  /** Executes a single event step and returns execution measurements */
  step(event: ConcreteEvent): Promise<ExecutionStep>;

  /** Finalizes run execution and cleans up transient resources */
  finalize(): Promise<void>;
}

export type { ScenarioConfig, ConcreteEvent, ExecutionStep };
