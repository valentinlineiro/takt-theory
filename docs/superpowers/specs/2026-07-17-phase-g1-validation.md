# Phase G1 — Runtime Governance Validation (Closing)

**Status:** Closed — PASS
**Repository reference:** `6fe504a` (G0+G1 implementation), `e3d303d` (spec refinement + experiment artifacts)
**Depends on:** Phase F freeze (`0aebe7a`)

---

## Pregunta de validación

> ¿Puede C_v4 operar sobre una trayectoria parcial recibida en streaming manteniendo las mismas garantías decisionales validadas offline?

Fase F valida que el contrato dinámico existe y tiene propiedades bajo modelo conocido, con acceso completo a la trayectoria. G1 valida que esas propiedades sobreviven al mundo operativo incremental: los eventos llegan uno a uno, sin futuro disponible, y la decisión del auditor emerge únicamente del prefijo observado hasta el instante t.

---

## Arquitectura runtime

```
cli/src/runtime/
├── TrajectoryMonitor.ts      — construcción del prefijo τ_{:t} a partir del stream de eventos
├── DynamicMarginEstimator.ts — proyección de seguridad (M_D) desde el prefijo actual, delega en computeDynamicMargin de takt-core
├── AuditPolicy.ts            — traducción margen → acción (MONITOR / INTERVENE)
└── ContractEvaluator.ts      — medición de cumplimiento: loss, intervenciones, violaciones, ε
```

Cada componente mapea a un único tipo del boundary G0 (`Event`, `GovernanceDecision`, `ContractReport`); no hay scaffolding adicional.

---

## Criterios R0–R5

| R# | Criterio | Verificación | Resultado |
|----|----------|---------------|-----------|
| R0 | Frontera de contrato definida — el prefijo runtime coincide con la semántica formal τ_{:t} | `TrajectoryMonitor` reconstruye el mismo prefijo que `eventToPrefix` tras cada evento | ✓ |
| R1 | Equivalencia batch/streaming de M_D | Mismo M_D vía acumulación incremental y vía `computeDynamicMargin` directo | ✓ |
| R2 | Equivalencia con el simulador F-004 | Prefijo seguro (D=π) → MONITOR; prefijo riesgoso (D≠π en degraded) → INTERVENE | ✓ |
| R3 | Replay de trayectorias F-001–F-004 sobre la API runtime | 10 ciclos de F-004 (active audit) replayados evento a evento; loss total = 0 | ✓ |
| R4 | Intervención ante trayectoria adversaria antes del fallo | Secuencia nominal → degraded → failure: INTERVENE se dispara antes de alcanzar `failure` | ✓ |
| R5 | Detección de fallo de gobernanza | (a) INTERVENE queda registrado en el reporte; (b) política pasiva sin intervención → loss y violación registradas | ✓ |

---

## Resultados

```
142/142 tests passed
52 test files
11 tests específicos de runtime (R0–R5)
0 regresiones
```

El caso más relevante no es el auditor activo funcionando — es el pasivo fallando de forma medible, replayado sobre la misma pipeline runtime que produce el caso exitoso:

| Política | Loss esperado | Contrato (ε = 0.3) |
|----------|---------------|---------------------|
| Active audit (intervene at degraded) | 0.0000 | ✓ satisfecho |
| Passive audit (always monitor) | 0.9900 | ✗ violado |
| Always intervene | 0.0000 | ✓ satisfecho |

El runtime no introduce una heurística nueva para llegar a este resultado: `DynamicMarginEstimator` delega directamente en `computeDynamicMargin` de `takt-core`, y `AuditPolicy` aplica el mismo umbral margen→acción validado en F-004. Preserva la semántica de Fase F en vez de reimplementarla.

Adicionalmente, el margen dinámico conserva su geometría bajo el modo incremental (F-002 replicado vía runtime):

* M_D(s0) = 0.2231, M_D(s1) = 0, M_D(s2) = 0 — el margen decrece al acercarse al fallo y es cero en el fallo mismo.
* M_D = ∞ cuando no existe trayectoria de divergencia posible (políticas del auditor y del adversario coinciden).

Y la frontera exacta del horizonte de intervención (F-003) también se reproduce sin desviación: M_D = C_1^max = 0.1054 produce `failureWithinH = true`; M_D = ∞ > C_1^max produce `failureWithinH = false`.

---

## Limitaciones explícitas

* **P conocida.** El estimador asume el operador de transición exacto; no hay estimación online de P.
* **Sin aprendizaje online.** El auditor no actualiza su política a partir de las decisiones pasadas dentro del stream.
* **Sin incertidumbre sobre M_D.** El margen se trata como valor puntual, no como intervalo o distribución.
* **Sin integración HANSEI/ARCH.** Los mecanismos de auditoría externa quedan fuera de esta fase.

---

## Conclusión

> Phase G1 demonstrates operational equivalence between offline contract validation and online trajectory governance under a fixed transition model. The remaining challenge is not execution but adaptation: estimating and governing uncertainty in P̂.

---

## Frontera hacia G2

G1 no valida ya si el contrato funciona — eso lo hereda de Fase F y lo confirma bajo streaming. G2 valida si el contrato puede mantenerse cuando el modelo del mundo cambia:

```
Phase F                    Phase G1                      Phase G2
========                   ========                      ========
Formal model                Streaming events               P̂_t → U_t
    |                            |                              |
    v                            v                              v
Batch validation            Runtime prefix                 M_D^safe(t) = inf_{P∈U_t} M_D(P)
    |                            |
    v                            v
Contract exists              Online M_D
                                  |
                                  v
                             Audit decision
                                  |
                                  v
                             Contract evaluation
```

G2 no es "aprender P"; es gobernar la incertidumbre sobre P. F-005 (Fase F) ya mostró que el problema no es estimar P perfectamente, sino saber cuándo una estimación puede romper la garantía contractual — el Asymmetric Margin Principle. G2 hereda esa pregunta y la formula sobre el estimador online: dado un conjunto de incertidumbre U_t alrededor de P̂_t, ¿el margen mínimo sobre ese conjunto sigue acotando la pérdida esperada?
