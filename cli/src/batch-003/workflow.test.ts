import { describe, it, expect } from 'vitest';
import { solveWorkflow, WrkCase } from './workflow.js';

describe('Workflow Solver', () => {
  it('computes expected workflow utility values correctly', () => {
    const wrk001: WrkCase = {
      id: 'WRK-001',
      tasks: [
        { id: 't1', cost: 2, pFail: 0.1, isCheckpoint: false },
        { id: 't2', cost: 3, pFail: 0.0, isCheckpoint: true }
      ]
    };
    const result = solveWorkflow(wrk001, ['t1', 't2']);
    expect(result.g).toBeCloseTo(10 * 0.9);
    expect(result.e).toBe(5);
    expect(result.risk).toBeCloseTo(0.1 * 2); // p_t1 * rollback_cost (t1 rolls back to start)
  });

  it('handles empty active tasks list', () => {
    const wrk: WrkCase = {
      id: 'WRK-EMPTY',
      tasks: [
        { id: 't1', cost: 2, pFail: 0.1, isCheckpoint: false }
      ]
    };
    const result = solveWorkflow(wrk, []);
    expect(result.g).toBe(10);
    expect(result.e).toBe(0);
    expect(result.risk).toBe(0);
  });

  it('handles single task that fails', () => {
    const wrk: WrkCase = {
      id: 'WRK-SINGLE-FAIL',
      tasks: [
        { id: 't1', cost: 5, pFail: 0.2, isCheckpoint: false }
      ]
    };
    const result = solveWorkflow(wrk, ['t1']);
    expect(result.g).toBeCloseTo(10 * 0.8);
    expect(result.e).toBe(5);
    expect(result.risk).toBeCloseTo(0.2 * 5);
  });

  it('handles nested rollback paths with multiple checkpoints', () => {
    const wrk: WrkCase = {
      id: 'WRK-MULTI-CHECKPOINT',
      tasks: [
        { id: 't1', cost: 3, pFail: 0.0, isCheckpoint: true },
        { id: 't2', cost: 2, pFail: 0.1, isCheckpoint: false },
        { id: 't3', cost: 4, pFail: 0.2, isCheckpoint: true },
        { id: 't4', cost: 5, pFail: 0.3, isCheckpoint: false }
      ]
    };
    const result = solveWorkflow(wrk, ['t1', 't2', 't3', 't4']);
    expect(result.g).toBeCloseTo(10 * 1.0 * 0.9 * 0.8 * 0.7);
    expect(result.e).toBe(14);
    // t1 has pFail 0 -> risk = 0
    // t2 has pFail 0.1, rolls back to t1 (index 0). cost = t2.cost = 2. risk contribution = 0.1 * 2 = 0.2
    // t3 has pFail 0.2, rolls back to t1 (index 0). cost = t2.cost + t3.cost = 6. risk contribution = 0.2 * 6 = 1.2
    // t4 has pFail 0.3, rolls back to t3 (index 2). cost = t4.cost = 5. risk contribution = 0.3 * 5 = 1.5
    // Total risk = 0.2 + 1.2 + 1.5 = 2.9
    expect(result.risk).toBeCloseTo(2.9);
  });

  it('correctly filters out inactive tasks for path and checkpoint computation', () => {
    const wrk: WrkCase = {
      id: 'WRK-INACTIVE',
      tasks: [
        { id: 't1', cost: 3, pFail: 0.0, isCheckpoint: true },
        { id: 't2', cost: 10, pFail: 0.5, isCheckpoint: true }, // inactive
        { id: 't3', cost: 2, pFail: 0.1, isCheckpoint: false },
        { id: 't4', cost: 4, pFail: 0.2, isCheckpoint: true }
      ]
    };
    // If t2 is inactive, the active tasks list is ['t1', 't3', 't4']
    // Tasks:
    // index 0: t1 (cost 3, pFail 0, checkpoint)
    // index 1: t3 (cost 2, pFail 0.1, not checkpoint)
    // index 2: t4 (cost 4, pFail 0.2, checkpoint)
    const result = solveWorkflow(wrk, ['t1', 't3', 't4']);
    expect(result.g).toBeCloseTo(10 * 1.0 * 0.9 * 0.8);
    expect(result.e).toBe(9);
    // t1 has pFail 0 -> risk = 0
    // t3 has pFail 0.1, rolls back to t1 (index 0). cost = t3.cost = 2. risk = 0.1 * 2 = 0.2
    // t4 has pFail 0.2, rolls back to t1 (index 0). cost = t3.cost + t4.cost = 6. risk = 0.2 * 6 = 1.2
    // Total risk = 0.2 + 1.2 = 1.4
    expect(result.risk).toBeCloseTo(1.4);
  });
});
