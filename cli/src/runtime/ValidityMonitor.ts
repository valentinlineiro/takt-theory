import { TransitionEstimator } from './TransitionEstimator.js';

export class ValidityMonitor<S, A> {
  constructor(
    private estimator: TransitionEstimator<S, A>,
    private candidateStates: S[],
    private tau: number,
  ) {}

  drift(s: S, a: A): number {
    return this.candidateStates.reduce((sum, sNext) => {
      const pFull = this.estimator.estimate(s, a, sNext);
      const pWindow = this.estimator.windowEstimate(s, a, sNext);
      return sum + Math.abs(pWindow - pFull);
    }, 0);
  }

  isMismatched(s: S, a: A): boolean {
    return this.drift(s, a) > this.tau;
  }
}
