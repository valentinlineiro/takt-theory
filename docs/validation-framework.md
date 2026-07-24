# TAKT Validation Framework & Metatheory of Evidence

> **Document Status:** Scientific Validation Specification  
> **Purpose:** Formalize the methodology for empirical validation, falsification protocols, replication degrees (R0-R3), and the criteria required to accept any future major revision (v2.0).

---

## 1. Traceability Pipeline: Theory to Evidence

To ensure complete scientific rigor, every claim in TAKT must follow an unbroken, traceable pipeline:

$$\text{Theorem (Lean 4)} \longrightarrow \text{Application Assumption ($A_i$)} \longrightarrow \text{Falsifiable Hypothesis ($H_j$)} \longrightarrow \text{Benchmark Protocol} \longrightarrow \text{Dataset} \longrightarrow \text{Empirical Result}$$

### 1.1 Traceability Matrix (v1.0 Frozen Core)

| Theorem / Formal Object | Application Assumption | Experimental Hypothesis | Benchmark | Target Dataset |
| :--- | :--- | :--- | :--- | :--- |
| **ST-015** (Structural Sufficiency) | $A_1$: Stable contract during step | $H_1$: $S / K_D$ reduces search complexity polynomially without decision error | `EXP-001` (Kernel Scaling) | `EXP-001-seed-*.json` |
| **ST-016** (Minimal Sufficiency Uniqueness) | $A_4$: Discrete/bounded decision space | $H_2$: $S / K_D$ achieves minimal memory footprint among all zero-regret representations | `EXP-001` (Kernel Scaling) | `EXP-001-seed-*.json` |
| **G2-H1** (Governance Horizon) | $A_2$: Observable representation space | $H_3$: $M_D(\tau_{:t}) \ge 0$ guarantees zero contract breaches under drift $\theta < \theta_{\text{crit}}$ | `EXP-004` (Drift Horizon) | `EXP-004-seed-*.json` |
| **EVSI-Stop** (Information Stopping) | $A_3$: Estimable acquisition cost | $H_4$: EVSI stopping reduces observation acquisition costs compared to full sampling | `EXP-002` (EVSI Stopping) | `EXP-002-seed-*.json` |

---

## 2. Application Hypotheses & Assumptions ($A_1 \dots A_4$)

Every empirical evaluation of TAKT must explicitly declare which application assumptions hold:

- **$A_1$ (Contract Stability):** The decision contract $D: S \to A$ remains stationary during the evaluation interval $[t, t+\Delta t]$.
- **$A_2$ (State Observability):** The representation mapping $R: S \to Z$ produces observable outputs without hidden unmodeled state variables.
- **$A_3$ (Cost Estimability):** Information acquisition and transformation costs $C_{\text{trans}}(f)$ can be bounded or estimated online.
- **$A_4$ (Decision Discretization):** The action space $A$ or capability invariant set $C_D$ is bounded and discrete.

---

## 3. Graded Scale of Replication ($R_0 \dots R_3$)

Empirical evidence is evaluated according to a 4-tier replication scale:

* **$R_0$ – Internal Replication:** Executed by original authors, same codebase, different hardware or seeds.
* **$R_1$ – Independent Protocol Replication:** Executed by third-party researchers using the official codebase and protocol.
* **$R_2$ – Independent Heterogeneous Implementation:** Re-implemented independently from specification by a third party with compatible results.
* **$R_3$ – Generalized Domain Replication:** Replicated across multiple distinct domains (e.g. LLM tool agents, microservice governance, physical control).

---

## 4. Criteria for Accepting Future Major Revisions (v2.0)

No modifications to the theoretical core (Lean 4 proofs, axioms, or quotient definitions) will be made in minor releases (v1.x). A transition to **v2.0** will only be triggered if:

## 5. Cartografía del Dominio de Validez (Mapa de Regímenes 2D)

La evaluación empírica de TAKT v1.0 no busca únicamente confirmar victorias, sino trazar el mapa 2D del dominio donde las garantías se mantienen vs. los regímenes donde el modelo se degrada.

### 5.1 Regímenes de Coste ($C_{\text{total}}(n) = C_{\text{setup}} + n \cdot C_{\text{decision}}$)

1. **Régimen I ($n < n_{\text{break-even}}$):** Tareas de horizonte corto donde el coste de construcción del kernel $C_{\text{setup}}$ domina sobre la latencia por paso. Búsqueda exhaustiva simple puede ser superior.
2. **Régimen II ($n \ge n_{\text{break-even}}$):** Dominio de ventaja estructural. El coste $C_{\text{setup}}$ se amortiza y la compresión $S / K_D$ ofrece ventaja frente a baselines no comprimidos.
3. **Régimen III (Frontera de Ruptura / Saturación):** $k \ge 32$ o deriva del contrato $\Delta D > \Delta D_{\text{max}}$. El coste de recalibración supera el beneficio de la representación reducida.

### 5.2 Mapa 2D de Regímenes de Validez

```text
                  Alta deriva del contrato (ΔD)
                                ↑
                                |
             Límite             |           Frontera
          Recalibración         |          de Ruptura
                                |
k bajo ─────────────────────────┼───────────────────────── k alto
                                |
             Dominio            |           Límite
           de Ventaja           |         Setup Cost
          Estructural           |
                                ↓
                  Baja deriva del contrato (ΔD)
```

### 5.3 Las Tres Superficies del Atlas de Validez

El Atlas computable desacopla la frontera en tres superficies independientes:

1. **Superficie de Ventaja Operacional ($f_V(k, \Delta D, n) = 0$):**
   Delimita la región donde el coste total de TAKT es estrictamente menor que el baseline ($C_{\text{TAKT}} < C_{\text{baseline}}$).
2. **Superficie de Seguridad Decisional ($f_R(k, \Delta D, n) = 0$):**
   Delimita la región donde el regret decisional permanece estrictamente nulo ($\text{Regret} = 0$).
3. **Superficie de Confianza Científica ($f_E(k, \Delta D, n, R) = 0$):**
   Delimita el grado de madurez empírica acumulada en la escala de replicación ($R_0 \to R_3$).

---

## 6. Hoja de Ruta Priorizada hacia la Replicación Independiente ($R_1$)

1. **Congelar v1.0:** Núcleo formal en Lean 4, especificaciones y monografía inmutables.
2. **Ejecutar EXP-001-Boundary-α:** Cartografía fina inicial de las 3 superficies ($f_V, f_R, f_E$).
3. **Construir el primer Atlas Computable:** Dataset `atlas-v1-alpha.json` inmutable.
4. **Publicar Paquete de Protocolo Reproducible:** CLI determinista sin intervención manual.
5. **Búsqueda Activa de Replicación $R_1$:** Exposición del marco a auditores e investigadores independientes.
