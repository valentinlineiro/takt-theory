# CARD-465: EXP-004 Component Ablation Runtime Implementation

**Status:** Ready for Implementation  
**Prerequisite:** ST-016 Design Spec ([docs/superpowers/specs/2026-07-27-st016-runtime-kernel-necessity-design.md](docs/superpowers/specs/2026-07-27-st016-runtime-kernel-necessity-design.md)), Lean 4 Proofs ([takt-formal/TaktFormal/RuntimeSufficiency.lean](takt-formal/TaktFormal/RuntimeSufficiency.lean)).

---

## 1. Context & Goal

CARD-464 established the Lean 4 formalization of `RuntimeSufficiency.lean`, defining `NecessaryCapability`, `Sufficient`, `Irreducible`, and `MinimalRuntime`.

This CARD defines the **runtime ablation experiment EXP-004** to be executed by the TAKT runtime agent. It creates isolated tests in TypeScript (`cli/src/runtime/__tests__/ablation/`) to search for empirical witness trajectories $R_{\text{witness}}^{(i)}$ for each theoretical capability ($C_{\text{temporal}}$, $C_{\text{uncertainty}}$, $C_{\text{contract}}$) and exports structured witness artifacts consumable by Lean 4 (`CARD-466`).

---

## 2. Technical Scope

### 2.1 Witness Artifact Interface (`cli/src/runtime/__tests__/ablation/witnesses.ts`)

- **Interfaces & Types:**
  ```typescript
  export interface WitnessInvariantCheck {
    preservedState: boolean;       // e.g., state(R1) === state(R2)
    violatedAssumption?: string;   // e.g., "Contract(R) === false" or "MD(R) ~ 0"
  }

  export interface WitnessArtifact {
    capability: "ContractSoundness" | "UncertaintyBound" | "TemporalConsistency";
    representation: unknown;
    fullDecision: string;
    reducedDecision: string;
    invariantChecks: WitnessInvariantCheck;
    isWitness: boolean;
  }
  ```

### 2.2 Ablation Test Suite (`cli/src/runtime/__tests__/ablation/`)

1. **Temporal Witness (`temporal.ablation.test.ts`):**
   - Constructs two trajectories $\tau_1 = (r_0, r_1, r_2)$ and $\tau_2 = (r'_0, r'_1, r_2)$ sharing identical terminal state $r_2$.
   - Verifies $\pi_{\text{full}}(\tau_1) = \text{INTERVENE}$ while $\pi_{\text{reduced}}(\tau_1) = \text{MONITOR}$.
   - Exports valid `WitnessArtifact` with `preservedState: true`.

2. **Uncertainty Witness (`uncertainty.ablation.test.ts`):**
   - Identifies representation $R$ with critical margin $M_D(R) \approx 0$.
   - Verifies $\pi_{\text{full}}(R) = \text{REFINE}$ while $\pi_{\text{reduced}}(R) = \text{EXECUTE}$.
   - Exports valid `WitnessArtifact` with `violatedAssumption: "MD(R) ~ 0"`.

3. **Contract Witness (`contract.ablation.test.ts`):**
   - Identifies representation $R$ violating domain safety contracts ($\text{Contract}(R) = \text{false}$) despite clean margin and trajectory.
   - Verifies $\pi_{\text{full}}(R) = \text{STOP}$ while $\pi_{\text{reduced}}(R) = \text{EXECUTE}$.
   - Exports valid `WitnessArtifact` with `violatedAssumption: "Contract(R) === false"`.

---

## 3. Definition of Done

1. `cli/src/runtime/__tests__/ablation/witnesses.ts` created and exported.
2. Ablation test suite (`temporal.ablation.test.ts`, `uncertainty.ablation.test.ts`, `contract.ablation.test.ts`) passing via `npx vitest run cli/src/runtime/__tests__/ablation/`.
3. Each test generates a validated `WitnessArtifact` with `isWitness: true`.
4. Full Vitest test suite passes cleanly (`npx vitest run`).
