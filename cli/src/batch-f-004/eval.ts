import { F004State, F004Action, buildGameTDS, π_adv, π_audit_passive, π_audit_active, AuditAction } from './fixtures.js';
import { TransitionSystem } from '../takt-core/margin.js';

export interface BatchF004Result {
  expectedLoss: number;
  epsilon: number;
}

function simulate(
  tds: TransitionSystem<F004State, F004Action>,
  auditPolicy: (state: F004State) => AuditAction,
  steps: number
): number {
  let state: F004State = { id: 'nominal', phase: 'nominal' };
  let totalLoss = 0;

  for (let t = 0; t < steps; t++) {
    const auditAction = auditPolicy(state);

    if (auditAction === 'intervene') {
      state = { id: 'nominal', phase: 'nominal' };
      continue;
    }

    const transitions = tds.transition(state, π_adv());
    state = transitions[0].state;

    if (state.phase === 'failure') totalLoss += 1;
  }

  return totalLoss / steps;
}

export function executeBatchF004(options?: {
  strongAdversary?: boolean;
  intervene?: boolean;
}): BatchF004Result {
  const tds = buildGameTDS();
  const epsilon = 0.3;
  const steps = 100;

  if (options?.intervene) {
    return {
      expectedLoss: simulate(tds, () => 'intervene', steps),
      epsilon,
    };
  }

  if (options?.strongAdversary) {
    const loss = simulate(tds, π_audit_passive, steps);
    return { expectedLoss: loss, epsilon };
  }

  const loss = simulate(tds, π_audit_active, steps);
  return { expectedLoss: loss, epsilon };
}
