# Batch-022 Results — Minimal Sufficient Contraction

## 1. Executive Summary

This batch evaluated the complete powerset of $2^5 = 32$ invariant component combinations across the 38,760 graphs to identify the minimal sufficient representations ($\varepsilon = 0.00$) and map the Pareto-optimal frontier.

## 2. Full Ablation Powerset Profile

| Invariants Indices | Representation Name | Total Bins | Max Bin Size | Conflict Bins | Regret ε(R) | Avg Key Length |
|--------------------|---------------------|------------|--------------|---------------|-------------|----------------|
| [] | Empty | 1 | 30752 | 1 | 15.58 | 5.0 |
| [0] | X0 (Omega) | 50 | 4808 | 26 | 15.58 | 151.9 |
| [1] | X1 (Landmarks) | 2857 | 462 | 200 | 15.58 | 215.0 |
| [0,1] | X0 (Omega) + X1 (Landmarks) | 10743 | 72 | 132 | 15.58 | 367.9 |
| [2] | X2 (Paths) | 252 | 9982 | 51 | 15.58 | 89.0 |
| [0,2] | X0 (Omega) + X2 (Paths) | 1161 | 1668 | 201 | 15.58 | 241.9 |
| [1,2] | X1 (Landmarks) + X2 (Paths) | 3154 | 462 | 186 | 15.58 | 305.1 |
| [0,1,2] | X0 (Omega) + X1 (Landmarks) + X2 (Paths) | 10902 | 72 | 122 | 15.58 | 457.9 |
| [3] | X3 (Activation) | 49 | 5484 | 9 | 15.58 | 361.5 |
| [0,3] | X0 (Omega) + X3 (Activation) | 379 | 1319 | 71 | 15.58 | 514.3 |
| [1,3] | X1 (Landmarks) + X3 (Activation) | 5611 | 329 | 37 | 13.58 | 577.5 |
| [0,1,3] | X0 (Omega) + X1 (Landmarks) + X3 (Activation) | 13221 | 71 | 24 | 13.58 | 730.4 |
| [2,3] | X2 (Paths) + X3 (Activation) | 641 | 2424 | 12 | 13.58 | 451.5 |
| [0,2,3] | X0 (Omega) + X2 (Paths) + X3 (Activation) | 2249 | 631 | 30 | 13.58 | 604.4 |
| [1,2,3] | X1 (Landmarks) + X2 (Paths) + X3 (Activation) | 5859 | 329 | 32 | 13.58 | 667.5 |
| [0,1,2,3] | X0 (Omega) + X1 (Landmarks) + X2 (Paths) + X3 (Activation) | 13339 | 71 | 23 | 13.58 | 820.4 |
| [4] | X4 (Reach) | 10 | 17505 | 3 | 10.82 | 66.9 |
| [0,4] | X0 (Omega) + X4 (Reach) | 164 | 3386 | 43 | 10.82 | 219.8 |
| [1,4] | X1 (Landmarks) + X4 (Reach) | 3963 | 417 | 0 | 0.00 | 282.9 |
| [0,1,4] | X0 (Omega) + X1 (Landmarks) + X4 (Reach) | 11344 | 72 | 0 | 0.00 | 435.8 |
| [2,4] | X2 (Paths) + X4 (Reach) | 412 | 7649 | 0 | 0.00 | 156.9 |
| [0,2,4] | X0 (Omega) + X2 (Paths) + X4 (Reach) | 1608 | 1320 | 0 | 0.00 | 309.8 |
| [1,2,4] | X1 (Landmarks) + X2 (Paths) + X4 (Reach) | 4202 | 417 | 0 | 0.00 | 372.9 |
| [0,1,2,4] | X0 (Omega) + X1 (Landmarks) + X2 (Paths) + X4 (Reach) | 11461 | 72 | 0 | 0.00 | 525.8 |
| [3,4] | X3 (Activation) + X4 (Reach) | 61 | 5202 | 8 | 10.82 | 429.3 |
| [0,3,4] | X0 (Omega) + X3 (Activation) + X4 (Reach) | 469 | 1285 | 61 | 10.82 | 582.2 |
| [1,3,4] | X1 (Landmarks) + X3 (Activation) + X4 (Reach) | 5746 | 329 | 0 | 0.00 | 645.4 |
| [0,1,3,4] | X0 (Omega) + X1 (Landmarks) + X3 (Activation) + X4 (Reach) | 13331 | 71 | 0 | 0.00 | 798.3 |
| [2,3,4] | X2 (Paths) + X3 (Activation) + X4 (Reach) | 674 | 2424 | 0 | 0.00 | 519.3 |
| [0,2,3,4] | X0 (Omega) + X2 (Paths) + X3 (Activation) + X4 (Reach) | 2375 | 631 | 0 | 0.00 | 672.2 |
| [1,2,3,4] | X1 (Landmarks) + X2 (Paths) + X3 (Activation) + X4 (Reach) | 5976 | 329 | 0 | 0.00 | 735.4 |
| [0,1,2,3,4] | X0 (Omega) + X1 (Landmarks) + X2 (Paths) + X3 (Activation) + X4 (Reach) | 13442 | 71 | 0 | 0.00 | 888.3 |

## 3. Pareto-Optimal Frontier ($P_0$ under $\varepsilon = 0.00$)

| Indices | Representation Name | Total Bins | Max Bin Size | Avg Key Length |
|---------|---------------------|------------|--------------|----------------|
| [2,4] | X2 (Paths) + X4 (Reach) | 412 | 7649 | 156.9 |

## 4. Outcome Classification

### [Scenario A — Minimal Sufficiency Frontier Mapped]
The powerset ablation confirms that structural baseline $X_0$ (Omega), landmark distance coordinates $X_1$ (Landmarks), and activation counts $X_3$ (Activation) are **completely redundant** under exact safety. The minimal representation $R_{minimal} = X_2 \oplus X_4$ (Paths + Reach) achieves global sufficiency ($\varepsilon = 0.00$) with maximal compression (412 bins).