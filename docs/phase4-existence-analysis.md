# Análisis de Existencia (Fase IV — Etapa 2)

> **Estado:** Borrador de Trabajo / Análisis Matemático Preliminar
> **Objetivo:** Aislar la estructura matemática mínima y las obstrucciones lógicas para la existencia de la representación óptima antes de iniciar la formalización en Lean.

---

## 1. Definiciones y Semántica de los Órdenes

Para evitar cualquier ambigüedad en el sentido de los órdenes (como las que surgieron inicialmente en ST-015), fijamos la semántica y orientación de las dos estructuras ordenadas bajo estudio.

### 1.1 Orden de Refinamiento de Representaciones

Sea $\mathcal{R}$ el espacio de representaciones sobre el estado $S$. Definimos la relación de orden de refinamiento $\sqsubseteq$ como:

$$
R_1 \sqsubseteq R_2 \iff \ker(R_2) \subseteq \ker(R_1)
$$

*   **Semántica:** $R_1 \sqsubseteq R_2$ significa que $R_2$ es **más fina** (o al menos tan fina) como $R_1$. Es decir, $R_2$ distingue al menos las mismas particiones del estado que $R_1$.
*   **Elemento Mínimo de Suficiencia:** Por el teorema $T2$ de ST-015, el conjunto de representaciones suficientes $\mathcal{R}_{\text{sufficient}}(D)$ es un upset en $(\mathcal{R}, \sqsubseteq)$ con un elemento mínimo único $R_{\min} = S/K_D$. Por lo tanto:
    
    $$
    \forall R \in \mathcal{R}_{\text{sufficient}}(D), \quad R_{\min} \sqsubseteq R
    $$
    
    (Cualquier representación suficiente es al menos tan fina como la representación mínima suficiente $R_{\min}$).

### 1.2 Orden de Costes

Sea $(L, \sqsubseteq_L)$ el poset de costes. Definimos la relación de orden $\sqsubseteq_L$ como:

$$
a \sqsubseteq_L b \iff \text{"}a\text{ es menor o igual coste que }b\text{"}
$$

*   **Semántica:** Queremos minimizar el coste, por lo que buscamos elementos que sean minimales en el orden $\sqsubseteq_L$.
*   **Abstracción:** No asumimos aún que $L = \mathbb{R}_{\geq 0}$ ni que $L$ sea un retículo completo; solo que es un poset.

### 1.3 Representación Óptima

**Definition 1.1 (Representación Óptima).** Sea $R^* \in \mathcal{R}_{\text{sufficient}}(D)$. Diremos que $R^*$ es óptima si:

$$
\forall R' \in \mathcal{R}_{\text{sufficient}}(D), \quad c(R^*) \sqsubseteq_L c(R')
$$

*No se asume la existencia ni la unicidad de dicha representación.*

---

## 2. Teorema de Coincidencia bajo C0

Antes de abordar el problema general de existencia, validamos la consistencia de nuestras orientaciones de orden mediante un teorema base en el Régimen I.

### 2.1 Enunciado

**Theorem 2.1 (Coincidencia bajo C0).** Sean las siguientes hipótesis de trabajo:
1.  **Frontera de ST-015:** Existe $R_{\min} \in \mathcal{R}_{\text{sufficient}}(D)$ tal que $\forall R \in \mathcal{R}_{\text{sufficient}}(D), R_{\min} \sqsubseteq R$.
2.  **Hipótesis de Coste Compatible con el Orden (C0):** La función de coste $c: \mathcal{R}_{\text{sufficient}}(D) \to L$ es monótona respecto al refinamiento:
    
    $$
    R_1 \sqsubseteq R_2 \implies c(R_1) \sqsubseteq_L c(R_2)
    $$

Entonces, la representación mínima suficiente $R_{\min}$ es una representación óptima:

$$
R_{\min} \in \arg\min_{R \in \mathcal{R}_{\text{sufficient}}(D)} c(R)
$$

### 2.2 Demostración

Sea $R$ cualquier representación en $\mathcal{R}_{\text{sufficient}}(D)$.
1.  Por la Hipótesis 1 (ST-015), sabemos que $R_{\min}$ es el elemento mínimo de las suficientes:
    
    $$
    R_{\min} \sqsubseteq R
    </td>
    $$
    
2.  Aplicando la Hipótesis 2 (Monotonía C0):
    
    $$
    R_{\min} \sqsubseteq R \implies c(R_{\min}) \sqsubseteq_L c(R)
    $$
    
3.  Por definición de representación óptima (Definition 1.1), como $c(R_{\min}) \sqsubseteq_L c(R)$ para todo $R \in \mathcal{R}_{\text{sufficient}}(D)$, concluimos que $R_{\min}$ es un óptimo global. <br>$\blacksquare$

---

## 3. Tres Contraejemplos de Existencia (Obstrucciones Mínimas)

Para descubrir qué axiomas o hipótesis adicionales son necesarios para garantizar la existencia de $R^*$ fuera del colapso del Régimen I, analizamos tres escenarios donde el problema matemático falla.

### 3.1 Contraejemplo 1: Fallo en el Poset de Costes $L$ (No alcanzabilidad del ínfimo)

*   **Construcción:**
    *   Sea el dominio de suficientes finito $\mathcal{R}_{\text{sufficient}}(D) = \{ R_n \}_{n=1}^{\infty}$, donde $R_n \sqsubseteq R_{n+1}$ (representaciones sucesivamente más finas).
    *   Sea el poset de costes $L = (0, 1]$ con el orden real estándar $\leq$ (el cual admite ínfimos en $\mathbb{R}$, pero no en $L$ ya que $0 \notin L$).
    *   Sea la función de coste $c(R_n) = \frac{1}{n+1}$.
*   **Análisis:**
    *   El conjunto de costes de las suficientes es $c(\mathcal{R}_{\text{sufficient}}) = \{ \frac{1}{2}, \frac{1}{3}, \frac{1}{4}, \dots \}$.
    *   El ínfimo matemático de este conjunto es $0$. Sin embargo, $0 \notin L$.
    *   Para cualquier representación $R_n$, siempre existe otra representación $R_{n+1}$ tal que $c(R_{n+1}) < c(R_n)$.
    *   No existe ninguna representación óptima $R^*$ porque el poset de costes no contiene un mínimo para esta secuencia.
*   **Obstrucción:** La falta de completitud o de alcanzabilidad del ínfimo en el poset de costes $L$.

### 3.2 Contraejemplo 2: Fallo en el Dominio $\mathcal{R}_{\text{sufficient}}(D)$ (Cadenas infinitas no acotadas)

*   **Construcción:**
    *   Sea el poset de costes $L = \mathbb{R}_{\geq 0}$ con el orden real estándar $\leq$ (donde el ínfimo $0$ sí pertenece a $L$).
    *   Sea el dominio de suficientes infinito $\mathcal{R}_{\text{sufficient}}(D) = \{ R_n \}_{n=1}^{\infty}$ con $R_{n+1} \sqsubseteq R_n$ (representaciones sucesivamente **más gruesas**, perdiendo información pero manteniéndose suficientes).
    *   Supongamos que $c(R_n) = \frac{1}{n}$.
*   **Análisis:**
    *   A medida que las representaciones se hacen más gruesas, el coste disminuye hacia $0$.
    *   Sin embargo, el límite de la secuencia (la representación que haría $c(R) = 0$) es la representación trivial que colapsa todos los estados en un único elemento.
    *   Esta representación trivial no pertenece a $\mathcal{R}_{\text{sufficient}}(D)$ porque no preserva la decisión $D$ (viola la frontera de ST-015).
    *   Por lo tanto, la secuencia de costes decrece hacia $0$, pero la representación que alcanzaría ese coste mínimo no es suficiente. No existe $R^*$ en el dominio.
*   **Obstrucción:** Falta de compacidad en el dominio $\mathcal{R}_{\text{sufficient}}(D)$ o falta de estabilidad de cadenas descendentes (Noetherianidad).

### 3.3 Contraejemplo 3: Fallo por Incompatibilidad de Orden (Régimen II sin acotación inferior)

*   **Construcción:**
    *   Sea $L = \mathbb{R}_{\geq 0}$.
    *   Sea un dominio infinito de representaciones suficientes $\mathcal{R}_{\text{sufficient}}(D)$ donde no se cumple la hipótesis de compatibilidad C0 (estamos en el Régimen II).
    *   Supongamos que el coste decrece infinitamente a medida que refinamos (por ejemplo, el coste disminuye al añadir distinciones para mitigar un coste extrínseco de colisión), de modo que para una secuencia de refinamientos sucesivos $R_1 \sqsubseteq R_2 \sqsubseteq R_3 \dots$ el coste es $c(R_n) = -n$.
*   **Análisis:**
    *   El coste no está acotado inferiormente en el subconjunto de suficientes.
    *   Siempre es posible encontrar una representación estrictamente más fina con menor coste, sin límite inferior.
*   **Obstrucción:** La falta de acotación inferior del coste en el Régimen II.

---

## 4. Axiomas Candidatos Mínimos

A partir de los contraejemplos, identificamos las hipótesis adicionales bajo análisis para mitigar cada tipo de fallo:

1.  **Alcanzabilidad del Ínfimo en L (Infimum Attainment):**
    Para cualquier subconjunto no vacío de costes $A \subseteq L$, el ínfimo $\bigsqcap_L A$ existe y pertenece a $A$. (Fija el fallo del Contraejemplo 1).
2.  **Condición de Cadena Descendente (DCC) en el Dominio:**
    Toda cadena de representaciones suficientes en $(\mathcal{R}_{\text{sufficient}}, \sqsubseteq)$ que decrezca en coste se estabiliza tras un número finito de pasos. (Fija el fallo del Contraejemplo 2).
3.  **Acotación Inferior en Régimen II:**
    Existe una cota inferior para la función de coste $c$ en el upset de las suficientes, garantizando que el conjunto imagen tiene un ínfimo en $L$.
