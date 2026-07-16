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

| Marco                              | Traducción | Separación | Estado completo |
|-------------------------------------|------------|------------|-----------------|
| Sufficient Statistics               | ✅         | ✅         | Correspondencia fuerte (con dependencia de hipótesis estadísticas) |
| Blackwell                           | ✅         | ✅         | Correspondencia parcial (estocástico vs. determinista; universal vs. específico) |
| Decision-Sufficient Representations | ✅         | ✅         | Correspondencia parcial (fortalecimiento: TAKT ↔ π*, no Q*) |
| Information Bottleneck              | 🚫         | ✅         | Independencia (preservación informacional vs. decisional) |
| Bisimulation                        | ✅         | ✅         | Correspondencia parcial (debilitamiento: bisimulación preserva dinámica) |

## Referencia de TAKT

Núcleo formal: `v1.0.0-formal-core` (hash `d47e805`).

Documentos de teoría:

- `docs/01-foundations/takt-formal-foundations-v1.md`

Archivos Lean:

- `takt-formal/TaktFormal/Kernel.lean`
- `takt-formal/TaktFormal/Factorization.lean`
- `takt-formal/TaktFormal/DecisionSystem.lean`
- `takt-formal/TaktFormal/Regret.lean`
- `takt-formal/TaktFormal/SafetyEquivalence.lean`
- `takt-formal/TaktFormal/EpsilonUCounterexample.lean`

## Resultados

### Fase A — Traducción

| Resultado                     | Marcos                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| **Correspondencia fuerte**    | Sufficient Statistics, Decision-Sufficient Representations |
| **Correspondencia parcial**   | Blackwell, Bisimulation                                    |
| **No traducible**             | Information Bottleneck                                     |

### Fase B — Separación

| Resultado                     | Marco               | Detalle                                                |
| ----------------------------- | ------------------- | ------------------------------------------------------ |
| **Correspondencia fuerte**    | Sufficient Statistics | Preservación idéntica, pero dependiente de hipótesis estadísticas. |
| **Correspondencia parcial**   | Decision-Sufficient | Fortalecimiento: TAKT = π*; Q* es más fuerte.          |
|                               | Bisimulation        | Debilitamiento: bisimulación preserva dinámica y recompensa completa. |
|                               | Blackwell           | Estocasticidad (kernel vs. función) y dominio (universal vs. fijo). |
| **Independencia**             | Information Bottleneck | Propiedades ortogonales: información vs. decisión.    |

## Patrón transversal

En Berger, Blackwell, State Abstraction y Bisimulation, la preservación
decisional aparece como una propiedad derivada (teorema o definición
subordinada) de un aparato teórico más amplio. En TAKT, esa misma
propiedad es el axioma fundacional. La diferencia no es de contenido
formal, sino de **estatus lógico**: qué se postula y qué se demuestra.

La Fase B añade que cada marco que contiene preservación decisional lo
hace bajo hipótesis más fuertes que TAKT (distribuciones, dinámica,
convexidad, cuantificadores universales). TAKT aísla la preservación
decisional como principio autónomo, eliminando esas dependencias.

**Límite:** Information Bottleneck confirma que no todo marco es una
teoría de preservación decisional.

## Documentos

| Marco               | Fase A                                    | Fase B                                          |
|---------------------|-------------------------------------------|-------------------------------------------------|
| Sufficient Statistics | `01-sufficient-statistics.md`            | `01-sufficient-statistics-phase-b.md`           |
| Blackwell             | `02-blackwell.md`                        | `02-blackwell-phase-b.md`                       |
| Decision-Sufficient   | `03-decision-sufficient.md`              | `03-decision-sufficient-phase-b.md`             |
| Information Bottleneck| `04-information-bottleneck.md`           | `04-information-bottleneck-phase-b.md`          |
| Bisimulation          | `05-bisimulation.md`                     | `05-bisimulation-phase-b.md`                    |
