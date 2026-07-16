# Batch-023 Fixture Freeze — Quotient Kernels and Partition Verification

## 1. Goal

This document locks in the experimental domain ($\mathcal{S}_{023}$), utility parameters, and partition comparison metrics to verify global minimality of $R_{minimal} = X_2 \oplus X_4$.

---

## 2. Experimental Domain and Utility

We reuse the parameters of Batch-022:
* **Domain Space ($\mathcal{S}_{023}$)**: All 38,760 directed graphs on 5 nodes with 6 edges.
* **Focal element**: `'s'` (source).
* **Target element**: `'t'` (sink).
* **Observation Horizon**: $k = 2$.
* **Utility $U$**: Case `DEP-005` parameters (path limit 3, default fallback $-14.58$).

---

## 3. Partition Comparison Metrics

For each directed graph configuration $S \in \mathcal{S}_{023}$:

1. **Utility Profile Signature**:
   \[
   Profile_{util}(S) = U(S, T_0).toFixed(3) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} U(S, T_1).toFixed(3)
   \]
2. **Minimal Representation Signature**:
   \[
   Profile_{minimal}(S) = X_2(S) \mathbin{\Vert} \text{"|"} \mathbin{\Vert} X_4(S)
   \]
   (using only the $X_2 = X_{path}$ and $X_4 = X_{reach}$ components from Batch-022).
3. **Partition Cardinality Comparison**:
   * Count of unique minimal keys: $N_{minimal} = |\mathcal{S} / \ker(R_{minimal})|$.
   * Count of unique utility keys: $N_{util} = |\mathcal{S} / \ker(D_{util})|$.
   * Due to sufficiency, the partition of $R_{minimal}$ must refine the utility partition, guaranteeing:
     \[
     \boxed{ N_{minimal} \ge N_{util} }
     \]

---

## 4. Verification Check

We freeze the outcomes classification:
* **Exact Global Minimality**: $N_{minimal} = N_{util} = 412$.
* **Residual Redundant Distinctions**: $N_{minimal} > N_{util}$, proving that $R_{minimal}$ is sufficient but preserves utility-neutral variations.
