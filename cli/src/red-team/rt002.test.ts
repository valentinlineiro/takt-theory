import { describe, it, expect } from 'vitest';

// State space with high metric distance but direct transition constraint (rail)
interface State2D {
  id: string;
  x: number;
  y: number;
  decision: number;
}

const states: State2D[] = [
  { id: 's0', x: 0, y: 0, decision: 0 },
  { id: 's1', x: 10, y: 0, decision: 1 },
];

// Euclidean metric
const d = (sA: State2D, sB: State2D) => Math.sqrt((sA.x - sB.x) ** 2 + (sA.y - sB.y) ** 2);

// Transition constraint: A mechanical guide allows a transition path of high speed
const allowedTransition = (from: string, to: string) => from === 's0' && to === 's1';

describe('RT-002 Structural Margin Attack', () => {
  it('demonstrates high static margin with immediate dynamic decision violation', () => {
    const margin = d(states[0], states[1]);
    expect(margin).toBe(10); // Static margin is 10 >= minimum margin of 5

    // Transition occurs
    const transitionFails = allowedTransition('s0', 's1') && states[0].decision !== states[1].decision;
    expect(transitionFails).toBe(true);

    console.log(`[RT-002 Results] Static Margin: ${margin}, Immediate transition failure possible: ${transitionFails}`);
  });
});
