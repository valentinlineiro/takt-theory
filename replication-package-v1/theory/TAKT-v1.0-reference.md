# TAKT v1.0 — Theoretical Reference & Operational Definitions

> **Frozen Reference Document for R1 Independent Replication**

---

## 1. Operational Definition of Capability Kernel ($K_D$)

The capability kernel $K_D \subseteq S \times S$ represents the task-specific equivalence relation defined over state space $S$ relative to decision contract $D: S \to A$:

$$(s_1, s_2) \in K_D \iff D(s_1) = D(s_2)$$

A representation $R: S \to Z$ preserves decision contract $D$ if and only if:

$$\text{ker}(R) \subseteq K_D$$

In the benchmark code (`TaktRunner.ts` and `StateSpaceGenerator.ts`), $K_D$ corresponds to the threshold mapping on the relevant feature subspace $S_{\text{rel}} = \{s_1 \dots s_{\lceil k/2 \rceil}\}$.

---

## 2. Operational Definition of Dynamic Decision Margin ($M_D$)

The dynamic decision margin $M_D(\tau_{:t})$ measures the distance between the current state trajectory $\tau_{:t}$ and the boundary of contract violation:

$$M_D(\tau_{:t}) = \min_{s \in \text{Unsafe}} d(\tau_{:t}, s)$$

In benchmark scenarios (`ScenarioConfig`), $M_D = 2.0$ represents a normalized robust safety margin.

---

## 3. Operational Definition of Critical Drift Rate ($\theta_{\text{crit}}$)

The critical drift rate $\theta_{\text{crit}}$ is the maximum velocity of contract non-stationarity that can be absorbed before safety guarantees break:

$$\theta_{\text{crit}} = \frac{M_D}{c_{\text{max}} \cdot h^*}$$

Where $h^*$ is the governance horizon. For default scenarios, $\theta_{\text{crit}} = 0.02$.

---

## 4. Expected Value of Sample Information (EVSI)

EVSI governs active candidate exploration:

$$\text{EVSI}(E) = \mathbb{E}_{y \sim E} \left[ \max_{a} \mathbb{E}[U(a \mid y)] \right] - \max_{a} \mathbb{E}[U(a)]$$

Candidate acquisition is triggered only if $\text{EVSI}(E) > C_{\text{acq}}(E)$.
