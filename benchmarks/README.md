# TAKT Experimental Benchmarking Program

**Status:** Active  
**Artifact Schema Version:** v1  
**Execution Baseline:** Certified Runtime Pipeline (`cli/src/runtime/`)  

---

## 1. Governance Policy & Engineering Constraint

All changes modifying the observable behavior or governance decision logic of the TAKT runtime **MUST** be accompanied by reproducible experimental evidence (a new benchmark or an update to an existing benchmark) using canonical `ExperimentArtifact` (schema v1) outputs analyzed via `ArtifactReader`.

---

## 2. Experimental Benchmark Registry

| Benchmark ID | Research Question | Independent Variable(s) | Scientific Phenomenon | Related Standard / Layer | Associated Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BENCHMARK-001** | How do conservative vs. aggressive governance threshold/drift settings impact decision margin and degradation rate? | `minimumMarginThreshold`<br>`maxDriftRate` | Decision Margin & Degradation | ST-016 | `ExperimentArtifact` (v1)<br>[`report.md`](BENCHMARK-001/report.md) | ✅ Complete & Verified |
| **BENCHMARK-002** | What is the observational overhead and decision latency scaling under increasing state vector dimensionality? | State vector size ($|S|$) | Observational Cost & Latency | TAKT Runtime Engine | `ExperimentArtifact` (v1)<br>[`report.md`](BENCHMARK-002/report.md) | ✅ Complete & Verified |
| **BENCHMARK-003** | How does temporal recalibration frequency affect long-term decision margin stability? | Recalibration horizon ($H$) | Temporal Drift & Recalibration | ST-016 / ST-017 | `ExperimentArtifact` (v1)<br>[`report.md`](BENCHMARK-003/report.md) | ✅ Complete & Verified |
| **BENCHMARK-004** | How do communication delays ($\tau_{\text{delay}}$) affect multi-node consensus safety and governance horizon guarantees? | Communication delay ($\tau_{\text{delay}}$) | Multi-Node Delay & Consensus | ST-018 Disparador #1 | `ExperimentArtifact` (v1)<br>[`report.md`](BENCHMARK-004/report.md) | ✅ Complete & Verified |
| **BENCHMARK-005** | How do multi-objective contracts interact under simultaneous drift, and do deadlocks emerge? | Contract count & priority | Multi-Contract Composition | ST-018 Disparador #2 | — | Planned |

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

---

## 4. Benchmark Pre-Registration Specification Template

Before introducing a new benchmark into the registry, the following 5-point scientific specification card **MUST** be defined in its `report.md`:

| Card Field | Description | Requirement |
| :--- | :--- | :--- |
| **Research Question** | Precise scientific question under test | Must state the specific hypothesis |
| **Null Hypothesis ($H_0$)** | Baseline assumption expected to be challenged/tested | Must be falsifiable via empirical metrics |
| **Independent Variable(s)** | Parameters manipulated across trial runs | Must be explicitly configured in `run.ts` |
| **Dependent Metrics** | Quantities extracted from `ExperimentArtifact` (v1) | Must be read via `ArtifactReader` |
| **Success Criterion** | Quantifiable, observable threshold in metrics | Must be objectively verifiable from deltas (e.g. $|\Delta| > 0.20$) |

---

## 5. Methodological Lifecycle States

Every benchmark entry progresses through four explicit lifecycle states:

```text
Draft  ──►  Pre-registered  ──►  Executed  ──►  Verified
```

1. **Draft**: Initial research question and hypothesis proposed.
2. **Pre-registered**: 5-point scientific specification card frozen in `report.md` prior to run.
3. **Executed**: Scenario execution completed, producing immutable `ExperimentArtifact` (v1) outputs.
4. **Verified**: Comparative analysis successfully extracted via `ArtifactReader` and checked for reproducibility.

