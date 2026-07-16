# D-003: Dynamic Safety Contracts

## Contexto y Motivación

Los stress-tests de la Fase C revelaron que las garantías estáticas de TAKT pueden degradarse debido a cambios externos en otros agentes ([ST-005](file:///home/valentin/code/takt-theory/experiments/ST-005/conclusion.md)) y a la acumulación de derivas temporales silenciosas ([ST-006](file:///home/valentin/code/takt-theory/experiments/ST-006/conclusion.md)). Para gobernar estos sistemas de manera segura a lo largo del tiempo, la teoría necesita pasar de ser un marco de análisis estático a ser un **protocolo operativo de gobernanza dinámica**.

El hito **D-003** unifica el margen decisional ($M(R)$), la cobertura de fibras ($C(T, S)$), la composición de políticas y la estabilidad temporal en un único constructo matemático: el **Contrato Dinámico de Seguridad**.

---

## Estructura del Contrato de Seguridad ($\mathcal{C}$)

Un contrato de seguridad decisional $\mathcal{C}$ es una tupla:
\[
\mathcal{C} = (R, D, \pi, T, d, m_{\text{min}})
\]
donde:
* $R : S \to Z$ es la representación.
* $D : S \to A$ es el operador de decisión ideal.
* $\pi : Z \to A$ es la política de acción ejecutada por el agente.
* $T : S \to \text{Prop}$ es el conjunto de test (observable).
* $d : S \to S \to \mathbb{N}$ es la métrica del espacio de estados.
* $m_{\text{min}} > 0$ es el umbral de margen mínimo tolerado.

---

## Condiciones de Satisfacción del Contrato

Decimos que el contrato está **satisfecho** (activo) si y solo si se cumplen las siguientes cuatro condiciones simultáneamente:

1. **Seguridad Empírica:** La representación es segura sobre el conjunto de test: $\text{safe}_T(R, D)$.
2. **Suficiencia de Cobertura:** El conjunto de test cubre todas las combinaciones de la fibra decisional: $C(T, S)$.
3. **Suficiencia de Margen:** El margen decisional global es mayor o igual al umbral mínimo tolerado: $M(R) \ge m_{\text{min}}$.
4. **Alineación de la Política:** La política del agente coincide con las decisiones ideales sobre el conjunto de test: $\forall x \in T, \quad \pi(R(x)) = D(x)$.

---

## Teorema de Garantía del Contrato Dinámico

El teorema fundamental del contrato dinámico demuestra que la satisfacción del contrato local/empírico es suficiente para blindar la seguridad y el comportamiento del sistema global.

**Teorema de Garantía:**
Si el contrato $\mathcal{C}$ está satisfecho, entonces:
1. **Seguridad Decisional Global:** La representación es globalmente segura:
   \[
   \ker(R) \subseteq \ker(D)
   \]
2. **Alineación Global de la Política:** El comportamiento del agente coincide con el óptimo global en todo el dominio $S$:
   \[
   \forall x \in S, \quad D(x) = \pi(R(x))
   \]

### Demostración Formal (esquema):
1. Dado que el contrato está satisfecho, tenemos $\text{safe}_T(R, D)$ y $C(T, S)$. Por el *Teorema Fundamental de Generalización* (D-002), se garantiza la seguridad global: $\ker(R) \subseteq \ker(D)$.
2. Para cualquier estado $x \in S$:
   - Por la cobertura de fibras $C(T, S)$, existe un representante $x' \in T$ tal que $R(x) = R(x')$ y $D(x) = D(x')$.
   - Por la condición de alineación de política del contrato, tenemos $\pi(R(x')) = D(x')$.
   - Sustituyendo las igualdades obtenemos: $D(x) = D(x') = \pi(R(x')) = \pi(R(x))$.
   - Por lo tanto, la política está perfectamente alineada en todo $S$.

---

## Verificación Formal en Lean 4

La definición del contrato, el teorema de garantía y la validación ante derivas temporales se han formalizado y verificado en [DynamicSafetyContract.lean](file:///home/valentin/code/takt-theory/docs/research/D-003/implementation/DynamicSafetyContract.lean).

Los resultados confirman el comportamiento dinámico del protocolo:

* **Teorema General:** El teorema `contract_guarantees_safety` demuestra matemáticamente el blindaje de seguridad y la alineación global de la política a partir de las condiciones locales del contrato.
* **Validación de $R_0$ (Nominal Seguro):**
  - La representación inicial $R_0$ con margen $M(R_0) = 2$ satisface todas las condiciones del contrato.
  - El teorema `c0_contract_satisfied` demuestra formalmente que el contrato está activo.
* **Validación de $R_3$ (Deriva Crítica):**
  - Bajo la deriva temporal acumulada de ST-006, la representación final $R_3$ tiene margen $M(R_3) = 0$.
  - Como el margen mínimo requerido era $m_{\text{min}} = 2$, el contrato detecta la violación instantáneamente.
  - El teorema `c3_contract_violated` demuestra formalmente que el contrato se inactiva, alertando al sistema de la pérdida de seguridad decisional.

---

## Síntesis y Conclusión de la Fase D

El hito D-003 cierra la **Fase D (Consolidación)** unificando todas las invariantes y lecciones aprendidas en un único marco coherente de gobernanza dinámica:

```
    ST-002/005 (Alineación) ───┐
                               │
    ST-006/D-001 (Margen) ─────┼──> [Contrato Dinámico D-003] ──> Seguridad Global Blindada
                               │
    ST-004/D-002 (Cobertura) ──┘
```

Con esta síntesis, TAKT deja de ser una teoría descriptiva de representaciones seguras y se convierte en una **herramienta prescriptiva para diseñar y mantener sistemas de inteligencia artificial y control decisionalmente seguros**.
