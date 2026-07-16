# Batch-023 Prediction Freeze — Quotient Kernels Predictions

## 1. Goal

This document locks in the ex-ante predictions for the comparison between the minimal sufficient representation partition $N_{minimal}$ and the exact utility partition $N_{util}$.

---

## 2. Invariant Partition Predictions

We freeze the following predictions on quotient partition cardinalities:

### 2.1 The Redundant Partition Gap
* **Prediction**: The minimal sufficient representation partition is strictly finer than the exact utility partition:
  \[
  \boxed{ N_{minimal} > N_{util} }
  \]
* **Rationale**: The utility function maps many distinct topologies to the identical utility profiles. For example, any configuration with no active paths from `'s'` to `'t'` and no observed active edges yields the default fallback utility profile `"-14.580|-14.580"`. While the utility kernel collapses all these states into a single bin, $R_{minimal} = X_{path} \oplus X_{reach}$ still distinguishes them based on their local paths or node connectivity. Therefore, $R_{minimal}$ preserves utility-neutral structural variations.

### 2.2 Quotient Sufficiency
* **Prediction**: The minimal representation partition successfully refines the utility partition:
  \[
  \ker(R_{minimal}) \subseteq \ker(D_{util})
  \]
  Every bin in $Bin_{minimal}$ maps to exactly one utility profile, guaranteeing zero decision conflict.

---

## 3. Verification Criteria

We freeze the following outcome check:
* **Scenario C — Residual Redundant Distinctions**: $412 = N_{minimal} > N_{util}$, proving that $R_{minimal}$ is sufficient but preserves utility-neutral variations that can be safely collapsed.
