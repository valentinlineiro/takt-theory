import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ArtifactReader } from '../audit/ArtifactReader.js';

describe('Backward Compatibility Test for ExperimentArtifact Schema v1', () => {
  it('successfully loads and parses golden-artifact-v1.json fixture without regression', () => {
    const fixturePath = path.resolve(__dirname, 'fixtures/golden-artifact-v1.json');
    const jsonString = fs.readFileSync(fixturePath, 'utf-8');

    const reader = ArtifactReader.fromJson(jsonString);
    const artifact = reader.getArtifact();

    expect(artifact.schemaVersion).toBe(1);
    expect(artifact.metadata.experimentId).toBe('golden-exp-v1');

    const summary = reader.getSummary();
    expect(summary.totalCycles).toBe(2);
    expect(summary.passCount).toBe(1);
    expect(summary.degradedCount).toBe(1);
    expect(summary.averageDecisionMargin).toBeCloseTo(0.15);

    const events = reader.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe('GovernanceCycleCompleted');
  });
});
