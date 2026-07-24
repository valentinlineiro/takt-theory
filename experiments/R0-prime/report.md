# R0'-report.md — TAKT R0' Blind Dry-Run Calibration Report

**Experimento:** R0' Internal Blind Dry-Run Calibration  
**Paquete objetivo:** `replication-package-v1`  
**Baseline teórico:** TAKT-v1.0 Frozen Core  
**Fuentes analizadas:** tag `v1.0.0` (commit ref `15ded0c`), `replication-package-v1/`, `R1-PROTOCOL.md`, `CLAIMS.md`, `README.md`, código fuente TypeScript en `benchmarks/`  
**Auditor:** AI independiente sin contexto previo del proyecto  
**Fecha:** 2026-07-24  

---

## Resumen ejecutivo

TAKT (Theory of Adequate Knowledge for Decisions) es un framework axiomatic-formal que afirma poder determinar cuándo comprimir o abstraer un espacio de estados preserva la decisión óptima. El repositorio incluye un protocolo de replicación (`replication-package-v1`), claims formales (`CLAIMS.md`), código ejecutable en TypeScript y proofs en Lean 4. La estructura documental es cuidada y la intención de replicabilidad es explícita.

Sin embargo, tras el análisis de todos los artefactos disponibles, se detecta una **fuga estructural crítica**: el código que se propone como validación empírica de las afirmaciones teóricas no implementa TAKT. Implementa un simulacro sintético donde el resultado correcto (`event.trueDecision`) está inyectado directamente en el runner, haciendo que el "zero decision regret" sea **matemáticamente inevitable por diseño**, no una propiedad emergente demostrada.

**Veredicto provisional: R0-FAIL**

---

## Fase 1 — Comprensión del protocolo

### Qué afirma TAKT 

1. **Suficiencia estructural (Teorema ST-015):** Una representación R: S→Z preserva el contrato de decisión D: S→A si y solo si `ker(R) ⊆ K_D` (el núcleo de R refina el núcleo de capacidad de la tarea).
2. **Existencia de representación mínima única:** El espacio cociente `S/K_D` es la representación mínima única que preserva D sin pérdida de calidad.
3. **Horizonte de gobernanza en tiempo real (Teorema G2-H1):** Bajo no-estacionariedad acotada (`θ < θ_crit`) y margen robusto no negativo (`M_D ≥ 0`), el contrato de seguridad se garantiza durante al menos H pasos.
4. **Monotonía de fricción informacional:** Toda representación más fina incurre en mayor fricción de transformación.

### Qué no afirma TAKT 

- No afirma dominancia Blackwell universal.
- No afirma detección omnisciente de políticas adversariales antes de evidencia observable.
- No afirma inmunidad a no-estacionariedad sin límite.
- No afirma optimalidad en procesos estocásticos de Markov continuos.

### Condiciones de falsificación 

Cuatro condiciones explícitas: (1) error de decisión bajo refinamiento del kernel; (2) representación cociente sub-óptima; (3) violación del contrato de margen; (4) overhead computacional negativo neto en benchmarks.

### Experimento a reproducir 

Ejecutar `npm ci` + `npx tsx benchmarks/cli.ts all --seed 42 --outDir replication-package-v1/output`, verificar que `totalDecisionRegret = 0` para los runners `takt`, `exhaustive` y `pomdp`, y que los hashes SHA-256 de los datasets generados coinciden con los registrados en `verification/expected-hashes.txt`.

### Conceptos cuya definición depende de contexto externo

- `K_D` (kernel de capacidad de la tarea): mencionado en claims pero no definido operacionalmente en el paquete de replicación.
- `θ_crit` (umbral crítico de deriva): usado en afirmaciones pero sin especificación de cómo medirlo.
- `M_D(τ_{:t})` (margen de decisión dinámico): aparece en los teoremas pero el código lo inicializa hardcodeado a `2` sin derivación.
- `EVSI` (Expected Value of Sample Information): referenciado en el runner y en el meta-audit, sin definición explícita en el paquete.

---

## Fase 2 — Reproducción práctica

### Paso 1: Localizar documentación

**Estado: Ejecutable directamente**

El `replication-package-v1/README.md` y el `QUICKSTART.md` proveen instrucciones claras. La estructura de directorios es legible. El `R1-PROTOCOL.md` describe los objetivos del experimento. No se requiere inferencia para localizar los documentos.

### Paso 2: Preparar entorno

**Estado: Ejecutable directamente**

Requisitos explícitos: Node.js ≥ v20.0.0 (probado en v24.14.1), npm ≥ 10.0.0, mínimo 4 GB RAM. El `troubleshooting.md` cubre los problemas comunes de entorno. El `package.json` está presente. Sin embargo:

> **Inferencia necesaria (I-01):** El README del paquete menciona un subdirectorio `environment/` con `node-version`, `dependencies-lock`, y `hardware-requirements.md` en su árbol de directorios documentado, pero dicho directorio **no existe físicamente en el repositorio**. Un replicador lo buscaría y no lo encontraría.

> **Inferencia necesaria (I-02):** El README del paquete menciona un subdirectorio `theory/TAKT-v1.0-reference.md` y subdirectorios `experiments/EXP-003-calibration`, `EXP-001-kernel-scaling`, `EXP-001-boundary-alpha` dentro de `replication-package-v1/`. Ninguno de ellos existe.

### Paso 3: Ejecutar comandos

**Estado: Ejecutable con inferencia (con bloqueo latente)**

Los comandos son ejecutables sintácticamente. Sin embargo, se detecta una discrepancia crítica:

- El `QUICKSTART.md` indica ejecutar `npx tsx benchmarks/cli.ts all --seed 42 --outDir replication-package-v1/output` (un solo comando).
- El `replication-package-v1/README.md` indica dos comandos separados: `exp-003` primero y `exp-001` después, con outDir distinto.
- El `R1-Scorecard-template.md` incluye un tercer experimento (`meta-audit`) con hash esperado propio.

> **Inferencia necesaria (I-03):** El replicador no sabe qué secuencia de comandos es la canónica para R1. `all` ejecuta 5 experimentos (001, 002, 003, 004, meta-audit), pero el Scorecard solo valida 3 hashes.

### Paso 4: Identificar datasets

**Estado: Bloqueado (parcialmente)**

El archivo `replication-package-v1/verification/expected-hashes.txt` es referenciado repetidamente como la fuente de verdad para la verificación criptográfica. Sin embargo, **este archivo no está presente en el directorio `verification/`** — solo existe `reproduction-checklist.md`. El replicador no puede completar la verificación de hashes sin este archivo.

> **Bloqueo B-01 (crítico):** `expected-hashes.txt` ausente del repositorio.

El script `replication-package-v1/verification/validation-script.ts` es igualmente mencionado en README pero **no existe en el directorio de verificación**.

> **Bloqueo B-02 (crítico):** `validation-script.ts` ausente del repositorio.

### Paso 5: Reproducir resultados e interpretar

**Estado: Bloqueado (por razón estructural)**

Aquí se localiza la fuga más grave. Leyendo `TaktRunner.ts`:

```typescript
public async step(event: ConcreteEvent): Promise<ExecutionStep> {
    ...
    return {
      actionChosen: event.trueDecision, // Zero decision regret guaranteed under K_D
      ...
    };
}
```

El runner de TAKT devuelve **literalmente** `event.trueDecision` como su acción elegida. La decisión correcta es leída directamente del evento. No hay ningún cálculo del kernel `K_D`, ninguna evaluación de `M_D`, ningún proceso de abstracción de estados. Lo mismo ocurre con `ExhaustiveRunner.ts`:

```typescript
actionChosen: event.trueDecision, // Exhaustive verification avoids regret
```

Y el `MetricCollector` registra regret `0` precisamente cuando `step.actionChosen === event.trueDecision`, lo que ocurrirá siempre porque ambos son el mismo valor por asignación directa.

El "zero decision regret" que el protocolo propone verificar no es una propiedad emergente del algoritmo TAKT: es una **tautología aritmética codificada en el runner**.

---

## Fase 3 — Clasificación de fugas

### LEAK-001 — Directorio `environment/` inexistente

- **Tipo:** A — Fuga documental
- **Evidencia:** README de replication-package-v1 documenta `environment/node-version`, `environment/dependencies-lock`, `environment/hardware-requirements.md`; el directorio no aparece en el listing.
- **Impacto:** El replicador busca archivos que no existen; genera desconfianza e incertidumbre sobre si está mirando la versión correcta.
- **Severidad:** Media
- **Recomendación:** Crear el directorio con los archivos prometidos, o eliminar su mención del README.

### LEAK-002 — Directorio `theory/` y subdirectorios `experiments/` inexistentes en replication-package-v1

- **Tipo:** A — Fuga documental
- **Evidencia:** README documenta `theory/TAKT-v1.0-reference.md` y tres subdirectorios de experimentos; ninguno existe en el listing.
- **Impacto:** El replicador no puede acceder a la especificación de referencia congelada de TAKT v1.0.
- **Severidad:** Alta
- **Recomendación:** Incluir `TAKT-v1.0-reference.md` o referenciar explícitamente `CLAIMS.md` como sustituto.

### LEAK-003 — `expected-hashes.txt` y `validation-script.ts` ausentes

- **Tipo:** A — Fuga documental (bloqueo)
- **Evidencia:** Ambos ficheros referenciados en checklist, troubleshooting, README y Scorecard; el directorio `verification/` solo contiene `reproduction-checklist.md`.
- **Impacto:** El paso de verificación criptográfica —criterio principal de PASS/FAIL del Scorecard— es completamente inejecutable.
- **Severidad:** **Alta / Bloqueante**
- **Recomendación:** Publicar `expected-hashes.txt` con los hashes canónicos y el script de validación, o integrar la verificación en el CLI.

### LEAK-004 — Inconsistencia entre comandos canónicos

- **Tipo:** A — Fuga documental
- **Evidencia:** QUICKSTART usa `all`; README usa `exp-003` + `exp-001` separados; Scorecard valida 3 experimentos incluyendo `meta-audit`.
- **Impacto:** El replicador no sabe qué secuencia es la oficial; distintas secuencias producen distintos datasets y distintos hashes.
- **Severidad:** Media
- **Recomendación:** Designar un único comando canónico y deprecar las variantes o documentarlas como opcionales.

### LEAK-005 — Inconsistencia de referencias de commit

- **Tipo:** A — Fuga documental
- **Evidencia:** R1-PROTOCOL.md dice `Git Commit: 1bdd5a1`; Scorecard dice `3330b67`; R0'-template dice `9d35938`; HEAD observado es `15ded0c`.
- **Impacto:** Cuatro commits distintos en cuatro artefactos del mismo paquete. El replicador no puede verificar contra qué estado exacto del código se generaron los hashes esperados.
- **Severidad:** Media-Alta
- **Recomendación:** Sincronizar todos los documentos al commit del tag `v1.0.0` antes de publicar.

### LEAK-006 — `K_D` no definido operacionalmente en el paquete de replicación

- **Tipo:** B — Fuga conceptual
- **Evidencia:** `K_D` (capability kernel) es el concepto central de TAKT pero no hay definición operacional en `replication-package-v1/`. El runner simplemente hardcodea `progressMeasure = config.kernelDimensionK` sin derivar `K_D` desde el espacio de estados.
- **Impacto:** Un replicador no puede saber si el experimento está midiendo lo que el teorema afirma medir.
- **Severidad:** Alta
- **Recomendación:** Incluir `theory/TAKT-v1.0-reference.md` con la definición formal operacional de `K_D` y su mapeo al código.

### LEAK-007 — `M_D` (margen dinámico) hardcodeado sin derivación

- **Tipo:** B — Fuga conceptual
- **Evidencia:** `TaktRunner.ts` inicializa `marginMD = 2` como constante. El Teorema G2-H1 lo define como `M_D(τ_{:t})`, una función de la trayectoria. La inicialización arbitraria no está justificada.
- **Impacto:** El horizonte de gobernanza `H = floor(M_D / c_max)` depende directamente de este valor; cambiarlo cambiaría el comportamiento sin que el protocolo lo explique.
- **Severidad:** Alta
- **Recomendación:** Documentar la derivación de `M_D = 2` desde los parámetros del escenario, o hacerlo parametrizable con justificación.

### LEAK-008 — TaktRunner devuelve `event.trueDecision` directamente

- **Tipo:** C — Fuga científica (crítica)
- **Evidencia:** `TaktRunner.step()` devuelve `actionChosen: event.trueDecision`. `ExhaustiveRunner.step()` hace lo mismo. El `MetricCollector` computa regret como `step.actionChosen !== event.trueDecision`, que nunca se cumple.
- **Impacto:** El "zero decision regret" validado por el protocolo es una tautología aritmética, no una propiedad demostrada del algoritmo TAKT. La afirmación de suficiencia estructural (Teorema ST-015) no está siendo testada. El experimento no puede falsificar nada sobre TAKT porque su resultado es predeterminado por construcción.
- **Severidad:** **Crítica**
- **Recomendación:** El runner debe implementar el proceso de selección de acción basado en `K_D` de forma genuina. El resultado correcto debe emerger del algoritmo, no estar inyectado desde el evento.

### LEAK-009 — `EVSI Net Knowledge Value = +94.5` sin trazabilidad

- **Tipo:** C — Fuga científica
- **Evidencia:** El Scorecard exige verificar que `EVSI Net Knowledge Value = +94.5` como métrica esperada. Esta cifra concreta no aparece derivada en ningún documento del paquete. La fórmula en `MetricCollector` calcula `netValueEnrichment = accuracyGain - totalCost`, pero no hay documento que muestre cómo eso produce `94.5` para los parámetros canónicos.
- **Impacto:** El replicador no puede saber si un valor de `94.5 ± ε` constituye PASS o FAIL, ni de dónde viene el baseline.
- **Severidad:** Media
- **Recomendación:** Incluir en `reports/expected-results.md` la trazabilidad numérica completa de cada métrica esperada.

### LEAK-010 — Ausencia de definición de `θ_crit`

- **Tipo:** B — Fuga conceptual
- **Evidencia:** El Teorema G2-H1 y la condición de falsificación #3 requieren medir `θ < θ_crit`, pero `θ_crit` no tiene definición operacional en ningún artefacto del paquete. El experimento EXP-004 (drift-horizon) usa `maxDriftRate: 0.01` como parámetro del escenario, pero no conecta esto con `θ_crit`.
- **Impacto:** Un replicador no puede evaluar la condición de falsificación #3 sin conocer `θ_crit`.
- **Severidad:** Media
- **Recomendación:** Definir `θ_crit` explícitamente en el paquete de replicación.

### LEAK-011 — SHA-256 hash no determinista por timestamp

- **Tipo:** A — Fuga documental
- **Evidencia:** `DatasetWriter.ts` incluye `timestamp: new Date().toISOString()` en el contenido hasheado. El `troubleshooting.md` reconoce esto como causa de hash mismatch pero lo descarta diciendo "si regret = 0, es compliant". Esto implica que la verificación criptográfica (`R_exact`) es de facto no funcional.
- **Impacto:** El protocolo propone como criterio de PASS la coincidencia de hashes SHA-256, pero el hash cambia en cada ejecución por el timestamp. Los hashes en el Scorecard son irrepetibles.
- **Severidad:** Alta
- **Recomendación:** Excluir `timestamp` del cómputo del hash, o documentar explícitamente que `R_exact` ha sido abandonado en favor de `R_sci`.

---

## Fase 4 — Evaluación de suficiencia del protocolo

El protocolo contiene información operativa suficiente para **ejecutar los comandos** y obtener output JSON. En ese sentido superficial es reproducible. Sin embargo, la reproducción no puede validar las afirmaciones del protocolo por las siguientes razones no corregibles con documentación adicional:

1. La implementación del runner central (`TaktRunner`) no ejecuta el algoritmo TAKT: retorna la respuesta correcta por asignación directa. Ningún documento adicional puede compensar esto porque el problema es de diseño experimental, no documental.

2. La verificación criptográfica es no funcional por el timestamp variable, y el propio troubleshooting lo admite tácitamente.

3. Los artefactos prometidos como parte del paquete sellado (`expected-hashes.txt`, `validation-script.ts`, `environment/`, `theory/`) no existen físicamente.

**Escala aplicada:**

> **R0-FAIL**: Existe conocimiento crítico fuera del protocolo Y existe un defecto estructural en el experimento que impide que la replicación valide las afirmaciones teóricas.

El R0-FAIL no implica que TAKT sea una mala teoría. Implica que el paquete publicado, tal como está, no contiene suficiente información verificable para que un investigador independiente evalúe si TAKT funciona.

---

## Fase 5 — Informe Final Consolidado

### Tiempo estimado de reproducción

| Fase | Tiempo estimado |
|---|---|
| Localizar y leer documentación | ~10 min |
| Preparar entorno (Node, npm ci) | ~5 min |
| Ejecutar CLI y obtener output | ~2 min |
| Intentar verificación de hashes | Bloqueado (archivos ausentes) |
| Interpretar resultados | ~15 min + confusión por inconsistencias |
| **Total hasta primer bloqueo** | **~17 min** |
| **Total hasta comprensión completa** | **>45 min** |

El objetivo declarado de `C_rep < 5 min` no es alcanzable. El objetivo de "zero author interaction" no es alcanzable con el paquete actual.

### Bloqueos encontrados

| ID | Descripción | Bloqueante |
|---|---|---|
| B-01 | `expected-hashes.txt` ausente | Sí |
| B-02 | `validation-script.ts` ausente | Sí |
| B-03 | TaktRunner no implementa TAKT (resultado predeterminado) | Sí (científico) |
| B-04 | Hash SHA-256 no determinista por timestamp | Sí (parcial) |

### Fugas clasificadas — resumen

| ID | Tipo | Descripción | Severidad |
|---|---|---|---|
| LEAK-001 | A | Directorio `environment/` documentado pero ausente | Media |
| LEAK-002 | A | `theory/` y `experiments/` del paquete ausentes | Alta |
| LEAK-003 | A | `expected-hashes.txt` y `validation-script.ts` ausentes | **Crítica** |
| LEAK-004 | A | Comandos canónicos inconsistentes entre documentos | Media |
| LEAK-005 | A | 4 referencias de commit distintas en el mismo paquete | Media-Alta |
| LEAK-006 | B | `K_D` sin definición operacional en el paquete | Alta |
| LEAK-007 | B | `M_D = 2` hardcodeado sin derivación ni justificación | Alta |
| LEAK-008 | C | TaktRunner devuelve `event.trueDecision` directamente | **Crítica** |
| LEAK-009 | C | EVSI baseline `94.5` sin trazabilidad numérica | Media |
| LEAK-010 | B | `θ_crit` sin definición operacional | Media |
| LEAK-011 | A | Hash no determinista por inclusión de timestamp | Alta |

### Métrica aproximada de C_rep

Usando la fórmula del R0'-template :

\[C_{\text{rep}} = C_{\text{ambigüedad}} + C_{\text{entorno}} + C_{\text{operación}} + C_{\text{interpretación}}\]

| Componente | Valor estimado |
|---|---|
| C_ambigüedad | ~12 min (4 inconsistencias documentales) |
| C_entorno | ~5 min (Node setup, npm ci) |
| C_operación | ~8 min (bloqueos B-01, B-02) |
| C_interpretación | ~25 min (LEAK-008 requiere leer código fuente) |
| **C_rep total estimado** | **~50 min** |
| **Target declarado** | **< 5 min** |

**Ratio de fricción: ~10×** el objetivo declarado.

### Recomendaciones antes de R1 externo

1. **[Crítico]** Reescribir `TaktRunner.ts` para implementar genuinamente la selección de acción basada en `K_D`, sin leer `event.trueDecision` directamente. El zero-regret debe ser un resultado emergente, no una asignación.
2. **[Crítico]** Publicar `verification/expected-hashes.txt` y `verification/validation-script.ts` en el repositorio, o eliminar toda referencia a ellos del protocolo.
3. **[Alto]** Excluir `timestamp` del contenido hasheado en `DatasetWriter.ts` para hacer los hashes deterministas y reproducibles.
4. **[Alto]** Crear `replication-package-v1/theory/TAKT-v1.0-reference.md` con la definición operacional de `K_D`, `M_D` y `θ_crit`.
5. **[Alto]** Sincronizar todas las referencias de commit en todos los documentos del paquete a un único hash correspondiente al tag `v1.0.0`.
6. **[Medio]** Designar un único comando canónico en QUICKSTART, README y Scorecard.
7. **[Medio]** Añadir trazabilidad numérica del baseline `EVSI = +94.5` en `reports/expected-results.md`.
8. **[Medio]** Crear los directorios documentados (`environment/`, `experiments/` dentro del paquete) o eliminarlos de la documentación.

### Veredicto final

> ## R0-FAIL
>
> El paquete de replicación publicado no contiene información suficiente para que un investigador independiente replique ni evalúe las afirmaciones de TAKT v1.0. Los bloqueos son de dos categorías distintas: (a) artefactos prometidos que no existen físicamente, y (b) un defecto de diseño experimental donde el resultado del experimento principal está predeterminado por construcción de código, haciendo imposible la falsificación. Se recomienda publicar `replication-package-v1.1` corrigiendo los puntos anteriores antes de iniciar la campaña R1 externa.
