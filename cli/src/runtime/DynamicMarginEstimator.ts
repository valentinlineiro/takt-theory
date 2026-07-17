import { TrajectoryPrefix } from '../takt-core/types.js';
import { computeDynamicMargin, TransitionSystem } from '../takt-core/margin.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';

export class DynamicMarginEstimator<S, A, O> {
  constructor(
    private tds: TransitionSystem<S, A>,
    private D: ReferencePolicy<S, A>,
    private π: (obs: O[]) => A,
    private O: (state: S) => O,
    private maxDepth: number = 50,
  ) {}

  estimate(prefix: TrajectoryPrefix<S, A>): number {
    return computeDynamicMargin(prefix, this.tds, this.D, this.π, this.O, 0, this.maxDepth);
  }
}
