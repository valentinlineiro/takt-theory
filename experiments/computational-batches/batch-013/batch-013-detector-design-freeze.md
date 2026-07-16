# Batch-013 Detector Design Freeze — Operational Joint Aggregator

## 1. Goal

This document freezes the operational joint aggregator $D_{joint}(\Delta\Omega, \varepsilon) \rightarrow \{\text{detected}, \text{undetected}\}$ ex-ante. The detector combines all previously operationalized sensors, enforcing strict integrity to prevent any post-hoc additions or adjustments.

---

## 2. Frozen Sensor Formulae and Thresholds

The joint aggregator processes the absolute transition deviations between the clean and corrupt runs at each step $k$:

1. **Reliability Delta ($d_\rho$)**:
   * Measures the L2 norm of the boundary reliability vector difference.
   * Threshold: $\varepsilon_\rho = 0.05$
2. **Capability Delta ($d_{caps}$)**:
   * Measures the sum of Hamming distances between observed capability signatures.
   * Threshold: $\varepsilon_{caps} = 0.05$
3. **Node Count Invariance ($d_{|V|}$)**:
   * Measures the difference in the number of nodes added at each BFS step.
   * Threshold: $d_{|V|} > 0$
4. **Edge Count Invariance ($d_{|E|}$)**:
   * Measures the difference in the number of edges added at each BFS step.
   * Threshold: $d_{|E|} > 0$
5. **Redundancy Delta ($\Delta R$)**:
   * Measures the difference in average edge-disjoint paths to boundary nodes.
   * Threshold: $\varepsilon_R = 0.10$
6. **Community Delta ($\Delta Com$)**:
   * Measures the difference in average local clustering coefficients.
   * Threshold: $\varepsilon_{Com} = 0.05$

---

## 3. Joint Aggregation Decision Rule

The joint aggregator returns **detected** if *any* sensor exceeds its threshold:

\[
D_{joint} = \text{detected} \iff d_\rho > 0.05 \ \lor \ d_{caps} > 0.05 \ \lor \ d_{|V|} > 0 \ \lor \ d_{|E|} > 0 \ \lor \ \Delta R > 0.10 \ \lor \ \Delta Com > 0.05
\]

Otherwise, it returns **undetected**.

---

## 4. Integrity Rule: No Post-Hoc Sensor Addition

To preserve scientific validity, the detector is forbidden from introducing any new sensor dimensions, node label validation, or semantic path-matching checks after the exposure of the adversary. 

We measure the limits of the currently defined $\Omega$ representation. Modifying the detector to capture Configuration #187 (e.g. by checking if node `v3` still has the same neighbors) would constitute repairing the instrument rather than evaluating its observational kernel.
