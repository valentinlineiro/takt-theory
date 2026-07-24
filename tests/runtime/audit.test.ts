import { describe, it, expect, beforeEach } from 'vitest';
import { AuditLogger, type AuditRecord } from '../../cli/src/runtime/audit/AuditLogger.js';

describe('AuditLogger', () => {
  let logger: AuditLogger;

  const sampleRecord: AuditRecord = {
    evaluationId: 'eval-trace-001',
    timestampISO: '2026-07-24T09:00:00.000Z',
    stableContractId: 'GOV-HORIZON-001',
    contractVersion: '1.0.0',
    previousState: 'MONITOR_SAFE',
    newState: 'RECALIBRATE',
    transitionReason: 'HorizonExceeded',
    evaluationOutcome: 'RECALIBRATED',
    currentStep: 201,
    cumulativeDrift: 2.1,
    horizonBound: 200
  };

  beforeEach(() => {
    logger = new AuditLogger();
  });

  it('should initialize with an empty log list', () => {
    expect(logger.getLogs()).toEqual([]);
    expect(logger.getLogs().length).toBe(0);
  });

  it('should log audit records and retrieve traces', () => {
    logger.log(sampleRecord);
    const logs = logger.getLogs();

    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(sampleRecord);
    expect(logs[0].evaluationId).toBe('eval-trace-001');
    expect(logs[0].stableContractId).toBe('GOV-HORIZON-001');
    expect(logs[0].transitionReason).toBe('HorizonExceeded');
  });

  it('should ensure logged records are immutable (Object.isFrozen)', () => {
    logger.log(sampleRecord);
    const logs = logger.getLogs();

    expect(Object.isFrozen(logs[0])).toBe(true);
    expect(() => {
      // @ts-expect-error mutating frozen object should throw in strict mode
      logs[0].evaluationId = 'mutated-id';
    }).toThrow();
  });

  it('should support logging multiple records sequentially', () => {
    const secondRecord: AuditRecord = {
      ...sampleRecord,
      evaluationId: 'eval-trace-002',
      previousState: 'RECALIBRATE',
      newState: 'MONITOR_SAFE',
      transitionReason: 'RecalibrationSucceeded',
      evaluationOutcome: 'SAFE',
      currentStep: 202
    };

    logger.log(sampleRecord);
    logger.log(secondRecord);

    const logs = logger.getLogs();
    expect(logs.length).toBe(2);
    expect(logs[0].evaluationId).toBe('eval-trace-001');
    expect(logs[1].evaluationId).toBe('eval-trace-002');
    expect(Object.isFrozen(logs[0])).toBe(true);
    expect(Object.isFrozen(logs[1])).toBe(true);
  });

  it('should clear logs when clear() is called', () => {
    logger.log(sampleRecord);
    expect(logger.getLogs().length).toBe(1);

    logger.clear();
    expect(logger.getLogs().length).toBe(0);
    expect(logger.getLogs()).toEqual([]);
  });
});
