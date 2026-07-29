# TAKT Post-Consolidation Roadmap & Priorities (2026)

**Fecha de Actualización:** 2026-07-29  
**Estado de la Plataforma:** Plataforma de Evidencia Experimental Consolidada  
**Principio Rector:** *Investigar usando TAKT para descubrir qué merece ser construido (de "building the lab" a "using the lab")*  
**Principio Epistemológico:** *La infraestructura es estable; el conocimiento es revisable.*  

---

## 1. Cadena de Dependencias Post-Consolidación

```mermaid
graph TD
    Fase0[Fase 0: Consolidación ✓] --> Fase1[Fase 1: Difusión Científica ST-016]
    Fase1 --> Fase2[Fase 2: Programa Experimental BENCHMARK-002+]
    Fase2 --> Fase3[Fase 3: Evidence Sets & Agregación]
    Fase3 --> Fase4[Fase 4: Multi-runtime Interoperabilidad]
    Fase4 --> Fase5[Fase 5: Nueva Línea Teórica ST-018]
    
    style Fase0 fill:#1b4332,stroke:#fff,color:#fff
    style Fase1 fill:#2d5a88,stroke:#fff,color:#fff
---

## 1.1 El Modelo Arquitectónico Tricapa (Tri-Layer Model)

Conceptualmente, toda la plataforma TAKT se condensa en tres capas con responsabilidades y respuestas unívocas:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. KNOWLEDGE LAYER (Conocimiento / "¿Qué significa?")                      │
│    └─ takt-theory, Lean 4 proofs, ST-016/ST-017, CLAIMS.md                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. EVIDENCE LAYER (Evidencia / "¿Qué ocurrió?")                             │
│    └─ Runtime Engine, EventBus (Object.freeze), ExperimentArtifact (v1),    │
│       ArtifactReader, Benchmarks reproducibles                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. GOVERNANCE LAYER (Gobernanza / "¿Qué reglas nos disciplinan?")           │
│    └─ OPERATIONAL_ROADMAP.md, Pre-registro (5 puntos), 4 Estados Ciclo Vida │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. El Modelo de Doble Bucle (Dual-Loop Execution Model)

El programa se estructura formalmente en dos bucles desacoplados con ritmos independientes:

```text
       SCIENTIFIC LOOP (Bucle Científico)           PLATFORM LOOP (Bucle de Plataforma)
  Pregunta Científica (Pre-registro)                   Necesidad Experimental
                 │                                                │
                 ▼                                                ▼
         BENCHMARK-00X                              Refactor / Cambio en Engine
                 │                                                │
                 ▼                                                ▼
       ExperimentArtifact (v1)                      Validación & Retrocompatibilidad
                 │                                                │
                 ▼                                                ▼
        Conclusión / Reporte                        Re-ejecución del Benchmark
```

* **El Bucle de Plataforma sirve exclusivamente al Bucle Científico**: No se realizarán cambios de software ni adiciones de infraestructura a menos que una pregunta de investigación preregistrada no pueda responderse con las capacidades actuales del runtime.

---

## 3. Jerarquía Estructural de Dependencias

Las dependencias fluyen estrictamente de arriba hacia abajo:

```text
Scientific Questions (Preguntas de Investigación)
        │
        ▼
Scientific Assets (ST-016, ST-017, CLAIMS, Benchmarks)
        │
        ▼
Platform Infrastructure (Runtime, EventBus, ExperimentArtifact, ArtifactReader)
        │
        ▼
Implementation Details (Refactors, optimizaciones internas)
```

### Regla de Gobernanza de Cambios (Filtro Activo)
Antes de aceptar o ejecutar cualquier propuesta de modificación de código o refactorización del runtime, se debe responder positivamente a la siguiente pregunta:

> **"¿Qué pregunta científica preregistrada justifica este cambio?"**

Si el cambio no está directamente motivado por la necesidad de responder a una hipótesis de investigación preregistrada, el cambio se diferirá fuera del roadmap activo.

---

## 3. Definición Detallada de las Fases

### Fase 0 — Consolidación de Plataforma (CERRADA ✓)
* **Estado:** ST-016 congelado v1.0.0, ST-017 Phase III.1 sellada en Lean 4 (`0 sorry`), `CertifiedRuntimePipeline` integrado con `GovernanceEventBus` (eventos inmutables), `ExperimentArtifact` (schema v1) y `ArtifactReader` con test de retrocompatibilidad, **BENCHMARK-001** verificado de punta a punta.

### Fase 1 — Difusión Científica de ST-016 (Prioridad Actual #1)
* **Objetivo:** Difusión internacional del estándar congelado de necesidad del kernel (ST-016 v1.0.0 / DOI: `10.5281/zenodo.21638014`).
* **Hitos Clave:**
  1. Seguimiento de solicitudes de endorsement para arXiv (`cs.LO` / `cs.PL` / `cs.SE`).
  2. Empaquetado final de reproducibilidad en `publication/` (`abstract.md`, `citation.bib`, `reproducibility.md`).

### Fase 2 — Programa Experimental Real (Prioridad Actual #2)
* **Objetivo:** Responder preguntas científicas empíricas utilizando el runtime instrumentado y el marco de pre-registro de 5 puntos.
* **Próximos Benchmarks:**
  * **BENCHMARK-002 (Coste Observacional & Escalado):** Evaluar escalado de latencia y `observationCost` frente a la dimensión $|S|$.
  * **BENCHMARK-003 (Horizonte Temporal & Recalibración):** Evaluar la deriva temporal y frecuencia de recalibración ($H$).

### Fase 3 — Evidence Sets (Aparición por Necesidad)
* **Objetivo:** Agrupar múltiples `ExperimentArtifact` (schema v1) para respaldar afirmaciones científicas compuestas cuando un único benchmark sea insuficiente.

### Fase 4 — Multi-Runtime (Demandado por Evidencia)
* **Objetivo:** Extender la generación de `ExperimentArtifact` (schema v1) a runtimes heterogéneos (`takt-rust`, `takt-python`).

### Fase 5 — Próxima Línea Teórica ST-018 (Anomalías o Límite Empírico)
* **Objetivo:** Formular ST-018 únicamente cuando la evidencia experimental o una anomalía empírica desafíe las predicciones de los modelos actuales.

---

## 4. Orden de Prioridad Operativa (5 Reglas de Ejecución)

| Prioridad | Acción / Dominio | Criterio de Ejecución | Estado |
| :--- | :--- | :--- | :--- |
| **1. Difusión ST-016** | Desbloquear difusión externa | Seguimiento de endorsement arXiv (`cs.LO`/`cs.PL`/`cs.SE`) y paquete en `publication/REPRODUCIBILITY.md`. | **Cuello de Botella Externo (Prioridad #1)** |
| **2. Investigación Empírica** | Programa de Benchmarks | Ejecutar `BENCHMARK-002` (escalado $|S|$) y `BENCHMARK-003` (horizonte $H$) bajo Ficha de Pre-Registro de 5 Puntos. | **Activo (Prioridad #2)** |
| **3. Conocimiento `CLAIMS.md`** | Actualización del Registro | Modificar el estado de afirmaciones únicamente cuando exista evidencia `ExperimentArtifact` (v1) reproducible. | **Por Evidencia** |
| **4. Estabilidad del Runtime** | Mantenimiento del Engine | Modificar el runtime solo cuando un benchmark preregistrado revele una limitación técnica o metodológica. | **En Standby** |
| **5. Difusión de Resultados** | Canales Públicos | Publicar en arXiv, GitHub Release y LinkedIn conforme se consoliden nuevos claims experimentales. | **Al Hito** |

---

## 5. Directivas de Exclusión (Lo que NO se priorizará)

1. **Sin Generalización Prematura:** No extender TAKT a dominios teóricos no requeridos sin necesidad observada.
2. **Sin Capas Teóricas Adicionales:** No añadir nuevos constructos formales a menos que respondan a fallos del runtime en casos reales.
3. **Sin Optimización Prematura:** No optimizar rendimiento de código antes de obtener métricas de uso real continuado.
