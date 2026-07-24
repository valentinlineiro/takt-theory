export interface LeanTraceabilityMetadata {
  readonly stableContractId: string;   // Ej: "GOV-HORIZON-001"
  readonly contractVersion: string;    // Ej: "1.0.0"
  readonly theoremId: string;          // Ej: "Theorem IV.4"
  readonly leanFile: string;           // Ej: "TaktFormal/DynamicSafetyContract.lean"
  readonly monographSection: string;   // Ej: "Volume IV, Section 4.2"
}

export class LeanTraceabilityBridge {
  private static registry = new Map<string, LeanTraceabilityMetadata>();

  public static register(metadata: LeanTraceabilityMetadata): void {
    this.registry.set(metadata.stableContractId, metadata);
  }

  public static resolve(stableContractId: string): LeanTraceabilityMetadata {
    const meta = this.registry.get(stableContractId);
    if (!meta) {
      throw new Error(`Unregistered Lean 4 traceability contract ID: ${stableContractId}`);
    }
    return meta;
  }

  public static clear(): void {
    this.registry.clear();
  }
}
