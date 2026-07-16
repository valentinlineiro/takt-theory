# Batch-023 Detector Design Freeze — Quotient Comparison Keys

## 1. Goal

This document locks in the key serialization formats and comparison loops in `cli/src/batch-023/evaluate.ts`.

---

## 2. Key Serialization Logic

For any graph configuration $S \in \mathcal{S}_{023}$:

### 2.1 Utility Profile Signature
The exact utility profile is serialized by formatting the utility of each action candidate to 3 decimal places:
```typescript
const keyUtil = `${u_T0.toFixed(3)}|${u_T1.toFixed(3)}`;
```

### 2.2 Minimal Representation Signature
The minimal representation key uses only the $X_2 = X_{path}$ and $X_4 = X_{reach}$ components:
```typescript
const keyMinimal = `${X2}|${X4}`;
```
where the component serialization matches the detector design of Batch-022.

---

## 3. Evaluation Search Protocol

The execution script `cli/src/batch-023/evaluate.ts` will compute these keys, group the 38,760 configurations into bins for each profile, and verify:
1. The unique bin counts $N_{minimal}$ and $N_{util}$.
2. That every bin in $Bin_{minimal}$ maps to a single $key_{util}$.

---

## 4. Integrity Rule

The serialization formats and quotient comparison loops are strictly locked. No post-hoc changes are allowed.
