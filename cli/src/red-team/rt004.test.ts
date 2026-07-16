import { describe, it, expect } from 'vitest';

// System states and decisions
function D(x: number) {
  if (x === 4) return 1; // Exception state
  return x % 2 === 0 ? 0 : 1;
}

function R(x: number) {
  return x % 2 === 0 ? 0 : 1;
}

const pi = (rep: number) => rep; // Policy copies representation

// Test set does not contain exception state 4
const T = [0, 1, 2, 3];

function evaluateContract(testSet: number[]) {
  // Check safety on test set
  for (const x of testSet) {
    for (const y of testSet) {
      if (R(x) === R(y) && D(x) !== D(y)) {
        return false;
      }
    }
  }
  return true;
}

describe('RT-004 Adaptive Adversary', () => {
  it('optimizes inputs to maximize loss while keeping contract satisfied', () => {
    // Adversary chooses input trajectory. State 4 yields Loss > 0 but evades test-based contract
    const inputTrajectory = [0, 1, 4, 3];
    
    const contractSatisfied = evaluateContract(T);
    expect(contractSatisfied).toBe(true); // Contract remains satisfied based on T

    // Calculate total loss over the trajectory
    let lossCount = 0;
    for (const x of inputTrajectory) {
      if (pi(R(x)) !== D(x)) {
        lossCount++;
      }
    }

    const totalLoss = lossCount / inputTrajectory.length;
    expect(totalLoss).toBeGreaterThan(0); // Success: Loss > 0 under satisfaction
    
    console.log(`[RT-004 Results] Evasion succeeded. Contract: Satisfied, Trajectory Loss: ${totalLoss.toFixed(2)}`);
  });
});
