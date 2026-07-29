# TAKT Experimental Benchmarking Program

**Status:** Active  
**Artifact Schema Version:** v1  
**Execution Baseline:** Certified Runtime Pipeline (`cli/src/runtime/`)  

---

## 1. Governance Policy & Engineering Constraint

All changes modifying the observable behavior or governance decision logic of the TAKT runtime **MUST** be accompanied by reproducible experimental evidence (a new benchmark or an update to an existing benchmark) using canonical `ExperimentArtifact` (schema v1) outputs analyzed via `ArtifactReader`.

---

## 2. Experimental Benchmark Registry

| Benchmark ID | Research Question | Independent Variable(s) | Controlled Variables | Primary Artifacts | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BENCHMARK-001** | How do conservative vs. aggressive governance threshold/drift settings impact decision margin and degradation rate? | `minimumMarginThreshold`<br>`maxDriftRate` | 5-step scenario sequence, contract schema | [`scenarios.json`](scenarios.json)<br>[`artifact-policy-a.json`](artifact-policy-a.json)<br>[`artifact-policy-b.json`](artifact-policy-b.json)<br>[`report.md`](report.md) | ✅ Complete & Verified |
| **BENCHMARK-002** | What is the observational overhead and decision latency scaling under increasing state vector dimensionality? | State vector size ($|S|$) | Policy parameters, step horizon | Planned | Planned |
| **BENCHMARK-003** | How does temporal recalibration frequency affect long-term decision margin stability? | Recalibration horizon ($H$) | Drift rate, state distribution | Planned | Planned |

---

## 3. Standard Benchmark Structure

Every benchmark in `benchmarks/` must follow this structure:

```text
benchmarks/BENCHMARK-00X/
├── scenarios.json          # Controlled input scenario sequence
├── run.ts                  # Deterministic runner script
├── artifact-policy-a.json  # Immutable ExperimentArtifact (schema v1)
├── artifact-policy-b.json  # Immutable ExperimentArtifact (schema v1)
└── report.md               # Generated Markdown report with scientific provenance header
```
