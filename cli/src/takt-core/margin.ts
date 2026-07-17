import { TrajectoryPrefix } from './types.js';

export interface TransitionResult<S> {
  state: S;
  prob: number;
}

export interface TransitionSystem<S, A> {
  states: S[];
  actions: A[];
  transition: (state: S, action: A) => TransitionResult<S>[];
}

function surprisalCost(prob: number): number {
  if (prob <= 0) return Infinity;
  return -Math.log(prob);
}

function extendPrefix<S, A>(
  prefix: TrajectoryPrefix<S, A>,
  nextState: S,
  action: A
): TrajectoryPrefix<S, A> {
  return {
    states: [...prefix.states, nextState],
    actions: [...prefix.actions, action],
  };
}

type MemoKey = string;
function memoKey<S>(state: S, depth: number): MemoKey {
  return JSON.stringify(state) + '@' + depth;
}

// ponytail: state+depth memo assumes Markovian D/π. Full-prefix memo if needed.
export function computeDynamicMargin<S, A, O>(
  prefix: TrajectoryPrefix<S, A>,
  tds: TransitionSystem<S, A>,
  D: (prefix: TrajectoryPrefix<S, A>) => A,
  π: (obs: O[]) => A,
  O: (state: S) => O,
  depth: number = 0,
  maxDepth: number = 50,
  memo?: Map<MemoKey, number>
): number {
  if (!memo) memo = new Map();
  const currentState = prefix.states[prefix.states.length - 1];
  const key = memoKey(currentState, depth);
  const cached = memo.get(key);
  if (cached !== undefined) return cached;

  const obs = prefix.states.map(O);
  const decisionLoss = JSON.stringify(D(prefix)) !== JSON.stringify(π(obs));
  if (decisionLoss) { memo.set(key, 0); return 0; }
  if (depth >= maxDepth) { memo.set(key, Infinity); return Infinity; }

  let minCost = Infinity;
  for (const action of tds.actions) {
    const transitions = tds.transition(currentState, action);
    for (const { state, prob } of transitions) {
      if (prob <= 0) continue;
      const stepCost = surprisalCost(prob);
      const extended = extendPrefix(prefix, state, action);
      const restCost = computeDynamicMargin(extended, tds, D, π, O, depth + 1, maxDepth, memo);
      if (restCost === Infinity) continue;
      const totalCost = stepCost + restCost;
      if (totalCost < minCost) minCost = totalCost;
    }
  }
  memo.set(key, minCost);
  return minCost;
}

export function computeCMax<S, A>(
  prefix: TrajectoryPrefix<S, A>,
  h: number,
  tds: TransitionSystem<S, A>,
  depth: number = 0,
  memo?: Map<MemoKey, number>
): number {
  if (!memo) memo = new Map();
  if (depth >= h) return 0;
  const currentState = prefix.states[prefix.states.length - 1];
  const key = memoKey(currentState, depth);
  const cached = memo.get(key);
  if (cached !== undefined) return cached;

  let maxCost = 0;
  for (const action of tds.actions) {
    const transitions = tds.transition(currentState, action);
    for (const { state, prob } of transitions) {
      if (prob <= 0) continue;
      const stepCost = surprisalCost(prob);
      const extended = extendPrefix(prefix, state, action);
      const restCost = computeCMax(extended, h, tds, depth + 1, memo);
      const totalCost = stepCost + restCost;
      if (totalCost > maxCost) maxCost = totalCost;
    }
  }
  memo.set(key, maxCost);
  return maxCost;
}
