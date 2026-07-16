# Batch-015 Detector Design Freeze — Augmented Aggregator Stability

## 1. Goal

This document freezes the augmented joint aggregator $D_{joint}^{+X_i}(\Delta\Omega_1, \varepsilon) \rightarrow \{\text{detected}, \text{undetected}\}$ ex-ante. The detector combines all previous sensors along with the candidate scalar augmentations ($X_1$ and $X_2$), enforcing strict integrity to prevent any post-hoc additions.

---

## 2. Frozen Sensor Formulae and Thresholds

The joint aggregator processes the absolute deviations under the augmented representation $\Omega_1 = \Omega \oplus X_i$:

1. **Reliability Delta ($d_\rho$)**: Threshold: $\varepsilon_\rho = 0.05$
2. **Capability Delta ($d_{caps}$)**: Threshold: $\varepsilon_{caps} = 0.05$
3. **Node Count Invariance ($d_{|V|}$)**: Threshold: $d_{|V|} > 0$
4. **Edge Count Invariance ($d_{|E|}$)**: Threshold: $d_{|E|} > 0$
5. **Redundancy Delta ($\Delta R$)**: Threshold: $\varepsilon_R = 0.10$
6. **Community Delta ($\Delta Com$)**: Threshold: $\varepsilon_{Com} = 0.05$
7. **Capability-Role Augmentation Delta ($d_{X1}$)**: Threshold: $\varepsilon_{X1} = 0.005$
8. **Structural Failure Sum Augmentation Delta ($d_{X2}$)**: Threshold: $\varepsilon_{X2} = 0.05$

---

## 3. Joint Aggregator Decision Rule

The augmented joint aggregator returns **detected** if any constituent sensor triggers:

\[
D_{joint}^{+X_i} = \text{detected} \iff \text{any } \Delta\Omega \text{ triggers} \quad \lor \quad d_{X_i} > \varepsilon_{X_i}
\]

Otherwise, it returns **undetected**.

---

## 4. Integrity Rule: No Post-Hoc Sensor Addition

To preserve scientific validity, the detector is forbidden from introducing any new sensor dimensions, node label validation, or target sink verification checks after the exposure of the transposition adversary.

We evaluate the limits of the augmented representation $\Omega_1 = \Omega \oplus X_i$. Adding target role matching (e.g. verifying that node `'t'` has not moved) would constitute repairing $\Omega_1$ rather than measuring its stability.
