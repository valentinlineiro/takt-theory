# Foundations of TAKT (Theory & Formalization)

> **Estado:** Documento de Síntesis / Núcleo Consolidado
> **Descripción:** Unificación de la ontología, hipótesis y teoremas certificados de TAKT (desde el límite representacional hasta la estabilidad cuantitativa).

---

## 1. La Ontología de TAKT

La teoría se organiza en torno a cuatro capas conceptuales disjuntas y acíclicas:

```
Representation (Ontología)
         │
         ▼
Cost (Morfismos)
         │
         ▼
Optimality (Existencia/Unicidad)
         │
         ▼
Tradeoff (Estabilidad)
```

1.  **Capa Ontológica:** Define qué es una representación ($R: S \to Z$), cuándo dos representaciones son equivalentes en información ($\sim_{\ker}$) y cómo se comparan en refinamiento ($\sqsubseteq$).
2.  **Capa de Costes:** Define la valoración del espacio de representaciones en un poset $(L, \sqsubseteq_L)$ y las hipótesis de compatibilidad de la función de coste.
3.  **Capa de Optimación:** Trata la definición, existencia y unicidad de la representación óptima $R^*$.
4.  **Capa de Estabilidad (Trade-off):** Estudia las desviaciones y aproximaciones cuantitativas respecto al óptimo cuando no se cumplen las condiciones ideales.

---

## 2. Definiciones Fundacionales

### 2.1 Refinamiento Representacional ($\sqsubseteq$)
Sean $R_1 : S \to Z_1$ y $R_2 : S \to Z_2$ dos representaciones. Definimos la relación de refinamiento como:

$$
R_1 \sqsubseteq R_2 \iff \ker(R_2) \subseteq \ker(R_1)
$$

*   **Semántica:** $R_2$ es al menos tan fina como $R_1$. Cualquier punto distinguido por $R_1$ es también distinguido por $R_2$. El orden de refinamiento es un preorden sobre el espacio de representaciones $\mathcal{R}$.

### 2.2 Equivalencia de Núcleos ($\sim_{\ker}$)
Dos representaciones $R_1$ y $R_2$ son equivalentes en su núcleo si inducen la misma partición sobre el estado $S$:

$$
R_1 \sim_{\ker} R_2 \iff \ker(R_1) = \ker(R_2)
$$

*   **Orden en el Cociente:** El refinamiento $\sqsubseteq$ es una relación de orden parcial (antisimétrica) bien definida sobre el conjunto cociente de clases de equivalencia de información $\mathcal{R}/\sim_{\ker}$.

### 2.3 Suficiencia Estructural ($\mathcal{R}_{\text{sufficient}}$)
Dada una función de decisión $D : S \to A$, una representación $R$ es suficiente para $D$ si:

$$
R \in \mathcal{R}_{\text{sufficient}}(D) \iff \ker(R) \subseteq \ker(D)
$$

---

## 3. Las Hipótesis de Trabajo y sus Roles Lógicos

Cada hipótesis introducida en TAKT cumple un rol restrictivo o caracterizador, justificado por la minimalidad de sus obstrucciones:

| Hipótesis | Enunciado Formal | Rol Teórico | Obstrucción / Contraejemplo |
| :--- | :--- | :--- | :--- |
| **Axioma 0 (A0)** | $\ker(K_D) \subseteq \ker(D)$ | Garantiza la existencia de la representación mínima suficiente $R_{\min}$. | Sin A0, la decisión no es compatible con la estructura de equivalencia del sistema. |
| **Cost Invariance** | $R_1 \sim_{\ker} R_2 \implies c(R_1) = c(R_2)$ | Independiza el coste de la implementación concreta; el coste evalúa la información representada. | Si falla, el coste discrimina representaciones que inducen la misma partición. |
| **Monotonía (C0)** | $R_1 \sqsubseteq R_2 \implies c(R_1) \sqsubseteq_L c(R_2)$ | Caracteriza el Régimen I de optimalidad (donde optimizar es colapsar). | Si falla, entramos en Régimen II (compromiso activo y trade-offs). |
| **Monotonía Estricta (C0')** | $R_1 \sqsubset R_2 \implies c(R_1) \sqsubset_L c(R_2)$ | Garantiza la unicidad del óptimo (el único óptimo es $R_{\min}$). | Si falla, pueden existir múltiples óptimos de coste idéntico pero diferente núcleo. |
| **Distorsión Acotada ($\Delta(c) \leq \epsilon$)** | $R_1 \sqsubseteq R_2 \implies c(R_1) \leq c(R_2) + \epsilon$ | Mide el apartamiento de C0. Define cuantitativamente la casi-monotonicidad. | Si $\Delta(c) = \infty$, el coste no tiene cota de estabilidad y la desviación de $R_{\min}$ diverge. |
| **Alcanzabilidad (A0-IV)** | $c(\mathcal{R}_{\text{sufficient}}(D))$ tiene mínimo en $L$ | Garantiza la existencia física de la representación óptima $R^*$ en el dominio. | Si falla (Contraejemplos 1 y 2), el óptimo matemático diverge o no pertenece al dominio. |

---

## 4. Teoremas Certificados

El núcleo de TAKT cuenta con las siguientes certificaciones formales completadas en Lean 4:

### 4.1 Teorema de Suficiencia Mínima (ST-015)
Existe una única (salvo $\sim_{\ker}$) representación mínima suficiente $R_{\min} = S/K_D$ tal que:

$$
\forall R \in \mathcal{R}_{\text{sufficient}}(D), \quad R_{\min} \sqsubseteq R
$$

### 4.2 Teorema de Coincidencia (Régimen I)
Bajo la hipótesis de compatibilidad de costes C0, la representación mínima suficiente $R_{\min}$ es un óptimo global:

$$
\forall R \in \mathcal{R}_{\text{sufficient}}(D), \quad c(R_{\min}) \sqsubseteq_L c(R)
$$

### 4.3 Teorema de Unicidad Modulo Equivalencia
Bajo estricta monotonía (C0'), cualquier representación óptima suficiente $R^*$ es equivalente en núcleo a $R_{\min}$:

$$
R^* \sim_{\ker} R_{\min}
$$

### 4.4 Teorema de Estabilidad Cuantitativa
Dada una función de coste $c$ con distorsión global de orden $\Delta(c) \leq \epsilon$, el coste de cualquier representación óptima $R^*$ está acotado por:

$$
c(R_{\min}) \leq c(R^*) + \epsilon
$$

### 4.5 Teorema de Divergencia (Régimen II)
Existe un modelo minimal certificado de 3 estados ($S = \{a, b, c\}$) donde, al no cumplirse C0, la representación mínima suficiente no es óptima:

$$
c(R_{\text{id}}) < c(R_{\min})
$$

---

## 5. El Paisaje Lógico Global

La teoría unificada de TAKT organiza el comportamiento de los sistemas decisionales en función del parámetro de distorsión $\Delta(c)$:

```
           Δ(c) = 0 (Régimen I)
                    │
                    ▼
           R* ~ker R_min (Coincidencia)
                    │
                    ▼
          Optimalidad = Suficiencia
                    │
                    ▼
   0 < Δ(c) <= ε (Casi-Monotonicidad / Clase B)
                    │
                    ▼
      c(R_min) <= c(R*) + ε (Estabilidad)
                    │
                    ▼
           Δ(c) >> 0 (Régimen II Puro)
                    │
                    ▼
           R* ≠ R_min (Trade-offs / Margen)
```
