# TAKT v1.0 — Threats to Validity (Amenazas a la Validez)

> **Estado del Documento:** Especificación Metodológica y Auditoría de Riesgos Empíricos/Conceptuales.  
> **Propósito:** Formalizar a priori los factores de riesgo, sesgos metodológicos y fronteras de validez para evitar la reinterpretación post-hoc de los resultados empíricos.

---

## 1. Amenazas a la Validez Externa (Generalizabilidad)

### 1.1 Sesgo de Selección de Benchmarks
* **Riesgo:** Que los escenarios sintéticos creados en `EXP-001` a `EXP-004` favorezcan artificialmente la estructura de los contratos $D$ y los kernels $K_D$.
* **Mitigación & Criterio de Falsación:** Inclusión de trazas de ejecución no curadas de agentes LLM heterogéneos ([TraceReader.ts](file:///home/valentin/code/takt-theory/benchmarks/scenarios/llm-traces/TraceReader.ts)) y comparación contra baselines agnósticos (POMDPRunner, Naive, Exhaustive).

### 1.2 Representatividad de Trazas de Agentes LLM
* **Riesgo:** Las trazas de agentes LLM con herramientas representan un subconjunto específico de dinámicas (discretas, no continuas, basadas en llamadas a APIs).
* **Frontera Declarada:** Los resultados obtenidos en trazas LLM no deben extrapolarse a control robótico continuo o sistemas físicos de alta frecuencia sin previa validación empírica independiente.

### 1.3 Dominios Excluidos Deliberadamente
* **Exclusión 1:** Procesos estocásticos continuos no acotados sin frontera decisional clara.
* **Exclusión 2:** Entornos competitivos de teoría de juegos estocásticos de $N$ jugadores sin contrato de gobernanza unificado.

---

## 2. Amenazas a la Validez Interna (Diseño Experimental)

### 2.1 Sensibilidad a la Elección del Contrato $D$
* **Riesgo:** Si el contrato de decisión $D$ es definido con excesiva holgura, el kernel $K_D$ colapsará trivialmente, inflando artificialmente la tasa de compresión. Si es demasiado estricto, la compresión será nula.
* **Criterio de Falsación:** Evaluar la métrica de compresión $S / K_D$ bajo variaciones paramétricas de la sensibilidad del contrato (Sweep de $\varepsilon$).

### 2.2 Dependencia del Generador de Estados Sintéticos
* **Riesgo:** El `StateSpaceGenerator` podría generar grafos de estados con simetrías no naturales que beneficien al algoritmo de colapso de kernels de TAKT.
* **Mitigación:** Variar aleatoriamente la topología del grafo (redes aleatorias Erdős–Rényi, grafos de escala libre Barabási–Albert y grafos en rejilla).

---

## 3. Amenazas a la Validez de Construcción (Métricas)

### 3.1 Elección de Métricas de Rendimiento
* **Riesgo:** Medir únicamente la latencia o la compresión de estados ignorando el overhead de mantenimiento del log de auditoría o la recalibración del contrato.
* **Mitigación:** Medida estricta del coste total E2E: latencia de decisión + latencia de verificación del puente de trazabilidad + memoria consumida por el estado de gobernanza.

---

## 4. Jerarquía Epistemológica de 4 Capas y Niveles de Replicación (R0-R3)

Para evitar la confusión entre distintos grados de certeza científica y madurez empírica, toda afirmación en la literatura o documentación de TAKT se adscribe a una de las siguientes 4 capas:

1. **Demostrado (Lean 4 Certified):** Afirmaciones matemáticas incondicionales formalizadas en código tipado y verificado mecánicamente por el compilador de Lean 4 (ej. `ST-015`, minimalidad de $S/K_D$).
2. **Medido (Benchmarks Empíricos):** Datos numéricos observados en ejecuciones controladas con protocolo declarativo, semillas deterministas y condiciones de falsación predefinidas.
3. **Interpretado (Discusión & Conjeturas):** Síntesis cualitativa, hipótesis de trabajo y generalizaciones conceptuales sobre el significado de los datos empíricos.
4. **Replicado (Grados de Validación Externa):**
   - **R0 – Replicación Interna:** Mismos autores, mismo código, distinta máquina o entorno.
   - **R1 – Replicación Independiente:** Terceros reproducen los resultados usando el mismo protocolo e implementación.
   - **R2 – Replicación Heterogénea:** Terceros re-implementan TAKT desde cero e independientemente, obteniendo resultados compatibles.
   - **R3 – Replicación Generalizada:** Múltiples grupos reproducen las garantías en dominios y aplicaciones completamente diferentes.

---

## 5. Esquema Estándar de Ficha de Protocolo de Benchmark

Todo experimento en la suite de `benchmarks/protocols/` debe estructurarse conforme al siguiente formato estándar:

- **Hipótesis ($H_1$):** Afirmación precisa sobre la ventaja o comportamiento del sistema.
- **Variables Independientes:** Parámetros controlados (ej. dimensión $k$, dimensión $|S|$, tasa de deriva $\theta$).
- **Variables Dependientes:** Métricas cuantificables (latencia por paso, memoria pico, regret decisional, EVSI).
- **Métricas & Baselines:** Matriz de comparación frente a paradigmas alternativos (`naive`, `static-rules`, `exhaustive`, `pomdp`).
- **Condición de Éxito:** Criterio cuantitativo que valida la hipótesis.
- **Condición de Falsación (a priori):** Umbral que refuta $H_1$ antes de interpretar los datos.
- **Amenazas Específicas a la Validez:** Sesgos conocidos del escenario o generador.
- **Semillas & Configuración:** Semillas enteras deterministas ($\sigma \in \mathbb{N}$) y JSON de configuración.
- **Comando de Reproducción:** Comando exacto CLI para ejecutar y exportar el dataset.

---

## 6. Principio de Aislamiento: Núcleo Teórico vs. Hipótesis Desechables

El marco de TAKT distingue estrictamente entre:

* **Núcleo Teórico (Invariable v1.0):** Axiomas, definiciones lógicas y teoremas demostrados. No cambia ante fallos experimentales aislados.
* **Hipótesis Experimentales (Desechables):** Predicciones concretas derivadas de la aplicación de TAKT a un dominio particular (ej. $H_1$).

Ante la refutación de una hipótesis experimental $H_1$, el protocolo exige investigar la cadena de supuestos antes de alterar la teoría:
1. ¿El dominio real satisface las hipótesis del modelo?
2. ¿La implementación del runtime o del benchmark respetó el contrato $D$?
3. ¿La métrica elegida mide el fenómeno correcto?
4. ¿Se ha identificado una frontera real de validez del modelo?

---

## 7. Amenazas Descubiertas tras la Ejecución de EXP-001

La primera campaña empírica de `EXP-001` reveló tres amenazas metodológicas adicionales que deben ser mapeadas en la fase de frontera (`EXP-001-Boundary`):

1. **Aislamiento de la Función de Coste ($C_{\text{total}} = C_{\text{setup}} + n \cdot C_{\text{decision}}$):**
   * *Riesgo:* Confundir el coste de construcción inicial del kernel $S / K_D$ con el coste por paso amortizado.
   * *Mitigación:* Desglosar expresamente $C_{\text{setup}}$ de $C_{\text{decision}}$ en mediciones con $n \to \infty$.

2. **Sensibilidad a la Densidad del Grafo y Dimensión $k$ Elevada ($k \ge 32$):**
   * *Riesgo:* Que en espacios de estado con alta conectividad o contratos con muchas capacidades el tiempo de construcción del kernel rivalice con la búsqueda exhaustiva.
   * *Mitigación:* Ejecución del protocolo de frontera `EXP-001-Boundary` en la cuadrícula E7–E9.

3. **No-Estacionalidad en Tiempo de Decisión:**
   * *Riesgo:* Asumir que la ventaja de $S / K_D$ se mantiene si el contrato de decisión $D$ varía durante los 100 pasos del escenario.
   * *Mitigación:* Evaluación en `EXP-004` (Drift Horizon) bajo mutación dinámica de $D$.

---

## 8. Sesgo de Muestreo Adaptativo (Adaptive Sampling Bias)

Al utilizar el explorador activo basado en EVSI ([boundary-explorer.ts](file:///home/valentin/code/takt-theory/benchmarks/atlas/boundary-explorer.ts)) para guiar la búsqueda de la frontera en el Atlas:

* **Riesgo:** Que el explorador sobre-muestree regiones de alta incertidumbre o sobre-optimice hacia fronteras preconcebidas, ignorando regiones del espacio de fases de apariencia homogénea que contengan anomalías no previstas.
* **Mitigaciones Exigidas:**
  1. **Cuota Mínima Uniforme Aleatoria:** Al menos el 20% de los puntos evaluados por el Atlas deben provenir de un muestreo uniforme aleatorio incontaminado por el algoritmo EVSI.
  2. **Audit Log de Selección de Muestras:** Registro explícito de los valores de prioridad EVSI calculados en cada iteración del explorador.
  3. **Baseline de Comparación Aleatorio:** Contrastar el mapa estimado $\hat{f}_1$ generado por EVSI contra una campaña de muestreo aleatorio directo de igual volumen.
