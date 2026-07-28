# TAKT ST-016 Scientific Claim Graph & Formal Non-Claims Boundaries

**Target Paper:** [`docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md`](2026-07-27-takt-st016-paper-draft.md)  
**Standard Baseline:** ST-016 v1.0.0 (`st016-v1.0.0` / `fca31f0`)  
**Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Positioning Audit:** [`docs/02-theoretical-positioning/2026-07-28-state-of-the-art-positioning.md`](../02-theoretical-positioning/2026-07-28-state-of-the-art-positioning.md)  

---

## Executive Summary

This document establishes the **Formal Scientific Claim Graph** for the TAKT ST-016 paper. Every primary claim $C_i$ asserted in the manuscript is mapped along an un-broken chain of evidence from theoretical formulation down to machine-certified Lean 4 theorems, empirical ablation witnesses, external dry runs, and the Zenodo DOI asset.

---

## 1. End-to-End Scientific Claim Graph

```text
[ Claim C1: Representation Sufficiency Condition ]
  └── Paper Location: Section 2 (Theoretical Foundations)
  └── Primary Citation: Blackwell (1951)
  └── Formal Proof: TaktFormal.StructuralSufficiency.lean
  └── Empirical Benchmark: Benchmarks Batch F-001..F-005
  └── DOI Asset: 10.5281/zenodo.21638014

[ Claim C2: Runtime Kernel Necessity & Irreducibility ]
  └── Paper Location: Section 3 (Runtime Necessity Model)
  └── Formal Proof Symbol: RuntimeSufficiency.minimal_implies_all_capabilities_necessary
  └── Lean 4 Location: takt-formal/TaktFormal/RuntimeSufficiency.lean:45 (0 sorrys)
  └── Empirical Witness: EXP-004 Component Ablation Suite (283/283 Vitest tests passing)
  └── Verification Asset: artifacts/verification/st016-v1.0/hashes.json

[ Claim C3: 3-Layer Empirical Witness Elevation ]
  └── Paper Location: Section 4 (Formal Verification)
  └── Formal Proof Symbol: RuntimeWitness.validWitness_implies_necessity
  └── Lean 4 Location: takt-formal/TaktFormal/RuntimeWitness.lean:25 (0 sorrys)
  └── Empirical Witness Files:
        ├─ contract.ablation.test.ts (C_contract witness)
        ├─ uncertainty.ablation.test.ts (C_uncertainty witness)
        └─ temporal.ablation.test.ts (C_temporal witness)
  └── Verification Asset: CONFORMANCE.md & artifacts/verification/st016-v1.0/

[ Claim C4: Zero-Contact Independent Reproducibility ]
  └── Paper Location: Section 6 (Reproducibility & Audit)
  └── Replication Suite: ./scripts/bootstrap.sh && ./scripts/verify.sh
  └── CI Matrix: .github/workflows/verify.yml (Ubuntu & macOS runners)
  └── External Audit Evidence: 6 Dry Runs (dry-run-report-v6.md: PASS WITH LIMITATION)
  └── Verification Asset: theory-manifest.yml (Schema 1.0)
```

---

## 2. Formal Non-Claims Boundaries (Scope Delineation)

To ensure unassailable peer-review integrity, the TAKT ST-016 paper explicitly declares the following **Non-Claims**:

1. **Non-Universal Necessity Claim:**  
   ST-016 does NOT claim that $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$ are universal requirements for all arbitrary software programs. Necessity is proven **specifically under the formal decision-preserving runtime model $M = (\mathcal{C}, \pi_M)$ and discrete decision domain $\mathcal{D}$**.

2. **Non-Static Analysis Replacement Claim:**  
   ST-016 does NOT claim to replace static type systems, Galois abstract interpretation domains, or static model checkers. TAKT governs **runtime execution decisions under dynamic state representation contraction**.

3. **Non-Cross-Implementation Transportability Claim (ST-017 Boundary):**  
   ST-016 proves capability necessity specifically on the reference implementation architecture. Transporting certified witness artifacts across heterogeneous runtimes ($M_1 \sim M_2$) is explicitly out of scope for ST-016 and is reserved for **ST-017**.

4. **Non-Algorithmic Solver Claim:**  
   ST-016 formalizes the necessity of dynamic margin estimation ($M_D \approx 0$), contract verification, and trajectory monitoring. It does NOT claim optimal solver computational complexity for specific margin algorithms.

---

## 3. Primary Bibliographic Audit Matrix

| Citational Anchor | Primary Reference | Domain | Exact Relation to TAKT ST-016 |
| :--- | :--- | :--- | :--- |
| **Sufficiency Foundations** | Blackwell, D. (1951) | Decision Theory | Basis for ST-015 state abstraction sufficiency |
| **Abstract Semantics** | Cousot, P. & Cousot, R. (1977) | Abstract Interpretation | Contrast: TAKT uses decision equivalence rather than total property over-approximation |
| **Refinement & Bisimulation** | Milner, R. (1989) / Park, D. (1981) | Concurrency / Verification | Contrast: TAKT allows state contraction while monitoring temporal prefix consistency |
| **Runtime Verification** | Leucker, M. & Schallhart, C. (2009) | Runtime Verification | Contrast: TAKT elevates trace witnesses directly to Lean 4 capability necessity proofs |
| **Partial Observability** | Kaelbling, L. P. et al. (1998) | POMDP / AI Control | Contrast: TAKT formalizes governance kernel necessity rather than belief updates |
