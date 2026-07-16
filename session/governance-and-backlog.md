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
* **Documentación:** [experiments/ST-001/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-001/conclusion.md)
* **Enlace al Núcleo Formal:** [DecisionSystem.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/DecisionSystem.lean), [SafetyEquivalence.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/SafetyEquivalence.lean) y [EpsilonUCounterexample.lean](file:///home/valentin/code/takt-theory/experiments/ST-001/implementation/EpsilonUCounterexample.lean)

### ST-002 — Compositional Pipeline
* **Estado:** [✓] Completado
* **Clasificación:** **Refined** (Refinado)
* **Objetivo:** Aplicar el formalismo de TAKT a una cadena secuencial real de transformaciones y abstracciones de datos (por ejemplo: *Filtrado de sensor $\rightarrow$ Extracción de features $\rightarrow$ Clasificación decisional*).
* **Pregunta Clave:** ¿Se sostiene la aditividad exacta del regret en la práctica y cómo escala la cota superior del error acumulado en pipelines con múltiples etapas de contracción?
* **Documentación:** [experiments/ST-002/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-002/conclusion.md)
* **Enlace al Núcleo Formal:** [Regret.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/Regret.lean) y [RegretPipeline.lean](file:///home/valentin/code/takt-theory/experiments/ST-002/implementation/RegretPipeline.lean)

### ST-003 — External Formalism
* **Estado:** [✓] Completado
* **Clasificación:** **Validated** (Validado)
* **Objetivo:** Modelar un problema de toma de decisiones o abstracción de estados proveniente de una disciplina externa (por ejemplo: control clásico de procesos, teoría de juegos simple o agregación de estados en procesos de decisión markovianos ya publicados) directamente en el lenguaje de TAKT, sin pre-adaptaciones.
* **Pregunta Clave:** ¿El lenguaje minimalista de TAKT resulta natural para mapear el problema externo o emergen vacíos conceptuales que no pueden expresarse únicamente con $S$, $A$, $U$ y $R$?
* **Documentación:** [experiments/ST-003/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-003/conclusion.md)
* **Enlace al Núcleo Formal:** [ExternalControl.lean](file:///home/valentin/code/takt-theory/experiments/ST-003/implementation/ExternalControl.lean)

---

## 3. Backlog de la Fase C (Adversarial)

Esta fase adopta un enfoque puramente adversarial para evaluar los límites de observación y robustez de TAKT.

### ST-004 — Hidden Kernel Attack
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Buscar una representación que preserve todos los observables locales (como la seguridad en un conjunto de test) pero que esconda pérdida de seguridad decisional a nivel global.
* **Pregunta Clave:** ¿Los observables empíricos sobre subconjuntos de estados son suficientes para certificar la seguridad global de una representación en TAKT?
* **Documentación:** [experiments/ST-004/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-004/conclusion.md)
* **Enlace al Núcleo Formal:** [HiddenKernel.lean](file:///home/valentin/code/takt-theory/experiments/ST-004/implementation/HiddenKernel.lean)

### ST-005 — Multi-agent / Distributed Decision
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Extender la composición a arquitecturas no lineales (e.g., redes en estrella o diamante) con múltiples agentes decisores independientes.
* **Pregunta Clave:** ¿Cómo interactúan los contratos decisionales distribuidos y si pueden surgir inconsistencias colectivas a pesar de la seguridad local de cada agente?
* **Documentación:** [experiments/ST-005/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-005/conclusion.md)
* **Enlace al Núcleo Formal:** [DistributedDecision.lean](file:///home/valentin/code/takt-theory/experiments/ST-005/implementation/DistributedDecision.lean)

### ST-006 — Temporal Drift
* **Estado:** [✓] Completado
* **Clasificación:** **Boundary Identified** (Límite Identificado)
* **Objetivo:** Analizar la deriva temporal infinitesimal de las representaciones ($R_t \to R_{t+1}$).
* **Pregunta Clave:** ¿Es capaz TAKT de alertar sobre la degradación decisional acumulada antes de que se produzca una pérdida catastrófica visible?
* **Documentación:** [experiments/ST-006/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-006/conclusion.md)
* **Enlace al Núcleo Formal:** [TemporalDrift.lean](file:///home/valentin/code/takt-theory/experiments/ST-006/implementation/TemporalDrift.lean)

### ST-007 — External Dynamic Safety Contract
* **Estado:** [✓] Completado
* **Clasificación:** **Validated** (Validado)
* **Objetivo:** Evaluar si el Contrato Dinámico de Seguridad detecta y gobierna la degradación decisional en un clasificador neuronal Edge-AI con cuantificación bajo deriva de datos.
* **Pregunta Clave:** ¿Puede el contrato de gobernanza dinámico actuar como instrumento efectivo de auditoría en un sistema externo no diseñado bajo TAKT?
* **Documentación:** [experiments/ST-007/conclusion.md](file:///home/valentin/code/takt-theory/experiments/ST-007/conclusion.md)
* **Enlace al Núcleo Formal:** [ExternalContract.lean](file:///home/valentin/code/takt-theory/experiments/ST-007/implementation/ExternalContract.lean)

---

## 4. Backlog de la Fase D (Consolidación)

Esta fase transforma los límites descubiertos en la Fase C en invariantes preventivas y métricas dentro del marco formal de TAKT.

### D-001 — Decision Margin Formalization
* **Estado:** [✓] Completado
* **Objetivo:** Formalizar la distancia geométrica al fallo decisional ($M(R)$) en espacios métricos.
* **Pregunta Clave:** ¿Cómo medimos la deriva permitida antes del colapso decisional?
* **Documentación:** [docs/research/D-001/formalization.md](file:///home/valentin/code/takt-theory/docs/research/D-001/formalization.md)
* **Enlace al Núcleo Formal:** [DecisionMargin.lean](file:///home/valentin/code/takt-theory/docs/research/D-001/implementation/DecisionMargin.lean)

### D-002 — Test Coverage Characterization
* **Estado:** [✓] Completado
* **Objetivo:** Caracterizar formalmente la Condición de Cobertura de Fibras ($C(T, S)$).
* **Pregunta Clave:** ¿Bajo qué condiciones una garantía local en un conjunto de test $T$ se generaliza a la seguridad global en $S$?
* **Documentación:** [docs/research/D-002/formalization.md](file:///home/valentin/code/takt-theory/docs/research/D-002/formalization.md)
* **Enlace al Núcleo Formal:** [Coverage.lean](file:///home/valentin/code/takt-theory/docs/research/D-002/implementation/Coverage.lean)

### D-003 — Dynamic Safety Contracts
* **Estado:** [✓] Completado
* **Objetivo:** Unificar composición, agentes y tiempo en un contrato decisional dinámico.
* **Pregunta Clave:** ¿Cómo formalizamos un contrato dinámico capaz de blindar la seguridad decisional en entornos distribuidos cambiantes?
* **Documentación:** [docs/research/D-003/formalization.md](file:///home/valentin/code/takt-theory/docs/research/D-003/formalization.md)
* **Enlace al Núcleo Formal:** [DynamicSafetyContract.lean](file:///home/valentin/code/takt-theory/docs/research/D-003/implementation/DynamicSafetyContract.lean)

---

## 5. Clasificación de Resultados

Cada stress-test o caso de estudio documentado deberá concluir etiquetándose bajo una de las siguientes tres categorías:

1. **Validated:** El formalismo de TAKT modeló el problema con éxito y las predicciones teóricas se confirmaron en el experimento.
2. **Refined:** El caso requirió precisiones menores en el manejo de las definiciones operacionales (como el comportamiento del desempate) sin alterar el núcleo axiomático.
3. **Boundary Identified:** Se identificó una limitación fundamental de la teoría en el dominio de prueba (e.g., inexpresividad ante la dinámica estocástica o necesidad de métricas informacionales), delimitando formalmente el alcance de la versión actual.
