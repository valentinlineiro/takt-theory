# Spec: Volume II — Cost Quotient Space & Geometry of Cost Morphisms

**Fecha:** 2026-07-22
**Autor:** Antigravity AI
**Estado:** Propuesta de Diseño Científico / Especificación de Volumen II (Revisada)

---

## 1. Introducción y el Morfismo Canónico de Decisión

La madurez de TAKT se consolida al aplicar el mismo patrón de morfismo y kernel sobre las funciones de coste que el que funcionó para las representaciones en ST-015:

*   En **Volumen I**, partimos de representaciones $R : S \to Z$ y definimos la equivalencia mediante el kernel de la función: $x \sim_{\ker(R)} y \iff R(x) = R(y)$.
*   En **Volumen II**, partimos de funciones de coste $c$ y definimos sus equivalencias a través de los **kernels de los morfismos fundamentales** sobre el espacio de costes $\mathcal{C}$.

Fijamos el **morfismo canónico de decisión** $\Phi$:

$$
\Phi : \mathcal{C} \to \mathcal{P}(\mathcal{R}_{\text{sufficient}}(D))
$$

$$
\Phi(c) = \arg\min_{R \in \mathcal{R}_{\text{sufficient}}(D)} c(R)
$$

Este morfismo mapea cada coste al subconjunto de representaciones suficientes que minimizan dicho coste.

---

## 2. Jerarquía de Equivalencias (Kernels de Coste)

La geometría de los costes no se describe con un único cociente, sino con una jerarquía de kernels según la finura de información que se desee conservar:

```
               Costs Space (C)
                      │
                      ▼
         Decisional Equivalence (≡_opt)
             [same optimal subset]
                      │
                      ▼
         Structural Equivalence (≡_geom)
            [same ordinal structure]
                      │
                      ▼
         Stability Equivalence (≡_stab)
             [same distortion field]
```

### 2.1 Equivalencia Decisional ($\equiv_{\text{opt}}$)
Definida como el kernel del morfismo canónico $\Phi$:

$$
c_1 \equiv_{\text{opt}} c_2 \iff \Phi(c_1) = \Phi(c_2)
$$

*   Dos costes son equivalentes decisionalmente si inducen exactamente el mismo conjunto de óptimos.

### 2.2 Equivalencia Estructural/Ordinal ($\equiv_{\text{geom}}$)
Definida como la preservación de toda la estructura de orden inducida por la función de coste sobre el retículo de representaciones:

$$
c_1 \equiv_{\text{geom}} c_2 \iff \left( \forall R_i, R_j \in \mathcal{R}_{\text{sufficient}}(D), \quad c_1(R_i) \sqsubseteq_L c_1(R_j) \iff c_2(R_i) \sqsubseteq_L c_2(R_j) \right)
$$

*   Esta equivalencia es estrictamente más fina que $\equiv_{\text{opt}}$. Preserva el "paisaje" completo del coste, lo que es crítico para el diseño de algoritmos de optimización.

### 2.3 Equivalencia de Estabilidad ($\equiv_{\text{stab}}$)
Definida como la coincidencia de los campos de distorsión local:

$$
c_1 \equiv_{\text{stab}} c_2 \iff \Delta_{c_1}(R) = \Delta_{c_2}(R) \quad (\forall R)
$$

*   Dos costes son equivalentes bajo estabilidad si reaccionan de igual manera cuantitativa ante las perturbaciones de la monotonicidad en cada región del retículo.

---

## 3. Hoja de Ruta Científica: Volumen II

Establecemos el programa de investigación estructurado en torno a esta jerarquía de kernels:

1.  **ST-020 — The Fundamental Morphisms of Cost:** Formalización del morfismo canónico $\Phi(c)$ y demostración de las inclusiones de los tres kernels ($\equiv_{\text{stab}} \subseteq\ \equiv_{\text{geom}} \subseteq\ \equiv_{\text{opt}}$).
2.  **ST-021 — Local Distortion Field:** Mapeo de la distorsión como un campo local $\Delta_c([R])$ para identificar singularidades en el retículo.
3.  **ST-022 — Bounded Stability Regions:** Teoremas que acotan la variabilidad de la clase $[R^*]_{\sim_{\ker}}$ bajo perturbaciones del coste.
4.  **Algorithmic and Information Theory Consequences:** Complejidad y computabilidad según el kernel estructural $\equiv_{\text{geom}}$ y submodularidad en particiones.
