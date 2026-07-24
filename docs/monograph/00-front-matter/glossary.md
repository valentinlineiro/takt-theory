# Harmonized Terminology & Canonical Glossary

This document provides the harmonized terminology for the TAKT framework established during the Step 1 Scientific Positioning Audit. All ambiguous or conflicting terms from earlier iterations have been unified into this canonical vocabulary.

---

## 1. Terminology Harmonization Table

| Deprecated / Ambiguous Term | Canonical TAKT Term | Architectural Justification |
| :--- | :--- | :--- |
| *Defect*, *Error Gap*, *State Loss* | **Capability Gap ($G(D, R)$)** | Focuses on functional decision capacity rather than uncalibrated state error. |
| *Sufficient State*, *Exact Model* | **Structurally Sufficient Representation ($R \in \mathcal{R}_{\text{sufficient}}(D)$)** | Emphasizes kernel refinement relative to contract $D$ rather than full state recovery. |
| *Safety Margin*, *Lead Time* | **Dynamic Surprisal Margin ($M_D$)** | Rigorously quantifies the uncertainty budget before contract invalidation. |
| *Detector Update*, *Sensor Addition* | **Detector Enrichment ($E: D_1 \to D_2$)** | Formalized as morphisms in the monoidal category $\mathbf{GovDet}$. |
| *State Reconstruction* | **Quotient Projection ($S / K_D$)** | Reflects mathematical quotienting over capability kernels. |

---

## 2. Canonical Alphabetical Glossary

### A
* **Abstraction Functor ($\mathcal{A}$):** Left adjoint functor $\mathcal{A}: \mathbf{GovDet} \to \mathbf{Rep}$ mapping high-dimensional decision systems to minimal quotient representation spaces.
* **Asymmetric Calibration ($M_D^{\text{calib}}$):** Surprisal margin corrected for unmodeled dynamics and bounded model error $M_D^{\text{calib}} = M_D - \epsilon_{\text{model}}$.

### C
* **Capability ($c \in \mathcal{C}$):** An atomic evaluation function $c: S \to Y_c$ inducing an equivalence relation $K_c$ over state space $S$.
* **Capability Gap ($G(D, R)$):** The set of capabilities required by contract $D$ that representation $R$ fails to distinguish: $G(D, R) = \{ c \in C_D \mid \ker(R) \not\subseteq K_c \}$.
* **Capability Kernel ($K_D$):** The intersection of equivalence relations induced by all capabilities required by contract $D$: $K_D = \bigcap_{c \in C_D} K_c$.
* **Contract Coherence Axiom (A0):** Foundational postulate establishing $\ker(D) = \bigcap_{c \in C_D} K_c$, unifying contract requirements with state equivalence.

### D
* **Detector Graph ($\mathcal{G}_D$):** Directed graph $(V, E)$ where vertices are detector configurations and edges represent valid enrichment transitions.
* **Directed Governance Distance ($d_{\rightarrow}$):** Asymmetric distance functional measuring capability deficit between two detector contracts $D_1$ and $D_2$.
* **Dynamic Surprisal Margin ($M_D$):** Non-negative scalar representing accumulated uncertainty budget remaining before contract breach under observation trajectory $\tau_{:t}$.

### E
* **Enrichment Algebra:** Monoidal algebraic structure governing combination ($\otimes$) and sequential refinement ($\circ$) of state detectors.
* **Expected Value of Sample Information (EVSI):** Net expected decision utility gain achieved by acquiring additional detector observations minus acquisition cost $C_{\text{acq}}(E)$.

### G
* **Guaranteed Intervention Horizon ($h^*$):** Minimum discrete time steps guaranteed before potential contract breach, computed as $h^* = \lfloor M_D / c_{\text{max}} \rfloor$.

### K
* **Kernel Refinement ($\sqsubseteq$):** Partial order on representations where $R_1 \sqsubseteq R_2 \iff \ker(R_2) \subseteq \ker(R_1)$.

### M
* **Minimal Quotient Representation ($R_{\text{min}}$):** Canonical representation $S / K_D$ achieving minimum cardinality ($|S / K_D| \le 2^k$) while preserving decision optimality.

### P
* **Perfection Distance ($\delta(D)$):** Distance functional quantifying structural deficit between detector contract $D$ and zero-defect optimal detector $D^*$.

### R
* **Rational Stopping Policy ($\pi^*$):** Optimal stopping rule terminating detector enrichment when $\max_{E} EVSI(E \mid D) \le 0$.

### S
* **Structural Sufficiency Theorem (ST-015):** Foundational theorem establishing $R \in \mathcal{R}_{\text{sufficient}}(D) \iff \ker(R) \subseteq K_D$.

### T
* **Triple Reading Level:** Editorial framework presenting every concept via Narrative (L1), Math (L2), and Lean 4 (L3).
