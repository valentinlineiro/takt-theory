/**
 * Atomic Governance Events for TAKT Runtime.
 * Separates raw observation (facts) from interpretation (observers).
 */

export interface GovernanceCycleCompletedEvent {
  readonly type: 'GovernanceCycleCompleted';
  readonly cycleId: string;
  readonly representationId: string;
  readonly uncertainty: number;
  readonly decision: string | number;
  readonly decisionMargin: number;
  readonly observationCost: number;
  readonly elapsedTimeMs: number;
  readonly outcome: 'PASS' | 'VIOLATION' | 'DEGRADED';
  readonly timestampISO: string;
}

export type GovernanceEvent = GovernanceCycleCompletedEvent;

export interface GovernanceObserver {
  onEvent(event: GovernanceEvent): void;
}

export class GovernanceEventBus {
  private observers: GovernanceObserver[] = [];

  public subscribe(observer: GovernanceObserver): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: GovernanceObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  public emit(event: GovernanceEvent): void {
    const frozenEvent = Object.freeze({ ...event });
    for (const observer of this.observers) {
      try {
        observer.onEvent(frozenEvent);
      } catch (err) {
        console.error('Observer error:', err);
      }
    }
  }
}
