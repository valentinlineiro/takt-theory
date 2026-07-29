# BENCHMARK-001: Conservative vs Aggressive Governance Policy

## 1. Executive Summary
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
