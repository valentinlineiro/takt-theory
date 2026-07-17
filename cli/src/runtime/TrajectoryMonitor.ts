import { TrajectoryPrefix } from '../takt-core/types.js';
import { Event } from './types.js';

export class TrajectoryMonitor<S, A> {
  private states: S[] = [];
  private actions: A[] = [];

  ingest(event: Event<S, A>): void {
    this.states.push(event.state);
    this.actions.push(event.action);
  }

  getPrefix(): TrajectoryPrefix<S, A> {
    return { states: [...this.states], actions: [...this.actions] };
  }

  clear(): void {
    this.states = [];
    this.actions = [];
  }
}
