# Spec: Volume II — Cost Quotient Space & Geometry of Cost Morphisms

**Fecha:** 2026-07-22
**Autor:** Antigravity AI
**Estado:** Propuesta de Diseño Científico / Especificación de Volumen II

---

## 1. Introducción y la Simetría del Cociente

La madurez de TAKT se consolida al aplicar el mismo patrón metodológico sobre las funciones de coste que el que funcionó para las representaciones en ST-015. 

*   En **Volumen I**, pasamos de representaciones extensionales $R$ a clases de equivalencia de información modulo kernel: $\mathcal{R}/\sim_{\ker}$.
*   En **Volumen II**, pasamos de funciones de coste individuales $c$ a clases de equivalencia de preferencia: $\mathcal{C}/\equiv$.

La pregunta fundacional de esta nueva línea de investigación es:

> **¿Cómo estructurar y simplificar el espacio de funciones de coste estudiando las clases de equivalencia que inducen los mismos óptimos representacionales?**

---

## 2. Definición de la Equivalencia de Costes ($\equiv$)

Sean $c_1, c_2 : \mathcal{R}_{\text{sufficient}}(D) \to L$ dos funciones de coste. Definimos la relación de equivalencia de costes $\equiv$ bajo una decisión $D$ como:

$$
c_1 \equiv c_2 \iff \arg\min_{R \in \mathcal{R}_{\text{sufficient}}(D)} c_1(R) = \arg\min_{R \in \mathcal{R}_{\text{sufficient}}(D)} c_2(R)
$$

### 2.1 Semántica e Implicaciones

*   **Indistinguibilidad Decisional:** Dos costes $c_1 \equiv c_2$ son indistinguibles para el tomador de decisiones; ambos fuerzan la selección de las mismas representaciones óptimas.
*   **Clase de Equivalencia $[c]$:** Representa el conjunto de todas las valoraciones que colapsan en el mismo subconjunto de representaciones preferidas.
*   **Mapeo a Particiones:** Cada clase $[c]$ se asocia de forma unívoca con un conjunto de representaciones realizables como óptimas: $S_c \subseteq \mathcal{R}_{\text{sufficient}}(D)$.

---

## 3. Estructura Matemática de $\mathcal{C}/\equiv$

### 3.1 El Subespacio de Representaciones Realizables como Óptimas ($\mathcal{R}^*$)

Definimos el conjunto de representaciones que son óptimas bajo al menos un coste no trivial como:

$$
\mathcal{R}^*_{\text{realizable}}(D) = \{ R \in \mathcal{R}_{\text{sufficient}}(D) : \exists c \in \mathcal{C}, \quad R \in \arg\min c \}
$$

Estudiar el cociente $\mathcal{C}/\equiv$ es algebraicamente equivalente a estudiar la estructura y restricciones de $\mathcal{R}^*_{\text{realizable}}(D)$ dentro del retículo general de particiones.

### 3.2 Clasificación de Regímenes de Coste en el Cociente

La clasificación de morfismos de coste se simplifica en el cociente:

*   **Clase Cociente del Régimen I ($[c_{\text{mono}}]$):**
    La clase de equivalencia que contiene a todos los costes compatibles con C0. Su óptimo es unívoco (salvo $\sim_{\ker}$) e igual a $R_{\min}$. Esta clase actúa como el elemento neutro o sumidero informacional en el cociente.
*   **Clases del Régimen II ($[c_{\text{tradeoff}}]$):**
    Clases de equivalencia cuyos óptimos son estrictamente más finos que $R_{\min}$ ($R_{\min} \sqsubset R^*$).

---

## 4. Hoja de Ruta Científica: Volumen II

Establecemos el programa de investigación estructurado en torno a la geometría de costes:

```
                  Foundations (Volumen I)
                            │
                            ▼
          ST-020: Cost Quotient Space (C/≡)
                            │
                            ▼
           ST-021: Local Distortion Field
                            │
                            ▼
         ST-022: Bounded Stability Regions
                            │
                            ▼
             Algorithmic & Info Consequences
```

1.  **ST-020 — Cost Quotient Space:** Formalización de la equivalencia $\equiv$ y caracterización del espacio cociente $\mathcal{C}/\equiv$.
2.  **ST-021 — Local Distortion Field:** Definición del campo $\Delta_c([R])$ sobre el retículo para mapear singularidades y zonas estables de decisión.
3.  **ST-022 — Stability Regions:** Teoremas que acotan la variabilidad del óptimo en subconjuntos del retículo de representaciones.
4.  **Algorithmic and Information Theory Consequences:** Mapeo de la complejidad y conexiones con métricas informacionales ( Shannon, rough sets).
