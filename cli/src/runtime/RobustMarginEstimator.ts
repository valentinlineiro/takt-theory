import { TrajectoryPrefix } from '../takt-core/types.js';
import { TransitionSystem } from '../takt-core/margin.js';
import type { ReferencePolicy } from '../takt-core/coverage.js';
import { UncertaintySet } from './UncertaintySet.js';
import { TransitionEstimator } from './TransitionEstimator.js';

function surprisalCost(prob: number): number {
  if (prob <= 0) return Infinity;
  return -Math.log(prob);
}

function memoKey<S>(state: S, depth: number): string {
  return JSON.stringify(state) + '@' + depth;
}

export class RobustMarginEstimator<S, A, O> {
  constructor(
    private tds: TransitionSystem<S, A>,
    private estimator: TransitionEstimator<S, A>,
    private uncertainty: UncertaintySet<S, A>,
    private D: ReferencePolicy<S, A>,
    private π: (obs: O[]) => A,
    private O: (state: S) => O,
    private maxDepth: number = 50,
  ) {}

  estimate(prefix: TrajectoryPrefix<S, A>): number {
    return this.computeRobustMargin(prefix, 0, new Map());
  }

  private computeRobustMargin(
    prefix: TrajectoryPrefix<S, A>,
    depth: number,
    memo: Map<string, number>,
  ): number {
    const currentState = prefix.states[prefix.states.length - 1];
    const key = memoKey(currentState, depth);
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    const obs = prefix.states.map(this.O);
    const decisionLoss = JSON.stringify(this.D(prefix)) !== JSON.stringify(this.π(obs));
    if (decisionLoss) { memo.set(key, 0); return 0; }
    if (depth >= this.maxDepth) { memo.set(key, Infinity); return Infinity; }

    let minCost = Infinity;
    for (const action of this.tds.actions) {
      for (const candidate of this.tds.states) {
        const pHat = this.estimator.estimate(currentState, action, candidate);
        const pMax = this.uncertainty.pMax(currentState, action, pHat);
        if (pMax <= 0) continue;
        const stepCost = surprisalCost(pMax);
        const extended: TrajectoryPrefix<S, A> = {
          states: [...prefix.states, candidate],
          actions: [...prefix.actions, action],
        };
        const restCost = this.computeRobustMargin(extended, depth + 1, memo);
        if (restCost === Infinity) continue;
        const totalCost = stepCost + restCost;
        if (totalCost < minCost) minCost = totalCost;
      }
    }
    memo.set(key, minCost);
    return minCost;
  }
}
