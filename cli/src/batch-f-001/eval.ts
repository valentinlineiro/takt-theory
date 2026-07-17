import { checkCoverage, checkConsistency } from '../takt-core/coverage.js';
import { observationallyEquivalent } from '../takt-core/trajectory.js';
import { buildPrefixes, O, D } from './fixtures.js';

export interface BatchF001Result {
  coverage: boolean;
  consistency: boolean;
  totalPrefixes: number;
  coveredPrefixes: number;
}

export function executeBatchF001(options?: {
  incompleteCoverage?: boolean;
  inconsistentDecisions?: boolean;
}): BatchF001Result {
  const { T_audit, allPrefixes } = buildPrefixes(options?.inconsistentDecisions);
  const totalPrefixes = allPrefixes.length;

  const coverage = checkCoverage(T_audit, allPrefixes, O, observationallyEquivalent);
  const consistency = checkConsistency(T_audit, D, O, observationallyEquivalent);

  let coveredPrefixes = allPrefixes.filter(p =>
    T_audit.some(t => observationallyEquivalent(p, t, O))
  ).length;

  let coverageResult = coverage;
  if (options?.incompleteCoverage) {
    const partialAudit = T_audit.slice(0, 1);
    coverageResult = checkCoverage(partialAudit, allPrefixes, O, observationallyEquivalent);
    coveredPrefixes = allPrefixes.filter(p =>
      partialAudit.some(t => observationallyEquivalent(p, t, O))
    ).length;
  }

  return {
    coverage: options?.incompleteCoverage ? coverageResult : coverage,
    consistency: options?.inconsistentDecisions ? false : consistency,
    totalPrefixes,
    coveredPrefixes,
  };
}
