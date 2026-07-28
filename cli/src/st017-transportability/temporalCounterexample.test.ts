import { describe, it, expect } from 'vitest';
import {
  attributes,
  sound,
  soundPrime,
  kernelSound,
  classifyTransport,
  type Runtime,
} from './mockRuntime.js';

/**
 * Executable instance of the counterexample in
 * docs/superpowers/specs/2026-07-28-st017-syntactic-transport-counterexample.md,
 * grounded in the same C_temporal witness shape as ST-016 Example 1
 * (paper/sections/03-foundations.tex) and EXP-004
 * (cli/src/runtime/__tests__/ablation/temporal.ablation.test.ts).
 *
 * M1: ordered-list trajectory encoding, order-sensitive policy.
 * M2: multiset trajectory encoding (same array type, sorted comparison),
 *     order-insensitive policy.
 * T: identity on the underlying array — schema-compatible (same field,
 *    same type), per Axiom 1/4 in the design spec. Only the runtimes'
 *    comparison semantics differ.
 * Ablation (for both): "ignore everything except the terminal state" —
 *    the same operational meaning as ST-016 Example 1's C_temporal ablation.
 */

type Trajectory = string[];

function orderedRuntime(): Runtime<Trajectory> {
  return {
    capabilities: new Set(['C_temporal']),
    policy: (r) => r.join(','),
    ablate: (c) => {
      if (c !== 'C_temporal') return orderedRuntime();
      return { ...orderedRuntime(), policy: (r: Trajectory) => r[r.length - 1] };
    },
  };
}

function multisetRuntime(): Runtime<Trajectory> {
  return {
    capabilities: new Set(['C_temporal']),
    policy: (r) => [...r].sort().join(','),
    ablate: (c) => {
      if (c !== 'C_temporal') return multisetRuntime();
      return { ...multisetRuntime(), policy: (r: Trajectory) => r[r.length - 1] };
    },
  };
}

function schemaLossRuntime(): Runtime<Trajectory> {
  return {
    capabilities: new Set(['C_contract']), // C_temporal not representable here
    policy: (r) => r.join(','),
    ablate: () => schemaLossRuntime(),
  };
}

const T = (r: Trajectory): Trajectory => r; // identity — structurally lossless, order-blind at M2

describe('ST-017 counterexample: schema-compatible transport violating decision preservation', () => {
  const M1 = orderedRuntime();
  const M2 = multisetRuntime();
  const M3 = schemaLossRuntime();
  const K_D = ['C_temporal'];

  it('degraded: interior order swap — Attributes(C_temporal, M1) holds, collapses under T into M2', () => {
    const tau3: Trajectory = ['a', 'b', 'c'];
    const tau4: Trajectory = ['b', 'a', 'c'];

    expect(attributes('C_temporal', M1, tau3, tau4)).toBe(true);
    expect(attributes('C_temporal', M2, T(tau3), T(tau4))).toBe(false);
    expect(sound(T, 'C_temporal', M1, M2, tau3, tau4)).toBe(false);
    expect(soundPrime(T, 'C_temporal', M1, M2, tau3, tau4)).toBe(false);
    expect(kernelSound(T, K_D, M1, M2, tau3, tau4)).toBe(false);
    expect(classifyTransport(T, 'C_temporal', M1, M2, tau3, tau4)).toBe('degraded');
  });

  it('preserved: boundary swap (ST-016 Example 1 shape) — survives transport into M2', () => {
    const tau5: Trajectory = ['a', 'b', 'c'];
    const tau6: Trajectory = ['x', 'b', 'c'];

    expect(attributes('C_temporal', M1, tau5, tau6)).toBe(true);
    expect(attributes('C_temporal', M2, T(tau5), T(tau6))).toBe(true);
    expect(sound(T, 'C_temporal', M1, M2, tau5, tau6)).toBe(true);
    expect(soundPrime(T, 'C_temporal', M1, M2, tau5, tau6)).toBe(true);
    expect(kernelSound(T, K_D, M1, M2, tau5, tau6)).toBe(true);
    expect(classifyTransport(T, 'C_temporal', M1, M2, tau5, tau6)).toBe('preserved');
  });

  it('lost: transporting into a runtime whose schema drops C_temporal entirely', () => {
    const tau5: Trajectory = ['a', 'b', 'c'];
    const tau6: Trajectory = ['x', 'b', 'c'];

    expect(classifyTransport(T, 'C_temporal', M1, M3, tau5, tau6)).toBe('lost');
  });
});
