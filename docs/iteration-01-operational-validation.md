# M1 Operational Validation

**Propósito:** Confirmar que la abstracción ConservativeProxy no solo preserva tests sino que preserva la geometría decisional en escenarios reales, antes de construir M2 encima.

---

## Experimento 1 — Equivalencia con runtime anterior

### Hipótesis

Para toda trayectoria:

$$
RealMeetProxy(\Phi,C).lowerBound = RobustMarginEstimator.estimate(prefix)
$$

### Diseño

```typescript
interface EquivalenceCase {
  name: string;
  tds: { states: string[]; actions: string[] };
  observations: { s: string; a: string; s2: string }[];
  prefix: TrajectoryPrefix<string, string>;
}
```

Casos:

| Caso | Descripción | Observaciones |
|------|-------------|---------------|
| 1a | 2 estados, 1 acción, 3 obs | El del test actual |
| 1b | 3 estados, 2 acciones, 10 obs | Cadena más larga |
| 1c | Ciclo (s0→s1→s0) | El loop no debe divergir |
| 1d | Estado absorbente (s0→s0) | Single-state |

### Condiciones

```
estimar = TransitionEstimator(α=10)
incertidumbre = UncertaintySet(ε=0.1)
```

### Criterio

```
∀ prefix ∈ casos:
  RealMeetProxy.evaluate(...).lowerBound === RobustMarginEstimator.estimate(prefix)
```

### Invariante extendido (nuevo)

Para todo caso:

```
RealMeetProxy.evaluate(...).lowerBound
  ≤
DynamicMarginProperty.evaluate(prefix)
```

El proxy es conservativo respecto a la propiedad puntual. Este invariante no está cubierto por el test actual (solo verifica igualdad con RME).

---

## Experimento 2 — Conservación bajo degradación

### Hipótesis

A mayor incertidumbre (fibras más grandes), menor Φ^↓ (garantía más conservadora). El proxy no inventa confianza.

### Diseño

```
Dado: tds fijo (3 estados, 2 acciones)
Dado: estimator con N observaciones fijas (N = 20)
Para cada ε ∈ {0.01, 0.05, 0.1, 0.25, 0.5, 1.0}:
  uncertainty = UncertaintySet(ε)
  Φ↓ = proxy.evaluate(prefix)
  registrar: (ε, Φ↓)
```

### Condiciones

```
estimar con 20 observaciones
mismo prefix para todos los ε
maxDepth = 2 (para mantener tiempo acotado)
```

### Criterio

```text
ε0 < ε1 ⇒ Φ↓(ε0) ≥ Φ↓(ε1)
```

El proxy se degrada monótonamente con la incertidumbre. Si ε es pequeño (poca incertidumbre), Φ^↓ es alto (cerca de Φ). Si ε es grande, Φ^↓ baja.

### Contraprueba

Si el proxy no se degrada (Φ^↓ plano contra ε), algo está mal: el proxy sería insensible a la incertidumbre.

### Variante: degradación por pocos datos

```
Dado: ε fijo = 0.05
Para n ∈ {1, 3, 5, 10, 20, 50}:
  estimador = TransitionEstimator(α=10) con n observaciones
  Φ↓ = proxy.evaluate(prefix)
  registrar: (n, Φ↓)
```

Menos datos → más incertidumbre → Φ^↓ más bajo.

---

## Experimento 3 — Refinamiento manual monótono

### Hipótesis

Una cadena de refinamientos produce Φ^↓ monótonos:

$$
\Phi^\downarrow_{C_0} \sqsubseteq \Phi^\downarrow_{C_1} \sqsubseteq \Phi^\downarrow_{C_2}
$$

donde $C_i$ tiene progresivamente más contexto.

### Diseño

**Contexto C0 — observación parcial**

```
estimator con 3 observaciones desde s0
uncertainty con solo 1 observación de ese tipo
→ alta incertidumbre sobre P(s' | s0, a0)
→ fibra grande
→ Φ^↓ bajo
```

**Contexto C1 — más historial**

```
estimator con 10 observaciones
uncertainty con 5 observaciones
→ incertidumbre media
→ Φ^↓ medio
```

**Contexto C2 — modelo recalibrado**

```
estimator con 50 observaciones
uncertainty con 30 observaciones
→ incertidumbre baja
→ Φ^↓ alto (cerca de Φ)
```

### Criterio

```text
Φ↓_C0 ≤ Φ↓_C1 ≤ Φ↓_C2
```

La cadena es monótona no decreciente. Cada refinamiento solo puede mejorar (o mantener) la garantía.

### Contraprueba

Si alguna vez Φ^↓_Ci > Φ^↓_Ci+1 cuando C'i+1 tiene más contexto, el refinamiento está produciendo una garantía menos conservadora. Eso rompe la monotonía y M2 no tendría base para planificar refinamientos.

---

## Experimento 4 — Cuándo NO refinar

### Hipótesis

Existen configuraciones donde la garantía actual es suficiente y refinar más contexto no mejora la decisión.

### Diseño

**Caso 4a — Incertidumbre ya baja**

```
ε = 0.01
observaciones = 100
Φ↓ ≈ Φ (el proxy casi toca el ground truth)
```

Refinar más (ε→0, más datos) no cambia Φ^↓ significativamente. El sistema debe detectar que refinar tiene EVSI ≈ 0.

**Caso 4b — Decisión ya robusta**

```
Φ↓ > threshold_decisional
```

La garantía actual ya es suficiente para tomar la decisión segura. Refinar más no cambiaría la acción.

**Caso 4c — Colapso total**

```
fibra = universo completo (contexto vacío)
Φ↓ = ⊥ (bottom del lattice)
```

Refinar no ayuda porque no hay ni siquiera un punto de partida. La acción correcta es ESCALATE (pedir intervención externa), no REFINE.

### Criterio

```text
4a: Φ↓(ε=0.01, n=100) - Φ↓(ε=0.001, n=1000) ≈ 0
4b: π*(Φ↓) = Act   (no Refine ni Escalate)
4c: Φ↓ = ⊥ → decision_action = Escalate
```

Nota: π* no está implementado todavía. El experimento 4 se limita a verificar que:
- En 4a: refinar no cambia Φ^↓ (el proxy es estable)
- En 4b: Φ^↓ ya supera cualquier umbral razonable
- En 4c: el proxy colapsa y no hay base para refinar

Estos son los **inputs** que M2 consumirá. Si están bien, M2 puede decidir correctamente.

---

## Implementación

### Archivo nuevo

```
cli/src/core/proxy/operational-validation.test.ts
```

Usa `describe.each` o bucles paramétricos para los 4 experimentos. Cada experimento es su propio `describe` con `it` cases.

### Dependencias

Solo testea lo ya implementado:
- `RealMeetProxy`
- `DynamicMarginProperty`
- `UncertaintyFibre`
- `UncertaintySet`
- `TransitionEstimator`

No requiere cambios al runtime.

### Criterio de éxito

```bash
npm test    # 337 tests + ~30 nuevos = ~367 tests, todos pasando
```

### Lo que validamos

| Exp | Valida | Dice que M2 puede... |
|-----|--------|---------------------|
| 1 | Proxy = RME | Confiar en que el proxy mantiene el comportamiento validado |
| 2 | Φ^↓ monótono en ε | Usar ε como proxy de calidad de la garantía |
| 3 | Φ^↓ monótono en refinamiento | Planificar secuencias C0→C1→C2 con convergencia garantizada |
| 4 | Condiciones de parada | Decidir cuándo refinar y cuándo parar |
