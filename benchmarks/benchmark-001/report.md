# BENCHMARK-001: Conservative vs Aggressive Governance Policy

**Benchmark:** BENCHMARK-001  
**Artifact Schema:** v1  
**Generated From:** `ExperimentArtifact` (schema v1) via `ArtifactReader`  
**Execution Method:** Deterministic multi-policy step evaluation  

---

## 1. Scientific Pre-Registration Card

| Field | Content |
| :--- | :--- |
| **Research Question** | How do conservative vs. aggressive governance threshold/drift settings impact decision margin and degradation rate? |
| **Null Hypothesis ($H_0$)** | Relaxing margin thresholds and increasing drift tolerances does not alter decision margin degradation or safety verdicts. |
| **Independent Variable(s)** | `minimumMarginThreshold` ($0.60$ vs $0.30$), `maxDriftRate` ($0.02$ vs $0.08$) |
| **Dependent Metrics** | Average Decision Margin ($Delta$), Pass/Degraded/Violation counts, Total Elapsed Time |
| **Success Criterion** | Detectable negative delta ($Delta < 0$) in average decision margin and explicit degradation state capture. |

---

## 2. Executive Summary
Comparative evaluation of two governance policies over an identical 5-step scenario sequence.

* **Policy A (Conservative)**: `minimumMarginThreshold` = 0.60, `maxDriftRate` = 0.02
* **Policy B (Aggressive)**: `minimumMarginThreshold` = 0.30, `maxDriftRate` = 0.08

---

## 2. Canonical Metrics Comparison

| Metric | Policy A (Conservative) | Policy B (Aggressive) | Delta (B vs A) |
| :--- | :--- | :--- | :--- |
| **Total Cycles** | 5 | 5 | 0 |
| **Pass Count** | 5 | 4 | -1 |
| **Degraded Count** | 0 | 1 | 1 |
| **Violation Count** | 0 | 0 | 0 |
| **Avg Decision Margin** | 0.5400 | 0.0840 | -0.4560 |
| **Total Elapsed Time** | 5 ms | 5 ms | 0 ms |

---

## 3. Scientific Findings
1. **Decision Margin**: Policy A maintains a significantly higher safety margin (0.5400 vs 0.0840).
2. **Reproducibility**: Derived 100% from immutable `ExperimentArtifact` (schema v1) outputs without runtime memory access.
