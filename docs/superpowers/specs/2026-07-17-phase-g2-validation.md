# Phase G2 — Uncertainty Governance Validation (Closing)

**Status:** Closed — PASS
**Repository reference:** `06c1272`–`65aa612` (G2 implementation + review fixes + results script)
**Depends on:** `docs/superpowers/specs/2026-07-17-phase-g2-uncertainty-governance-design.md` (design), Phase G1 (`docs/superpowers/specs/2026-07-17-phase-g1-validation.md`)

---

## Pregunta de validación

> ¿El contrato dinámico C_v4 sobrevive a la incertidumbre epistémica sobre el modelo de transición — no solo a su llegada incremental (G1), sino a no conocerlo exactamente?

La respuesta empírica, a partir de los cuatro batches de validación, es: **sí, bajo las condiciones explícitamente establecidas** (sa-rectangularidad, L1, `P* ∈ U_t`) — y el sistema no solo se sostiene, sino que sabe cuándo esas condiciones dejan de cumplirse.

---

## Resultados y su lectura científica

### G2-001 — El invariante de seguridad es de ajuste exacto (tightness), no solo conservador

El resultado no es simplemente `M_D^safe ≤ M_D(P*)`. Al construir el caso adversario donde `P*` se ubica exactamente en el borde de `U_t` (`P* ∈ ∂U_t`), se obtiene:

```
M_D(P*)  = 1.139434283188365
M_D_safe = 1.139434283188365   (idéntico, no solo ≤)
```

Esto es un resultado de **tightness**: el margen robusto no es una cota laxa — es exacto sobre el modelo admisible más adversarial. Eso es una garantía considerablemente más fuerte que "conservador".

### G2-002 — La gobernanza anula la confianza numérica

Sin el monitor de validez, la secuencia sería: evidencia → ε se contrae → margen grande → el sistema continúa. Con G2:

```
M_D_safe = 3.1619  (> umbral 1.0, "parece seguro")
     +
drift = 1.4417 (≫ τ = 0.3)
     ↓
RECALIBRATE
```

El margen por sí solo insiste en que todo está bien. El sistema lo anula de todos modos. Esto demuestra que el margen es **deliberadamente insuficiente** como única señal — la gobernanza razona sobre dos cosas distintas: seguridad de la trayectoria y validez del modelo. Esa separación es precisamente el objetivo de diseño de G2, no un efecto secundario.

### G2-003 — El límite de aplicabilidad es parte del contrato, no un defecto oculto

```
ε(observado)   = 0.03  →  M_D = 2.73
ε(no observado) = 0.6  →  M_D = 1.20
gap = 1.53
```

Dos pares con el mismo riesgo verdadero reciben tratamiento distinto porque la sa-rectangularidad no modela correlación entre ellos. La decisión de diseño aquí no fue "arreglar" esto — fue caracterizarlo (L-G2-001) y dejarlo como frontera declarada. Eso es más saludable que ocultar la limitación: convierte el límite en parte de lo que el contrato promete, en vez de una debilidad accidental que un lector futuro descubre por sorpresa.

### G2-004 — El ciclo de vida completo de la incertidumbre

```
incertidumbre previa → confianza crece → el entorno cambia →
validez se pierde → RECALIBRATE → confianza se reconstruye →
gobernanza normal se reanuda
```

Numéricamente: `ε` se contrae a `0.019` bajo el régimen seguro; el cambio de régimen produce `drift=1.137 ≫ τ`; `RECALIBRATE` restaura `ε=0.6` de inmediato; tras 200 observaciones frescas post-recuperación, `M_D_safe=0.865 < 1.0` → `INTERVENE`, correctamente reflejando el nuevo régimen peligroso. Esto ya no es solo un estimador robusto — es un **sistema de incertidumbre gobernada**: detecta cuándo su propio conocimiento se volvió inválido y se recupera sin intervención externa.

---

## La progresión F → G1 → G2

| Fase | Pregunta | Respuesta |
|---|---|---|
| F | ¿Puede existir un contrato de gobernanza dinámica? | Sí |
| G1 | ¿El contrato sobrevive a la ejecución online? | Sí |
| G2 | ¿El contrato sobrevive a la incertidumbre epistémica? | Sí, bajo condiciones explícitas |

Cada fase fortaleció una asunción sin cambiar el núcleo del contrato. Los cuatro bugs de plan encontrados durante la implementación de G2 (una constante de test mal calculada, una demostración debilitada por un artefacto de recursión, un error de signo, y artefactos de repo accidentalmente commiteados) cambiaron detalles de implementación — nunca la afirmación científica que cada batch pretendía validar. Eso es evidencia de que la frontera conceptual (spec) estaba bien trazada antes de escribir código: los errores encontrados fueron de aritmética y construcción de fixtures, no de arquitectura o semántica.

---

## Una observación sobre la trayectoria del proyecto

TAKT comenzó como una teoría sobre **fricción** — cuándo comprimir una representación preserva las decisiones óptimas. El centro de gravedad se ha desplazado: los conceptos centrales ahora son trayectoria, margen, incertidumbre y gobernanza. La fricción no desaparece, pero pasa de ser el objeto primario a ser una variable explicativa dentro de un marco más amplio: **una teoría de cómo mantener la capacidad de decisión bajo incertidumbre que evoluciona**. Eso lee como maduración de la teoría, no como cambio de dirección — G2 es el punto donde esa maduración se vuelve empíricamente visible, no solo argumentable en prosa.

---

## Limitaciones (heredadas del design, confirmadas por los batches)

* **L-G2-001** — confirmada empíricamente por G2-003: acoplamiento epistémico entre estados no modelado (sa-rectangularidad).
* **L-G2-002** — no ejercida directamente por ningún batch (es una limitación de lo que el `ValidityMonitor` puede observar, no algo que un experimento adversario pueda demostrar sin inyectar un cambio semántico latente fuera del alcance de esta fase): detección de deriva limitada a la distribución de transición observada.

---

## Frontera hacia G3

El objeto de gobernanza cambió de `P` a `U_t` en G2. En G3 el objeto de gobernanza deja de ser `U_t` fijo con una regla de contracción fija — pasa a ser el par `(U_t, política de gobernanza)` en sí mismo. La pregunta ya no es "¿el contrato se sostiene dado un modelo de incertidumbre?" (G2 respondió eso) sino:

> ¿Puede un sistema gobernado mejorar su propio modelo de incertidumbre sin abandonar las garantías que lo hicieron confiable en primer lugar?

Esa es una pregunta de investigación distinta a la que resolvió G2, y requiere su propio brainstorming antes de fijar un diseño.
