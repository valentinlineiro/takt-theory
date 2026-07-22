# Spec: Fase V — Classification of Cost Morphisms & Stability Theory

**Fecha:** 2026-07-22
**Autor:** Antigravity AI
**Estado:** Propuesta de Diseño Científico / Especificación de Fase V

---

## 1. Introducción y Pregunta Central

La Fase V de TAKT abandona la perspectiva centrada en la representación individual y se enfoca en el espacio de funcionales de coste:

$$
\mathcal{C} = \{ c : \mathcal{R}_{\text{sufficient}}(D) \to L \}
$$

La pregunta central de esta fase es:

> **¿Qué propiedades algebraicas e informacionales de una función de coste determinan cuantitativa y cualitativamente la relación entre la suficiencia mínima ($R_{\min}$) y el óptimo representacional ($R^*$)?**

Establecemos una hoja de ruta formal que transita de una clasificación discreta a una teoría cuantitativa de la estabilidad frente a perturbaciones del orden.

---

## 2. ST-016: Taxonomía de Morfismos de Coste

Clasificamos el espacio $\mathcal{C}$ mediante una jerarquía de morfismos de coste sobre el poset cociente de representaciones $(\mathcal{R}/\sim_{\ker}, \preceq)$:

1.  **Monotonía (C0):**
    
    $$
    R_1 \sqsubseteq R_2 \implies c(R_1) \sqsubseteq_L c(R_2)
    $$
    
    (El óptimo coincide con $R_{\min}$).
2.  **Monotonía Estricta (C0'):**
    
    $$
    R_1 \sqsubset R_2 \implies c(R_1) \sqsubset_L c(R_2)
    $$
    
    (El óptimo es único modulo $\sim_{\ker}$ e igual a $R_{\min}$).
3.  **Monotonía Local (C0_loc):**
    Monótona respecto a refinamientos inmediatos (cercanos en el retículo de particiones).
4.  **$\epsilon$-Monotonía (C0_eps):**
    El coste puede decrecer al refinar, pero la violación está acotada globalmente por $\epsilon$.
5.  **Antimonotonía:**
    
    $$
    R_1 \sqsubseteq R_2 \implies c(R_2) \sqsubseteq_L c(R_1)
    $$
    
    (La representación óptima es la identidad $R_{\text{id}}$, la más fina posible).

---

## 3. ST-017: Teoría de Estabilidad y Métrica de Distorsión $\Delta(c)$

Para convertir la dicotomía del Régimen I / II en un continuo analítico, introducimos la noción de **distorsión de orden** para posets de coste métricos o valorados (donde $L = \mathbb{R}_{\geq 0}$).

### 3.1 Definición Matemática de Distorsión ($\Delta$)

Definimos la distorsión local de orden de una función de coste $c$ en un par de representaciones ordenadas $R_1 \sqsubseteq R_2$ como el grado en que se viola la monotonicidad C0:

$$
\delta(c)(R_1, R_2) = \max \left( 0, c(R_1) - c(R_2) \right)
$$

Definimos la **distorsión global de orden** $\Delta(c)$ como el supremo de estas violaciones en todo el dominio suficiente:

$$
\Delta(c) := \sup_{R_1 \sqsubseteq R_2} \delta(c)(R_1, R_2)
$$

*   **Propiedad 1:** $\Delta(c) = 0 \iff c \text{ cumple C0}$.
*   **Propiedad 2:** Si $0 < \Delta(c) \leq \epsilon$, estamos ante un escenario de *casi-monotonicidad*.

### 3.2 El Teorema de Estabilidad y Desviación de $R^*$

Bajo una distorsión acotada por $\epsilon$, limitamos la ganancia máxima de coste que puede obtenerse alejándose de $R_{\min}$.

**Theorem 3.1 (Teorema de Estabilidad).** Sea $c$ una función de coste con distorsión global $\Delta(c) \leq \epsilon$. Para cualquier representación óptima $R^*$, se cumple:

$$
c(R^*) \geq c(R_{\min}) - \epsilon
$$

*Demostración matemática:*
1.  Como $R^*$ es una representación suficiente, sabemos por ST-015 que $R_{\min} \sqsubseteq R^*$.
2.  Por definición de distorsión global $\Delta(c)$:
    
    $$
    c(R_{\min}) - c(R^*) \leq \delta(c)(R_{\min}, R^*) \leq \Delta(c) \leq \epsilon
    $$
    
3.  Despejando $c(R^*)$:
    
    $$
    c(R^*) \geq c(R_{\min}) - \epsilon
    $$
    
    $\blacksquare$

*Significado Físico:* Este teorema garantiza que si la distorsión del coste es pequeña, el error cometido al utilizar la representación mínima $R_{\min}$ (suficiencia pura) en lugar del óptimo absoluto $R^*$ está acotado superiormente por $\epsilon$.

---

## 4. ST-018 & ST-019: Clases de Coste Estructuradas y Caracterización

1.  **Submodularidad en Particiones:**
    Si el coste es submodular respecto a la unión/intersección de kernels, el óptimo se puede aproximar localmente.
2.  **Continuidad en DCPOs (Scott-Continuity):**
    Si el dominio es un dcpo, la continuidad garantiza la existencia del mínimo sin requerir Noetherianidad.
3.  **Teorema de Caracterización de Coincidencia Acotada:**
    Formulamos el acoplamiento:
    
    $$
    \Delta(c) < \text{margen}(R_1, R_2) \implies R^* \sim_{\ker} R_{\min}
    $$
    
    (El óptimo colapsa al mínimo incluso con distorsiones no nulas si estas no superan el "gap" de almacenamiento de la partición).

---

## 5. Mapeo de Módulos Lean 4

Diseñamos la infraestructura modular para albergar la Fase V:

```
takt-formal/TaktFormal/
│
├── Cost/
│   ├── Classes.lean             # Taxonomía ST-016 (C0, ε-C0, antimonótonos)
│   ├── Distortion.lean          # Definición de Δ(c) y propiedades de poset métrico
│   └── Submodularity.lean       # Estructuras algebraicas de coste sobre retículos
│
└── Tradeoff/
    ├── Stability.lean           # Teorema de Estabilidad (Theorem 3.1)
    └── Characterization.lean    # Teorema de Clasificación de Coincidencia Acotada
```
