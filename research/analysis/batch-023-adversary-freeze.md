# Batch-023 Adversary Search Freeze — Quotient Bijections Check

## 1. Goal

This document locks in the quotient bijection search loop and key construction logic to verify whether $\ker(R_{minimal}) = \ker(D_{util})$ holds globally.

---

## 2. Profile Extraction Loop

For each directed graph configuration $S \in \mathcal{S}_{023}$:
1. Compute the exact utilities $U(S, T_0)$ and $U(S, T_1)$ using Case `DEP-005` parameters.
2. Construct the utility partition key:
   ```typescript
   const keyUtil = `${u_T0.toFixed(3)}|${u_T1.toFixed(3)}`;
   ```
3. Construct the minimal sufficient representation partition key:
   ```typescript
   const keyMinimal = `${X2}|${X4}`;
   ```
   where $X_2 = X_{path\_string}(S)$ and $X_4 = X_{reach\_string}(S)$.

---

## 3. Quotient Mapping Analysis

1. Classify all 38,760 configurations into bins for `keyUtil` ($Bin_{util}$) and `keyMinimal` ($Bin_{minimal}$).
2. Compute the sizes:
   * $N_{util} = |Bin_{util}|$
   * $N_{minimal} = |Bin_{minimal}|$
3. Compare the partition counts.
4. Verify if every bin in $Bin_{minimal}$ maps to exactly **one** unique `keyUtil`. If so, representation sufficiency is formally confirmed.
5. If $N_{minimal} = N_{util}$, then the mapping is a bijection, proving global minimality.

---

## 4. Integrity Rule

The key formatting, partition mapping algorithms, and search loops are strictly locked. No post-hoc changes are allowed.
