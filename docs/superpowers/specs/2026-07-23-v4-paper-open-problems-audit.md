# Auditoría de Debilidades — TAKT v4 (Revisión Matemática)

**Status:** Abierto — insumo para planificación, no un plan de fase en sí
**Ámbito:** `docs/04-academic-paper/2026-07-17-takt-v4-draft.md` y su relación con `takt-formal/TaktFormal/*.lean`, `cli/src/runtime/`, `docs/superpowers/specs/2026-07-17-phase-g2-*`
**Origen:** revisión conversacional del paper v4 actuando como matemático, contrastada línea a línea contra el repositorio (no solo contra el texto del paper)

---

## Contexto

Esta auditoría nace de una lectura crítica del paper v4 que, en cada punto, se verificó contra el estado real del repositorio (código en `cli/src/takt-core/`, pruebas en `takt-formal/TaktFormal/*.lean`, specs de fase en `docs/superpowers/`) en vez de aceptar las afirmaciones del texto al pie de la letra. El resultado no es una lista de errores del paper — el paper es honesto sobre sus propios límites (§6.1, §7.1, §7.4) — sino una priorización de qué falta cerrar, con el hallazgo de que **una parte de lo que el paper marca como "trabajo futuro" ya fue resuelto por trabajo posterior (Phase G2) que nunca se sincronizó de vuelta al texto del paper**. Eso es, en los términos de `CLAUDE.md`, exactamente el tipo de inconsistencia entre pistas paralelas (teoría / pruebas / validación) que el repositorio pide tratar como tal y no como una tarea menor.

---

## Hallazgos, en orden de prioridad

### H1 — Desincronización paper v4 ↔ Phase G2 (el hallazgo más importante)

El §6.2 y §7.4 del paper v4 presentan la corrección conservadora `M_D^safe = M_D(P̂) − β` como una heurística empírica y conjeturan, sin formalizar, su relación con el margen robusto `inf_{P∈U} M_D(P)`, dejándolo como trabajo futuro.

Sin embargo, `docs/superpowers/specs/2026-07-17-phase-g2-uncertainty-governance-design.md` y `2026-07-17-phase-g2-validation.md` (status: **Closed — PASS**, misma fecha que el draft del paper) ya construyeron y validaron exactamente ese margen robusto, pero con un fundamento distinto y más fuerte que `β`: un envelope de incertidumbre `U_t` (L1-ball, sa-rectangular) sobre el que se deriva `M_D^safe` vía una recursión de shortest-path robusta *exacta* (no una aproximación heurística), implementada en `cli/src/runtime/RobustMarginEstimator.ts`. El invariante de seguridad probado (empíricamente, vía batches) es:

```
P* ∈ U_t  ⟹  M_D^safe(t) ≤ M_D(P*)
```

y el batch `G2-001` muestra que la cota es **tight**, no solo conservadora (`M_D^safe = M_D(P*)` exactamente en el caso adversario donde `P*` está en la frontera de `U_t`).

**Por qué esto importa más que un simple "falta actualizar una referencia":** el paper v4 le pide al lector aceptar `β ∈ [0.2, 0.5]` como una constante empírica sin justificación teórica, cuando el propio repositorio ya contiene una construcción que responde la pregunta que el paper deja abierta — con una cota exacta demostrable, no una constante ajustada por barrido Monte Carlo. Presentar el estado actual del paper sin esa referencia subestima el trabajo ya hecho y perpetúa una pregunta "abierta" que ya tiene, al menos parcialmente, respuesta en `U_t`/`G2`.

**Acción sugerida:** actualizar §6.2 y §7.4 del paper v4 para citar G2 y su invariante como la formalización (parcial) de `M_D^rob`, o — si `β` y `U_t` se consideran mecanismos deliberadamente distintos — dejar explícito por qué no se puede sustituir uno por el otro.

### H2 — El invariante de G2 tampoco está en Lean

Verificado: no existe ningún archivo `takt-formal/TaktFormal/*.lean` que mencione `RobustMargin`, `UncertaintySet` o el invariante `P* ∈ U_t ⟹ M_D^safe ≤ M_D(P*)`. G2 está validado exclusivamente por los batches TypeScript (`batch-g2-001` a `batch-g2-004`), igual que F-001/F-002 (§7.3 del paper, confirmado por grep: ningún archivo Lean los nombra, y no hay `sorry` en ningún archivo — es decir, todo lo que *está* en Lean está completo, pero el conjunto de lo que está en Lean es más pequeño que el conjunto de lo que está validado empíricamente).

**Acción sugerida:** priorizar F-002 y el invariante de G2 para formalización en Lean, en ese orden — F-002 porque la prueba en prosa (Apéndice B del paper) ya es correcta y casi trivial de traducir; el invariante de G2 porque es el resultado con la garantía más fuerte (tightness) de todo el framework dinámico y hoy descansa enteramente en validación empírica.

### H3 — El Efecto Asimétrico mezcla un caso cerrado con uno abierto

El paper (§6.1) presenta la asimetría entre sesgo optimista/pesimista como una "observación experimental... generalización requiere más investigación", tratando el caso de dos estados y el caso multi-estado como el mismo problema abierto.

No lo son. Para el TDS de dos estados usado en F-005, `M_D = -log p_fail` es estrictamente convexa y decreciente (`∂M_D/∂p = -1/p`, diverge en `p→0`, acotada en `p→1`), lo que hace la asimetría demostrable como teorema cerrado en un párrafo de cálculo — no requiere más simulación Monte Carlo para "confirmarse". El problema genuinamente abierto es el caso con `D` history-dependent sobre grafos de transición multi-estado, donde la geometría del grafo puede romper la monotonía local que sostiene el argumento de convexidad.

**Acción sugerida:** añadir el teorema cerrado del caso de dos estados como una proposición formal en el paper (y candidato a Lean, bajo prioridad menor que H2), y reformular §6.1/§7.4 para que el "trabajo futuro" declarado sea específicamente el caso multi-estado, no el fenómeno en general.

### H4 — Hipótesis de finitud implícita pero no declarada en `C_v4`

El enunciado de `Satisfied(C_v4)` en §4.6 cuantifica `∃π_audit ∈ Π_audit, ∀π_adv ∈ Π_adv` sin acotar esos espacios de políticas. Leído en abstracto, ese es un enunciado minimax sin las condiciones de compacidad/semicontinuidad que garantizarían que el existencial tiene testigo.

Verificado en el código (`cli/src/takt-core/types.ts`, `margin.ts`): `TransitionSystem<S,A>` exige `states: S[]` y `actions: A[]` como arrays finitos explícitos, y `computeDynamicMargin` es DFS con memoización acotada por `maxDepth`. Es decir: en todo lo que el paper efectivamente instancia y prueba (F-001 a F-005, G1, G2), `Π_audit` y `Π_adv` son conjuntos finitos por construcción, y la existencia es decidible por enumeración — no hace falta maquinaria de teoría de juegos continua. La laguna no es matemática sino de redacción: el teorema tal como está escrito parece más general de lo que el sistema realmente prueba.

**Acción sugerida (barata, no requiere nueva teoría):** añadir la hipótesis de finitud de `S`, `A` y horizonte `H` explícitamente al enunciado de `C_v4` en §4.6, documentando que sin ella el enunciado de existencia deja de ser constructivo. Reservar la maquinaria de compacidad/continuidad para si el framework se extiende algún día a espacios continuos — no está en el roadmap actual (`docs/superpowers/plans/`) y no debe tratarse como deuda pendiente hoy.

---

## Descartado explícitamente (para no generar trabajo fantasma)

- **Equivalencia Blackwell–TAKT:** pertenece a la pista de teoría estática (`docs/02-theoretical-positioning/novelty-audit.md`), no es una laguna de v4/gobernanza dinámica. No se incluye como ítem de trabajo de esta auditoría.
- **Núcleo estático (D-001/D-002/D-003):** verificado sin `sorry` ni `axiom` sueltos en Lean — no se identificó ninguna debilidad matemática en esta pista durante la revisión.

---

## Orden de trabajo sugerido

1. H1 — sincronizar el paper v4 con el resultado ya cerrado de G2 (redacción, no investigación nueva)
2. H4 — declarar la hipótesis de finitud en `C_v4` (redacción, no investigación nueva)
3. H3 (caso de dos estados) — formalizar como proposición cerrada (cálculo, bajo esfuerzo)
4. F-002 en Lean — la prueba en prosa ya existe (Apéndice B)
5. Invariante de G2 en Lean — el resultado más fuerte del framework dinámico, hoy sin contraparte formal
6. H3 (caso multi-estado, history-dependent) — el problema genuinamente abierto de esta auditoría

---

## Referencias verificadas durante la revisión

- `docs/04-academic-paper/2026-07-17-takt-v4-draft.md` (texto completo)
- `docs/superpowers/specs/2026-07-17-phase-g2-uncertainty-governance-design.md`, `2026-07-17-phase-g2-validation.md`
- `docs/superpowers/specs/2026-07-17-phase-g1-validation.md`
- `docs/02-theoretical-positioning/novelty-audit.md`
- `takt-formal/TaktFormal/*.lean` (19 archivos; `sorry`/`axiom`: ninguno)
- `cli/src/takt-core/types.ts`, `margin.ts`
- `cli/src/runtime/RobustMarginEstimator.ts`, `ValidityMonitor.ts`, `UncertaintySet.ts`
