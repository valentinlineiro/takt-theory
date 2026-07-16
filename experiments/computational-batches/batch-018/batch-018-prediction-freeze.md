# Batch-018 Prediction Freeze — Global Regret Predictions

## 1. Goal

This document freezes the ex-ante predictions for the global representational regret bounds $\varepsilon(R_i)$ across the four candidate representations on the 38,760 directed graphs.

---

## 2. Quantitative Predictions

We freeze the predicted global regret bounds $\varepsilon(R_i)$:

### 2.1 Baseline $\varepsilon(R_0)$ (Structural $\Omega$)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_0) = 15.58}
  \]
* **Rationale**: This is the maximum possible decision regret on the 5-node / 6-edge space. Since $R_0$ ignores failure rates and relative target coordinates, many high-regret configurations will share the same baseline keys.

### 2.2 Refinements $\varepsilon(R_1)$ and $\varepsilon(R_2)$ (Augmented Scalars)
* **Predicted Bounds**:
  \[
  \boxed{\varepsilon(R_1) = 15.58 \quad \text{and} \quad \varepsilon(R_2) = 15.58}
  \]
* **Rationale**: As proven in Batch-016, scalar refinements cannot resolve target-role transposition symmetries. Therefore, the worst-case regret bound remains completely flat.

### 2.3 Refinement $\varepsilon(R_{dist})$ (Relative Distance Coordinates)
* **Predicted Bound**:
  \[
  \boxed{\varepsilon(R_{dist}) = 0.00}
  \]
* **Rationale**: The relative distance signature multiset pairs node attributes with their spatial distance to source `'s'` and target `'t'`. By binding attributes to landmark-relative coordinates, all decision-changing configurations will be split into different equivalence classes, resolving all decision regret.

---

## 3. Monotonicity and Safety Policy Verification

We freeze the monotonicity verification hypothesis:
\[
\boxed{15.58 = \varepsilon(R_0) = \varepsilon(R_2) > \varepsilon(R_{dist}) = 0.00}
}
\]

If confirmed, this mathematically proves that **relative geometric coordinates anchor decision safety, achieving global sufficiency ($\varepsilon = 0.00$) over the entire domain**.
