import { describe, it, expect } from 'vitest';
import { CertifiedContract } from '../../cli/src/runtime/certified/CertifiedContract.js';
import { CapabilityKernelMap } from '../../cli/src/runtime/certified/CapabilityKernelMap.js';
import type { LeanTraceabilityMetadata } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge.js';

describe('CertifiedContract & CapabilityKernelMap', () => {
  const meta: LeanTraceabilityMetadata = {
    stableContractId: 'GOV-HORIZON-001',
    contractVersion: '1.0.0',
    theoremId: 'Theorem IV.4',
    leanFile: 'TaktFormal/DynamicSafetyContract.lean',
    monographSection: 'Volume IV, Section 4.2'
  };

  it('should correctly compute intervention horizon h* = floor(m_min / c_max)', () => {
    const contract = new CertifiedContract(
      meta,
      (s: number[]) => s[0] > 0, // R
      (s: number[]) => (s[0] > 0 ? 1 : 0), // D
      (z: boolean) => (z ? 1 : 0), // pi
      2.0, // m_min
      0.01 // c_max
    );

    expect(contract.getInterventionHorizon()).toBe(200); // Math.floor(2.0 / 0.01)
  });

  it('should return Infinity when maxDriftRate <= 0', () => {
    const contract = new CertifiedContract(
      meta,
      (s: number[]) => s[0] > 0,
      (s: number[]) => (s[0] > 0 ? 1 : 0),
      (z: boolean) => (z ? 1 : 0),
      2.0,
      0
    );

    expect(contract.getInterventionHorizon()).toBe(Infinity);
  });

  it('should verify kernel inclusion ker(R) <= K_D via CapabilityKernelMap', () => {
    const kernelMap = new CapabilityKernelMap<number[], boolean, number>();
    const isRefined = kernelMap.verifyKernelInclusion(
      [1.0, 2.0],
      [1.0, 3.0],
      (s) => s[0] > 0, // R collapses both to true
      (s) => (s[0] > 0 ? 1 : 0) // D assigns both action 1
    );

    expect(isRefined).toBe(true);
  });

  it('should return true when ker(R) precondition does not hold (states not R-equivalent)', () => {
    const kernelMap = new CapabilityKernelMap<number[], boolean, number>();
    const isRefined = kernelMap.verifyKernelInclusion(
      [1.0, 2.0],
      [-1.0, 3.0],
      (s) => s[0] > 0, // s1: true, s2: false
      (s) => (s[0] > 0 ? 1 : 0)
    );

    expect(isRefined).toBe(true);
  });

  it('should return false when ker(R) holds but K_D does not (ideal decision differs)', () => {
    const kernelMap = new CapabilityKernelMap<number[], boolean, number>();
    const isRefined = kernelMap.verifyKernelInclusion(
      [1.0, 2.0],
      [1.0, 3.0],
      (s) => s[0] > 0, // both true
      (s) => s[1] // s1: 2.0, s2: 3.0 -> ideal decision differs
    );

    expect(isRefined).toBe(false);
  });
});
