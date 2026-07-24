# T-AI-004: Matriz de Verificación y Evaluación de Observaciones Estáticas

**Identificador:** T-AI-004  
**Evaluador:** Perplexity Sonar 2  
**Fecha:** 2026-07-24  
**Modalidad:** Inspección Estática (Sin entorno de ejecución de terminal)  
**Perfil de Sensibilidad:** Sensibilidad alta a navegación documental estática y comparación de texto, con propensión a falsos positivos por falta de ejecución dinámica.

---

## 1. Matriz de Observaciones y Clasificación de Validez

| ID | Observación Estática | Clasificación Metodológica | Verificación en Código / Repositorio | Acción Ejecutada |
| :--- | :--- | :--- | :--- | :--- |
| **TAI-004-01** | **Discrepancia 99.2 vs 199.2 en EXP-003** | **Defecto Real (Doc Drift)** | `EXP-003-seed-42.json` tiene 200 pasos ($200 - 0.8 = 199.2$), mientras `expected-results.md` listaba `99.2`. | **Corregido:** Actualizado `expected-results.md` a `+199.2`. |
| **TAI-004-02** | **Paso 3 Divergente en QUICKSTART vs README** | **Fricción Documental Real** | `QUICKSTART.md` guiaba a scorecard manual y `README.md` a `validation-script.ts`. | **Corregido:** Unificado el paso 3 hacia `validation-script.ts` en ambos documentos. |
| **TAI-004-03** | **Coexistencia de v1.0, v1.1, v1.2-R2** | **Trazabilidad Histórica** | Los identificadores reflejan la evolución de versiones registrada en `REPLICATION_LOG.md`. | **Clarificado:** Añadido encabezado explicativo de evolución de versiones. |
| **TAI-004-04** | **"Repositorio Privado"** | **Falso Positivo** | Confundió el campo `"private": true` de `package.json` (regla npm para evitar publicación accidental) con la privacidad del repo en GitHub. | **Descartado / Explicado.** |
| **TAI-004-05** | **"Validación Tautológica por Archivos Pre-Cometidos"** | **Especulación Sin Ejecución** | El script lee los outputs recién generados por `cli.ts`. Gemini 3.6 Flash demostró que re-generar los archivos valida correctamente los hashes. | **Descartado / Explicado.** |

---

## 2. Resumen del Análisis de Muestreo (T-AI-001 a T-AI-004)

La muestra de 4 observadores independientes confirma la **taxonomía de sensibilidad estocástica de agentes de IA**:

1. **Gemini 3.6 Flash (`T-AI-002`, Dinámico profundo):** Detectó bugs de código runtime (`gitCommit` en payload hash, typos TypeScript).
2. **Claude Sonnet (`T-AI-003`, Dinámico / Gobernanza):** Detectó stubs de kit no implementados (`verify_adapter.py`) y desalineación de hashes en plantillas.
3. **Perplexity Sonar 2 (`T-AI-004`, Estático puro):** Detectó discrepancias numéricas documentales ($199.2$ vs $99.2$) e inconsistencias de texto en guías, pero produjo falsos positivos interpretativos por falta de capacidad de ejecución.
