# TAKT ST-016 Threats to Validity Analysis

**Target Paper:** [`docs/04-academic-paper/2026-07-27-takt-st016-paper-draft.md`](2026-07-27-takt-st016-paper-draft.md)  
**Standard Baseline:** ST-016 v1.0.0 (`st016-v1.0.0` / `fca31f0`)  
**Zenodo DOI:** [`10.5281/zenodo.21638014`](https://doi.org/10.5281/zenodo.21638014)  
**Claim Graph:** [`docs/04-academic-paper/2026-07-28-scientific-claim-graph.md`](2026-07-28-scientific-claim-graph.md)  

---

## Executive Summary

Following standard software engineering and formal methods evaluation practices, this document explicitly details the **Threats to Validity** associated with **TAKT ST-016 (Runtime Kernel Necessity & Certification)** across four canonical dimensions: Construct, Internal, External, and Reproducibility Validity.

---

## 1. Construct Validity

*Construct validity addresses whether the operational measures and formal definitions accurately reflect the underlying theoretical concepts.*

- **Decision-Preserving Abstraction Model:**  
  *Threat:* Does the discrete policy decision domain $\mathcal{D} = \{\text{EXECUTE}, \text{REFINE}, \text{STOP}, \text{INTERVENE}\}$ adequately capture real-world runtime decision spaces?  
  *Mitigation:* The decision domain covers the fundamental governance actions required in autonomous decision loops. Complex continuous control policies can be projected onto discrete governance actions via dynamic margin functions ($M_D$).
- **Formal Definition of Capability Removal:**  
  *Threat:* Does the set-difference operation `removeCapability M C` in Lean 4 accurately represent runtime component removal in software execution?  
  *Mitigation:* In Lean 4, capability removal is formalized via set difference $\mathcal{C} \setminus \{C\}$. In TypeScript, ablation is implemented by bypassing component evaluations (`ContractEvaluator`, `RobustMarginEstimator`, `TrajectoryMonitor`), creating an exact match between mathematical logic and execution mechanics.

---

## 2. Internal Validity

*Internal validity addresses whether internal experimental design or proof structures introduce uncontrolled confounding factors.*

- **Proof Correctness in Formal Verification:**  
  *Threat:* Could formal proofs contain hidden assumptions or incomplete logic (`sorry`)?  
  *Mitigation:* All Lean 4 proof modules (`RuntimeSufficiency.lean`, `RuntimeWitness.lean`) are verified by the Lean 4 proof checker (`lake build`), executing 230 build jobs with **0 errors and 0 `sorry`s**.
- **Ablation Confounding in EXP-004:**  
  *Threat:* Could test witness failures in EXP-004 be caused by side-effects or test suite bugs rather than component ablation?  
  *Mitigation:* Ablation tests are isolated in dedicated test files (`contract`, `uncertainty`, `temporal`), verifying state invariance before checking policy divergence.

---

## 3. External Validity

*External validity addresses the extent to which the theoretical results can be generalized beyond the specific evaluation environment.*

- **Reference Architecture Scope:**  
  *Threat:* Do proofs on the TypeScript reference runtime apply to other programming languages or distributed runtimes?  
  *Mitigation:* ST-016 proves necessity on the formal mathematical model and reference architecture. Cross-implementation transportability ($M_1 \sim M_2$) across heterogeneous runtimes (Rust, Python) is explicitly delineated as the primary boundary for **ST-017**.
- **Domain-Specific Contract Topologies:**  
  *Threat:* Does kernel necessity hold when domain safety contracts are vacuous or trivially satisfied?  
  *Mitigation:* Kernel necessity is proven under non-trivial contract topologies where at least one state violates domain safety.

---

## 4. Reproducibility Validity

*Reproducibility validity addresses environment dependencies and execution reproducibility across external infrastructure.*

- **Lean Toolchain Network Dependency:**  
  *Threat:* Automated zero-contact execution requires downloading Lean 4 binaries (`leanprover/lean4:v4.32.0`). In environments with strict outbound HTTP proxy policies blocking `release.lean-lang.org`, automatic `elan` provisioning fails.  
  *Mitigation:* The environment dependency is fully documented in `dry-run-report-v6.md` (`PASS WITH ENVIRONMENTAL LIMITATION`). Pre-installed Lean 4 toolchains or GitHub Actions CI runners execute the pipeline with 100% success.
- **Hash Integrity & Version Lock:**  
  *Threat:* Dependencies or script drift could cause hash verification mismatches.  
  *Mitigation:* All core files are tracked by SHA-256 digests in [`artifacts/verification/st016-v1.0/hashes.json`](../../artifacts/verification/st016-v1.0/hashes.json) and locked in `package-lock.json`.
