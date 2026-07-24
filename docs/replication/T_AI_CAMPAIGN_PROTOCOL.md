# T-AI Campaign Protocol: Protocolo de Muestreo de Transportabilidad para Agentes de IA

**Versión:** 1.0  
**Estado:** Pre-registrado / Inmutable  
**Objetivo:** Medir cuantitativa y cualitativamente el grado de autocontención documental y transportabilidad estática de TAKT frente a una muestra diversa de modelos/agentes de IA independientes.

---

## 1. Diseño Experimental del Muestreo

Los modelos de IA (Perplexity, Claude, Gemini, ChatGPT, DeepSeek, Grok) se tratan formalmente como **instrumentos de muestreo independientes**. 

* **Pregunta de Investigación:** *¿Existe una distribución convergente de fricciones y ambigüedades documentales al exponer el repositorio a evaluadores autónomos heterogéneos sin contexto previo?*
* **Unidad de Análisis:** La **distribución de fricciones observables** ($\Delta_{doc}$, $N_{assumptions}$, bloqueos), no la opinión subjetiva individual de un único modelo.

---

## 2. Reglas de Aislamiento y No-Intervención

1. **Aislamiento de Contexto:** Cada modelo inicia la evaluación en un hilo/sesión completamente limpio, recibiendo **únicamente** la URL del repositorio público.
2. **Sin Inyección de Antecedentes:** Prohibido proporcionar informes anteriores (`REV-001`), bitácoras de supuestos (`TACIT_AUDIT.md`) o debates metodológicos pasados.
3. **Cero Aclaraciones (No-Hint Rule):** Si un modelo solicita aclaraciones durante su evaluación, la respuesta estandarizada será:
   > *"No puedo proporcionar información adicional. Limítate a la información contenida en el repositorio público."*
4. **Preservación Literal:** Los informes emitidos por cada evaluador se guardan en `docs/replication/ai/T-AI-XXX/` en su formato original íntegro, sin edición ni resumen retrospectivo.

---

## 3. Estructura de Almacenamiento

```text
docs/replication/ai/
├── T-AI-001/           # Evaluador 1 (ej. Perplexity / Auditor)
│   ├── raw_report.md
│   └── scorecard.json
├── T-AI-002/           # Evaluador 2 (ej. Claude 3.5 Sonnet)
│   ├── raw_report.md
│   └── scorecard.json
├── T-AI-003/           # Evaluador 3 (ej. Gemini 1.5 Pro)
│   ├── raw_report.md
│   └── scorecard.json
└── T-AI-004/           # Evaluador 4 (ej. GPT-4o)
    ├── raw_report.md
    └── scorecard.json
```

---

## 4. Matriz de Extracción y Meta-Análisis Agregado

Una vez completadas todas las corridas de la muestra, se consolida la siguiente matriz cuantitativa sin reinterpretar los datos individuales:

| Evaluador IA | Nivel Indep. | Clasificación Final | $N_{assumptions}$ | $N_{consults\_req}$ | Bloqueo Crítico | Fricción Principal Identificada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T-AI-001** | Nivel 3 | *Classification* | $N_1$ | $N_2$ | *Si / No* | [Resumen del hallazgo] |
| **T-AI-002** | Nivel 3 | *Classification* | $N_1$ | $N_2$ | *Si / No* | [Resumen del hallazgo] |
| **T-AI-003** | Nivel 3 | *Classification* | $N_1$ | $N_2$ | *Si / No* | [Resumen del hallazgo] |
| **T-AI-004** | Nivel 3 | *Classification* | $N_1$ | $N_2$ | *Si / No* | [Resumen del hallazgo] |

### Preguntas de Meta-Análisis:
* **Fricciones Universales:** ¿Qué ambigüedades documentales fueron detectadas por el 100% de la muestra?
* **Sesgos Específicos del Modelo:** ¿Qué fricciones aparecieron en un solo modelo debido a limitaciones de su sandbox o ventana de contexto?
* **Defectos Reproducibles del Protocolo:** Si múltiples agentes coinciden en `Protocol Failure` por la misma causa, el resultado certifica un defecto objetivo del paquete (no del observador).

---

## 5. Criterio de Éxito de la Campaña T-AI

El éxito de la campaña T-AI se define formalmente como:

> **Obtener una distribución estandarizada de observaciones independientes que permita estimar empíricamente la tasa de autocontención y transportabilidad documental de TAKT frente a agentes autónomos.**
