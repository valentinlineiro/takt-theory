export interface WitnessInvariantCheck {
  preservedState: boolean;
  violatedAssumption?: string;
}

export interface WitnessArtifact {
  capability: "ContractSoundness" | "UncertaintyBound" | "TemporalConsistency";
  representation: unknown;
  fullDecision: string;
  reducedDecision: string;
  invariantChecks: WitnessInvariantCheck;
  isWitness: boolean;
}

export function createWitnessArtifact(
  capability: WitnessArtifact["capability"],
  representation: unknown,
  fullDecision: string,
  reducedDecision: string,
  invariantChecks: WitnessInvariantCheck
): WitnessArtifact {
  const isWitness = fullDecision !== reducedDecision && invariantChecks.preservedState;
  return {
    capability,
    representation,
    fullDecision,
    reducedDecision,
    invariantChecks,
    isWitness,
  };
}
