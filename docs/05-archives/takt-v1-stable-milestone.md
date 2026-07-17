# TAKT v1 — Primera Versión Científicamente Estable

**Fecha de cierre:** 2026-07-17  
**Alcance:** Formal Core → Phase F → Phase G1 → Phase G2 → Consolidation

---

## 1. Declaración

Este documento certifica el cierre del primer ciclo completo de TAKT
(Theory of Adequate Knowledge for Decisions) como una unidad científica coherente.

El cierre se declara tras la auditoría de consolidación del 2026-07-17, que verificó:

1. **Consistencia teórica:** El axioma central `ker(R) ⊆ ker(D)` es consistente
   en todos los documentos del repositorio, sin contradicción ni ambigüedad.

2. **Consistencia terminológica:** La única tensión detectada — la colisión nominal
   entre el margen estático `M(R)` (D-001) y el margen dinámico `M_D(τ_{:t})` (paper v4) —
   ha sido resuelta documentalmente. Ambos objetos coexisten con significados distintos
   y genealogía explícita.

3. **Consistencia documental:** Los documentos de estado reflejan ahora la situación
   real del proyecto. No hay fases descritas como abiertas que estén cerradas,
   ni fases cerradas sin documentar.

4. **Deuda pendiente legítima:** La deuda existente (formalización Lean de F-001/F-002,
   M_D^rob, benchmark externo) está marcada explícitamente como trabajo futuro, no
   como carencia no reconocida.

---

## 2. Estructura del ciclo cerrado

```
Formal Core (F)
    Objeto: ker(R) ⊆ ker(D) — condición de preservación decisional
    Resultado: Axioma fundacional + Regret + Factorización + Minimalidad + Composicionalidad
    Lean: v1.0.0-formal-core (0 errores, 2 sorry documentados)
         │
         ▼
Phase G1 — Red Team / Runtime
    Objeto: límites de la verificación estática
    Resultado: ST-001 a ST-007 — 4 Boundary Identified, 1 Refined, 2 Validated
    Lean: RT001–RT004.lean, HiddenKernel, DistributedDecision, TemporalDrift
         │
         ▼
Phase G2 — Gobernanza Dinámica bajo Incertidumbre
    Objeto: M_D(τ_{:t}) — margen dinámico; C_v4 — contrato dinámico
    Resultado: TDS, Horizon Guarantee, Asymmetric Margin Effect, β-calibration
    Implementación: 131 tests / 51 ficheros / 0 fallos (TypeScript, Vitest 4.x)
    Paper: docs/04-academic-paper/2026-07-17-takt-v4-draft.md (congelado)
         │
         ▼
Phase D — Consolidación
    Objeto: M(R) estático, C(T,S), contrato dinámico estático C
    Resultado: D-001 (Margen), D-002 (Cobertura), D-003 (Contrato)
    Lean: DecisionMargin, Coverage, DynamicSafetyContract
         │
         ▼
Auditoría Documental (2026-07-17)
    Resultado: 4 inconsistencias de representación corregidas; 0 tensiones teóricas
```

---

## 3. Objetos matemáticos fundamentales por fase

| Fase | Pregunta generativa | Objeto descubierto |
|------|--------------------|--------------------|
| F | ¿Cuándo preserva una representación la decisión? | `ker(R) ⊆ ker(D)` |
| G1 | ¿Cuáles son los límites de la verificación estática? | Límites epistémicos (cobertura parcial, distribución, drift) |
| D | ¿Cómo se mide la distancia al fallo y se generaliza desde muestras? | `M(R)`, `C(T,S)`, contrato `C` |
| G2 | ¿Cómo se gobierna cuando el modelo de transición es incierto? | `M_D(τ_{:t})`, `C_v4`, parámetro β |

---

## 4. Jerarquía de preservaciones emergente

La secuencia de fases revela un patrón estructural no planificado:

```
F    preserva decisiones          (ker(R) ⊆ ker(D))
G2   preserva la validez de esas decisiones bajo incertidumbre del modelo
                                   (M_D > θ ⟹ horizonte garantizado)
```

Este patrón — una jerarquía de preservaciones — es una observación sobre la
estructura del proyecto, no una afirmación teórica. Su relevancia para G3
depende de si un tercer nivel de preservación (la validez del propio
mecanismo de gobernanza) produce un nuevo objeto fundamental.

---

## 5. Posición de G3

G3 **no nace para reparar una carencia** de las fases anteriores.
Nace para responder una pregunta científica nueva:

> **¿Qué significa que un gobernador deje de ser fiable,
> aun cuando siga ejecutándose correctamente?**

Esta pregunta separa dos propiedades que G2 no distingue:
- **Corrección operacional:** el auditor ejecuta su política.
- **Fiabilidad epistemológica:** el auditor sigue siendo capaz de detectar fallos reales.

El objeto matemático de G3 — si existe — debería capturar esa grieta.
No se conoce todavía. Buscarlo es el trabajo de G3.

---

## 6. Condiciones de apertura de G3

De acuerdo con la gobernanza del proyecto (`session/governance-and-backlog.md §1`):

- G3 no comenzará hasta que aparezca una **pregunta que haga insuficiente
  el aparato actual**.
- G3 no definirá componentes antes de identificar su objeto matemático.
- G3 no escribirá especificaciones hasta validar el objeto.

La apertura de G3 es una sesión de brainstorming, no de implementación.

---

## 7. Referencias

- Núcleo formal Lean: [`takt-formal/TaktFormal/`](../../takt-formal/TaktFormal/)
- Paper v4 (congelado): [`docs/04-academic-paper/2026-07-17-takt-v4-draft.md`](../04-academic-paper/2026-07-17-takt-v4-draft.md)
- Backlog de gobernanza: [`session/governance-and-backlog.md`](../../session/governance-and-backlog.md)
- Fundamentos: [`docs/01-foundations/what-takt-is.md`](../01-foundations/what-takt-is.md)
- Freeze G2 (paper v4): implícito en el congelado del paper
- Auditoría de consolidación: sesión 2026-07-17
