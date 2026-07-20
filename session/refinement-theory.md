# Teoría de Preservación Estructural

**Núcleo.** Cuatro conceptos: morfismo, estructura, preservación, refinamiento.
La preservación $S_\mathcal{C} \preceq S_\Phi$ es la relación fundamental,
parametrizada por el tipo de estructura. F, G2 y G3 son tres instancias.

---

## 1. Morfismo y estructura inducida

Un **morfismo** $\mathcal{C}: X \to Y$, junto con una estructura $S_Y$
elegida sobre $Y$, induce una estructura $S_\mathcal{C}$ sobre $X$ por
**pullback**:

$$
S_\mathcal{C}(x_1, x_2) \;\coloneqq\; S_Y(\mathcal{C}(x_1), \mathcal{C}(x_2))
$$

Las fibras $\mathcal{C}^{-1}(y) \subseteq X$ son las clases de la
equivalencia $x \sim_\mathcal{C} x' \iff \mathcal{C}(x) = \mathcal{C}(x')$,
independientemente de la estructura elegida.

Una **contracción** es un morfismo no inyectivo (fibras con más de un
elemento). La teoría funciona para todo morfismo; las contracciones son
el caso interesante.

---

## 2. Preservación

Una propiedad $\Phi: X \to Z$, con una estructura $S_Z$ sobre $Z$, induce
$S_\Phi$ sobre $X$ por el mismo mecanismo de pullback.

La **preservación** es una relación $S_\mathcal{C} \preceq S_\Phi$ entre
estructuras, donde $\preceq$ depende del tipo:

| Tipo de estructura | $S_\mathcal{C}$ | $S_\Phi$ | $S_\mathcal{C} \preceq S_\Phi$ significa |
|-------------------|-----------------|----------|----------------------------------------|
| Equivalencia | $\sim_\mathcal{C}$ | $\sim_\Phi$ | $\sim_\mathcal{C} \subseteq \sim_\Phi$ |
| Pseudométrica | $d_\mathcal{C}$ | $d_\Phi$ | $d_\Phi \leq k \cdot d_\mathcal{C}$ |
| Preorden | $\preceq_\mathcal{C}$ | $\preceq_\Phi$ | $x \preceq_\mathcal{C} y \implies x \preceq_\Phi y$ |
| Topología | $\tau_\mathcal{C}$ | $\tau_\Phi$ | $\tau_\mathcal{C}$ refina $\tau_\Phi$ |
| Divergencia | $D_\mathcal{C}$ | $D_\Phi$ | $D_\Phi \leq k \cdot D_\mathcal{C}$ |

El núcleo de la teoría no depende del tipo concreto: la relación $\preceq$
es el parámetro que distingue cada instancia.

---

## 3. Principio de factorización

Para todo morfismo $\mathcal{C}: X \to Y$ y cualesquiera $x_1, x_2$ con
$\mathcal{C}(x_1) = \mathcal{C}(x_2)$, toda estructura $S_Y$ sobre el
codominio induce

$$
S_\mathcal{C}(x_1, x_2) = S_Y(y, y)
$$

Para equivalencias, métricas, divergencias y órdenes:
$S_Y(y, y) = \text{elemento neutro}$ (identidad, $0$, $\leq$ reflexivo).

La fibra $\mathcal{C}^{-1}(y)$ es un **límite absoluto** para toda
estructura $S_Y$: ninguna elección de $S_Y$ puede distinguir elementos
en la misma fibra.

---

## 4. Refinamiento

Un **refinamiento** de $\mathcal{C}: X \to Y$ es $(\mathcal{C}', \phi)$
con $\mathcal{C}': X \to Y'$ y $\phi: Y' \to Y$ tales que:

$$
\mathcal{C} = \phi \circ \mathcal{C}'
$$

De la factorización: $\sim_{\mathcal{C}'} \subseteq \sim_{\mathcal{C}}$
(el refinamiento hereda las distinciones de $\mathcal{C}$ y puede añadir
otras). Para cualquier estructura $S_{Y'}$ sobre $Y'$, la inducida
$S_{\mathcal{C}'}$ es al menos tan fina como el pullback de $S_Y$ a
través de $\phi$.

---

## 5. Teorema de caracterización

**Teorema (general).** Sea $\mathcal{C}: X \to Y$, $\mathcal{C}'$ un
refinamiento con $\mathcal{C} = \phi \circ \mathcal{C}'$, y $S_Y$, $S_{Y'}$,
$S_Z$ estructuras elegidas. Entonces

$$
S_{\mathcal{C}'} \preceq S_\Phi
$$

si y solo si, para toda fibra $\mathcal{C}^{-1}(y)$, las restricciones
satisfacen $S_{\mathcal{C}'}|_{\mathcal{C}^{-1}(y)} \preceq S_\Phi|_{\mathcal{C}^{-1}(y)}$.

*Demostración.* Para $x_1, x_2$ en distintas fibras de $\mathcal{C}$,
$\mathcal{C}(x_1) \neq \mathcal{C}(x_2)$, luego $\mathcal{C}'(x_1) \neq
\mathcal{C}'(x_2)$ (por la factorización). La preservación se satisface
para pares interfibra en toda estructura razonable (equivalencia trivial,
métrica positiva, orden no trivial). El único trabajo del refinamiento es
dentro de cada fibra. ∎

**Corolario (fibra como unidad de refinamiento).** No es necesario refinar
fibras $\Phi$-homogéneas. El refinamiento actúa exclusivamente sobre las
fibras que mezclan valores de $\Phi$.

---

## 6. Aplicaciones

F, G2 y G3 son tres elecciones distintas de $(\text{estructura}, \preceq)$:

| Fase | Morfismo $\mathcal{C}$ | $\Phi$ | Estructura $S$ | $S_\mathcal{C} \preceq S_\Phi$ | Si falla |
|------|----------------------|--------|---------------|-------------------------------|----------|
| **F** | $R: S \to Z$ | $D: S \to \{\text{dec}\}$ | Equivalencia | $\sim_R \subseteq \sim_D$ | Refinar $R$ |
| **G2** | $\text{est}: P \to \hat{P}$ | $M_D(P) - \beta$ | Pseudométrica | $d_{\text{est}} < \beta$ | Reducir error |
| **G3** | $F_\Gamma: \Pi \to \mathcal{D}(Y)$ | $V: \Pi \to \{\text{val}\}$ | Equivalencia | $\sim_\Gamma \subseteq \sim_V$ | Refinar $\Gamma$ |

### HAA-001 (dentro de G3)

- $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros.
- Fibra $F_\Gamma^{-1}(\delta_{\text{idle}})$ contiene $\pi_{\text{safe}}$ y
  $\pi_{\text{attack}}$.
- Refinamiento observacional: $F_{\Gamma'}(\pi) = (F_\Gamma(\pi), a_t)$.
  Verifica $F_\Gamma = \phi \circ F_{\Gamma'}$, $\sim_{\Gamma'} \subseteq \sim_V$.

---

## 7. La teoría en cuatro líneas

$$
\begin{aligned}
&\text{Morfismo } \mathcal{C}: X \to Y \text{ con estructura } S_Y
\;\rightsquigarrow\; S_\mathcal{C} \text{ sobre } X. \\
&\text{Propiedad } \Phi \text{ con estructura } S_Z
\;\rightsquigarrow\; S_\Phi \text{ sobre } X. \\
&\text{Preservación: } S_\mathcal{C} \preceq S_\Phi
\text{ (relación que depende del tipo de estructura)}. \\
&\text{Si falla: refinar } \mathcal{C} \text{ a } \mathcal{C}'
\text{ (actúa dentro de las fibras)}.
\end{aligned}
$$

F, G2 y G3 son tres instancias de este esquema, que difieren únicamente
en la elección de $(S_Y, \preceq)$.
