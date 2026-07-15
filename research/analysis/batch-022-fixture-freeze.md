# Batch-022 Fixture Freeze — Complexity Metrics and Powerset

## 1. Goal

This document locks in the experimental domain ($\mathcal{S}_{022}$), utility parameters, and complexity metrics evaluated across the complete powerset of 32 representations.

---

## 2. Experimental Domain and Utility

We reuse the parameters of Batch-021:
* **Domain Space ($\mathcal{S}_{022}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Observation Horizon**: $k = 2$.
* **Utility $U$**: Case `DEP-005` parameters (path limit 3, default fallback $-14.58$).

---

## 3. Representation Powerset Definitions

We evaluate all 32 combinations $R_J = \bigoplus_{j \in J} X_j$ formed by the powerset of the five candidate component strings:
1. **$X_0 = \Omega$** (Baseline structural snapshot).
2. **$X_1 = X_{dist}$** (Landmark-relative node coordinate multisets).
3. **$X_2 = X_{path}$** (Directed path sequences).
4. **$X_3 = X_{activation}$** (Observed active node/edge counts).
5. **$X_4 = X_{reach}$** (Action-conditioned causal reachability).

For any subset $J \subseteq \{0, 1, 2, 3, 4\}$, the serialized representation key $R_J(S)$ is constructed by joining the serialized strings of the active components in $J$ with `"|"`. If $J$ is empty, $R_J(S)$ is the constant string `"empty"`.

---

## 4. Complexity and Safety Metrics

For each representation $R_J$, the execution loop computes:

1. **Total Bins**: Count of unique keys $|R_J(\mathcal{S})|$ (higher is less compressed).
2. **Max Bin Size**: Max size of any equivalence class in the partition.
3. **Conflict Bins**: Count of bins with internal decision disagreements (T0 and T1).
4. **Epsilon Regret**: The global regret bound $\varepsilon(R_J)$.
5. **Encoding Complexity**: The average length of the representation key $R_J(S)$ in characters.
