import { computeDynamicMargin, computeCMax } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { buildSafeTDS, buildRiskyTDS, O, lossD, lossπ, D, π, F003State, F003Action } from './fixtures.js';

export interface HorizonResult {
  m_D: number;
  cMax: number;
  failureWithinH: boolean;
  h: number;
}

export interface BatchF003Result {
  safePrefix: HorizonResult;
  riskyPrefix: HorizonResult;
}

export function executeBatchF003(options?: { failureNearby?: boolean }): BatchF003Result {
  const h = 1;

  if (options?.failureNearby) {
    const tds = buildRiskyTDS();
    const risky: TrajectoryPrefix<F003State, F003Action> = { states: [{ id: 's0' }], actions: [] };
    const m_D = computeDynamicMargin(risky, tds, lossD, lossπ, O);
    const cMax = computeCMax(risky, h, tds);
    return {
      safePrefix: { m_D: 0, cMax: 0, failureWithinH: true, h },
      riskyPrefix: { m_D, cMax, failureWithinH: m_D <= cMax, h },
    };
  }

  const tds = buildSafeTDS();
  const safe: TrajectoryPrefix<F003State, F003Action> = { states: [{ id: 's0' }], actions: [] };

  const m_D = computeDynamicMargin(safe, tds, lossD, lossπ, O);

  const m_D_agree = computeDynamicMargin(safe, tds, D, π, O);
  const cMax = computeCMax(safe, h, tds);

  return {
    safePrefix: { m_D: m_D_agree, cMax, failureWithinH: m_D_agree <= cMax, h },
    riskyPrefix: { m_D, cMax, failureWithinH: m_D <= cMax, h },
  };
}
