# TAKT Novelty Audit

## Objetivo

Determinar la relación formal entre el núcleo de TAKT (`v1.0.0-formal-core`)
y los marcos formales existentes.

## Método

**Fase A — Traducción formal**

Cada marco se traduce al lenguaje de TAKT y viceversa, definición por
definición. Sin juicios de similitud, solo correspondencias explícitas.

**Fase B — Separación**

Se buscan ejemplos donde un marco distingue y el otro no. El residual
es la diferencia irreductible entre ambos.

## Estado

| Marco                              | Traducción | Separación | Estado  |
|-------------------------------------|------------|------------|---------|
| Sufficient Statistics               | ✅         | ⬜         | Fase A completada. |
| Blackwell                           | ✅         | ⬜         | Fase A completada. Correspondencia parcial (garbling ↔ representación; estocástico ≠ determinista). |
| Decision-Sufficient Representations | ✅         | ⬜         | Fase A completada. TAKT ↔ φ_π*, no φ_Q*. |
| Information Bottleneck              | 🚫         | ⬜         | Fase A completada. Preservación informacional ≠ decisional. No traducible. |
| Bisimulation                        | ✅         | ⬜         | Fase A completada. Correspondencia parcial (bisimulación ⇒ TAKT; TAKT ⇏ bisimulación). |

## Referencia de TAKT

Núcleo formal: `v1.0.0-formal-core` (hash `d47e805`).

Documentos de teoría:

- `docs/theory/takt-formal-foundations-v1.md`

Archivos Lean:

- `takt-formal/TaktFormal/Kernel.lean`
- `takt-formal/TaktFormal/Factorization.lean`
- `takt-formal/TaktFormal/DecisionSystem.lean`
- `takt-formal/TaktFormal/Regret.lean`
- `takt-formal/TaktFormal/SafetyEquivalence.lean`
- `takt-formal/TaktFormal/EpsilonUCounterexample.lean`

## Resultados de la Fase A

| Resultado                     | Marcos                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| **Correspondencia fuerte**    | Sufficient Statistics, Decision-Sufficient Representations |
| **Correspondencia parcial**   | Blackwell, Bisimulation                                    |
| **No traducible**             | Information Bottleneck                                     |

**Patrón transversal confirmado (4/5 marcos con preservación decisional):**

En Berger, Blackwell, State Abstraction y Bisimulation, la preservación
decisional aparece como una propiedad derivada (teorema o definición
subordinada) de un aparato teórico más amplio. En TAKT, esa misma propiedad
es el axioma fundacional. La diferencia no es de contenido formal, sino de
**estatus lógico**: qué se postula y qué se demuestra.

**Límite del patrón (1/5 marcos):**

Information Bottleneck se separa porque no es una teoría de preservación
decisional, sino de preservación informacional. Esto confirma que el patrón
no es trivial ni forzado.

## Pendiente (Fase B)

La Fase B (Separación) no se ha iniciado formalmente para ningún marco aún.
Cada documento de auditoría contiene contraejemplos preliminares, pero el
análisis sistemático de separación está pendiente.
