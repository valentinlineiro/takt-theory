# Independent Scientific Replication Report: TAKT v1.1 (replication-package-v1)

**Evaluador:** Gemini 3.6 Flash  
**Fecha:** 24 de Julio de 2026  
**Identificador de Evaluación:** T-AI-002  
**Nivel de Independencia:** Nivel 3 (AI Agent Autonomous Execution)  
**Clasificación Registrada Inicialmente:** Protocol Failure  
**Matriz de Verificación y Cadena Causal:** [verification_matrix.md](file:///home/valentin/code/takt-theory/docs/replication/ai/T-AI-002/verification_matrix.md)  

> **Declaración Metodológica de Alcance:**  
> *Gemini 3.6 Flash formuló observaciones que, tras verificación independiente contra el código fuente, llevaron a identificar y corregir varios defectos del paquete de replicación. Esta ejecución demuestra la utilidad del proceso observacional para el saneamiento de empaquetado, pero no constituye evidencia suficiente de transportabilidad social ni de validez teórica.*


---

## 1. Repository Understanding

• **Scientific Objective:** Formalizing and evaluating TAKT (Theory of Adequate Knowledge for Decisions), an axiomatic theory of decision-preserving representational contraction. The framework establishes mathematical and empirical conditions under which high-dimensional system state spaces can be compressed or abstracted into lower-dimensional representation spaces without incurring decision regret relative to full-information optimal decisions.  
• **Theoretical Contribution:** Defines core operational metrics ($K_D$ knowledge contraction kernel, $M_D$ dynamic margin, $\theta_{crit}$ critical drift threshold, EVSI value of information), trajectory-based dynamic contracts, and formal proofs in Lean 4 (`takt-formal`) verifying safety equivalence, factorization, and resistance to red-team theoretical attacks (RT-001 to RT-004).  
• **Replication Objective:** Execute the standalone replication protocol documented in `README.md` without author assistance, oral knowledge, or code modifications, and independently verify:
  1. Automated execution of canonical commands.
  2. Cryptographic SHA-256 dataset hash verification against `expected-hashes.txt`.
  3. Empirical metric alignment ($R_{sci} = \text{PASS}$, zero decision regret, expected latency/net value) against `expected-results.md`.
  4. Lean 4 formal proof compilation clean build.

---

## 2. Replication Timeline

| Step | Action Performed | Command / Tool | Outcome | Blocking Point / Friction |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Environment Audit | `node -v && npm --version` | Node v24.14.1, npm 11.11.0. Prerequisites satisfied. | None. |
| 2 | Dependency Installation | `npm ci` | Successfully installed 81 packages in 1 second. | None. |
| 3 | Benchmark Suite Execution | `npx tsx benchmarks/cli.ts all --seed 42 --outDir replication-package-v1/output` | Executed 7 experiments. Generated 7 output JSON files. | None. CLI executed to completion. |
| 4 | Cryptographic Hash Verification | `npx tsx replication-package-v1/verification/validation-script.ts` | FAILED with exit code 1. All 3 verified files reported ❌ [HASH MISMATCH]. | BLOCKING POINT 1: Script exited with code 1. Automated verification failed. |
| 5 | Forensic Audit of Hash Failure | Inspected `validation-script.ts`, `expected-hashes.txt`, and `DatasetWriter.ts`. | Discovered `DatasetWriter.ts` hashes `gitCommit` into `manifest.datasetHash`. Current commit differs from expected commit `1bdd5a1`. | Friction: `troubleshooting.md` incorrectly attributes failure to timestamp/formatting variance. |
| 6 | Empirical Output Data Audit | Inspected generated output JSON files in `replication-package-v1/output/`. | EXP-001 & EXP-003: `totalDecisionRegret = 0`. Meta-Audit: `netValueEnrichment` evaluated to `null`. | BLOCKING POINT 2: Data corruption (`null` metrics) in meta-audit due to code typos (`evsiScore` vs `evsiPriority`, `epsilonTotal` vs `totalError`). |
| 7 | Vitest Evaluation Suite Audit | `npx vitest run` | 73 test files passed (280 total tests passed) in 10.55s. | Friction: Root `README.md` claims "131 tests across 51 files" (documentation drift). |
| 8 | Lean 4 Formal Verification | `lake build` in `takt-formal/` | Successfully built 226 Lean 4 jobs with 0 errors and 0 sorrys. | None. Formal proofs fully verified. |

---

## 3. Obstacles Encountered

1. **Automated Cryptographic Hash Verification Failure (`validation-script.ts`):**
   * *Observed Fact:* Running `validation-script.ts` resulted in exit code 1 with three ❌ [HASH MISMATCH] failures.
   * *Evidence:* `DatasetWriter.ts` included `dataset.provenance.gitCommit` inside `contentToHash`.
   * *Impact:* Any execution on any commit other than commit `1bdd5a1` failed automated hash verification.
2. **Corrupted null Data Output in Meta-Audit (`EXP-001-boundary-meta-audit-seed-42.json`):**
   * *Observed Fact:* Generated file contained `"netValueEnrichment": null` across all test runners.
   * *Evidence:* Property typos in `exp-001-meta-audit.ts` (`evsiScore` instead of `evsiPriority`, `epsilonTotal` instead of `totalError`).
3. **Inaccurate Guidance in Troubleshooting Documentation:**
   * `troubleshooting.md` stated hash mismatches stem from timestamp/formatting variance, while `timestamp` was excluded and `gitCommit` was included.
4. **Documentation Drift Across Test Suite Metadata:**
   * Root `README.md` asserted "131 tests across 51 files", while execution ran 280 tests across 73 files.

---

## 4. Final Classification

**Classification:** Protocol Failure (en corrida inicial previa a saneamiento)  
*Nota posterior:* Los hallazgos forenses de Gemini 3.6 Flash permitieron corregir la fuga de `gitCommit` en `DatasetWriter.ts` y los typos en `exp-001-meta-audit.ts`, alcanzando ejecución $100\%$ limpia y `validation-script.ts = PASS` en la versión corregida.
