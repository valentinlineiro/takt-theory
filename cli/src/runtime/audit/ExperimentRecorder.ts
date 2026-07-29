import { GovernanceEventBus, GovernanceEvent } from './GovernanceEvents.js';
import { JsonExperimentObserver } from './GovernanceObservers.js';

export interface ExperimentMetadata {
  readonly experimentId: string;
  readonly title: string;
  readonly description?: string;
  readonly gitCommitHash?: string;
  readonly environment: {
    readonly nodeVersion: string;
    readonly os: string;
  };
  readonly startTimeISO: string;
}

export interface ExperimentArtifact {
  readonly schemaVersion: 1;
  readonly metadata: ExperimentMetadata;
  readonly summary: {
    readonly totalCycles: number;
    readonly passCount: number;
    readonly violationCount: number;
    readonly degradedCount: number;
    readonly averageDecisionMargin: number;
    readonly totalElapsedTimeMs: number;
  };
  readonly events: readonly GovernanceEvent[];
}

export class ExperimentRecorder {
  private jsonObserver: JsonExperimentObserver;

  constructor(
    private metadata: Omit<ExperimentMetadata, 'startTimeISO' | 'environment'>,
    private bus: GovernanceEventBus
  ) {
    this.jsonObserver = new JsonExperimentObserver();
    this.bus.subscribe(this.jsonObserver);
  }

  public stopAndExport(): ExperimentArtifact {
    this.bus.unsubscribe(this.jsonObserver);
    const events = this.jsonObserver.getEvents();

    let passCount = 0;
    let violationCount = 0;
    let degradedCount = 0;
    let totalMargin = 0;
    let totalElapsed = 0;

    for (const e of events) {
      if (e.type === 'GovernanceCycleCompleted') {
        if (e.outcome === 'PASS') passCount++;
        else if (e.outcome === 'VIOLATION') violationCount++;
        else if (e.outcome === 'DEGRADED') degradedCount++;

        totalMargin += e.decisionMargin;
        totalElapsed += e.elapsedTimeMs;
      }
    }

    const totalCycles = events.length;

    return {
      schemaVersion: 1,
      metadata: {
        ...this.metadata,
        environment: {
          nodeVersion: process.version,
          os: process.platform
        },
        startTimeISO: events[0]?.timestampISO ?? new Date().toISOString()
      },
      summary: {
        totalCycles,
        passCount,
        violationCount,
        degradedCount,
        averageDecisionMargin: totalCycles > 0 ? totalMargin / totalCycles : 0,
        totalElapsedTimeMs: totalElapsed
      },
      events
    };
  }
}
