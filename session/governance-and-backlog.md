# TAKT Governance & Stress-Test Backlog

Este documento define el marco de gobernanza metodológica y el backlog de pruebas para la fase de validación empírica y experimental de TAKT (Theory of Adequate Knowledge for Decisions).

---

## 1. Reglas de Gobernanza

A partir del congelado de la versión `v1.0.0-formal-core`, la evolución de TAKT se rige por las siguientes directrices:

| Regla | Consecuencia |
| :--- | :--- |
| **El núcleo formal está congelado.** | No se modifican definiciones, axiomas o estructuras en Lean por intuición, conveniencia estética o especulación teórica. |
| **Todo cambio requiere evidencia externa.** | Cualquier modificación o extensión futura del núcleo debe estar justificada por un contraejemplo riguroso, una limitación de modelado empírica o un caso de estudio documentado. |
| **Los resultados negativos son de primer orden.** | La identificación de límites y fallos lógicos en dominios específicos tiene el mismo valor científico que las confirmaciones. Los límites son parte constitutiva de la teoría. |
| **Las aplicaciones preceden a las extensiones.** | Se prohíbe incorporar nuevas abstracciones teóricas "por si acaso". La teoría solo se ampliará cuando un problema del mundo real demuestre que el núcleo actual es insuficiente. |

*«La teoría deja de ser la variable independiente y pasa a ser la constante del experimento.»*

---

## 2. Backlog de Stress-Tests

Para iniciar el ciclo de validación, se establece el siguiente backlog de experimentos iniciales. Cada caso deberá ejecutarse siguiendo el ciclo: **Caso $\rightarrow$ Predicción $\rightarrow$ Aplicación $\rightarrow$ Resultado $\rightarrow$ Conclusión**.

### ST-001 — Decision Boundary Stability
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Estudiar el comportamiento de la condición $\ker(R) \subseteq \ker(D)$ en escenarios con empates de utilidad extrema y evaluar la sensibilidad al operador de desempate determinista ($\theta$).
* **Pregunta Clave:** ¿Requiere la condición de seguridad una formulación topológica o estocástica más robusta cuando el espacio de decisión presenta fronteras degeneradas o inestabilidades infinitesimales?
* **Documentación:** [experiments/stress-tests/ST-001/conclusion.md](../experiments/stress-tests/ST-001/conclusion.md)
* **Enlace al Núcleo Formal:** [DecisionSystem.lean](../takt-formal/TaktFormal/DecisionSystem.lean), [SafetyEquivalence.lean](../takt-formal/TaktFormal/SafetyEquivalence.lean) y [EpsilonUCounterexample.lean](../takt-formal/TaktFormal/EpsilonUCounterexample.lean)

### ST-002 — Compositional Pipeline
* **Estado:** [✓] Completado
* **Clasificación:** **Refined** (Refinado)
* **Objetivo:** Aplicar el formalismo de TAKT a una cadena secuencial real de transformaciones y abstracciones de datos (por ejemplo: *Filtrado de sensor $\rightarrow$ Extracción de features $\rightarrow$ Clasificación decisional*).
* **Pregunta Clave:** ¿Se sostiene la aditividad exacta del regret en la práctica y cómo escala la cota superior del error acumulado en pipelines con múltiples etapas de contracción?
* **Documentación:** [experiments/stress-tests/ST-002/conclusion.md](../experiments/stress-tests/ST-002/conclusion.md)
* **Enlace al Núcleo Formal:** [Regret.lean](../takt-formal/TaktFormal/Regret.lean) y [RegretPipeline.lean](../takt-formal/TaktFormal/RegretPipeline.lean)

### ST-003 — External Formalism
* **Estado:** [✓] Completado
* **Clasificación:** **Validated** (Validado)
* **Objetivo:** Modelar un problema de toma de decisiones o abstracción de estados proveniente de una disciplina externa (por ejemplo: control clásico de procesos, teoría de juegos simple o agregación de estados en procesos de decisión markovianos ya publicados) directamente en el lenguaje de TAKT, sin pre-adaptaciones.
* **Pregunta Clave:** ¿El lenguaje minimalista de TAKT resulta natural para mapear el problema externo o emergen vacíos conceptuales que no pueden expresarse únicamente con $S$, $A$, $U$ y $R$?
* **Documentación:** [experiments/stress-tests/ST-003/conclusion.md](../experiments/stress-tests/ST-003/conclusion.md)
* **Enlace al Núcleo Formal:** [ExternalControl.lean](../takt-formal/TaktFormal/ExternalControl.lean)

---

## 3. Backlog de la Fase C (Adversarial)

Esta fase adopta un enfoque puramente adversarial para evaluar los límites de observación y robustez de TAKT.

### ST-004 — Hidden Kernel Attack
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Buscar una representación que preserve todos los observables locales (como la seguridad en un conjunto de test) pero que esconda pérdida de seguridad decisional a nivel global.
* **Pregunta Clave:** ¿Los observables empíricos sobre subconjuntos de estados son suficientes para certificar la seguridad global de una representación en TAKT?
* **Documentación:** [experiments/stress-tests/ST-004/conclusion.md](../experiments/stress-tests/ST-004/conclusion.md)
* **Enlace al Núcleo Formal:** [HiddenKernel.lean](../takt-formal/TaktFormal/HiddenKernel.lean)

### ST-005 — Multi-agent / Distributed Decision
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Extender la composición a arquitecturas no lineales (e.g., redes en estrella o diamante) con múltiples agentes decisores independientes.
* **Pregunta Clave:** ¿Cómo interactúan los contratos decisionales distribuidos y si pueden surgir inconsistencias colectivas a pesar de la seguridad local de cada agente?
* **Documentación:** [experiments/stress-tests/ST-005/conclusion.md](../experiments/stress-tests/ST-005/conclusion.md)
* **Enlace al Núcleo Formal:** [DistributedDecision.lean](../takt-formal/TaktFormal/DistributedDecision.lean)

### ST-006 — Temporal Drift
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Analizar la deriva temporal infinitesimal de las representaciones ($R_t \to R_{t+1}$).
* **Pregunta Clave:** ¿Es capaz TAKT de alertar sobre la degradación decisional acumulada antes de que se produzca una pérdida catastrófica visible?
* **Documentación:** [experiments/stress-tests/ST-006/conclusion.md](../experiments/stress-tests/ST-006/conclusion.md)
* **Enlace al Núcleo Formal:** [TemporalDrift.lean](../takt-formal/TaktFormal/TemporalDrift.lean)

### ST-007 — External Dynamic Safety Contract
* **Estado:** [✓] Completado
* **Clasificación:** **Validated** (Validado)
* **Objetivo:** Evaluar si el Contrato Dinámico de Seguridad detecta y gobierna la degradación decisional en un clasificador neuronal Edge-AI con cuantificación bajo deriva de datos.
* **Pregunta Clave:** ¿Puede el contrato de gobernanza dinámico actuar como instrumento efectivo de auditoría en un sistema externo no diseñado bajo TAKT?
* **Documentación:** [experiments/stress-tests/ST-007/conclusion.md](../experiments/stress-tests/ST-007/conclusion.md)
* **Enlace al Núcleo Formal:** [ExternalContract.lean](../takt-formal/TaktFormal/ExternalContract.lean)

---

## 4. Backlog de la Fase D (Consolidación)

Esta fase transforma los límites descubiertos en la Fase C en invariantes preventivas y métricas dentro del marco formal de TAKT.

### D-001 — Decision Margin Formalization
* **Estado:** [✓] Completado
* **Objetivo:** Formalizar la distancia geométrica al fallo decisional ($M(R)$) en espacios métricos.
* **Pregunta Clave:** ¿Cómo medimos la deriva permitida antes del colapso decisional?
* **Documentación:** [docs/03-design-contracts/D-001/formalization.md](../docs/03-design-contracts/D-001/formalization.md)
* **Enlace al Núcleo Formal:** [DecisionMargin.lean](../takt-formal/TaktFormal/DecisionMargin.lean)

### D-002 — Test Coverage Characterization
* **Estado:** [✓] Completado
* **Objetivo:** Caracterizar formalmente la Condición de Cobertura de Fibras ($C(T, S)$).
* **Pregunta Clave:** ¿Bajo qué condiciones una garantía local en un conjunto de test $T$ se generaliza a la seguridad global en $S$?
* **Documentación:** [docs/03-design-contracts/D-002/formalization.md](../docs/03-design-contracts/D-002/formalization.md)
* **Enlace al Núcleo Formal:** [Coverage.lean](../takt-formal/TaktFormal/Coverage.lean)

### D-003 — Dynamic Safety Contracts
* **Estado:** [✓] Completado
* **Objetivo:** Unificar composición, agentes y tiempo en un contrato decisional dinámico.
* **Pregunta Clave:** ¿Cómo formalizamos un contrato dinámico capaz de blindar la seguridad decisional en entornos distribuidos cambiantes?
* **Documentación:** [docs/03-design-contracts/D-003/formalization.md](../docs/03-design-contracts/D-003/formalization.md)
* **Enlace al Núcleo Formal:** [DynamicSafetyContract.lean](../takt-formal/TaktFormal/DynamicSafetyContract.lean)

---

## 5. Fase G2 — Gobernanza Dinámica bajo Incertidumbre (Paper v4)

Esta fase extiende TAKT desde gobernanza estática a gobernanza dinámica sobre trayectorias.

**Estado:** [✓] Completada y congelada (`docs/04-academic-paper/2026-07-17-takt-v4-draft.md`)

**Pregunta científica:** ¿Cómo se garantiza seguridad decisional cuando el operador de
transición es incierto y la observabilidad es parcial?

**Objeto matemático introducido:** El **Margen Dinámico** `M_D(τ_{:t})` — el coste
de surprisal mínimo acumulado hasta el primer fallo decisional desde un prefijo de
trayectoria. Objeto distinto del `M(R)` estático de D-001 (véase nota terminológica).

### Red Team (RT-001 a RT-004)
* **RT-001 — False Coverage Attack:** La cobertura de estados no implica cobertura de trayectorias bajo observabilidad parcial.
* **RT-002 — Temporal accumulation:** Un agente seguro en cada paso puede acumular fallo decidional no capturable por verificación puntual.
* **RT-003 — Model uncertainty:** Un operador de transición mal especificado invalida las garantías del margen.
* **RT-004 — Adaptive Adversary:** Un adversario que aprende la frontera de certificación construye trayectorias que evaden la cobertura.
* **Enlace al Núcleo Formal:** [`RT001.lean`](../takt-formal/TaktFormal/RT001.lean), [`RT002.lean`](../takt-formal/TaktFormal/RT002.lean), [`RT003.lean`](../takt-formal/TaktFormal/RT003.lean), [`RT004.lean`](../takt-formal/TaktFormal/RT004.lean)

### Experimentos F (F-001 a F-005.1)
* **F-001 — Temporal Coverage:** Verificación de cobertura y consistencia sobre secuencias de observación.
* **F-002 — Dynamic Margin:** `M_D` refleja correctamente la accesibilidad del fallo bajo el operador de transición.
* **F-003 — Guaranteed Intervention Horizon (Theorem F-002):** Si `M_D > C_h^max`, ningún fallo ocurre en `h` pasos — sin counterejemplos en Monte Carlo.
* **F-004 — Audit Game:** Un auditor con `M_D > θ` como criterio mantiene pérdida esperada bajo ε; sin margen dinámico, falla sistemáticamente.
* **F-005 — Asymmetric Margin Effect:** El sesgo optimista en `P̂` invalida la garantía contractual; el sesgo pesimista la preserva a coste operacional. Efecto asimétrico confirmado experimentalmente.
* **F-005.1 — Conservative Calibration:** El offset β ∈ [0.2, 0.5] reduce false safes en ~90% sin generar false alarms — frontera de Pareto observable.

**Implementación:** TypeScript (ESM, Vitest 4.x) — 131 tests, 51 ficheros, 0 fallos.

---

## 6. Clasificación de Resultados

Cada stress-test o caso de estudio documentado deberá concluir etiquetándose bajo una de las siguientes tres categorías:

1. **Validated:** El formalismo de TAKT modeló el problema con éxito y las predicciones teóricas se confirmaron en el experimento.
2. **Refined:** El caso requirió precisiones menores en el manejo de las definiciones operacionales (como el comportamiento del desempate) sin alterar el núcleo axiomático.
3. **Boundary Identified:** Se identificó una limitación fundamental de la teoría en el dominio de prueba (e.g., inexpresividad ante la dinámica estocástica o necesidad de métricas informacionales), delimitando formalmente el alcance de la versión actual.
