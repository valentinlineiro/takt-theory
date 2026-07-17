import { describe, it, expect } from 'vitest';
import { TrajectoryMonitor } from './TrajectoryMonitor.js';
import { DynamicMarginEstimator } from './DynamicMarginEstimator.js';
import { AuditPolicy } from './AuditPolicy.js';
import { ContractEvaluator } from './ContractEvaluator.js';
import { Event, eventToPrefix } from './types.js';
import { computeDynamicMargin } from '../takt-core/margin.js';
import { TrajectoryPrefix } from '../takt-core/types.js';
import { buildGameTDS, O, F004State, F004Action, F004Obs, π_audit_active } from '../batch-f-004/fixtures.js';


const tds = buildGameTDS();
const π_adv: (obs: F004Obs[]) => F004Action = () => ({ id: 'push' });

function state(id: string, phase: 'nominal' | 'degraded' | 'failure'): F004State {
  return { id, phase };
}

function makeEvent(state: F004State, action: F004Action, ts: number = 0): Event<F004State, F004Action> {
  return { state, action, timestamp: ts };
}

// Reference policy that matches π_adv (always push) — no decision loss
const D_same: (p: TrajectoryPrefix<F004State, F004Action>) => F004Action = () => ({ id: 'push' });

// Reference policy that intervenes when state is degraded/failure
const D_audit: (p: TrajectoryPrefix<F004State, F004Action>) => F004Action = (p) => {
  const last = p.states[p.states.length - 1];
  if (last.phase === 'degraded' || last.phase === 'failure') return { id: 'intervene' };
  return { id: 'push' };
};

describe('R0: Runtime semantics match formal TDS semantics', () => {
  it('prefix after single event matches formal τ_0', () => {
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    const e = makeEvent(state('nominal', 'nominal'), { id: 'push' });
    monitor.ingest(e);
    expect(monitor.getPrefix()).toEqual({
      states: [state('nominal', 'nominal')],
      actions: [{ id: 'push' }],
    });
  });

  it('prefix accumulates incrementally', () => {
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    const events = [
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
    ];
    events.forEach((e, i) => {
      monitor.ingest(e);
      expect(monitor.getPrefix().states.length).toBe(i + 1);
      expect(monitor.getPrefix().actions.length).toBe(i + 1);
    });
  });

  it('eventToPrefix matches monitor accumulation', () => {
    const events = [
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
    ];
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    events.forEach(e => monitor.ingest(e));
    expect(monitor.getPrefix()).toEqual(eventToPrefix(events));
  });
});

describe('R1: Streaming M_D matches batch M_D', () => {
  it('incremental and batch paths produce same M_D', () => {
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    const estimator = new DynamicMarginEstimator(tds, D_same, π_adv, O);
    const events = [makeEvent(state('nominal', 'nominal'), { id: 'push' })];

    events.forEach(e => monitor.ingest(e));
    const streamMD = estimator.estimate(monitor.getPrefix());
    const batchMD = estimator.estimate(eventToPrefix(events));
    expect(streamMD).toBe(batchMD);
  });

  it('estimator matches computeDynamicMargin directly', () => {
    const prefix: TrajectoryPrefix<F004State, F004Action> = {
      states: [state('nominal', 'nominal')],
      actions: [{ id: 'push' }],
    };
    const estimatorMD = new DynamicMarginEstimator(tds, D_same, π_adv, O).estimate(prefix);
    const directMD = computeDynamicMargin(prefix, tds, D_same, π_adv, O);
    expect(estimatorMD).toBe(directMD);
  });
});

describe('R3: F-004 simulation replayable over runtime API', () => {
  it('trajectory from F-004 active audit flows through runtime pipeline without error', () => {
    // Simulate F-004 game trajectory for 5 cycles
    const events: Event<F004State, F004Action>[] = [];
    let state: F004State = { id: 'nominal', phase: 'nominal' };
    let t = 0;

    for (let step = 0; step < 10; step++) {
      const auditAction = π_audit_active(state);
      if (auditAction === 'intervene') {
        events.push(makeEvent(state, { id: 'intervene' }, t++));
        state = { id: 'nominal', phase: 'nominal' };
      } else {
        events.push(makeEvent(state, { id: 'push' }, t++));
        state = { id: 'degraded', phase: 'degraded' };
      }
    }

    // Replay events through the runtime pipeline
    const D_active: (p: TrajectoryPrefix<F004State, F004Action>) => F004Action = (p) => {
      const last = p.states[p.states.length - 1];
      return last.phase === 'degraded' ? { id: 'intervene' } : { id: 'push' };
    };
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_active, π_adv, O);
    const monitor = new TrajectoryMonitor<F004State, F004Action>();
    const evaluator = new ContractEvaluator(0.3);

    events.forEach(e => {
      monitor.ingest(e);
      const margin = estimator.estimate(monitor.getPrefix());
      evaluator.evaluate(policy.decide(margin, 0.5), { loss: false });
    });

    expect(monitor.getPrefix().states.length).toBe(events.length);
    expect(evaluator.report().totalLoss).toBe(0);
  });
});

describe('R2: Online auditor makes same decisions as F-004 simulator', () => {
  it('safe prefix (D=π) yields MONITOR', () => {
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_same, π_adv, O);
    const margin = estimator.estimate(eventToPrefix([
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
    ]));
    expect(policy.decide(margin, 0.5).action).toBe('MONITOR');
  });

  it('risky prefix (D≠π at degraded state) yields INTERVENE', () => {
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_audit, π_adv, O);
    const margin = estimator.estimate(eventToPrefix([
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
    ]));
    expect(policy.decide(margin, 0.5).action).toBe('INTERVENE');
  });
});

describe('R4: Adversary triggers intervention before failure', () => {
  it('runtime intervenes on adversarial trajectory before failure', () => {
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_audit, π_adv, O);
    const monitor = new TrajectoryMonitor<F004State, F004Action>();

    const events = [
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
      makeEvent(state('failure', 'failure'), { id: 'push' }),
    ];

    let preFailureIntervene = false;
    events.forEach((e, i) => {
      monitor.ingest(e);
      const margin = estimator.estimate(monitor.getPrefix());
      const decision = policy.decide(margin, 0.5);
      if (decision.action === 'INTERVENE' && e.state.phase !== 'failure') {
        preFailureIntervene = true;
      }
    });

    expect(preFailureIntervene).toBe(true);
  });
});

describe('R5: Runtime detects governance failure', () => {
  it('INTERVENE records intervention in contract report', () => {
    const evaluator = new ContractEvaluator(0.3);
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_audit, π_adv, O);
    const monitor = new TrajectoryMonitor<F004State, F004Action>();

    const events = [
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
    ];

    events.forEach(e => {
      monitor.ingest(e);
      const margin = estimator.estimate(monitor.getPrefix());
      const decision = policy.decide(margin, 0.5);
      evaluator.evaluate(decision, { loss: false });
    });

    expect(evaluator.report().interventionCount).toBeGreaterThan(0);
  });

  it('no intervention on failure records violation', () => {
    // D_passive never intervenes — allows failure
    const D_passive: (p: TrajectoryPrefix<F004State, F004Action>) => F004Action = () => ({ id: 'push' });
    const evaluator = new ContractEvaluator(0.3);
    const policy = new AuditPolicy();
    const estimator = new DynamicMarginEstimator(tds, D_passive, π_adv, O);
    const monitor = new TrajectoryMonitor<F004State, F004Action>();

    const events = [
      makeEvent(state('nominal', 'nominal'), { id: 'push' }),
      makeEvent(state('degraded', 'degraded'), { id: 'push' }),
      makeEvent(state('failure', 'failure'), { id: 'push' }),
    ];

    events.forEach(e => {
      monitor.ingest(e);
      const margin = estimator.estimate(monitor.getPrefix());
      const decision = policy.decide(margin, 0.5);
      evaluator.evaluate(decision, { loss: e.state.phase === 'failure' });
    });

    const report = evaluator.report();
    expect(report.totalLoss).toBeGreaterThan(0);
    expect(report.violationCount).toBeGreaterThan(0);
  });
});
