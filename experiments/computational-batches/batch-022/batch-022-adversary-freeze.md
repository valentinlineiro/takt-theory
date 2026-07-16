# Batch-022 Adversary Search Freeze — Powerset Ablation Algorithm

## 1. Goal

This document locks in the powerset evaluation loop and Pareto frontier extraction algorithm to map the 32 candidate representations over the graph space.

---

## 2. Invariant Components Extraction

For each directed graph configuration $S \in \mathcal{S}_{022}$, extract the five component keys:
* `X0(S)`: $key_0(S)$ baseline from Batch-018.
* `X1(S)`: $X_{dist\_string}(S)$ multiset from Batch-018.
* `X2(S)`: $X_{path\_string}(S)$ multiset from Batch-019.
* `X3(S)`: $X_{activation\_string}(S)$ subgraphs signatures from Batch-020.
* `X4(S)`: $X_{reach\_string}(S)$ reachability signatures from Batch-021.

---

## 3. Powerset Evaluation Loop

For each of the $2^5 = 32$ subsets $J \subseteq \{0, 1, 2, 3, 4\}$:
1. Construct the combined key $R_J(S)$ by joining the active component strings:
   ```typescript
   const keyParts = [];
   if (J.includes(0)) keyParts.push(X0);
   if (J.includes(1)) keyParts.push(X1);
   if (J.includes(2)) keyParts.push(X2);
   if (J.includes(3)) keyParts.push(X3);
   if (J.includes(4)) keyParts.push(X4);
   const combinedKey = keyParts.length > 0 ? keyParts.join('|') : 'empty';
   ```
2. Classify all 38,760 configurations into equivalence bins based on `combinedKey`.
3. Compute $|R_J(\mathcal{S})|$ (total bins), $\max |fiber|$, $ConflictBins$, and the global regret bound $\varepsilon(R_J)$ using the $O(N)$ bin-regret optimizer.
4. Compute the average character length of `combinedKey` over all states.

---

## 4. Integrity Rule

The powerset evaluation loop, key concatenation order, and metrics calculations are strictly locked. No post-hoc changes are permitted.
