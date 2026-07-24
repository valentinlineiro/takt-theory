# R1-evaluation-report.md — TAKT Independent R1 Evaluation Report

**Evaluador:** Observador externo independiente  
**Repositorio evaluado:** [valentinlineiro/takt-theory](https://github.com/valentinlineiro/takt-theory)  
**Referencia de tag:** Evaluado sobre rama `main` en commit `b78186e` / tag `v1.1.0`  
**Fecha de evaluación:** 2026-07-24  

---

## 1. Resumen ejecutivo

TAKT (Theory of Adequate Knowledge for Decisions) es un marco axiomático para representaciones que preservan decisiones óptimas bajo compresión de estados. El repositorio contiene documentación teórica, código TypeScript de benchmarks, formalización Lean 4 y un paquete de replicación `replication-package-v1`. La evaluación revela que el protocolo de replicación es ejecutable superficialmente, pero contiene una **fuga científica crítica** que invalida la interpretación central de los resultados: el sistema experimental bajo prueba (`TaktRunner`) toma sus decisiones usando exactamente la misma función que el oráculo usa para generar el ground truth. El regret cero no es evidencia de suficiencia de representación; es consecuencia aritmética garantizada por construcción. La falsificación es estructuralmente imposible en el diseño actual del experimento.

---

## 2. Claims evaluados

| Claim | Evidencia esperada | Artefacto que la soporta | Estado |
|---|---|---|---|
| **C1** — Suficiencia estructural: `ker(R) ⊆ K_D` preserva el contrato D (Theorem ST-015) | Regret = 0 bajo representación kernel vs. regret > 0 en baselines que no tienen acceso al kernel | `TaktRunner.ts`, `MetricCollector.ts`, `EXP-001-seed-42.json` | **No verificable** — fuga crítica: TaktRunner y StateSpaceGenerator usan la misma función de decisión hardcodeada |
| **C2** — Existencia de representación mínima única R_min = S/K_D | Comparación entre representaciones de distinta granularidad mostrando degradación controlada | Ningún experimento implementado | **No verificable con el repositorio** |
| **C3** — Horizonte de gobernanza G2-H1: seguridad garantizada por H pasos bajo M_D ≥ 0 y θ < θ_crit | Experimento con deriva controlada y conteo de violaciones | `EXP-004-drift-horizon.ts` | **Parcialmente verificable** — exp-004 existe pero requiere mayor discriminación de baselines |
| **C4** — Monotonía de fricción informacional: R₁ ⊆ R₂ → C_trans(R₁) ≥ C_trans(R₂) | Curva de coste de transformación vs. granularidad | Ningún experimento directo | **No verificable con el repositorio** |
| **C5** — NVE(TAKT) = +99.2 superior a todos los baselines | Comparación numérica en output JSON | `EXP-001-seed-42.json` | **Parcialmente verificable** — cifra no discriminada |
| **C6** — Tests passing | `npx vitest run` | `package.json` | **Requiere fijación de dependencias pinned** |

---

## 3. Problemas encontrados & Clasificación

### P-001 — Científico (Fuga de Oráculo Crítica)
- **Evidencia:** `StateSpaceGenerator` y `TaktRunner` usan la misma función algebraica idéntica `sum >= Math.ceil(k/2) * 0.5 ? 1 : 0`.
- **Impacto:** Regret 0 está garantizado por asignación. La falsabilidad es cero.
- **Solución para v1.2.0:** Desacoplar el motor de decisión TAKT de la función oráculo. La decisión de TAKT se evaluará contra un oráculo independiente $D(S)$.

### P-002 — Reproducibilidad (Hash determinista por commit)
- Excluir `gitCommit` del hash dinámico si se busca independencia de commit.

### P-003 — Entorno (Falta de package-lock.json & dependencias)
- Añadir `package-lock.json` y declarar `tsx`, `vitest`, `@types/node` en `devDependencies`.

### P-005 — Meta-audit Hardcodeado
- Reemplazar constantes literales en `exp-001-meta-audit.ts` por cómputo dinámico de runners.

### P-007 — Baselines No Discriminativos
- Añadir baselines con representación insuficiente ($\text{ker}(R) \not\subseteq K_D$) para demostrar que incurren en $\text{Regret} > 0$.

---

## 4. Veredicto Final

> ## R1-FAIL
>
> El experimento no separa la teoría del generador de datos y los baselines no son discriminativos. Se requiere un rediseño de la arquitectura experimental para la versión **v1.2.0 Experimental Core**.
