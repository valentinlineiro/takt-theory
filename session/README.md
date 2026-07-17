# Session: Novelty Audit — TAKT Formal Core v1.0

## Goal

Compare TAKT's formal core against neighboring formalisms to produce a
correspondence map: TAKT concept ↔ known concept, identifying genuinely
differential residue.

## TAKT v1 Formal Core (frozen at `v1.0.0`)

### Central invariant

```
ker(R) ⊆ ker(D)   ⇔   ∃π, D = π∘R   ⇔   ε_D(R) = 0
```

### Falsified

```
ε_U(R) = 0  ⇒  ker(R) ⊆ ker(D)   — FALSE
```

### Core concepts to map

| Concept | Definition | File |
|---|---|---|
| `kernel(f)` | Equivalence relation: f(x)=f(y) | `Kernel.lean:16` |
| `kernelSubset(f,g)` | ker(f) ⊆ ker(g) | `Kernel.lean:21` |
| factorization | ker(R) ⊆ ker(D) ⇔ ∃π, D=π∘R | `Factorization.lean:77` |
| argmaxPred | a is max under U(s,·) | `DecisionSystem.lean:26` |
| DecisionSystem | <U, argmax_nonempty, θ, θ_consistent> | `DecisionSystem.lean:30` |
| DecisionSystem.D | θ(argmax U(s,·)) | `DecisionSystem.lean:37` |
| regret | U(x,D(x)) - U(x,D(y)) | `Regret.lean:24` |
| epsilon (ε_U) | sup bound on regret over ker(R) | `Regret.lean:47` |
| epsilon_D (ε_D) | ker(R) ⊆ ker(D) predicate | `SafetyEquivalence.lean:39` |

### Known boundaries (2 sorry, both documented)

1. `Regret.lean:70` — ε_U(R)=0 ⇒ ker(R)⊆ker(D) is unprovable
2. `SafetyEquivalence.lean:80` — same unprovable direction

### Key discovery from formalization

Decision preservation (ε_D) and utility preservation (ε_U) are distinct.
ε_D=0 ⇒ ε_U=0, but not vice versa. Two actions with tied utility give
zero regret but different decisions.

### Assumptions (v1 scope)

- D deterministic
- A finite
- θ globally consistent (same tie-breaking everywhere)
- Utility-defined decision (D = θ(argmax U))

### Failure boundaries (excluded from v1)

1. Stochastic
2. Temporal
3. Multi-objective
4. Adaptive

## Status

> **Nota:** Este documento es el registro histórico de la sesión de Novelty Audit
> (comparación formal del núcleo TAKT con marcos vecinos). Los resultados están
> completados y archivados. No es una hoja de ruta activa.

**Step 1: Freeze** — DONE (`v1.0.0` tagged and pushed).

**Step 2: Novelty audit** — DONE. Resultados en:
- `docs/02-theoretical-positioning/novelty-audit.md` — tabla de correspondencias completa
- `docs/01-foundations/what-takt-is.md` §5 — resumen integrado en la documentación principal
- `docs/05-archives/phase-b-freeze.md` — freeze de la fase

### Formalisms compared

1. **Sufficient statistics** — Correspondencia fuerte (con dependencia de hipótesis estadísticas)
2. **Blackwell sufficiency** — Correspondencia parcial (estocástico vs. determinista)
3. **Information bottleneck** — Independencia (preservación informacional vs. decisional)
4. **State abstraction / bisimulation** — Correspondencia parcial (bisimulación preserva dinámica completa)
5. **Decision-sufficient representations** — Correspondencia parcial (TAKT ↔ π*, no Q*)

### Patrón transversal

En todos los marcos donde aparece la preservación decisional, es una consecuencia derivada
de un aparato teórico más amplio (distribuciones, dinámica, convexidad). TAKT la adopta
como axioma primitivo autónomo.

**Step 3 onwards** — Continuación en G2 / paper v4
(`docs/04-academic-paper/2026-07-17-takt-v4-draft.md`).

## Relevant files

- `takt-formal/` — Lean proofs (5 modules, 439 lines, 0 errors)
- `docs/01-foundations/takt-formal-foundations-v1.md` — full derivation in LaTeX
- `session/README.md` — this file
