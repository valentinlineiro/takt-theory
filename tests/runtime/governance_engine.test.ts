import { describe, it, expect, beforeEach } from 'vitest';
import { GovernanceStateMachine } from '../../cli/src/runtime/engine/GovernanceStateMachine.js';
import type { EvaluationContext } from '../../cli/src/runtime/engine/TransitionReasons.js';

describe('GovernanceStateMachine Engine', () => {
  let gsm: GovernanceStateMachine;

  beforeEach(() => {
    gsm = new GovernanceStateMachine();
  });

  it('should initialize in MONITOR_SAFE state', () => {
    expect(gsm.getCurrentState()).toBe('MONITOR_SAFE');
  });

  describe('MONITOR_SAFE transitions', () => {
    it('should stay in MONITOR_SAFE with outcome SAFE when currentStep <= horizonBound and contract is not violated', () => {
      const ctx: EvaluationContext = {
        currentStep: 5,
        cumulativeDrift: 0.1,
        horizonBound: 10,
        isContractViolated: false
      };

      const result = gsm.evaluateStep(ctx);
      expect(result.newState).toBe('MONITOR_SAFE');
      expect(result.rule.reason).toBe('WithinHorizonBoundary');
      expect(result.rule.outcome).toBe('SAFE');
      expect(gsm.getCurrentState()).toBe('MONITOR_SAFE');
    });

    it('should transition from MONITOR_SAFE to RECALIBRATE with outcome RECALIBRATED when horizon is exceeded', () => {
      const ctx: EvaluationContext = {
        currentStep: 11,
        cumulativeDrift: 0.5,
        horizonBound: 10,
        isContractViolated: false
      };

      const result = gsm.evaluateStep(ctx);
      expect(result.newState).toBe('RECALIBRATE');
      expect(result.rule.reason).toBe('HorizonExceeded');
      expect(result.rule.outcome).toBe('RECALIBRATED');
      expect(gsm.getCurrentState()).toBe('RECALIBRATE');
    });

    it('should transition from MONITOR_SAFE to INTERVENE_FALLBACK with outcome FALLBACK when contract is violated', () => {
      const ctx: EvaluationContext = {
        currentStep: 3,
        cumulativeDrift: 2.0,
        horizonBound: 10,
        isContractViolated: true
      };

      const result = gsm.evaluateStep(ctx);
      expect(result.newState).toBe('INTERVENE_FALLBACK');
      expect(result.rule.reason).toBe('ContractViolationDetected');
      expect(result.rule.outcome).toBe('FALLBACK');
      expect(gsm.getCurrentState()).toBe('INTERVENE_FALLBACK');
    });
  });

  describe('RECALIBRATE transitions', () => {
    beforeEach(() => {
      // Move to RECALIBRATE first
      gsm.evaluateStep({
        currentStep: 15,
        cumulativeDrift: 0.8,
        horizonBound: 10,
        isContractViolated: false
      });
      expect(gsm.getCurrentState()).toBe('RECALIBRATE');
    });

    it('should transition from RECALIBRATE to MONITOR_SAFE with outcome SAFE when recalibration succeeds (no violation)', () => {
      const ctx: EvaluationContext = {
        currentStep: 1,
        cumulativeDrift: 0.0,
        horizonBound: 20,
        isContractViolated: false
      };

      const result = gsm.evaluateStep(ctx);
      expect(result.newState).toBe('MONITOR_SAFE');
      expect(result.rule.reason).toBe('RecalibrationSucceeded');
      expect(result.rule.outcome).toBe('SAFE');
      expect(gsm.getCurrentState()).toBe('MONITOR_SAFE');
    });

    it('should transition from RECALIBRATE to INTERVENE_FALLBACK with outcome FALLBACK when contract violation is detected during recalibration', () => {
      const ctx: EvaluationContext = {
        currentStep: 16,
        cumulativeDrift: 2.5,
        horizonBound: 10,
        isContractViolated: true
      };

      const result = gsm.evaluateStep(ctx);
      expect(result.newState).toBe('INTERVENE_FALLBACK');
      expect(result.rule.reason).toBe('ContractViolationDetected');
      expect(result.rule.outcome).toBe('FALLBACK');
      expect(gsm.getCurrentState()).toBe('INTERVENE_FALLBACK');
    });
  });

  describe('Invalid state transitions and reset', () => {
    it('should throw an error when evaluateStep is called in INTERVENE_FALLBACK state', () => {
      gsm.evaluateStep({
        currentStep: 5,
        cumulativeDrift: 3.0,
        horizonBound: 10,
        isContractViolated: true
      });
      expect(gsm.getCurrentState()).toBe('INTERVENE_FALLBACK');

      const ctx: EvaluationContext = {
        currentStep: 6,
        cumulativeDrift: 3.0,
        horizonBound: 10,
        isContractViolated: false
      };

      expect(() => gsm.evaluateStep(ctx)).toThrow('Invalid state transition for state=INTERVENE_FALLBACK');
    });

    it('should reset back to MONITOR_SAFE state', () => {
      gsm.evaluateStep({
        currentStep: 5,
        cumulativeDrift: 3.0,
        horizonBound: 10,
        isContractViolated: true
      });
      expect(gsm.getCurrentState()).toBe('INTERVENE_FALLBACK');

      gsm.reset();
      expect(gsm.getCurrentState()).toBe('MONITOR_SAFE');
    });
  });
});
