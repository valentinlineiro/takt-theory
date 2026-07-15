# Batch-024 Results — Admissibility and Computational Minimality

## 1. Executive Summary

This batch evaluated partition coarsening by defining an aggregate reachability count invariant $X_{coarse\_reach}$ to analyze if node-specific coordinates are redundant under exact safety.

## 2. Representation Profiles

| Representation | Total Bins | Max Bin Size | Conflict Bins | Epsilon Regret ε(R) |
|----------------|------------|--------------|---------------|----------------------|
| R_minimal (Paths + Reach) | 412 | 7649 | 0 | 0.00 |
| R_coarse (Paths + Coarsened Reach) | 313 | 9802 | 30 | 1.18 |

## 3. Outcome Classification

### [Scenario C — Node-Specific Resolution Required]
Aggregate counts are not sufficient: regret $\varepsilon(R_{coarse}) = 1.18 > 0.00$. Node-by-node mapping is required.