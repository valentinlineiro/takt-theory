# Spec: Reducción de Incertidumbre Matemática — Equivalencia y Régimen II (Fase IV)

**Fecha:** 2026-07-21
**Autor:** Antigravity AI
**Estado:** Propuesta de Diseño (Diseño para la Iteración Siguiente)

---

## 1. Objetivos de la Iteración

El objetivo de esta iteración es reducir la incertidumbre matemática en la transición de la optimalidad representacional desde representaciones extensionales hacia clases de equivalencia de núcleos, y diseñar el contraejemplo mínimo para el Régimen II.

Los hitos concretos son:
1.  **Semántica del Cociente:** Definir la relación de equivalencia de núcleos ($\sim_{\ker}$) sobre representaciones y demostrar que el orden de refinamiento ($\sqsubseteq$) está bien definido sobre las clases de equivalencia.
2.  **Unicidad salvo Equivalencia:** Formular y demostrar el teorema de unicidad de la representación óptima $R^*$ modulo $\sim_{\ker}$ bajo estricta monotonía (C0').
3.  **Contraejemplo Mínimo de Régimen II:** Diseñar un modelo con la menor cardinalidad de estados posible ($S$) que demuestre formalmente que $R^* \neq R_{\min}$ cuando se rompe la compatibilidad del coste (no-C0).

---

## 2. Equivalencia de Núcleos y Preservación del Orden

### 2.1 Equivalencia de Núcleos ($\sim_{\ker}$)

Definimos la equivalencia de núcleos como la relación en la que dos representaciones inducen exactamente la misma partición del estado $S$:

$$
R_1 \sim_{\ker} R_2 \iff \ker(R_1) = \ker(R_2)
$$

En términos de `kernelSubset`, esto equivale a la doble contención:

$$
R_1 \sim_{\ker} R_2 \iff \text{kernelSubset } R_1\ R_2 \land \text{kernelSubset } R_2\ R_1
$$

### 2.2 Preservación del Orden (Well-Definedness)

Para poder operar con el poset cociente de representaciones modulo equivalencia, demostramos el lema de preservación:

**Lema 2.1 (Orden bien definido).** Sean $R_1, R'_1, R_2, R'_2$ representaciones tales que:

$$
R_1 \sim_{\ker} R'_1 \quad \text{y} \quad R_2 \sim_{\ker} R'_2
$$

Entonces:

$$
R_1 \sqsubseteq R_2 \iff R'_1 \sqsubseteq R'_2
$$

*Demostración matemática:*
Por hipótesis, tenemos:
1.  $\ker(R_1) = \ker(R'_1)$
2.  $\ker(R_2) = \ker(R'_2)$

Queremos probar que $\ker(R_2) \subseteq \ker(R_1) \iff \ker(R'_2) \subseteq \ker(R'_1)$.
*   $(\Rightarrow)$ Si $\ker(R_2) \subseteq \ker(R_1)$, entonces usando (2) a la izquierda y (1) a la derecha obtenemos $\ker(R'_2) \subseteq \ker(R'_1)$.
*   $(\Leftarrow)$ Si $\ker(R'_2) \subseteq \ker(R'_1)$, usando (2) a la izquierda y (1) a la derecha obtenemos $\ker(R_2) \subseteq \ker(R_1)$. <br>$\blacksquare$

Este lema garantiza que el refinamiento es una relación de orden (antisimétrica) bien definida sobre el conjunto cociente $\mathcal{R}/\sim_{\ker}$.

---

## 3. Unicidad Modulo Equivalencia de Núcleos

Reemplazamos la afirmación de unicidad extensional por unicidad sobre la clase de equivalencia:

**Teorema 3.1 (Unicidad Modulo Equivalencia).** Si la función de coste $c$ es estrictamente monótona respecto al refinamiento estricto (C0') y es invariante bajo equivalencia de núcleos ($R_1 \sim_{\ker} R_2 \implies c(R_1) = c(R_2)$), entonces cualquier representación óptima $R^*$ es equivalente en su núcleo a $R_{\min}$:

$$
R^* \sim_{\ker} R_{\min}
$$

*Demostración matemática:*
Sea $R^*$ una representación óptima suficiente (es decir, $R^* \in \mathcal{R}_{\text{sufficient}}(D)$ y minimiza $c$).
1.  Como $R_{\min}$ es el mínimo de las suficientes (por ST-015), sabemos que $R_{\min} \sqsubseteq R^*$.
2.  Por definición de refinamiento, esto significa que $\ker(R^*) \subseteq \ker(R_{\min})$.
3.  Supongamos por reducción al absurdo que $R^*$ no es equivalente a $R_{\min}$ en su núcleo, es decir, $\ker(R^*) \neq \ker(R_{\min})$.
4.  Entonces, la contención en (2) es estricta: $\ker(R^*) \subset \ker(R_{\min})$. Esto es un refinamiento estricto: $R_{\min} \sqsubset R^*$.
5.  Aplicando la estricta monotonía del coste (C0'):
    
    $$
    R_{\min} \sqsubset R^* \implies c(R_{\min}) \sqsubset_L c(R^*)
    $$
    
6.  Sin embargo, esto contradice la hipótesis de que $R^*$ es óptima (lo que exigiría $c(R^*) \sqsubseteq_L c(R_{\min})$).
7.  Por lo tanto, la suposición de que los núcleos no coinciden es falsa. Concluimos que $\ker(R^*) = \ker(R_{\min})$, es decir, $R^* \sim_{\ker} R_{\min}$. <br>$\blacksquare$

---

## 4. Diseño del Contraejemplo Mínimo de Régimen II

Para demostrar que la coincidencia se rompe fuera de C0, diseñamos el modelo de menor cardinalidad posible.

### 4.1 Cardinalidad de Estados Mínima ($|S|$)

*   **¿Es posible $|S| = 2$?**
    Si $S = \{a, b\}$, las únicas relaciones de equivalencia en $S$ son la identidad (2 clases) y la relación trivial (1 clase).
    Si la decisión $D$ es constante, $R_{\min}$ es la relación trivial (coste mínimo). Si $D$ no es constante, la única representación suficiente es la identidad. En ambos casos, el upset $\mathcal{R}_{\text{sufficient}}(D)$ es un singleton o tiene a la representación trivial como mínimo. No hay margen algebraico para tener dos representaciones suficientes distintas donde una sea estrictamente más fina que la otra pero ambas sean suficientes.
    Por lo tanto, la divergencia requiere al menos **3 estados**.

### 4.2 Modelo de 3 Estados ($S = \{a, b, c\}$)

*   **Estados:** $S = \{a, b, c\}$.
*   **Decisión:** $D : S \to \text{Bool}$ donde:
    
    $$
    D(a) = \text{true}, \quad D(b) = \text{true}, \quad D(c) = \text{false}
    $$
    
*   **Capacidades y Frontera de Suficiencia ($K_D$):**
    Para preservar la decisión, no podemos fusionar estados con distintas decisiones. Por lo tanto, el núcleo mínimo suficiente es:
    
    $$
    K_D = \{ (a,a), (b,b), (c,c), (a,b), (b,a) \}
    $$
    
    Esto nos da las dos únicas particiones suficientes del estado:
    1.  **Representación Mínima Suficiente ($R_{\min}$):** Fusiona $a$ y $b$. Partición: $\{\{a, b\}, \{c\}\}$.
    2.  **Representación Identidad ($R_{\text{id}}$):** No fusiona nada. Partición: $\{\{a\}, \{b\}, \{c\}\}$.
    *Relación de refinamiento:* $R_{\min} \sqsubset R_{\text{id}}$ ($R_{\text{id}}$ es estrictamente más fina).

*   **Función de Coste Aditiva (Incompatible con C0):**
    Definimos el coste como $c(R) = c_{\text{storage}}(R) + c_{\text{collision}}(R)$, donde:
    *   $c_{\text{storage}}(R_{\min}) = 1$, $c_{\text{storage}}(R_{\text{id}}) = 2$ (monótono con el refinamiento).
    *   $c_{\text{collision}}(R_{\min}) = 5$, $c_{\text{collision}}(R_{\text{id}}) = 0$ (no monótono, penaliza la fusión agresiva de $a$ y $b$).
    *   *Costes totales:*
        
        $$
        c(R_{\min}) = 1 + 5 = 6
        $$
        
        $$
        c(R_{\text{id}}) = 2 + 0 = 2
        $$
        
*   **Resultado del Contraejemplo:**
    Ambas son representaciones suficientes, pero:
    
    $$
    c(R_{\text{id}}) \sqsubset_L c(R_{\min})
    $$
    
    A pesar de que $R_{\min} \sqsubset R_{\text{id}}$, la representación más fina $R_{\text{id}}$ tiene menor coste que la mínima suficiente $R_{\min}$. Esto demuestra formalmente que $R^* \neq R_{\min}$ en el Régimen II.
