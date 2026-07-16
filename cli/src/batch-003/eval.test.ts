import { describe, it, expect } from 'vitest';
import { executeBatch003 } from './eval.js';
import { runEvaluation } from './evaluate.js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

describe('Batch 003 Evaluation', () => {
  it('executes expected candidates and identifies mathematical optimums', () => {
    const results = executeBatch003();
    
    // Dependency Graph Cases
    expect(results['DEP-001'].optimalCandidates).toEqual(['T1']);
    expect(results['DEP-002'].optimalCandidates).toEqual(['T0']);
    expect(results['DEP-003'].optimalCandidates).toEqual(['T0']);
    expect(results['DEP-004'].optimalCandidates).toEqual(['T1']);
    expect(results['DEP-005'].optimalCandidates).toEqual(['T0']);

    // Workflow Cases
    expect(results['WRK-001'].optimalCandidates).toEqual(['T1']);
    expect(results['WRK-002'].optimalCandidates).toEqual(['T0']);
    expect(results['WRK-003'].optimalCandidates).toEqual(['T0']);
    expect(results['WRK-004'].optimalCandidates).toEqual(['T2']);
    expect(results['WRK-005'].optimalCandidates).toEqual(['T0']);

    // Resource Cases
    expect(results['RES-001'].optimalCandidates).toEqual(['T1']);
    expect(results['RES-002'].optimalCandidates).toEqual(['T0']);
    expect(results['RES-003'].optimalCandidates).toEqual(['T0']);
    expect(results['RES-004'].optimalCandidates).toEqual(['T2']);
    expect(results['RES-005'].optimalCandidates).toEqual(['T0']);
  });

  it('runs evaluation pipeline and writes analysis and results', () => {
    runEvaluation();
    
    const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
    const batchesDir = join(rootDir, 'experiments', 'computational-batches');
    const batchDir = join(batchesDir, 'batch-003');
    const resultsPath = join(batchDir, 'data', 'results.jsonl');
    const analysisPath = join(batchDir, 'batch-003.md');
    
    expect(existsSync(resultsPath)).toBe(true);
    expect(existsSync(analysisPath)).toBe(true);
    
    const resultsContent = readFileSync(resultsPath, 'utf8');
    expect(resultsContent).toContain('DEP-001');
    expect(resultsContent).toContain('WRK-001');
    expect(resultsContent).toContain('RES-001');
    
    const analysisContent = readFileSync(analysisPath, 'utf8');
    expect(analysisContent).toContain('Status:** Completed');
    expect(analysisContent).toContain('Optimal Intervention Accuracy');
  });
});
