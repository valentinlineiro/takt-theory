import { describe, it, expect, beforeEach } from 'vitest';
import { LeanTraceabilityBridge, LeanTraceabilityMetadata } from '../../cli/src/runtime/bridge/LeanTraceabilityBridge';
import { validateContractPayload } from '../../cli/src/runtime/schema/ContractSchema';
import { validateEventPayload } from '../../cli/src/runtime/schema/EventStreamSchema';

describe('LeanTraceabilityBridge', () => {
  beforeEach(() => {
    LeanTraceabilityBridge.clear();
  });

  it('should register and resolve metadata for valid stableContractId', () => {
    const meta: LeanTraceabilityMetadata = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2',
    };

    LeanTraceabilityBridge.register(meta);
    const resolved = LeanTraceabilityBridge.resolve('GOV-HORIZON-001');
    expect(resolved).toEqual(meta);
  });

  it('should throw an error when resolving an unregistered stableContractId', () => {
    expect(() => LeanTraceabilityBridge.resolve('NON-EXISTENT-ID')).toThrow(
      'Unregistered Lean 4 traceability contract ID: NON-EXISTENT-ID'
    );
  });

  it('should clear all registered metadata', () => {
    const meta: LeanTraceabilityMetadata = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      theoremId: 'Theorem IV.4',
      leanFile: 'TaktFormal/DynamicSafetyContract.lean',
      monographSection: 'Volume IV, Section 4.2',
    };

    LeanTraceabilityBridge.register(meta);
    LeanTraceabilityBridge.clear();

    expect(() => LeanTraceabilityBridge.resolve('GOV-HORIZON-001')).toThrow(
      'Unregistered Lean 4 traceability contract ID: GOV-HORIZON-001'
    );
  });
});

describe('ContractSchema', () => {
  it('should return true for valid contract payload', () => {
    const payload = {
      stableContractId: 'GOV-HORIZON-001',
      contractVersion: '1.0.0',
      minimumMarginThreshold: 0.15,
      maxDriftRate: 0.05,
    };
    expect(validateContractPayload(payload)).toBe(true);
  });

  it('should return false for invalid or incomplete payload', () => {
    expect(validateContractPayload(null)).toBe(false);
    expect(validateContractPayload('string')).toBe(false);
    expect(validateContractPayload({})).toBe(false);
    expect(
      validateContractPayload({
        stableContractId: 'GOV-HORIZON-001',
        contractVersion: '1.0.0',
        minimumMarginThreshold: 'invalid', // should be number
        maxDriftRate: 0.05,
      })
    ).toBe(false);
  });
});

describe('EventStreamSchema', () => {
  it('should return true for valid event payload', () => {
    const payload = {
      stepIndex: 1,
      concreteStateVector: [0.1, 0.2, 0.3],
    };
    expect(validateEventPayload(payload)).toBe(true);
  });

  it('should return false for invalid event payload', () => {
    expect(validateEventPayload(null)).toBe(false);
    expect(validateEventPayload(42)).toBe(false);
    expect(validateEventPayload({ stepIndex: '1', concreteStateVector: [] })).toBe(false);
    expect(validateEventPayload({ stepIndex: 1, concreteStateVector: 'not-an-array' })).toBe(false);
  });
});
