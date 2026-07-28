/**
 * Minimal executable instances of the frozen ST-017 definitions
 * (docs/superpowers/specs/2026-07-28-st017-formal-model-draft.md).
 *
 * These are per-witness checks, not universal quantifiers: exactly like
 * ST-016's own witness discipline (paper/sections/04-formalization.tex),
 * a `true` result certifies one instance, not a general theorem.
 *
 * ponytail: K_D is a single capability here ({C_temporal}), so
 * kernelSound coincides with soundPrime for that one capability.
 * Exercising KernelSound's extra freedom (a capability-shift like
 * C_temporal -> C_uncertainty) needs a second capability in the target
 * kernel and is out of scope for this minimal instance — add when a
 * KernelSound-vs-CapabilitySound witness is actually needed.
 */

export type Decision = string;

export interface Runtime<R> {
  readonly capabilities: ReadonlySet<string>;
  policy(r: R): Decision;
  ablate(c: string): Runtime<R>;
}

/** Attributes(c, M, x, y) — design draft §1, table row 1. */
export function attributes<R>(c: string, M: Runtime<R>, x: R, y: R): boolean {
  return M.policy(x) !== M.policy(y) && M.ablate(c).policy(x) === M.ablate(c).policy(y);
}

/** Sound(T, c) — decision-level, does not compose (P3). */
export function sound<R1, R2>(
  T: (r: R1) => R2,
  c: string,
  M1: Runtime<R1>,
  M2: Runtime<R2>,
  x: R1,
  y: R1
): boolean {
  if (!attributes(c, M1, x, y)) return true; // vacuously sound for this pair
  return M2.policy(T(x)) !== M2.policy(T(y));
}

/** Sound'(T, c) — capability-level, composes (P2). */
export function soundPrime<R1, R2>(
  T: (r: R1) => R2,
  c: string,
  M1: Runtime<R1>,
  M2: Runtime<R2>,
  x: R1,
  y: R1
): boolean {
  if (!attributes(c, M1, x, y)) return true;
  return attributes(c, M2, T(x), T(y));
}

/** KernelSound(T) — existential over K_D, composes (P2). */
export function kernelSound<R1, R2>(
  T: (r: R1) => R2,
  K_D: readonly string[],
  M1: Runtime<R1>,
  M2: Runtime<R2>,
  x: R1,
  y: R1
): boolean {
  const attributedBy = K_D.find((c) => attributes(c, M1, x, y));
  if (attributedBy === undefined) return true;
  return K_D.some((c) => M2.capabilities.has(c) && attributes(c, M2, T(x), T(y)));
}

export type TransportOutcome = 'preserved' | 'degraded' | 'lost';

/** Preserved/Degraded/Lost trichotomy — transportability-failure-modes.md §1, P6. */
export function classifyTransport<R1, R2>(
  T: (r: R1) => R2,
  c: string,
  M1: Runtime<R1>,
  M2: Runtime<R2>,
  x: R1,
  y: R1
): TransportOutcome {
  if (!M2.capabilities.has(c)) return 'lost';
  return attributes(c, M2, T(x), T(y)) ? 'preserved' : 'degraded';
}
