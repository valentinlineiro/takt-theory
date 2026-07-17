import { stateActionKey } from './types.js';

export class UncertaintySet<S, A> {
  private counts = new Map<string, number>();

  constructor(private epsilon0: number) {}

  observe(s: S, a: A): void {
    const key = stateActionKey(s, a);
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  radius(s: S, a: A): number {
    const n = this.counts.get(stateActionKey(s, a)) ?? 0;
    return n === 0 ? this.epsilon0 : this.epsilon0 / Math.sqrt(n);
  }

  recover(s: S, a: A): void {
    this.counts.set(stateActionKey(s, a), 0);
  }

  pMax(s: S, a: A, pHat: number): number {
    return Math.min(1, pHat + this.radius(s, a) / 2);
  }
}
