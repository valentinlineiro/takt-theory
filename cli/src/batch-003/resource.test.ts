import { describe, it, expect } from 'vitest';
import { solveResourceSystem, ResCase } from './resource.js';

describe('Resource System Solver', () => {
  it('computes goal, cost, and crash risk correctly', () => {
    const res001: ResCase = {
      id: 'RES-001',
      processes: ['p1', 'p2'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 2 },
      requests: [{ from: 'p1', to: 'r1' }, { from: 'p2', to: 'r1' }],
      allocations: []
    };
    const result = solveResourceSystem(res001, ['p1', 'p2'], ['r1'], false);
    expect(result.g).toBe(10); // 2 unblocked * 5
    expect(result.e).toBe(3); // capacity 1 + 2 request edges
    expect(result.risk).toBeCloseTo(30 * (1 - Math.exp(-0.5 * 1))); // Overload demand 2 - capacity 1 = 1
  });

  it('handles active rate limiter (reducing demand and throttling one process)', () => {
    const res002: ResCase = {
      id: 'RES-002',
      processes: ['p1', 'p2', 'p3'],
      resources: ['r1', 'r2'],
      capacities: { r1: 1, r2: 2 },
      demands: { r1: 2, r2: 3 },
      requests: [{ from: 'p1', to: 'r1' }],
      allocations: [{ from: 'p2', to: 'r2' }]
    };
    // With rate limiter active:
    // - baseBlocked = 3 processes - 3 active = 0. baseBlocked + rateLimiterBlock = 1.
    //   blockedCount = min(3, 0 + 1) = 1. unblocked = 2. Goal g = 2 * 5 = 10.
    // - edgeCount = 1 request + 1 allocation = 2.
    //   capacitySum = capacities[r1] + capacities[r2] = 1 + 2 = 3.
    //   Environment cost e = 3 + 2 = 5.
    // - Overload:
    //   r1: cap=1, demand=2 -> demand reduced by rate limiter to 1 -> overload = max(0, 1 - 1) = 0
    //   r2: cap=2, demand=3 -> demand reduced by rate limiter to 2 -> overload = max(0, 2 - 2) = 0
    //   totalOverload = 0 -> crashProb = 0 -> risk = 0
    const result = solveResourceSystem(res002, ['p1', 'p2', 'p3'], ['r1', 'r2'], true);
    expect(result.g).toBe(10);
    expect(result.e).toBe(5);
    expect(result.risk).toBe(0);
  });

  it('returns zero crash risk when demand does not exceed capacity', () => {
    const res003: ResCase = {
      id: 'RES-003',
      processes: ['p1'],
      resources: ['r1'],
      capacities: { r1: 2 },
      demands: { r1: 2 },
      requests: [],
      allocations: []
    };
    const result = solveResourceSystem(res003, ['p1'], ['r1'], false);
    expect(result.risk).toBe(0);
  });

  it('handles edge case where all processes are inactive', () => {
    const res004: ResCase = {
      id: 'RES-004',
      processes: ['p1', 'p2'],
      resources: ['r1'],
      capacities: { r1: 1 },
      demands: { r1: 0 },
      requests: [],
      allocations: []
    };
    const result = solveResourceSystem(res004, [], ['r1'], false);
    expect(result.g).toBe(0);
  });

  it('handles missing capacity and demand, falling back to defaults', () => {
    const res005: ResCase = {
      id: 'RES-005',
      processes: ['p1'],
      resources: ['r1'],
      capacities: {}, // r1 missing capacity -> default 1
      demands: {},    // r1 missing demand -> default 0
      requests: [],
      allocations: []
    };
    const result = solveResourceSystem(res005, ['p1'], ['r1'], false);
    expect(result.e).toBe(1); // capacity default 1 + 0 edges
    expect(result.risk).toBe(0); // demand default 0 - capacity default 1 = 0 overload
  });
});
