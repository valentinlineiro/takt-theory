# Análisis de Existencia (Fase IV — Etapa 2) — Versión 2

> **Estado:** Borrador de Trabajo / Análisis Axiomático
> **Objetivo:** Analizar los axiomas candidatos para aislar el **axioma mínimo de existencia** y proponer la ruta de formalización estructurada en Lean 4.

---

## 1. Tabla Comparativa de Axiomas Candidatos

Para identificar la hipótesis más débil que elimine las obstrucciones de los tres contraejemplos, evaluamos la potencia lógica y las limitaciones de cada propiedad candidata:

| Propiedad | Resuelve qué | Demasiado fuerte / Limitación | Rol Lógico en la Teoría |
| :--- | :--- | :--- | :--- |
| **C0 (Order-Compatible Cost)** | La coincidencia del óptimo con la suficiencia ($R^* = R_{\min}$). | **Sí.** Excluye todo el Régimen II (compromiso y optimalidad robusta), que es el verdadero núcleo científico de la Fase IV. | Hipótesis de régimen (delimita el Régimen I). No es una propiedad del coste general. |
| **Meet Completeness en $L$** | Garantiza la existencia abstracta de ínfimos en el poset de costes. | **Insuficiente.** No garantiza que el ínfimo sea alcanzado por ninguna representación (Contraejemplo 1). | Propiedad estructural deseable para $(L, \sqsubseteq_L)$. |
| **Infimum Attainment en $L$** | Evita que los costes diverjan en el codominio hacia un límite no contenido en $L$. | **Insuficiente.** Resuelve el codominio, pero ignora si el dominio $\mathcal{R}_{\text{sufficient}}$ es capaz de alcanzar dicho coste (Contraejemplo 2). | Requisito de alcanzabilidad en el espacio de costes. |
| **DCC (Condición de Cadena Descendente)** | Evita secuencias infinitas de representaciones con coste estrictamente decreciente. | **Sí.** Es extremadamente restrictivo; excluye la gran mayoría de los espacios continuos o densos de interés práctico. | Mecanismo suficiente de finitud, no un axioma base. |
| **Compacidad / Cierre Topológico** | Garantiza el cierre del dominio de representaciones bajo secuencias de límites. | **Sí.** Requiere estructurar y dotar de topología (ej. Scott) al poset de representaciones antes de poder formular optimización. | Herramienta matemática avanzada para dominios continuos. |
| **Realizable Cost Attainment (A0-IV)** | Garantiza que el subconjunto de costes alcanzados por representaciones suficientes tiene un elemento mínimo. | **No.** Es la caracterización directa de la solubilidad del problema de optimización sin restringir la topología de $\mathcal{R}$ o $L$. | **Candidato a Axioma Mínimo (A0-IV).** |

---

## 2. El Candidato Mínimo: Hipótesis de Alcanzabilidad del Coste Realizable (A0-IV)

En lugar de imponer condiciones restrictivas sobre el codominio completo $(L, \sqsubseteq_L)$ o sobre el dominio infinito $(\mathcal{R}, \sqsubseteq)$, enfocamos la atención sobre la interacción de ambos: **el coste realizable**.

Definimos el conjunto de costes realizables sobre representaciones suficientes como:

$$
c(\mathcal{R}_{\text{sufficient}}(D)) = \{ c(R) \in L : R \in \mathcal{R}_{\text{sufficient}}(D) \}
$$

**Hypothesis A0-IV (Realizable Cost Attainment).** El conjunto de costes realizables $c(\mathcal{R}_{\text{sufficient}}(D))$ admite al menos un elemento mínimo en $(L, \sqsubseteq_L)$. Es decir:

$$
\exists l^* \in c(\mathcal{R}_{\text{sufficient}}(D)) \quad \text{tal que} \quad \forall l \in c(\mathcal{R}_{\text{sufficient}}(D)), \quad l^* \sqsubseteq_L l
$$

### Justificación de Minimalidad

*   **Evita Noetherianidad:** No requiere que la estructura de representaciones sea finita ni que cumpla DCC (DCC es un caso particular que implica A0-IV, pero no al revés).
*   **Independiente de la Completitud de L:** No exige que todo subconjunto de $L$ tenga ínfimo, solo que la imagen concreta de las representaciones suficientes esté acotada inferiormente y alcance su frontera.
*   **Verdadera Obstrucción:** Si la Hipótesis A0-IV es falsa, el problema de optimización está inherentemente mal definido (es el caso de los contraejemplos 1, 2 y 3). Si es verdadera, la existencia de $R^*$ está garantizada de forma inmediata por definición de la preimagen de $l^*$.

---

## 3. Orden de Implementación Lean 4 Recomendado

De acuerdo con el principio de axiomatización reactiva, estructuramos la formalización en Lean en cuatro módulos progresivos, aislando la complejidad y posponiendo el problema de existencia general.

```
takt-formal/TaktFormal/
│
├── Order.lean            # Definición de órdenes: kernel-refinamiento (⊑) y coste (⊑_L)
├── Cost.lean             # Definición de la firma c: R -> L y propiedades C0 / C0'
├── Coincidence.lean      # Demostración del Teorema de Coincidencia (R_min = R*) bajo C0
└── Existence.lean        # Definición del problema abierto de existencia (con A0-IV como hipótesis opcional)
```

### 3.1 `Order.lean`
Formaliza la semántica y orientación de los posets:
*   Refinamiento en términos de kernels: $R_1 \sqsubseteq R_2$ como `kernelSubset R2 R1`.
*   Propiedades básicas de poset para $(\mathcal{R}, \sqsubseteq)$ y $(L, \sqsubseteq_L)$.

### 3.2 `Cost.lean`
Formaliza la firma de la función de coste y las hipótesis de régimen:
*   `def C0 (c : (S → Z) → L) := ∀ R1 R2, R1 sqsubseteq R2 → c R1 sqsubseteq_L c R2`

### 3.3 `Coincidence.lean`
Formaliza y demuestra mecánicamente el teorema fundacional de la coincidencia:
*   `theorem Rmin_is_optimal (hC0 : C0 c) : c R_min sqsubseteq_L c R`

### 3.4 `Existence.lean`
Trata la existencia de la representación óptima:
*   Define la proposición `Optimal R^* := ∀ R', c R^* sqsubseteq_L c R'`.
*   Mantiene la existencia general como un problema abierto, o formulado condicionalmente bajo la hipótesis `RealizableCostAttainment`.
