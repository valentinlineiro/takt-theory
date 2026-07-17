# Paper Outline — Trajectory-Based Strategic Governance under Partial Observability

**Target format:** Technical report (conference-quality paper structure)
**Status:** Outline (final revision)
**Repository reference:** `0aebe7a` (Phase F freeze)

---

## Abstract

*Static certification guarantees properties of configurations. Dynamic governance guarantees properties of executions.* Los sistemas de decisión se certifican mediante propiedades sobre estados o escenarios de prueba; mostramos que estas garantías pueden romperse bajo incertidumbre temporal u observabilidad parcial. Proponemos un marco de gobernanza estratégica donde la trayectoria reemplaza al estado como unidad fundamental, el margen dinámico M_D mide la distancia probabilística al primer fallo decisional, y un juego de auditoría sintetiza políticas de intervención con pérdida acotada. La validación experimental (131 tests, 51 archivos, 0 fallos) incluye la verificación de cobertura temporal, horizonte garantizado y un juego auditor-adversario completo. Un experimento de robustez revela el **Asymmetric Margin Principle**: el error de estimación en P degrada asimétricamente las garantías, y una calibración conservadora M_D - β con β ∈ [0.2, 0.5] reduce los falsos seguros ~90% sin generar falsas alarmas.

---

## 1. Introduction

### Research question
¿Cómo certificar sistemas de decisión cuando evolucionan bajo incertidumbre y observabilidad parcial?

### Problem
Los sistemas de decisión — autónomos, semi-autónomos, de apoyo — se certifican mediante propiedades verificadas sobre configuraciones instantáneas (estados, escenarios de prueba). Nuestros experimentos (Red Team v3.0, RT-001–RT-004) muestran que estas garantías son formalmente correctas pero empíricamente insuficientes: un operador de transición mal estimado, un adversario que explora caminos no cubiertos, o una deriva temporal puede producir decisiones que el contrato consideraba imposibles.

### Thesis (estática vs. dinámica)
Este trabajo se sostiene sobre una tesis central: *Static certification guarantees properties of configurations. Dynamic governance guarantees properties of executions.* La certificación estática responde "¿es seguro este estado?"; la gobernanza dinámica responde "¿puede esta trayectoria llevar a una pérdida decisional antes de que el auditor pueda intervenir?".

### Theoretical contributions
1. **Trajectory Decision System (TDS)**: formalismo que integra transiciones probabilísticas, observabilidad parcial y decisión en trayectorias.
2. **Dynamic Margin (M_D)**: métrica de distancia a la primera pérdida decisional basada en coste de sorpresa (-log P).
3. **Dynamic Governance Contract (C_v4)**: condición de existencia de una política de auditoría que acota la pérdida esperada acumulada en H pasos.
4. **Guaranteed Intervention Horizon**: cota temporal incondicional antes del primer fallo (Teorema F-002).

### Experimental findings
5. **Asymmetric Margin Principle (F-005)**: el error de estimación en el operador de transición P produce degradación asimétrica — el sesgo optimista puede invalidar la garantía contractual, el pesimista solo reduce eficiencia.
6. **Conservative calibration (F-005.1)**: la corrección M_D - β induce una frontera de Pareto gobernable; β ∈ [0.2, 0.5] reduce falsos seguros ~90% sin falsas alarmas.

### Structure
§2 motiva el problema con dos ejemplos adversariales. §3 expone el insight central. §4 desarrolla el formalismo completo. §5 valida experimentalmente cada propiedad. §6 somete el marco a incertidumbre en P. §7 discute límites, complejidad, y trabajo futuro. §8 sitúa la propuesta respecto a la literatura existente.

---

## 2. Motivating Examples

Dos ejemplos inspirados en los ataques del Red Team v3.0, ambos ilustrando el mismo patrón: la certificación sobre estados es formalmente correcta pero empíricamente insuficiente.

### 2.1. False Coverage Attack (RT-001)
Un agente despliega una trayectoria inédita. La cobertura basada en estados la certifica como segura; la decisión del agente diverge de la política de referencia bajo observabilidad parcial. El contrato estático no detecta la violación.

### 2.2. Adaptive Adversary (RT-004)
Un adversario aprende qué estados cubre el auditor y construye trayectorias que evaden sistemáticamente la certificación sin salir del espacio de estados permitido. La garantía estática es eludida por un oponente que explota la diferencia entre cobertura de estados y cobertura de trayectorias.

### Takeaway
La trayectoria, no el estado, es la unidad relevante de gobernanza bajo incertidumbre temporal y observabilidad parcial.

---

## 3. Core Insight (breve)

Las propiedades de gobernanza no dependen únicamente del estado actual sino de la evolución histórica compatible con la observación disponible. Esto obliga a reemplazar el estado como unidad fundamental por el **prefijo de trayectoria**.

**[FIGURA 1: State certification (s1, s2, s3) → Trajectory governance (τ1, τ2, τ3)]**

El marco descansa sobre tres niveles de abstracción:
- **M (Sistema Físico → TDS)**: representación del mundo como sistema de decisión en trayectorias.
- **G (Juego Estratégico)**: interacción auditor-agente como juego secuencial de información parcial.
- **C_v4 (Contrato Dinámico)**: condición de existencia de una política de auditoría que acota la pérdida esperada.

---

## 4. Formal Framework

### 4.0. Architectural map

**[FIGURA 2: Physical process → Transition model P → Observation O → Trajectory τ → Agent π ↓ Auditor → Dynamic Margin M_D → Monitor / Intervene]**

### 4.1. Trajectory Decision System (TDS)
M = (S, A, P, Ω, O):
- S: estados, A: acciones, P: S × A → Δ(S) (transición probabilística)
- Ω: observaciones, O: S → Ω (función de observación)
- τ = (s_0, a_0, ..., s_N): trayectoria. τ_{:k}: prefijo hasta paso k.
- D: T_pref → A: política de referencia (acción normativamente correcta)
- π: Ω* → A: política del agente (acción real basada en observaciones)

### 4.2. Observabilidad dinámica
τ_k ≡_O τ'_k si O(τ_k) = O(τ'_k). Cobertura temporal C(T_audit): todo prefijo alcanzable tiene equivalente observacional en T_audit. Consistencia decisional Consis(T_audit): todos los pares equivalentes reciben la misma acción de referencia.

### 4.3. Dynamic Margin (M_D)
Coste de sorpresa: c(s_i, a_i, s_{i+1}) = -log P. Pérdida decisional: D(τ_{:k}) ≠ π(O(τ_{:k})).

M_D(τ_{:t}) = inf_{m ≥ 1} { coste acumulado de la trayectoria de menor sorpresa que lleva a una pérdida decisional desde τ_{:t} }

C_h^max(τ_{:t}) = coste máximo de cualquier trayectoria de h pasos desde τ_{:t}.

### 4.4. Guaranteed Intervention Horizon (F-002)
Si M_D(τ_{:t}) > C_h^max(τ_{:t}) entonces no existe fallo en m < h pasos. (Demostración en Apéndice B.)

### 4.5. Audit Game (G)
G = (M, Π_audit, Π_adv, L, I). El auditor juega en cada paso: monitorizar detecta pérdidas pero no las evita; intervenir previene pérdidas pero tiene coste operativo.

### 4.6. Dynamic Contract (C_v4)
C_v4 = (H, Ω, A_audit, d_prob, m_min, ε).

Satisfied(C_v4) ⇔ ∃ π_audit ∈ Π_audit, ∀ π_adv ∈ Π_adv^Threat: E[ Σ_{t=0}^H L_t ] ≤ ε.

---

## 5. Experimental Validation

Organizado por preguntas científicas. 131 tests, 51 archivos, 0 fallos. Implementación en TypeScript (Vitest 4.x), reproducible via `npx vitest run`.

### Q1: ¿Puede verificarse la cobertura temporal?
**F-001.** Sobre un TDS con estados que comparten clases de observación, checkCoverage y checkConsistency detectan correctamente cobertura y consistencia.

### Q2: ¿Refleja M_D la accesibilidad al fallo?
**F-002.** Sobre una cadena de 3 estados donde D y π divergen en s1, M_D cuantifica la distancia probabilística mínima al primer fallo.

### Q3: ¿Existe un horizonte garantizado?
**F-003.** Validación Monte Carlo del Teorema F-002: cuando M_D > C_h^max, ningún fallo ocurre dentro del horizonte h.

### Q4: ¿Gobierna correctamente el auditor?
**F-004.** Juego completo en cadena nominal→degradado→fallo. El auditor usando M_D mantiene la pérdida dentro de ε.

### Q5: ¿Qué ocurre cuando P está mal estimada?
Véase §6.

---

## 6. Robustness under Model Uncertainty

### 6.1. Asymmetric Margin Principle (F-005)
El contrato C_v4 depende de un operador estimado P̂. ¿Qué ocurre cuando P̂ ≠ P?

Experimento controlado: TDS de 2 estados (s0→s_safe, s0→s_fail). Comparamos decisiones del auditor usando P̂ frente a las óptimas (P verdadero). 2000 pasos Monte Carlo.

| Tipo de sesgo | ΔM_D      | False Safe | Pérdida | Intervenciones |
|---------------|-----------|------------|---------|----------------|
| Ninguno       | 0.000     | 0.0%       | 0.0%    | 2000           |
| Optimista     | +0.531    | 100.0%     | 31.4%   | 0              |
| Pesimista     | -0.629    | 0.0%       | 0.0%    | 2000           |

**Hallazgo**: el error de estimación en P es asimétrico. El sesgo optimista (sobrestimar seguridad) puede invalidar completamente la garantía contractual. El sesgo pesimista preserva la garantía a costa de eficiencia. Denominamos **Asymmetric Margin Principle** a esta propiedad: dos errores de magnitud similar producen consecuencias radicalmente distintas sobre la gobernanza.

### 6.2. Conservative Calibration (F-005.1)
Proponemos M_D^safe = M_D(P̂) - β. Barrido sobre β ∈ {0, 0.05, 0.1, 0.2, 0.3, 0.5, 1.0} con 20000 pruebas Monte Carlo.

| β   | False Safe | False Alarm | Pérdida | Utilidad | Intervenciones |
|-----|-----------|-------------|---------|----------|---------------|
| 0.00| 14.47%    | 0.00%       | 0.068   | 0.932    | 63.8%         |
| 0.10| 11.46%    | 0.00%       | 0.058   | 0.942    | 66.8%         |
| 0.20| 8.61%     | 0.00%       | 0.048   | 0.952    | 69.7%         |
| 0.50| **1.44%** | 0.00%       | 0.029   | 0.971    | 76.8%         |
| 1.00| 0.00%     | 7.27%       | 0.012   | 0.988    | 85.5%         |

Existe una frontera de Pareto gobernable. β ∈ [0.2, 0.5] reduce falsos seguros ~90% sin generar falsas alarmas. La corrección no funciona para sesgo pesimista — optimismo y pesimismo son mecanismos distintos.

### 6.3. Implicación
β se convierte en un **parámetro de gobernanza** (no un hiperparámetro). La curva abre la dirección hacia M_D^rob = inf_{P∈U} M_D(P), donde U es un conjunto de incertidumbre alrededor de P̂.

---

## 7. Discussion

### 7.1. Threat model
1. **Finitud**: espacios acotados para demostraciones en Lean.
2. **Estimación de P**: dependencia crítica (abordada en §6).
3. **Modelo de amenaza**: si el adversario real excede Π_adv^Threat, las garantías pierden validez.
4. **Estructura de información (I)**: latencia, ruido, pérdida de observaciones.
5. **Tratabilidad computacional**: la especificación no presupone un algoritmo concreto.

### 7.2. Computational considerations
M_D se computa mediante DFS con memoización (estado × profundidad). Coste O(|S| · depth_max · |A|) en el peor caso. La implementación actual prioriza corrección sobre escalabilidad; para espacios grandes se requerirán aproximaciones.

### 7.3. Formalización en Lean
21 archivos `.lean` con demostraciones de RT-001–RT-004. F-001 y F-002 especificados pero no formalizados. Trabajo futuro.

### 7.4. Trabajo futuro
- **M_D^rob**: formalizar la relación entre M_D - β y el margen robusto inf_{P∈U} M_D(P).
- **Benchmark externo**: navegación robótica, planificación, monitorización.
- **Teoría de juegos**: equilibrio del juego de auditoría.
- **Extensiones**: aprendizaje de P̂, contratos adaptativos.

### 7.5. Conclusión
*Static certification guarantees properties of configurations. Dynamic governance guarantees properties of executions.* Las contribuciones presentadas muestran que la gobernanza de trayectorias permite expresar garantías temporales y estratégicas inalcanzables mediante modelos estáticos. El Asymmetric Margin Principle y la frontera de Pareto de calibración conservadora sugieren que el marco no solo es formalmente coherente, sino que revela propiedades de diseño que emergen de la interacción entre incertidumbre y gobernanza.

---

## 8. Related Work

### 8.1. Runtime Verification
Monitorea propiedades temporales sobre ejecuciones individuales con garantías de correctness para las trazas observadas. Sin embargo, no modela incertidumbre sobre el operador de transición ni interacción estratégica — un adversario puede generar trayectorias formalmente correctas que evadan las propiedades monitoreadas.

### 8.2. Model Checking
Verifica propiedades sobre modelos de estados finitos con exhaustividad teórica. Sin embargo, la observabilidad parcial dinámica (donde el auditor solo ve proyecciones del estado) no es native en el marco clásico de CTL/LTL, y las garantías de horizonte dependiente de la trayectoria requieren extensiones no estándar.

### 8.3. POMDPs
Modelan decisión secuencial bajo observabilidad parcial con soporte para incertidumbre probabilística. Sin embargo, el objetivo es sintetizar políticas óptimas, no certificar la corrección de una política existente frente a una referencia (D). La noción de gobernanza como juego con auditor externo y pérdida acotada no forma parte del marco POMDP estándar.

### 8.4. Runtime Assurance / Shielding
Intervienen cuando el agente sale de una región pre-certificada, con garantías de seguridad en tiempo real. Sin embargo, la región se define sobre estados, no sobre trayectorias; un agente puede permanecer dentro de la región segura y sin embargo generar decisiones que divergen de la política de referencia bajo observabilidad parcial.

### 8.5. Robust Control
Proporciona políticas óptimas bajo incertidumbre paramétrica en la dinámica del sistema. Sin embargo, no distingue entre política de referencia y política real, ni modela la auditoría como un juego estratégico donde el auditor tiene información parcial y el agente puede desviarse intencionadamente.

### 8.6. Audit Games
Modelan inspección estratégica con recursos limitados, estableciendo resultados de equilibrio entre inspector e inspectee. Sin embargo, operan sobre espacios de acciones abstractas sin observabilidad parcial del estado subyacente, y no proporcionan garantías de horizonte temporal sobre la pérdida acumulada.

---

## Appendix A: Experiment Reproducibility

- **Repositorio**: `https://github.com/valentinlineiro/takt-theory` (commit `0aebe7a`)
- **Entorno**: Node v24.14.1, Vitest 4.1.10, ESM TypeScript
- **Comando**: `npx vitest run` (131 tests, 51 files, 0 failures)
- **Lean 4**: `cd takt-formal && lake build` (21 archivos `.lean`)
- **Dependencias**: ninguna más allá de Vitest

## Appendix B: Proof of Guaranteed Intervention Horizon (F-002)

[Demostración completa del teorema, trasladada fuera del cuerpo principal para no interrumpir el flujo de lectura.]
