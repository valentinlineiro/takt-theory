# T_SERIES_PREREGISTRATION.md: Pre-Registración de la Serie T (Transportabilidad)

**Fecha de Registro:** 2026-07-24  
**Estado:** Pre-registrado (Inmutable antes de la ejecución de T-001)  
**Propósito:** Pre-determinar los criterios científicos de éxito, fracaso y las reglas metodológicas para evaluar la transportabilidad del protocolo TAKT antes de observar los resultados de replicadores independientes.

---

## 1. Experimentos Pre-Registrados

### T-001: First Independent Replication
* **Diseño:** Un único investigador independiente (Nivel 3) implementa un adaptador para un dominio no probado originalmente sin interacción directa con el autor.
* **Variable Primaria ($V_1$):** Ejecutabilidad del protocolo ($V_1 \in \{ \text{COMPLETED}, \text{ABORTED}, \text{AUTHOR\_INTERVENTION\_REQUIRED} \}$).
* **Criterio de Éxito de T-001:** $V_1 = \text{COMPLETED}$ con $N_{consults} = 0$.
* **Criterio de Fracaso de T-001:** Imposibilidad de completar el adaptador o la ejecución de trazas sin soporte directo del autor original.

---

### T-002: Multi-Replicator Study
* **Diseño:** Tres o más investigadores independientes en dominios diferenciados.
* **Variables Secundarias:**
  * Distribución del tiempo hasta el primer test válido ($T_{first\_exp}$).
  * Distribución del número de supuestos asumidos ($N_{assumptions}$).
  * Distribución del número de errores atrapados autónomamente ($N_{self\_check\_err}$).
* **Criterio de Éxito de T-002:** La media de $N_{consults} = 0$ y $T_{first\_exp} < 8$ horas a través de la muestra de replicadores.

---

### T-003: Public Replication
* **Diseño:** Adopción espontánea a partir de la documentación pública publicada (Nivel 4).
* **Criterio de Éxito de T-003:** Al menos un informe entregado por un equipo externo sin contacto previo.

---

### T-004: Adversarial Stress Test
* **Diseño:** Red-teaming metodológico conducido por investigadores externos motivados explícitamente para encontrar límites de invalidez, fugas de oráculo o contraejemplos.
* **Criterio de Éxito de T-004:** Identificación precisa y transparente de las fronteras de validez del protocolo (caracterización de dominios donde TAKT no aplica).

---

## 2. Matriz Tripartita de Resultados (Evaluación de T-001)

El resultado de T-001 o cualquier réplica de la Serie T **nunca se reduce a un juicio binario de éxito/fracaso**, sino que se clasifica explícitamente en tres escenarios con significado epistemológico diferenciado:

| Escenario de Resultado | Significado Metodológico | Tipo de Evidencia Generada | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **1. El replicador no puede ejecutar el protocolo** | Fallo en la transportabilidad del kit o conocimiento tácito no resuelto. | **Evidencia sobre el Protocolo (Serie T)** | Registrar fricción en `TACIT_AUDIT.md`. No altera la teoría $H_{rep}$. |
| **2. El protocolo se ejecuta, pero contradice la hipótesis** | El kit funcionó correctamente, pero las trazas violan las cotas teóricas $\varepsilon$ o $R_2$. | **Evidencia sobre la Teoría (Serie R)** | Falsación empírica o acotamiento de fronteras de validez de la teoría. |
| **3. El protocolo se ejecuta y reproduce el patrón esperado** | El kit fue autocontenido y los datos corroboran las cotas de convergencia. | **Evidencia favorable para Serie T y Serie R** | Registro formal de éxito en transportabilidad y validez de dominio. |

---

## 3. Política de Congelación y Condición Explícita de Salida

La congelación observacional del protocolo no es un dogma, sino una política experimental regulada por criterios de salida objetivos:

* **Condición de Salida del Bloque:** La versión actual (v1.2-R2) permanecerá congelada hasta completar un bloque de **$N=3$ réplicas independientes de la Serie T** (o un horizonte temporal de 6 meses).
* **Evaluación Conjunta:** Al alcanzar la condición de salida, se realizará un análisis agrupado de todas las entradas de `TACIT_AUDIT.md` y métricas de fricción.
* **Emisión de Versión (v1.3):** Se publicará una versión revisada del protocolo incorporando **únicamente** aquellas modificaciones justificadas por patrones empíricos observados en múltiples replicadores.
