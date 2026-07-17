import { stateActionKey } from './types.js';

export class TransitionEstimator<S, A> {
  private fullCounts = new Map<string, Map<string, number>>();
  private fullTotal = new Map<string, number>();
  private window = new Map<string, string[]>();

  constructor(private windowSize: number) {}

  observe(s: S, a: A, sNext: S): void {
    const key = stateActionKey(s, a);
    const nextKey = JSON.stringify(sNext);

    const counts = this.fullCounts.get(key) ?? new Map<string, number>();
    counts.set(nextKey, (counts.get(nextKey) ?? 0) + 1);
    this.fullCounts.set(key, counts);
    this.fullTotal.set(key, (this.fullTotal.get(key) ?? 0) + 1);

    const win = this.window.get(key) ?? [];
    win.push(nextKey);
    if (win.length > this.windowSize) win.shift();
    this.window.set(key, win);
  }

  count(s: S, a: A): number {
    return this.fullTotal.get(stateActionKey(s, a)) ?? 0;
  }

  estimate(s: S, a: A, sNext: S): number {
    const key = stateActionKey(s, a);
    const total = this.fullTotal.get(key) ?? 0;
    if (total === 0) return 0;
    const counts = this.fullCounts.get(key);
    return (counts?.get(JSON.stringify(sNext)) ?? 0) / total;
  }

  windowEstimate(s: S, a: A, sNext: S): number {
    const win = this.window.get(stateActionKey(s, a)) ?? [];
    if (win.length === 0) return 0;
    const nextKey = JSON.stringify(sNext);
    const matches = win.filter(k => k === nextKey).length;
    return matches / win.length;
  }

  forget(s: S, a: A): void {
    const key = stateActionKey(s, a);
    this.fullCounts.delete(key);
    this.fullTotal.delete(key);
  }
}
