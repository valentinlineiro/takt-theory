import { ExperimentArtifact } from './ExperimentRecorder.js';

export class ArtifactReader {
  public static fromJson(jsonString: string): ArtifactReader {
    const parsed = JSON.parse(jsonString) as ExperimentArtifact;
    if (!parsed.schemaVersion || parsed.schemaVersion !== 1) {
      throw new Error(`Unsupported artifact schema version: ${parsed.schemaVersion}`);
    }
    return new ArtifactReader(parsed);
  }

  constructor(private artifact: ExperimentArtifact) {}

  public getArtifact(): ExperimentArtifact {
    return this.artifact;
  }

  public getSummary() {
    return this.artifact.summary;
  }

  public getEvents() {
    return this.artifact.events;
  }

  public getAverageMargin(): number {
    return this.artifact.summary.averageDecisionMargin;
  }

  public compareTo(other: ArtifactReader): {
    marginDelta: number;
    cycleDelta: number;
    outcomeMatch: boolean;
  } {
    const s1 = this.getSummary();
    const s2 = other.getSummary();

    return {
      marginDelta: s2.averageDecisionMargin - s1.averageDecisionMargin,
      cycleDelta: s2.totalCycles - s1.totalCycles,
      outcomeMatch:
        s1.passCount === s2.passCount &&
        s1.violationCount === s2.violationCount &&
        s1.degradedCount === s2.degradedCount
    };
  }
}
