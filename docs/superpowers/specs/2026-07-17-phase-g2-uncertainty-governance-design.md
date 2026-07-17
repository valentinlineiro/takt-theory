# Phase G2 — Uncertainty Governance (Design)

**Status:** Design (approved, pre-implementation)
**Depends on:** Phase G1 (`docs/superpowers/specs/2026-07-17-phase-g1-validation.md`), Phase F (`0aebe7a`, in particular F-005's Asymmetric Margin Principle)

---

## Pregunta de validación

> ¿Puede la garantía de margen dinámico de C_v4 preservarse cuando P se reemplaza por un envelope de incertidumbre auto-auditable U_t, bajo la condición de que el modelo de transición verdadero permanezca dentro del envelope mantenido?

G1 asume P conocida y valida que el contrato sobrevive a la llegada incremental de la trayectoria. G2 retira esa asunción: P no se conoce exactamente, sino que se acota mediante U_t, un conjunto de modelos de transición compatibles con la evidencia observada. La garantía de G2 no es "TAKT conoce el mundo" — es más fuerte y más operacional: **TAKT sabe cuándo su propio límite de modelo deja de ser confiable, y degrada conservadoramente en vez de seguir gobernando sobre una base inválida.**

---

## Fork de representación (resuelto)

Tres candidatos para `U_t(s,a)` fueron evaluados por tratabilidad computacional, no solo por expresividad:

| Representación | Tratabilidad | Fit epistémico |
|---|---|---|
| Intervalo global sobre P | No respeta la estructura de simplex por estado ni la recursión de Bellman | Descartado |
| Familia finita `{P_1,...,P_n}` | Siempre computable por enumeración, pero no compone con la recursión | Reservado para validación, no para runtime |
| Restricciones por transición (L1-ball, sa-rectangular) | Recursión de shortest-path robusta con solución cerrada exacta | Elegido |

`M_D` se deriva de `computeDynamicMargin` (`cli/src/takt-core/margin.ts`) como una recursión de shortest-path con pesos `-log P(s'|s,a)`: `M_D(P) = -log(max_path Prob(path | P))`. Es monótona por arista (más probabilidad hacia el fallo nunca aumenta M_D) pero no convexa globalmente (mínimo de piezas convexas). Esa monotonicidad, combinada con sa-rectangularidad (`U_t = ∏_{s,a} U_t(s,a)`), permite que `inf_{P∈U_t} M_D(P)` se calcule vía una recursión robusta, no una búsqueda combinatoria global. La forma exacta de esa recursión se resuelve en la sección "Design Refinement" más abajo — no es el algoritmo greedy de robust-MDP estándar, porque `M_D` no es una función de valor basada en expectativa.

Correlación entre estados (`U_t` no rectangular) sería más fiel epistémicamente pero es NP-hard en general (resultado conocido en la literatura de robust MDPs); se documenta como límite explícito (L-G2-001), no se resuelve en esta fase.

---

## Design Refinement (post-approval, pre-implementation)

Al preparar el plan de implementación se detectó una imprecisión en la elección algorítmica original: la sección de arriba y el resumen de arquitectura describían la minimización robusta local como un "algoritmo greedy de sort-and-shift", tomado por analogía de la literatura estándar de robust MDPs (Nilim & El-Ghaoui, Iyengar). Ese algoritmo resuelve el caso robusto de una función de valor **basada en expectativa**:

```
V(s) = min_a Σ_s' P(s'|s,a) · [cost + V(s')]
```

`computeDynamicMargin` no tiene esa forma. Es una recursión de **shortest-path**: en cada estado toma el mínimo sobre transiciones individuales, no una suma ponderada por probabilidad:

```
M_D(s) = min over (a, s') of [ -log P(s'|s,a) + M_D(s') ]
```

Para esta estructura, `inf` y `min` conmutan exactamente, sin necesidad de redistribuir masa de probabilidad conjuntamente entre candidatos:

```
inf_{P∈U_t(s,a)} min_{s'} [-log P(s') + M_D^safe(s')]
    = min_{s'} [-log(sup_{P∈U_t(s,a)} P(s')) + M_D^safe(s')]
```

Y para una L1-ball, `sup_{P∈U_t(s,a)} P(s')` tiene solución cerrada: mover Δ de masa de probabilidad hacia una coordenada cuesta `2Δ` de presupuesto L1 (Δ agregado ahí, Δ removido en otro lugar para mantener la suma en 1), así que:

```
P_max(s'|s,a) = min(1, P̂_t(s'|s,a) + ε_t(s,a) / 2)

M_D^safe(s) = min over (a, s') of [ -log(P_max(s'|s,a)) + M_D^safe(s') ]
```

**Convención congelada (evita un bug de factor 2):** `ε_t(s,a)` en `UncertaintySet` y `τ` en `ValidityMonitor` se definen ambos como distancia **L1 cruda** (`‖P − P̂‖_1 ≤ ε`), no como distancia de variación total (`TV = ½‖P − P̂‖_1`). El factor `/2` en `P_max` ya absorbe esa conversión — si en algún punto el código usara TV en vez de L1 para `ε`, el factor `/2` desaparecería y esto debe tratarse como un cambio de contrato, no un detalle de implementación.

Este refinamiento no cambia el contrato, el invariante de seguridad, los parámetros, `ValidityMonitor`, ni `RECALIBRATE` — solo el algoritmo interno de `RobustMarginEstimator`. Es una mejora, no una debilidad: es la contraparte robusta *exacta* de `computeDynamicMargin` (no una aproximación), permanece arquitectónicamente continua con G1 (una extensión de un solo parámetro del primitivo existente, no una teoría paralela), y da una interpretación epistémica más limpia al caso sin observaciones: `P̂ = 0` da `P_max = ε/2`, no `P_max = 0` — la ausencia de evidencia no colapsa a imposibilidad, solo permanece incierta hasta que la evidencia la contraiga.

---

## G2 Safety Invariant

Mientras ninguna condición de mismatch esté activa:

```
P* ∈ U_t  ⟹  M_D^safe(t) ≤ M_D(P*)
```

El margen robusto es conservador respecto al modelo verdadero desconocido. Este es el puente matemático entre la representación de incertidumbre y la garantía de gobernanza: mientras el invariante se sostenga, cualquier decisión basada en `M_D^safe` es al menos tan cautelosa como la decisión que se tomaría con conocimiento exacto de P*. El rol de `RECALIBRATE` es precisamente restaurar las condiciones bajo las que este invariante puede volver a sostenerse cuando la evidencia sugiere que pudo haberse roto.

---

## Arquitectura

G2 extiende G1; no lo reemplaza. `DynamicMarginEstimator` (P conocida → M_D) queda congelado con su semántica actual. `RobustMarginEstimator` es un componente nuevo y paralelo (U_t → M_D^safe), no un reemplazo:

```
DynamicMarginEstimator          RobustMarginEstimator
        |                                |
   P conocida                      P* ∈ U_t (incierta)
        |                                |
        v                                v
       M_D                          M_D_safe
```

Componentes nuevos en `cli/src/runtime/`, todos delegando en `takt-core` para el cálculo subyacente (mismo principio de G1: el runtime no reimplementa la matemática, la envuelve):

```
UncertaintySet.ts        — U_t(s,a): radio ε (distancia L1 cruda), shrink(n), pMax(s', P̂), recover()
TransitionEstimator.ts   — mantiene P̂_t (full-history) y P̂_{W,t} (ventana) por conteos
RobustMarginEstimator.ts — M_D^safe vía recursión de shortest-path robusta exacta (ver Design Refinement)
ValidityMonitor.ts       — calcula Δ_t = ‖P̂_{W,t} − P̂_t‖_1, dispara mismatch
```

`AuditPolicy` extiende su tipo de decisión: `MONITOR_SAFE | INTERVENE | RECALIBRATE`. `ContractEvaluator` gana `recalibrationCount` y `lastRecalibrationReason` — este último no es necesario para la operación de G2, pero deja la traza causal (¿colapsó el margen por cambio de entorno, o por inmadurez del estimador?) que un ciclo de reflexión futuro (HANSEI/G3) necesitará para distinguir esos dos casos.

### Flujo

```
Observación (s,a,s')
        |
        v
TransitionEstimator: n(s,a)++, actualiza P̂_t, P̂_{W,t}
        |
        v
UncertaintySet: ε_t(s,a) ∝ 1/√n(s,a)  →  U_t(s,a) se contrae
        |
        v
ValidityMonitor: Δ_t(s,a) = ‖P̂_{W,t} − P̂_t‖_1
        |
        +-- Δ_t ≤ τ -----------------------------+
        |                                        |
        v                                        v
   RobustMarginEstimator                   U_t → U_recovery
   (M_D^safe sobre U_t)                    (restaura conservadurismo)
        |                                        |
        v                                        v
   AuditPolicy: MONITOR_SAFE / INTERVENE      AuditPolicy: RECALIBRATE
        |                                        |
        +--------------------+-------------------+
                             v
                      ContractEvaluator
```

El mecanismo exacto de recuperación (`U_recovery`) — resetear ε al radio inicial, inflar el radio, o marcar el par `(s,a)` como no certificado hasta acumular evidencia suficiente — es una decisión de implementación, no parte del contrato. El contrato solo exige: *cuando la evidencia empírica se vuelve incompatible con el envelope de incertidumbre actual, el sistema debe restaurar conservadurismo antes de continuar confiando en la garantía de margen.*

---

## Parámetros

Cuatro, todos reutilizados a través de todo el diseño — ninguna familia estadística nueva se introduce para la detección de deriva:

| Parámetro | Significado |
|---|---|
| `ε_0` | radio de incertidumbre inicial |
| `θ` | umbral de intervención (heredado de G1) |
| `W` | tamaño de ventana para la detección de deriva |
| `τ` | umbral de mismatch L1 |

---

## Criterios R0–R6

| R# | Criterio |
|----|----------|
| R0–R5 | (heredados de G1 sin cambio — plumbing de streaming/prefijo/replay sigue vigente bajo P conocida) |
| R6 | **Uncertainty lifecycle integrity** — dado el ciclo observación → actualización del estimador → contracción de U_t → chequeo de validez → recuperación (si aplica), el estado runtime permanece internamente consistente; `U_{t+1}` es siempre un sucesor válido de `U_t` (contraído bajo evidencia estacionaria, o restaurado a `U_recovery` bajo mismatch — nunca ambos, nunca ninguno) |

---

## Plan de validación

Mismo patrón que `batch-f-*`: cada batch valida una afirmación empírica, no plumbing. Uno por adversario de la lista original (G2.5):

- `batch-g2-001` — **optimistic model adversary**: P* se ubica en el borde de U_t; el invariante de seguridad debe sostenerse incluso en el caso límite.
- `batch-g2-002` — **uncertainty collapse adversary**: la sola contracción por evidencia produciría falsa confianza; el `ValidityMonitor` debe capturarlo antes de que el invariante se rompa silenciosamente.
- `batch-g2-003` — **sparse observation boundary characterization**: no es pass/fail — como F-005, mapea el límite de aplicabilidad (L-G2-001) en vez de intentar derrotar el contrato. El nombre lo deja explícito para que lectores futuros no asuman que todo batch intenta romper la garantía.
- `batch-g2-004` — **distribution shift adversary**: P* cambia después de que U_t se había contraído alrededor del régimen anterior; el detector de deriva debe disparar `RECALIBRATE` y el contrato debe sostenerse post-recuperación.

Plumbing de runtime (R0–R6) vive en `cli/src/runtime/g2.test.ts`, extendiendo `runtime.test.ts` de G1.

---

## Limitaciones explícitas

* **L-G2-001 — Acoplamiento epistémico entre estados no modelado.** La sa-rectangularidad asume que la incertidumbre sobre una transición no informa sobre otra. Un patrón de observación disperso pero correlacionado puede explotar las costuras entre conjuntos de incertidumbre independientes por `(s,a)` — este es precisamente el sparse observation adversary, y `batch-g2-003` caracteriza el límite en vez de resolverlo.
* **L-G2-002 — Detección de deriva limitada a la distribución de transición observada, no a cambios semánticos latentes arbitrarios.** Dos modelos de transición distintos que producen distribuciones locales similares en las regiones observadas son indistinguibles para el `ValidityMonitor`. No es una falla del detector; es el límite de observabilidad heredado de G1/F.
* **Fuera de alcance de G2:** geometría de incertidumbre adaptativa/aprendida, selección automática de estimador, estrategia de exploración. Territorio de G3.

---

## Afirmación científica

> TAKT provides robust trajectory governance under factored (sa-rectangular) transition uncertainty, preserving dynamic-margin guarantees without exact knowledge of P — and detects, rather than silently absorbs, the point where that uncertainty envelope stops being trustworthy.

---

## Jerarquía de garantías (F → G1 → G2)

```
F   — P conocida, batch completo.       Guarantee: dado el modelo, el contrato existe y tiene propiedades.
G1  — P conocida, streaming online.     Guarantee: el contrato sobrevive a la llegada incremental de la trayectoria.
G2  — P ∈ U_t, streaming online.        Guarantee: el contrato se sostiene sin conocer P exactamente,
                                          mientras P* permanezca dentro del envelope mantenido — y el sistema
                                          detecta cuándo esa condición deja de cumplirse.
```

G3 (fuera de alcance aquí) heredaría la pregunta de cómo `U_t` mismo podría mejorar mediante reflexión/adaptación — no cómo gobernar dado un `U_t` fijo con una regla de contracción fija, que es exactamente lo que G2 resuelve.
