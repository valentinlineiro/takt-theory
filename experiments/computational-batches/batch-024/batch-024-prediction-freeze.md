# Batch-024 Prediction Freeze — Computational Minimality Predictions

## 1. Goal

This document locks in the ex-ante predictions for the coarsened reachability representation $R_{coarse}$.

---

## 2. Quantitative Predictions

We freeze the predicted metrics:

### 2.1 Sufficiency of Coarsened Reachability
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{coarse}) = 0.00}
  \]
* **Rationale**: The utility function in Case `DEP-005` aggregates failure risk as a sum over the failure probabilities of reachable failed nodes. It does not depend on the individual identity (labels) of which node is reachable, but only on the aggregate count of reachable failed nodes at each failure rate level ($pFail = 0.8$ and $pFail = 0.5$). Since $X_{coarse\_reach}$ preserves these counts exactly, it completely determines the utility values and optimal decisions.

### 2.2 Partition Compression
* **Predicted Size**:
  \[
  \boxed{N_{coarse} < 412}
  \]
* **Rationale**: Collapsing node-specific reachability signatures into aggregate counts merges configurations that share the same counts of reachable failed nodes but differ in which specific nodes are reachable. This will coarsen the partition, strictly improving compression.

---

## 3. Verification Criteria

We freeze the outcome classification check:
* **Scenario A — Coarsened Sufficiency Confirmed**: $\varepsilon(R_{coarse}) = 0.00$ and $N_{coarse} < 412$, proving that node-by-node reachability is redundant for decision safety and aggregate counts are sufficient.
