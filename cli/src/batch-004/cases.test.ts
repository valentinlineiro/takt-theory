import { describe, it, expect } from 'vitest';
import { loadBatch004Cases, solveCaseOracle } from './cases.js';
import { extractObservableSubgraph, computeProxyUncertainty } from './estimator.js';
import { globalToObservableSubgraph } from './baselines.js';

describe('Batch 004 Case Matrix and Oracle Solvers', () => {
  it('loads exactly 15 cases and verifies their system types', () => {
    const cases = loadBatch004Cases();
    expect(cases.length).toBe(15);

    const deps = cases.filter((c) => c.systemType === 'dependency');
    const wrks = cases.filter((c) => c.systemType === 'workflow');
    const ress = cases.filter((c) => c.systemType === 'resource');

    expect(deps.length).toBe(5);
    expect(wrks.length).toBe(5);
    expect(ress.length).toBe(5);
  });

  it('classifies cases into correct selective escalation categories', () => {
    const cases = loadBatch004Cases();
    let h1Sufficient = 0;
    let expansionResolvable = 0;
    let externalRequired = 0;

    for (const c of cases) {
      const O_1 = extractObservableSubgraph(c.globalGraph, c.focalNode, 1);
      const I_1 = computeProxyUncertainty(O_1, c.focalNode);

      if (I_1 === 0) {
        h1Sufficient++;
      } else {
        const O_2 = extractObservableSubgraph(c.globalGraph, c.focalNode, 2);
        const I_2 = computeProxyUncertainty(O_2, c.focalNode);

        if (I_2 === 0) {
          expansionResolvable++;
        } else {
          externalRequired++;
        }
      }
    }

    expect(h1Sufficient).toBe(8);
    expect(expansionResolvable).toBe(4);
    expect(externalRequired).toBe(3);
  });

  it('verifies that oracle solvers match case utility functions on the global graph', () => {
    const cases = loadBatch004Cases();

    for (const c of cases) {
      const globalSubgraph = globalToObservableSubgraph(c.globalGraph);

      for (const intervention of c.candidateInterventions) {
        const oracleRes = solveCaseOracle(c, intervention);
        const expectedUtility = c.evaluateUtility(globalSubgraph, intervention);

        expect(oracleRes.utility).toBeCloseTo(expectedUtility, 5);
        expect(oracleRes.utility).toBeCloseTo(oracleRes.g - oracleRes.e - oracleRes.risk, 5);
      }
    }
  });

  it('verifies correct optimal interventions for all 15 cases', () => {
    const cases = loadBatch004Cases();

    const expectedOptimal: Record<string, string> = {
      'DEP-001': 'T1', // Accidental redundant bypass removed
      'DEP-002': 'T0', // Keep necessary choke-point
      'DEP-003': 'T0', // Keep stabilizing isolation layer
      'DEP-004': 'T1', // Remove redundant edge over removing isolation
      'DEP-005': 'T0', // Keep stabilizing redundancy
      'WRK-001': 'T1', // Remove duplicate task
      'WRK-002': 'T0', // Keep necessary validation
      'WRK-003': 'T0', // Keep stabilizing checkpoint
      'WRK-004': 'T2', // Place late checkpoint (optimal)
      'WRK-005': 'T0', // Keep stabilizing checkpoint
      'RES-001': 'T1', // Remove redundant lock
      'RES-002': 'T0', // Keep necessary mutex lock
      'RES-003': 'T0', // Keep stabilizing rate limiter
      'RES-004': 'T2', // Duplicate resource capacity (optimal over rate limiter)
      'RES-005': 'T0', // Keep rate limiter (prevents crash)
    };

    for (const c of cases) {
      const globalSubgraph = globalToObservableSubgraph(c.globalGraph);
      let bestIntervention = c.candidateInterventions[0];
      let maxUtility = c.evaluateUtility(globalSubgraph, bestIntervention);

      for (let i = 1; i < c.candidateInterventions.length; i++) {
        const candidate = c.candidateInterventions[i];
        const utility = c.evaluateUtility(globalSubgraph, candidate);
        if (utility > maxUtility) {
          maxUtility = utility;
          bestIntervention = candidate;
        }
      }

      expect(bestIntervention).toBe(expectedOptimal[c.id]);
    }
  });
});
