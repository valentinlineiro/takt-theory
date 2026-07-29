import { GovernanceEvent, GovernanceObserver } from './GovernanceEvents.js';

export class ConsoleGovernanceObserver implements GovernanceObserver {
  public onEvent(event: GovernanceEvent): void {
    if (event.type === 'GovernanceCycleCompleted') {
      console.log(
        `[GOV-CYCLE ${event.cycleId}] rep=${event.representationId} dec=${event.decision} margin=${event.decisionMargin.toFixed(4)} cost=${event.observationCost} outcome=${event.outcome} (${event.elapsedTimeMs}ms)`
      );
    }
  }
}

export class JsonExperimentObserver implements GovernanceObserver {
  private events: GovernanceEvent[] = [];

  public onEvent(event: GovernanceEvent): void {
    this.events.push(event);
  }

  public getEvents(): readonly GovernanceEvent[] {
    return this.events;
  }

  public toJsonString(pretty = true): string {
    return JSON.stringify(this.events, null, pretty ? 2 : undefined);
  }

  public clear(): void {
    this.events = [];
  }
}
