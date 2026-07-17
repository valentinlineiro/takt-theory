import { computeDynamicMargin, TransitionSystem } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { buildTDS, O, D, π, F002State, F002Action } from './fixtures.js';

export interface BatchF002Result {
  margins: Record<string, number>;
}

export function executeBatchF002(options?: { unreachableFailure?: boolean }): BatchF002Result {
  const tds = buildTDS();
  if (options?.unreachableFailure) {
    // D and π agree everywhere → no failure reachable
    const agreeingD = () => ({ id: 'a0' });
    const agreeingπ = () => ({ id: 'a0' });
    const safe: TrajectoryPrefix<F002State, F002Action> = {
      states: [{ id: 's0' }],
      actions: [],
    };
    const safeMargin = computeDynamicMargin(safe, tds, agreeingD, agreeingπ, O);
    return { margins: { safe: safeMargin } };
  }

  const s0: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's0' }], actions: [] };
  const s1: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's1' }], actions: [] };
  const s2: TrajectoryPrefix<F002State, F002Action> = { states: [{ id: 's2' }], actions: [] };

  return {
    margins: {
      s0: computeDynamicMargin(s0, tds, D, π, O),
      s1: computeDynamicMargin(s1, tds, D, π, O),
      s2: computeDynamicMargin(s2, tds, D, π, O),
    },
  };
}
