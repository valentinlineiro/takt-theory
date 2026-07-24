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

## 2. Taxonomía Pre-Registrada de Clasificación de Resultados (T-001)

Para evitar clasificaciones *a posteriori*, el resultado de cualquier intento en la Serie T se asigna obligatoriamente a una de las siguientes 4 categorías formales:

| Categoría de Resultado | Criterio Metodológico Objetivo | Tipo de Evidencia | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **Completed** | El protocolo se ejecutó íntegramente sin interacción con el autor y produjo datos reproducibles e interpretables. | Evidencia Favorable para Serie T | Registrar en `REPLICATION_LOG.md`. |
| **Inconclusive** | La ejecución no permite concluir por causas puramente externas (ej. limitaciones de sandbox/entorno del replicador). | Datos no concluyentes | Registrar en `REPLICATION_LOG.md` sin alterar la teoría ni el kit. |
| **Protocol Failure** | El protocolo no pudo completarse debido a ambigüedades, omisiones o defectos del propio kit. | **Evidencia de Falla de Transportabilidad (Serie T)** | Registrar fricción en `TACIT_AUDIT.md`. Diferir corrección a v1.3. |
| **Theory Falsification Candidate** | El protocolo se ejecutó correctamente y el kit funcionó, pero los datos observados contradicen las cotas teóricas de la Serie R. | **Candidato a Falsación Teórica (Serie R)** | Delimitar formalmente la frontera de invalidez del dominio. |

---

## 3. Código de Conducta del Custodio del Protocolo

A partir de la congelación v1.2-R2, el autor/asistente asume exclusivamente el rol de **Custodio del Protocolo**:

1. **Sin Explicaciones Orales:** Prohibido resolver o explicar fuera de banda lo que la documentación del kit omitió.
2. **Sin Reinterpretaciones:** Prohibido reclasificar la fricción o discrepancia del replicador como "error de uso".
3. **Sin Parches en Caliente:** Inmutabilidad absoluta del kit durante la campaña $T\text{-}001$.
4. **Igualdad de Rigor:** Éxitos y fracasos del protocolo se registran exactamente con el mismo nivel de detalle en `REPLICATION_LOG.md`.


---

## 3. Política de Congelación y Condición Explícita de Salida

* **Readiness Freeze Rule (Tras T-000B):** Tras completar la auditoría estática T-000B y aplicar el saneamiento del Kit v1.2-R2, **se prohíbe realizar cualquier modificación o parche en caliente al kit durante la ejecución de T-001**. Toda fricción o fallo detectado por un replicador se registrará estrictamente en `TACIT_AUDIT.md` sin modificar los archivos en curso.
* **Condición de Salida del Bloque:** La versión actual (v1.2-R2) permanecerá inmutable hasta completar un bloque de **$N=3$ réplicas independientes de la Serie T** (o un horizonte temporal de 6 meses).
* **Evaluación Conjunta:** Al alcanzar la condición de salida, se realizará un análisis agrupado de todas las entradas de `TACIT_AUDIT.md` y métricas de fricción.
* **Emisión de Versión (v1.3):** Se publicará una versión revisada del protocolo incorporando **únicamente** aquellas modificaciones justificadas por patrones empíricos observados en múltiples replicadores.

